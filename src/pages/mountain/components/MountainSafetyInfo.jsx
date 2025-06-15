import React from 'react';

const MountainSafetyInfo = ({ weatherInfo, fireRiskInfo, sunInfo }) => {
  const realtimeCardsStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(clamp(12rem, 20vw, 16rem), 1fr))',
    gap: 'clamp(0.8rem, 1.5vw, 1rem)',
    marginBottom: 'clamp(1rem, 2vw, 1.5rem)',
  };

  const cardStyle = {
    backgroundColor: '#ffffff',
    borderRadius: '0.8rem',
    padding: 'clamp(0.8rem, 1.5vw, 1rem)',
    boxShadow: '0 0.1rem 0.5rem rgba(0,0,0,0.08)',
    border: '0.1rem solid #e9ecef',
  };

  const cardTitleStyle = {
    fontSize: 'clamp(1rem, 1.8vw, 1.2rem)',
    fontWeight: '600',
    marginBottom: 'clamp(0.5rem, 1vw, 0.8rem)',
    color: '#2c3e50',
  };

  return (
    <div style={realtimeCardsStyle}>
      {/* 날씨 카드 */}
      <div style={cardStyle}>
        <h3 style={cardTitleStyle}>🌤️ 실시간 날씨</h3>
        {weatherInfo && !weatherInfo.error ? (
          <div>
            <div style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: '700', color: '#007bff' }}>
              {weatherInfo.temperature}
            </div>
            <div style={{ fontSize: 'clamp(0.8rem, 1.3vw, 0.9rem)', color: '#6c757d' }}>
              <div>습도: {weatherInfo.humidity}</div>
              <div>바람: {weatherInfo.windSpeed}</div>
              <div>강수: {weatherInfo.precipitation}</div>
            </div>
          </div>
        ) : (
          <div style={{ color: '#6c757d' }}>날씨 정보 없음</div>
        )}
      </div>

      {/* 산불위험도 카드 */}
      <div style={cardStyle}>
        <h3 style={cardTitleStyle}>🔥 산불위험예보</h3>
        {fireRiskInfo && !fireRiskInfo.error ? (
          <div>
            <div style={{ 
              fontSize: 'clamp(1.2rem, 2.5vw, 1.5rem)', 
              fontWeight: '700',
              color: fireRiskInfo.riskLevelCode === '1' ? '#28a745' : 
                    fireRiskInfo.riskLevelCode === '2' ? '#ffc107' : '#dc3545'
            }}>
              {fireRiskInfo.riskLevel}
            </div>
            <div style={{ fontSize: 'clamp(0.8rem, 1.3vw, 0.9rem)', color: '#6c757d' }}>
              {fireRiskInfo.description}
            </div>
          </div>
        ) : (
          <div style={{ color: '#6c757d' }}>산불정보 없음</div>
        )}
      </div>

      {/* 일출/일몰 카드 */}
      <div style={cardStyle}>
        <h3 style={cardTitleStyle}>🌅 일출/일몰</h3>
        {sunInfo ? (
          <div style={{ fontSize: 'clamp(0.9rem, 1.5vw, 1rem)' }}>
            <div>일출: {sunInfo.sunriseTime}</div>
            <div>일몰: {sunInfo.sunsetTime}</div>
          </div>
        ) : (
          <div style={{ color: '#6c757d' }}>일출/일몰 정보 없음</div>
        )}
      </div>
    </div>
  );
};

export default MountainSafetyInfo;