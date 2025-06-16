import { useNavigate } from 'react-router-dom'; 
/**
 * 인증 관련 유틸리티 함수들
 * 토큰 관리, 사용자 정보 추출, 로그인 상태 확인 등
 */

// 🔑 토큰 키 우선순위 (통일된 순서)
const TOKEN_KEYS = ['X-AUTH-TOKEN', 'authToken', 'token'];

/**
 * localStorage에서 토큰 가져오기
 * @returns {string|null} JWT 토큰 또는 null
 */
export const getToken = () => {
  for (const key of TOKEN_KEYS) {
    const token = localStorage.getItem(key);
    if (token) {
      console.log(`🔑 토큰 발견: ${key}`);
      return token;
    }
  }
  console.log('❌ 토큰 없음');
  return null;
};

/**
 * 토큰을 localStorage에 저장 (통일된 키 사용)
 * @param {string} token JWT 토큰
 */
export const setToken = (token) => {
  if (!token) {
    console.error('❌ 빈 토큰은 저장할 수 없습니다');
    return;
  }
  
  // 기본 키로 저장
  localStorage.setItem('X-AUTH-TOKEN', token);
  console.log('✅ 토큰 저장 완료: X-AUTH-TOKEN');
  
  // 기존 다른 키들 정리 (혹시 있다면)
  localStorage.removeItem('authToken');
  localStorage.removeItem('token');
};

/**
 * JWT 토큰에서 사용자 정보 추출
 * @returns {Object|null} 사용자 정보 또는 null
 */
export const getUserInfo = () => {
  const token = getToken();
  if (!token) {
    console.log('🔍 토큰이 없어서 사용자 정보를 가져올 수 없음');
    return null;
  }

  try {
    // JWT payload 디코딩
    const payload = JSON.parse(atob(token.split('.')[1]));
    console.log('🔍 JWT payload:', payload);

    // 다양한 키에서 사용자 ID 추출 (기존 MyPage 로직 유지)
    const userId = payload.userId || payload.id || payload.sub || payload.user_id;
    
    const userInfo = {
      userId: userId,
      email: payload.sub || payload.email, // sub가 이메일인 경우가 많음
      role: payload.role || payload.roles?.[0] || 'ROLE_USER',
      roles: payload.roles || [payload.role] || ['ROLE_USER'],
      // 토큰 만료시간도 포함
      exp: payload.exp,
      iat: payload.iat
    };

    console.log('👤 추출된 사용자 정보:', userInfo);
    return userInfo;
  } catch (error) {
    console.error('❌ JWT 파싱 오류:', error);
    return null;
  }
};

/**
 * 로그인 상태 확인
 * @returns {boolean} 로그인 여부
 */
export const isAuthenticated = () => {
  const token = getToken();
  if (!token) {
    return false;
  }

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    
    // 토큰 만료 확인
    const now = Math.floor(Date.now() / 1000); // 현재 시간 (초)
    const isExpired = payload.exp && payload.exp < now;
    
    if (isExpired) {
      console.log('⏰ 토큰이 만료됨');
      logout(); // 만료된 토큰 정리
      return false;
    }
    
    console.log('✅ 유효한 토큰');
    return true;
  } catch (error) {
    console.error('❌ 토큰 검증 오류:', error);
    logout(); // 잘못된 토큰 정리
    return false;
  }
};

/**
 * 로그아웃 처리
 * 모든 토큰 삭제 후 로그인 페이지로 이동
 */
export const logout = () => {
  console.log('🚪 로그아웃 처리 시작');
  
  // 모든 가능한 토큰 키 삭제
  TOKEN_KEYS.forEach(key => {
    if (localStorage.getItem(key)) {
      localStorage.removeItem(key);
      console.log(`🗑️ ${key} 삭제됨`);
    }
  });
  
  // ✅ 추가적으로 사용자 관련 캐시 데이터도 정리 (프로필사진 문제 해결)
  localStorage.removeItem('userInfo');
  localStorage.removeItem('userPreferences');
  localStorage.removeItem('favoriteCache');
  localStorage.removeItem('hikingStatsCache');
  
  console.log('✅ 로그아웃 완료, 페이지 새로고침과 함께 로그인 페이지로 이동');
  
  // ✅ 강제 페이지 새로고침으로 완전한 상태 초기화
  window.location.href = '/login';
  
  // 추가 보장: 새로고침 후에도 캐시 클리어
  setTimeout(() => {
    window.location.reload();
  }, 100);
};

/**
 * API 호출용 헤더 생성
 * @returns {Object} Authorization 헤더 객체
 */
export const getAuthHeaders = () => {
  const token = getToken();
  if (!token) {
    return {};
  }
  
  return {
    'X-AUTH-TOKEN': token,
    'Content-Type': 'application/json'
  };
};

/**
 * 인증이 필요한 API 호출 래퍼
 * @param {string} url API URL
 * @param {Object} options fetch 옵션
 * @returns {Promise} fetch Promise
 */
export const authenticatedFetch = async (url, options = {}) => {
  const headers = {
    ...getAuthHeaders(),
    ...options.headers
  };
  
  const response = await fetch(url, {
    ...options,
    headers
  });
  
  // 401 Unauthorized 처리
  if (response.status === 401) {
    console.log('🔒 인증 실패, 로그아웃 처리');
    logout();
    throw new Error('인증이 만료되었습니다. 다시 로그인해주세요.');
  }
  
  return response;
};

/**
 * 디버깅용 인증 상태 정보
 * @returns {Object} 디버깅 정보
 */
export const getAuthDebugInfo = () => {
  const token = getToken();
  const userInfo = getUserInfo();
  const isLoggedIn = isAuthenticated();
  
  return {
    hasToken: !!token,
    tokenPreview: token ? token.substring(0, 30) + '...' : null,
    userInfo: userInfo,
    isAuthenticated: isLoggedIn,
    tokenKeys: TOKEN_KEYS.map(key => ({
      key,
      exists: !!localStorage.getItem(key)
    }))
  };
};

/**
 * 보호된 페이지 접근 시 인증 확인 후 리다이렉트
 * @param {string} message 확인 메시지
 * @returns {boolean} 인증 성공 여부
 */
export const requireAuth = (message = "로그인이 필요한 서비스입니다. 로그인 페이지로 이동하시겠습니까?") => {
  if (!isAuthenticated()) {
    console.log('🔒 보호된 페이지 접근 시도 - 인증 필요');
    
    const shouldRedirect = window.confirm(message);
    
    if (shouldRedirect) {
      // ✅ 즉시 리다이렉트 (두 번 확인 방지)
      window.location.href = '/login';
      return false; // 함수 즉시 종료
    } else {
      // 거부하면 메인 페이지로
      window.location.href = '/mountain';
      return false; // 함수 즉시 종료
    }
  }
  return true; // 인증 성공
};
