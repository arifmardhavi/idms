import { Link } from "react-router-dom";
import Header from "../Header";
import { useState } from "react";
import { IconChevronRight, IconColumnInsertLeft, IconColumnRemove } from "@tabler/icons-react";
import { Breadcrumbs, Typography } from "@mui/material";
import InternalInspection from "./InternalInspection";

const DetailLaporan = () => {
  const [hide, setHide] = useState(false)
  return (
    <div className='flex flex-col md:flex-row w-full'>
      { !hide && <Header />}
      <div className={`flex flex-col ${hide ? '' : 'md:pl-64'} w-full px-2 py-4 space-y-3`}>
        <div className='md:flex hidden'>
          <div className={`${hide ? 'hidden' : 'block'} w-fit bg-emerald-950 text-lime-300 p-2 cursor-pointer rounded-md`} onClick={() => setHide(true)}>
            <IconColumnRemove />
          </div>
        </div>
        <div className={` ${hide ? 'block' : 'hidden'}  w-fit bg-emerald-950 text-lime-300 p-2 cursor-pointer rounded-md`} onClick={() => setHide(false)}>
          <IconColumnInsertLeft />
        </div>
        <Breadcrumbs
            aria-label='breadcrumb'
            className="uppercase"
            separator={
            <IconChevronRight className='text-emerald-950' stroke={2} />
            }
        >
            <Link className='hover:underline text-emerald-950' to='/laporan_inspection'>
            Laporan Inspection
            </Link>
            <Typography className='text-lime-500'>Details</Typography>
        </Breadcrumbs>
        <div className='flex flex-col space-y-4 bg-white p-2 rounded-xl shadow-md'>
          <InternalInspection />
        </div>
      </div>
    </div>
  )
}

export default DetailLaporan