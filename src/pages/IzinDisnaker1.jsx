import Header from '../components/Header';
import { useEffect, useState } from 'react';
import * as motion from 'motion/react-client';
import {
  DataGrid,
  GridToolbarQuickFilter,
  GridLogicOperator,
} from '@mui/x-data-grid';
import {
  deleteIzinDisnaker,
  getIzinDisnaker,
  downloadSelectedIzinDisnaker,
} from '../services/izin_disnaker1.service';
import { IconArticle, IconPencil } from '@tabler/icons-react';
import { IconCircleMinus } from '@tabler/icons-react';
import Swal from 'sweetalert2';
import { IconRefresh } from '@tabler/icons-react';
import { Link } from 'react-router-dom';
import { IconCloudDownload } from '@tabler/icons-react';
import { IconPlus } from '@tabler/icons-react';
import { api_public } from '../services/config';
import { IconEye } from '@tabler/icons-react';
import { IconLoader2 } from '@tabler/icons-react';
import { jwtDecode } from 'jwt-decode';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { getWITDateLong } from '../utils/dateHelpers';
import { handleAddActivity } from '../utils/handleAddActivity';


const IzinDisnaker = () => {
  const [selectedRows, setSelectedRows] = useState([]);
  const [izinDisnaker, setIzinDisnaker] = useState([]);
  const [loading, setLoading] = useState(false);
  const base_public_url = api_public;
  const [hide, setHide] = useState(false);
  const [userLevel, setUserLevel] = useState('')
  

  useEffect(() => {
    const token = localStorage.getItem('token');
    let level = '';
    try {
        level = String(jwtDecode(token).level_user);
    } catch (error) {
        console.error('Invalid token:', error);
    }
    setUserLevel(level);
    fetchIzinDisnaker();
  }, []);

  const fetchIzinDisnaker = async () => {
    try {
      setLoading(true);
      const data = await getIzinDisnaker();
      setIzinDisnaker(data.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (row) => {
    const result = await Swal.fire({
      title: "Apakah Anda yakin?",
      text: "Data Izin Disnaker akan dihapus secara permanen!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
    });

    if (result.isConfirmed) {
      try {
        const res = await deleteIzinDisnaker(row.id);
        if (res.success) {
          Swal.fire("Berhasil!", "Izin Disnaker berhasil dihapus!", "success");
          fetchIzinDisnaker();
        } else {
          Swal.fire("Gagal!", "Terjadi kesalahan saat menghapus Izin Disnaker!", "error");
        }
      } catch (error) {
        console.log(error);
        Swal.fire("Gagal!", "Terjadi kesalahan saat menghapus Izin Disnaker!", "error");
      }
    }
  };

  const handleDownloadSelected = () => {
    if (selectedRows.length === 0) {
      Swal.fire("Peringatan!", "Tidak ada file yang dipilih!", "warning");
      return;
    }

    downloadSelectedIzinDisnaker(selectedRows);
    Swal.fire(
      "Berhasil!",
      `${selectedRows.length} file berhasil didownload!`,
      "success"
    );
  };

  const handleExportToExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Izin Disnaker Data');

    worksheet.columns = [
      { header: 'Unit', key: 'unit', width: 15 },
      { header: 'Nomor Izin', key: 'no_certificate', width: 32 },
      { header: 'Issue Date', key: 'issue_date', width: 15 },
      { header: 'Expired Date', key: 'overdue_date', width: 18 },
      { header: 'Due Days', key: 'due_days', width: 10 },
    ];

    izinDisnaker.forEach((item) => {
      worksheet.addRow({
        unit: item.unit?.unit_name || '',
        no_certificate: item.no_certificate,
        issue_date: item.issue_date,
        overdue_date: item.overdue_date,
        due_days: item.due_days,
      });

      const lastRow = worksheet.lastRow;
      const no_certificate = lastRow.getCell('no_certificate');

      if (item.no_certificate && item.izin_disnaker_certificate) {
        no_certificate.value = {
          text: item.no_certificate,
          hyperlink: `${api_public}izin_disnaker/certificates/${item.izin_disnaker_certificate}`,
        };
        no_certificate.font = {
          color: { argb: 'FF0000FF' },
          underline: true,
        };
      }
    });

    worksheet.getRow(1).eachCell((cell) => {
      cell.font = { bold: true };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'A7F3D0' },
      };
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };
    });

    worksheet.eachRow({ includeEmpty: true }, (row) => {
      const totalColumns = worksheet.columnCount;
      for (let col = 1; col <= totalColumns; col++) {
        const cell = row.getCell(col);
        if (cell.value === undefined || cell.value === null) {
          cell.value = '';
        }
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        };
      }
    });

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob(
      [buffer],
      { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }
    );
    saveAs(blob, `izin_disnaker-export-${getWITDateLong()}.xlsx`);
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
      headerName: 'Nomor Izin Disnaker',
      width: 200,
      renderCell: (params) => (
        <div className='py-4'>
          <Link
            to={`${base_public_url}izin_disnaker/certificates/${params.row.izin_disnaker_certificate}`}
            target='_blank'
            className='text-lime-500 underline'
            onClick={() =>
              handleAddActivity(params.row.izin_disnaker_certificate, 'IZIN_DISNAKER')
            }
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
      headerName: 'Expired Date',
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
                  ? 'text-white bg-red-600'
                  : diffDays < 272
                  ? 'bg-yellow-400 text-black'
                  : 'bg-emerald-950 text-white'
              } rounded-full w-fit p-2`}
            >
              {diffDays}
            </p>
          </div>
        );
      },
    },
    {
      field: 'izin_disnaker_certificate',
      headerName: 'Izin Disnaker File',
      width: 150,
      renderCell: (params) => (
        <div className='py-4'>
          <Link
            to={`${base_public_url}izin_disnaker/certificates/${params.row.izin_disnaker_certificate}`}
            target='_blank'
            className='item-center text-lime-500'
            onClick={() =>
              handleAddActivity(params.row.izin_disnaker_certificate, 'IZIN_DISNAKER')
            }
          >
            <IconCloudDownload stroke={2} />
          </Link>
        </div>
      ),
    },
    {
      field: 'izin_disnaker_old_certificate',
      headerName: 'Izin Disnaker Lama',
      width: 150,
      renderCell: (params) => (
        <div className='py-4 pl-4'>
          {params.value ? (
            <Link
              to={`${base_public_url}izin_disnaker/certificates/${params.value}`}
              target='_blank'
              className=' text-lime-500'
              onClick={() => handleAddActivity(params.value, 'IZIN_DISNAKER')}
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
      field: 'report_izin_disnaker',
      headerName: 'Report/BAPK',
      width: 120,
      renderCell: (params) => (
        <div className='py-4 pl-4'>
          <Link
            to={`/izin_disnaker/report/${params.row.id}`}
            className=' text-lime-500'
          >
            <IconEye stroke={2} />
          </Link>
        </div>
      ),
    },
    ...(userLevel !== '4' && userLevel !== '5'
      ? [
          {
            field: 'actions',
            headerName: 'Aksi',
            width: 150,
            renderCell: (params) => (
              <div className='flex flex-row justify-center py-2 items-center space-x-2'>
                <Link to={`/izin_disnaker/edit/${params.row.id}`}>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className='px-2 py-1 bg-emerald-950 text-lime-300 text-sm rounded'
                  >
                    <IconPencil stroke={2} />
                  </motion.button>
                </Link>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className='px-2 py-1 bg-emerald-950 text-red-500 text-sm rounded'
                  onClick={() => handleDelete(params.row)}
                >
                  <IconCircleMinus stroke={2} />
                </motion.button>
              </div>
            ),
          },
        ]
      : []),
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
  // get IZIN DISNAKER

  return (
    <div className='flex flex-col md:flex-row w-full'>
      {!hide && <Header />}
      <div
        className={`flex flex-col ${
          hide ? '' : 'md:pl-64'
        } w-full px-2 py-4 space-y-3`}
      >
        <div className='md:flex hidden'>
          <div
            className={`${
              hide ? 'hidden' : 'block'
            } w-fit bg-emerald-950 text-lime-300 p-2 cursor-pointer rounded-md`}
            onClick={() => setHide(true)}
          >
            <IconArticle />
          </div>
        </div>
        <div
          className={`${
            hide ? 'block' : 'hidden'
          }  w-fit bg-emerald-950 text-lime-300 p-2 cursor-pointer rounded-md`}
          onClick={() => setHide(false)}
        >
          <IconArticle />
        </div>

        {/* GET IZIN DISNAKER */}
        <div className='w-full bg-white shadow-sm px-2 py-4 rounded-lg space-y-2'>
          <div className='flex flex-row justify-between'>
            <h1 className='text-xl font-bold uppercase'>IZIN DISNAKER</h1>

            <Link
              to={'/izin_disnaker/dashboard'}
              className='flex space-x-1 items-center px-2 py-1 bg-emerald-950 text-lime-300 text-sm rounded'
            >
              Dashboard Izin Disnaker
            </Link>

            <div className='flex flex-row justify-end items-center space-x-2'>
              <motion.button
                onClick={handleExportToExcel}
                whileTap={{ scale: 0.9 }}
                whileHover={{ scale: 1.1 }}
                className='flex space-x-1 items-center px-2 py-1 bg-emerald-950 text-lime-300 text-sm rounded'
              >
                <IconCloudDownload />
                <span>Export Excel</span>
              </motion.button>

              {selectedRows.length > 0 && (
                <motion.button
                  onClick={handleDownloadSelected}
                  whileTap={{ scale: 0.9 }}
                  whileHover={{ scale: 1.1 }}
                  className='flex space-x-1 items-center px-2 py-1 bg-emerald-950 text-lime-300 text-sm rounded'
                >
                  <IconCloudDownload />
                  <span>Download file Izin Disnaker</span>
                </motion.button>
              )}

              <button
                onClick={fetchIzinDisnaker}
                className="bg-emerald-950 text-lime-300 p-2 cursor-pointer rounded-xl flex gap-1 hover:bg-emerald-900"
              >
              <IconRefresh className="hover:rotate-90 duration-300" /> Refresh
              </button>

              {userLevel !== '4' && userLevel !== '5' && (
                <Link
                  to='/izin_disnaker/tambah'
                  className='flex space-x-1 items-center px-2 py-1 bg-emerald-950 text-lime-300 text-sm rounded hover:scale-110 transition duration-100'
                >
                  <IconPlus className='hover:rotate-180 transition duration-500' />
                  <span>Tambah</span>
                </Link>
              )}
            </div>
          </div>

          <div>
            {loading ? (
              <div className='flex flex-col items-center justify-center h-20'>
                <IconLoader2
                  stroke={2}
                  className='animate-spin rounded-full h-10 w-10'
                />
              </div>
            ) : (
              <DataGrid
                rows={izinDisnaker}
                columns={columns}
                checkboxSelection
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
                onRowSelectionModelChange={(newSelectionModel) => {
                  setSelectedRows(newSelectionModel);
                }}
              />
            )}
          </div>
        </div>
        {/* GET IZIN DISNAKER */}
      </div>
    </div>
  );
};

export default IzinDisnaker;