import GreenInput from "shared/ui/greenInput";

const DatePickerWidget = ({
  label,
  value,
  onChange,
  required = false,
  error = false,
  errorMessage,
}) => (
  <GreenInput
    type="date"
    value={value}
    onChange={onChange}
    error={error}
    errorMessage={errorMessage}
    placeholder={label}
    style={{
      width: "100%",
      height: "2.7rem",
      marginBottom: "1.0rem",
      fontSize: "1.0rem",
      fontFamily: "inherit",
      flex: 1,
      border: `2px solid ${error ? "#dc3545" : "#70a784"}`,
    }}
    required={required}
  />
);

export default DatePickerWidget;
