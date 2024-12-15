import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Link, Redirect } from "react-router-dom";
import { deleteSession } from "../Redux/Action/ActionSession";

function LoginLink(props) {
  const dispatch = useDispatch();

  const onRedirect = async () => {
    // localStorage.clear();

    // const action = deleteSession('');
    // dispatch(action);
    try {
      const response = await fetch(
        "https://backend-assignment3-odn0.onrender.com/auth/logout",
        {
          method: "POST",
          credentials: "include", // Đảm bảo gửi cookie nếu cần
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Logout failed:", errorData.message);
      } else {
        // Xử lý sau khi logout thành công
        localStorage.removeItem("User");
        window.location.href = "/signin"; // Chuyển hướng đến trang login hoặc trang khác
      }
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <li className="nav-item" onClick={onRedirect}>
      <Link className="nav-link" to="/signin">
        ( Logout )
      </Link>
    </li>
  );
}

export default LoginLink;
