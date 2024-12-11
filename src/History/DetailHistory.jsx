import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import convertMoney from "../convertMoney";

function DetailHistory(props) {
  const navigate = useNavigate();
  const { id } = useParams();

  const [ordersDetail, setOrdersDetail] = useState([]);

  const [information, setInformation] = useState({});

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const url = `https://backend-nodejs-lke6.onrender.com/orders/${id}`;
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
        setOrdersDetail(dataJson.products);
        setInformation(dataJson);
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
              <h1 className="h2 text-uppercase mb-0">Detail Order</h1>
            </div>
            <div className="col-lg-6 text-lg-right">
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb justify-content-lg-end mb-0 px-0">
                  <li className="breadcrumb-item active">Detail</li>
                </ol>
              </nav>
            </div>
          </div>
        </div>
      </section>

      {information && information.customer && (
        <div className="p-5">
          <h1 className="h2 text-uppercase">Information Order</h1>
          <p>ID User: {information.customer.userId}</p>
          <p>Full Name: {information.customer.name}</p>
          <p>Phone: {information.customer.phone}</p>
          <p>Address: {information.customer.address}</p>
          <p>Total: {convertMoney(information.totalPrice)} VNĐ</p>
        </div>
      )}

      <div className="table-responsive pt-5 pb-5">
        <table className="table">
          <thead className="bg-light">
            <tr className="text-center">
              <th className="border-0" scope="col">
                {" "}
                <strong className="text-small text-uppercase">
                  ID Product
                </strong>
              </th>
              <th className="border-0" scope="col">
                {" "}
                <strong className="text-small text-uppercase">Image</strong>
              </th>
              <th className="border-0" scope="col">
                {" "}
                <strong className="text-small text-uppercase">Name</strong>
              </th>
              <th className="border-0" scope="col">
                {" "}
                <strong className="text-small text-uppercase">Price</strong>
              </th>
              <th className="border-0" scope="col">
                {" "}
                <strong className="text-small text-uppercase">Count</strong>
              </th>
            </tr>
          </thead>
          <tbody>
            {ordersDetail &&
              ordersDetail.map((value) => (
                <tr className="text-center" key={value._id}>
                  <td className="align-middle border-0">
                    <h6 className="mb-0">{value._id}</h6>
                  </td>
                  <td className="pl-0 border-0">
                    <div className="media align-items-center justify-content-center">
                      <Link
                        className="reset-anchor d-block animsition-link"
                        to={`/detail/${value.idProduct}`}
                      >
                        <img src={value.productId.img1} alt="..." width="200" />
                      </Link>
                    </div>
                  </td>
                  <td className="align-middle border-0">
                    .productId.name
                    <h6 className="mb-0">{value.productId.name}</h6>
                  </td>
                  <td className="align-middle border-0">
                    <h6 className="mb-0">
                      {convertMoney(value.productId.price)} VNĐ
                    </h6>
                  </td>
                  <td className="align-middle border-0">
                    <h6 className="mb-0">{value.quantity}</h6>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default DetailHistory;
