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
import { getCoi, coiCountDueDays } from "../../services/coi.service";
import { api_public } from "../../services/config";


const DashboardCoi = () => {
  const [coi, setCoi] = useState([]);
  const [countcoi, setCountCoi] = useState({});
  const [loading, setLoading] = useState(false);
  const [clickCoi, setclickCoi] = useState(null);
  const [clickRla, setclickRla] = useState(null);
  const [filteredCoi, setFilteredCoi] = useState([]);
  const base_public_url = api_public;

  useEffect(() => {
    fetchCoi();
    fetchCoiCountDueDays();
  }, []);

  useEffect(() => {
    if (clickCoi) {
      setclickRla(null); // Reset clickRla when clickCoi changes
      const filtered = coi.filter((row) => {
        if (clickCoi === 'Expired') {
          return row.due_days <= 0;
        } else if (clickCoi === '< 9 Bulan') {
          return row.due_days < 272 && row.due_days > 0;
        } else if (clickCoi === '> 9 Bulan') {
          return row.due_days >= 272;
        } else {
          return true;
        }
      });
      setFilteredCoi(filtered);
      // console.log("click:-", clickCoi);
      // console.log("Filtered COI Data:", filtered);
    }
  }, [clickCoi]);

  useEffect(() => {
    if (clickRla) {
      setclickCoi(null); // Reset clickCoi when clickRla changes
      const filtered = coi.filter((row) => {
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
      setFilteredCoi(filtered);
      // console.log("click:-", clickRla);
      // console.log("Filtered RLA Data:", filtered);
    }
  }, [clickRla]);

  const fetchCoi = async () => {
    try {
      setLoading(true);
      const data = await getCoi();
      setCoi(data.data);
    } catch (error) {
      console.error("Error fetching COI:", error);
    } finally {
      setLoading(false);
    }
  };
  const fetchCoiCountDueDays = async () => {
    try {
      setLoading(true);
      const data = await coiCountDueDays();
      setCountCoi(data.data);
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
      headerName: 'PLO',
      width: 150,
      renderCell: (params) => <div className='py-4'>{params.value}</div>,
    },
    {
      field: 'no_certificate',
      headerName: 'No Certificate',
      width: 150,
      renderCell: (params) => (
        <div className='py-4'>
          <Link
            to={`${base_public_url}coi/certificates/${params.row.coi_certificate}`}
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
      field: 'coi_certificate',
      headerName: 'COI File',
      width: 100,
      renderCell: (params) => (
        <div className='py-4'>
          <Link
            to={`${base_public_url}coi/certificates/${params.row.coi_certificate}`}
            target='_blank'
            className='item-center text-lime-500'
          >
            <IconCloudDownload stroke={2} />
          </Link>
        </div>
      ),
    },
    {
      field: 'coi_old_certificate',
      headerName: 'COI Lama',
      width: 100,
      renderCell: (params) => (
        <div className='py-4 pl-4'>
          {params.value ? (
            <Link
              to={`${base_public_url}coi/certificates/${params.value}`}
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
              to={`${base_public_url}coi/rla/${params.value}`}
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
              to={`${base_public_url}coi/rla/${params.value}`}
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
      field: 're_engineer_certificate',
      headerName: 'Re-Engineering file',
      width: 150,
      renderCell: (params) => (
        <div className='py-4 pl-4'>
          {params.value ? (
            <Link
              to={`${base_public_url}coi/re_engineer/${params.value}`}
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
  

  const dataPieCoi = [
    { label: "> 9 Bulan", value: countcoi.coi_more_than_nine_months || 0, color: "#06d6a0" },
    { label: "< 9 Bulan", value: countcoi.coi_less_than_nine_months || 0, color: "#ffd166" },
    { label: "Expired", value: countcoi.coi_expired || 0, color: "#ef476f" },
  ];

  const dataPieRla = [
    { label: "> 9 Bulan", value: countcoi.rla_more_than_nine_months || 0, color: "#06d6a0" },
    { label: "< 9 Bulan", value: countcoi.rla_less_than_nine_months || 0, color: "#ffd166" },
    { label: "Expired", value: countcoi.rla_expired || 0, color: "#ef476f" }, 
  ];


  
  const sizingcoi = {
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
      <Header />
      
      <div className='flex flex-col md:pl-64 w-full px-2 py-4 space-y-3'>
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
          <Link className='hover:underline text-emerald-950' to='/coi'>
            COI
          </Link>
          <Typography className='text-lime-500'>Dashboard COI</Typography>
        </Breadcrumbs>
        {/* PIE CHART */}
        <div className='w-full bg-white shadow-sm px-2 py-4 rounded-lg space-y-2'>
        {loading ? <p>Loading...</p> : (
          <div className='flex flex-col md:flex-row justify-evenly'>
            <div className="flex flex-col items-center">
              <span>COI</span>
              <PieChart
                series={[
                  {
                    outerRadius: 90,
                    data: dataPieCoi, arcLabel: (params) => `${params.value}`,
                    highlightScope: { fade: 'global', highlight: 'item' },
                    faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
                  },
                ]}
                width={350}
                height={200}
                onItemClick={(event, d) => {
                  const clickedData = dataPieCoi[d.dataIndex];
                  setclickCoi(clickedData.label);
                }}

                sx={{
                  [`& .${pieArcLabelClasses.root}`]: {
                    fill: 'white',
                    fontSize: 14,
                  },
                }}
                {...sizingcoi}
              />
            </div>
            <div className="flex flex-col items-center text-center">
              <span>RLA</span>
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
        {/* TABLE coi */}
        {/* <div> 
          <h1 className='text-2xl font-semibold text-emerald-950'>Data COI</h1>
          <div>{clickCoi ? clickCoi : 'coi'} | {clickRla ? clickRla : 'rla'}</div>
        </div> */}
        <div className='w-full bg-white shadow-sm px-2 py-4 rounded-lg space-y-2'>
        {loading ? <p>Loading...</p> : (<div className='flex flex-col'>
            <div className='flex justify-end items-center mb-4'>
              <button className='px-2 py-2 flex justify-end bg-emerald-950 text-lime-400 text-sm rounded w-fit' onClick={() => {setFilteredCoi(coi); setclickCoi(null); setclickRla(null);}} >Reset Filter</button>
            </div>
            <DataGrid
              rows={filteredCoi.length > 0 ? filteredCoi : coi}
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
              
            />
          </div> )}
        </div>
      </div>
      
    </div>
  );
};

export default DashboardCoi;
