export function loadKakaoMap({
  containerId = "map",
  lat = 33.450701,
  lng = 126.570667,
  level = 3,
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
