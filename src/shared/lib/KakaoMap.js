export function loadKakaoMap({
  containerId = "map",
  lat = 36.0, // ✅ 한국 전체 중심 (제주도까지 포함)
  lng = 127.8, // ✅ 한국 중앙 경도
  level = 12, // ✅ 한국 전체가 보이는 레벨 (10-11)
}) {
  const container = document.getElementById(containerId);
  if (!container || !window.kakao?.maps) return;

  const options = {
    center: new window.kakao.maps.LatLng(lat, lng),
    level,
    scrollwheel: true,
    draggable: true,
    disableDoubleClickZoom: false,
  };

  const map = new window.kakao.maps.Map(container, options);

  // 지형 정보 지도 타입 적용
  map.addOverlayMapTypeId(window.kakao.maps.MapTypeId.TERRAIN);

  return map;
}

// ✅ 지도 레벨 관련 유틸리티 함수들

/**
 * 지도 레벨을 부드럽게 변경
 * @param {object} map - 카카오맵 인스턴스
 * @param {number} level - 변경할 레벨 (1-14)
 */
export function setMapLevel(map, level) {
  if (!map || level < 1 || level > 14) return;
  map.setLevel(level);
}

/**
 * 지도 중심을 부드럽게 이동
 * @param {object} map - 카카오맵 인스턴스
 * @param {number} lat - 위도
 * @param {number} lng - 경도
 * @param {number} level - 줌 레벨 (선택사항)
 */
export function moveMapCenter(map, lat, lng, level = 10) {
  if (!map || !lat || !lng) return;

  const moveLatLon = new window.kakao.maps.LatLng(lat, lng);
  map.setCenter(moveLatLon);

  if (level) {
    map.setLevel(level);
  }
}

/**
 * 현재 지도 레벨 가져오기
 * @param {object} map - 카카오맵 인스턴스
 * @returns {number} 현재 지도 레벨
 */
export function getCurrentMapLevel(map) {
  if (!map) return null;
  return map.getLevel();
}

/**
 * 지도 범위에 맞게 레벨 자동 조정
 * @param {object} map - 카카오맵 인스턴스
 * @param {Array} positions - 위치 배열 [{lat, lng}, ...]
 */
export function fitMapToBounds(map, positions) {
  if (!map || !positions || positions.length === 0) return;

  const bounds = new window.kakao.maps.LatLngBounds();

  positions.forEach((pos) => {
    bounds.extend(new window.kakao.maps.LatLng(pos.lat, pos.lng));
  });

  map.setBounds(bounds);
}

// ✅ 산 마커 관련 유틸리티 함수들

/**
 * 해발 고도별 마커 이미지 생성
 * @param {number} elevation - 해발 고도
 * @returns {object} 카카오맵 MarkerImage 객체
 */
export function createMountainMarkerImage(elevation) {
  let imageSrc, imageSize, imageOption;

  if (elevation >= 1500) {
    // 고산 (1500m 이상) - 큰 산 마커
    imageSrc = "/images/mountain-high.png";
    imageSize = new window.kakao.maps.Size(40, 40);
    imageOption = { offset: new window.kakao.maps.Point(20, 40) };
  } else if (elevation >= 800) {
    // 중산 (800m ~ 1500m) - 중간 산 마커
    imageSrc = "/images/mountain-medium.png";
    imageSize = new window.kakao.maps.Size(32, 32);
    imageOption = { offset: new window.kakao.maps.Point(16, 32) };
  } else {
    // 저산 (800m 미만) - 작은 산 마커
    imageSrc = "/images/mountain-small.png";
    imageSize = new window.kakao.maps.Size(24, 24);
    imageOption = { offset: new window.kakao.maps.Point(12, 24) };
  }

  return new window.kakao.maps.MarkerImage(imageSrc, imageSize, imageOption);
}

/**
 * 산 고도별 분류 정보 가져오기
 * @param {number} elevation - 해발 고도
 * @returns {object} {type, color, icon, description}
 */
export function getMountainGradeInfo(elevation) {
  if (elevation >= 1500) {
    return {
      type: "고산",
      color: "#dc3545",
      icon: "🏔️",
      description: "1500m 이상의 높은 산",
    };
  }
  if (elevation >= 800) {
    return {
      type: "중산",
      color: "#fd7e14",
      icon: "⛰️",
      description: "800m~1500m의 중간 높이 산",
    };
  }
  return {
    type: "저산",
    color: "#198754",
    icon: "🗻",
    description: "800m 미만의 낮은 산",
  };
}

