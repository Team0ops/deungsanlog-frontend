import { useNavigate } from "react-router-dom";
import GreenButton from "shared/ui/greenButton";

const HotMountainCard = ({ mountain }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/mountain/${mountain.mountainName}`);
  };

  return (
    <GreenButton
      onClick={handleClick}
      style={{
        display: "inline-block",
        minWidth: "90px",
        width: "auto",
        padding: "0.6em 1.2em",
        background: "#8aad8c",
        border: "none",
        color: "#f3f3f3",
        borderRadius: "14px",
        fontWeight: 700,
        fontSize: "1.08rem",
        whiteSpace: "nowrap",
        margin: 2, // gap으로만 간격 조정
      }}
    >
      #{mountain.mountainName}
    </GreenButton>
  );
};

export default HotMountainCard;
