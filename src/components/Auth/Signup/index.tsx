"use client";

import { ENDPOINTS } from "@/api/endpoints";
import Breadcrumb from "@/components/Common/Breadcrumb";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";

const Signup = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    password: "",
    retypePassword: "",
    statusMessage: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };
  const router = useRouter();
  const handleRegister = async (formData) => {
    try {
      const response = await fetch(ENDPOINTS.register, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          firstName: formData.firstName,
          lastName: formData.lastName,
          phoneNumber: formData.phoneNumber,
          password: formData.password,
          statusMessage: formData.statusMessage,
          roleId: formData.roleId,
        }),
      });

      if (response.ok) {
        // Success toast
        toast.success("Kayıt başarılı! Yönlendiriliyorsunuz...", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });

        setTimeout(() => {
          router.push("/");
        }, 2000);
      } else {
        const errorData = await response.json();
        toast.error(`Hata: ${errorData.message || "Bir şeyler yanlış gitti"}`, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    } catch (error) {
      // Error toast
      const errorMessage =
        (error as Error).message || "Bir hata oluştu, lütfen tekrar deneyin.";
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      console.error("Error during registration:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.retypePassword) {
      toast.error("Parolalar eşleşmiyor", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      return;
    }

    handleRegister(formData);
  };
  return (
    <>
      <ToastContainer />

      <Breadcrumb title={"Signup"} pages={["Signup"]} />
      <section className="overflow-hidden py-20 bg-gray-2">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
          <div className="max-w-[570px] w-full mx-auto rounded-xl bg-white shadow-1 p-4 sm:p-7.5 xl:p-11">
            <div className="text-center mb-11">
              <h1 className="font-semibold text-xl sm:text-2xl xl:text-heading-5 text-dark mb-1.5">
                Create an Account
              </h1>
            </div>

            <div className="mt-5.5">
              <form onSubmit={handleSubmit}>
                {/* First Name */}
                <div className="mb-5">
                  <label htmlFor="firstName" className="block mb-2.5">
                    First Name <span className="text-red">*</span>
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    id="firstName"
                    placeholder="Enter your first name"
                    className="rounded-lg border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-3 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
                    value={formData.firstName}
                    onChange={handleChange}
                  />
                </div>

                {/* Last Name */}
                <div className="mb-5">
                  <label htmlFor="lastName" className="block mb-2.5">
                    Last Name <span className="text-red">*</span>
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    id="lastName"
                    placeholder="Enter your last name"
                    className="rounded-lg border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-3 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
                    value={formData.lastName}
                    onChange={handleChange}
                  />
                </div>

                {/* Email */}
                <div className="mb-5">
                  <label htmlFor="email" className="block mb-2.5">
                    Email Address <span className="text-red">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    placeholder="Enter your email address"
                    className="rounded-lg border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-3 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>

                {/* Phone Number */}
                <div className="mb-5">
                  <label htmlFor="phoneNumber" className="block mb-2.5">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    name="phoneNumber"
                    id="phoneNumber"
                    placeholder="Enter your phone number"
                    className="rounded-lg border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-3 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                  />
                </div>

                {/* Password */}
                <div className="mb-5">
                  <label htmlFor="password" className="block mb-2.5">
                    Password <span className="text-red">*</span>
                  </label>
                  <input
                    type="password"
                    name="password"
                    id="password"
                    placeholder="Enter your password"
                    autoComplete="on"
                    className="rounded-lg border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-3 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
                    value={formData.password}
                    onChange={handleChange}
                  />
                </div>

                {/* Re-type Password */}
                <div className="mb-5.5">
                  <label htmlFor="retypePassword" className="block mb-2.5">
                    Re-type Password <span className="text-red">*</span>
                  </label>
                  <input
                    type="password"
                    name="retypePassword"
                    id="retypePassword"
                    placeholder="Re-type your password"
                    autoComplete="on"
                    className="rounded-lg border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-3 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
                    value={formData.retypePassword}
                    onChange={handleChange}
                  />
                </div>

                {/* Status Message */}
                <div className="mb-5">
                  <label htmlFor="statusMessage" className="block mb-2.5">
                    Status Message
                  </label>
                  <input
                    type="text"
                    name="statusMessage"
                    id="statusMessage"
                    placeholder="Enter your status message"
                    className="rounded-lg border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-3 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
                    value={formData.statusMessage}
                    onChange={handleChange}
                  />
                </div>

                <button
                  type="submit"
                  className="w-full flex justify-center font-medium text-whitepy-3 px-6 rounded-lg ease-out duration-200 hover:bg-blue mt-7.5"
                >
                  Create Account
                </button>

                <p className="text-center mt-6">
                  Already have an account?
                  <Link
                    href="/signin"
                    className="text-dark ease-out duration-200 hover:text-blue pl-2"
                  >
                    Sign in Now
                  </Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Signup;
