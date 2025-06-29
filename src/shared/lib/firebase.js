// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging"; // 🔔 FCM용 추가!
// import { getAnalytics } from "firebase/analytics"; // 📊 분석 기능은 선택사항

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDbWKy1mG0Vjmt0Ii8Lhkmr1EM7mxjNoYQ",
  authDomain: "deungsanlog-notifications.firebaseapp.com",
  projectId: "deungsanlog-notifications",
  storageBucket: "deungsanlog-notifications.firebasestorage.app",
  messagingSenderId: "738985056674", // 🎯 FCM의 핵심!
  appId: "1:738985056674:web:b80bf1c3327bfa1081bafb",
  measurementId: "G-9B387N482S"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Cloud Messaging and get a reference to the service
export const messaging = getMessaging(app); // 🚀 FCM 메시징 객체 내보내기

// Analytics는 선택사항 (알림과는 무관)
// const analytics = getAnalytics(app);

export default app;