// Firebase 9 버전 호환성 모드 (Service Worker용)
/* eslint-env serviceworker */
/* eslint-disable no-undef */

importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

// 똑같은 설정값 사용
const firebaseConfig = {
  apiKey: "AIzaSyDbWKy1mG0Vjmt0Ii8Lhkmr1EM7mxjNoYQ",
  authDomain: "deungsanlog-notifications.firebaseapp.com",
  projectId: "deungsanlog-notifications",
  storageBucket: "deungsanlog-notifications.firebasestorage.app",
  messagingSenderId: "738985056674",
  appId: "1:738985056674:web:b80bf1c3327bfa1081bafb"
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

// 백그라운드 알림 처리
messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] 백그라운드 메시지 받음: ', payload);
  
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/images/logo_mountain.png', // 로고 이미지 경로
    badge: '/images/badge-icon.png',   // 뱃지 아이콘
    data: payload.data // 클릭 시 처리할 데이터
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// 알림 클릭 처리 (페이지 라우팅)
self.addEventListener('notificationclick', (event) => {
  console.log('[firebase-messaging-sw.js] 알림 클릭됨: ', event);
  
  event.notification.close();

  // 클릭 시 해당 페이지로 이동
  const clickAction = event.notification.data?.clickAction || '/';
  
  event.waitUntil(
    clients.openWindow(clickAction)
  );
});