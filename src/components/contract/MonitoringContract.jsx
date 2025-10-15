import { Breadcrumbs, Typography } from "@mui/material"
import Header from "../Header"
import { IconChevronRight, IconLoader2, IconRefresh } from "@tabler/icons-react"
import { Link } from "react-router-dom"
import {getMonitoringContract} from "../../services/contract.service.js"
import { useEffect, useState } from "react"
import { IconArrowLeft } from "@tabler/icons-react"
import { IconArrowRight } from "@tabler/icons-react"
import { pieArcLabelClasses, PieChart } from "@mui/x-charts"
import arcPercent from "../../utils/ArcPercent.js"

const MonitoringContract = () => {

  const [monitoringContract, setMonitoringContract] = useState([])
  const [loading, setLoading] = useState(true)
  const [hide, setHide] = useState(false)

  useEffect(() => {
    fetchMonitoringContract()
  }, [])

  const refreshDashboardPage = () => {
    fetchMonitoringContract()
  }

  const fetchMonitoringContract = async () => {
    try {
      setLoading(true)
      const response = await getMonitoringContract()
      setMonitoringContract(response.data)
    } catch (error) {
      console.error("Error fetching monitoring contract data:", error)
      setLoading(false)
    } finally {
      setLoading(false)
    }
  }
  

  

  const dataDurasiMppPoMaterial = [
    {
      label: `Durasi >= 4 Minggu (${monitoringContract.monitoring_durasi_mpp_po_material?.green ?? 0})`,
      value: parseFloat(monitoringContract.monitoring_durasi_mpp_po_material?.green ?? 0),
      color: "#003f5c",
    },
    {
      label: `Durasi < 4 Minggu (${monitoringContract.monitoring_durasi_mpp_po_material?.yellow ?? 0})`,
      value: parseFloat(monitoringContract.monitoring_durasi_mpp_po_material?.yellow ?? 0),
      color: "#ffa600",
    },
    {
      label: `Durasi <= 0 (${monitoringContract.monitoring_durasi_mpp_po_material?.red ?? 0})`,
      value: parseFloat(monitoringContract.monitoring_durasi_mpp_po_material?.red ?? 0),
      color: "#FB4141",
    },
  ];

  const sizingDurasiMppPoMaterial = {
    margin: {left: 0, top: 0, right: 160, bottom: 0},
    legend: {
      direction: 'column',
      position: { vertical: 'middle', horizontal: 'right' },
      padding: 0,
      labelStyle: {
        fontSize: 12,
      },
    },
  };

  const dataDurasiMppLumpsumUnitPrice = [
    {
      label: `Durasi >= 4 Minggu (${monitoringContract.monitoring_durasi_mpp_lumpsum_unit?.green ?? 0})`,
      value: parseFloat(monitoringContract.monitoring_durasi_mpp_lumpsum_unit?.green ?? 0),
      color: "#003f5c",
    },
    {
      label: `Durasi < 4 Minggu (${monitoringContract.monitoring_durasi_mpp_lumpsum_unit?.yellow ?? 0})`,
      value: parseFloat(monitoringContract.monitoring_durasi_mpp_lumpsum_unit?.yellow ?? 0),
      color: "#ffa600",
    },
    {
      label: `Durasi <= 0 (${monitoringContract.monitoring_durasi_mpp_lumpsum_unit?.red ?? 0})`,
      value: parseFloat(monitoringContract.monitoring_durasi_mpp_lumpsum_unit?.red ?? 0),
      color: "#FB4141",
    },
  ];

  const sizingDurasiMppLumpsumUnitPrice = {
    margin: {left: 0, top: 0, right: 160, bottom: 0},
    legend: {
      direction: 'column',
      position: { vertical: 'middle', horizontal: 'right' },
      padding: 0,
      labelStyle: {
        fontSize: 12,
      },
    },
  };

  const dataSisaNilaiLumpsumUnitPrice = [
    {
      label: `Durasi >= 4 Minggu (${monitoringContract.monitoring_sisa_nilai_lumpsum_unit?.green ?? 0})`,
      value: parseFloat(monitoringContract.monitoring_sisa_nilai_lumpsum_unit?.green ?? 0),
      color: "#003f5c",
    },
    {
      label: `Durasi < 4 Minggu (${monitoringContract.monitoring_sisa_nilai_lumpsum_unit?.yellow ?? 0})`,
      value: parseFloat(monitoringContract.monitoring_sisa_nilai_lumpsum_unit?.yellow ?? 0),
      color: "#ffa600",
    },
    {
      label: `Durasi <= 0 (${monitoringContract.monitoring_sisa_nilai_lumpsum_unit?.red ?? 0})`,
      value: parseFloat(monitoringContract.monitoring_sisa_nilai_lumpsum_unit?.red ?? 0),
      color: "#FB4141",
    },
  ];

  const sizingSisaNilaiLumpsumUnitPrice = {
    margin: {left: 0, top: 0, right: 160, bottom: 0},
    legend: {
      direction: 'column',
      position: { vertical: 'middle', horizontal: 'right' },
      padding: 0,
      labelStyle: {
        fontSize: 12,
      },
    },
  };

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
          <Breadcrumbs
              aria-label='breadcrumb'
              className="uppercase"
              separator={
              <IconChevronRight className='text-emerald-950' stroke={2} />
              }
          >
              <Link className='hover:underline text-emerald-950' to='/'>
              Home
              </Link>
              <Link className='hover:underline text-emerald-950' to='/contract'>
              Contract
              </Link>
              <Typography className='text-lime-500'>Monitoring Contract</Typography>
          </Breadcrumbs>
          <div className='w-full flex flex-col md:flex-row justify-end items-center'>
            <button
                className='flex space-x-1 items-center px-2 py-1 bg-emerald-950 text-lime-300 text-sm rounded hover:scale-110 transition duration-100'
                onClick={refreshDashboardPage}
            >
                <IconRefresh className='hover:rotate-180 transition duration-500' />
                <span>Refresh</span>
            </button>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-center space-y-2 md:space-x-2 md:space-y-0">
            <div className="w-full flex flex-col justify-center items-center bg-white shadow-sm px-2 py-4 rounded-lg">
                {loading ? <><IconLoader2 stroke={2} className="animate-spin rounded-full h-6 w-6 " /></> : <h1 className='font-bold text-2xl'>{monitoringContract?.total_contract ?? '0'}</h1>}
                <p className='text-gray-500'>Total Kontrak</p>
            </div>
            <div className="w-full flex flex-col justify-center items-center bg-white shadow-sm px-2 py-4 rounded-lg">
                {loading ? <><IconLoader2 stroke={2} className="animate-spin rounded-full h-6 w-6 " /></> : <h1 className='font-bold text-2xl'>{monitoringContract?.total_active_contract ?? '0'}</h1>}
                <p className='text-gray-500'>Total Kontrak Aktif</p>
            </div>
            <div className="w-full flex flex-col justify-center items-center bg-white shadow-sm px-2 py-4 rounded-lg">
                {loading ? <><IconLoader2 stroke={2} className="animate-spin rounded-full h-6 w-6 " /></> : <h1 className='font-bold text-2xl'>{monitoringContract?.total_selesai_contract ?? '0'}</h1>}
                <p className='text-gray-500'>Total Kontrak Selesai</p>
            </div>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-center space-y-2 md:space-x-2 md:space-y-0">
            <div className="w-full flex flex-col justify-center items-center bg-white shadow-sm px-2 py-4 rounded-lg">
                {loading ? <><IconLoader2 stroke={2} className="animate-spin rounded-full h-6 w-6 " /></> : <h1 className='font-bold text-2xl'>{monitoringContract?.active_lumpsum_contract ?? '0'}</h1>}
                <p className='text-gray-500'>Lumpsum Aktif</p>
            </div>
            <div className="w-full flex flex-col justify-center items-center bg-white shadow-sm px-2 py-4 rounded-lg">
                {loading ? <><IconLoader2 stroke={2} className="animate-spin rounded-full h-6 w-6 " /></> : <h1 className='font-bold text-2xl'>{monitoringContract?.active_unit_price_contract ?? '0'}</h1>}
                <p className='text-gray-500'>Unit Price Aktif</p>
            </div>
            <div className="w-full flex flex-col justify-center items-center bg-white shadow-sm px-2 py-4 rounded-lg">
                {loading ? <><IconLoader2 stroke={2} className="animate-spin rounded-full h-6 w-6 " /></> : <h1 className='font-bold text-2xl'>{monitoringContract?.active_po_material_contract ?? '0'}</h1>}
                <p className='text-gray-500'>PO Material Aktif</p>
            </div>
          </div>
          <div className='w-full bg-white shadow-sm px-2 py-4 rounded-lg space-y-2'>
            {loading ? 
              <div className="flex flex-col items-center justify-center h-20">
                  <IconLoader2 stroke={2} className="animate-spin rounded-full h-10 w-10 " />
              </div>
            : 
              <>
                <h1 className='font-bold text-2xl uppercase'>Lumpsum & Unit Price</h1>
                <p className='text-gray-500'>Grafik durasi MPP dan sisa nilai kontrak lumpsum dan unit price</p>
                <div className='flex flex-col md:flex-row md:justify-between'>
                  <div className="flex flex-col items-center w-full p-2">
                    <h2 className='font-bold text-lg'>Durasi MPP</h2>
                    <PieChart
                      series={[
                        {
                          outerRadius: 70,
                          data: dataDurasiMppLumpsumUnitPrice,
                          arcLabel: arcPercent(dataDurasiMppLumpsumUnitPrice),
                          highlightScope: { fade: "global", highlight: "item" },
                          faded: { innerRadius: 30, additionalRadius: -20, color: "gray" },
                          cornerRadius: 5,
                        },
                      ]}
                      sx={{
                        [`& .${pieArcLabelClasses.root}`]: {
                          fill: "white",
                          fontSize: 12,
                        },
                      }}
                      height={200}
                      width={350}
                      {...sizingDurasiMppLumpsumUnitPrice}
                    />
                  </div>
                  <div className="flex flex-col items-center w-full p-2">
                    <h2 className='font-bold text-lg'>Sisa Nilai</h2>
                    <PieChart
                      series={[
                        {
                          outerRadius: 70,
                          data: dataSisaNilaiLumpsumUnitPrice,
                          arcLabel: arcPercent(dataSisaNilaiLumpsumUnitPrice),
                          highlightScope: { fade: "global", highlight: "item" },
                          faded: { innerRadius: 30, additionalRadius: -20, color: "gray" },
                          cornerRadius: 5,
                        },
                      ]}
                      sx={{
                        [`& .${pieArcLabelClasses.root}`]: {
                          fill: "white",
                          fontSize: 12,
                        },
                      }}
                      height={200}
                      width={350}
                      {...sizingSisaNilaiLumpsumUnitPrice}
                    />
                  </div>
                </div>
              </>
            }
          </div>
          <div className='w-full bg-white shadow-sm px-2 py-4 rounded-lg space-y-2'>
            {loading ? 
              <div className="flex flex-col items-center justify-center h-20">
                  <IconLoader2 stroke={2} className="animate-spin rounded-full h-10 w-10 " />
              </div>
            : 
              <>
                <h1 className='font-bold text-2xl uppercase'>PO Material</h1>
                <p className='text-gray-500'>Grafik durasi MPP kontrak PO Material</p>
                <div className='flex flex-col md:flex-row md:justify-between'>
                  <div className="flex flex-col items-center w-full p-2">
                    <h2 className='font-bold text-lg'>Durasi MPP</h2>
                    <PieChart
                      series={[
                        {
                          outerRadius: 80,
                          data: dataDurasiMppPoMaterial,
                          arcLabel: arcPercent(dataDurasiMppPoMaterial),
                          highlightScope: { fade: "global", highlight: "item" },
                          faded: { innerRadius: 30, additionalRadius: -20, color: "gray" },
                          cornerRadius: 5,
                        },
                      ]}
                      sx={{
                        [`& .${pieArcLabelClasses.root}`]: {
                          fill: "white",
                          fontSize: 12,
                        },
                      }}
                      height={300}
                      width={350}
                      {...sizingDurasiMppPoMaterial}
                    />
                  </div>
                </div>
              </>
            }
          </div>
        </div>
    </div>
  )
}

export default MonitoringContract