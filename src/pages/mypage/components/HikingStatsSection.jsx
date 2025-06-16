import React, { useState, useEffect } from 'react';
import { getToken, authenticatedFetch } from 'shared/lib/auth';  // ✅ 추가

const HikingStatsSection = ({ userId }) => {
  const [badgeProfile, setBadgeProfile] = useState(null);
  const [hikingRecords, setHikingRecords] = useState([]);
  const [stats, setStats] = useState({
    totalHikes: 0,
    uniqueMountains: 0,
    totalDistance: 0,
    averageTime: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // 🔍 강화된 디버깅 로그
  useEffect(() => {
    console.log('📊 HikingStatsSection 마운트됨');
    console.log('📊 전달받은 userId:', userId);
    console.log('📊 userId 타입:', typeof userId);
    console.log('📊 userId 유효성:', userId ? '유효' : '무효');
  }, [userId]);

  // 등산 통계 데이터 조회
  useEffect(() => {
    const fetchHikingStats = async () => {
      console.log('📊 등산 통계 조회 시작:', { userId });

      // userId 검증
      if (!userId) {
        console.error('❌ userId가 없습니다:', userId);
        setError('사용자 ID를 찾을 수 없습니다.');
        setLoading(false);
        return;
      }

      try {
        // ✅ 인증 유틸 사용
        const token = getToken();

        console.log('🔑 토큰 확인:', {
          hasToken: !!token,
          tokenPreview: token ? token.substring(0, 20) + '...' : '없음'
        });

        if (!token) {
          console.error('❌ 인증 토큰이 없습니다');
          setError('로그인이 필요합니다.');
          setLoading(false);
          return;
        }

        console.log('📡 API 호출 시작...');

        // ✅ 1. 뱃지 프로필 조회 (authenticatedFetch 사용)
        console.log('🏆 뱃지 API 호출 시작...');
        try {
          const badgeResponse = await authenticatedFetch(
            `http://localhost:8080/record-service/users/${userId}/badge-profile`
          );

          console.log('🏆 뱃지 API 응답:', {
            status: badgeResponse.status,
            statusText: badgeResponse.statusText,
            ok: badgeResponse.ok
          });

          if (badgeResponse.ok) {
            const badgeData = await badgeResponse.json();
            console.log('🏆 뱃지 데이터:', badgeData);
            setBadgeProfile(badgeData);
          } else {
            const badgeErrorText = await badgeResponse.text();
            console.error('🏆 뱃지 API 실패:', badgeErrorText);
          }
        } catch (badgeError) {
          console.error('🏆 뱃지 API 호출 오류:', badgeError);
        }

        // ✅ 2. 등산 기록 조회 (authenticatedFetch 사용)
        console.log('📈 등산 기록 API 호출 시작...');
        try {
          const recordsResponse = await authenticatedFetch(
            `http://localhost:8080/record-service/get?userId=${userId}`
          );

          console.log('📈 등산 기록 API 응답:', {
            status: recordsResponse.status,
            statusText: recordsResponse.statusText,
            ok: recordsResponse.ok
          });

          if (recordsResponse.ok) {
            const recordsData = await recordsResponse.json();
            console.log('📈 등산 기록 데이터:', recordsData);
            setHikingRecords(recordsData);

            // 통계 계산
            const uniqueMountains = new Set(recordsData.map(record => record.mountainName)).size;
            setStats({
              totalHikes: recordsData.length,
              uniqueMountains: uniqueMountains,
              totalDistance: 0, // 추후 계산
              averageTime: 0    // 추후 계산
            });

            console.log('📊 계산된 통계:', {
              totalHikes: recordsData.length,
              uniqueMountains: uniqueMountains
            });
          } else {
            const recordsErrorText = await recordsResponse.text();
            console.error('📈 등산 기록 API 실패:', recordsErrorText);
          }
        } catch (recordsError) {
          console.error('📈 등산 기록 API 호출 오류:', recordsError);
        }

        console.log('✅ 등산 통계 조회 완료');

      } catch (error) {
        console.error('❌ 등산 통계 조회 중 오류:', error);
        setError('등산 통계를 불러오는 중 오류가 발생했습니다: ' + error.message);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchHikingStats();
    } else {
      console.log('⏳ userId를 기다리는 중...');
    }
  }, [userId]);

  // 로딩 상태
  if (loading) {
    return (
      <div style={{
        padding: 'clamp(1.5rem, 3vw, 2rem)',
        backgroundColor: '#ffffff',
        borderRadius: '1rem',
        boxShadow: '0 0.2rem 1rem rgba(0,0,0,0.1)',
        textAlign: 'center'
      }}>
        <div style={{
          width: 'clamp(2rem, 4vw, 3rem)',
          height: 'clamp(2rem, 4vw, 3rem)',
          border: '0.2rem solid #f3f3f3',
          borderTop: '0.2rem solid #007bff',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          margin: '0 auto clamp(1rem, 2vw, 1.5rem) auto'
        }} />
        등산 통계를 불러오는 중...
      </div>
    );
  }

  // 에러 상태
  if (error) {
    return (
      <div style={{
        padding: 'clamp(1.5rem, 3vw, 2rem)',
        backgroundColor: '#ffffff',
        borderRadius: '1rem',
        boxShadow: '0 0.2rem 1rem rgba(0,0,0,0.1)'
      }}>
        <h3 style={{ 
          fontSize: 'clamp(1.2rem, 2.5vw, 1.5rem)',
          color: '#dc3545',
          marginBottom: 'clamp(1rem, 2vw, 1.5rem)'
        }}>
          📊 등산 통계
        </h3>
        <div style={{
          color: '#dc3545',
          backgroundColor: '#f8d7da',
          padding: 'clamp(1rem, 2vw, 1.5rem)',
          borderRadius: '0.5rem',
          border: '0.1rem solid #f5c6cb'
        }}>
          {error}
        </div>
        
        {/* 디버깅 정보 표시 */}
        <details style={{ marginTop: 'clamp(1rem, 2vw, 1.5rem)' }}>
          <summary style={{ cursor: 'pointer', color: '#6c757d' }}>디버깅 정보</summary>
          <div style={{ 
            marginTop: '0.5rem', 
            fontSize: '0.8rem', 
            color: '#6c757d',
            backgroundColor: '#f8f9fa',
            padding: '0.5rem',
            borderRadius: '0.3rem'
          }}>
            <div>userId: {userId}</div>
            <div>토큰 존재: {getToken() ? '있음' : '없음'}</div>
          </div>
        </details>
      </div>
    );
  }

  // 나머지 컴포넌트 렌더링...
  return (
    <div style={{
      padding: 'clamp(1.5rem, 3vw, 2rem)',
      backgroundColor: '#ffffff',
      borderRadius: '1rem',
      boxShadow: '0 0.2rem 1rem rgba(0,0,0,0.1)'
    }}>
      <h3 style={{ 
        fontSize: 'clamp(1.2rem, 2.5vw, 1.5rem)',
        marginBottom: 'clamp(1rem, 2vw, 1.5rem)'
      }}>
        📊 등산 통계
      </h3>
      
      {/* 뱃지 정보 */}
      {badgeProfile && (
        <div style={{
          backgroundColor: '#f8f9fa',
          padding: 'clamp(1rem, 2vw, 1.5rem)',
          borderRadius: '0.5rem',
          marginBottom: 'clamp(1rem, 2vw, 1.5rem)'
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}>
              {badgeProfile.stage <= 3 ? '🥾' : badgeProfile.stage <= 6 ? '🏔️' : '👑'}
            </div>
            <div style={{ fontWeight: '600' }}>{badgeProfile.title}</div>
            <div style={{ fontSize: '0.9rem', color: '#6c757d' }}>
              {badgeProfile.description}
            </div>
          </div>
        </div>
      )}

      {/* 통계 카드들 */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(clamp(8rem, 15vw, 10rem), 1fr))',
        gap: 'clamp(0.8rem, 1.5vw, 1rem)',
        marginBottom: 'clamp(1rem, 2vw, 1.5rem)'
      }}>
        <div style={{
          textAlign: 'center',
          padding: 'clamp(0.8rem, 1.5vw, 1rem)',
          backgroundColor: '#e3f2fd',
          borderRadius: '0.5rem'
        }}>
          <div style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: '700' }}>
            {stats.totalHikes}
          </div>
          <div style={{ fontSize: 'clamp(0.8rem, 1.3vw, 0.9rem)', color: '#666' }}>
            총 등산 횟수
          </div>
        </div>

        <div style={{
          textAlign: 'center',
          padding: 'clamp(0.8rem, 1.5vw, 1rem)',
          backgroundColor: '#e8f5e8',
          borderRadius: '0.5rem'
        }}>
          <div style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: '700' }}>
            {stats.uniqueMountains}
          </div>
          <div style={{ fontSize: 'clamp(0.8rem, 1.3vw, 0.9rem)', color: '#666' }}>
            정복한 산
          </div>
        </div>
      </div>

      {/* 최근 등산 기록 */}
      <div>
        <h4 style={{ 
          fontSize: 'clamp(1rem, 1.8vw, 1.2rem)',
          marginBottom: 'clamp(0.8rem, 1.5vw, 1rem)'
        }}>
          최근 등산 기록
        </h4>
        
        {hikingRecords.length > 0 ? (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 'clamp(0.5rem, 1vw, 0.8rem)'
          }}>
            {hikingRecords.slice(0, 3).map((record) => (
              <div key={record.id} style={{
                display: 'flex',
                gap: 'clamp(0.8rem, 1.5vw, 1rem)',
                padding: 'clamp(0.8rem, 1.5vw, 1rem)',
                backgroundColor: '#f8f9fa',
                borderRadius: '0.5rem',
                alignItems: 'center'
              }}>
                {record.photoUrl && (
                  <img 
                    src={`http://localhost:8080/record-service${record.photoUrl}`}
                    alt={record.mountainName}
                    style={{
                      width: 'clamp(3rem, 6vw, 4rem)',
                      height: 'clamp(3rem, 6vw, 4rem)',
                      objectFit: 'cover',
                      borderRadius: '0.3rem'
                    }}
                  />
                )}
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: '600', fontSize: 'clamp(0.9rem, 1.5vw, 1rem)' }}>
                    {record.mountainName}
                  </div>
                  <div style={{ fontSize: 'clamp(0.8rem, 1.3vw, 0.9rem)', color: '#666' }}>
                    {record.recordDate}
                  </div>
                  {record.content && (
                    <div style={{ 
                      fontSize: 'clamp(0.8rem, 1.3vw, 0.9rem)', 
                      color: '#666',
                      marginTop: '0.2rem'
                    }}>
                      {record.content}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{
            textAlign: 'center',
            padding: 'clamp(2rem, 4vw, 3rem)',
            color: '#6c757d'
          }}>
            아직 등산 기록이 없습니다
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default HikingStatsSection;