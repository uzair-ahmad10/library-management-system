import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { AiOutlineClose } from "react-icons/ai"; // Or whatever close icon you imported
import { RiAdminFill } from "react-icons/ri";
import AddNewAdmin from "../popups/AddNewAdmin";
import SettingPopup from "../popups/SettingPopup.jsx"

// Assets
import logo_with_title from "../assets/logo-with-title.png";
import logoutIcon from "../assets/logout.png";
import closeIcon from "../assets/white-close-icon.png";
import dashboardIcon from "../assets/element.png";
import bookIcon from "../assets/book.png";
import catalogIcon from "../assets/catalog.png";
import settingIcon from "../assets/setting-white.png";
import usersIcon from "../assets/people.png";

// Redux Actions
import { logout, resetAuthSlice } from "../store/slices/authSlice";
import {
  toggleAddNewAdminPopup,
  toggleSettingPopup,
} from "../store/slices/popUpSlice";

const Sidebar = ({ isSidebarOpen, setIsSidebarOpen, setSelectedComponent }) => {
  const dispatch = useDispatch();

  const { isAuthenticated, user, message, error, loading } = useSelector(
    (state) => state.auth,
  );

  const { addNewAdminPopup, settingPopup } = useSelector((state) => state.popup);

  const handleLogout = () => {
    dispatch(logout());
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(resetAuthSlice());
    }
    if (message) {
      toast.success(message);
      dispatch(resetAuthSlice());
    }
  }, [dispatch, error, message, isAuthenticated, loading]);

  return (
    <>
      <aside
        className={`${
          isSidebarOpen ? "left-0" : "-left-full"
        } z-10 transition-all duration-700 md:relative md:left-0 flex w-64 bg-black text-white flex-col h-full fixed top-0 bottom-0`}  style={{ position: 'fixed' }}
      >
        <div className="px-6 py-4 my-8">
          <img src={logo_with_title} alt="logo" />

          {/* Mobile Close Button */}
          <AiOutlineClose
            className="h-fit w-fit absolute top-0 right-4 mt-4 block md:hidden cursor-pointer"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          />
        </div>

        <nav className="flex-1 px-4 space-y-2">
          {/* Common Links */}
          <button
            onClick={() => setSelectedComponent("Dashboard")}
            className="w-full py-2 px-2 font-medium bg-transparent rounded-md hover:cursor-pointer flex items-center space-x-2 hover:bg-gray-800 transition"
          >
            <img src={dashboardIcon} alt="icon" />
            <span>Dashboard</span>
          </button>

          <button
            onClick={() => setSelectedComponent("Books")}
            className="w-full py-2 px-2 font-medium bg-transparent rounded-md hover:cursor-pointer flex items-center space-x-2 hover:bg-gray-800 transition"
          >
            <img src={bookIcon} alt="icon" />
            <span>Books</span>
          </button>

          {/* Admin Links */}
          {isAuthenticated && user?.role === "Admin" && (
            <>
              <button
                onClick={() => setSelectedComponent("Catalog")}
                className="w-full py-2 px-2 font-medium bg-transparent rounded-md hover:cursor-pointer flex items-center space-x-2 hover:bg-gray-800 transition"
              >
                <img src={catalogIcon} alt="icon" />
                <span>Catalog</span>
              </button>

              <button
                onClick={() => setSelectedComponent("Users")}
                className="w-full py-2 px-2 font-medium bg-transparent rounded-md hover:cursor-pointer flex items-center space-x-2 hover:bg-gray-800 transition"
              >
                <img src={usersIcon} alt="icon" />
                <span>Users</span>
              </button>

              <button
                onClick={() => dispatch(toggleAddNewAdminPopup())}
                className="w-full py-2 px-2 font-medium bg-transparent rounded-md hover:cursor-pointer flex items-center space-x-2 hover:bg-gray-800 transition"
              >
                <RiAdminFill className="w-6 h-6" />
                <span>Add New Admin</span>
              </button>

              <button
                onClick={() => dispatch(toggleSettingPopup())}
                className="flex md:hidden w-full py-2 px-2 font-medium text-white bg-transparent rounded-md hover:cursor-pointer items-center space-x-2 hover:bg-gray-800 transition"
              >
                <img src={settingIcon} alt="icon" />
                <span>Update Credentials</span>
              </button>ٖ
            </>
          )}

          {/* User Links */}
          {isAuthenticated && user?.role === "User" && (
            <>
              <button
                onClick={() => setSelectedComponent("My Borrowed Books")}
                className="w-full py-2 px-2 font-medium bg-transparent rounded-md hover:cursor-pointer flex items-center space-x-2 hover:bg-gray-800 transition"
              >
                <img src={catalogIcon} alt="icon" />
                <span>My Borrowed Books</span>
              </button>

              <button
                onClick={() => dispatch(toggleSettingPopup())}
                className="flex md:hidden w-full py-2 px-2 font-medium text-white bg-transparent rounded-md hover:cursor-pointer items-center space-x-2 hover:bg-gray-800 transition"
              >
                <img src={settingIcon} alt="icon" />
                <span>Update Credentials</span>
              </button>
            </>
          )}
        </nav>

        {/* Logout Button */}
        <div className="px-6 py-4">
          <button
            onClick={handleLogout}
            className="w-fit py-2 px-2 font-medium text-center bg-transparent rounded-md hover:cursor-pointer flex items-center justify-center space-x-5 mx-auto hover:bg-gray-800 transition"
          >
            <img src={logoutIcon} alt="icon"/>
            <span>Logout</span>
          </button>
        </div>

        <img
          src={closeIcon}
          alt="closeIcon"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="h-fit w-fit absolute top-0 right-4 mt-4 block md:hidden"
        />
      </aside>

      {/* Render Popups if their state is true */}
      {addNewAdminPopup && <AddNewAdmin />}
      {settingPopup && <SettingPopup/>}
    </>
  );
};

export default Sidebar;
