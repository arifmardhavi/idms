import { 
    IconBuildingWarehouse,
    IconCylinder,
    IconClipboardList,
    IconScubaDivingTank,
    IconRowRemove,
    IconFileReport,
    IconBrowserCheck,
    IconArchive,
    IconBook,
    IconDatabase,
} from "@tabler/icons-react";
import { useState, useRef, useEffect } from "react";
import { Link } from "react-router";
const NavMenu = ({title, icon:Icon, Items}) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState({});
    const dropdownRef = useRef(null);
    const toggleDropdown = (key) => {
        setIsDropdownOpen((prevState) => ({
          ...prevState,
          [key]: !prevState[key], // Toggle status dropdown berdasarkan key
        }));
      };

      const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setIsDropdownOpen(false); // Tutup dropdown jika klik di luar
        }
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <>
            <div className="relative" ref={dropdownRef}>
                <div className="flex flex-col justify-center items-center gap-1 text-sm text-center px-4 py-1 cursor-pointer rounded-full hover:bg-slate-300 dark:hover:bg-slate-800 transition duration-300" onClick={() => toggleDropdown(title)}>
                    <Icon stroke={2} />
                    <small>{title}</small>
                </div>
                <ul className={`${isDropdownOpen[title] ? "block" : "hidden"} absolute bg-slate-200 w-40 p-1 dark:bg-slate-700 rounded-md`}>
                    {
                        Items.map((item, index) => (
                            <Link to={item.link} key={index} className="flex flex-row px-4 py-3 rounded-md w-full items-center gap-2 text-xs text-left cursor-pointer hover:bg-slate-300 dark:hover:bg-slate-800 dark:text-white transition duration-300" >
                                {item.menuName}
                            </Link>
                        ))
                    }
                </ul>
            </div>
        </>
    )
}

export default NavMenu