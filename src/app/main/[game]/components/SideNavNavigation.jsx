import React from "react";

const navigations = ["chats", "lobby", "settings"];

const SideNavNavigation = ({ selectedSideNav , setSelectedSideNav}) => {
  const handleNavigationClick = (navItem) => {
    // console.log(navItem);
    setSelectedSideNav(navItem);
  };
  return (
    <>
      <div className="w-full h-full flex flex-row justify-center items-center">
        {navigations.map((navItem) => {
          return (
            <div
              key={navItem}
              onClick={() => handleNavigationClick(navItem)}
              className={`text-sm px-2 xl:px-4 py-1 bg-gray-400 rounded-full mx-1 lg:mx-2 xl:mx-4 hover:bg-gray-500 cursor-pointer ${
                selectedSideNav === navItem ? "bg-gray-500" : ""
              }`}
            >
              {navItem}
            </div>
          );
        })}
      </div>
    </>
  );
};

export default SideNavNavigation;
