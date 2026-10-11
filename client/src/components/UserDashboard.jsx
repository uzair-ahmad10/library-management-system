import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import logo_with_title from "../assets/logo-with-title-black.png";
import returnIcon from "../assets/redo.png";
import browseIcon from "../assets/pointing.png";
import bookIcon from "../assets/book-square.png";
import logo from "../assets/black-logo.png";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  ArcElement,
} from "chart.js";
import Header from "../layout/Header";

import { fetchUserBorrowedBooks } from "../store/slices/borrowSlice";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  ArcElement,
);

const UserDashboard = () => {
  const dispatch = useDispatch();

  const { settingPopup } = useSelector((state) => state.popup);
  const { userBorrowedBooks } = useSelector((state) => state.borrow);

  const [totalBorrowedBooks, setTotalBorrowedBooks] = useState(0);
  const [totalReturnedBooks, setTotalReturnedBooks] = useState(0);

  useEffect(() => {
    dispatch(fetchUserBorrowedBooks());
  }, [dispatch]);

  useEffect(() => {
    let numberOfTotalBorrowedBooks =
      userBorrowedBooks?.filter((book) => book.returned === false) || [];
    let numberOfTotalReturnedBooks =
      userBorrowedBooks?.filter((book) => book.returned === true) || [];

    setTotalBorrowedBooks(numberOfTotalBorrowedBooks.length);
    setTotalReturnedBooks(numberOfTotalReturnedBooks.length);
  }, [userBorrowedBooks]);

  const data = {
    labels: ["Total Borrowed Books", "Total Returned Books"],
    datasets: [
      {
        data: [totalBorrowedBooks, totalReturnedBooks],
        backgroundColor: ["#3D3E3E", "#151619"],
        hoverOffset: 4,
      },
    ],
  };

  return (
    <>
      <main className="relative flex-1 p-6 pt-28 bg-[#f3f4f6] min-h-screen">
        <Header />

        {/* Main Layout Container */}
        <div className="flex flex-col xl:flex-row gap-10 mt-4 w-full">
          {/* LEFT SIDE (Takes up approx 65%) */}
          <div className="flex flex-col gap-6 xl:w-2/3">
            {/* Top Stacked Cards */}
            <div className="flex flex-col gap-5 w-full">
              {/* Card 1 */}
              <div className="flex items-center gap-4 bg-white p-4 rounded-xl transition hover:shadow-md duration-300 w-full xl:w-[85%]">
                <span className="w-1 bg-black h-12 rounded-full"></span>
                <span className="bg-gray-200 h-14 w-14 flex justify-center items-center rounded-xl">
                  <img src={bookIcon} alt="book-icon" className="w-7 h-7" />
                </span>
                <p className="text-lg font-semibold ml-2">
                  Your Borrowed Book List
                </p>
              </div>

              {/* Card 2 */}
              <div className="flex items-center gap-4 bg-white p-4 rounded-xl transition hover:shadow-md duration-300 w-full xl:w-[85%]">
                <span className="w-1 bg-black h-12 rounded-full"></span>
                <span className="bg-gray-200 h-14 w-14 flex justify-center items-center rounded-xl">
                  <img src={returnIcon} alt="book-icon" className="w-7 h-7" />
                </span>
                <p className="text-lg font-semibold ml-2">
                  Your Returned Book List
                </p>
              </div>

              {/* Row 3 (Browse Card + Logo) */}
              <div className="flex flex-col sm:flex-row items-center gap-10 w-full">
                <div className="flex items-center gap-4 bg-white p-4 rounded-xl transition hover:shadow-md duration-300 w-full sm:flex-[1.5]">
                  <span className="w-1 bg-black h-12 rounded-full"></span>
                  <span className="bg-gray-200 h-14 w-14 flex justify-center items-center rounded-xl">
                    <img src={browseIcon} alt="book-icon" className="w-7 h-7" />
                  </span>
                  <p className="text-lg font-semibold ml-2">
                    Let's browse books inventory
                  </p>
                </div>
                <div className="flex sm:flex-1 justify-center sm:justify-start">
                  <img
                    src={logo_with_title}
                    alt="logo"
                    className="w-auto h-20 object-contain"
                  />
                </div>
              </div>
            </div>

            {/* Bottom Quote Card */}
            <div className="bg-white p-10 min-h-[350px] font-semibold relative flex flex-col justify-center items-center rounded-2xl w-full mt-2">
              <h4 className="text-xl sm:text-2xl xl:text-3xl text-center leading-relaxed">
                "A reader lives a thousand lives before he dies. The man who
                never reads lives only one."
              </h4>
              <p className="text-gray-600 text-sm sm:text-base font-medium absolute right-8 bottom-6">
                ~ BookWorm Team
              </p>
            </div>
          </div>

          {/* RIGHT SIDE (Takes up approx 35%) */}
          <div className="flex flex-col gap-12 xl:w-1/3 pt-6 items-center">
            {/* Pie Chart */}
            <div className="w-full max-w-[400px]">
              <Pie data={data} options={{ cutout: 0 }} className="mx-auto" />
            </div>

            {/* Legend Card */}
            <div className="flex items-center justify-center p-6 gap-6 bg-white rounded-xl w-full max-w-[400px] shadow-sm">
              <img src={logo} alt="logo" className="w-auto h-16 object-contain" />
              <span className="w-[2px] bg-black h-20 rounded-full"></span>
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <span className="w-3 h-2 rounded-full bg-[#3D3E3E]"></span>
                  <span className="font-medium text-sm sm:text-base">
                    Total Borrowed Books
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="w-3 h-2 rounded-full bg-[#151619]"></span>
                  <span className="font-medium text-sm sm:text-base">
                    Total Returned Books
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default UserDashboard;