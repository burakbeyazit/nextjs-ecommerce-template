export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const ENDPOINTS = {
  register: `${API_BASE_URL}/api/auth/register`,
  login: `${API_BASE_URL}/api/auth/login`,
  getAllFlowers: `${API_BASE_URL}/api/flowers`,
  getCategoies: `${API_BASE_URL}/api/flowers/categories`,
  addToChart: `${API_BASE_URL}/api/cart/add`,
  getCartFLowers: `${API_BASE_URL}/api/cart/get-by-username`,
  removeFromCart: `${API_BASE_URL}/api/cart/remove`,
  updateCartItemQuantity: `${API_BASE_URL}/api/cart/update`,
  createOrder: `${API_BASE_URL}/api/order/create`,
  getOrders: `${API_BASE_URL}/api/order/user/`,
  getOrdersbyId: `${API_BASE_URL}/api/order/`,

  saveAdress: `${API_BASE_URL}/api/auth/saveAdress`,
};
