//app.jsx 경로 수정하기!!!!!!!!!!!!!!!!(까먹지말기)


import React, { useEffect, useState } from 'react';
import { requestNotificationPermission, setupForegroundMessageListener, registerPendingFcmToken } from "shared/lib/fcm";
import { isAuthenticated } from "shared/lib/auth";

const NotificationManager = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const initializeFCM = async () => {
      console.log('🔔 FCM 초기화 시작');

      // 로그인된 사용자만 FCM 초기화
      if (!isAuthenticated()) {
        console.log('⚠️ 로그인하지 않은 사용자, FCM 초기화 스킵');
        return;
      }

      try {
        // FCM 권한 요청 및 토큰 등록
        const success = await requestNotificationPermission();
        
        if (success) {
          // 포그라운드 메시지 리스너 설정
          setupForegroundMessageListener();
          
          // 대기 중인 토큰 등록 처리
          await registerPendingFcmToken();
          
          setIsInitialized(true);
          console.log('✅ FCM 초기화 완료');
        }
      } catch (error) {
        console.error('❌ FCM 초기화 실패:', error);
      }
    };

    initializeFCM();
  }, []);

  // 새 알림 이벤트 리스너
  useEffect(() => {
    const handleNewNotification = (event) => {
      console.log('🆕 새 알림 수신:', event.detail);
      setUnreadCount(prev => prev + 1);
    };

    window.addEventListener('newNotification', handleNewNotification);
    
    return () => {
      window.removeEventListener('newNotification', handleNewNotification);
    };
  }, []);

  // FCM이 초기화되지 않은 경우 렌더링하지 않음
  if (!isInitialized) {
    return null;
  }

  return (
    <div style={{
      position: 'fixed',
      top: '20px',
      right: '20px',
      zIndex: 9999,
      background: 'rgba(0, 0, 0, 0.8)',
      color: 'white',
      padding: '10px',
      borderRadius: '5px',
      fontSize: '12px'
    }}>
      🔔 FCM 활성화됨 | 읽지 않은 알림: {unreadCount}
    </div>
  );
};

export default NotificationManager;