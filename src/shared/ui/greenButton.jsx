const GreenButton = ({
  children,
  onClick,
  style = {},
  component = "button",
  ...props
}) => {
  const Comp = component;
  return (
    <Comp
      onClick={onClick}
      style={{
        padding: "0.75rem 1.5rem",
        fontSize: "1rem",
        fontWeight: "bold",
        borderRadius: "12px",
        border: "none",
        outline: "none",
        background: "linear-gradient(135deg, #4b8161, #2c5c46)",
        color: "white",
        cursor: "pointer",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
        transition: "all 0.3s ease",
        whiteSpace: "nowrap",
        minWidth: "3.5em",
        ...style,
      }}
      onMouseEnter={(e) => {
        e.target.style.transform = "translateY(-2px)";
        e.target.style.boxShadow = "0 6px 12px rgba(0, 0, 0, 0.3)";
      }}
      onMouseLeave={(e) => {
        e.target.style.transform = "translateY(0)";
        e.target.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.2)";
      }}
      {...props}
    >
      {children}
    </Comp>
  );
};

export default GreenButton;
