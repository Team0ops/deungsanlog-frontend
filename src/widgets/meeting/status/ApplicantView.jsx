import { Typography, Button } from "@mui/material";

const ApplicantView = ({ onCancel }) => {
  return (
    <>
      <Typography
        fontWeight={500}
        fontSize="0.95rem"
        color="text.secondary"
        mb={1}
      >
        ✨ 신청 대기 중입니다 ✨
      </Typography>
      <Button
        size="small"
        variant="outlined"
        onClick={onCancel}
        sx={{
          backgroundColor: "white",
          borderColor: "grey.300",
          color: "error.main",
          outline: "none",
          "&:hover": {
            borderColor: "#4caf50",
            backgroundColor: "#f6fff6",
          },
          "&:focus": {
            outline: "none",
            boxShadow: "none",
          },
          transition: "all 0.2s ease",
          borderRadius: 2,
          px: 2,
        }}
      >
        신청 취소
      </Button>
    </>
  );
};

export default ApplicantView;
