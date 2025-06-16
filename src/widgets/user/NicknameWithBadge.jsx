import { useEffect, useState } from "react";

const NicknameWithBadge = ({ userId, nickname, style = {} }) => {
  const [badgeInfo, setBadgeInfo] = useState(null);

  useEffect(() => {
    if (userId) {
      fetch(
        `http://localhost:8080/record-service/users/${userId}/badge-profile`
      )
        .then((res) => res.json())
        .then((data) => setBadgeInfo(data))
        .catch(() => setBadgeInfo(null));
    }
  }, [userId]);

  return (
    <span
      style={{ display: "flex", alignItems: "center", gap: "0.3rem", ...style }}
    >
      {nickname}
      {badgeInfo && (
        <img
          src={`/assets/badges/Badge_0${badgeInfo.stage}.svg`}
          alt="등산 배지"
          style={{
            width: 22,
            height: 22,
            marginLeft: 4,
            verticalAlign: "middle",
            position: "relative",
            top: "-2px", // 배지를 약간 위로 올림
          }}
        />
      )}
    </span>
  );
};

export default NicknameWithBadge;
