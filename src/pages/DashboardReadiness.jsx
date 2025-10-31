import { IconArticle, IconChevronRight, IconLoader2, IconRefresh } from "@tabler/icons-react"
import Header from "../components/Header"
import { useState } from "react"
import { pieArcLabelClasses, PieChart } from "@mui/x-charts"
import { useEffect } from "react"
import { Link, useParams } from "react-router-dom"
import { getDashboardReadinessMaterialByEvent } from "../services/readiness_material.service"
import { getDashboardReadinessJasaByEvent } from "../services/readiness_jasa.service"
import { Breadcrumbs, Typography } from "@mui/material"
import { getEventReadinessById } from "../services/event_readiness.service"

const DashboardReadiness = () => {
  const [hide, setHide] = useState(false)
  const {id} = useParams()
  const [loading, setLoading] = useState(false)
  const [readinessMaterial, setReadinessMaterial] = useState([])
  const [readinessJasa, setReadinessJasa] = useState([])
  const [event_readiness, setEventReadiness] = useState([])

  useEffect(() => {
    fetchEventReadiness()
    fetchReadinessMaterial()
    fetchReadinessJasa()
  }, [id])

  const refreshDashboardPage = () => {
    fetchEventReadiness()
    fetchReadinessMaterial()
    fetchReadinessJasa()
  }

  const fetchEventReadiness = async () => {
    setLoading(true);
    try {
      const data = await getEventReadinessById(id);
      setEventReadiness(data.data);
    } catch (error) {
      console.error("Error fetching Event Readiness:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchReadinessMaterial = async () => {
    setLoading(true);
    try {
      const data = await getDashboardReadinessMaterialByEvent(id);
      setReadinessMaterial(data.data);
      console.log(data.data);
    } catch (error) {
      console.error("Error fetching Readiness Material:", error);
    } finally {
      setLoading(false);
    }
  }

  const fetchReadinessJasa = async () => {
    setLoading(true);
    try {
      const data = await getDashboardReadinessJasaByEvent(id);
      setReadinessJasa(data.data);
      console.log(data.data);
    } catch (error) {
      console.error("Error fetching Readiness Jasa:", error);
    } finally {
      setLoading(false);
    }
  }

  // Hitung total semua step
  const totalSteps = Object.values(readinessMaterial.steps || {}).reduce(
    (sum, val) => sum + (val || 0),
    0
  );

  // Pastikan tidak ada pembagian 0
  const toPercent = (value) =>
    totalSteps > 0 ? ((value / totalSteps) * 100).toFixed(1) : 0;

  const dataReadinessMaterial = [
    {
      label: `Rekomendasi (${readinessMaterial.steps?.rekomendasi_material || 0})`,
      value: parseFloat(toPercent(readinessMaterial.steps?.rekomendasi_material || 0)),
      color: "#003f5c",
    },
    {
      label: `Notif (${readinessMaterial.steps?.notif_material || 0})`,
      value: parseFloat(toPercent(readinessMaterial.steps?.notif_material || 0)),
      color: "#2f4b7c",
    },
    {
      label: `Job Plan (${readinessMaterial.steps?.job_plan_material || 0})`,
      value: parseFloat(toPercent(readinessMaterial.steps?.job_plan_material || 0)),
      color: "#665191",
    },
    {
      label: `PR (${readinessMaterial.steps?.pr_material || 0})`,
      value: parseFloat(toPercent(readinessMaterial.steps?.pr_material || 0)),
      color: "#a05195",
    },
    {
      label: `Tender (${readinessMaterial.steps?.tender_material || 0})`,
      value: parseFloat(toPercent(readinessMaterial.steps?.tender_material || 0)),
      color: "#d45087",
    },
    {
      label: `PO (${readinessMaterial.steps?.po_material || 0})`,
      value: parseFloat(toPercent(readinessMaterial.steps?.po_material || 0)),
      color: "#f95d6a",
    },
    {
      label: `Fabrikasi (${readinessMaterial.steps?.fabrikasi_material || 0})`,
      value: parseFloat(toPercent(readinessMaterial.steps?.fabrikasi_material || 0)),
      color: "#ff7c43",
    },
    {
      label: `Delivery (${readinessMaterial.steps?.delivery_material || 0})`,
      value: parseFloat(toPercent(readinessMaterial.steps?.delivery_material || 0)),
      color: "#ffa600",
    },
  ];


  

  const sizingReadinessMaterial = {
    margin: {left: 0, top: 0, right: 150, bottom: 0},
    legend: {
      direction: 'column',
      position: { vertical: 'middle', horizontal: 'right' },
      padding: 0,
      labelStyle: {
        fontSize: 12,
      },
    },
  };

  // Hitung total semua step Jasa
  const totalStepsJasa = Object.values(readinessJasa.steps || {}).reduce(
    (sum, val) => sum + (val || 0),
    0
  );

  // Helper untuk konversi ke persen (aman kalau total 0)
  const toPercentJasa = (value) =>
    totalStepsJasa > 0 ? ((value / totalStepsJasa) * 100).toFixed(1) : 0;

  // Data Pie Chart Jasa
  const dataReadinessJasa = [
    {
      label: `Rekomendasi (${readinessJasa.steps?.rekomendasi_jasa || 0})`,
      value: parseFloat(toPercentJasa(readinessJasa.steps?.rekomendasi_jasa || 0)),
      color: "#003f5c",
    },
    {
      label: `Notif (${readinessJasa.steps?.notif_jasa || 0})`,
      value: parseFloat(toPercentJasa(readinessJasa.steps?.notif_jasa || 0)),
      color: "#444e86",
    },
    {
      label: `Job Plan (${readinessJasa.steps?.job_plan_jasa || 0})`,
      value: parseFloat(toPercentJasa(readinessJasa.steps?.job_plan_jasa || 0)),
      color: "#955196",
    },
    {
      label: `PR (${readinessJasa.steps?.pr_jasa || 0})`,
      value: parseFloat(toPercentJasa(readinessJasa.steps?.pr_jasa || 0)),
      color: "#dd5182",
    },
    {
      label: `Tender (${readinessJasa.steps?.tender_jasa || 0})`,
      value: parseFloat(toPercentJasa(readinessJasa.steps?.tender_jasa || 0)),
      color: "#ff6e54",
    },
    {
      label: `Contract (${readinessJasa.steps?.contract_jasa || 0})`,
      value: parseFloat(toPercentJasa(readinessJasa.steps?.contract_jasa || 0)),
      color: "#ffa600",
    },
  ];

  

  const sizingReadinessJasa = {
    margin: {left: 0, top: 0, right: 150, bottom: 0},
    legend: {
      direction: 'column',
      position: { vertical: 'middle', horizontal: 'right' },
      padding: 0,
      labelStyle: {
        fontSize: 12,
      },
    },
  };

  // Gabungkan total progress Material dan Jasa
  const progressMaterial = parseFloat((readinessMaterial?.average_total_progress || "0").replace('%', ''));
  const progressJasa = parseFloat((readinessJasa?.average_total_progress || "0").replace('%', ''));

  // Hitung rata-rata gabungan (kalau dua-duanya ada)
  const validProgress = [progressMaterial, progressJasa].filter(p => !isNaN(p) && p > 0);
  const totalAverageProgress = validProgress.length > 0
    ? (validProgress.reduce((a, b) => a + b, 0) / validProgress.length).toFixed(2) + '%'
    : '0.00%';



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
              <Link className='hover:underline text-emerald-950 text-xs md:text-lg' to='/readiness_ta_plantstop'>
              Event
              </Link>
              <Typography className='text-lime-500 text-xs md:text-lg flex items-center space-x-2'>
                Dashboard 
                { loading ? 
                    <IconLoader2 stroke={2} className="animate-spin rounded-full h-4 w-4 " />
                : event_readiness.event_name ?? 'Readiness TA / Plant Stop'
                }
              </Typography>
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
                  {loading ? <><IconLoader2 stroke={2} className="animate-spin rounded-full h-6 w-6 " /></> : <h1 className='font-bold text-2xl'>{readinessMaterial?.total_data ?? '0'}</h1>}
                  <p className='text-gray-500'>Material</p>
              </div>
              <div className="w-full flex flex-col justify-center items-center bg-white shadow-sm px-2 py-4 rounded-lg">
                  {loading ? <><IconLoader2 stroke={2} className="animate-spin rounded-full h-6 w-6 " /></> : <h1 className='font-bold text-2xl'>{readinessJasa?.total_data ?? '0'}</h1>}
                  <p className='text-gray-500'>Jasa</p>
              </div>
              <div className="w-full flex flex-col justify-center items-center bg-white shadow-sm px-2 py-4 rounded-lg">
                  {loading ? <><IconLoader2 stroke={2} className="animate-spin rounded-full h-6 w-6 " /></> : <h1 className='font-bold text-2xl'>{readinessMaterial?.types?.lldi ?? '0'}</h1>}
                  <p className='text-gray-500'>LLDI Material</p>
              </div>
              <div className="w-full flex flex-col justify-center items-center bg-white shadow-sm px-2 py-4 rounded-lg">
                  {loading ? <><IconLoader2 stroke={2} className="animate-spin rounded-full h-6 w-6 " /></> : <h1 className='font-bold text-2xl'>{readinessMaterial?.types?.non_lldi ?? '0'}</h1>}
                  <p className='text-gray-500'>Non LLDI Material</p>
              </div>
          </div>
          <div className='w-full bg-white shadow-sm px-2 py-4 rounded-lg space-y-2'>
            {loading ? 
              <div className="flex flex-col items-center justify-center h-20">
                  <IconLoader2 stroke={2} className="animate-spin rounded-full h-10 w-10 " />
              </div>
            : 
              <>
                <div className='flex flex-row justify-between'>
                  <div className="flex flex-col items-center w-full p-2">
                    <h2 className='font-bold text-lg'>Material</h2>
                    <PieChart
                      series={[
                        {
                          outerRadius: 70,
                          data: dataReadinessMaterial,
                          arcLabel: (params) => `${params.value}%`, // tampilkan persen di chart
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
                      width={300}
                      {...sizingReadinessMaterial}
                    />
                    {/* <h2>Progress : {readinessMaterial?.average_total_progress ?? '0%'}</h2> */}
                  </div>
                  <div className="flex flex-col items-center w-full p-2">
                    <h2 className='font-bold text-lg'>Jasa</h2>
                    <PieChart
                      series={[
                        {
                          outerRadius: 70,
                          data: dataReadinessJasa,
                          arcLabel: (params) => `${params.value}%`, // tampilkan persen di chart
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
                      width={300}
                      {...sizingReadinessJasa}
                    />
                    {/* <h2>Progress : {readinessJasa?.average_total_progress ?? '0%'}</h2> */}
                  </div>
                </div>
                <div className="w-full flex flex-col justify-center items-center text-xl font-bold">
                  <h1 className='font-bold text-3xl'>{totalAverageProgress}</h1>
                  <h1>TOTAL PROGRESS</h1>
                </div>
              </>
            }
          </div>
      </div>
    </div>
  )
}

export default DashboardReadiness