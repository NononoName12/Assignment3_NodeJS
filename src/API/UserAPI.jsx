// const UserAPI = {
//   getAllData: async () => {
//     const url = "http://localhost:5000/users";
//     const response = await fetch(url, {
//       method: "GET", // Chỉ định phương thức GET
//       headers: {
//         "Content-Type": "application/json", // Đặt tiêu đề Content-Type nếu cần
//       },
//       credentials: "include", // Bao gồm cookie trong yêu cầu
//     });

//     // Kiểm tra nếu phản hồi không ok (status khác 2xx)
//     if (!response.ok) {
//       throw new Error("Network response was not ok");
//     }

//     return response.json(); // Chuyển đổi dữ liệu phản hồi thành JSON
//   },

//   // getDetailData: (id) => {
//   // 	const url = `/users/${id}`;
//   // 	return axiosClient.get(url);
//   // },

//   postSignIn: async (inputLogin) => {
//     const url = "http://localhost:5000/auth/signin";
//     try {
//       const response = await fetch(url, {
//         method: "POST", // Chỉ định phương thức POST
//         headers: {
//           "Content-Type": "application/json", // Đặt tiêu đề Content-Type nếu cần
//         },
//         body: JSON.stringify(inputLogin), // Chuyển đổi inputLogin thành chuỗi JSON và thêm vào body
//         credentials: "include", // Bao gồm cookie trong yêu cầu
//       });

//       // Kiểm tra nếu phản hồi không ok (status khác 2xx)
//       // if (!response.ok) {
//       //   throw new Error("Network response was not ok");
//       // }
//       let responseData = await response.json();
//       if (!response.ok) {
//         responseData = responseData;
//         // throw new Error("Network response was not ok");
//       }
//       return responseData;
//     } catch (error) {
//       console.error(
//         "There has been a problem with your fetch operation:",
//         error
//       );
//     }
//   },
// };

// export default UserAPI;
