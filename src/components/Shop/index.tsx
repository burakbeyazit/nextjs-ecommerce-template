"use client";
import React, { useState, useEffect } from "react";
import Breadcrumb from "../Common/Breadcrumb";
import { toast } from "react-toastify";
import { ENDPOINTS } from "@/api/endpoints";
import Card from "../Daisy/Card";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";

const ShopWithSidebar = () => {
  const [productSidebar, setProductSidebar] = useState(false);
  const [stickyMenu, setStickyMenu] = useState(false);
  const [flowers, setFlowers] = useState([]);
  const [filteredFlowers, setFilteredFlowers] = useState([]);
  const [categories, setCategories] = useState<
    { categoryId: number; categoryName: string }[]
  >([]); // Kategoriler objelerden oluşuyor
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null); // Kategoriyi categoryId ile takip et
  const [currentPage, setCurrentPage] = useState(1);
  const [flowersPerPage] = useState(9); // 3 columns * 3 rows = 9 flowers per page
  const [username, setUsername] = useState("");
  const router = useRouter();

  const handleStickyMenu = () => {
    if (window.scrollY >= 80) {
      setStickyMenu(true);
    } else {
      setStickyMenu(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch(ENDPOINTS.getCategoies, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      if (response.ok) {
        const categories = await response.json();
        setCategories(categories);
      }
    } catch (error) {
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
      console.error("Error during fetching flowers:", error);
    }
  };

  const checkAuthToken = () => {
    const authToken = localStorage.getItem("auth_token"); // Token'ı localStorage'dan alıyoruz
    if (authToken) {
      const decodedToken: any = jwtDecode(authToken); // Token'ı decode et
      console.log(decodedToken); // Token'dan decoded verileri konsola yazdır

      const email =
        decodedToken[
          "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"
        ];
      setUsername(email); // Username'i state'e set et
    }
  };

  const fetchFlowers = async () => {
    try {
      const response = await fetch(ENDPOINTS.getAllFlowers, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      if (response.ok) {
        const flowerData = await response.json();
        setFlowers(flowerData);
        setFilteredFlowers(flowerData); // Initially display all flowers
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
      console.error("Error during fetching flowers:", error);
    }
  };

  const handleAddToCart = async (flower) => {
    if (!username) {
      router.push("/signin");
    } else {
      const response = await fetch(ENDPOINTS.addToChart, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: username, // Kullanıcı kimliği
          flowerId: flower.flowerId,
          quantity: 1,
        }),
      });

      if (response.ok) {
        toast.success(`${flower.flowerName} sepete eklendi!`);
      } else {
        toast.error("Sepete eklenirken bir hata oluştu!");
      }
    }
  };

  useEffect(() => {
    fetchFlowers();
    fetchCategories();
    checkAuthToken();
    window.addEventListener("scroll", handleStickyMenu);

    function handleClickOutside(event) {
      if (!event.target.closest(".sidebar-content")) {
        setProductSidebar(false);
      }
    }

    if (productSidebar) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [productSidebar]);

  // Filter flowers based on selected category
  const handleCategoryChange = (categoryId: number) => {
    setSelectedCategory(categoryId);
    if (categoryId === null) {
      setFilteredFlowers(flowers); // Show all flowers if "All" is selected
    } else {
      const filtered = flowers.filter(
        (flower) => flower.categoryId === categoryId
      );
      setFilteredFlowers(filtered); // Show flowers of the selected category
    }
    setCurrentPage(1); // Reset to the first page after filtering
  };

  // Pagination Logic
  const indexOfLastFlower = currentPage * flowersPerPage;
  const indexOfFirstFlower = indexOfLastFlower - flowersPerPage;
  const currentFlowers = filteredFlowers.slice(
    indexOfFirstFlower,
    indexOfLastFlower
  );

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const pageNumbers = [];
  for (
    let i = 1;
    i <= Math.ceil(filteredFlowers.length / flowersPerPage);
    i++
  ) {
    pageNumbers.push(i);
  }

  return (
    <>
      <Breadcrumb
        title={"Ürünler"}
        pages={["shop", "/", "shop with sidebar"]}
      />
      <section className="overflow-hidden relative pb-20 pt-5 lg:pt-20 xl:pt-28 bg-[#f3f4f6]">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
          <div className="flex gap-7.5">
            {/* Sidebar */}
            <div
              className={`sidebar-content fixed xl:z-1 z-9999 left-0 top-0 xl:translate-x-0 xl:static max-w-[310px] xl:max-w-[270px] w-full ease-out duration-200 ${
                productSidebar
                  ? "translate-x-0 bg-white p-5 h-screen overflow-y-auto"
                  : "-translate-x-full"
              }`}
            >
              <button
                onClick={() => setProductSidebar(!productSidebar)}
                aria-label="button for product sidebar toggle"
                className={`xl:hidden absolute -right-12.5 sm:-right-8 flex items-center justify-center w-8 h-8 rounded-md bg-white shadow-1 ${
                  stickyMenu
                    ? "lg:top-20 sm:top-34.5 top-35"
                    : "lg:top-24 sm:top-39 top-37"
                }`}
              >
                <svg
                  className="fill-current"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M10.0068 3.44714C10.3121 3.72703 10.3328 4.20146 10.0529 4.5068L5.70494 9.25H20C20.4142 9.25 20.75 9.58579 20.75 10C20.75 10.4142 20.4142 10.75 20 10.75H4.00002C3.70259 10.75 3.43327 10.5742 3.3135 10.302C3.19374 10.0298 3.24617 9.71246 3.44715 9.49321L8.94715 3.49321C9.22704 3.18787 9.70147 3.16724 10.0068 3.44714Z"
                  />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M20.6865 13.698C20.5668 13.4258 20.2974 13.25 20 13.25L4.00001 13.25C3.5858 13.25 3.25001 13.5858 3.25001 14C3.25001 14.4142 3.5858 14.75 4.00001 14.75L18.2951 14.75L13.9472 19.4932C13.6673 19.7985 13.6879 20.273 13.9932 20.5529C14.2986 20.8328 14.773 20.8121 15.0529 20.5068L20.5529 14.5068C20.7539 14.2876 20.8063 13.9703 20.6865 13.698Z"
                  />
                </svg>
              </button>

              {/* Category Filter */}
              <div className="mb-4">
                <h3 className="font-semibold text-lg pb-4">Kategoriler</h3>
                <div className="bg-white rounded-lg shadow-lg p-5">
                  <ul className="space-y-2">
                    {/* All Categories Filter */}
                    <li
                      key="all"
                      className={`cursor-pointer px-4 py-2 rounded-md ${
                        selectedCategory === null
                          ? "bg-red-500 text-red"
                          : "hover:bg-gray-200"
                      }`}
                      onClick={() => handleCategoryChange(null)} // Show all products when clicked
                    >
                      Tüm Kategoriler
                    </li>

                    {/* Other Categories */}
                    {categories.map((category) => (
                      <li
                        key={category.categoryId} // Her kategorinin benzersiz id'sini key olarak kullanıyoruz
                        className={`cursor-pointer px-4 py-2 rounded-md ${
                          selectedCategory === category.categoryId
                            ? "bg-red-500 text-red"
                            : "hover:bg-gray-200"
                        }`}
                        onClick={() =>
                          handleCategoryChange(category.categoryId)
                        }
                      >
                        {category.categoryName}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Products Section */}
            <div className="w-full xl:w-[calc(100%-270px)]">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-3 gap-7.5">
                {/* Ürünleri filtrelenmiş liste üzerinden gösteriyoruz */}
                {currentFlowers.map((flower) => (
                  <Card
                    imageUrl={flower.imageUrl}
                    description={flower.description}
                    title={flower.flowerName}
                    price={flower.price}
                    key={flower.flowerId}
                    add={() => handleAddToCart(flower)} // Bu satırda doğru nesnenin iletildiğinden emin olun
                  />
                ))}
              </div>

              {/* Pagination */}
              <div className="flex justify-center mt-10">
                <nav>
                  <ul className="flex space-x-2">
                    {pageNumbers.map((number) => (
                      <li key={number}>
                        <button
                          onClick={() => paginate(number)}
                          className={`px-4 py-2 rounded-md ${
                            currentPage === number
                              ? "bg-red-700 text-black" // Dark red with white text for selected state
                              : "bg-gray-300 text-gray-800 hover:bg-gray-400" // Light gray with dark text for unselected state
                          }`}
                        >
                          {number}
                        </button>
                      </li>
                    ))}
                  </ul>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ShopWithSidebar;
