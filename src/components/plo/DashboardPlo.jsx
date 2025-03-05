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

const DashboardPlo = () => {

  const [plo, setPlo] = useState([]);
  const [countplo, setCountPlo] = useState({});

  useEffect(() => {
    getPlo((data) => {
      localStorage.setItem("plo", JSON.stringify(data.data));
      setPlo(data.data || []);
    });

    ploCountDueDays((data) => {
      localStorage.setItem("countplo", JSON.stringify(data.data));
      setCountPlo(data.data || {});
    });
  }, []);

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
            to={`http://192.168.1.152:8080/plo/certificates/${params.row.plo_certificate}`}
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
        const overdueDate = new Date(params.row.overdue_date); // Mengonversi overdue_date ke Date
        const currentDate = new Date(); // Mendapatkan tanggal saat ini

        // Menghitung selisih dalam milidetik
        const diffTime = overdueDate - currentDate;
        // Mengonversi selisih milidetik ke hari
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

        return (
          <div className='py-2 pl-3'>
            <p
              className={`${
                diffDays <= 0
                  ? 'text-white bg-red-600'
                  : 'bg-lime-950 text-lime-300'
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
            to={`http://192.168.1.152:8080/plo/certificates/${params.row.plo_certificate}`}
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
              to={`http://192.168.1.152:8080/plo/certificates/${params.value}`}
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
      headerName: 'RLA Issue',
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
      headerName: 'RLA Overdue',
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
        if (params.row.rla_overdue) {
          const overdueDate = new Date(params.row.rla_overdue); // Mengonversi overdue_date ke Date
          const currentDate = new Date(); // Mendapatkan tanggal saat ini

          // Menghitung selisih dalam milidetik
          const diffTime = overdueDate - currentDate;
          // Mengonversi selisih milidetik ke hari
          const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
          return (
            <div className='py-2 pl-3'>
              <p
                className={`${
                  diffDays <= 0
                    ? 'text-white bg-red-600'
                    : 'bg-lime-950 text-lime-300'
                } rounded-full w-fit p-2`}
              >
                {diffDays}
              </p>
            </div>
          );
        } else {
          return (
            <div className='py-2 pl-3'>
              <p className='bg-lime-950 text-lime-300 rounded-full w-fit p-2'>
                -
              </p>
            </div>
          );
        }
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
              to={`http://192.168.1.152:8080/plo/rla/${params.value}`}
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
              to={`http://192.168.1.152:8080/plo/rla/${params.value}`}
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
  

  const dataPiePlo = [
    { label: "> 6 Bulan", value: countplo.plo_more_than_six_months || 0, color: "#06d6a0" },
    { label: "< 6 Bulan", value: countplo.plo_less_than_six_months || 0, color: "#ffd166" },
    { label: "Expired", value: countplo.plo_expired || 0, color: "#ef476f" },
  ];

  const dataPieRla = [
    { label: "> 6 Bulan", value: countplo.rla_more_than_six_months || 0, color: "#06d6a0" },
    { label: "< 6 Bulan", value: countplo.rla_less_than_six_months || 0, color: "#ffd166" },
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
          <Link className='hover:underline text-emerald-950' to='/plo'>
            PLO
          </Link>
          <Typography className='text-lime-500'>Dashboard PLO</Typography>
        </Breadcrumbs>
        {/* PIE CHART */}
        <div className='w-full bg-white shadow-sm px-2 py-4 rounded-lg space-y-2'>
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
                {...sizingrla}
              />
            </div>
          </div>
        </div>
        {/* TABLE PLO */}
        <div className='w-full bg-white shadow-sm px-2 py-4 rounded-lg space-y-2'>
          <div className='flex flex-row justify-between'>
            <DataGrid
              rows={plo}
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
                    quickFilterLogicOperator: GridLogicOperator.Or,
                  },
                },
              }}
              pageSizeOptions={[10, 25, 50, { value: -1, label: 'All' }]}
              
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPlo;
