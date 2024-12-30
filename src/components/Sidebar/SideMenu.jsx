import { Collapse, List } from "@mui/material"
import { useState } from "react";
import { Link } from "react-router";

const SideMenu = ({title, icon:Icon, Items}) => {
    const [SidebarOpen, setSidebarOpen] = useState({});

    const handleClick = (key) => {
        setSidebarOpen((prevState) => ({
            ...prevState,
            [key]: !prevState[key], // Toggle status dropdown berdasarkan key
        }));
    };
    return (
        <List className="w-full dark:text-white" component="nav" aria-labelledby="nested-list-subheader">
            <div className="flex flex-row px-4 py-3 rounded-md w-full items-center gap-2 text-xs text-left cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-800 dark:text-white transition duration-300" onClick={() => handleClick(title)}>
                <Icon />
                <span>{title}</span>
            </div>
            <Collapse in={SidebarOpen[title]} timeout="auto" unmountOnExit>
                <ul className={`flex-col gap-2 bg-slate-100 dark:bg-slate-950 rounded-md`}>
                    {Items.map((item, index) => (
                        <Link to={item.link} key={index} className="flex flex-row px-4 py-2 rounded-md w-full items-center gap-2 text-xs text-left cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-800 dark:text-white transition duration-300" >
                            {item.menuName}
                        </Link>
                    ))}
                </ul>
            </Collapse>
        </List>
    )
}

export default SideMenu