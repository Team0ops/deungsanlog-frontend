// ✅ Workbox 로드 (PWA 기능)
/* eslint-env serviceworker */
/* eslint-disable no-undef */

importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.4.1/workbox-sw.js');

// ✅ Firebase 로드 (FCM 기능)
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

// ✅ Firebase 설정
const firebaseConfig = {
  apiKey: "AIzaSyDbWKy1mG0Vjmt0Ii8Lhkmr1EM7mxjNoYQ",
  authDomain: "deungsanlog-notifications.firebaseapp.com",
  projectId: "deungsanlog-notifications",
  storageBucket: "deungsanlog-notifications.firebasestorage.app",
  messagingSenderId: "738985056674",
  appId: "1:738985056674:web:b80bf1c3327bfa1081bafb"
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

// ✅ Service Worker 즉시 활성화
self.skipWaiting();

// ✅ PWA 캐싱 설정 (팀원 설정 기반)
if (workbox) {
  console.log('🔧 Workbox + FCM 통합 완료');
  
  // 클라이언트 즉시 제어
  workbox.core.clientsClaim();
  
  // 프리캐싱 및 라우팅 (Vite가 자동 주입)
  workbox.precaching.precacheAndRoute(self.__WB_MANIFEST);
  
  // 오래된 캐시 정리
  workbox.precaching.cleanupOutdatedCaches();
  
  // ✅ 네비게이션 라우팅 (SPA용) - 팀원 설정 유지
  workbox.routing.registerRoute(
    new workbox.routing.NavigationRoute(
      workbox.precaching.createHandlerBoundToURL('index.html'),
      {
        denylist: [
          /^\/auth/,                // /auth로 시작하는 모든 경로
          /^\/api/,                 // /api로 시작하는 모든 경로
          /^\/community-service/,   // 커뮤니티 서비스
          /^\/record-service/,      // 기록 서비스
          /^\/user-service/,        // 유저 서비스
          /^\/meeting-service/,     // 모임 서비스
          /^\/mountain-service/,    // 산 서비스
          /^\/notification-service/, // 알림 서비스
          /^\/ormie-service/,       // 오르미 서비스
        ]
      }
    )
  );
  
  // ✅ API 요청 처리 (팀원 설정 유지) - 항상 네트워크에서 가져오기
  workbox.routing.registerRoute(
    /^https:\/\/.*\/api\/.*/,
    new workbox.strategies.NetworkOnly({
      cacheName: 'api-cache',
      plugins: [
        new workbox.expiration.ExpirationPlugin({
          maxEntries: 0, // 캐시하지 않음
        })
      ]
    }),
    'GET'
  );
  
  workbox.routing.registerRoute(
    /^https:\/\/.*\/community-service\/.*/,
    new workbox.strategies.NetworkOnly({
      cacheName: 'community-api-cache',
      plugins: [
        new workbox.expiration.ExpirationPlugin({
          maxEntries: 0,
        })
      ]
    }),
    'GET'
  );
  
  workbox.routing.registerRoute(
    /^https:\/\/.*\/record-service\/.*/,
    new workbox.strategies.NetworkOnly({
      cacheName: 'record-api-cache',
      plugins: [
        new workbox.expiration.ExpirationPlugin({
          maxEntries: 0,
        })
      ]
    }),
    'GET'
  );
  
  // ✅ 정적 리소스 캐싱 (추가)
  workbox.routing.registerRoute(
    ({ request }) => {
      return request.destination === 'script' || 
             request.destination === 'style' || 
             request.destination === 'image' ||
             request.destination === 'font';
    },
    new workbox.strategies.CacheFirst({
      cacheName: 'static-resources-v1',
      plugins: [
        new workbox.expiration.ExpirationPlugin({
          maxEntries: 100,
          maxAgeSeconds: 30 * 24 * 60 * 60, // 30일
        })
      ]
    })
  );
  
} else {
  console.error('❌ Workbox 로드 실패');
}

// ✅ FCM 백그라운드 메시지 처리
messaging.onBackgroundMessage((payload) => {
  console.log('[sw.js] 🔔 FCM 백그라운드 메시지 받음:', payload);
  
  const notificationTitle = payload.notification?.title || '등산로그 알림';
  const notificationOptions = {
    body: payload.notification?.body || '새로운 알림이 도착했습니다.',
    icon: '/images/logo_mountain.png',
    badge: '/images/logo_mountain.png',
    tag: 'deungsanlog-notification', // 중복 알림 방지
    renotify: true,
    requireInteraction: false,
    data: {
      ...payload.data,
      clickAction: payload.data?.clickAction || '/',
      timestamp: Date.now()
    },
    actions: [
      {
        action: 'open',
        title: '확인하기'
      },
      {
        action: 'close', 
        title: '닫기'
      }
    ]
  };

  return self.registration.showNotification(notificationTitle, notificationOptions);
});

// ✅ 알림 클릭 처리
self.addEventListener('notificationclick', (event) => {
  console.log('[sw.js] 🖱️ 알림 클릭됨:', event);
  
  event.notification.close();
  
  const clickAction = event.notification.data?.clickAction || '/';
  const action = event.action;
  
  if (action === 'close') {
    return; // 닫기 액션이면 아무것도 하지 않음
  }
  
  // 페이지 열기
  event.waitUntil(
    clients.matchAll({ 
      type: 'window',
      includeUncontrolled: true 
    }).then((clientList) => {
      // 이미 열린 탭이 있으면 포커스
      for (const client of clientList) {
        if (client.url.includes(window.location.origin) && 'focus' in client) {
          client.navigate(clickAction);
          return client.focus();
        }
      }
      
      // 열린 탭이 없으면 새로 열기
      if (clients.openWindow) {
        return clients.openWindow(clickAction);
      }
    })
  );
});

// ✅ 푸시 이벤트 처리 (추가 보안)
self.addEventListener('push', (event) => {
  console.log('[sw.js] 📨 Push 이벤트 받음:', event);
  
  if (event.data) {
    try {
      const payload = event.data.json();
      console.log('Push 데이터:', payload);
      
      // FCM이 자동으로 처리하지만, 추가 로직이 필요하면 여기에
    } catch (error) {
      console.error('Push 데이터 파싱 오류:', error);
    }
  }
});

// ✅ Service Worker 업데이트 처리
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    console.log('[sw.js] 🔄 Service Worker 업데이트 적용');
    self.skipWaiting();
  }
});

console.log('🚀 Service Worker 로드 완료: PWA + FCM 통합');