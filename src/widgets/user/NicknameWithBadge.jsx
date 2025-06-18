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
            marginLeft: 2, // 더 좁게
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
