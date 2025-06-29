import { useState } from "react";
import axiosInstance from "shared/lib/axiosInstance";
import GreenButton from "shared/ui/greenButton";

const ProfileSection = ({ userInfo, setUserInfo }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    nickname: userInfo?.nickname || "",
    profileImgUrl: userInfo?.profileImgUrl || "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");

  // 파일 선택 핸들러
  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        // 5MB 제한
        alert("파일 크기는 5MB 이하로 선택해주세요.");
        return;
      }

      if (!file.type.startsWith("image/")) {
        alert("이미지 파일만 선택해주세요.");
        return;
      }

      setSelectedFile(file);

      // 미리보기 URL 생성
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewUrl(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // 프로필 수정 시작
  const handleEditStart = () => {
    setEditData({
      nickname: userInfo.nickname,
      profileImgUrl: userInfo.profileImgUrl || "",
    });
    setSelectedFile(null);
    setPreviewUrl("");
    setIsEditing(true);
  };

  // 프로필 수정 취소
  const handleEditCancel = () => {
    setEditData({
      nickname: userInfo.nickname,
      profileImgUrl: userInfo.profileImgUrl || "",
    });
    setSelectedFile(null);
    setPreviewUrl("");
    setIsEditing(false);
  };

  // 프로필 수정 저장
  const handleEditSave = async () => {
    if (!editData.nickname.trim()) {
      alert("닉네임을 입력해주세요.");
      return;
    }

    setIsLoading(true);
    try {
      const token =
        localStorage.getItem("X-AUTH-TOKEN") ||
        localStorage.getItem("authToken") ||
        localStorage.getItem("token");

      let profileImgUrl = editData.profileImgUrl;

      // 새 파일이 선택된 경우 업로드
      if (selectedFile) {
        const formData = new FormData();
        formData.append("file", selectedFile);
        formData.append("userId", userInfo.id);

        try {
          const uploadResponse = await axiosInstance.post(
            "/user-service/upload-profile-image",
            formData,
            {
              headers: {
                "X-AUTH-TOKEN": token,
                // axios는 FormData일 경우 Content-Type을 자동으로 설정해줌!
              },
            }
          );

          const uploadData = uploadResponse.data;
          profileImgUrl = uploadData.imageUrl;
        } catch (uploadError) {
          console.error("이미지 업로드 오류:", uploadError);
          alert("이미지 업로드에 실패했습니다. 프로필만 수정됩니다.");
        }
      }

      // 프로필 정보 업데이트
      const response = await axiosInstance.put(
        `/user-service/${userInfo.id}`,
        {
          nickname: editData.nickname,
          profileImgUrl: profileImgUrl,
        },
        {
          headers: {
            "Content-Type": "application/json",
            "X-AUTH-TOKEN": token,
          },
        }
      );

      // axios는 성공 시 자동으로 response.data를 반환
      setUserInfo(response.data);
      setIsEditing(false);
      setSelectedFile(null);
      setPreviewUrl("");
      alert("프로필이 성공적으로 수정되었습니다!");
    } catch (error) {
      console.error("프로필 수정 오류:", error);
      alert("프로필 수정 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  // 날짜 포맷팅
  const formatDate = (dateString) => {
    if (!dateString) return "정보 없음";
    const date = new Date(dateString);
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <section style={sectionStyle}>
      <h2 style={sectionTitleStyle}>👤 프로필 관리</h2>

      <div style={profileContentStyle}>
        {/* 프로필 이미지 */}
        <div style={profileImageContainerStyle}>
          <div style={profileImageWrapperStyle}>
            {previewUrl ? (
              <img
                src={previewUrl}
                alt="프로필 미리보기"
                style={profileImageStyle}
              />
            ) : userInfo.profileImgUrl ? (
              <img
                src={userInfo.profileImgUrl}
                alt="프로필 사진"
                style={profileImageStyle}
              />
            ) : (
              <div style={defaultProfileStyle}>
                <span style={{ fontSize: "clamp(2rem, 4vw, 3rem)" }}>👤</span>
              </div>
            )}
          </div>
          {isEditing && (
            <div style={imageEditSection}>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                style={{ display: "none" }}
                id="profile-image-input"
              />
              <label
                htmlFor="profile-image-input"
                style={fileSelectButtonStyle}
              >
                📁 사진 선택
              </label>
              {selectedFile && (
                <div style={fileInfoStyle}>
                  선택된 파일: {selectedFile.name}
                </div>
              )}
              <small style={helpTextStyle}>
                5MB 이하의 이미지 파일을 선택해주세요
              </small>
            </div>
          )}
        </div>

        {/* 프로필 정보 */}
        <div style={profileInfoStyle}>
          {/* 닉네임 */}
          <div style={infoItemStyle}>
            <label style={labelStyle}>닉네임</label>
            {isEditing ? (
              <input
                type="text"
                value={editData.nickname}
                onChange={(e) =>
                  setEditData({ ...editData, nickname: e.target.value })
                }
                style={inputStyle}
                placeholder="닉네임을 입력하세요"
              />
            ) : (
              <span style={valueStyle}>{userInfo.nickname}</span>
            )}
          </div>

          {/* 이메일 (읽기 전용) */}
          <div style={infoItemStyle}>
            <label style={labelStyle}>이메일</label>
            <span style={valueStyle}>{userInfo.email}</span>
            <small style={helpTextStyle}>이메일은 수정할 수 없습니다</small>
          </div>

          {/* 가입일 */}
          <div style={infoItemStyle}>
            <label style={labelStyle}>가입일</label>
            <span style={valueStyle}>{formatDate(userInfo.createdAt)}</span>
          </div>

          {/* 최근 활동일 */}
          <div style={infoItemStyle}>
            <label style={labelStyle}>최근 활동일</label>
            <span style={valueStyle}>{formatDate(userInfo.updatedAt)}</span>
          </div>

          {/* OAuth 제공자 정보 */}
          <div style={infoItemStyle}>
            <label style={labelStyle}>로그인 방식</label>
            <span style={valueStyle}>
              {userInfo.provider === "google" ? "🔍 Google" : userInfo.provider}
            </span>
          </div>
        </div>
      </div>

      {/* 액션 버튼들 */}
      <div style={actionButtonsStyle}>
        {isEditing ? (
          <>
            <button
              onClick={handleEditSave}
              disabled={isLoading}
              style={{ ...buttonStyle, ...saveButtonStyle }}
            >
              {isLoading ? "저장 중..." : "저장"}
            </button>
            <button
              onClick={handleEditCancel}
              disabled={isLoading}
              style={{ ...buttonStyle, ...cancelButtonStyle }}
            >
              취소
            </button>
          </>
        ) : (
          <GreenButton
            onClick={handleEditStart}
            style={{ ...buttonStyle, ...editButtonStyle }}
          >
            프로필 수정
          </GreenButton>
        )}
      </div>
    </section>
  );
};

// 스타일 정의 (rem + vw 기반)
const sectionStyle = {
  backgroundColor: "#ffffff",
  borderRadius: "1rem",
  padding: "clamp(1.5rem, 3vw, 2rem)",
  boxShadow: "0 0.2rem 1rem rgba(0,0,0,0.1)",
  border: "0.1rem solid #e9ecef",
};

const sectionTitleStyle = {
  fontSize: "clamp(1.3rem, 2.5vw, 1.5rem)",
  fontWeight: "600",
  color: "#2c3e50",
  marginBottom: "clamp(1.5rem, 3vw, 2rem)",
};

const profileContentStyle = {
  display: "grid",
  gridTemplateColumns: "auto 1fr",
  gap: "clamp(1.5rem, 3vw, 2rem)",
  alignItems: "start",
  "@media (max-width: 768px)": {
    gridTemplateColumns: "1fr",
    textAlign: "center",
  },
};

const profileImageContainerStyle = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "clamp(1rem, 2vw, 1.5rem)",
};

const profileImageWrapperStyle = {
  width: "clamp(6rem, 12vw, 8rem)",
  height: "clamp(6rem, 12vw, 8rem)",
  borderRadius: "50%",
  overflow: "hidden",
  border: "0.2rem solid #e9ecef",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const profileImageStyle = {
  width: "100%",
  height: "100%",
  objectFit: "cover",
};

const defaultProfileStyle = {
  width: "100%",
  height: "100%",
  backgroundColor: "#f8f9fa",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "#6c757d",
};

const imageEditSection = {
  width: "100%",
  display: "flex",
  flexDirection: "column",
  gap: "0.5rem",
};

const profileInfoStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "clamp(1rem, 2vw, 1.5rem)",
};

const infoItemStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "0.5rem",
};

const labelStyle = {
  fontSize: "clamp(0.9rem, 1.5vw, 1rem)",
  fontWeight: "600",
  color: "#495057",
};

const valueStyle = {
  fontSize: "clamp(1rem, 1.8vw, 1.1rem)",
  color: "#2c3e50",
  padding: "0.5rem 0",
};

const inputStyle = {
  padding: "clamp(0.6rem, 1.2vw, 0.8rem)",
  border: "0.1rem solid #ced4da",
  borderRadius: "0.5rem",
  fontSize: "clamp(0.9rem, 1.5vw, 1rem)",
  transition: "border-color 0.3s ease",
};

const helpTextStyle = {
  fontSize: "clamp(0.8rem, 1.3vw, 0.9rem)",
  color: "#6c757d",
  fontStyle: "italic",
};

const actionButtonsStyle = {
  display: "flex",
  gap: "clamp(0.8rem, 1.5vw, 1rem)",
  marginTop: "clamp(1.5rem, 3vw, 2rem)",
  justifyContent: "flex-end",
  flexWrap: "wrap",
};

const buttonStyle = {
  padding: "clamp(0.7rem, 1.4vw, 0.9rem) clamp(1.2rem, 2.4vw, 1.5rem)",
  border: "none",
  borderRadius: "0.5rem",
  fontSize: "clamp(0.9rem, 1.5vw, 1rem)",
  fontWeight: "600",
  cursor: "pointer",
  transition: "all 0.3s ease",
};

const editButtonStyle = {
  backgroundColor: "#007bff",
  color: "#ffffff",
};

const saveButtonStyle = {
  backgroundColor: "#28a745",
  color: "#ffffff",
  "&:hover": {
    backgroundColor: "#218838",
  },
};

const cancelButtonStyle = {
  backgroundColor: "#ffffff",
  color: "#28a745",
  border: "0.1rem solid #28a745",
  "&:hover": {
    backgroundColor: "#28a745",
    color: "#ffffff",
  },
};

const fileSelectButtonStyle = {
  display: "inline-block",
  padding: "clamp(0.6rem, 1.2vw, 0.8rem) clamp(1rem, 2vw, 1.5rem)",
  backgroundColor: "#28a745",
  color: "#ffffff",
  borderRadius: "0.5rem",
  cursor: "pointer",
  fontSize: "clamp(0.9rem, 1.5vw, 1rem)",
  fontWeight: "600",
  textAlign: "center",
  transition: "all 0.3s ease",
  border: "none",
};

const fileInfoStyle = {
  fontSize: "clamp(0.8rem, 1.3vw, 0.9rem)",
  color: "#28a745",
  padding: "0.5rem 0",
};

export default ProfileSection;
