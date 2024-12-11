import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import convertMoney from "../convertMoney";
import queryString from "query-string";

MainHistory.propTypes = {};

function MainHistory(props) {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const emailUser = localStorage.getItem("User");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const url = `https://backend-nodejs-lke6.onrender.com/orders?email=${emailUser}`;
        const response = await fetch(url, {
          method: "GET", // Chỉ định phương thức GET
          headers: {
            "Content-Type": "application/json", // Đặt tiêu đề Content-Type nếu cần
          },
          credentials: "include", // Bao gồm cookie trong yêu cầu
        });

        // Kiểm tra nếu phản hồi không ok (status khác 2xx)
        if (!response.ok) {
          if (response.status === 401) {
            // Nếu nhận được mã lỗi 401, chuyển hướng đến trang login
            navigate("/signin"); // Thay đổi đường dẫn đến trang đăng nhập của bạn
          } else {
            throw new Error("Network response was not ok");
          }
        }

        const dataJson = await response.json(); // Cần await để nhận dữ liệu JSON
        console.log(dataJson); // Log ra dữ liệu phản hồi từ API
        setOrders(dataJson);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="container">
      <section className="py-5 bg-light">
        <div className="container">
          <div className="row px-4 px-lg-5 py-lg-4 align-items-center">
            <div className="col-lg-6">
              <h1 className="h2 text-uppercase mb-0">History</h1>
            </div>
            <div className="col-lg-6 text-lg-right">
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb justify-content-lg-end mb-0 px-0">
                  <li className="breadcrumb-item active">History</li>
                </ol>
              </nav>
            </div>
          </div>
        </div>
      </section>

      <div className="table-responsive pt-5 pb-5">
        <table className="table">
          <thead className="bg-light">
            <tr className="text-center">
              <th className="border-0" scope="col">
                {" "}
                <strong className="text-small text-uppercase">ID Order</strong>
              </th>
              <th className="border-0" scope="col">
                {" "}
                <strong className="text-small text-uppercase">ID User</strong>
              </th>
              <th className="border-0" scope="col">
                {" "}
                <strong className="text-small text-uppercase">Name</strong>
              </th>
              <th className="border-0" scope="col">
                {" "}
                <strong className="text-small text-uppercase">Phone</strong>
              </th>
              <th className="border-0" scope="col">
                {" "}
                <strong className="text-small text-uppercase">Address</strong>
              </th>
              <th className="border-0" scope="col">
                {" "}
                <strong className="text-small text-uppercase">Total</strong>
              </th>
              <th className="border-0" scope="col">
                {" "}
                <strong className="text-small text-uppercase">Delivery</strong>
              </th>
              <th className="border-0" scope="col">
                {" "}
                <strong className="text-small text-uppercase">Status</strong>
              </th>
              <th className="border-0" scope="col">
                {" "}
                <strong className="text-small text-uppercase">Detail</strong>
              </th>
            </tr>
          </thead>
          <tbody>
            {orders &&
              orders.map((value) => (
                <tr className="text-center" key={value._id}>
                  <td className="align-middle border-0">
                    <p className="mb-0 small">{value._id}</p>
                  </td>
                  <td className="align-middle border-0">
                    <p className="mb-0 small">{value.customer.userId}</p>
                  </td>
                  <td className="align-middle border-0">
                    <p className="mb-0 small">{value.customer.name}</p>
                  </td>
                  <td className="align-middle border-0">
                    <p className="mb-0 small">{value.customer.phone}</p>
                  </td>
                  <td className="align-middle border-0">
                    <p className="mb-0 small">{value.customer.address}</p>
                  </td>
                  <td className="align-middle border-0">
                    <p className="mb-0 small">
                      {convertMoney(value.totalPrice)} VNĐ
                    </p>
                  </td>
                  <td className="align-middle border-0">
                    <p className="mb-0 small">
                      {!value.delivery
                        ? "Waiting for progressing"
                        : "Processed"}
                    </p>
                  </td>
                  <td className="align-middle border-0">
                    <p className="mb-0 small">
                      {!value.status ? "Waiting for pay" : "Paid"}
                    </p>
                  </td>
                  <td className="align-middle border-0">
                    <Link
                      className="btn btn-outline-dark btn-sm"
                      to={`/history/${value._id}`}
                    >
                      View
                      <i className="fas fa-long-arrow-alt-right ml-2"></i>
                    </Link>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default MainHistory;
