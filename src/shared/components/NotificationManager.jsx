import React, { useEffect, useState } from 'react';
import { requestNotificationPermission, setupForegroundMessageListener, registerPendingFcmToken } from "shared/lib/fcm";
import { isAuthenticated } from "shared/lib/auth";

const NotificationManager = () => {
  const [unreadCount, setUnreadCount] = useState(0);
  const [initStatus, setInitStatus] = useState('checking'); // 'checking', 'success', 'failed', 'no-auth'

  useEffect(() => {
    const initializeFCM = async () => {
      console.log('🔔 FCM 초기화 시작');

      // 로그인된 사용자만 FCM 초기화
      if (!isAuthenticated()) {
        console.log('⚠️ 로그인하지 않은 사용자, FCM 초기화 스킵');
        setInitStatus('no-auth');
        return;
      }

      try {
        setInitStatus('checking');
        
        // FCM 권한 요청 및 토큰 등록
        const success = await requestNotificationPermission();
        
        if (success) {
          // 포그라운드 메시지 리스너 설정
          setupForegroundMessageListener();
          
          // 대기 중인 토큰 등록 처리
          await registerPendingFcmToken();
          
          setInitStatus('success');
          console.log('✅ FCM 초기화 완료');
        } else {
          setInitStatus('failed');
          console.log('❌ FCM 초기화 실패 - 알림 권한 거부됨');
        }
      } catch (error) {
        console.error('❌ FCM 초기화 실패:', error);
        setInitStatus('failed');
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

  // 상태별 렌더링
  const renderStatus = () => {
    switch (initStatus) {
      case 'checking':
        return (
          <div style={{
            ...baseStyle,
            background: 'rgba(255, 165, 0, 0.9)', // 주황색
          }}>
            🔄 FCM 초기화 중...
          </div>
        );
      
      case 'success':
        return (
          <div style={{
            ...baseStyle,
            background: 'rgba(0, 128, 0, 0.9)', // 초록색
          }}>
            🔔 FCM 활성화됨 | 읽지 않은 알림: {unreadCount}
          </div>
        );
      
      case 'failed':
        return (
          <div style={{
            ...baseStyle,
            background: 'rgba(220, 53, 69, 0.9)', // 빨간색
            cursor: 'pointer'
          }}
          onClick={() => window.location.reload()}
          title="클릭하여 다시 시도"
          >
            ❌ FCM 초기화 실패 (클릭: 재시도)
          </div>
        );
      
      case 'no-auth':
        // 비로그인 사용자는 아무것도 표시하지 않음
        return null;
      
      default:
        return null;
    }
  };

  const baseStyle = {
    position: 'fixed',
    top: '20px',
    right: '20px',
    zIndex: 9999,
    color: 'white',
    padding: '10px',
    borderRadius: '5px',
    fontSize: '12px',
    maxWidth: '250px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
    transition: 'all 0.3s ease'
  };

  return renderStatus();
};

export default NotificationManager;