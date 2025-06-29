import { useState } from "react";
import axiosInstance from "shared/lib/axiosInstance";
import GreenButton from "shared/ui/greenButton";

const ProfileSection = ({ userInfo, setUserInfo, isMobile = false }) => {
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
    <section style={getSectionStyle(isMobile)}>
      <h2 style={getSectionTitleStyle(isMobile)}>👤 프로필 관리</h2>

      <div style={getProfileContentStyle(isMobile)}>
        {/* 프로필 이미지 */}
        <div style={getProfileImageContainerStyle(isMobile)}>
          <div style={getProfileImageWrapperStyle(isMobile)}>
            {previewUrl ? (
              <img
                src={previewUrl}
                alt="프로필 미리보기"
                style={getProfileImageStyle()}
              />
            ) : userInfo.profileImgUrl ? (
              <img
                src={userInfo.profileImgUrl}
                alt="프로필 사진"
                style={getProfileImageStyle()}
              />
            ) : (
              <div style={getDefaultProfileStyle(isMobile)}>
                <span
                  style={{
                    fontSize: isMobile ? "2.5rem" : "clamp(2rem, 4vw, 3rem)",
                  }}
                >
                  👤
                </span>
              </div>
            )}
          </div>
          {isEditing && (
            <div style={getImageEditSection(isMobile)}>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                style={{ display: "none" }}
                id="profile-image-input"
              />
              <label
                htmlFor="profile-image-input"
                style={getFileSelectButtonStyle(isMobile)}
              >
                📁 사진 선택
              </label>
              {selectedFile && (
                <div style={getFileInfoStyle(isMobile)}>
                  선택된 파일: {selectedFile.name}
                </div>
              )}
              <small style={getHelpTextStyle(isMobile)}>
                5MB 이하의 이미지 파일을 선택해주세요
              </small>
            </div>
          )}
        </div>

        {/* 프로필 정보 */}
        <div style={getProfileInfoStyle(isMobile)}>
          {/* 닉네임 */}
          <div style={getInfoItemStyle(isMobile)}>
            <label style={getLabelStyle(isMobile)}>닉네임</label>
            {isEditing ? (
              <input
                type="text"
                value={editData.nickname}
                onChange={(e) =>
                  setEditData({ ...editData, nickname: e.target.value })
                }
                style={getInputStyle(isMobile)}
                placeholder="닉네임을 입력하세요"
              />
            ) : (
              <span style={getValueStyle(isMobile)}>{userInfo.nickname}</span>
            )}
          </div>

          {/* 이메일 (읽기 전용) */}
          <div style={getInfoItemStyle(isMobile)}>
            <label style={getLabelStyle(isMobile)}>이메일</label>
            <span style={getValueStyle(isMobile)}>{userInfo.email}</span>
            <small style={getHelpTextStyle(isMobile)}>
              이메일은 수정할 수 없습니다
            </small>
          </div>

          {/* 가입일 */}
          <div style={getInfoItemStyle(isMobile)}>
            <label style={getLabelStyle(isMobile)}>가입일</label>
            <span style={getValueStyle(isMobile)}>
              {formatDate(userInfo.createdAt)}
            </span>
          </div>

          {/* 최근 활동일 */}
          <div style={getInfoItemStyle(isMobile)}>
            <label style={getLabelStyle(isMobile)}>최근 활동일</label>
            <span style={getValueStyle(isMobile)}>
              {formatDate(userInfo.updatedAt)}
            </span>
          </div>

          {/* OAuth 제공자 정보 */}
          <div style={getInfoItemStyle(isMobile)}>
            <label style={getLabelStyle(isMobile)}>로그인 방식</label>
            <span style={getValueStyle(isMobile)}>
              {userInfo.provider === "google" ? "🔍 Google" : userInfo.provider}
            </span>
          </div>
        </div>
      </div>

      {/* 액션 버튼들 */}
      <div style={getActionButtonsStyle(isMobile)}>
        {isEditing ? (
          <>
            <button
              onClick={handleEditSave}
              disabled={isLoading}
              style={{ ...getButtonStyle(isMobile), ...getSaveButtonStyle() }}
            >
              {isLoading ? "저장 중..." : "저장"}
            </button>
            <button
              onClick={handleEditCancel}
              disabled={isLoading}
              style={{ ...getButtonStyle(isMobile), ...getCancelButtonStyle() }}
            >
              취소
            </button>
          </>
        ) : (
          <GreenButton
            onClick={handleEditStart}
            style={{ ...getButtonStyle(isMobile), ...getEditButtonStyle() }}
          >
            프로필 수정
          </GreenButton>
        )}
      </div>
    </section>
  );
};

// 모바일 대응 스타일 함수들
const getSectionStyle = (isMobile) => ({
  backgroundColor: "#ffffff",
  borderRadius: isMobile ? "0.8rem" : "1rem",
  padding: isMobile ? "1.2rem" : "clamp(1.5rem, 3vw, 2rem)",
  boxShadow: isMobile
    ? "0 0.1rem 0.5rem rgba(0,0,0,0.08)"
    : "0 0.2rem 1rem rgba(0,0,0,0.1)",
  border: "0.1rem solid #e9ecef",
});

const getSectionTitleStyle = (isMobile) => ({
  fontSize: isMobile ? "1.2rem" : "clamp(1.3rem, 2.5vw, 1.5rem)",
  fontWeight: "600",
  color: "#2c3e50",
  marginBottom: isMobile ? "1.2rem" : "clamp(1.5rem, 3vw, 2rem)",
});

