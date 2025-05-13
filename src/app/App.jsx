import { Routes, Route } from "react-router-dom";
import Sidebar from "../widgets/sidebar";
import Color from "./styles/color";
import MountainInfoPage from "../pages/mountainInfoPage";
import HikingLogPage from "../pages/hikingLogPage";
import CommunityPage from "../pages/communityPage";
import OrmiPage from "../pages/ormiPage";

const App = () => {
  return (
    <div
      className="app-container"
      style={{
        display: "flex",
        height: "100vh",
      }}
    >
      <Sidebar />
      <main
        className="main-content"
        style={{ flex: 1, padding: "2rem", backgroundColor: Color.primary }}
      >
        <Routes>
          <Route path="/" element={<MountainInfoPage />} />
          <Route path="/log" element={<HikingLogPage />} />
          <Route path="/community" element={<CommunityPage />} />
          <Route path="/ormi" element={<OrmiPage />} />
        </Routes>
      </main>
    </div>
  );
};

export default App;
