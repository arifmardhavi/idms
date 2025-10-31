import Header from '../components/Header';
import { useEffect, useState } from 'react';
import * as motion from 'motion/react-client';
import {
  DataGrid,
  GridToolbarQuickFilter,
  GridLogicOperator,
} from '@mui/x-data-grid';
import {
  deletePlo,
  getPlo,
  downloadSelectedPlo,
} from '../services/plo.service';
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
// import * as XLSX from 'xlsx';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { getWITDateLong } from '../utils/dateHelpers';
import { handleAddActivity } from '../utils/handleAddActivity';


const Plo = () => {
  const [selectedRows, setSelectedRows] = useState([]);
  const [plo, setPlo] = useState([]);
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
    fetchPlo();
  }, []);

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

  const handleDelete = async (row) => {
    const result = await Swal.fire({
      title: "Apakah Anda yakin?",
      text: "Data PLO akan dihapus secara permanen!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
    });

    if (result.isConfirmed) {
      try {
        const res = await deletePlo(row.id);
        if (res.success) {
          Swal.fire("Berhasil!", "PLO berhasil dihapus!", "success");
          fetchPlo();
        } else {
          Swal.fire("Gagal!", "Terjadi kesalahan saat menghapus PLO!", "error");
        }
      } catch (error) {
        console.log(error);
        Swal.fire("Gagal!", "Terjadi kesalahan saat menghapus PLO!", "error");
      }
    }
  };

  const handleDownloadSelected = () => {
    if (selectedRows.length === 0) {
      Swal.fire("Peringatan!", "Tidak ada file yang dipilih!", "warning");
      return;
    }

    downloadSelectedPlo(selectedRows);
    Swal.fire("Berhasil!", `${selectedRows.length} file berhasil didownload!`, "success");
  };

  const handleExportToExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('PLO Data');

    worksheet.columns = [
      { header: 'Unit', key: 'unit', width: 15 },
      { header: 'Nomor PLO', key: 'no_certificate', width: 32 },
      { header: 'Issue Date', key: 'issue_date', width: 15 },
      { header: 'Inspection Due Date', key: 'overdue_date', width: 18 },
      { header: 'Due Days', key: 'due_days', width: 10 },
      { header: 'RLA Certificate', key: 'rla_certificate', width: 32 },
      { header: 'RLA Issue Date', key: 'rla_issue', width: 18 },
      { header: 'RLA Due Date', key: 'rla_overdue', width: 18 },
      { header: 'RLA Due Days', key: 'rla_due_days', width: 12 },
    ];

    plo.forEach((item) => {
      worksheet.addRow({
        unit: item.unit?.unit_name || '',
        no_certificate: item.no_certificate,
        issue_date: item.issue_date,
        overdue_date: item.overdue_date,
        due_days: item.due_days,
        rla_issue: item.rla_issue,
        rla_certificate: item.rla_certificate,
        rla_overdue: item.rla_overdue,
        rla_due_days: item.rla_due_days,
      });
      const lastRow = worksheet.lastRow;
      
      const no_certificate = lastRow.getCell('no_certificate');
      const rla_certificate = lastRow.getCell('rla_certificate');

      // No Certificate
      if (item.no_certificate && item.plo_certificate) {
        no_certificate.value = {
          text: item.no_certificate,
          hyperlink: `${api_public}plo/certificates/${item.plo_certificate}`,
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
          hyperlink: `${api_public}plo/rla/${item.rla_certificate}`,
        };
        rla_certificate.font = {
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
    saveAs(blob, `plo-export-${getWITDateLong()}.xlsx`);
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
            onClick={() => handleAddActivity(params.row.plo_certificate, "PLO")}
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
      field: 'plo_certificate',
      headerName: 'PLO File',
      width: 100,
      renderCell: (params) => (
        <div className='py-4'>
          <Link
            to={`${base_public_url}plo/certificates/${params.row.plo_certificate}`}
            target='_blank'
            className='item-center text-lime-500'
            onClick={() => handleAddActivity(params.row.plo_certificate, "PLO")}
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
              onClick={() => handleAddActivity(params.value, "PLO")}
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
      field: 'report_plo',
      headerName: 'Report',
      width: 100,
      renderCell: (params) => (
        <div className='py-4 pl-4'>
          <Link to={`/plo/report/${params.row.id}`}
            className=' text-lime-500'
          >
            <IconEye stroke={2} />
          </Link>
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
              onClick={() => handleAddActivity(params.value, "PLO")}
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
              onClick={() => handleAddActivity(params.value, "PLO")}
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
          <Link to={`/plo/edit/${params.row.id}`}>
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
  // get PLO

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
        {/* GET PLO  */}
        <div className='w-full bg-white shadow-sm px-2 py-4 rounded-lg space-y-2'>
          <div className='flex flex-row justify-between'>
            <h1 className='text-xl font-bold uppercase'>PLO</h1>
            <Link
              to={'/plo/dashboard'}
              className='flex space-x-1 items-center px-2 py-1 bg-emerald-950 text-lime-300 text-sm rounded'
            >
              Dashboard PLO
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
                  <span>Download file PLO</span>
                </motion.button>
              )}
              <motion.a
                href='/plo'
                whileTap={{ scale: 0.9 }}
                whileHover={{ scale: 1.1 }}
                className='flex space-x-1 items-center px-2 py-1 bg-emerald-950 text-lime-300 text-sm rounded'
              >
                <IconRefresh className='hover:rotate-180 transition duration-500' />
                <span>Refresh</span>
              </motion.a>
              { userLevel !== '4' && userLevel !== '5' && <Link
                to='/plo/tambah'
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
              rows={plo}
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
        {/* GET PLO  */}
      </div>
    </div>
  );
};

export default Plo;
