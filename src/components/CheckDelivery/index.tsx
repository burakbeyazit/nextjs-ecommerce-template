"use client";
import React, { useState } from "react";
import { ENDPOINTS } from "@/api/endpoints";
import { toast, ToastContainer } from "react-toastify";

const CheckDelivery = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [orderId, setOrderId] = useState<string>("");

  // Fetch a single order by ID
  const fetchOrderById = async () => {
    if (!orderId) {
      toast.error("Lütfen bir sipariş ID'si girin.");
      return;
    }

    try {
      const response = await fetch(`${ENDPOINTS.getOrdersbyId}${orderId}`);
      if (response.ok) {
        const data = await response.json();
        setOrders([data]); // We assume the response contains the order as an object.
      } else {
        toast.error("Sipariş bulunamadı.");
      }
    } catch (error) {
      console.error("Siparişi almak başarısız oldu:", error);
      toast.error("Bir hata oluştu.");
    }
  };

  return (
    <>
      <ToastContainer />
      <section className="overflow-hidden pt-60 bg-gray-2">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
          <div className="flex flex-col mt-16 xl:flex-row gap-7.5">
            <div className="w-full">
              {/* Input for Order ID */}
              <div className="mb-4">
                <input
                  type="text"
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  placeholder="Sipariş ID'si girin"
                  className="border p-2 rounded-md mb-4 w-full"
                />
                <button
                  onClick={fetchOrderById}
                  className="bg-blue text-white py-2 px-6 rounded-md"
                >
                  Siparişi Getir
                </button>
              </div>

              {/* Display the order details */}
              {orders.length > 0 && (
                <div>
                  <h2 className="text-xl font-bold mb-4">Sipariş Detayları</h2>
                  <ul>
                    {orders.map((order) => (
                      <li key={order.orderId} className="mb-6 p-4 border-b">
                        <div className="mb-2">
                          <p>
                            <strong>Sipariş ID:</strong> {order.orderId}
                          </p>
                          <p>
                            <strong>Sipariş Tarihi:</strong>{" "}
                            {new Date(order.orderDate).toLocaleString()}
                          </p>
                          <p>
                            <strong>Toplam Fiyat:</strong> $
                            {order.totalPrice.toFixed(2)}
                          </p>
                          <p>
                            <strong>Durum:</strong>{" "}
                            {order.status === 0 ? "Beklemede" : "Tamamlandı"}
                          </p>
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold">
                            Bu Siparişteki Çiçekler:
                          </h3>
                          <ul>
                            {order.flowers.map((flower) => (
                              <li
                                key={flower.flowerId}
                                className="flex items-center mb-4"
                              >
                                <img
                                  src={flower.imageUrl}
                                  alt={flower.flowerName}
                                  className="w-16 h-16 object-cover mr-4"
                                />
                                <div>
                                  <p>
                                    <strong>Adı:</strong> {flower.flowerName}
                                  </p>
                                  <p>
                                    <strong>Kategori:</strong> {flower.category}
                                  </p>
                                  <p>
                                    <strong>Fiyat:</strong> $
                                    {flower.price.toFixed(2)}
                                  </p>
                                  <p>
                                    <strong>Açıklama:</strong>{" "}
                                    {flower.description}
                                  </p>
                                  <p>
                                    <strong>Stok Miktarı:</strong>{" "}
                                    {flower.stockQuantity}
                                  </p>
                                </div>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default CheckDelivery;
