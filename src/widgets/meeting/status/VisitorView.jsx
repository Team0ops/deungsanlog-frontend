import { Box, Button } from "@mui/material";

const VisitorView = ({ onApply }) => {
  return (
    <Box>
      <Button
        size="large"
        variant="contained"
        color="primary"
        onClick={onApply}
        sx={{
          outline: "none",
          boxShadow: "none",
          "&:focus": { outline: "none" },
        }}
      >
        참가 신청하기
      </Button>
    </Box>
  );
};

export default VisitorView;
