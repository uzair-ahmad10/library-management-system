import React, { useState, useEffect } from "react";
import adminIcon from "../assets/pointing.png";
import usersIcon from "../assets/people-black.png";
import bookIcon from "../assets/book-square.png";
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
import logo from "../assets/black-logo.png";
import { useSelector, useDispatch } from "react-redux";
import Header from "../layout/Header";

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

const AdminDashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const { users } = useSelector((state) => state.user);
  const { books } = useSelector((state) => state.book);
  const { allBorrowedBooks } = useSelector((state) => state.borrow);

  const [totalUsers, setTotalUsers] = useState(0);
  const [totalAdmin, setTotalAdmin] = useState(0);
  const [totalBooks, setTotalBooks] = useState((books && books.length) || 0);
  const [totalBorrowedBooks, setTotalBorrowedBooks] = useState(0);
  const [totalReturnedBooks, setTotalReturnedBooks] = useState(0);

  /*
   * BUG FIX (Graph not showing on refresh / initial crash):
   * On page refresh, Redux arrays (users, books, allBorrowedBooks) often start as 
   * undefined or null before API data resolves. Added optional chaining/guards
   * so .filter() and .length don't throw errors, allowing the state to compute cleanly.
   */
  useEffect(() => {
    if (books) {
      setTotalBooks(books.length);
    }

    if (users && Array.isArray(users)) {
      let numberOfUsers = users.filter((user) => user.role === "User");
      let numberOfAdmins = users.filter((user) => user.role === "Admin");
      setTotalUsers(numberOfUsers.length);
      setTotalAdmin(numberOfAdmins.length);
    }

    if (allBorrowedBooks && Array.isArray(allBorrowedBooks)) {
      let numberOfTotalBorrowedBooks = allBorrowedBooks.filter(
        (book) => book.returnDate === null,
      );
      let numberOfTotalReturnedBooks = allBorrowedBooks.filter(
        (book) => book.returnDate !== null,
      );
      setTotalBorrowedBooks(numberOfTotalBorrowedBooks.length);
      setTotalReturnedBooks(numberOfTotalReturnedBooks.length);
    }
  }, [users, books, allBorrowedBooks]);

  /*
   * BUG FIX (Graph disappearance):
   * Chart.js requires responsive constraints and fallback zero-state values, 
   * otherwise a canvas without dimensions collapses to 0x0 height.
   * Fixed typo: hoverOffect -> hoverOffset.
   */
  const chartDataValues =
    totalBorrowedBooks === 0 && totalReturnedBooks === 0
      ? [0, 1] // Fallback slice to render circle outline if data is empty on fresh reload
      : [totalBorrowedBooks, totalReturnedBooks];

  const data = {
    labels: ["Total Borrowed Books", "Total Returned Books"],
    datasets: [
      {
        data: chartDataValues,
        backgroundColor: ["#3D3E3E", "#151619"],
        hoverOffset: 4, // Fixed typo: 'hoverOffect' was invalid
        borderWidth: 0,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        align: "center",
        labels: {
          boxWidth: 14,
          boxHeight: 14,
          usePointStyle: false,
          color: "#000",
          font: { size: 11 },
        },
      },
    },
  };

  return (
    <>
      <main className="relative flex-1 px-8 pb-8 pt-28 xl:pt-32 min-h-screen bg-[#F8F9FA] flex flex-col justify-start">
        <Header />
        <div className="flex flex-col xl:flex-row gap-8 mt-4 items-stretch w-full">

          {/* Left Side: Large Circular Chart & Small Brand Badge Card */}
          <div className="flex-1 flex flex-col justify-between items-center min-w-[320px] max-w-[420px] gap-6">
            <div className="relative w-full aspect-square max-w-[360px] flex items-center justify-center">
              <Pie data={data} options={chartOptions} />
            </div>

            {/* Bottom brand info card */}
            <div className="flex items-center p-5 w-full bg-white shadow-sm border border-gray-100 rounded-xl gap-5">
              <img
                src={logo}
                alt="logo"
                className="w-14 h-14 object-contain"
              />
              <span className="w-[1px] bg-gray-300 h-10"></span>
              <div className="flex flex-col gap-2 text-xs text-gray-700 font-medium">
                <p className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#3D3E3E]"></span>
                  <span>Total Borrowed Books</span>
                </p>
                <p className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#151619]"></span>
                  <span>Total Returned Books</span>
                </p>
              </div>
            </div>
          </div>

          {/* Right Side: Stats, User Profile Card, and Quote */}

          <div className="flex-[1.6] flex flex-col justify-between gap-6">
            {/* Top row: Stat cards stack on left, Admin profile on right */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
              {/* Stat cards */}
              <div className="flex flex-col justify-between gap-4">
                {/* Total Users */}
                <div className="flex items-center bg-white p-4 rounded-xl border border-gray-100 shadow-sm gap-5 h-[95px]">
                  <span className="bg-[#E9ECEF] h-14 w-14 flex justify-center items-center rounded-lg shrink-0">
                    <img src={usersIcon} alt="users-icon" className="w-6 h-6 object-contain" />
                  </span>
                  <span className="w-[1px] bg-gray-900 h-12"></span>
                  <div className="flex flex-col justify-center">
                    <h4 className="font-bold text-2xl leading-none text-center text-black">{totalUsers}</h4>
                    <p className="text-gray-500 text-xs mt-1">Total User Base</p>
                  </div>
                </div>

                {/* Total Books */}
                <div className="flex items-center bg-white p-4 rounded-xl border border-gray-100 shadow-sm gap-5 h-[95px]">
                  <span className="bg-[#E9ECEF] h-14 w-14 flex justify-center items-center rounded-lg shrink-0">
                    <img src={bookIcon} alt="book-icon" className="w-6 h-6 object-contain" />
                  </span>
                  <span className="w-[1px] bg-gray-900 h-12"></span>
                  <div className="flex flex-col justify-center">
                    <h4 className="font-bold text-2xl leading-none text-center text-black">{totalBooks}</h4>
                    <p className="text-gray-500 text-xs mt-1">Total Book Count</p>
                  </div>
                </div>

                {/* Total Admins */}
                <div className="flex items-center bg-white p-4 rounded-xl border border-gray-100 shadow-sm gap-5 h-[95px]">
                  <span className="bg-[#E9ECEF] h-14 w-14 flex justify-center items-center rounded-lg shrink-0">
                    <img src={adminIcon} alt="admin-icon" className="w-6 h-6 object-contain" />
                  </span>
                  <span className="w-[1px] bg-gray-900 h-12 "></span>
                  <div className="flex flex-col justify-center">
                    <h4 className="font-bold text-2xl leading-none text-center text-black">{totalAdmin}</h4>
                    <p className="text-gray-500 text-xs mt-1">Total Admin Count</p>
                  </div>
                </div>
              </div>

              {/* Admin Profile Welcome Card */}
              <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-center items-center text-center">
                {user?.avatar?.url ? (
                  <img
                    src={user.avatar.url}
                    alt="avatar"
                    className="rounded-full w-24 h-24 object-cover mb-3 shadow-sm"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-bold text-xl mb-3">
                    {user?.name ? user.name.charAt(0).toUpperCase() : "A"}
                  </div>
                )}
                <h2 className="text-lg font-bold text-black mb-1">
                  {user?.name || "Admin"}
                </h2>
                <p className="text-gray-400 text-xs leading-relaxed max-w-[240px]">
                  Welcome to your admin dashboard. Here you can manage all the settings and monitor the statistics.
                </p>
              </div>
            </div>

            {/* Bottom Quote Card */}
            <div className="bg-white p-7 rounded-xl border border-gray-100 shadow-sm relative flex flex-col justify-center min-h-[140px]">
              <h4 className="font-bold text-gray-900 text-lg leading-snug max-w-[90%]">
                "Embarking on the journy of reading fosters personal growth, nurturing a path towards excellence and the refinement of character."
              </h4>
              <p className="text-gray-400 text-xs absolute right-7 bottom-4">
                – BookWorm Team
              </p>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default AdminDashboard;