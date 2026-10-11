import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

// Icons/Images
import userIcon from '../assets/user.png';
import settingIcon from '../assets/setting.png';

// Redux Actions
import { toggleSettingPopup } from '../store/slices/popUpSlice';

const Header = () => {
  const dispatch = useDispatch();

  // Get the logged-in user from auth state
  const { user } = useSelector((state) => state.auth);

  // States for real-time clock
  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();

      // Format Hours (12-hour format)
      let hours = now.getHours();
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12 || 12;

      // Format Minutes (padding with 0 if needed)
      const minutes = now.getMinutes().toString().padStart(2, '0');

      setCurrentTime(`${hours}:${minutes} ${ampm}`);

      // Format Date
      const options = { month: 'short', day: 'numeric', year: 'numeric' };
      setCurrentDate(now.toLocaleDateString('en-US', options));
    };

    // Call it immediately so the UI doesn't delay for 1 second
    updateDateTime();

    // Update every second
    const intervalId = setInterval(updateDateTime, 1000);

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  return (
    <header className="absolute top-0 left-0 right-0 bg-white w-full px-6 py-4 shadow-md flex justify-between items-center">
      
      {/* Left Side */}
      <div className="flex items-center gap-2">
        <img src={userIcon} alt="user icon" className="w-8 h-8" />
        <div className="flex flex-col">
          <span className="text-sm font-medium sm:text-lg lg:text-xl sm:font-semibold">
            {user && user.name}
          </span>
          <span className="text-sm font-medium sm:text-lg sm:font-medium">
            {user && user.role}
          </span>
        </div>
      </div>

      {/* Right Side */}
      <div className="hidden md:flex items-center gap-2">
        <div className="flex flex-col text-sm lg:text-base items-end font-semibold">
          <span>{currentTime}</span>
          <span>{currentDate}</span>
        </div>
        
        {/* Divider line */}
        <span className="bg-black h-14 w-[2px]"></span>
        
        <img 
          src={settingIcon} 
          alt="setting icon" 
          className="w-8 h-8 cursor-pointer" 
          onClick={() => dispatch(toggleSettingPopup())} 
        />
      </div>

    </header>
  );
};

export default Header;