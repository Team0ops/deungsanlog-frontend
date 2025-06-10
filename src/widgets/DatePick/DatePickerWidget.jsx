import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

const DatePickerWidget = ({ label, value, onChange, required = false }) => (
  <LocalizationProvider dateAdapter={AdapterDayjs}>
    <DatePicker
      label={label}
      value={value}
      onChange={onChange}
      format="YYYY-MM-DD"
      slotProps={{
        textField: {
          required,
          fullWidth: true,
          sx: { background: "#f8fff9", borderRadius: "12px" },
        },
      }}
    />
  </LocalizationProvider>
);

export default DatePickerWidget;
