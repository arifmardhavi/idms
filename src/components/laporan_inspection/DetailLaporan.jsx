import { Link, useParams } from "react-router-dom";
import Header from "../Header";
import { useState } from "react";
import { IconChevronRight, IconArticle } from "@tabler/icons-react";
import { Breadcrumbs, Typography } from "@mui/material";
import InternalInspection from "./InternalInspection";
import ExternalInspection from "./ExternalInspection";
import OnstreamInspection from "./OnstreamInspection";
import Surveillance from "./Surveillance";
import BreakdownReport from "./BreakdownReport";
import { getLaporanInspectionById } from "../../services/laporan_inspection.service";
import { useEffect } from "react";
import Preventive from "./Preventive";
import Overhaul from "./Overhaul";

const DetailLaporan = () => {
  const [hide, setHide] = useState(false)
  const [category, setCategory] = useState({})
  const { id } = useParams();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchDetail();
  },[])

  const fetchDetail = async () => {
    try {
      setLoading(true);
      const data = await getLaporanInspectionById(id);
      setCategory(data.data?.category);
      console.log(data.data);
    } catch (error) {
      console.error("Error fetching Preventive data:", error);
    } finally {
      setLoading(false);
    }
  }
  return (
    <div className='flex flex-col md:flex-row w-full'>
      { !hide && <Header />}
      <div className={`flex flex-col ${hide ? '' : 'md:pl-64'} w-full px-2 py-4 space-y-3`}>
        <div className='md:flex hidden'>
          <div className={`${hide ? 'hidden' : 'block'} w-fit bg-emerald-950 text-lime-300 p-2 cursor-pointer rounded-md`} onClick={() => setHide(true)}>
            <IconArticle />
          </div>
        </div>
        <div className={` ${hide ? 'block' : 'hidden'}  w-fit bg-emerald-950 text-lime-300 p-2 cursor-pointer rounded-md`} onClick={() => setHide(false)}>
          <IconArticle />
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
        { loading ? <p>Loading...</p> : 
        <div className="space-y-2">
          {category.id === 1 ? <div className='flex flex-col space-y-4 bg-white p-2 rounded-xl shadow-md'>
            <InternalInspection />
          </div>  : ""}
          {category.id === 1 ? <div className='flex flex-col space-y-4 bg-white p-2 rounded-xl shadow-md'>
            <ExternalInspection />
          </div>  : ""}
          {category.id === 1 ? <div className='flex flex-col space-y-4 bg-white p-2 rounded-xl shadow-md'>
            <OnstreamInspection />
          </div>  : ""}
          {category?.id !== 1 ? <div className='flex flex-col space-y-4 bg-white p-2 rounded-xl shadow-md'>
            <Preventive />
          </div>  : ""}
          {category?.id !== 1 ? <div className='flex flex-col space-y-4 bg-white p-2 rounded-xl shadow-md'>
            <Overhaul />
          </div>  : ""}
          <div className='flex flex-col space-y-4 bg-white p-2 rounded-xl shadow-md'>
            <BreakdownReport />
          </div>
          <div className='flex flex-col space-y-4 bg-white p-2 rounded-xl shadow-md'>
            <Surveillance />
          </div>
        </div>
        }
      </div>
    </div>
  )
}

export default DetailLaporan