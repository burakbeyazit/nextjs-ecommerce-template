"use client";
import React, { useEffect, useState } from "react";
import { useAppSelector } from "@/redux/store";
import { toast, ToastContainer } from "react-toastify";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ENDPOINTS } from "@/api/endpoints";
import { jwtDecode } from "jwt-decode";
import Link from "next/link";

const Cart = () => {
  const [user, setUser] = useState<string | null>(null); // State to store user email
  const [cartData, setCartData] = useState<any[]>([]); // State to store cart data
  const [cartId, setCartId] = useState<any[]>([]); // State to store cart data
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("auth_token");

    if (token) {
      try {
        const decodedToken: any = jwtDecode(token);
        const currentTime = Date.now() / 1000;

        if (decodedToken.exp && decodedToken.exp < currentTime) {
          console.log("Token expired, removing from localStorage.");
          localStorage.removeItem("auth_token");
          setUser(null);
          return;
        }

        const email =
          decodedToken[
            "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"
          ];
        setUser(email);
      } catch (error) {
        console.error("Token decoding failed", error);
      }
    } else {
      setUser(null);
    }
  }, []);

  const handleRemoveItem = async (flowerId) => {
    try {
      const response = await fetch(`${ENDPOINTS.removeFromCart}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ flowerId, username: user }), // Kullanıcı bilgisi ve çiçek ID'si
      });

      if (response.ok) {
        toast.success("Ürün sepetten kaldırıldı!");
        fetchCartData(); // Fetch cart data after removal
      } else {
        toast.error("Ürün sepetten kaldırılırken bir hata oluştu!");
      }
    } catch (error) {
      console.error("Ürün kaldırılırken hata oluştu:", error);
      toast.error("Bir hata meydana geldi!");
    }
  };

  const handleCheckout = async () => {
    if (!cartId) {
      toast.error("Sepet ID bulunamadı!");
      return;
    }
    const response = await fetch(`${ENDPOINTS.createOrder}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ cartId, username: user }),
    });
    const data = await response.json();

    if (response.ok) {
      toast.success(`Sipariş Verildi... Sipariş No : ${data}`);
      setTimeout(() => {
        router.push(`/`); // Adjust the route to where you want to redirect
      }, 5000); // 5000ms = 5 seconds
    }
  };

  const fetchCartData = async () => {
    try {
      if (!user) return;

      const response = await fetch(
        `${ENDPOINTS.getCartFLowers}?username=${user}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setCartId(data[0].cartId); // cartId değerini ayrı bir state'e set ediyoruz
        setCartData(data);
      } else {
        console.error("Failed to fetch cart data:", response.statusText);
      }
    } catch (error) {
      console.error("Failed to fetch cart data:", error);
    }
  };

  useEffect(() => {
    fetchCartData();
  }, [user]);

  const updateQuantity = async (flowerId, newQuantity, cartId) => {
    if (newQuantity < 1) return; // Prevent quantity from going below 1

    try {
      const response = await fetch(`${ENDPOINTS.updateCartItemQuantity}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          flowerId,
          username: user,
          quantity: newQuantity,
          cartId: cartId,
        }),
      });

      if (response.ok) {
        toast.success("Ürün miktarı güncellendi!");
        // Update cartData directly without fetching again
        setCartData((prevCartData) =>
          prevCartData.map((flower) =>
            flower.flowerId === flowerId
              ? { ...flower, quantity: newQuantity }
              : flower
          )
        );
      } else {
        toast.error("Ürün miktarı güncellenirken bir hata oluştu!");
      }
    } catch (error) {
      console.error("Quantity update failed:", error);
      toast.error("Bir hata meydana geldi!");
    }
  };

  // Calculate the total price of the cart
  const calculateTotal = () => {
    return cartData.reduce(
      (total, flower) => total + flower.price * flower.quantity,
      0
    );
  };

  const totalAmount = calculateTotal();

  return (
    <>
      {cartData.length > 0 ? (
        <section className="overflow-hidden mt-30 py-20 bg-gray-2">
          <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
            <div className="bg-white rounded-[10px] shadow-1">
              <div className="w-full overflow-x-auto">
                <div className="min-w-[1170px]">
                  <table className="table w-full">
                    <thead>
                      <tr className="text-left">
                        <th className="min-w-[150px] py-2 px-3 text-dark">
                          Ürün
                        </th>
                        <th className="min-w-[100px] py-2 px-3 text-dark">
                          Fiyat
                        </th>
                        <th className="min-w-[100px] py-2 px-3 text-dark">
                          Adet
                        </th>
                        <th className="min-w-[100px] py-2 px-3 text-dark">
                          Ara Toplam
                        </th>
                        <th className="min-w-[100px] py-2 px-3 text-dark text-right">
                          İşlem
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {cartData.map((flower) => (
                        <tr key={flower.flowerId}>
                          <td className="min-w-[150px] py-4 px-3 flex items-center gap-4">
                            <Image
                              src={flower.imageUrl}
                              alt={flower.flowerName}
                              width={30}
                              height={30}
                              className="w-16 h-16 object-cover rounded-md"
                            />
                            <span className="text-dark">
                              {flower.flowerName}
                            </span>
                          </td>
                          <td className="min-w-[180px] py-4 px-3 text-dark">
                            {flower.price}₺
                          </td>
                          <td className="min-w-[120px] py-4 px-3 text-dark">
                            <button
                              className="btn btn-sm btn-outline"
                              onClick={() =>
                                flower.quantity > 1 &&
                                updateQuantity(
                                  flower.flowerId,
                                  flower.quantity - 1,
                                  cartId
                                )
                              }
                              disabled={flower.quantity <= 1} // Disable the minus button when quantity is 1 or less
                            >
                              -
                            </button>
                            <span className="px-2">{flower.quantity}</span>
                            <button
                              className="btn btn-sm btn-outline"
                              onClick={() =>
                                updateQuantity(
                                  flower.flowerId,
                                  flower.quantity + 1,
                                  cartId
                                )
                              }
                            >
                              +
                            </button>
                          </td>

                          <td className="min-w-[200px] py-4 px-3 text-dark">
                            {flower.price * flower.quantity}₺
                          </td>
                          <td className="min-w-[50px] py-4 px-3 text-right">
                            <button
                              className="btn btn-sm btn-error"
                              onClick={() => handleRemoveItem(flower.flowerId)}
                            >
                              Kaldır
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="flex justify-end mt-6">
              <button
                className="btn btn-success hover:btn-success-focus text-white py-3 px-6 rounded-md font-medium"
                onClick={() => handleCheckout()}
              >
                Sepeti Onayla ({totalAmount}₺) {/* Display the total price */}
              </button>
            </div>
          </div>
        </section>
      ) : (
        <div className="text-center mt-8">
          <div className="mx-auto pb-7.5">
            <svg
              className="mx-auto"
              width="100"
              height="100"
              viewBox="0 0 100 100"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* SVG content */}
            </svg>
          </div>
          <p className="m-40">Your cart is empty!</p>
          <Link
            href="/shop"
            className="w-96 mx-auto flex justify-center font-medium text-white py-[13px] px-6 rounded-md ease-out duration-200 hover:bg-opacity-95"
          >
            Continue Shopping
          </Link>
        </div>
      )}
      <ToastContainer />
    </>
  );
};

export default Cart;
