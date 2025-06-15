import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import MountainBasicInfo from './components/mountainBasicInfo';
import MountainImage from './components/mountainImage';
import MountainDescription from './components/mountainDescription';
import MountainSafetyInfo from './components/mountainSafetyInfo';

const MountainDetailPage = () => {
  const { mountainName } = useParams(); // ✅ useParams 사용
  const [mountainData, setMountainData] = useState(null);
  const [loading, setLoading] = useState(true);

  // 산 정보 조회
  useEffect(() => {
    const fetchMountainData = async () => {
      try {
        const token = localStorage.getItem('X-AUTH-TOKEN');
        
        // 토큰이 있으면 헤더에 포함, 없으면 제외 (공개 API이므로)
        const headers = token ? { 'X-AUTH-TOKEN': token } : {};
        
        const response = await fetch(`http://localhost:8080/mountain-service/search?name=${mountainName}`, {
          headers
        });
        
        if (response.ok) {
          const data = await response.json();
          setMountainData(data);
        } else {
          console.error('산 정보 조회 실패');
        }
      } catch (error) {
        console.error('API 호출 오류:', error);
      } finally {
        setLoading(false);
      }
    };

    if (mountainName) {
      fetchMountainData();
    }
  }, [mountainName]);

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '50vh',
        fontSize: 'clamp(1rem, 2vw, 1.2rem)',
        color: '#666'
      }}>
        산 정보를 불러오는 중...
      </div>
    );
  }

  if (!mountainData) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '50vh',
        fontSize: 'clamp(1rem, 2vw, 1.2rem)',
        color: '#e74c3c'
      }}>
        산 정보를 찾을 수 없습니다.
      </div>
    );
  }

  const { mountain, description, sunInfo, weatherInfo, fireRiskInfo } = mountainData;

  const containerStyle = {
    width: '100%',
    maxWidth: '1200px', // 최대 너비 제한
    margin: '0',
    padding: 'clamp(0.5rem, 1.5vw, 1rem)',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    minHeight: '100vh',
    overflowX: 'hidden', // 가로 스크롤 방지
  };

  const contentLayoutStyle = {
    display: 'flex',
    flexDirection: window.innerWidth <= 768 ? 'column' : 'row',
    gap: 'clamp(1rem, 2vw, 2rem)',
    alignItems: 'flex-start',
    width: '100%',
    maxWidth: '100%',
  };

  return (
    <div style={containerStyle}>
      {/* 1. 산이름과 해발고도 + 산 요약 박스 (맨 위) */}
      <MountainBasicInfo mountain={mountain} description={description} />
      
      {/* 메인 컨텐츠 영역 */}
      <main>
        <div style={contentLayoutStyle}>
          {/* 2. 산 설명 박스 (왼쪽) */}
          <div style={{ flex: '2', minWidth: '0' }}>
            <MountainDescription description={description} />
          </div>

          {/* 3. 오른쪽 영역 (위에서 아래로) */}
          <div style={{ flex: '1', minWidth: '300px' }}>
            {/* 안전정보 박스 (맨 위) */}
            <MountainSafetyInfo 
              weatherInfo={weatherInfo} 
              fireRiskInfo={fireRiskInfo} 
              sunInfo={sunInfo} 
            />
            {/* 산 이미지 + 기타 박스들 */}
            <MountainImage mountain={mountain} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default MountainDetailPage;