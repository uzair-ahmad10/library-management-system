import { useState } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

// Layout & Components imports
import Sidebar from "../layout/SideBar";
import AdminDashboard from "../components/AdminDashboard";
import BookManagement from "../components/BookManagement";
import Catalog from "../components/Catalog";
import MyBorrowedBooks from "../components/MyBorrowedBooks";
import UserDashboard from "../components/UserDashboard";
import Users from "../components/Users";

const Home = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedComponent, setSelectedComponent] = useState("");

  // Fetching authentication state using Redux
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  // Redirect to login if the user is not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return (
    <>
      <div className="relative md:pl-64 flex min-h-screen bg-gray-100">
        {/* Mobile Hamburger Menu Icon */}

        <div className="md:hidden z-20 absolute right-6 top-4 sm:top-6 flex justify-center items-center bg-black rounded-md h-9 w-9 text-white">
          <GiHamburgerMenu
            className="text-2xl cursor-pointer"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          />
        </div>

        {/* Sidebar Component */}
        <Sidebar
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
          setSelectedComponent={setSelectedComponent}
        />

        {/* Intermediary Invoked Function Expression (IIFE) for rendering selected components */}
        {(() => {
          switch (selectedComponent) {
            case "Dashboard":
              return user?.role === "Admin" ? (
                <AdminDashboard />
              ) : (
                <UserDashboard />
              );
              break;

            case "Books":
              return <BookManagement />;
              break;

            case "Catalog":
              if (user?.role === "Admin") return <Catalog />;
              break;

            case "Users":
              if (user?.role === "Admin") return <Users />;
              break;

            case "My Borrowed Books":
              return <MyBorrowedBooks />;
              break;

            default:
              return user?.role === "User" ? (
                <UserDashboard />
              ) : (
                <AdminDashboard />
              );
              break;
          }
        })()}
      </div>
    </>
  );
};

export default Home;
