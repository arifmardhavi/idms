import Header from "../Header";
import { useEffect, useState } from 'react';
import {
  DataGrid,
  GridToolbarQuickFilter,
  GridLogicOperator,
} from '@mui/x-data-grid';
import { Breadcrumbs, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { IconCloudDownload, IconChevronRight, IconArticle } from '@tabler/icons-react';
import { PieChart, pieArcLabelClasses } from '@mui/x-charts/PieChart';
import { getIzinOperasi, izinOperasiCountDueDays } from "../../services/izin_operasi1.service";
import { api_public } from "../../services/config";
import { IconLoader2 } from "@tabler/icons-react";
import { handleAddActivity } from "../../utils/handleAddActivity";

const DashboardIzinOperasi = () => {

  const [izinOperasi, setIzinOperasi] = useState([]);
  const [countIzinOperasi, setCountIzinOperasi] = useState({});
  const [loading, setLoading] = useState(false);
  const [clickIzinOperasi, setClickIzinOperasi] = useState(null);
  const [clickRla, setclickRla] = useState(null);
  const [filteredIzinOperasi, setFilteredIzinOperasi] = useState([]);
  const [hide, setHide] = useState(false);
  
  const base_public_url = api_public;

  useEffect(() => {
    fetchIzinOperasi();
    fetchIzinOperasiCountDueDays();
  }, []);

  useEffect(() => {
      if (clickIzinOperasi) {
        setclickRla(null); // Reset clickRla when clickIzinOperasi changes
        const filtered = izinOperasi.filter((row) => {
          if (clickIzinOperasi === 'Expired') {
            return row.due_days <= 0;
          } else if (clickIzinOperasi === '< 9 Bulan') {
            return row.due_days < 272 && row.due_days > 0;
          } else if (clickIzinOperasi === '> 9 Bulan') {
            return row.due_days >= 272;
          } else {
            return true;
          }
        });
        setFilteredIzinOperasi(filtered);
        // console.log("click:-", clickIzinOperasi);
        // console.log("Filtered IzinOperasi Data:", filtered);
      }
    }, [clickIzinOperasi]);
  
    useEffect(() => {
      if (clickRla) {
        setClickIzinOperasi(null); // Reset clickIzinOperasi when clickRla changes
        const filtered = izinOperasi.filter((row) => {
          if (clickRla === 'Expired') {
            return row.rla_due_days <= 0 && row.rla_due_days !== null;
          } else if (clickRla === '< 9 Bulan') {
            return row.rla_due_days < 272 && row.rla_due_days > 0;
          } else if (clickRla === '> 9 Bulan') {
            return row.rla_due_days >= 272;
          } else {
            return true;
          }
        });
        setFilteredIzinOperasi(filtered);
        // console.log("click:-", clickRla);
        // console.log("Filtered RLA Data:", filtered);
      }
    }, [clickRla]);

  const fetchIzinOperasi = async () => {
    try {
      setLoading(true);
      const data = await getIzinOperasi();
      setIzinOperasi(data.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  const fetchIzinOperasiCountDueDays = async () => {
    try {
      setLoading(true);
      const data = await izinOperasiCountDueDays();
      setCountIzinOperasi(data.data);
    } catch (error) {
      console.error("Error fetching IzinOperasi:", error);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      field: 'unit',
      headerName: 'Unit',
      width: 130,
      valueGetter: (params) => params.unit_name,
      renderCell: (params) => (
        <div className='py-4'>{params.row.unit.unit_name}</div>
      ),
    },
    {
      field: 'no_certificate',
      headerName: 'Nomor Izin Operasi',
      width: 200,
      renderCell: (params) => (
        <div className='py-4'>
          <Link
            to={`${base_public_url}izin_operasi/certificates/${params.row.izin_operasi_certificate}`}
            target='_blank'
            className='text-lime-500 underline'
            onClick={() => handleAddActivity(params.row.izin_operasi_certificate, "IzinOperasi")}
          >
            {params.value}
          </Link>
        </div>
      ),
    },
    {
      field: 'issue_date',
      headerName: 'Issue Date',
      width: 150,
      renderCell: (params) => (
        <div className='py-4'>
          {new Intl.DateTimeFormat('id-ID', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
          }).format(new Date(params.value))}
        </div>
      ),
    },
    {
      field: 'overdue_date',
      headerName: 'Inspection Due Date',
      width: 150,
      renderCell: (params) => (
        <div className='py-4'>
          {new Intl.DateTimeFormat('id-ID', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
          }).format(new Date(params.value))}
        </div>
      ),
    },
    {
      field: 'due_days',
      headerName: 'Due Days',
      width: 80,
      renderCell: (params) => {
        const diffDays = params.value;

        return (
          <div className='py-2 pl-3'>
            <p
              className={`${
                diffDays <= 0
                ? 'text-white bg-red-600' // Expired
                : diffDays < 272
                ? 'bg-yellow-400 text-black' // Kurang dari 9 bulan
                : 'bg-emerald-950 text-white' // Lebih dari 9 bulan
              } rounded-full w-fit p-2`}
            >
              {diffDays}
            </p>
          </div>
        );
      },
    },
    {
      field: 'izin_operasi_certificate',
      headerName: 'Izin Operasi File',
      width: 100,
      renderCell: (params) => (
        <div className='py-4'>
          <Link
            to={`${base_public_url}izin_operasi/certificates/${params.row.izin_operasi_certificate}`}
            target='_blank'
            className='item-center text-lime-500'
            onClick={() => handleAddActivity(params.row.izin_operasi_certificate, "IzinOperasi")}
          >
            <IconCloudDownload stroke={2} />
          </Link>
        </div>
      ),
    },
    {
      field: 'izin_operasi_old_certificate',
      headerName: 'Izin Operasi Lama',
      width: 100,
      renderCell: (params) => (
        <div className='py-4 pl-4'>
          {params.value ? (
            <Link
              to={`${base_public_url}izin_operasi/certificates/${params.value}`}
              target='_blank'
              className=' text-lime-500'
              onClick={() => handleAddActivity(params.value, "IzinOperasi")}
            >
              <IconCloudDownload stroke={2} />
            </Link>
          ) : (
            <p>-</p>
          )}
        </div>
      ),
    },
    {
      field: 'rla',
      headerName: 'RLA',
      width: 70,
      valueGetter: (params) => (params == 1 ? 'YES' : 'NO'),
      renderCell: (params) => (
        <div className='py-4'>
          <span
            className={`${
              params.row.rla == 0
                ? 'text-lime-300 bg-emerald-950'
                : 'bg-lime-400 text-emerald-950'
            } rounded-lg w-fit px-2 py-1`}
          >
            {params.row.rla == 0 ? 'NO' : 'YES'}
          </span>
        </div>
      ),
    },
    {
      field: 'rla_issue',
      headerName: 'RLA Issue Date',
      width: 150,
      renderCell: (params) => (
        <div className='py-4'>
          {params.value
            ? new Intl.DateTimeFormat('id-ID', {
                day: '2-digit',
                month: 'long',
                year: 'numeric',
              }).format(new Date(params.value))
            : '-'}
        </div>
      ),
    },
    {
      field: 'rla_overdue',
      headerName: 'RLA Due Date',
      width: 150,
      renderCell: (params) => (
        <div className='py-4'>
          {params.value
            ? new Intl.DateTimeFormat('id-ID', {
                day: '2-digit',
                month: 'long',
                year: 'numeric',
              }).format(new Date(params.value))
            : '-'}
        </div>
      ),
    },
    {
      field: 'rla_due_days',
      headerName: 'RLA Due',
      width: 80,
      renderCell: (params) => {
        const diffDays = params.value;

        return (
          <div className='py-2 pl-3'>
            <p
              className={`${
                params.row.rla == 0
                ? 'text-emerald-950'
                : diffDays <= 0
                ? 'text-white bg-red-600' // Expired
                : diffDays < 272
                ? 'bg-yellow-400 text-black' // Kurang dari 6 bulan
                : 'bg-emerald-950 text-white' // Lebih dari 6 bulan
              } rounded-full w-fit p-2`}
            >
              {params.row.rla == 0 ? '-' : diffDays}
            </p>
          </div>
        );
      },
    },
    {
      field: 'rla_certificate',
      headerName: 'RLA file',
      width: 80,
      renderCell: (params) => (
        <div className='py-4 pl-4'>
          {params.value ? (
            <Link
              to={`${base_public_url}izin_operasi/rla/${params.value}`}
              target='_blank'
              className=' text-lime-500'
              onClick={() => handleAddActivity(params.value, "IzinOperasi")}
            >
              <IconCloudDownload stroke={2} />
            </Link>
          ) : (
            <p>-</p>
          )}
        </div>
      ),
    },
    {
      field: 'rla_old_certificate',
      headerName: 'RLA lama',
      width: 80,
      renderCell: (params) => (
        <div className='py-4 pl-4'>
          {params.value ? (
            <Link
              to={`${base_public_url}izin_operasi/rla/${params.value}`}
              target='_blank'
              className=' text-lime-500'
              onClick={() => handleAddActivity(params.value, "IzinOperasi")}
            >
              <IconCloudDownload stroke={2} />
            </Link>
          ) : (
            <p>-</p>
          )}
        </div>
      ),
    },
  ];

  const CustomQuickFilter = () => (
    <GridToolbarQuickFilter
      placeholder='cari data disini dan gunakan ; untuk filter lebih spesifik dengan 2 kata kunci'
      className='text-lime-300 px-4 py-4 border outline-none'
      quickFilterParser={(searchInput) =>
        searchInput
          .split(';')
          .map((value) => value.trim())
          .filter((value) => value !== '')
      }
    />
  );
  

  const dataPieIzinOperasi = [
    { label: "> 9 Bulan", value: countIzinOperasi.izin_operasi_more_than_9_months || 0, color: "#06d6a0" },
    { label: "< 9 Bulan", value: countIzinOperasi.izin_operasi_less_than_9_months || 0, color: "#ffd166" },
    { label: "Expired", value: countIzinOperasi.izin_operasi_expired || 0, color: "#ef476f" },
  ];

  const dataPieRla = [
    { label: "> 9 Bulan", value: countIzinOperasi.rla_more_than_9_months || 0, color: "#06d6a0" },
    { label: "< 9 Bulan", value: countIzinOperasi.rla_less_than_9_months || 0, color: "#ffd166" },
    { label: "Expired", value: countIzinOperasi.rla_expired || 0, color: "#ef476f" }, 
  ];


  
  const sizingIzinOperasi = {
    margin: {left: 90},
    legend: {
      direction: 'column',
      position: { vertical: 'middle', horizontal: 'right' },
      padding: 0,
      labelStyle: {
        fontSize: 12,
      },
    },
  };
  const sizingrla = {
    margin: {left: 90},
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
            <IconArticle />
          </div>
        </div>
        <div className={` ${hide ? 'block' : 'hidden'}  w-fit bg-emerald-950 text-lime-300 p-2 cursor-pointer rounded-md`} onClick={() => setHide(false)}>
          <IconArticle />
        </div>
        <Breadcrumbs
          aria-label='breadcrumb'
          separator={
            <IconChevronRight className='text-emerald-950' stroke={2} />
          }
        >
          <Link
            className='hover:underline text-emerald-950'
            to='/'
            onClick={() => localStorage.setItem('active', 'Home')}
          >
            Home
          </Link>
          <Link className='hover:underline text-emerald-950' to='/izin_operasi'>
            Izin Operasi
          </Link>
          <Typography className='text-lime-500'>Dashboard Izin Operasi</Typography>
        </Breadcrumbs>
        {/* PIE CHART */}
        <div className='w-full bg-white shadow-sm px-2 py-4 rounded-lg space-y-2'>
        {loading ? 
          <div className="flex flex-col items-center justify-center h-20">
              <IconLoader2 stroke={2} className="animate-spin rounded-full h-10 w-10 " />
          </div> 
        : (
          <div className='flex flex-col md:flex-row justify-evenly'>
            <div className="flex flex-col items-center">
              <span>Izin Operasi</span>
              <PieChart
                series={[
                  {
                    outerRadius: 90,
                    data: dataPieIzinOperasi, arcLabel: (params) => `${params.value}`,
                    highlightScope: { fade: 'global', highlight: 'item' },
                    faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
                  },
                ]}
                width={350}
                height={200}
                onItemClick={(event, d) => {
                  const clickedData = dataPieIzinOperasi[d.dataIndex];
                  setClickIzinOperasi(clickedData.label);
                }}
                sx={{
                  [`& .${pieArcLabelClasses.root}`]: {
                    fill: 'white',
                    fontSize: 14,
                  },
                }}
                {...sizingIzinOperasi}
              />
            </div>
            <div className="flex flex-col items-center text-center">
              <span>RLA Instalasi</span>
              <PieChart
                series={[
                  {
                    outerRadius: 90,
                    data: dataPieRla, arcLabel: (params) => `${params.value}`,
                    highlightScope: { fade: 'global', highlight: 'item' },
                    faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
                  },
                ]}
                sx={{
                  [`& .${pieArcLabelClasses.root}`]: {
                    fill: 'white',
                    fontSize: 14,
                  },
                }}
                width={350}
                height={200}
                onItemClick={(event, d) => {
                  const clickedData = dataPieRla[d.dataIndex];
                  setclickRla(clickedData.label);
                }}
                {...sizingrla}
              />
            </div>
          </div>
        )}
        </div>
        {/* TABLE IZIN OPERASI */}
        <div className='w-full bg-white shadow-sm px-2 py-4 rounded-lg space-y-2'>
          <div className='flex flex-row justify-between'>
          {loading ? <p>Loading...</p> : <div className="flex flex-col w-full">
            <div className='flex justify-end items-center mb-4'>
              <button className='px-2 py-2 flex justify-end bg-emerald-950 text-lime-400 text-sm rounded w-fit' onClick={() => {setFilteredIzinOperasi(izinOperasi); setClickIzinOperasi(null); setclickRla(null);}} >Reset Filter</button>
            </div>
          <DataGrid
              rows={filteredIzinOperasi.length > 0 ? filteredIzinOperasi : izinOperasi}
              columns={columns}
              // checkboxSelection
              disableColumnFilter
              disableColumnSelector
              disableDensitySelector
              pagination
              getRowHeight={() => 'auto'}
              slots={{ toolbar: CustomQuickFilter }}
              slotProps={{
                toolbar: {
                  showQuickFilter: true,
                  printOptions: { disableToolbarButton: true },
                  csvOptions: { disableToolbarButton: true },
                },
              }}
              initialState={{
                pagination: {
                  paginationModel: { pageSize: 10, page: 0 },
                },
                filter: {
                  filterModel: {
                    items: [],
                    quickFilterExcludeHiddenColumns: false,
                    quickFilterLogicOperator: GridLogicOperator.And,
                  },
                },
              }}
              pageSizeOptions={[10, 25, 50, { value: -1, label: 'All' }]}
              
            /> </div> }
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardIzinOperasi;
