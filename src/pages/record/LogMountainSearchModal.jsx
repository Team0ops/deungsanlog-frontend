import { Box, Typography, Modal } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import SoftInput from "shared/ui/SoftInput";
import GreenButton from "shared/ui/greenButton";
import { useState } from "react";
import axiosInstance from "shared/lib/axiosInstance";

const LogMountainSearchModal = ({ open, onClose, onSelect }) => {
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const [mountainList, setMountainList] = useState([]);
  const [selectedMountain, setSelectedMountain] = useState(null);

  // 산 검색 API 호출
  const fetchMountainList = async (keyword) => {
    try {
      const res = await axiosInstance.get("/mountain-service/record/search", {
        params: { keyword },
      });
      setMountainList(Array.isArray(res.data) ? res.data : []);
    } catch {
      setMountainList([]);
    }
  };

  // 검색 인풋 변경 시
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearch(value);
    setError("");
    if (value.trim()) {
      fetchMountainList(value.trim());
    } else {
      setMountainList([]);
    }
  };

  // 직접 입력 적용
  const handleApply = () => {
    if (!search.trim() && !selectedMountain) {
      setError("산 이름을 입력하거나 선택해주세요.");
      return;
    }
    if (selectedMountain) {
      onSelect({
        id: selectedMountain.id,
        name: selectedMountain.name,
        location: selectedMountain.location,
      });
    } else {
      onSelect({ id: null, name: search.trim(), location: "" });
    }
    onClose();
  };

  // 리스트에서 산 선택
  const handleSelectMountain = (mountain) => {
    setSearch(mountain.name);
    setSelectedMountain(mountain);
    setMountainList([]);
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        maxWidth="100vw"
        width="100%"
        p={{ xs: "1rem", md: "2rem" }}
        boxShadow={2}
        borderRadius={3}
        bgcolor="#ffffff"
        sx={{
          maxWidth: { xs: "100vw", md: "700px" },
          minHeight: "60vh",
          maxHeight: "90vh",
          margin: "5vh auto",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          outline: "none",
        }}
      >
        <Typography
          variant="body1"
          color="#4b8161"
          fontWeight={600}
          mb={3}
          sx={{ textAlign: "center", fontSize: "1.05rem" }}
        >
          등산 이야기에서는 우리나라 100대 산과 국립공원의 정보만 제공합니다.
          <br />
          검색 후 나오지 않는다면, 직접 입력해주시길 바랍니다 :)
        </Typography>
        <SoftInput
          value={search}
          onChange={handleSearchChange}
          placeholder="산 이름을 검색하세요"
          icon={{ component: <SearchIcon />, direction: "right" }}
          size="large"
          style={{
            fontSize: "1.2rem",
            py: 2,
            px: 3,
          }}
          fullWidth
          onIconClick={() => {
            if (search.trim()) fetchMountainList(search.trim());
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              if (search.trim()) fetchMountainList(search.trim());
            }
          }}
        />
        <Box
          sx={{
            flex: 1,
            overflowY: "auto",
            minHeight: 0,
            mb: 2,
          }}
        >
          {mountainList.map((mountain) => (
            <Box
              key={mountain.id}
              onClick={() => handleSelectMountain(mountain)}
              sx={{
                cursor: "pointer",
                padding: "0.7rem 1rem",
                borderRadius: "8px",
                backgroundColor: "#f0f9f3",
                marginTop: "0.5rem",
                fontSize: "0.97rem",
                lineHeight: 1.5,
                color: "#35523d",
                "&:hover": {
                  backgroundColor: "#e0f2ea",
                },
              }}
            >
              <span style={{ fontWeight: 600 }}>{mountain.name}</span>
              <span
                style={{
                  fontWeight: 400,
                  marginLeft: 4,
                  fontSize: "0.93rem",
                  color: "#666",
                }}
              >
                ({mountain.location})
              </span>
            </Box>
          ))}
          {error && (
            <Typography
              color="#dc3545"
              fontSize="0.95rem"
              mt={1}
              mb={-1}
              textAlign="center"
            >
              {error}
            </Typography>
          )}
        </Box>
        <GreenButton
          style={{
            marginTop: "2rem",
            background: "#70a784",
            color: "#fff",
            fontWeight: 600,
            fontSize: "1.1rem",
            borderRadius: "12px",
          }}
          fullWidth
          onClick={handleApply}
        >
          적용
        </GreenButton>
        <GreenButton
          style={{
            marginTop: "1rem",
            background: "#58806f",
            fontWeight: 600,
            fontSize: "1.05rem",
            borderRadius: "12px",
          }}
          fullWidth
          onClick={onClose}
        >
          뒤로가기
        </GreenButton>
      </Box>
    </Modal>
  );
};

export default LogMountainSearchModal;
