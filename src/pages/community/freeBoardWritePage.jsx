import FreeBoardForm from "../../widgets/community/writeForm/FreeBoardForm";

const FreeBoardWritePage = () => {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        height: "100vh",
        width: "100vw",
        overflowY: "auto", // ✅ 내부 스크롤 가능하도록
        paddingTop: "2rem", // ✅ 위쪽 여백 확보
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start", // ✅ 상단 정렬
        background: "#f9f9f9",
        zIndex: 10,
      }}
    >
      <FreeBoardForm />
    </div>
  );
};

export default FreeBoardWritePage;
