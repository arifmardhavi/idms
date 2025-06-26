import { IconArrowRight } from "@tabler/icons-react"
import { IconArrowLeft } from "@tabler/icons-react"
import Header from "../components/Header"
import { useState } from "react"
import { Breadcrumbs, Typography } from "@mui/material"
import { IconChevronRight } from "@tabler/icons-react"
import { Link } from "react-router-dom"


const Features = () => {
  const [hide, setHide] = useState(false)

  return (
    <div className='flex flex-col md:flex-row w-full'>
        { !hide && <Header />}
        <div className={`flex flex-col ${hide ? '' : 'md:pl-64'} w-full px-2 py-4 space-y-3`}>
            <div className='md:flex hidden'>
                <div className={`${hide ? 'hidden' : 'block'} w-fit bg-emerald-950 text-lime-300 p-2 cursor-pointer rounded-md`} onClick={() => setHide(true)}>
                    <IconArrowLeft />
                </div>
            </div>
            <div className={` ${hide ? 'block' : 'hidden'}  w-fit bg-emerald-950 text-lime-300 p-2 cursor-pointer rounded-md`} onClick={() => setHide(false)}>
                <IconArrowRight />
            </div>
            <div className='w-full bg-white shadow-sm px-2 py-4 rounded-lg space-y-2'>
                <Breadcrumbs
                    aria-label='breadcrumb'
                    separator={
                    <IconChevronRight className='text-emerald-950' stroke={2} />
                    }
                >
                    <Link className='hover:underline text-emerald-950' to='/'>
                        Home
                    </Link>
                    <Link className='hover:underline text-emerald-950' to='/user'>
                        Users
                    </Link>
                    <Typography className='text-lime-500'>Features</Typography>
                </Breadcrumbs>
            </div>
        </div>
    </div>
  )
}

export default Features
