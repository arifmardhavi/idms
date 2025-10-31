import { useEffect, useState } from 'react';
import Header from '../components/Header';
import * as motion from 'motion/react-client';
import {
  DataGrid,
  GridToolbarQuickFilter,
  GridLogicOperator,
} from '@mui/x-data-grid';
import {
  deleteCoi,
  getCoi,
  downloadSelectedCoi,
} from '../services/coi.service';
import {
  IconPencil,
  IconCircleMinus,
  IconRefresh,
  IconCloudDownload,
  IconPlus,
  IconArticle,
} from '@tabler/icons-react';
import Swal from 'sweetalert2';
import { Link } from 'react-router-dom';
import { api_public } from '../services/config';
import { IconLoader2 } from '@tabler/icons-react';
import { jwtDecode } from 'jwt-decode';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { getWITDateLong } from '../utils/dateHelpers';
import { handleAddActivity } from '../utils/handleAddActivity';

const Coi = () => {
  const [coi, setCoi] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hide, setHide] = useState(false);
  const base_public_url = api_public;
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
    fetchCoi();
  }, []);

  const fetchCoi = async () => {
    try {
      setLoading(true);
      const data = await getCoi();
      setCoi(data.data);
      // console.log(data.data);
    } catch (error) {
      console.error("Error fetching COI:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (row) => {
    const result = await Swal.fire({
      title: "Apakah Anda yakin?",
      text: "Data COI akan dihapus secara permanen!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
    });

    if (result.isConfirmed) {
      try {
        const res = await deleteCoi(row.id);
        if (res.success) {
          Swal.fire("Berhasil!", "COI berhasil dihapus!", "success");
          fetchCoi();
        } else {
          Swal.fire("Gagal!", "Terjadi kesalahan saat menghapus COI!", "error");
        }
      } catch (error) {
        console.error("Error deleting COI:", error);
        Swal.fire("Gagal!", "Terjadi kesalahan saat menghapus COI!", "error");
      }
    }
  };

  const handleDownloadSelected = () => {
    if (selectedRows.length === 0) {
      Swal.fire("Peringatan!", "Tidak ada file yang dipilih!", "warning");
      return;
    }

    downloadSelectedCoi(selectedRows);
    Swal.fire("Berhasil!", `${selectedRows.length} file berhasil didownload!`, "success");
  };

  const handleExportToExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('COI Data');

    worksheet.columns = [
      { header: 'PLO', key: 'plo', width: 15 },
      { header: 'Tag Number', key: 'tag_number', width: 18 },
      { header: 'No Certificate', key: 'no_certificate', width: 32 },
      { header: 'Issue Date', key: 'issue_date', width: 15 },
      { header: 'Inspection Due Date', key: 'overdue_date', width: 18 },
      { header: 'Due Days', key: 'due_days', width: 10 },
      { header: 'RLA Certificate', key: 'rla_certificate', width: 32 },
      { header: 'RLA Issue Date', key: 'rla_issue', width: 15 },
      { header: 'RLA Due Date', key: 'rla_overdue', width: 15 },
      { header: 'RLA Due Days', key: 'rla_due_days', width: 12 },
      { header: 'Re-Engineering File', key: 're_engineer_certificate', width: 32 },
    ];


    coi.forEach((item) => {
      worksheet.addRow({
        plo: item.plo?.unit?.unit_name || '',
        tag_number: item.tag_number?.tag_number || '',
        no_certificate: item.no_certificate,
        issue_date: item.issue_date,
        overdue_date: item.overdue_date,
        due_days: item.due_days,
        rla_certificate: item.rla_certificate || '',
        rla_issue: item.rla_issue,
        rla_overdue: item.rla_overdue,
        rla_due_days: item.rla_due_days,
        re_engineer_certificate: item.re_engineer_certificate || '',
      });

      const lastRow = worksheet.lastRow;

      const no_certificate = lastRow.getCell('no_certificate');
      const rla_certificate = lastRow.getCell('rla_certificate');
      const re_engineer_certificate = lastRow.getCell('re_engineer_certificate');

      // No Certificate
      if (item.no_certificate && item.coi_certificate) {
        no_certificate.value = {
          text: item.no_certificate,
          hyperlink: `${api_public}coi/certificates/${item.coi_certificate}`,
        };
        no_certificate.font = {
          color: { argb: 'FF0000FF' },
          underline: true,
        };
      }

      // RLA Certificate
      if (item.rla_certificate) {
        rla_certificate.value = {
          text: item.rla_certificate,
          hyperlink: `${api_public}coi/rla/${item.rla_certificate}`,
        };
        rla_certificate.font = {
          color: { argb: 'FF0000FF' },
          underline: true,
        };
      }

      // Re-Engineer Certificate
      if (item.re_engineer_certificate) {
        re_engineer_certificate.value = {
          text: item.re_engineer_certificate,
          hyperlink: `${api_public}coi/re_engineer/${item.re_engineer_certificate}`,
        };
        re_engineer_certificate.font = {
          color: { argb: 'FF0000FF' },
          underline: true,
        };
      }
    });



    // Style header
    worksheet.getRow(1).eachCell((cell) => {
      cell.font = { bold: true };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'A7F3D0' }, // warna hijau muda
      };
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };
    });

    worksheet.eachRow({ includeEmpty: true }, (row) => {
      // Dapatkan jumlah kolom dari worksheet (agar semua cell dilintasi, termasuk yang kosong)
      const totalColumns = worksheet.columnCount;

      for (let col = 1; col <= totalColumns; col++) {
        const cell = row.getCell(col);

        // Paksa set isi kosong jika memang kosong (agar cell terbuat dan bisa diborder)
        if (cell.value === undefined || cell.value === null) {
          cell.value = ''; // Supaya cell eksis
        }

        // Tambahkan border
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        };
      }
    });

    // Mulai dari baris ke-2 karena baris ke-1 adalah header
    worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
      if (rowNumber === 1) return; // skip header

      const dueDaysCell = row.getCell('due_days');
      const rlaDueDaysCell = row.getCell('rla_due_days');

      const formatDueDaysCell = (cell) => {
        const raw = cell.value;
        // Kalau kosong/null/undefined
        if (raw === null || raw === undefined || raw === '') {
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'E5E7EB' }, // abu-abu Tailwind slate-200
          };
          cell.font = { color: { argb: '000000' } }; // teks hitam
          return;
        }

        const value = Number(raw);
        if (isNaN(value)) return;

        if (value <= 0) {
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'DC2626' }, // merah
          };
          cell.font = { color: { argb: 'FFFFFF' } }; // putih
        } else if (value < 272) {
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FACC15' }, // kuning
          };
          cell.font = { color: { argb: '000000' } }; // hitam
        } else {
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: '065F46' }, // hijau tua
          };
          cell.font = { color: { argb: 'FFFFFF' } }; // putih
        }
      };

      formatDueDaysCell(dueDaysCell);
      formatDueDaysCell(rlaDueDaysCell);
    });



    // Save
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(blob, `coi-export-${getWITDateLong()}.xlsx`);
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
            onClick={() => handleAddActivity(params.row.coi_certificate, "COI")}
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
      field: 'coi_certificate',
      headerName: 'COI File',
      width: 100,
      renderCell: (params) => (
        <div className='py-4'>
          <Link
            to={`${base_public_url}coi/certificates/${params.row.coi_certificate}`}
            target='_blank'
            className='item-center text-lime-500'
            onClick={() => handleAddActivity(params.row.coi_certificate, "COI")}
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
              onClick={() => handleAddActivity(params.value, "COI")}
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
              onClick={() => handleAddActivity(params.value, "COI")}
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
              onClick={() => handleAddActivity(params.value, "COI")}
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
              onClick={() => handleAddActivity(params.value, "COI")}
            >
              <IconCloudDownload stroke={2} />
            </Link>
          ) : (
            <p>-</p>
          )}
        </div>
      ),
    },
    ...(userLevel !== '4' && userLevel !== '5' ? [{
      field: 'actions',
      headerName: 'Aksi',
      width: 150,
      renderCell: (params) => (
        <div className='flex flex-row justify-center py-2 items-center space-x-2'>
          <Link to={`/coi/edit/${params.row.id}`}>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className='px-2 py-1 bg-emerald-950 text-lime-300 text-sm rounded'
              // onClick={() => handleEdit(params.row)}
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
    }] : [])
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
        <div className='w-full bg-white shadow-sm px-2 py-4 rounded-lg space-y-2'>
          <div className='flex flex-col sm:flex-row justify-center items-center space-y-1 sm:space-y-0 sm:justify-between'>
            <h1 className='text-xl font-bold uppercase'>COI</h1>
            <Link
              to={'/coi/dashboard'}
              className='flex space-x-1 items-center px-2 py-1 bg-emerald-950 text-lime-300 text-sm rounded w-fit'
            >
              Dashboard COI
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
                  <span>Download file COI</span>
                </motion.button>
              )}
              <motion.a
                href='/coi'
                whileTap={{ scale: 0.9 }}
                whileHover={{ scale: 1.1 }}
                className='flex space-x-1 items-center px-2 py-1 bg-emerald-950 text-lime-300 text-sm rounded'
              >
                <IconRefresh className='hover:rotate-180 transition duration-500' />
                <span>Refresh</span>
              </motion.a>
              { userLevel !== '4' && userLevel !== '5' && <Link
                to='/coi/tambah'
                className='flex space-x-1 items-center px-2 py-1 bg-emerald-950 text-lime-300 text-sm rounded  hover:scale-110 transition duration-100'
              >
                <IconPlus className='hover:rotate-180 transition duration-500' />
                <span>Tambah</span>
              </Link>}
            </div>
          </div>
          <div>
          {loading ? 
              <div className="flex flex-col items-center justify-center h-20">
                  <IconLoader2 stroke={2} className="animate-spin rounded-full h-10 w-10 " />
              </div> 
            : <DataGrid
              rows={coi}
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
                setSelectedRows(newSelectionModel); // Update state dengan ID yang dipilih
              }}
            />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Coi;
