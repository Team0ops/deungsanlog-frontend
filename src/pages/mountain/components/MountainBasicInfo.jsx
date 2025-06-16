import React, { useState, useEffect } from 'react';

const MountainBasicInfo = ({ mountain, description }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userId, setUserId] = useState(null);

  // JWT 토큰에서 사용자 ID 추출
  useEffect(() => {
    // 여러 가능한 키 시도
    const token = localStorage.getItem('X-AUTH-TOKEN') || 
                  localStorage.getItem('token') || 
                  localStorage.getItem('authToken') || 
                  localStorage.getItem('jwt') ||
                  localStorage.getItem('accessToken');
                  
    console.log('🔑 토큰:', token); // 디버깅용
    
    if (token) {
      try {
        // JWT 토큰에서 사용자 ID 추출
        const payload = JSON.parse(atob(token.split('.')[1]));
        console.log('🎯 JWT 페이로드:', payload); // 디버깅용
        
        // 여러 가능한 필드명 시도
        const extractedUserId = payload.userId || payload.id || payload.sub || payload.user_id;
        console.log('👤 추출된 userId:', extractedUserId); // 디버깅용
        
        setUserId(extractedUserId);
      } catch (error) {
        console.error('토큰 파싱 오류:', error);
      }
    } else {
      console.log('❌ 토큰이 없습니다');
    }
  }, []);

  // 즐겨찾기 여부 확인
  useEffect(() => {
    const checkFavoriteStatus = async () => {
      if (!userId || !mountain?.id) return;

      try {
        // 실제 저장된 토큰 키 사용
        const token = localStorage.getItem('X-AUTH-TOKEN') || 
                      localStorage.getItem('token') || 
                      localStorage.getItem('authToken') || 
                      localStorage.getItem('jwt') ||
                      localStorage.getItem('accessToken');
                      
        const response = await fetch(
          `http://localhost:8080/user-service/api/users/${userId}/favorites/${mountain.id}/check`,
          {
            headers: {
              'X-AUTH-TOKEN': token
            }
          }
        );

        if (response.ok) {
          const data = await response.json();
          setIsFavorite(data.isFavorite);
        }
      } catch (error) {
        console.error('즐겨찾기 상태 확인 오류:', error);
      }
    };

    checkFavoriteStatus();
  }, [userId, mountain?.id]);

  // 즐겨찾기 토글 또는 로그인 페이지 이동
  const handleFavoriteToggle = async () => {
    console.log('🚀 즐겨찾기 버튼 클릭됨!'); // 디버깅용
    
    // 로그인하지 않은 경우 로그인 페이지로 이동
    if (!userId) {
      console.log('❌ 사용자 로그인 안됨'); // 디버깅용
      if (window.confirm('즐겨찾기 기능을 사용하려면 로그인이 필요합니다. 로그인 페이지로 이동하시겠습니까?')) {
        window.location.href = '/login';
      }
      return;
    }

    if (!mountain?.id || isLoading) {
      console.log('❌ 산 ID 없음 또는 로딩 중:', { mountainId: mountain?.id, isLoading }); // 디버깅용
      return;
    }

    console.log('📡 API 호출 시작:', `userId=${userId}, mountainId=${mountain.id}`); // 디버깅용

    setIsLoading(true);
    try {
      const token = localStorage.getItem('X-AUTH-TOKEN') || 
                    localStorage.getItem('token') || 
                    localStorage.getItem('authToken') || 
                    localStorage.getItem('jwt') ||
                    localStorage.getItem('accessToken');
      
      console.log('🔑 사용할 토큰:', token ? token.substring(0, 20) + '...' : 'null'); // 디버깅용
                    
      const response = await fetch(
        `http://localhost:8080/user-service/api/users/${userId}/favorites/${mountain.id}/toggle`,
        {
          method: 'POST',
          headers: {
            'X-AUTH-TOKEN': token
          }
        }
      );

      console.log('📨 API 응답 상태:', response.status); // 디버깅용

      if (response.ok) {
        const data = await response.json();
        console.log('✅ API 응답 성공:', data); // 디버깅용
        setIsFavorite(data.isAdded);
        
        // 성공 메시지 표시 (선택사항)
        if (data.isAdded) {
          alert('즐겨찾기에 추가되었습니다! ⭐');
        } else {
          alert('즐겨찾기에서 삭제되었습니다.');
        }
      } else {
        console.log('❌ API 응답 실패:', response.status, response.statusText); // 디버깅용
        alert('즐겨찾기 처리에 실패했습니다.');
      }
    } catch (error) {
      console.error('💥 즐겨찾기 토글 오류:', error); // 디버깅용
      alert('즐겨찾기 처리 중 오류가 발생했습니다.');
    } finally {
      console.log('🏁 API 호출 완료'); // 디버깅용
      setIsLoading(false);
    }
  };

  if (!mountain) return null;

  const headerStyle = {
    marginBottom: 'clamp(1rem, 2vw, 1.5rem)',
    borderBottom: '0.1rem solid #e0e0e0',
    paddingBottom: 'clamp(0.8rem, 1.5vw, 1rem)',
  };

  // 산 이름과 즐겨찾기 버튼을 나란히 배치
  const titleContainerStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: 'clamp(0.8rem, 2vw, 1.2rem)',
    marginBottom: 'clamp(0.3rem, 0.8vw, 0.5rem)',
  };

  const mountainNameStyle = {
    fontSize: 'clamp(1.8rem, 4vw, 2.5rem)',
    fontWeight: '700',
    color: '#2c3e50',
    margin: 0, // 기본 마진 제거
  };

  // 즐겨찾기 버튼 스타일
  const favoriteButtonStyle = {
    background: isFavorite ? '#fff3cd' : '#f8f9fa',
    border: '2px solid #ffc107',
    fontSize: 'clamp(1.5rem, 3vw, 2rem)',
    cursor: isLoading ? 'not-allowed' : 'pointer',
    padding: 'clamp(0.5rem, 1vw, 0.8rem)',
    borderRadius: '50%',
    transition: 'all 0.2s ease',
    opacity: isLoading ? 0.6 : 1,
    transform: 'scale(1)',
    minWidth: 'clamp(2.5rem, 4vw, 3rem)',
    minHeight: 'clamp(2.5rem, 4vw, 3rem)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  };

  const basicInfoStyle = {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 'clamp(0.5rem, 1vw, 0.8rem)',
    marginBottom: 'clamp(0.8rem, 1.5vw, 1rem)',
    fontSize: 'clamp(0.8rem, 1.3vw, 0.9rem)',
  };

  const badgeStyle = {
    backgroundColor: '#f8f9fa',
    padding: 'clamp(0.3rem, 0.8vw, 0.5rem) clamp(0.6rem, 1.2vw, 0.8rem)',
    borderRadius: '0.4rem',
    border: '0.1rem solid #dee2e6',
    color: '#495057',
  };

  const summaryBoxStyle = {
    backgroundColor: '#ffffff',
    borderRadius: '1rem',
    padding: 'clamp(1rem, 2vw, 1.5rem)',
    boxShadow: '0 0.2rem 1rem rgba(0,0,0,0.1)',
    marginTop: 'clamp(1rem, 2vw, 1.5rem)',
  };

  const summaryGridStyle = {
    display: 'grid',
    gap: 'clamp(0.5rem, 1vw, 0.8rem)',
  };

  const summaryItemStyle = {
    display: 'grid',
    gridTemplateColumns: '1fr 2fr',
    alignItems: 'center',
    padding: 'clamp(0.3rem, 0.8vw, 0.5rem) 0',
    borderBottom: '0.1rem solid #f1f3f4',
  };

  return (
    <header style={headerStyle}>
      <div>
        {/* 산 이름과 즐겨찾기 버튼 */}
        <div style={titleContainerStyle}>
          <h1 style={mountainNameStyle}>{mountain.name}</h1>
          {/* 즐겨찾기 버튼 - 항상 보이게 */}
          <button
            style={favoriteButtonStyle}
            onClick={handleFavoriteToggle}
            disabled={isLoading}
            title={!userId ? '로그인 후 즐겨찾기 사용 가능' : (isFavorite ? '즐겨찾기 해제' : '즐겨찾기 추가')}
            onMouseEnter={(e) => {
              if (!isLoading) {
                e.target.style.transform = 'scale(1.1)';
              }
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'scale(1)';
            }}
          >
            {isLoading ? '⏳' : !userId ? '🔒' : isFavorite ? '★' : '☆'}
          </button>
        </div>

        <div style={basicInfoStyle}>
          <span style={badgeStyle}>📍 {mountain.location}</span>
          <span style={badgeStyle}>⛰️ {mountain.elevation}m</span>
          <span style={badgeStyle}>🎯 {description?.difficulty || '정보 없음'}</span>
        </div>

        {/* 산 요약 정보 */}
        <div style={summaryBoxStyle}>
          <h3 style={{ fontSize: 'clamp(1.1rem, 2vw, 1.3rem)', marginBottom: 'clamp(1rem, 2vw, 1.5rem)' }}>
            산 요약
          </h3>
          <div style={summaryGridStyle}>
            <div style={summaryItemStyle}>
              <span style={{ fontWeight: '600', color: '#495057' }}>산 이름:</span>
              <span>{mountain.name}</span>
            </div>
            <div style={summaryItemStyle}>
              <span style={{ fontWeight: '600', color: '#495057' }}>위치:</span>
              <span>{mountain.location}</span>
            </div>
            <div style={summaryItemStyle}>
              <span style={{ fontWeight: '600', color: '#495057' }}>고도:</span>
              <span>{mountain.elevation}m</span>
            </div>
            <div style={summaryItemStyle}>
              <span style={{ fontWeight: '600', color: '#495057' }}>난이도:</span>
              <span>{description?.difficulty || '정보 없음'}</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default MountainBasicInfo;