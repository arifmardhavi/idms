import Header from "../Header";
import { useEffect, useState } from 'react';
import {
  DataGrid,
  GridToolbarQuickFilter,
  GridLogicOperator,
} from '@mui/x-data-grid';
import { Breadcrumbs, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { IconCloudDownload, IconChevronRight } from '@tabler/icons-react';
import { PieChart, pieArcLabelClasses } from '@mui/x-charts/PieChart';
import { getPlo, ploCountDueDays } from "../../services/plo.service";
import { api_public } from "../../services/config";
import { IconArrowRight } from "@tabler/icons-react";
import { IconArrowLeft } from "@tabler/icons-react";
import { IconLoader2 } from "@tabler/icons-react";

const DashboardPlo = () => {

  const [plo, setPlo] = useState([]);
  const [countplo, setCountPlo] = useState({});
  const [loading, setLoading] = useState(false);
  const [clickPlo, setclickPlo] = useState(null);
  const [clickRla, setclickRla] = useState(null);
  const [filteredPlo, setFilteredPlo] = useState([]);
  const [hide, setHide] = useState(false);
  
  const base_public_url = api_public;

  useEffect(() => {
    fetchPlo();
    fetchPloCountDueDays();
  }, []);

  useEffect(() => {
      if (clickPlo) {
        setclickRla(null); // Reset clickRla when clickPlo changes
        const filtered = plo.filter((row) => {
          if (clickPlo === 'Expired') {
            return row.due_days <= 0;
          } else if (clickPlo === '< 9 Bulan') {
            return row.due_days < 272 && row.due_days > 0;
          } else if (clickPlo === '> 9 Bulan') {
            return row.due_days >= 272;
          } else {
            return true;
          }
        });
        setFilteredPlo(filtered);
        // console.log("click:-", clickPlo);
        // console.log("Filtered Plo Data:", filtered);
      }
    }, [clickPlo]);
  
    useEffect(() => {
      if (clickRla) {
        setclickPlo(null); // Reset clickPlo when clickRla changes
        const filtered = plo.filter((row) => {
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
        setFilteredPlo(filtered);
        // console.log("click:-", clickRla);
        // console.log("Filtered RLA Data:", filtered);
      }
    }, [clickRla]);

  const fetchPlo = async () => {
    try {
      setLoading(true);
      const data = await getPlo();
      setPlo(data.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  const fetchPloCountDueDays = async () => {
    try {
      setLoading(true);
      const data = await ploCountDueDays();
      setCountPlo(data.data);
    } catch (error) {
      console.error("Error fetching Plo:", error);
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
      headerName: 'Nomor PLO',
      width: 200,
      renderCell: (params) => (
        <div className='py-4'>
          <Link
            to={`${base_public_url}plo/certificates/${params.row.plo_certificate}`}
            target='_blank'
            className='text-lime-500 underline'
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
      field: 'plo_certificate',
      headerName: 'PLO File',
      width: 100,
      renderCell: (params) => (
        <div className='py-4'>
          <Link
            to={`${base_public_url}plo/certificates/${params.row.plo_certificate}`}
            target='_blank'
            className='item-center text-lime-500'
          >
            <IconCloudDownload stroke={2} />
          </Link>
        </div>
      ),
    },
    {
      field: 'plo_old_certificate',
      headerName: 'PLO Lama',
      width: 100,
      renderCell: (params) => (
        <div className='py-4 pl-4'>
          {params.value ? (
            <Link
              to={`${base_public_url}plo/certificates/${params.value}`}
              target='_blank'
              className=' text-lime-500'
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
              to={`${base_public_url}plo/rla/${params.value}`}
              target='_blank'
              className=' text-lime-500'
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
              to={`${base_public_url}plo/rla/${params.value}`}
              target='_blank'
              className=' text-lime-500'
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
  

  const dataPiePlo = [
    { label: "> 9 Bulan", value: countplo.plo_more_than_nine_months || 0, color: "#06d6a0" },
    { label: "< 9 Bulan", value: countplo.plo_less_than_nine_months || 0, color: "#ffd166" },
    { label: "Expired", value: countplo.plo_expired || 0, color: "#ef476f" },
  ];

  const dataPieRla = [
    { label: "> 9 Bulan", value: countplo.rla_more_than_nine_months || 0, color: "#06d6a0" },
    { label: "< 9 Bulan", value: countplo.rla_less_than_nine_months || 0, color: "#ffd166" },
    { label: "Expired", value: countplo.rla_expired || 0, color: "#ef476f" }, 
  ];


  
  const sizingplo = {
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
            <IconArrowLeft />
          </div>
        </div>
        <div className={` ${hide ? 'block' : 'hidden'}  w-fit bg-emerald-950 text-lime-300 p-2 cursor-pointer rounded-md`} onClick={() => setHide(false)}>
          <IconArrowRight />
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
          <Link className='hover:underline text-emerald-950' to='/plo'>
            PLO
          </Link>
          <Typography className='text-lime-500'>Dashboard PLO</Typography>
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
              <span>PLO</span>
              <PieChart
                series={[
                  {
                    outerRadius: 90,
                    data: dataPiePlo, arcLabel: (params) => `${params.value}`,
                    highlightScope: { fade: 'global', highlight: 'item' },
                    faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
                  },
                ]}
                width={350}
                height={200}
                onItemClick={(event, d) => {
                  const clickedData = dataPiePlo[d.dataIndex];
                  setclickPlo(clickedData.label);
                }}
                sx={{
                  [`& .${pieArcLabelClasses.root}`]: {
                    fill: 'white',
                    fontSize: 14,
                  },
                }}
                {...sizingplo}
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
        {/* TABLE PLO */}
        <div className='w-full bg-white shadow-sm px-2 py-4 rounded-lg space-y-2'>
          <div className='flex flex-row justify-between'>
          {loading ? <p>Loading...</p> : <div className="flex flex-col w-full">
            <div className='flex justify-end items-center mb-4'>
              <button className='px-2 py-2 flex justify-end bg-emerald-950 text-lime-400 text-sm rounded w-fit' onClick={() => {setFilteredPlo(plo); setclickPlo(null); setclickRla(null);}} >Reset Filter</button>
            </div>
          <DataGrid
              rows={filteredPlo.length > 0 ? filteredPlo : plo}
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

export default DashboardPlo;
