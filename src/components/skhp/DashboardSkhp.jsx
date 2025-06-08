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
import { getSkhp, skhpCountDueDays } from "../../services/skhp.service";
import { api_public } from "../../services/config";


const DashboardSkhp = () => {
  const [skhp, setSkhp] = useState([]);
  const [countskhp, setCountSkhp] = useState({});
  const [loading, setLoading] = useState(false);
  const [clickSkhp, setclickSkhp] = useState(null);
  const [filteredSkhp, setFilteredSkhp] = useState([]);
  const base_public_url = api_public;

  useEffect(() => {
    fetchSkhp();
    fetchSkhpCountDueDays();

    skhpCountDueDays((data) => {
      localStorage.setItem("countskhp", JSON.stringify(data.data));
      setCountSkhp(data.data || {});
    });
  }, []);

  useEffect(() => {
    if (clickSkhp) {
      const filtered = skhp.filter((row) => {
        if (clickSkhp === 'Expired') {
          return row.due_days <= 0;
        } else if (clickSkhp === '< 6 Bulan') {
          return row.due_days < 180 && row.due_days > 0;
        } else if (clickSkhp === '> 6 Bulan') {
          return row.due_days >= 180;
        } else {
          return true;
        }
      });
      setFilteredSkhp(filtered);
      // console.log("click:-", clickSkhp);
      // console.log("Filtered Skhp Data:", filtered);
    }
  }, [clickSkhp]);

  const fetchSkhp = async () => {
    try {
      setLoading(true);
      const data = await getSkhp();
      setSkhp(data.data);
    } catch (error) {
      console.error("Error fetching SKHP:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSkhpCountDueDays = async () => {
      try {
        setLoading(true);
        const data = await skhpCountDueDays();
        setCountSkhp(data.data);
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
      field: 'no_skhp',
      headerName: 'No SKHP',
      width: 150,
      renderCell: (params) => (
        <div className='py-4'>
          <Link
            to={`${base_public_url}skhp/${params.row.file_skhp}`}
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
      field: 'files_skhp',
      headerName: 'File SKHP',
      width: 100,
      renderCell: (params) => (
        <div className='py-4'>
          <Link
            to={`${base_public_url}skhp/${params.row.file_skhp}`}
            target='_blank'
            className='item-center text-lime-500'
          >
            <IconCloudDownload stroke={2} />
          </Link>
        </div>
      ),
    },
    {
      field: 'files_old_skhp',
      headerName: 'SKHP LAMA',
      width: 100,
      renderCell: (params) => (
        <div className='py-4 pl-4'>
          {params.row.file_old_skhp ? (
            <Link
              to={`${base_public_url}skhp/${params.row.file_old_skhp}`}
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
  

  const dataPieSkhp = [
    { label: "> 6 Bulan", value: countskhp.skhp_more_than_six_months || 0, color: "#06d6a0" },
    { label: "< 6 Bulan", value: countskhp.skhp_less_than_six_months || 0, color: "#ffd166" },
    { label: "Expired", value: countskhp.skhp_expired || 0, color: "#ef476f" },
  ];


  
  const sizingskhp = {
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
          <Link className='hover:underline text-emerald-950' to='/skhp'>
            SKHP
          </Link>
          <Typography className='text-lime-500'>Dashboard SKHP</Typography>
        </Breadcrumbs>
        {/* PIE CHART */}
        <div className='w-full bg-white shadow-sm px-2 py-4 rounded-lg space-y-2'>
          <div className='flex flex-col md:flex-row justify-evenly'>
          {loading ? <p>Loading...</p> : ( <div className="flex flex-col items-center">
              <span>SKHP</span>
              <PieChart
                series={[
                  {
                    outerRadius: 90,
                    data: dataPieSkhp, arcLabel: (params) => `${params.value}`,
                    highlightScope: { fade: 'global', highlight: 'item' },
                    faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
                  },
                ]}
                width={350}
                height={200}
                onItemClick={(event, d) => {
                  const clickedData = dataPieSkhp[d.dataIndex];
                  setclickSkhp(clickedData.label);
                }}
                sx={{
                  [`& .${pieArcLabelClasses.root}`]: {
                    fill: 'white',
                    fontSize: 14,
                  },
                }}
                {...sizingskhp}
              />
            </div> )}
          </div>
        </div>
        {/* TABLE skhp */}
        <div className='w-full bg-white shadow-sm px-2 py-4 rounded-lg space-y-2'>
          <div className='flex flex-row justify-between'>
          {loading ? <p>Loading...</p> : <div className="flex flex-col w-full">
          <div className='flex justify-end items-center mb-4'>
              <button className='px-2 py-2 flex justify-end bg-emerald-950 text-lime-400 text-sm rounded w-fit' onClick={() => {setFilteredSkhp(skhp); setclickSkhp(null);}} >Reset Filter</button>
            </div> 
          <DataGrid
              rows={filteredSkhp.length > 0 ? filteredSkhp : skhp}
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

export default DashboardSkhp;
