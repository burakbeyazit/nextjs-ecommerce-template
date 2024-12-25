"use client"; // This is important for client-side code

import { useEffect, useState } from "react";
import Link from "next/link";
import { jwtDecode } from "jwt-decode"; // jwt-decode import

interface User {
  firstName: string;
  lastName: string;
  email: string;
}

const AccountLink: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Giriş yapmış kullanıcı bilgilerini localStorage'dan alıyoruz
    const token = localStorage.getItem("auth_token"); // Token'ı localStorage'dan alıyoruz
    console.log("Token:", token);

    if (token) {
      try {
        // Token'ı decode ediyoruz
        const decodedToken: any = jwtDecode(token);
        console.log("Decoded Token:", decodedToken); // Token'ı kontrol ediyoruz

        // Token'daki expiration (exp) değerini kontrol ediyoruz
        const currentTime = Date.now() / 1000; // Current time in seconds
        if (decodedToken.exp && decodedToken.exp < currentTime) {
          // Token expired, remove from localStorage
          console.log("Token expired, removing from localStorage.");
          localStorage.removeItem("auth_token");
          setUser(null);
          return; // Exit the effect
        }

        // Payload kısmından kullanıcının bilgilerini alıyoruz
        const userData: User = {
          firstName:
            decodedToken[
              "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"
            ], // Token'daki firstName bilgisi
          lastName:
            decodedToken[
              "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/surname"
            ], // Token'daki lastName bilgisi
          email:
            decodedToken[
              "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"
            ], // Token'daki email bilgisi
        };
        console.log("User Data:", userData); // Kullanıcı bilgisini kontrol ediyoruz

        setUser(userData); // Kullanıcı bilgilerini state'e set ediyoruz
      } catch (error) {
        console.error("Token decoding failed", error);
      }
    }
  }, []);

  return (
    <Link
      href={user ? "/my-account" : "/signin"}
      className="flex items-center gap-2.5"
    >
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M12 1.25C9.37666 1.25 7.25001 3.37665 7.25001 6C7.25001 8.62335 9.37666 10.75 12 10.75C14.6234 10.75 16.75 8.62335 16.75 6C16.75 3.37665 14.6234 1.25 12 1.25ZM8.75001 6C8.75001 4.20507 10.2051 2.75 12 2.75C13.7949 2.75 15.25 4.20507 15.25 6C15.25 7.79493 13.7949 9.25 12 9.25C10.2051 9.25 8.75001 7.79493 8.75001 6Z"
          fill="#3C50E0"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M12 12.25C9.68646 12.25 7.55494 12.7759 5.97546 13.6643C4.4195 14.5396 3.25001 15.8661 3.25001 17.5L3.24995 17.602C3.24882 18.7638 3.2474 20.222 4.52642 21.2635C5.15589 21.7761 6.03649 22.1406 7.22622 22.3815C8.41927 22.6229 9.97424 22.75 12 22.75C14.0258 22.75 15.5808 22.6229 16.7738 22.3815C17.9635 22.1406 18.8441 21.7761 19.4736 21.2635C20.7526 20.222 20.7512 18.7638 20.7501 17.602L20.75 17.5C20.75 15.8661 19.5805 14.5396 18.0246 13.6643C16.4451 12.7759 14.3136 12.25 12 12.25ZM4.75001 17.5C4.75001 16.6487 5.37139 15.7251 6.71085 14.9717C8.02681 14.2315 9.89529 13.75 12 13.75C14.1047 13.75 15.9732 14.2315 17.2892 14.9717C18.6286 15.7251 19.25 16.6487 19.25 17.5C19.25 18.8078 19.2097 19.544 18.5264 20.1004C18.1559 20.4022 17.5365 20.6967 16.4762 20.9113C15.4193 21.1252 13.9742 21.25 12 21.25C10.0258 21.25 8.58075 21.1252 7.5238 20.9113C6.46354 20.6967 5.84413 20.4022 5.4736 20.1004C4.79033 19.544 4.75001 18.8078 4.75001 17.5Z"
          fill="#3C50E0"
        />
      </svg>

      <div>
        {user ? (
          <>
            <span className="block text-2xs text-dark-4 uppercase">
              Hesabım
            </span>
            <p className="font-medium text-custom-sm text-dark">
              {user.firstName} {user.lastName} ({user.email})
            </p>
          </>
        ) : (
          <>
            <span className="block text-2xs text-dark-4 uppercase">
              account
            </span>
            <p className="font-medium text-custom-sm text-dark">Sign In</p>
          </>
        )}
      </div>
    </Link>
  );
};

export default AccountLink;