/**
 * 산 마커 생성 및 클릭 이벤트 등록
 * @param {object} map - 카카오맵 인스턴스
 * @param {object} mountain - 산 정보 객체
 * @param {function} onClickCallback - 마커 클릭 시 실행할 콜백 함수
 * @returns {object} 생성된 마커 객체
 */
export function createMountainMarker(map, mountain, onClickCallback) {
  if (!map || !mountain || !mountain.latitude || !mountain.longitude)
    return null;

  const markerPosition = new window.kakao.maps.LatLng(
    mountain.latitude,
    mountain.longitude
  );

  // 고도별 마커 이미지 적용
  const markerImage = createMountainMarkerImage(mountain.elevation || 0);

  const marker = new window.kakao.maps.Marker({
    position: markerPosition,
    title: `${mountain.name} (${mountain.elevation}m)`,
    image: markerImage,
  });

  marker.setMap(map);

  // 클릭 이벤트 등록
  if (onClickCallback) {
    window.kakao.maps.event.addListener(marker, "click", () => {
      onClickCallback(mountain);
    });
  }

  // ====== 라벨 색상 설정 ======
  let labelBg = "#e8f5e9";
  let labelColor = "#198754";
  if (mountain.elevation >= 1500) {
    labelBg = "#ffe5e5";
    labelColor = "#dc3545";
  } else if (mountain.elevation >= 800) {
    labelBg = "#fff3e0";
    labelColor = "#fd7e14";
  }

  // ====== 커스텀 오버레이(라벨) 추가 ======
  const labelDiv = document.createElement("div");
  labelDiv.innerText = `${mountain.name}\n(${mountain.elevation}m)`;
  labelDiv.style.cssText = `
    padding: 1px 4px;
    background: ${labelBg};
    border-radius: 4px;
    border: 1px solid #bbb;
    font-size: 11px;
    color: ${labelColor};
    font-weight: 500;
    box-shadow: 0 1px 2px rgba(219, 236, 192, 0.16);
    margin-top: 6px;
    white-space: nowrap;
    cursor: pointer;
  `;

  // ✅ 라벨 클릭도 onClickCallback 호출
  labelDiv.addEventListener("click", () => {
    if (onClickCallback) {
      onClickCallback(mountain);
    }
  });

  const labelOverlay = new window.kakao.maps.CustomOverlay({
    position: markerPosition,
    content: labelDiv,
    xAnchor: 0.5,
    yAnchor: 1,
    zIndex: 10,
  });

  // 지도 레벨이 10 이하일 때만 표시
  function updateLabelVisibility() {
    if (map.getLevel() <= 10) {
      labelOverlay.setMap(map);
    } else {
      labelOverlay.setMap(null);
    }
  }
  updateLabelVisibility();
  window.kakao.maps.event.addListener(
    map,
    "zoom_changed",
    updateLabelVisibility
  );

  return marker;
}

/**
 * 여러 산 마커들을 한번에 생성
 * @param {object} map - 카카오맵 인스턴스
 * @param {Array} mountains - 산 정보 배열
 * @param {function} onClickCallback - 마커 클릭 시 실행할 콜백 함수
 * @returns {Array} 생성된 마커 배열
 */
export function createMountainMarkers(map, mountains, onClickCallback) {
  if (!map || !mountains || mountains.length === 0) return [];

  console.log("🏔️ 마커 생성 시작:", mountains.length, "개의 산");

  const markers = mountains
    .map((mountain) => {
      const marker = createMountainMarker(map, mountain, onClickCallback);

      if (marker) {
        const gradeInfo = getMountainGradeInfo(mountain.elevation);
        console.log(
          `📍 마커 생성: ${mountain.name} (${mountain.elevation}m) - ${gradeInfo.type}`
        );
      }

      return marker;
    })
    .filter((marker) => marker !== null);

  console.log("✅ 마커 생성 완료:", markers.length, "개");
  return markers;
}

// ✅ 상수 정의
export const MOUNTAIN_GRADE_THRESHOLDS = {
  HIGH: 1500, // 고산
  MEDIUM: 800, // 중산
};

export const DEFAULT_MAP_SETTINGS = {
  KOREA_CENTER: {
    lat: 36.2, // 한국 중앙 (대전 근처)
    lng: 127.8, // 한국 중앙
    level: 7, // 적절한 확대 레벨
  },
  JEJU_CENTER: {
    lat: 33.450701,
    lng: 126.570667,
    level: 3,
  },
};
