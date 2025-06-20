import { Box } from "@mui/material";
import { useState, useEffect } from "react";
import axios from "axios";

const MountainSearchModal = ({ searchKeyword, onSelect }) => {
  const [mountainList, setMountainList] = useState([]);

  const fetchMountainList = async (keyword) => {
    if (!keyword || keyword.length < 1) {
      setMountainList([]);
      return;
    }

    try {
      const res = await axios.get(
        `http://localhost:8080/mountain-service/record/search`,
        { params: { keyword } }
      );
      setMountainList(Array.isArray(res.data) ? res.data : []);
    } catch {
      setMountainList([]);
    }
  };

  useEffect(() => {
    fetchMountainList(searchKeyword);
  }, [searchKeyword]);

  const handleSelectMountain = (mountain) => {
    onSelect(mountain);
  };

  if (!mountainList || mountainList.length === 0) {
    return null;
  }

  return (
    <Box
      sx={{
        position: 'absolute',
        top: '100%',
        left: 0,
        right: 0,
        backgroundColor: '#ffffff',
        borderRadius: '0 0 0.5rem 0.5rem',
        boxShadow: '0 0.25rem 1rem rgba(0,0,0,0.15)',
        maxHeight: '20rem',
        overflowY: 'auto',
        zIndex: 11,
        border: '0.1rem solid #e9ecef',
        opacity: 1,
      }}
    >
      {mountainList.map((mountain) => (
        <Box
          key={mountain.id}
          onClick={() => handleSelectMountain(mountain)}
          sx={{
            cursor: "pointer",
            padding: "clamp(0.8rem, 1.5vw, 1rem)",
            borderBottom: "0.1rem solid #f0f0f0",
            backgroundColor: '#ffffff',
            transition: 'all 0.2s ease',
            "&:hover": {
              backgroundColor: "#f8f9fa",
            },
            "&:last-child": {
              borderBottom: "none",
              borderRadius: '0 0 0.5rem 0.5rem',
            }
          }}
        >
          {/* ✅ 세로 레이아웃으로 변경 - 텍스트 잘림 방지 */}
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column', // ✅ 세로 배치
            gap: '0.3rem',
            width: '100%'
          }}>
            {/* 🏔️ 산 이름 (첫 번째 줄) */}
            <div style={{ 
              fontWeight: 700,
              fontSize: 'clamp(0.95rem, 1.7vw, 1.05rem)',
              color: '#1a73e8',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem'
            }}>
              🏔️ {mountain.name}
            </div>
            
            {/* 📍 위치 정보 (두 번째 줄) - 전체 너비 사용 */}
            <div style={{
              fontWeight: 400,
              fontSize: "clamp(0.8rem, 1.3vw, 0.9rem)",
              color: "#666",
              lineHeight: 1.4, // ✅ 줄 간격 추가
              wordBreak: 'keep-all', // ✅ 한글 단어 단위로 줄바꿈
              display: 'flex',
              alignItems: 'flex-start', // ✅ 위쪽 정렬
              gap: '0.4rem'
            }}>
                ({mountain.location})
            </div>
          </div>
        </Box>
      ))}
    </Box>
  );
};

export default MountainSearchModal;