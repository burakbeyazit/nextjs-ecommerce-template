"use client";
import React, { useEffect, useState } from "react";
import Breadcrumb from "../Common/Breadcrumb";
import Image from "next/image";
import AddressModal from "./AddressModal";
import Orders from "../Orders";
import { jwtDecode } from "jwt-decode";
import Link from "next/link";
import { ENDPOINTS } from "@/api/endpoints";
import { toast, ToastContainer } from "react-toastify";

interface User {
  firstName: string;
  lastName: string;
  email: string;
}

const MyAccount = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [addressModal, setAddressModal] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [address, setAddress] = useState<string>("");
  const [city, setCity] = useState<string>("");
  const [postalCode, setPostalCode] = useState<string>("");
  const [country, setCountry] = useState<string>("");

  useEffect(() => {
    const token = localStorage.getItem("auth_token");

    if (token) {
      try {
        const decodedToken: any = jwtDecode(token);

        const currentTime = Date.now() / 1000;
        if (decodedToken.exp && decodedToken.exp < currentTime) {
          localStorage.removeItem("auth_token");
          setUser(null);
          return;
        }

        const userData: User = {
          firstName:
            decodedToken[
              "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"
            ],
          lastName:
            decodedToken[
              "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/surname"
            ],
          email:
            decodedToken[
              "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"
            ],
        };
        setUser(userData);
      } catch (error) {
        console.error("Token çözümleme hatası", error);
      }
    }
  }, []);

  useEffect(() => {
    if (activeTab === "orders" && user) {
      fetchOrders();
    }
  }, [activeTab, user]);

  const fetchOrders = async () => {
    try {
      const response = await fetch(`${ENDPOINTS.getOrders}${user.email}`);
      const data = await response.json();
      setOrders(data);
    } catch (error) {
      console.error("Siparişleri almak başarısız oldu:", error);
    }
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddress(e.target.value);
  };

  const handleCityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCity(e.target.value);
  };

  const handlePostalCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPostalCode(e.target.value);
  };

  const handleCountryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCountry(e.target.value);
  };

  const saveAddress = async () => {
    const addressData = {
      email: user.email, // Burada user.email'in doğru şekilde referans gösterildiğinden emin olun
      address: address,
      city: city,
      postalCode: postalCode,
      country: country,
    };

    try {
      const response = await fetch(ENDPOINTS.saveAdress, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(addressData),
      });

      if (response.ok) {
        toast.success("Adres başarıyla kaydedildi");
      } else {
        toast.error("Adres kaydedilemedi");
      }
    } catch (error) {
      toast.error("Bir hata oluştu: " + error.message);
    }
  };

  return (
    <>
      <ToastContainer />
      <section className="overflow-hidden py-20 bg-gray-2">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
          <div className="flex flex-col mt-16 xl:flex-row gap-7.5">
            <div className="xl:max-w-[370px] w-full bg-white mt-10 rounded-xl shadow-1">
              <div className="flex xl:flex-col">
                <div className="hidden lg:flex flex-wrap items-center justify-center gap-5 py-6 px-4 sm:px-7.5 xl:px-9 border-r xl:border-r-0 xl:border-b border-gray-3">
                  <div className="flex justify-center items-center text-center">
                    {user ? (
                      <div>
                        <p className="font-medium text-dark mb-0.5">
                          {user.firstName} {user.lastName}
                        </p>
                        <p className="text-dark mb-0.5">{user.email}</p>
                      </div>
                    ) : (
                      <Link href="/signin">
                        <p className="text-primary">Giriş Yap</p>
                      </Link>
                    )}
                  </div>
                </div>

                <div className="p-4 sm:p-7.5 xl:p-9">
                  <div className="flex flex-wrap xl:flex-nowrap xl:flex-col gap-4">
                    <button
                      onClick={() => setActiveTab("orders")}
                      className={`flex items-center rounded-md gap-2.5 py-3 px-4.5 ease-out duration-200 hover:bg-blue hover:text-white ${
                        activeTab === "orders"
                          ? "text-white bg-blue"
                          : "text-dark-2 bg-gray-1"
                      }`}
                    >
                      Siparişler
                    </button>

                    <button
                      onClick={() => setActiveTab("addresses")}
                      className={`flex items-center rounded-md gap-2.5 py-3 px-4.5 ease-out duration-200 hover:bg-blue hover:text-white ${
                        activeTab === "addresses"
                          ? "text-white bg-blue"
                          : "text-dark-2 bg-gray-1"
                      }`}
                    >
                      Adresler
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="w-full">
              {activeTab === "orders" && (
                <div>
                  <h2 className="text-xl font-bold mb-4">Siparişleriniz</h2>
                  {orders.length === 0 ? (
                    <p>Hiç sipariş bulunamadı.</p>
                  ) : (
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
                                      <strong>Kategori:</strong>{" "}
                                      {flower.category}
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
                  )}
                </div>
              )}

              {activeTab === "addresses" && (
                <div>
                  <h2 className="text-xl font-bold mb-4">Adresiniz</h2>
                  <input
                    type="text"
                    value={address}
                    onChange={handleAddressChange}
                    placeholder="Adresinizi girin"
                    className="border p-2 rounded-md mb-4 w-full"
                  />
                  <input
                    type="text"
                    value={city}
                    onChange={handleCityChange}
                    placeholder="Şehir"
                    className="border p-2 rounded-md mb-4 w-full"
                  />
                  <input
                    type="text"
                    value={postalCode}
                    onChange={handlePostalCodeChange}
                    placeholder="Posta Kodu"
                    className="border p-2 rounded-md mb-4 w-full"
                  />
                  <input
                    type="text"
                    value={country}
                    onChange={handleCountryChange}
                    placeholder="Ülke"
                    className="border p-2 rounded-md mb-4 w-full"
                  />
                  <button
                    onClick={saveAddress}
                    className="bg-blue text-white py-2 px-6 rounded-md"
                  >
                    Adresi Kaydet
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default MyAccount;
