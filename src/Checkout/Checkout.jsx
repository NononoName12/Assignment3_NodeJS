import React, { useEffect, useState } from "react";
import queryString from "query-string";
import CartAPI from "../API/CartAPI";
import CheckoutAPI from "../API/CheckoutAPI";
import convertMoney from "../convertMoney";
import "./Checkout.css";
import { useNavigate } from "react-router-dom";

// import io from 'socket.io-client';
// const socket = io('http://localhost:5000');

function Checkout(props) {
  const navigate = useNavigate();
  const [userLogin, setUserLogin] = useState(null);
  const [carts, setCarts] = useState([]);

  const [total, setTotal] = useState(0);

  const [errorMessage, setErrorMessage] = useState("");
  const [fullname, setFullname] = useState("");
  const [fullnameError, setFullnameError] = useState(false);

  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState(false);

  const [emailRegex, setEmailRegex] = useState(false);

  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState(false);

  const [address, setAddress] = useState("");
  const [addressError, setAddressError] = useState(false);

  const [success, setSuccess] = useState(false);

  const [load, setLoad] = useState(false);

  console.log(userLogin);
  //Hàm này dùng để gọi API và render số sản phẩm
  // useEffect(() => {
  //   if (localStorage.getItem("id_user")) {
  //     const fetchData = async () => {
  //       const params = {
  //         idUser: localStorage.getItem("id_user"),
  //       };

  //       const query = "?" + queryString.stringify(params);

  //       const response = await CartAPI.getCarts(query);

  //       console.log(response);

  //       setCarts(response);

  //       getTotal(response);

  //       if (response.length === 0) {
  //         window.location.replace("/cart");
  //       }
  //     };

  //     fetchData();
  //   }
  // }, []);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const url = "https://backend-nodejs-lke6.onrender.com/cart";
        const response = await fetch(url, {
          method: "GET", // Chỉ định phương thức GET
          headers: {
            "Content-Type": "application/json", // Đặt tiêu đề Content-Type nếu cần
          },
          credentials: "include", // Bao gồm cookie trong yêu cầu
        });

        const dataJson = await response.json(); // Cần await để nhận dữ liệu JSON
        // Kiểm tra nếu phản hồi không ok (status khác 2xx)
        if (!response.ok) {
          if (response.status === 401) {
            // Nếu nhận được mã lỗi 401, chuyển hướng đến trang login
            navigate("/signin"); // Thay đổi đường dẫn đến trang đăng nhập của bạn
          } else {
            throw new Error("Network response was not ok");
          }
        }

        console.log(dataJson.cartProducts); // Log ra dữ liệu phản hồi từ API
        setCarts(dataJson.cartProducts);
        getTotal(dataJson.cartProducts);
        setUserLogin(dataJson.user);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (userLogin) {
      setFullname(userLogin.fullName);
      setEmail(userLogin.email);
      setPhone(userLogin.phone);
    }
  }, [userLogin]); // Mảng rỗng [] đảm bảo useEffect chỉ chạy một lần sau khi render

  //Hàm này dùng để tính tổng tiền carts
  function getTotal(carts) {
    let sub_total = 0;

    const sum_total = carts.map((value) => {
      return (sub_total +=
        parseInt(value.productId.price) * parseInt(value.quantity));
    });

    setTotal(sub_total);
  }

  //Check Validation
  const handlerSubmit = async () => {
    const inputOrder = {
      customer: {
        name: fullname,
        email: email,
        phone: phone,
        address: address,
      },
      products: carts,
      totalPrice: total,
      status: "Pending",
    };

    console.log(inputOrder);
    try {
      const response = await fetch(
        "https://backend-nodejs-lke6.onrender.com/checkout",
        {
          method: "POST", // Chỉ định phương thức POST
          headers: {
            "Content-Type": "application/json", // Đặt tiêu đề Content-Type nếu cần
          },
          body: JSON.stringify(inputOrder),
          credentials: "include", // Bao gồm cookie trong yêu cầu
        }
      );

      const responseData = await response.json();
      if (!response.ok) {
        if (response.status === 401) {
          // Nếu nhận được mã lỗi 401, chuyển hướng đến trang login
          navigate("/signin"); // Thay đổi đường dẫn đến trang đăng nhập của bạn
        } else {
          setErrorMessage(responseData.errorMessage);
          throw new Error("Network response was not ok");
        }
      }
      alert(responseData.message);
      // return responseData;
      window.location.href = "/history";
    } catch (error) {
      console.error(
        "There has been a problem with your fetch operation:",
        error
      );
    }

    // if (!fullname) {
    //   setFullnameError(true);
    //   setEmailError(false);
    //   setPhoneError(false);
    //   setAddressError(false);
    //   return;
    // } else {
    //   if (!email) {
    //     setFullnameError(false);
    //     setEmailError(true);
    //     setPhoneError(false);
    //     setAddressError(false);
    //     return;
    //   } else {
    //     setPhoneError(false);
    //     setAddressError(false);
    //     setFullnameError(false);

    //     if (!validateEmail(email)) {
    //       setEmailRegex(true);
    //       setFullnameError(false);
    //       setEmailError(false);
    //       setPhoneError(false);
    //       setAddressError(false);
    //       return;
    //     } else {
    //       setEmailRegex(false);

    //       if (!phone) {
    //         setFullnameError(false);
    //         setEmailError(false);
    //         setPhoneError(true);
    //         setAddressError(false);
    //         return;
    //       } else {
    //         setFullnameError(false);
    //         setEmailError(false);
    //         setPhoneError(false);
    //         setAddressError(false);

    //         if (!address) {
    //           setFullnameError(false);
    //           setEmailError(false);
    //           setPhoneError(false);
    //           setAddressError(true);
    //         } else {
    //           console.log("Thanh Cong");

    //           setLoad(!load);
    //         }
    //       }
    //     }
    //   }
    // }
  };

  //Hàm này bắt đầu gửi Email xác nhận đơn hàng
  // useEffect(() => {
  //   if (load) {
  //     const sendMail = async () => {
  //       const params = {
  //         to: email,
  //         fullname: fullname,
  //         phone: phone,
  //         address: address,
  //         idUser: localStorage.getItem("id_user"),
  //       };

  //       const query = "?" + queryString.stringify(params);

  //       const response = await CheckoutAPI.postEmail(query);

  //       console.log(response);
  //     };

  //     sendMail();

  //     const data = localStorage.getItem("id_user");

  //     // Gửi socket lên server
  //     // socket.emit("send_order", data);

  //     //Dùng setTimeout delay 3s
  //     //Sau 4s nó sẽ thực hiện
  //     setTimeout(() => {
  //       setSuccess(!success);
  //       setLoad(!load);
  //     }, 4000);
  //   }
  // }, [load]);

  const onChangeName = (e) => {
    setFullname(e.target.value);
  };

  const onChangeEmail = (e) => {
    setEmail(e.target.value);
  };

  const onChangePhone = (e) => {
    setPhone(e.target.value);
  };

  const onChangeAddress = (e) => {
    setAddress(e.target.value);
  };

  function validateEmail(email) {
    const re =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  return (
    <div>
      {load && (
        <div className="wrapper_loader">
          <div className="loader"></div>
        </div>
      )}

      <div className="container">
        <section className="py-5 bg-light">
          <div className="container">
            <div className="row px-4 px-lg-5 py-lg-4 align-items-center">
              <div className="col-lg-6">
                <h1 className="h2 text-uppercase mb-0">Checkout</h1>
              </div>
              <div className="col-lg-6 text-lg-right">
                <nav aria-label="breadcrumb">
                  <ol className="breadcrumb justify-content-lg-end mb-0 px-0">
                    <li className="breadcrumb-item">
                      <a href="index.html">Home</a>
                    </li>
                    <li className="breadcrumb-item">
                      <a href="cart.html">Cart</a>
                    </li>
                    <li className="breadcrumb-item active" aria-current="page">
                      Checkout
                    </li>
                  </ol>
                </nav>
              </div>
            </div>
          </div>
        </section>

        {!success && (
          <section className="py-5">
            <h2 className="h5 text-uppercase mb-4">Billing details</h2>
            <div className="d-flex justify-content-center pb-5">
              {errorMessage && (
                <span className="text-danger">{errorMessage}</span>
              )}
            </div>
            <div className="row">
              <div className="col-lg-8">
                <form>
                  <div className="row">
                    <div className="col-lg-12 form-group">
                      <label
                        className="text-small text-uppercase"
                        htmlFor="Fullname"
                      >
                        Full Name:
                      </label>
                      <input
                        className="form-control form-control-lg"
                        value={fullname}
                        onChange={onChangeName}
                        type="text"
                        placeholder="Enter Your Full Name Here!"
                      />
                      {fullnameError && (
                        <span className="text-danger">
                          * Please Check Your Full Name!
                        </span>
                      )}
                    </div>
                    <div className="col-lg-12 form-group">
                      <label
                        className="text-small text-uppercase"
                        htmlFor="Email"
                      >
                        Email:{" "}
                      </label>
                      <input
                        className="form-control form-control-lg"
                        value={email}
                        onChange={onChangeEmail}
                        type="text"
                        placeholder="Enter Your Email Here!"
                      />
                      {emailError && (
                        <span className="text-danger">
                          * Please Check Your Email!
                        </span>
                      )}
                      {emailRegex && (
                        <span className="text-danger">
                          * Incorrect Email Format
                        </span>
                      )}
                    </div>
                    <div className="col-lg-12 form-group">
                      <label
                        className="text-small text-uppercase"
                        htmlFor="Phone"
                      >
                        Phone Number:{" "}
                      </label>
                      <input
                        className="form-control form-control-lg"
                        value={phone}
                        onChange={onChangePhone}
                        type="text"
                        placeholder="Enter Your Phone Number Here!"
                      />
                      {phoneError && (
                        <span className="text-danger">
                          * Please Check Your Phone Number!
                        </span>
                      )}
                    </div>
                    <div className="col-lg-12 form-group">
                      <label
                        className="text-small text-uppercase"
                        htmlFor="Address"
                      >
                        Address:{" "}
                      </label>
                      <input
                        className="form-control form-control-lg"
                        value={address}
                        onChange={onChangeAddress}
                        type="text"
                        placeholder="Enter Your Address Here!"
                      />
                      {addressError && (
                        <span className="text-danger">
                          * Please Check Your Address!
                        </span>
                      )}
                    </div>
                    <div className="col-lg-12 form-group">
                      <a
                        className="btn btn-dark"
                        style={{ color: "white" }}
                        type="submit"
                        onClick={handlerSubmit}
                      >
                        Place order
                      </a>
                    </div>
                  </div>
                </form>
              </div>
              <div className="col-lg-4">
                <div className="card border-0 rounded-0 p-lg-4 bg-light">
                  <div className="card-body">
                    <h5 className="text-uppercase mb-4">Your order</h5>
                    <ul className="list-unstyled mb-0">
                      {carts &&
                        carts.map((value) => (
                          <div key={value._id}>
                            <li className="d-flex align-items-center justify-content-between">
                              <strong className="small font-weight-bold">
                                {value.productId.name}
                              </strong>
                              <br></br>
                              <span className="text-muted small">
                                {convertMoney(value.productId.price)} VND x{" "}
                                {value.quantity}
                              </span>
                            </li>
                            <li className="border-bottom my-2"></li>
                          </div>
                        ))}
                      <li className="d-flex align-items-center justify-content-between">
                        <strong className="text-uppercase small font-weight-bold">
                          Total
                        </strong>
                        <span>{convertMoney(total)} VND</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {success && (
          <section className="py-5">
            <div className="p-5">
              <h1>You Have Successfully Ordered!</h1>
              <p style={{ fontSize: "1.2rem" }}>Please Check Your Email.</p>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

export default Checkout;
