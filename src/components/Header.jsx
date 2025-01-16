import { AnimatePresence } from "motion/react"
import * as motion from "motion/react-client"
import { Link } from "react-router-dom"
import { useState } from "react"

// icons
import { 
  IconHome, 
  IconBookUpload,
  IconBrandUnity,
  IconCategory,
  IconAlignBoxLeftMiddle,
  IconTag,
  IconStack2,
  IconRectangularPrism,
  IconArticle,


} from '@tabler/icons-react';
import { Icon } from "@mui/material";
import { IconX } from "@tabler/icons-react";
const Header = () => {

  const [open, setOpen] = useState(false)

  const SidesMenu = [
    {
      name: "Home",
      icon: <IconHome stroke={2} />,
      path: "/"
    },
    {
      name: "Unit",
      icon: <IconBrandUnity stroke={2} />,
      path: "/unit"
    },
    {
      name: "Category",
      icon: <IconCategory stroke={2} />,
      path: "/category"
    },
    {
      name: "Type",
      icon: <IconAlignBoxLeftMiddle stroke={2} />,
      path: "/type"
    },
    {
      name: "Tag Number",
      icon: <IconTag stroke={2} />,
      path: "/tagnumber"
    },
    {
      name: "PLO",
      icon: <IconStack2 stroke={2} />,
      path: "/plo"
    },
    {
      name: "COI",  
      icon: <IconRectangularPrism stroke={2} />,
      path: "/coi"
    }
]
  return (
    <>
      {/* dekstop */}
      <div className={`${open ? "block absolute" : "hidden md:flex flex-col"} fixed w-60 min-h-screen space-y-2 bg-emerald-950 text-white shadow-lg px-2 py-4 z-50`}>
        <div className="flex flex-row justify-center items-center space-x-2">
          <img className="w-24 xl:w-32 border-r-2 border-slate-300" src="/images/kpi-putih.png" alt="Logo Pertamina" />
          <span className="text-md xl:text-xl font-bold">IDMS</span>
        </div>
        <div className="flex flex-col space-y-2">
        {
          SidesMenu.map((menu, index) => (
            <AnimatePresence key={index}>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col space-y-2"
              >
                <motion.div
                  // whileHover={{ scale: 0.95 }}
                  whileTap={{ scale: 0.9 }}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className={` ${localStorage.getItem("active") === menu.name ? "text-lime-300 border-lime-300 border-l-4" : ""} hover:text-lime-300 hover:border-lime-300 hover:border-l-4 rounded-md`}	
                  transition={{
                    duration: 0.4,
                    scale: { type: "spring", visualDuration: index/10, bounce: 0.4 },
                  }}
                >
                  <Link
                    to={menu.path}
                    className="flex flex-row items-center space-x-3 cursor-pointer p-2"
                    onClick={() => localStorage.setItem("active", menu.name)}
                  >
                    {menu.icon}
                    <span className="text-white">{menu.name}</span>
                  </Link>
                </motion.div>
              </motion.div>
            </AnimatePresence>
          ))
        }

        </div>
      </div>

      {/* mobile */}
      <div className="md:hidden flex flex-row justify-between items-center px-2 text-white bg-emerald-950">
        <div className="flex flex-row justify-center items-center w-[calc(100%-3rem)] space-x-2">
          <img className="w-28 border-slate-300" src="/images/kpi-putih.png" alt="Logo Pertamina" />
          <span className="text-xl font-bold">IDMS</span>
        </div>
        <motion.div
          whileTap={{scale: 0.8}}
        >
          {open ?
          <IconX className={`cursor-pointer w-10 h-10 text-lime-300`} stroke={1} onClick={() => setOpen(false)} />
          :
          <IconArticle className={`cursor-pointer w-10 h-10 text-white`} stroke={1} onClick={() => setOpen(true)} />
          }
        </motion.div>
      </div>
    </>
  )
}

export default Header