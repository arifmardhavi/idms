import React, { useState, useEffect, useRef } from "react";
import { 
    IconMenu2, 
    IconX, 
    IconBuildingWarehouse,
    IconClipboardList,
    IconCylinder,
    IconScubaDivingTank,
    IconRowRemove,
    IconFileReport,
    IconBrowserCheck,
    IconArchive,
    IconBook,
    IconDatabase,
    IconSun,
    IconMoon,
} from "@tabler/icons-react";
import { useSelector, useDispatch } from 'react-redux';
import { toggleDarkMode } from "../../redux/themeSlice";
import { Drawer } from "@mui/material";
import Sidebar from "../Sidebar";
import NavMenu from "./NavMenu";

const Navbar = () => {
    const [isClicked, setIsClicked] = useState(false);
    const menuRef = useRef(null); 
    const dispatch = useDispatch();
    const isDarkMode = useSelector((state) => state.theme.isDarkMode);

    useEffect(() => {
    document.body.classList.toggle("dark", isDarkMode);
    }, [isDarkMode]);

    return (
        <>
            {/* navbar Logo */}
            <nav className="flex justify-center items-center px-2 py-4 h-20 shadow-sm dark:bg-slate-800">
                <div className="flex items-center gap-1 lg:gap-4">
                    <div ref={menuRef} className="block xl:hidden absolute left-4" onClick={() => setIsClicked(!isClicked)}>
                        {isClicked ? (
                        <IconX className="text-black cursor-pointer transition duration-100 dark:text-white" width={30} height={30} stroke={2} />
                        ) : (
                        <IconMenu2 className="text-black cursor-pointer transition duration-100 dark:text-white" width={30} height={30} stroke={2} />
                        )}
                    </div>
                    {
                        isDarkMode ? 
                        <img className="w-24 lg:w-32 border-r-2" src="/images/kpi-putih.png" alt="Pertamina Logo" />
                        : 
                        <img className="w-24 lg:w-32 border-r-2" src="/images/kpi.png" alt="Pertamina Logo" />
                    }
                    <h1 className="hidden lg:block lg:text-4xl font-bold animate-bounce text-black dark:text-white">
                        Inspection Data Management System
                    </h1>
                    <h1 className="block text-xl lg:hidden font-bold text-black dark:text-white">
                        IDMS
                    </h1>
                </div>
                <button className="absolute right-4 bg-slate-300 dark:text-yellow-500 p-2 rounded-full dark:bg-slate-700" onClick={() => dispatch(toggleDarkMode())}>
                {isDarkMode ? (
                <IconSun className="text-yellow-500" />
                ) : (
                <IconMoon className="text-blue-500" />
                )}
                </button>
            </nav>
            {/* navbar dekstop */}
            <div className="hidden xl:flex flex-row justify-center items-center pt-4">
                <nav className="hidden xl:flex justify-between w-[87%] bg-slate-200 dark:bg-slate-950 rounded-full items-center px-2 py-4 h-24 gap-2">
                    <NavMenu 
                        title="Internal Maintenance"
                        icon={IconBuildingWarehouse}
                        Items={[
                            { menuName: "Master Data 1", link: "/master-data1" },
                            { menuName: "Master Data 2", link: "/master-data2" },
                        ]}
                        
                    />
                    <NavMenu 
                        title="Goverment Compliance"
                        icon={IconClipboardList}
                        Items={[
                            { menuName: "Master Data 1", link: "/master-data1" },
                            { menuName: "Master Data 2", link: "/master-data2" },
                        ]}
                        
                    />
                    <NavMenu 
                        title="Piping Inspection"
                        icon={IconCylinder}
                        Items={[
                            { menuName: "Master Data 1", link: "/master-data1" },
                            { menuName: "Master Data 2", link: "/master-data2" },
                        ]}
                    />
                    <NavMenu 
                        title="PV Inspection"
                        icon={IconCylinder}
                        Items={[
                            { menuName: "Master Data 1", link: "/master-data1" },
                            { menuName: "Master Data 2", link: "/master-data2" },
                        ]}
                    />
                    <NavMenu 
                        title="Tank Inspection"
                        icon={IconScubaDivingTank}
                        Items={[
                            { menuName: "Master Data 1", link: "/master-data1" },
                            { menuName: "Master Data 2", link: "/master-data2" },
                        ]}
                        
                    />
                    <NavMenu 
                        title="PSV Inspection"
                        icon={IconRowRemove}
                        Items={[
                            { menuName: "Master Data 1", link: "/master-data1" },
                            { menuName: "Master Data 2", link: "/master-data2" },
                        ]}
                        
                    />
                    <NavMenu 
                        title="Inspection Report"
                        icon={IconFileReport}
                        Items={[
                            { menuName: "Master Data 1", link: "/master-data1" },
                            { menuName: "Master Data 2", link: "/master-data2" },
                        ]}
                        
                    />
                    <NavMenu 
                        title="Corrosion Management"
                        icon={IconBrowserCheck}
                        Items={[
                            { menuName: "Master Data 1", link: "/master-data1" },
                            { menuName: "Master Data 2", link: "/master-data2" },
                        ]}
                        
                    />
                    <NavMenu 
                        title="P-Office Archive"
                        icon={IconArchive}
                        Items={[
                            { menuName: "Master Data 1", link: "/master-data1" },
                            { menuName: "Master Data 2", link: "/master-data2" },
                        ]}
                        
                    />
                    <NavMenu 
                        title="Engineering Databook"
                        icon={IconBook}
                        Items={[
                            { menuName: "Master Data 1", link: "/master-data1" },
                            { menuName: "Master Data 2", link: "/master-data2" },
                        ]}
                        
                    />
                    <NavMenu 
                        title="Master Data"
                        icon={IconDatabase}
                        Items={[
                            { menuName: "Master Data 1", link: "/master-data1" },
                            { menuName: "Master Data 2", link: "/master-data2" },
                        ]}
                        
                    />
                </nav>
            </div>

            {/* sidebar */}
            <Drawer anchor="left" open={isClicked} onClose={() => setIsClicked(false)} className="z-50 xl:hidden" >
                <Sidebar />
            </Drawer>
        </>
    )
}

export default Navbar