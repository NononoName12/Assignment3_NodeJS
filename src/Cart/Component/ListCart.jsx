import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import convertMoney from "../../convertMoney";

ListCart.propTypes = {
  listCart: PropTypes.array,
  onDeleteCart: PropTypes.func,
  onUpdateCount: PropTypes.func,
};

ListCart.defaultProps = {
  listCart: [],
  onDeleteCart: null,
  onUpdateCount: null,
};

function ListCart(props) {
  const { listCart, onDeleteCart, onUpdateCount, user, onSendData } = props;

  const [cartItems, setCartItems] = useState();
  console.log(cartItems);

  // Sử dụng useEffect để cập nhật cartItems khi listCart thay đổi
  useEffect(() => {
    setCartItems(listCart);
  }, [listCart]); // Chạy lại khi listCart thay đổi

  const handlerChangeText = (e) => {
    console.log(e.target.value);
  };

  const handlerDelete = async (userId, productId) => {
    // Hiển thị thông báo xác nhận
    const confirmDelete = window.confirm(
      "Bạn có chắc chắn muốn xóa sản phẩm này khỏi giỏ hàng không?"
    );

    if (confirmDelete) {
      console.log(userId, productId);
      try {
        const response = await fetch(
          `https://backend-assignment3-odn0.onrender.com/cart/remove`,
          {
            method: "POST", // Sử dụng phương thức POST
            headers: {
              "Content-Type": "application/json", // Thiết lập loại nội dung là JSON
            },
            body: JSON.stringify({ userId, productId }), // Chuyển đổi đối tượng thành chuỗi JSON
            credentials: "include", // Bao gồm cookie trong yêu cầu
          }
        );

        if (!response.ok) {
          throw new Error(
            `Error removing item from cart: ${response.statusText}`
          );
        }

        // Cập nhật giỏ hàng sau khi xóa sản phẩm
        setCartItems((prevItems) => {
          const updatedItems = prevItems.filter(
            (item) => item.productId._id !== productId
          );
          console.log("Updated cart items:", updatedItems); // Kiểm tra giá trị cập nhật
          return updatedItems;
        });
      } catch (error) {
        console.error("Error removing item from cart", error);
      }
    }
  };

  const handlerDown = (idUser, idProduct, quantity) => {
    console.log(idUser, idProduct, quantity);

    let updateCount;
    // //Trước khi trả dữ liệu về component cha thì phải thay đổi biến count
    if (quantity > 1) {
      updateCount = quantity - 1;
    } else {
      updateCount = quantity;
    }

    // Tìm sản phẩm trong cartItems
    const updatedCartItems = cartItems.map((item) => {
      if (item.productId._id === idProduct) {
        // Nếu sản phẩm đã tồn tại trong giỏ hàng, cập nhật số lượng
        return { ...item, quantity: updateCount }; // Hoặc bạn có thể cộng dồn quantity nếu cần
      }
      return item; // Nếu không phải sản phẩm cần cập nhật, trả về item cũ
    });
    onSendData(updatedCartItems);
    // Cập nhật state với cartItems mới
    setCartItems(updatedCartItems);
  };

  const handlerUp = (idUser, idProduct, quantity) => {
    console.log(idUser, idProduct, quantity);

    // //Trước khi trả dữ liệu về component cha thì phải thay đổi biến count
    const updateCount = quantity + 1;

    // Tìm sản phẩm trong cartItems
    const updatedCartItems = cartItems.map((item) => {
      if (item.productId._id === idProduct) {
        // Nếu sản phẩm đã tồn tại trong giỏ hàng, cập nhật số lượng
        return { ...item, quantity: updateCount }; // Hoặc bạn có thể cộng dồn quantity nếu cần
      }
      return item; // Nếu không phải sản phẩm cần cập nhật, trả về item cũ
    });
    onSendData(updatedCartItems);
    // Cập nhật state với cartItems mới
    setCartItems(updatedCartItems);
  };

  return (
    <div className="table-responsive mb-4">
      <table className="table">
        <thead className="bg-light">
          <tr className="text-center">
            <th className="border-0" scope="col">
              {" "}
              <strong className="text-small text-uppercase">Image</strong>
            </th>
            <th className="border-0" scope="col">
              {" "}
              <strong className="text-small text-uppercase">Product</strong>
            </th>
            <th className="border-0" scope="col">
              {" "}
              <strong className="text-small text-uppercase">Price</strong>
            </th>
            <th className="border-0" scope="col">
              {" "}
              <strong className="text-small text-uppercase">Quantity</strong>
            </th>
            <th className="border-0" scope="col">
              {" "}
              <strong className="text-small text-uppercase">Total</strong>
            </th>
            <th className="border-0" scope="col">
              {" "}
              <strong className="text-small text-uppercase">Remove</strong>
            </th>
          </tr>
        </thead>
        <tbody>
          {cartItems &&
            cartItems.map((value, index) => (
              <tr className="text-center" key={index}>
                <td className="pl-0 border-0">
                  <div className="media align-items-center justify-content-center">
                    <Link
                      className="reset-anchor d-block animsition-link"
                      to={`/detail/${value.idProduct}`}
                    >
                      <img src={value.productId.img1} alt="..." width="70" />
                    </Link>
                  </div>
                </td>
                <td className="align-middle border-0">
                  <div className="media align-items-center justify-content-center">
                    <Link
                      className="reset-anchor h6 animsition-link"
                      to={`/detail/${value.idProduct}`}
                    >
                      {value.productId.name}
                    </Link>
                  </div>
                </td>

                <td className="align-middle border-0">
                  <p className="mb-0 small">
                    {convertMoney(value.productId.price)} VND
                  </p>
                </td>
                <td className="align-middle border-0">
                  <div className="quantity justify-content-center">
                    <button
                      className="dec-btn p-0"
                      style={{ cursor: "pointer" }}
                      onClick={() =>
                        handlerDown(
                          user._id,
                          value.productId._id,
                          value.quantity
                        )
                      }
                    >
                      <i className="fas fa-caret-left"></i>
                    </button>
                    <input
                      className="form-control form-control-sm border-0 shadow-0 p-0"
                      type="text"
                      value={value.quantity}
                      onChange={handlerChangeText}
                    />
                    <button
                      className="inc-btn p-0"
                      style={{ cursor: "pointer" }}
                      onClick={() =>
                        handlerUp(user._id, value.productId._id, value.quantity)
                      }
                    >
                      <i className="fas fa-caret-right"></i>
                    </button>
                  </div>
                </td>
                <td className="align-middle border-0">
                  <p className="mb-0 small">
                    {convertMoney(
                      parseInt(value.productId.price) * parseInt(value.quantity)
                    )}{" "}
                    VND
                  </p>
                </td>
                <td className="align-middle border-0">
                  <a
                    className="reset-anchor remove_cart"
                    style={{ cursor: "pointer" }}
                    onClick={() => handlerDelete(user._id, value.productId._id)}
                  >
                    <i className="fas fa-trash-alt small text-muted"></i>
                  </a>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}

export default ListCart;
