/**
=========================================================
* Soft UI Dashboard React - v3.1.0
=========================================================

* Product Page: https://www.creative-tim.com/product/soft-ui-dashboard-pro-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

// Soft UI Dashboard React base styles
import typography from "theme/base/typography";
import borders from "theme/base/borders";
import colors from "theme/base/colors";

// Soft UI Dashboard React helper functions
import pxToRem from "theme/functions/pxToRem";

const { size, fontWeightRegular } = typography;
const { borderRadius } = borders;
const { dark } = colors;

const tab = {
  styleOverrides: {
    root: {
      display: "flex",
      alignItems: "center",
      flexDirection: "row",
      flex: "1 1 auto",
      textAlign: "center",
      maxWidth: "unset !important",
      minWidth: "unset !important",
      minHeight: "unset !important",
      fontSize: size.md,
      fontWeight: fontWeightRegular,
      textTransform: "none",
      lineHeight: "inherit",
      padding: pxToRem(4),
      borderRadius: borderRadius.md,
      color: `${dark.main} !important`,
      opacity: "1 !important",

      "& .material-icons, .material-icons-round": {
        marginBottom: "0 !important",
        marginRight: pxToRem(4),
      },

      "& svg": {
        marginBottom: "0 !important",
        marginRight: pxToRem(6),
      },
    },

    labelIcon: {
      paddingTop: pxToRem(4),
    },
  },
};

export default tab;
