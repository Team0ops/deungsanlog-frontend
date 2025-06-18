import axiosInstance from "../../../shared/lib/axiosInstance";

export const sendChatToOrmie = async (message, profile) => {
  console.log("보낼 메시지:", message);
  console.log("프로필 정보:", profile);

  try {
    const response = await axiosInstance.post(
      "/ormie-service/chat",
      {
        message,
        age: profile.age,
        region: profile.region,
        level: profile.level,
      },
      {
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
        withCredentials: true,
      }
    );
    console.log("서버 응답:", response.data);
    return response.data;
  } catch (err) {
    console.error("API 호출 실패:", err.response?.data || err.message);
    throw err;
  }
};
