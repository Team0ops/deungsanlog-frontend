import SoftBox from "shared/ui/SoftBox";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import MenuIcon from "@mui/icons-material/Menu";

const SidenavToggleButton = ({ miniSidenav, transparentSidenav, onClick }) => {
  return (
    <SoftBox
      onClick={onClick}
      sx={() => ({
        position: "fixed",
        top: "2rem",
        left: miniSidenav ? "140px" : "290px",
        transform: "translateX(-50%)",
        zIndex: 1300,
        width: "32px",
        height: "32px",
        borderRadius: "8px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        transition: "left 0.3s ease, background-color 0.3s ease",
        backgroundColor: "rgba(255, 255, 255, 0.8)",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
        color: transparentSidenav ? "#000" : "#000",
      })}
    >
      {miniSidenav ? (
        <MenuIcon fontSize="small" />
      ) : (
        <ChevronLeftIcon fontSize="small" />
      )}
    </SoftBox>
  );
};

export default SidenavToggleButton;
