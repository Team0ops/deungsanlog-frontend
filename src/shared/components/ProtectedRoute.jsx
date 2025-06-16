import React, { useEffect } from 'react';
import { isAuthenticated } from 'shared/lib/auth';

const ProtectedRoute = ({ children, redirectMessage = "로그인이 필요한 서비스입니다. 로그인 페이지로 이동하시겠습니까?" }) => {
  useEffect(() => {
    if (!isAuthenticated()) {
      console.log('🔒 보호된 페이지 접근 시도 - 인증 필요');
      
      const shouldRedirect = window.confirm(redirectMessage);
      
      if (shouldRedirect) {
        window.location.href = '/login';
      } else {
        // 거부하면 메인 페이지로
        window.location.href = '/mountain';
      }
    }
  }, [redirectMessage]);

  // 인증되지 않은 경우 로딩 표시
  if (!isAuthenticated()) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '50vh',
        fontSize: 'clamp(1rem, 2vw, 1.2rem)',
        color: '#666'
      }}>
        <div style={{ marginBottom: '1rem' }}>🔒</div>
        <div>인증 확인 중...</div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;