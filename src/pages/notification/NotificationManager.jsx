//app.jsx 경로 수정하기!!!!!!!!!!!!!!!!(까먹지말기)

import React, { useEffect, useState } from "react";
import {
  requestNotificationPermission,
  setupForegroundMessageListener,
  registerPendingFcmToken,
} from "shared/lib/fcm";
import { isAuthenticated } from "shared/lib/auth";

const NotificationManager = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showPermissionRequest, setShowPermissionRequest] = useState(false);

  useEffect(() => {
    const checkPermissionAndInitialize = async () => {
      console.log("🔔 알림 권한 상태 확인");

      // 현재 알림 권한 상태 확인
      const currentPermission = Notification.permission;

      console.log("📱 현재 알림 권한:", currentPermission);

      // 로그인된 사용자만 처리
      if (!isAuthenticated()) {
        console.log("⚠️ 로그인하지 않은 사용자, 알림 권한 요청 스킵");
        return;
      }

      // 권한이 거부된 경우 권한 요청 UI 표시
      if (currentPermission === "denied") {
        console.log("❌ 알림 권한이 거부됨, 권한 요청 UI 표시");
        setShowPermissionRequest(true);
        return;
      }

      // 권한이 허용되지 않은 경우 권한 요청 UI 표시
      if (currentPermission === "default") {
        console.log("⏳ 알림 권한이 요청되지 않음, 권한 요청 UI 표시");
        setShowPermissionRequest(true);
        return;
      }

      // 권한이 허용된 경우 FCM 초기화
      if (currentPermission === "granted") {
        console.log("✅ 알림 권한이 허용됨, FCM 초기화 시작");
        await initializeFCM();
      }
    };

    checkPermissionAndInitialize();
  }, []);

  const initializeFCM = async () => {
    try {
      // FCM 권한 요청 및 토큰 등록
      const success = await requestNotificationPermission();

      if (success) {
        // 포그라운드 메시지 리스너 설정
        setupForegroundMessageListener();

        // 대기 중인 토큰 등록 처리
        await registerPendingFcmToken();

        setIsInitialized(true);
        setShowPermissionRequest(false);
        console.log("✅ FCM 초기화 완료");
      }
    } catch (error) {
      console.error("❌ FCM 초기화 실패:", error);
    }
  };

  const handleRequestPermission = async () => {
    console.log("🔔 사용자가 알림 권한 요청 버튼 클릭");
    await initializeFCM();
  };

  const handleDismissPermissionRequest = () => {
    setShowPermissionRequest(false);
  };

  // 새 알림 이벤트 리스너
  useEffect(() => {
    const handleNewNotification = (event) => {
      console.log("🆕 새 알림 수신:", event.detail);
      setUnreadCount((prev) => prev + 1);
    };

    window.addEventListener("newNotification", handleNewNotification);

    return () => {
      window.removeEventListener("newNotification", handleNewNotification);
    };
  }, []);

  // 권한 요청 UI 표시
  if (showPermissionRequest && isAuthenticated()) {
    return (
      <div
        style={{
          position: "fixed",
          top: "20px",
          right: "20px",
          zIndex: 9999,
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "white",
          padding: "20px",
          borderRadius: "12px",
          boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
          maxWidth: "300px",
          fontSize: "14px",
          lineHeight: "1.4",
        }}
      >
        <div style={{ marginBottom: "15px" }}>
          <div
            style={{
              fontSize: "18px",
              fontWeight: "bold",
              marginBottom: "8px",
            }}
          >
            🔔 알림 받기
          </div>
          <div>
            모임 알림, 댓글 알림 등<br />
            중요한 소식을 놓치지 마세요!
          </div>
        </div>

        <div style={{ display: "flex", gap: "10px" }}>
          <button
            onClick={handleRequestPermission}
            style={{
              background: "#4CAF50",
              color: "white",
              border: "none",
              padding: "8px 16px",
              borderRadius: "6px",
              cursor: "pointer",
              fontWeight: "bold",
              flex: 1,
            }}
          >
            알림 허용
          </button>
          <button
            onClick={handleDismissPermissionRequest}
            style={{
              background: "rgba(255,255,255,0.2)",
              color: "white",
              border: "none",
              padding: "8px 12px",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          >
            나중에
          </button>
        </div>
      </div>
    );
  }

  // FCM이 초기화되지 않은 경우 렌더링하지 않음
  if (!isInitialized) {
    return null;
  }

  return (
    <div
      style={{
        position: "fixed",
        top: "20px",
        right: "20px",
        zIndex: 9999,
        background: "rgba(0, 0, 0, 0.8)",
        color: "white",
        padding: "10px",
        borderRadius: "5px",
        fontSize: "12px",
      }}
    >
      🔔 FCM 활성화됨 | 읽지 않은 알림: {unreadCount}
    </div>
  );
};

export default NotificationManager;