const getProfileContentStyle = (isMobile) => ({
  display: "grid",
  gridTemplateColumns: isMobile ? "1fr" : "auto 1fr",
  gap: isMobile ? "1.2rem" : "clamp(1.5rem, 3vw, 2rem)",
  alignItems: "start",
  ...(isMobile && {
    textAlign: "center",
  }),
});

const getProfileImageContainerStyle = (isMobile) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: isMobile ? "0.8rem" : "clamp(1rem, 2vw, 1.5rem)",
});

const getProfileImageWrapperStyle = (isMobile) => ({
  width: isMobile ? "5rem" : "clamp(6rem, 12vw, 8rem)",
  height: isMobile ? "5rem" : "clamp(6rem, 12vw, 8rem)",
  borderRadius: "50%",
  overflow: "hidden",
  border: "0.2rem solid #e9ecef",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});

const getProfileImageStyle = () => ({
  width: "100%",
  height: "100%",
  objectFit: "cover",
});

const getDefaultProfileStyle = (isMobile) => ({
  width: "100%",
  height: "100%",
  backgroundColor: "#f8f9fa",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "#6c757d",
});

const getImageEditSection = (isMobile) => ({
  width: "100%",
  display: "flex",
  flexDirection: "column",
  gap: isMobile ? "0.4rem" : "0.5rem",
});

const getProfileInfoStyle = (isMobile) => ({
  display: "flex",
  flexDirection: "column",
  gap: isMobile ? "0.8rem" : "clamp(1rem, 2vw, 1.5rem)",
});

const getInfoItemStyle = (isMobile) => ({
  display: "flex",
  flexDirection: "column",
  gap: isMobile ? "0.3rem" : "0.5rem",
});

const getLabelStyle = (isMobile) => ({
  fontSize: isMobile ? "0.85rem" : "clamp(0.9rem, 1.5vw, 1rem)",
  fontWeight: "600",
  color: "#495057",
});

const getValueStyle = (isMobile) => ({
  fontSize: isMobile ? "0.95rem" : "clamp(1rem, 1.8vw, 1.1rem)",
  color: "#2c3e50",
  padding: isMobile ? "0.3rem 0" : "0.5rem 0",
});

const getInputStyle = (isMobile) => ({
  padding: isMobile ? "0.7rem" : "clamp(0.6rem, 1.2vw, 0.8rem)",
  border: "0.1rem solid #ced4da",
  borderRadius: isMobile ? "0.4rem" : "0.5rem",
  fontSize: isMobile ? "0.9rem" : "clamp(0.9rem, 1.5vw, 1rem)",
  transition: "border-color 0.3s ease",
  // 모바일에서 입력 최적화
  ...(isMobile && {
    minHeight: "44px",
    touchAction: "manipulation",
  }),
});

const getHelpTextStyle = (isMobile) => ({
  fontSize: isMobile ? "0.75rem" : "clamp(0.8rem, 1.3vw, 0.9rem)",
  color: "#6c757d",
  fontStyle: "italic",
});

const getActionButtonsStyle = (isMobile) => ({
  display: "flex",
  gap: isMobile ? "0.6rem" : "clamp(0.8rem, 1.5vw, 1rem)",
  marginTop: isMobile ? "1.2rem" : "clamp(1.5rem, 3vw, 2rem)",
  justifyContent: isMobile ? "center" : "flex-end",
  flexWrap: "wrap",
});

const getButtonStyle = (isMobile) => ({
  padding: isMobile
    ? "0.8rem 1.2rem"
    : "clamp(0.7rem, 1.4vw, 0.9rem) clamp(1.2rem, 2.4vw, 1.5rem)",
  border: "none",
  borderRadius: isMobile ? "0.4rem" : "0.5rem",
  fontSize: isMobile ? "0.85rem" : "clamp(0.9rem, 1.5vw, 1rem)",
  fontWeight: "600",
  cursor: "pointer",
  transition: "all 0.3s ease",
  // 모바일에서 터치 최적화
  ...(isMobile && {
    minHeight: "44px",
    minWidth: "80px",
    touchAction: "manipulation",
  }),
});

const getEditButtonStyle = () => ({
  backgroundColor: "#007bff",
  color: "#ffffff",
});

const getSaveButtonStyle = () => ({
  backgroundColor: "#28a745",
  color: "#ffffff",
  "&:hover": {
    backgroundColor: "#218838",
  },
});

const getCancelButtonStyle = () => ({
  backgroundColor: "#ffffff",
  color: "#28a745",
  border: "0.1rem solid #28a745",
  "&:hover": {
    backgroundColor: "#28a745",
    color: "#ffffff",
  },
});

const getFileSelectButtonStyle = (isMobile) => ({
  display: "inline-block",
  padding: isMobile
    ? "0.7rem 1rem"
    : "clamp(0.6rem, 1.2vw, 0.8rem) clamp(1rem, 2vw, 1.5rem)",
  backgroundColor: "#28a745",
  color: "#ffffff",
  borderRadius: isMobile ? "0.4rem" : "0.5rem",
  cursor: "pointer",
  fontSize: isMobile ? "0.85rem" : "clamp(0.9rem, 1.5vw, 1rem)",
  fontWeight: "600",
  textAlign: "center",
  transition: "all 0.3s ease",
  border: "none",
  // 모바일에서 터치 최적화
  ...(isMobile && {
    minHeight: "44px",
    touchAction: "manipulation",
  }),
});

const getFileInfoStyle = (isMobile) => ({
  fontSize: isMobile ? "0.75rem" : "clamp(0.8rem, 1.3vw, 0.9rem)",
  color: "#28a745",
  padding: isMobile ? "0.3rem 0" : "0.5rem 0",
});

export default ProfileSection;
