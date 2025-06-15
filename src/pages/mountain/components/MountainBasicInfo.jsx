import React from 'react';

const MountainBasicInfo = ({ mountain, description }) => {
  if (!mountain) return null;

  const headerStyle = {
    marginBottom: 'clamp(1rem, 2vw, 1.5rem)',
    borderBottom: '0.1rem solid #e0e0e0',
    paddingBottom: 'clamp(0.8rem, 1.5vw, 1rem)',
  };

  const mountainNameStyle = {
    fontSize: 'clamp(1.8rem, 4vw, 2.5rem)',
    fontWeight: '700',
    color: '#2c3e50',
    marginBottom: 'clamp(0.3rem, 0.8vw, 0.5rem)',
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

  // 산 요약 정보 박스 스타일 추가
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
        <h1 style={mountainNameStyle}>{mountain.name}</h1>
        <div style={basicInfoStyle}>
          <span style={badgeStyle}>📍 {mountain.location}</span>
          <span style={badgeStyle}>⛰️ {mountain.elevation}m</span>
          <span style={badgeStyle}>🎯 {description?.difficulty || '정보 없음'}</span>
        </div>

        {/* 산 요약 정보를 헤더로 이동 */}
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