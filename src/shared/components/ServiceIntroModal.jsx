import React from "react";
import { useTheme, useMediaQuery } from "@mui/material";
import GreenButton from "shared/ui/greenButton";
import { isAuthenticated } from "shared/lib/auth";

const ServiceIntroModal = ({ isOpen, onClose }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isLoggedIn = isAuthenticated();

  if (!isOpen) return null;

  const handleLogin = () => {
    onClose();
    window.location.href = "/login";
  };

  const handleBrowse = () => {
    onClose();
    window.location.href = "/mountain";
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 20000,
        padding: isMobile ? "1rem" : "2rem",
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "#f0f8f5",
          borderRadius: "24px",
          boxShadow:
            "0 8px 32px rgba(0,0,0,0.2), inset 0 0 0 2px rgba(0,0,0,0.1)",
          width: "100%",
          maxWidth: isMobile ? "100%" : "800px",
          maxHeight: "90vh",
          overflowY: "auto",
          padding: isMobile ? "2rem" : "3rem",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 헤더 */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: isMobile ? "1.5rem" : "2rem",
            position: "relative",
          }}
        >
          <div style={{ width: isMobile ? "2.5rem" : "3rem" }}></div>

          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              fontSize: isMobile ? "1.2rem" : "1.5rem",
              color: "#16351c",
              cursor: "pointer",
              padding: "0.5rem",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: isMobile ? "2rem" : "2.5rem",
              height: isMobile ? "2rem" : "2.5rem",
              outline: "none",
              position: "absolute",
              top: isMobile ? "-1rem" : "-1.5rem",
              right: isMobile ? "-1rem" : "-1.5rem",
            }}
            onMouseOver={(e) => (e.currentTarget.style.background = "#d4e9d4")}
            onMouseOut={(e) => (e.currentTarget.style.background = "none")}
          >
            ✕
          </button>
        </div>

        {/* 서비스 소개 내용 */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: isMobile ? "1.5rem" : "2rem",
          }}
        >
          {!isLoggedIn ? (
            // 로그인하지 않은 사용자를 위한 안내
            <>
              {/* 소개 섹션 */}
              <div
                style={{
                  background: "#ffffff",
                  borderRadius: "16px",
                  padding: isMobile ? "1.2rem" : "1.5rem",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                  textAlign: "center",
                }}
              >
                <h2
                  style={{
                    color: "#2b5f3e",
                    fontSize: isMobile ? "1.2rem" : "1.4rem",
                    fontWeight: "600",
                    marginBottom: "0.8rem",
                  }}
                >
                  🎯 등산 이야기는 무엇인가요?
                </h2>
                <p
                  style={{
                    color: "#555",
                    fontSize: isMobile ? "1rem" : "1.1rem",
                    lineHeight: "1.6",
                    margin: 0,
                  }}
                >
                  등산인들을 위한 종합 커뮤니티 플랫폼입니다. 산 기록을 남기고,
                  등산 모임을 만들고, 다른 등산인들과 소통할 수 있는 공간이에요.
                </p>
              </div>

              {/* 주요 기능들 */}
              <div
                style={{
                  background: "#ffffff",
                  borderRadius: "16px",
                  padding: isMobile ? "1.2rem" : "1.5rem",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                }}
              >
                <h2
                  style={{
                    color: "#2b5f3e",
                    fontSize: isMobile ? "1.2rem" : "1.4rem",
                    fontWeight: "600",
                    marginBottom: "1rem",
                  }}
                >
                  🚀 주요 기능
                </h2>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "1rem",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "0.8rem",
                    }}
                  >
                    <div
                      style={{
                        background: "#4b8161",
                        color: "white",
                        borderRadius: "50%",
                        width: "24px",
                        height: "24px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "0.8rem",
                        fontWeight: "bold",
                        flexShrink: 0,
                        marginTop: "0.1rem",
                      }}
                    >
                      1
                    </div>
                    <div>
                      <h3
                        style={{
                          color: "#2b5f3e",
                          fontSize: isMobile ? "1rem" : "1.1rem",
                          fontWeight: "600",
                          margin: "0 0 0.3rem 0",
                        }}
                      >
                        🗺️ 산 정보 제공
                      </h3>
                      <p
                        style={{
                          color: "#666",
                          fontSize: isMobile ? "0.9rem" : "1rem",
                          lineHeight: "1.5",
                          margin: 0,
                        }}
                      >
                        전국의 산 정보를 제공합니다. 난이도, 소요시간, 교통편 등
                        상세한 정보를 확인하세요.
                      </p>
                    </div>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "0.8rem",
                    }}
                  >
                    <div
                      style={{
                        background: "#4b8161",
                        color: "white",
                        borderRadius: "50%",
                        width: "24px",
                        height: "24px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "0.8rem",
                        fontWeight: "bold",
                        flexShrink: 0,
                        marginTop: "0.1rem",
                      }}
                    >
                      2
                    </div>
                    <div>
                      <h3
                        style={{
                          color: "#2b5f3e",
                          fontSize: isMobile ? "1rem" : "1.1rem",
                          fontWeight: "600",
                          margin: "0 0 0.3rem 0",
                        }}
                      >
                        📝 기록
                      </h3>
                      <p
                        style={{
                          color: "#666",
                          fontSize: isMobile ? "0.9rem" : "1rem",
                          lineHeight: "1.5",
                          margin: 0,
                        }}
                      >
                        등산한 산의 기록을 남기고, 사진과 함께 추억을
                        저장해보세요.
                      </p>
                    </div>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "0.8rem",
                    }}
                  >
                    <div
                      style={{
                        background: "#4b8161",
                        color: "white",
                        borderRadius: "50%",
                        width: "24px",
                        height: "24px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "0.8rem",
                        fontWeight: "bold",
                        flexShrink: 0,
                        marginTop: "0.1rem",
                      }}
                    >
                      3
                    </div>
                    <div>
                      <h3
                        style={{
                          color: "#2b5f3e",
                          fontSize: isMobile ? "1rem" : "1.1rem",
                          fontWeight: "600",
                          margin: "0 0 0.3rem 0",
                        }}
                      >
                        💬 커뮤니티
                      </h3>
                      <p
                        style={{
                          color: "#666",
                          fontSize: isMobile ? "0.9rem" : "1rem",
                          lineHeight: "1.5",
                          margin: 0,
                        }}
                      >
                        등산 후기, 장비 정보, 산 정보를 공유하고 소통해보세요.
                      </p>
                    </div>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "0.8rem",
                    }}
                  >
                    <div
                      style={{
                        background: "#4b8161",
                        color: "white",
                        borderRadius: "50%",
                        width: "24px",
                        height: "24px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "0.8rem",
                        fontWeight: "bold",
                        flexShrink: 0,
                        marginTop: "0.1rem",
                      }}
                    >
                      4
                    </div>
                    <div>
                      <h3
                        style={{
                          color: "#2b5f3e",
                          fontSize: isMobile ? "1rem" : "1.1rem",
                          fontWeight: "600",
                          margin: "0 0 0.3rem 0",
                        }}
                      >
                        👥 모임
                      </h3>
                      <p
                        style={{
                          color: "#666",
                          fontSize: isMobile ? "0.9rem" : "1rem",
                          lineHeight: "1.5",
                          margin: 0,
                        }}
                      >
                        함께 등산할 친구들을 모집하고, 새로운 등산 파트너를
                        만나보세요.
                      </p>
                    </div>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "0.8rem",
                    }}
                  >
                    <div
                      style={{
                        background: "#4b8161",
                        color: "white",
                        borderRadius: "50%",
                        width: "24px",
                        height: "24px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "0.8rem",
                        fontWeight: "bold",
                        flexShrink: 0,
                        marginTop: "0.1rem",
                      }}
                    >
                      5
                    </div>
                    <div>
                      <h3
                        style={{
                          color: "#2b5f3e",
                          fontSize: isMobile ? "1rem" : "1.1rem",
                          fontWeight: "600",
                          margin: "0 0 0.3rem 0",
                        }}
                      >
                        🤖 오르미
                      </h3>
                      <p
                        style={{
                          color: "#666",
                          fontSize: isMobile ? "0.9rem" : "1rem",
                          lineHeight: "1.5",
                          margin: 0,
                        }}
                      >
                        AI가 등산에 대한 모든 궁금증을 답변해드려요. 등산 팁부터
                        장비 추천까지!
                      </p>
                    </div>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "0.8rem",
                    }}
                  >
                    <div
                      style={{
                        background: "#4b8161",
                        color: "white",
                        borderRadius: "50%",
                        width: "24px",
                        height: "24px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "0.8rem",
                        fontWeight: "bold",
                        flexShrink: 0,
                        marginTop: "0.1rem",
                      }}
                    >
                      6
                    </div>
                    <div>
                      <h3
                        style={{
                          color: "#2b5f3e",
                          fontSize: isMobile ? "1rem" : "1.1rem",
                          fontWeight: "600",
                          margin: "0 0 0.3rem 0",
                        }}
                      >
                        🔔 알림서비스
                      </h3>
                      <p
                        style={{
                          color: "#666",
                          fontSize: isMobile ? "0.9rem" : "1rem",
                          lineHeight: "1.5",
                          margin: 0,
                        }}
                      >
                        모임 알림, 댓글 알림 등 중요한 소식을 실시간으로
                        받아보세요.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 로그인 안내 */}
              <div
                style={{
                  background: "#ffffff",
                  borderRadius: "16px",
                  padding: isMobile ? "1.2rem" : "1.5rem",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                  textAlign: "center",
                }}
              >
                <h2
                  style={{
                    color: "#2b5f3e",
                    fontSize: isMobile ? "1.2rem" : "1.4rem",
                    fontWeight: "600",
                    marginBottom: "1rem",
                  }}
                >
                  ✨ 로그인을 하면 위의 기능을 모두 이용할 수 있어요!!
                </h2>
                <div
                  style={{
                    display: "flex",
                    flexDirection: isMobile ? "column" : "row",
                    gap: "1rem",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <GreenButton
                    onClick={handleLogin}
                    style={{
                      padding: isMobile ? "0.8rem 2rem" : "1rem 2.5rem",
                      fontSize: isMobile ? "1rem" : "1.1rem",
                      fontWeight: "600",
                      borderRadius: "12px",
                      background: "#4b8161",
                      color: "#ffffff",
                      border: "none",
                      boxShadow: "0 4px 12px rgba(75, 129, 97, 0.3)",
                    }}
                  >
                    로그인 하러가기!
                  </GreenButton>
                  <GreenButton
                    onClick={handleBrowse}
                    style={{
                      padding: isMobile ? "0.8rem 2rem" : "1rem 2.5rem",
                      fontSize: isMobile ? "1rem" : "1.1rem",
                      fontWeight: "600",
                      borderRadius: "12px",
                      background: "#ffffff",
                      color: "#4b8161",
                      border: "2px solid #4b8161",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                    }}
                  >
                    둘러보기
                  </GreenButton>
                </div>
              </div>
            </>
          ) : (
            // 로그인한 사용자를 위한 기존 기능 목록
            <>
              {/* 소개 섹션 */}
              <div
                style={{
                  background: "#ffffff",
                  borderRadius: "16px",
                  padding: isMobile ? "1.2rem" : "1.5rem",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                }}
              >
                <h2
                  style={{
                    color: "#2b5f3e",
                    fontSize: isMobile ? "1.2rem" : "1.4rem",
                    fontWeight: "600",
                    marginBottom: "0.8rem",
                  }}
                >
                  🎯 등산 이야기는 무엇인가요?
                </h2>
                <p
                  style={{
                    color: "#555",
                    fontSize: isMobile ? "1rem" : "1.1rem",
                    lineHeight: "1.6",
                    margin: 0,
                  }}
                >
                  등산인들을 위한 종합 커뮤니티 플랫폼입니다. 산 기록을 남기고,
                  등산 모임을 만들고, 다른 등산인들과 소통할 수 있는 공간이에요.
                </p>
              </div>

              {/* 주요 기능들 */}
              <div
                style={{
                  background: "#ffffff",
                  borderRadius: "16px",
                  padding: isMobile ? "1.2rem" : "1.5rem",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                }}
              >
                <h2
                  style={{
                    color: "#2b5f3e",
                    fontSize: isMobile ? "1.2rem" : "1.4rem",
                    fontWeight: "600",
                    marginBottom: "1rem",
                  }}
                >
                  🚀 주요 기능
                </h2>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "1rem",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "0.8rem",
                    }}
                  >
                    <div
                      style={{
                        background: "#4b8161",
                        color: "white",
                        borderRadius: "50%",
                        width: "24px",
                        height: "24px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "0.8rem",
                        fontWeight: "bold",
                        flexShrink: 0,
                        marginTop: "0.1rem",
                      }}
                    >
                      1
                    </div>
                    <div>
                      <h3
                        style={{
                          color: "#2b5f3e",
                          fontSize: isMobile ? "1rem" : "1.1rem",
                          fontWeight: "600",
                          margin: "0 0 0.3rem 0",
                        }}
                      >
                        🗺️ 산 정보 제공
                      </h3>
                      <p
                        style={{
                          color: "#666",
                          fontSize: isMobile ? "0.9rem" : "1rem",
                          lineHeight: "1.5",
                          margin: 0,
                        }}
                      >
                        전국의 산 정보를 제공합니다. 난이도, 소요시간, 교통편 등
                        상세한 정보를 확인하세요.
                      </p>
                    </div>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "0.8rem",
                    }}
                  >
                    <div
                      style={{
                        background: "#4b8161",
                        color: "white",
                        borderRadius: "50%",
                        width: "24px",
                        height: "24px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "0.8rem",
                        fontWeight: "bold",
                        flexShrink: 0,
                        marginTop: "0.1rem",
                      }}
                    >
                      2
                    </div>
                    <div>
                      <h3
                        style={{
                          color: "#2b5f3e",
                          fontSize: isMobile ? "1rem" : "1.1rem",
                          fontWeight: "600",
                          margin: "0 0 0.3rem 0",
                        }}
                      >
                        📝 기록
                      </h3>
                      <p
                        style={{
                          color: "#666",
                          fontSize: isMobile ? "0.9rem" : "1rem",
                          lineHeight: "1.5",
                          margin: 0,
                        }}
                      >
                        등산한 산의 기록을 남기고, 사진과 함께 추억을
                        저장해보세요.
                      </p>
                    </div>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "0.8rem",
                    }}
                  >
                    <div
                      style={{
                        background: "#4b8161",
                        color: "white",
                        borderRadius: "50%",
                        width: "24px",
                        height: "24px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "0.8rem",
                        fontWeight: "bold",
                        flexShrink: 0,
                        marginTop: "0.1rem",
                      }}
                    >
                      3
                    </div>
                    <div>
                      <h3
                        style={{
                          color: "#2b5f3e",
                          fontSize: isMobile ? "1rem" : "1.1rem",
                          fontWeight: "600",
                          margin: "0 0 0.3rem 0",
                        }}
                      >
                        💬 커뮤니티
                      </h3>
                      <p
                        style={{
                          color: "#666",
                          fontSize: isMobile ? "0.9rem" : "1rem",
                          lineHeight: "1.5",
                          margin: 0,
                        }}
                      >
                        등산 후기, 장비 정보, 산 정보를 공유하고 소통해보세요.
                      </p>
                    </div>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "0.8rem",
                    }}
                  >
                    <div
                      style={{
                        background: "#4b8161",
                        color: "white",
                        borderRadius: "50%",
                        width: "24px",
                        height: "24px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "0.8rem",
                        fontWeight: "bold",
                        flexShrink: 0,
                        marginTop: "0.1rem",
                      }}
                    >
                      4
                    </div>
                    <div>
                      <h3
                        style={{
                          color: "#2b5f3e",
                          fontSize: isMobile ? "1rem" : "1.1rem",
                          fontWeight: "600",
                          margin: "0 0 0.3rem 0",
                        }}
                      >
                        👥 모임
                      </h3>
                      <p
                        style={{
                          color: "#666",
                          fontSize: isMobile ? "0.9rem" : "1rem",
                          lineHeight: "1.5",
                          margin: 0,
                        }}
                      >
                        함께 등산할 친구들을 모집하고, 새로운 등산 파트너를
                        만나보세요.
                      </p>
                    </div>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "0.8rem",
                    }}
                  >
                    <div
                      style={{
                        background: "#4b8161",
                        color: "white",
                        borderRadius: "50%",
                        width: "24px",
                        height: "24px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "0.8rem",
                        fontWeight: "bold",
                        flexShrink: 0,
                        marginTop: "0.1rem",
                      }}
                    >
                      5
                    </div>
                    <div>
                      <h3
                        style={{
                          color: "#2b5f3e",
                          fontSize: isMobile ? "1rem" : "1.1rem",
                          fontWeight: "600",
                          margin: "0 0 0.3rem 0",
                        }}
                      >
                        🤖 오르미
                      </h3>
                      <p
                        style={{
                          color: "#666",
                          fontSize: isMobile ? "0.9rem" : "1rem",
                          lineHeight: "1.5",
                          margin: 0,
                        }}
                      >
                        AI가 등산에 대한 모든 궁금증을 답변해드려요. 등산 팁부터
                        장비 추천까지!
                      </p>
                    </div>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "0.8rem",
                    }}
                  >
                    <div
                      style={{
                        background: "#4b8161",
                        color: "white",
                        borderRadius: "50%",
                        width: "24px",
                        height: "24px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "0.8rem",
                        fontWeight: "bold",
                        flexShrink: 0,
                        marginTop: "0.1rem",
                      }}
                    >
                      6
                    </div>
                    <div>
                      <h3
                        style={{
                          color: "#2b5f3e",
                          fontSize: isMobile ? "1rem" : "1.1rem",
                          fontWeight: "600",
                          margin: "0 0 0.3rem 0",
                        }}
                      >
                        🔔 알림서비스
                      </h3>
                      <p
                        style={{
                          color: "#666",
                          fontSize: isMobile ? "0.9rem" : "1rem",
                          lineHeight: "1.5",
                          margin: 0,
                        }}
                      >
                        모임 알림, 댓글 알림 등 중요한 소식을 실시간으로
                        받아보세요.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 시작하기 버튼 */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginTop: isMobile ? "1rem" : "1.5rem",
                }}
              >
                <GreenButton
                  onClick={onClose}
                  style={{
                    padding: isMobile ? "0.8rem 2rem" : "1rem 3rem",
                    fontSize: isMobile ? "1.1rem" : "1.2rem",
                    fontWeight: "600",
                    borderRadius: "12px",
                    background: "#4b8161",
                    color: "#ffffff",
                    border: "none",
                    boxShadow: "0 4px 12px rgba(75, 129, 97, 0.3)",
                  }}
                >
                  🚀 등산 이야기 시작하기
                </GreenButton>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ServiceIntroModal;
