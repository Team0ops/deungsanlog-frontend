import { useState } from "react";
import LogHeader from "widgets/LogHeader/LogHeader";
import { Box } from "@mui/material";

const LogViewPage = () => {
  const [sortOption, setSortOption] = useState("latest");
  const userId = 11;

  return (
    <Box display="flex" justifyContent="center" width="100%">
      <LogHeader
        userId={userId}
        sortOption={sortOption}
        setSortOption={setSortOption}
      />
    </Box>
  );
};

export default LogViewPage;
