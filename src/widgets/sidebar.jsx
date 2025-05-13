import { Link } from "react-router-dom";
import Icons from "../shared/assets/icons";
import Color from "../app/styles/color";

const Sidebar = () => {
  return (
    <aside
      className="sidebar"
      style={{
        width: "220px",
        backgroundColor: Color.background,
        padding: "1rem",
        height: "100vh",
      }}
    >
      <ul style={{ listStyle: "none", padding: 0 }}>
        <li>
          <Link
            to="/"
            style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
          >
            <img src={Icons.mountain} alt="산" width={20} /> 산 정보
          </Link>
        </li>
        <li>
          <Link
            to="/log"
            style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
          >
            <img src={Icons.note} alt="등산 기록" width={20} /> 등산 기록
          </Link>
        </li>
        <li>
          <Link
            to="/community"
            style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
          >
            <img src={Icons.users} alt="커뮤니티" width={20} /> 커뮤니티
          </Link>
        </li>
        <li>
          <Link
            to="/ormi"
            style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
          >
            <img src={Icons.chat} alt="오르미" width={20} /> 오르미
          </Link>
        </li>
      </ul>
    </aside>
  );
};

export default Sidebar;
