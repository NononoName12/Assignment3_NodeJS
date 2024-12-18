import React, { useEffect, useState } from "react";
import "./Chat.css";
import queryString from "query-string";
import axios from "axios";
import { useSelector } from "react-redux";
import io from "socket.io-client";

const socket = io("https://backend-assignment3-odn0.onrender.com/");

function Chat(props) {
  const [userID, setUserID] = useState(null);
  // const [socket, setSocket] = useState(null);
  const [activeChat, setActiveChat] = useState(false);
  // const [textMessage, setTextMessage] = useState("");
  // const [message, setMessage] = useState();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [roomId, setRoomId] = useState(localStorage.getItem("roomId") || null);

  const [loading, setLoading] = useState(false);

  // Hàm này dùng để mở hộp thoại chat
  const onChat = () => {
    if (userID != null) {
      setActiveChat(!activeChat);
      if (!activeChat) {
        // if (roomId) {
        //   socket.emit("joinRoom", { roomId, userId: "user" });
        // }
        // // Nếu chưa có roomId, tạo mới roomId
        // else {
        const newRoomId = `room-${userID}`; // Tạo roomId dựa trên userId
        setRoomId(newRoomId);
        localStorage.setItem("roomId", newRoomId); // Lưu vào localStorage
        socket.emit("joinRoom", { roomId: newRoomId, userID });
        // }
      }
    } else {
      alert("Please Login!");
    }
  };

  console.log(messages);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true); // Bắt đầu loading
      try {
        const url = "https://backend-assignment3-odn0.onrender.com/";
        const response = await fetch(url, {
          method: "GET", // Chỉ định phương thức GET
          headers: {
            "Content-Type": "application/json", // Đặt tiêu đề Content-Type nếu cần
          },
          credentials: "include", // Bao gồm cookie trong yêu cầu
        });

        // Kiểm tra nếu phản hồi không ok (status khác 2xx)
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json(); // Cần await để nhận dữ liệu JSON

        console.log(data.user._id);
        setUserID(data.user._id);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false); // Kết thúc loading
      }
    };
    fetchData(); // Gọi hàm fetch khi component được mount

    socket.on("loadMessages", (loadedMessages) => {
      setMessages(loadedMessages);
    });

    socket.on("message", (data) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    });

    socket.on("end", (message) => {
      alert(message); // Hiển thị thông báo đến người dùng
      setMessages([]); // Xóa tất cả tin nhắn hiện tại
      setRoomId(null); // Đặt lại roomId về null (hoặc một giá trị mặc định)
      setMessage(""); // Xóa nội dung ô nhập tin nhắn
      setActiveChat(false);
    });

    return () => {
      socket.off("message");
    };
  }, []);

  const onChangeText = (e) => {
    setMessage(e.target.value); // Đảm bảo cập nhật state với giá trị chuỗi từ input
  };

  const handlerSend = async () => {
    if (message.trim() === "/end") {
      socket.emit("endChat", { roomId });
      localStorage.removeItem("roomId");
      setRoomId(null);
    } else {
      socket.emit("chatMessage", { roomId, sender: "user", message });
    }
    setMessage("");
  };

  return (
    <div className="wrapper_chat">
      {!loading && (
        <div className="chat_messenger" onClick={onChat}>
          <svg x="0" y="0" width="60px" height="60px">
            <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
              <g>
                <circle fill="#383838" cx="30" cy="30" r="30"></circle>
                <svg x="10" y="10">
                  <g transform="translate(0.000000, -10.000000)" fill="#FFFFFF">
                    <g id="logo" transform="translate(0.000000, 10.000000)">
                      <path
                        d="M20,0 C31.2666,0 40,8.2528 40,19.4 C40,30.5472 31.2666,38.8 
								20,38.8 C17.9763,38.8 16.0348,38.5327 14.2106,38.0311 C13.856,37.9335 13.4789,37.9612 
								13.1424,38.1098 L9.1727,39.8621 C8.1343,40.3205 6.9621,39.5819 6.9273,38.4474 L6.8184,34.8894 
								C6.805,34.4513 6.6078,34.0414 6.2811,33.7492 C2.3896,30.2691 0,25.2307 0,19.4 C0,8.2528 8.7334,0 
								20,0 Z M7.99009,25.07344 C7.42629,25.96794 8.52579,26.97594 9.36809,26.33674 L15.67879,21.54734 
								C16.10569,21.22334 16.69559,21.22164 17.12429,21.54314 L21.79709,25.04774 C23.19919,26.09944 
								25.20039,25.73014 26.13499,24.24744 L32.00999,14.92654 C32.57369,14.03204 31.47419,13.02404 
								30.63189,13.66324 L24.32119,18.45264 C23.89429,18.77664 23.30439,18.77834 22.87569,18.45674 
								L18.20299,14.95224 C16.80079,13.90064 14.79959,14.26984 13.86509,15.75264 L7.99009,25.07344 Z"
                      ></path>
                    </g>
                  </g>
                </svg>
              </g>
            </g>
          </svg>
        </div>
      )}

      {activeChat && (
        <div className="active_chat animate__animated animate__jackInTheBox">
          <div style={{ width: "100%" }}>
            <div
              className="card card-bordered fix_boderChat"
              style={{ width: "fit-content" }}
            >
              <div className="card-header">
                <h4 className="card-title">
                  <strong>Customer Support</strong>
                </h4>{" "}
                <a className="btn btn-xs btn-secondary" href="#">
                  Let's Chat App
                </a>
              </div>
              <div className="ps-container ps-theme-default ps-active-y fix_scoll">
                {messages &&
                  messages.map((value) =>
                    value.sender !== "Admin" ? (
                      <div
                        className="media media-chat media-chat-reverse"
                        key={value.id}
                      >
                        <div className="media-body">
                          <p>You: {value.message}</p>
                        </div>
                      </div>
                    ) : (
                      <div className="media media-chat" key={value.id}>
                        {" "}
                        <img
                          className="avatar"
                          src="https://img.icons8.com/color/36/000000/administrator-male.png"
                          alt="..."
                        />
                        <div className="media-body" key={value.id}>
                          <p>Cộng tác viên: {value.message}</p>
                        </div>
                      </div>
                    )
                  )}
              </div>
              <div className="publisher bt-1 border-light">
                <img
                  className="avatar avatar-xs"
                  src="https://img.icons8.com/color/36/000000/administrator-male.png"
                  alt="..."
                />
                <input
                  type="text"
                  placeholder="Enter Message!"
                  onChange={onChangeText}
                  value={message}
                  style={{ width: "80%" }}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      handlerSend();
                    }
                  }}
                />
                <a
                  onClick={handlerSend}
                  className="publisher-btn text-info"
                  data-abc="true"
                >
                  <i className="fa fa-paper-plane"></i>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Chat;
