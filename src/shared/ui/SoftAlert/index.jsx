import { useState } from "react";

// prop-types is a library for typechecking of props
import PropTypes from "prop-types";

// @mui material components
import Fade from "@mui/material/Fade";

// Soft UI Dashboard React components
import SoftBox from "shared/ui/SoftBox";

// Custom styles for the SoftAlert
import SoftAlertRoot from "shared/ui/SoftAlert/SoftAlertRoot";
import SoftAlertCloseIcon from "shared/ui/SoftAlert/SoftAlertCloseIcon";

function SoftAlert({ color, dismissible, children, ...rest }) {
  const [alertStatus, setAlertStatus] = useState("mount");

  const handleAlertStatus = () => setAlertStatus("fadeOut");

  // The base template for the alert
  const alertTemplate = (mount = true) => (
    <Fade in={mount} timeout={300}>
      <SoftAlertRoot ownerState={{ color }} {...rest}>
        <SoftBox display="flex" alignItems="center" color="white">
          {children}
        </SoftBox>
        {dismissible ? (
          <SoftAlertCloseIcon onClick={mount ? handleAlertStatus : null}>
            &times;
          </SoftAlertCloseIcon>
        ) : null}
      </SoftAlertRoot>
    </Fade>
  );

  switch (true) {
    case alertStatus === "mount":
      return alertTemplate();
    case alertStatus === "fadeOut":
      setTimeout(() => setAlertStatus("unmount"), 400);
      return alertTemplate(false);
    default:
      alertTemplate();
      break;
  }

  return null;
}

// Setting default values for the props of SoftAlert
SoftAlert.defaultProps = {
  color: "info",
  dismissible: false,
};

// Typechecking props of the SoftAlert
SoftAlert.propTypes = {
  color: PropTypes.oneOf([
    "primary",
    "secondary",
    "info",
    "success",
    "warning",
    "error",
    "light",
    "dark",
  ]),
  dismissible: PropTypes.bool,
  children: PropTypes.node.isRequired,
};

export default SoftAlert;
