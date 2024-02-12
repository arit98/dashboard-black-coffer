import React, { useEffect, useState } from 'react'

const SideBar = () => {

  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-blue-100 md:mt-6 -mt-4 rounded-lg h-screen min-w-[14em]">
      {/* Sidebar content goes here */}
      <div className="p-4 text-blue-500 text-2xl font-bold font-mono bg-blue-200 m-4 rounded-lg">Dashboard</div>
      <ul className="space-y-2">
      <input type='text' placeholder='Search' className="outline-none md:hidden flex mx-4 px-1 text-xl rounded-lg h-12 w-[88%] text-gray-500" />
      <p className='text-lg md:hidden flex px-4 items-center justify-center text-gray-700 font-sans bg-orange-300 mx-4 rounded-md'>{time.toLocaleTimeString().slice(0, 7)}<span className='bg-orange-200 px-2 flex items-center justify-center rounded-md ml-2 shadow-md'>{time.toLocaleTimeString().slice(8, 12)}</span><span className='bg-orange-200 px-2 rounded-md flex items-center justify-center ml-2 shadow-md'>{time.toDateString()}</span></p>
        <li className="p-4 hover:bg-blue-200 cursor-pointer text-gray-500">Home</li>
        <li className="p-4 hover:bg-blue-200 cursor-pointer text-gray-500">Analytics</li>
        <li className="p-4 hover:bg-blue-200 cursor-pointer text-gray-500">Settings</li>
      </ul>
    </div>
  )
}

export default SideBar