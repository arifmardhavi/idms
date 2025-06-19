import { Breadcrumbs, Typography } from "@mui/material"
import Header from "../Header"
import { IconChevronRight } from "@tabler/icons-react"
import { Link } from "react-router-dom"
import { IconContract, IconLoader2 } from "@tabler/icons-react"
import { IconAlignBoxLeftMiddle } from "@tabler/icons-react"
import { IconAlignBoxBottomCenter } from "@tabler/icons-react"
import { IconAlertTriangle } from "@tabler/icons-react"
import { pieArcLabelClasses, PieChart } from "@mui/x-charts"
import {getMonitoringContract} from "../../services/contract.service.js"
import { useEffect, useState } from "react"
import { IconArrowLeft } from "@tabler/icons-react"
import { IconArrowRight } from "@tabler/icons-react"

const MonitoringContract = () => {

  const [monitoringContract, setMonitoringContract] = useState([])
  const [durasi_mpp, setDurasiMpp] = useState([])
  const [progress_pekerjaan, setProgressPekerjaan] = useState([])
  const [loading, setLoading] = useState(true)
  const [hide, setHide] = useState(false)

  useEffect(() => {
    fetchMonitoringContract()
  }, [])

  const fetchMonitoringContract = async () => {
    try {
      setLoading(true)
      const response = await getMonitoringContract()
      setMonitoringContract(response.data)
      setDurasiMpp(response.data.monitoring_durasi_mpp)
      setProgressPekerjaan(response.data.monitoring_progress_pekerjaan)
      // console.log("Monitoring Contract Data:", response.data.monitoring_durasi_mpp.blue)
    } catch (error) {
      console.error("Error fetching monitoring contract data:", error)
      setLoading(false)
    } finally {
      setLoading(false)
    }
  }

  // const monitoring_durasi = [
  //   {
  //     label: 'Windows',
  //     value: 72.72,
  //   },
  //   {
  //     label: 'OS X',
  //     value: 16.38,
  //   },
  //   {
  //     label: 'Linux',
  //     value: 3.83,
  //   },
  //   {
  //     label: 'Chrome OS',
  //     value: 2.42,
  //   },
  //   {
  //     label: 'Other',
  //     value: 4.65,
  //   },
  // ];
  // const monitoring_progress_pekerjaan = [
  //   {
  //     label: 'Windows',
  //     value: 72.72,
  //   },
  //   {
  //     label: 'OS X',
  //     value: 16.38,
  //   },
  //   {
  //     label: 'Linux',
  //     value: 3.83,
  //   },
  //   {
  //     label: 'Chrome OS',
  //     value: 2.42,
  //   },
  //   {
  //     label: 'Other',
  //     value: 4.65,
  //   },
  // ];

const monitoring_durasi = [
  {
    label: 'Kontrak Selesai',
    value: durasi_mpp.blue ?? 0,
    color: '#51a2ff',
  },
  {
    label: 'Durasi >= 4 Minggu',
    value: durasi_mpp.green ?? 0,
    color: '#00c950',
  },
  {
    label: 'Durasi < 4 Minggu',
    value: durasi_mpp.yellow ?? 0,
    color: '#ffdf20',
  },
  {
    label: 'Durasi <= 0',
    value: durasi_mpp.red ?? 0,
    color: '#ff6467',
  },
];
const monitoring_progress_pekerjaan = [
  {
    label: 'Kontrak Selesai',
    value: progress_pekerjaan.blue ?? 0,
    color: '#51a2ff',
  },
  {
    label: 'Deviasi Aktual & Plan 0%',
    value: progress_pekerjaan.green ?? 0,
    color: '#00c950',
  },
  {
    label: 'Deviasi Aktual & Plan <= 20%',
    value: progress_pekerjaan.yellow ?? 0,
    color: '#ffdf20',
  },
  {
    label: 'Deviasi Aktual & Plan > 20%',
    value: progress_pekerjaan.red ?? 0,
    color: '#ff6467',
  },
  // {
  //   label: 'Belum Upload Dokumen Amandemen',
  //   value: progress_pekerjaan.black ?? 0,
  //   color: '#002c22',
  // },
];

const sizingmonitoring = {
    // margin: {left: 90},
    legend: {
      direction: 'column',
      position: { vertical: 'middle', horizontal: 'right' },
      padding: 0,
      labelStyle: {
        fontSize: 12,
      },
    },
  };

const valueFormatter = (item) => `${item.value}`;


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
            {loading ? (
            <div className="flex flex-col items-center justify-center h-20">
                <IconLoader2 stroke={2} className="animate-spin rounded-full h-10 w-10 " />
            </div>
            ) : (
              <>
                <div className='w-full flex flex-col lg:flex-row justify-between items-center space-y-2 lg:space-y-0 lg:space-x-4'>
                  <div className="w-full flex flex-row bg-white shadow-md rounded-lg p-4 items-center">
                    <div className="flex items-center justify-center w-14 h-14 bg-lime-100 rounded-full mr-4">
                      <IconContract  className="text-emerald-950" size={30} />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-emerald-950 text-2xl">{monitoringContract.total_contract}</span>
                      <span className="text-stone-400 text-sm">Contract</span>
                    </div>
                  </div>
                  <div className="w-full flex flex-row bg-white shadow-md rounded-lg p-4 items-center">
                    <div className="flex items-center justify-center w-14 h-14 bg-lime-100 rounded-full mr-4">
                      <IconAlignBoxBottomCenter  className="text-emerald-950" size={30} />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-emerald-950 text-2xl">{monitoringContract.total_unit_price_contract}</span>
                      <span className="text-stone-400 text-sm">Unit Price</span>
                    </div>
                  </div>
                  <div className="w-full flex flex-row bg-white shadow-md rounded-lg p-4 items-center">
                    <div className="flex items-center justify-center w-14 h-14 bg-lime-100 rounded-full mr-4">
                      <IconAlignBoxLeftMiddle  className="text-emerald-950" size={30} />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-emerald-950 text-2xl">{monitoringContract.total_lumpsum_contract}</span>
                      <span className="text-stone-400 text-sm">Lumpsum</span>
                    </div>
                  </div>
                  <div className="w-full flex flex-row bg-white shadow-md rounded-lg p-4 items-center">
                    <div className="flex items-center justify-center w-14 h-14 bg-lime-100 rounded-full mr-4">
                      <IconAlertTriangle  className="text-emerald-950" size={30} />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-emerald-950 text-2xl">{monitoringContract.total_active_contract}</span>
                      <span className="text-stone-400 text-sm">Contract Active</span>
                    </div>
                  </div>
                </div>
                <div className='w-full flex flex-col lg:flex-row justify-between items-center space-y-2 lg:space-y-0 lg:space-x-4'>
                  <div className="w-full flex flex-col bg-white shadow-md rounded-lg p-4 items-center"> 
                    <h1>Durasi MPP</h1>
                    <div className="w-full">
                      <PieChart className=""
                        series={[
                          {
                            data: monitoring_durasi,
                            outerRadius: 90,
                            highlightScope: { fade: 'global', highlight: 'item' },
                            faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
                            valueFormatter,
                          },  
                        ]}
                        sx={{
                          [`& .${pieArcLabelClasses.root}`]: {
                            // fill: 'white',
                            fontSize: 14,
                          },
                        }}
                        width={400}
                        height={200}
                        {...sizingmonitoring}
                      />
                    </div>
                  </div>
                  <div className="w-full flex flex-col bg-white shadow-md rounded-lg p-4 items-center"> 
                    <h1>Porgress Pekerjaan</h1>
                    <div className="w-full">
                      <PieChart className=""
                        series={[
                          {
                            data: monitoring_progress_pekerjaan,
                            outerRadius: 90,
                            highlightScope: { fade: 'global', highlight: 'item' },
                            faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
                            valueFormatter,
                          },  
                        ]}
                        sx={{
                          [`& .${pieArcLabelClasses.root}`]: {
                            // fill: 'white',
                            fontSize: 14,
                          },
                        }}
                        width={500}
                        height={200}
                        {...sizingmonitoring}
                      />
                    </div>
                  </div>
                </div>
              </>
            )}
        </div>
    </div>
  )
}

export default MonitoringContract