import React from 'react';

const MountainImage = ({ mountain }) => {
  if (!mountain) return null;

  const imageSectionStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: 'clamp(1rem, 2vw, 1.5rem)',
  };

  const mountainImageStyle = {
    width: '100%',
    height: 'clamp(15rem, 25vw, 20rem)',
    objectFit: 'cover',
    borderRadius: '1rem',
    boxShadow: '0 0.2rem 1rem rgba(0,0,0,0.1)',
  };

  const noImageStyle = {
    width: '100%',
    height: 'clamp(15rem, 25vw, 20rem)',
    backgroundColor: '#f8f9fa',
    borderRadius: '1rem',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    border: '0.1rem solid #dee2e6',
  };

  const boxStyle = {
    backgroundColor: '#ffffff',
    borderRadius: '1rem',
    padding: 'clamp(1rem, 2vw, 1.5rem)',
    boxShadow: '0 0.2rem 1rem rgba(0,0,0,0.1)',
  };

  const actionButtonsStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: 'clamp(0.5rem, 1vw, 0.8rem)',
  };

  const actionButtonStyle = (isPrimary) => ({
    padding: 'clamp(0.8rem, 1.5vw, 1rem)',
    borderRadius: '0.5rem',
    border: 'none',
    fontSize: 'clamp(0.9rem, 1.5vw, 1rem)',
    fontWeight: '600',
    cursor: 'pointer',
    backgroundColor: isPrimary ? '#007bff' : '#6c757d',
    color: '#ffffff',
    transition: 'all 0.3s ease',
  });

  return (
    <aside style={imageSectionStyle}>
      {/* 산 이미지 */}
      <div>
        {mountain.thumbnailImgUrl ? (
          <img 
            src={mountain.thumbnailImgUrl} 
            alt={mountain.name}
            style={mountainImageStyle}
          />
        ) : (
          <div style={noImageStyle}>
            <span style={{ fontSize: 'clamp(3rem, 6vw, 4rem)' }}>🏔️</span>
            <p style={{ color: '#6c757d', marginTop: '1rem' }}>이미지가 없습니다</p>
          </div>
        )}
      </div>

      {/* 국립공원 실시간 영상 박스 */}
      <div style={boxStyle}>
        <h3 style={{ fontSize: 'clamp(1.1rem, 2vw, 1.3rem)', marginBottom: 'clamp(1rem, 2vw, 1.5rem)' }}>
          국립공원 실시간 영상
        </h3>
        <div style={{ color: '#6c757d', textAlign: 'center', padding: '2rem 0' }}>
          실시간 영상 준비 중
        </div>
      </div>

      {/* 산 등반 순서 박스 */}
      <div style={boxStyle}>
        <h3 style={{ fontSize: 'clamp(1.1rem, 2vw, 1.3rem)', marginBottom: 'clamp(1rem, 2vw, 1.5rem)' }}>
          산 등반 순서
        </h3>
        <div style={{ color: '#6c757d' }}>
          등반 순서 정보 준비 중
        </div>
      </div>

      {/* 등산 기록 버튼 */}
      <div style={actionButtonsStyle}>
        <button 
          style={actionButtonStyle(true)}
          onMouseOver={(e) => e.target.style.backgroundColor = '#0056b3'}
          onMouseOut={(e) => e.target.style.backgroundColor = '#007bff'}
        >
          📝 등산 기록 작성
        </button>
        <button 
          style={actionButtonStyle(false)}
          onMouseOver={(e) => e.target.style.backgroundColor = '#5a6268'}
          onMouseOut={(e) => e.target.style.backgroundColor = '#6c757d'}
        >
          📋 등산 계획 추가
        </button>
      </div>
    </aside>
  );
};

export default MountainImage;