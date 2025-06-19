import { useState } from "react";
import GreenButton from "../../../shared/ui/greenButton";
import GreenInput from "../../../shared/ui/greenInput";

const ProfileStep = ({ question, options, onSelect, step }) => {
  const [customInputSteps, setCustomInputSteps] = useState({});
  const [customValues, setCustomValues] = useState({});
  const [inputError, setInputError] = useState(false); // 에러 상태 추가

  const isCurrentStepCustom = customInputSteps[step] === true;

  const handleOptionClick = (option) => {
    if (option === "기타") {
      setCustomInputSteps((prev) => ({ ...prev, [step]: true }));
    } else {
      onSelect(option);
    }
  };

  const handleCustomChange = (e) => {
    setCustomValues((prev) => ({ ...prev, [step]: e.target.value }));
    setInputError(false); // 입력 시 에러 제거
  };

  const handleCustomSubmit = () => {
    const trimmed = customValues[step]?.trim();
    if (!trimmed) {
      setInputError(true);
      return;
    }
    onSelect(trimmed);
  };

  return (
    <div
      style={{
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          textAlign: "center",
          maxWidth: "400px",
          padding: "1rem",
        }}
      >
        <p
          style={{
            fontSize: "1.2rem",
            fontWeight: "bold",
            marginBottom: "1.2rem",
            color: "#333",
            whiteSpace: "pre-line",
          }}
        >
          {question}
        </p>

        {!isCurrentStepCustom ? (
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: "0.75rem",
            }}
          >
            {options.map((option) => (
              <GreenButton
                key={option}
                onClick={() => handleOptionClick(option)}
              >
                {option}
              </GreenButton>
            ))}
          </div>
        ) : (
          <div>
            <GreenInput
              value={customValues[step] || ""}
              onChange={handleCustomChange}
              placeholder="직접 입력하세요"
              error={inputError}
              errorMessage="값을 입력해주세요!"
            />
            <br />
            <GreenButton
              onClick={handleCustomSubmit}
              style={{ marginTop: "0.75rem" }}
            >
              입력 완료
            </GreenButton>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileStep;
