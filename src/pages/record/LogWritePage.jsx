import LogWriteForm from "./form/LogWriteForm";

const LogWritePage = () => {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        height: "100vh",
        width: "100vw",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 10,
        background: "transparent",
      }}
    >
      <LogWriteForm />
    </div>
  );
};

export default LogWritePage;
