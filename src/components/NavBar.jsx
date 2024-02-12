import React, { useEffect, useState } from 'react';

const NavBar = () => {
  const [time, setTime] = useState(new Date());
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className='w-full mt-6 px-6 h-20 bg-cardOverlay flex items-center gap-6 backdrop-blur-md drop-shadow-lg rounded-xl z-50'>
      <div className='w-full flex gap-6 items-center'>
        <p className='text-textColor font-mono bg-orange-300 p-2 rounded-lg font-bold text-3xl'>Dashboard</p>
        <input type='text' placeholder='Search' className='w-[40%] h-12 bg-orange-50 flex items-center justify-start pl-4 rounded-lg text-2xl outline-none' />
        <p className='text-2xl text-gray-700 font-sans bg-orange-300 p-2 rounded-md'>{time.toLocaleTimeString().slice(0, 7)}<span className='bg-orange-200 px-2 rounded-md ml-2 shadow-md'>{time.toLocaleTimeString().slice(8, 12)}</span><span className='bg-orange-200 px-2 rounded-md ml-2 shadow-md'>{time.toDateString()}</span></p>
      </div>

      <div className='flex flex-col items-center justify-center gap-2 p-1.5 rounded-lg cursor-pointer'>
        {menuOpen &&
          <div className='w-32 absolute top-[5.5rem] p-2 -ml-6 bg-cardOverlay backdrop-blur-md drop-shadow-lg rounded-xl'>
            <p className='flex items-center justify-center border-b-2 border-white text-lighttextGray hover:text-textColor'>Admin</p>
            <p className='flex items-center justify-center border-b-2 border-white text-lighttextGray hover:text-textColor'>Settings</p>
            <p className='flex items-center justify-center text-lighttextGray hover:text-textColor'>Logout</p>
          </div>
        }
        <div className='bg-orange-300 h-12 w-12 rounded-full' onClick={toggleMenu}></div>
      </div>
    </div>
  );
};

export default NavBar;
