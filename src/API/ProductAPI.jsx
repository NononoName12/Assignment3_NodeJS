// const ProductAPI = {
// 	getAPI: () => {
// 		const url = '/products';
// 		return axiosClient.get(url);
// 	},

// 	getCategory: (query) => {
// 		const url = `/products/category${query}`;
// 		return axiosClient.get(url);
// 	},

// 	getDetail: (id) => {
// 		const url = `/products/${id}`;
// 		return axiosClient.get(url);
// 	},

// 	getPagination: (query) => {
// 		const url = `/products/pagination${query}`;
// 		return axiosClient.get(url);
// 	},
// };

// export default ProductAPI;

const ProductAPI = {
  getAPI: async () => {
    const url = "http://localhost:5000/";
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

    return response.json(); // Chuyển đổi dữ liệu phản hồi thành JSON
  },

  getCategory: async (query) => {
    const url = `/products/category${query}`;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // Bao gồm cookie trong yêu cầu
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    return response.json();
  },

  getDetail: async (id) => {
    const url = `/products/${id}`;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // Bao gồm cookie trong yêu cầu
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    return response.json();
  },

  getPagination: async (query) => {
    const url = `http://localhost:5000/products/pagination${query}`;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // Bao gồm cookie trong yêu cầu
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    return response.json();
  },
};

export default ProductAPI;
