import SoftBox from "shared/ui/SoftBox";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import MenuIcon from "@mui/icons-material/Menu";

const SidenavToggleButton = ({ miniSidenav, onClick }) => {
  return (
    <SoftBox
      onClick={onClick}
      sx={{
        position: "fixed",
        top: "2.0rem",
        left: miniSidenav ? "140px" : "290px",
        transform: "translateX(-50%)",
        zIndex: 1300,
        width: "32px",
        height: "32px",
        backgroundColor: "white",
        borderRadius: "8px",
        boxShadow: 2,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        transition: "left 0.3s ease",
      }}
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
