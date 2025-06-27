import React from "react";

const MountainImage = ({ mountain }) => {
  if (!mountain) return null;

  const imageSectionStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "clamp(1rem, 2vw, 1.5rem)",
  };

  const mountainImageStyle = {
    width: "100%",
    height: "clamp(15rem, 25vw, 20rem)",
    objectFit: "cover",
    borderRadius: "1rem",
    boxShadow: "0 0.2rem 1rem rgba(0,0,0,0.1)",
    marginBottom: "2rem",
  };

  const noImageStyle = {
    width: "100%",
    height: "clamp(15rem, 25vw, 20rem)",
    backgroundColor: "#f8f9fa",
    borderRadius: "1rem",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    border: "0.1rem solid #dee2e6",
  };

  return (
    <aside style={imageSectionStyle}>
      {/* 산 이미지 */}
      <div>
        {mountain.thumbnailImgUrl ? (
          <img
            src={mountain.thumbnailImgUrl}
            alt={mountain.name}
            style={mountainImageStyle}
          />
        ) : (
          <div style={noImageStyle}>
            <span style={{ fontSize: "clamp(3rem, 6vw, 4rem)" }}>🏔️</span>
            <p style={{ color: "#6c757d", marginTop: "1rem" }}>
              이미지가 없습니다
            </p>
          </div>
        )}
      </div>
    </aside>
  );
};

export default MountainImage;
