import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import SideMenu from "./SideMenu";
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

const Sidebar = () => {
    const isDarkMode = useSelector((state) => state.theme.isDarkMode);
    
    return (
        <aside className="fixed inset-0 bg-white dark:bg-slate-900 w-52 md:w-72 z-20 shadow-lg transition-all duration-300 ">
            <Link to={'/'} className="flex justify-center px-2 py-2">
                <div className="flex flex-row items-center gap-2">
                  {
                    isDarkMode ? 
                      <img className="w-20 border-r-2 border-slate-600" src="/images/kpi-putih.png" alt="Pertamina Logo" />
                    : 
                      <img className="w-20 border-r-2 border-slate-600" src="/images/kpi.png" alt="Pertamina Logo" />
                  }
                  <h1 className="text-xl font-bold text-black dark:text-white">IDMS</h1>
                </div>
            </Link>
            <div className="flex flex-col items-start px-2 py-4 max-h-[calc(100vh-100px)] overflow-y-scroll dark:text-white" >
                <SideMenu 
                    title="Internal Maintenance"
                    icon={IconBuildingWarehouse}
                    Items={[
                        { menuName: "Master Data 1", link: "/master-data1" },
                        { menuName: "Master Data 2", link: "/master-data2" },
                    ]}
                    
                />
                <SideMenu 
                    title="Goverment Compliance"
                    icon={IconClipboardList}
                    Items={[
                        { menuName: "Master Data 1", link: "/master-data1" },
                        { menuName: "Master Data 2", link: "/master-data2" },
                    ]}
                    
                />
                <SideMenu 
                    title="Piping Inspection"
                    icon={IconCylinder}
                    Items={[
                        { menuName: "Master Data 1", link: "/master-data1" },
                        { menuName: "Master Data 2", link: "/master-data2" },
                    ]}
                />
                <SideMenu 
                    title="PV Inspection"
                    icon={IconCylinder}
                    Items={[
                        { menuName: "Master Data 1", link: "/master-data1" },
                        { menuName: "Master Data 2", link: "/master-data2" },
                    ]}
                />
                <SideMenu 
                    title="Tank Inspection"
                    icon={IconScubaDivingTank}
                    Items={[
                        { menuName: "Master Data 1", link: "/master-data1" },
                        { menuName: "Master Data 2", link: "/master-data2" },
                    ]}
                    
                />
                <SideMenu 
                    title="PSV Inspection"
                    icon={IconRowRemove}
                    Items={[
                        { menuName: "Master Data 1", link: "/master-data1" },
                        { menuName: "Master Data 2", link: "/master-data2" },
                    ]}
                    
                />
                <SideMenu 
                    title="Inspection Report"
                    icon={IconFileReport}
                    Items={[
                        { menuName: "Master Data 1", link: "/master-data1" },
                        { menuName: "Master Data 2", link: "/master-data2" },
                    ]}
                    
                />
                <SideMenu 
                    title="Corrosion Management"
                    icon={IconBrowserCheck}
                    Items={[
                        { menuName: "Master Data 1", link: "/master-data1" },
                        { menuName: "Master Data 2", link: "/master-data2" },
                    ]}
                    
                />
                <SideMenu 
                    title="P-Office Archive"
                    icon={IconArchive}
                    Items={[
                        { menuName: "Master Data 1", link: "/master-data1" },
                        { menuName: "Master Data 2", link: "/master-data2" },
                    ]}
                    
                />
                <SideMenu 
                    title="Engineering Databook"
                    icon={IconBook}
                    Items={[
                        { menuName: "Master Data 1", link: "/master-data1" },
                        { menuName: "Master Data 2", link: "/master-data2" },
                    ]}
                    
                />
                <SideMenu 
                    title="Master Data"
                    icon={IconDatabase}
                    Items={[
                        { menuName: "Master Data 1", link: "/master-data1" },
                        { menuName: "Master Data 2", link: "/master-data2" },
                    ]}
                    
                />
            </div>
        </aside>
    )
}

export default Sidebar