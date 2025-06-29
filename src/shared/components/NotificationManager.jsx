import React, { useEffect } from "react";
import {
  requestNotificationPermission,
  setupForegroundMessageListener,
  registerPendingFcmToken,
} from "shared/lib/fcm";
import { isAuthenticated } from "shared/lib/auth";

const NotificationManager = () => {
  useEffect(() => {
    const initializeFCM = async () => {
      console.log("🔔 FCM 초기화 시작");

      // 로그인된 사용자만 FCM 초기화
      if (!isAuthenticated()) {
        console.log("⚠️ 로그인하지 않은 사용자, FCM 초기화 스킵");
        return;
      }

      try {
        // FCM 권한 요청 및 토큰 등록
        const success = await requestNotificationPermission();

        if (success) {
          // 포그라운드 메시지 리스너 설정
          setupForegroundMessageListener();

          // 대기 중인 토큰 등록 처리
          await registerPendingFcmToken();

          console.log("✅ FCM 초기화 완료");
        } else {
          console.log("❌ FCM 초기화 실패 - 알림 권한 거부됨");
        }
      } catch (error) {
        console.error("❌ FCM 초기화 실패:", error);
      }
    };

    initializeFCM();
  }, []);

  // 새 알림 이벤트 리스너
  useEffect(() => {
    const handleNewNotification = (event) => {
      console.log("🆕 새 알림 수신:", event.detail);
    };

    window.addEventListener("newNotification", handleNewNotification);

    return () => {
      window.removeEventListener("newNotification", handleNewNotification);
    };
  }, []);

  // UI 렌더링 없이 null 반환
  return null;
};

export default NotificationManager;
