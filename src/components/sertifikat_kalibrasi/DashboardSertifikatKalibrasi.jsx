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
import { getSertifikatKalibrasi, SertifikatKalibrasiCountDueDays } from "../../services/sertifikat_kalibrasi.service";
import { api_public } from "../../services/config";
import { IconLoader2 } from "@tabler/icons-react";
import { handleAddActivity } from "../../utils/handleAddActivity";


const DashboardSertifikatKalibrasi = () => {
  const [SertifikatKalibrasi, setSertifikatKalibrasi] = useState([]);
  const [countSertifikatKalibrasi, setCountSertifikatKalibrasi] = useState({});
  const [loading, setLoading] = useState(false);
  const [clickSertifikatKalibrasi, setclickSertifikatKalibrasi] = useState(null);
  const [filteredSertifikatKalibrasi, setFilteredSertifikatKalibrasi] = useState([]);
  const base_public_url = api_public;
  const [hide, setHide] = useState(false);

  useEffect(() => {
    fetchSertifikatKalibrasi();
    fetchSertifikatKalibrasiCountDueDays();

    SertifikatKalibrasiCountDueDays((data) => {
      localStorage.setItem("countSertifikatKalibrasi", JSON.stringify(data.data));
      setCountSertifikatKalibrasi(data.data || {});
    });
  }, []);

  useEffect(() => {
    if (clickSertifikatKalibrasi) {
      const filtered = SertifikatKalibrasi.filter((row) => {
        if (clickSertifikatKalibrasi === 'Expired') {
          return row.due_days <= 0;
        } else if (clickSertifikatKalibrasi === '< 6 Bulan') {
          return row.due_days < 180 && row.due_days > 0;
        } else if (clickSertifikatKalibrasi === '> 6 Bulan') {
          return row.due_days >= 180;
        } else {
          return true;
        }
      });
      setFilteredSertifikatKalibrasi(filtered);
      // console.log("click:-", clickSertifikatKalibrasi);
      // console.log("Filtered Sertifikat Kalibrasi Data:", filtered);
    }
  }, [clickSertifikatKalibrasi]);

  const fetchSertifikatKalibrasi = async () => {
    try {
      setLoading(true);
      const data = await getSertifikatKalibrasi();
      setSertifikatKalibrasi(data.data);
    } catch (error) {
      console.error("Error fetching Sertifikat Kalibrasi:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSertifikatKalibrasiCountDueDays = async () => {
      try {
        setLoading(true);
        const data = await SertifikatKalibrasiCountDueDays();
        setCountSertifikatKalibrasi(data.data);
      } catch (error) {
        console.error("Error fetching COI:", error);
      } finally {
        setLoading(false);
      }
    };

  const columns = [
    {
      field: 'tag_number',
      valueGetter: (params) => params.tag_number,
      headerName: 'Tag Number',
      width: 150,
      renderCell: (params) => <div className='py-4'>{params.value}</div>,
    },
    {
      field: 'plo',
      valueGetter: (params) => params.unit.unit_name,
      headerName: 'plo',
      width: 150,
      renderCell: (params) => <div className='py-4'>{params.value}</div>,
    },
    {
      field: 'no_sertifikat_kalibrasi',
      headerName: 'No Sertifikat Kalibrasi',
      width: 150,
      renderCell: (params) => (
        <div className='py-4'>
          <Link
            to={`${base_public_url}sertifikat_kalibrasi/${params.row.file_sertifikat_kalibrasi}`}
            target='_blank'
            className='text-lime-500 underline'
            onClick={() => handleAddActivity(params.row.file_sertifikat_kalibrasi, "Sertifikat Kalibrasi")}
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
      headerName: 'Overdue Date',
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
                : diffDays < 180
                ? 'bg-yellow-400 text-black' // Kurang dari 6 bulan
                : 'bg-emerald-950 text-white' // Lebih dari 6 bulan
              } rounded-full w-fit p-2`}
            >
              {diffDays}
            </p>
          </div>
        );
      },
    },
    {
      field: 'files_sertifikat_kalibrasi',
      headerName: 'File Sertifikat Kalibrasi',
      width: 100,
      renderCell: (params) => (
        <div className='py-4'>
          <Link
            to={`${base_public_url}sertifikat_kalibrasi/${params.row.file_sertifikat_kalibrasi}`}
            target='_blank'
            className='item-center text-lime-500'
            onClick={() => handleAddActivity(params.row.file_sertifikat_kalibrasi, "Sertifikat Kalibrasi")}
          >
            <IconCloudDownload stroke={2} />
          </Link>
        </div>
      ),
    },
    {
      field: 'files_old_sertifikat_kalibrasi',
      headerName: 'Sertifikat Kalibrasi LAMA',
      width: 100,
      renderCell: (params) => (
        <div className='py-4 pl-4'>
          {params.row.file_old_sertifikat_kalibrasi ? (
            <Link
              to={`${base_public_url}sertifikat_kalibrasi/${params.row.file_old_sertifikat_kalibrasi}`}
              target='_blank'
              className=' text-lime-500'
              onClick={() => handleAddActivity(params.row.file_old_sertifikat_kalibrasi, "Sertifikat Kalibrasi")}
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
      placeholder='Cari data disini...'
      className='text-lime-300 px-4 py-4 border outline-none'
      quickFilterParser={(searchInput) =>
        searchInput
          .split(',')
          .map((value) => value.trim())
          .filter((value) => value !== '')
      }
    />
  );
  

  const dataPieSertifikatKalibrasi = [
    { label: "> 6 Bulan", value: countSertifikatKalibrasi.sertifikat_kalibrasi_more_than_six_months || 0, color: "#06d6a0" },
    { label: "< 6 Bulan", value: countSertifikatKalibrasi.sertifikat_kalibrasi_less_than_six_months || 0, color: "#ffd166" },
    { label: "Expired", value: countSertifikatKalibrasi.sertifikat_kalibrasi_expired || 0, color: "#ef476f" },
  ];


  
  const sizingSertifikatKalibrasi = {
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
          <Link className='hover:underline text-emerald-950' to='/sertifikat_kalibrasi'>
            Sertifikat Kalibrasi
          </Link>
          <Typography className='text-lime-500'>Dashboard Sertifikat Kalibrasi</Typography>
        </Breadcrumbs>
        {/* PIE CHART */}
        <div className='w-full bg-white shadow-sm px-2 py-4 rounded-lg space-y-2'>
          <div className='flex flex-col md:flex-row justify-evenly'>
          {loading ? 
            <div className="flex flex-col items-center justify-center h-20">
                <IconLoader2 stroke={2} className="animate-spin rounded-full h-10 w-10 " />
            </div> 
          : ( <div className="flex flex-col items-center">
              <span>Sertifikat Kalibrasi</span>
              <PieChart
                series={[
                  {
                    outerRadius: 90,
                    data: dataPieSertifikatKalibrasi, arcLabel: (params) => `${params.value}`,
                    highlightScope: { fade: 'global', highlight: 'item' },
                    faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
                  },
                ]}
                width={350}
                height={200}
                onItemClick={(event, d) => {
                  const clickedData = dataPieSertifikatKalibrasi[d.dataIndex];
                  setclickSertifikatKalibrasi(clickedData.label);
                }}
                sx={{
                  [`& .${pieArcLabelClasses.root}`]: {
                    fill: 'white',
                    fontSize: 14,
                  },
                }}
                {...sizingSertifikatKalibrasi}
              />
            </div> )}
          </div>
        </div>
        {/* TABLE Sertifikat Kalibrasi */}
        <div className='w-full bg-white shadow-sm px-2 py-4 rounded-lg space-y-2'>
          <div className='flex flex-row justify-between'>
          {loading ? 
              <div className="flex flex-col items-center justify-center h-20">
                  <IconLoader2 stroke={2} className="animate-spin rounded-full h-10 w-10 " />
              </div> 
          : <div className="flex flex-col w-full">
            <div className='flex justify-end items-center mb-4'>
              <button className='px-2 py-2 flex justify-end bg-emerald-950 text-lime-400 text-sm rounded w-fit' onClick={() => {setFilteredSertifikatKalibrasi(SertifikatKalibrasi); setclickSertifikatKalibrasi(null);}} >Reset Filter</button>
            </div> 
          <DataGrid
              rows={filteredSertifikatKalibrasi.length > 0 ? filteredSertifikatKalibrasi : SertifikatKalibrasi}
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
              
            /> </div>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardSertifikatKalibrasi;
