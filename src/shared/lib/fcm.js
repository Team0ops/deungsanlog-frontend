import { getToken, onMessage } from 'firebase/messaging';
import { messaging } from './firebase';
import { getToken as getAuthToken } from './auth';
import axiosInstance from './axiosInstance';

// 🔑 VAPID 키 (Firebase Console에서 생성한 키)
const VAPID_KEY = 'BI_RoVYOxXxIG4yh0uhQelkbs8j7iqtRL7CE9MxivlQjdJfa-IoZ7TA8qI2gQNum__DAz1q4fg610qBK8MLd78A'; // 실제 키로 교체

/**
* 🔔 FCM 토큰 요청 및 서버 등록
*/
export const requestNotificationPermission = async () => {
 console.log('🔔 알림 권한 요청 시작');

 try {
   // 1. 알림 권한 요청
   const permission = await Notification.requestPermission();
   
   if (permission !== 'granted') {
     console.log('❌ 알림 권한이 거부됨');
     alert('알림을 받으려면 알림 권한을 허용해주세요!');
     return false;
   }

   // 2. Service Worker 등록 확인
   if ('serviceWorker' in navigator) {
     await navigator.serviceWorker.register('/firebase-messaging-sw.js');
     console.log('✅ Service Worker 등록 성공');
   }

   // 3. FCM 토큰 가져오기
   const currentToken = await getToken(messaging, {
     vapidKey: VAPID_KEY
   });

   if (currentToken) {
     console.log('✅ FCM 토큰 획득:', currentToken.substring(0, 20) + '...');
     
     // 4. 서버에 토큰 등록
     await registerTokenToServer(currentToken);
     return true;
   } else {
     console.log('❌ FCM 토큰 획득 실패');
     return false;
   }

 } catch (error) {
   console.error('❌ FCM 초기화 오류:', error);
   return false;
 }
};

/**
* 📡 서버에 FCM 토큰 등록 (수정된 버전)
*/
const registerTokenToServer = async (token) => {
 try {
   const authToken = getAuthToken();
   if (!authToken) {
     console.log('⚠️ 로그인하지 않아서 토큰 등록 스킵');
     // 나중에 로그인 시 등록하도록 localStorage에 저장
     localStorage.setItem('pendingFcmToken', token);
     return;
   }

   console.log('📡 FCM 토큰 등록 요청 시작');
   console.log('📡 요청 URL:', '/notification-service/fcm-token');
   console.log('📡 인증 토큰:', authToken ? authToken.substring(0, 30) + '...' : '없음');
   
   // ✅ 요청 데이터 확인
   const requestData = { token: token };
   console.log('📡 요청 데이터:', requestData);

   // ✅ 직접 fetch 사용해서 디버깅 (axiosInstance 문제 확인용)
   const response = await fetch('http://localhost:8080/notification-service/fcm-token', {
     method: 'POST',
     headers: {
       'Content-Type': 'application/json',
       'X-AUTH-TOKEN': authToken
     },
     body: JSON.stringify(requestData)
   });

   console.log('📡 응답 상태:', response.status);
   
   if (response.ok) {
     const responseData = await response.json();
     console.log('✅ 서버에 FCM 토큰 등록 성공:', responseData);
     
     // 등록 성공 시 임시 토큰 삭제
     localStorage.removeItem('pendingFcmToken');
   } else {
     const errorData = await response.text();
     console.error('❌ fetch 방식 실패, axios 방식으로 재시도:', response.status, errorData);
     
     // ✅ fetch 실패 시 axios 방식으로 백업 시도
     return await registerTokenToServerWithAxios(token);
   }
   
 } catch (error) {
   console.error('❌ fetch 방식 실패:', error);
   
   // ✅ fetch 오류 시 axios 방식으로 백업 시도
   console.log('🔄 axios 방식으로 재시도...');
   return await registerTokenToServerWithAxios(token);
 }
};

/**
* 📡 서버에 FCM 토큰 등록 (axiosInstance 버전 - 백업용)
*/
const registerTokenToServerWithAxios = async (token) => {
 try {
   const authToken = getAuthToken();
   if (!authToken) {
     console.log('⚠️ 로그인하지 않아서 토큰 등록 스킵');
     localStorage.setItem('pendingFcmToken', token);
     return;
   }

   console.log('📡 Axios로 FCM 토큰 등록 시도');
   
   // ✅ axiosInstance 사용 시 명시적으로 헤더 추가
   const response = await axiosInstance.post('/notification-service/fcm-token', 
     { token: token },
     {
       headers: {
         'X-AUTH-TOKEN': authToken,
         'Content-Type': 'application/json'
       }
     }
   );

   console.log('✅ Axios 방식 성공:', response.data);
   localStorage.removeItem('pendingFcmToken');
   
 } catch (error) {
   console.error('❌ Axios 방식도 실패:', error);
   
   if (error.response) {
     console.error('📄 Axios 응답 상태:', error.response.status);
     console.error('📄 Axios 응답 데이터:', error.response.data);
   }
   
   // ✅ 최종 실패
   throw new Error('FCM 토큰 등록 완전 실패: fetch와 axios 모두 실패');
 }
};

/**
* 🎧 포그라운드 메시지 리스너 설정
*/
export const setupForegroundMessageListener = () => {
 onMessage(messaging, (payload) => {
   console.log('📨 포그라운드 메시지 수신:', payload);
   
   // 브라우저 알림 표시
   if (Notification.permission === 'granted') {
     const notification = new Notification(payload.notification.title, {
       body: payload.notification.body,
       icon: '/images/logo_mountain.png',
       data: payload.data
     });

     // 알림 클릭 시 라우팅
     notification.onclick = () => {
       window.focus();
       const clickAction = payload.data?.clickAction || '/notifications';
       window.location.href = clickAction;
       notification.close();
     };
   }
   
   // UI 업데이트 (읽지 않은 알림 카운트 등)
   updateNotificationUI(payload);
 });
};

/**
* 🔄 알림 UI 업데이트
*/
const updateNotificationUI = (payload) => {
 // 커스텀 이벤트로 알림 상태 업데이트
 const event = new CustomEvent('newNotification', { 
   detail: payload 
 });
 window.dispatchEvent(event);
};

/**
* 🔄 로그인 후 대기 중인 FCM 토큰 등록
*/
export const registerPendingFcmToken = async () => {
 const pendingToken = localStorage.getItem('pendingFcmToken');
 if (pendingToken) {
   console.log('🔄 대기 중인 FCM 토큰 등록 시도');
   await registerTokenToServer(pendingToken);
 }
};

/**
* 🔧 디버깅용 함수 - 수동으로 토큰 등록 테스트
*/
export const testTokenRegistration = async () => {
 const authToken = getAuthToken();
 console.log('🔧 디버깅 정보:');
 console.log('- 인증 토큰:', authToken ? '있음' : '없음');
 console.log('- axiosInstance 기본 URL:', axiosInstance.defaults.baseURL);
 console.log('- axiosInstance 헤더:', axiosInstance.defaults.headers);
 
 if (authToken) {
   const testToken = 'test-fcm-token-' + Date.now();
   console.log('🧪 테스트 토큰으로 등록 시도:', testToken);
   await registerTokenToServer(testToken);
 }
};