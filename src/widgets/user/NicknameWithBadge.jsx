import { useEffect, useState } from "react";
import axiosInstance from "shared/lib/axiosInstance";

const NicknameWithBadge = ({ userId, nickname: nicknameProp, style = {} }) => {
  const [badgeInfo, setBadgeInfo] = useState(null);
  const [nickname, setNickname] = useState(nicknameProp);

  useEffect(() => {
    if (userId) {
      // 닉네임이 없으면 API로 조회
      if (!nicknameProp) {
        axiosInstance
          .get(`/user-service/${userId}/nickname`)
          .then((res) => setNickname(res.data))
          .catch(() => setNickname(userId));
      } else {
        setNickname(nicknameProp);
      }

      // 배지 정보 조회
      axiosInstance
        .get(`/record-service/users/${userId}/badge-profile`)
        .then((res) => setBadgeInfo(res.data))
        .catch(() => setBadgeInfo(null));
    }
  }, [userId, nicknameProp]);

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "0.03rem",
        ...style,
      }}
    >
      {nickname}
      {badgeInfo && (
        <img
          src={`/assets/badges/Badge_0${badgeInfo.stage}.svg`}
          alt="등산 배지"
          style={{
            width: 20,
            height: 20,
            marginLeft: 2,
            verticalAlign: "middle",
            position: "relative",
            top: "-2px",
          }}
        />
      )}
    </span>
  );
};

export default NicknameWithBadge;
