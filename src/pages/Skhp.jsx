import { useEffect, useState } from 'react';
import Header from '../components/Header';
import * as motion from 'motion/react-client';
import {
  DataGrid,
  GridToolbarQuickFilter,
  GridLogicOperator,
} from '@mui/x-data-grid';
import {
  deleteSkhp,
  getSkhp,
  downloadSelectedSkhp,
} from '../services/skhp.service';
import {
  IconPencil,
  IconCircleMinus,
  IconRefresh,
  IconCloudDownload,
  IconPlus,
} from '@tabler/icons-react';
import Swal from 'sweetalert2';
import { Link } from 'react-router-dom';

const Skhp = () => {
  const [skhp, setSkhp] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);

  useEffect(() => {
    getSkhp((data) => {
      localStorage.setItem('skhp', JSON.stringify(data.data));
      setSkhp(
        localStorage.getItem('skhp')
          ? JSON.parse(localStorage.getItem('skhp'))
          : data.data
      );
    });
  }, []);

  const columns = [
    {
      field: 'tag_number',
      valueGetter: (params) => params.tag_number,
      headerName: 'Tag Number',
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
            to={`http://ptmksmvmidmsru7.pertamina.com:4444/skhp/${params.row.file_skhp}`}
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
                : 'bg-emerald-950 text-lime-400' // Lebih dari 6 bulan
              } rounded-full w-fit p-2`}
            >
              {diffDays}
            </p>
          </div>
        );
      },
    },
    {
      field: 'file_skhp',
      headerName: 'FILE SKHP',
      width: 100,
      renderCell: (params) => (
        <div className='py-4'>
          <Link
            to={`http://ptmksmvmidmsru7.pertamina.com:4444/skhp/${params.row.file_skhp}`}
            target='_blank'
            className='item-center text-lime-500'
          >
            <IconCloudDownload stroke={2} />
          </Link>
        </div>
      ),
    },
    {
      field: 'file_old_skhp',
      headerName: 'SKHP LAMA',
      width: 100,
      renderCell: (params) => (
        <div className='py-4 pl-4'>
          {params.value ? (
            <Link
              to={`http://ptmksmvmidmsru7.pertamina.com:4444/skhp/${params.value}`}
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
      field: 'actions',
      headerName: 'Aksi',
      width: 150,
      renderCell: (params) => (
        <div className='flex flex-row justify-center py-2 items-center space-x-2'>
          <Link to={`/skhp/edit/${params.row.id}`}>
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

  const handleDelete = (row) => {
    Swal.fire({
      title: 'Apakah Anda yakin?',
      text: 'Data SKHP akan dihapus secara permanen!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Ya, hapus!',
      cancelButtonText: 'Batal',
    }).then((result) => {
      if (result.isConfirmed) {
        deleteSkhp(row.id, (res) => {
          if (res.success) {
            Swal.fire({
              title: 'Berhasil!',
              text: 'Skhp berhasil dihapus!',
              icon: 'success',
            });
            getSkhp((data) => {
              localStorage.setItem('skhp', JSON.stringify(data.data));
              setSkhp(
                localStorage.getItem('skhp')
                  ? JSON.parse(localStorage.getItem('skhp'))
                  : data.data
              );
            });
          } else {
            Swal.fire({
              title: 'Gagal!',
              text: 'Terjadi kesalahan saat menghapus skhp!',
              icon: 'error',
            });
          }
        });
      }
    });
  };

  const handleDownloadSelected = () => {
    if (selectedRows.length === 0) {
      Swal.fire({
        title: 'Peringatan!',
        text: 'Tidak ada file yang dipilih!',
        icon: 'warning',
      });
      return;
    }

    // Panggil fungsi downloadSelectedskhp dengan ID yang dipilih
    downloadSelectedSkhp(selectedRows);
    Swal.fire({
      title: 'Berhasil!',
      text: `${selectedRows.length} file berhasil didownload!`,
      icon: 'success',
    });
  };

  return (
    <div className='flex flex-col md:flex-row w-full'>
      <Header />
      <div className='flex flex-col md:pl-64 w-full px-2 py-4 space-y-3'>
        <div className='w-full bg-white shadow-sm px-2 py-4 rounded-lg space-y-2'>
          <div className='flex flex-row justify-between'>
            <h1 className='text-xl font-bold uppercase'>SKHP</h1>
            <Link
              to={'/skhp/dashboard'}
              className='flex space-x-1 items-center px-2 py-1 bg-emerald-950 text-lime-300 text-sm rounded'
            >
              Dashboard SKHP
            </Link>
            <div className='flex flex-row justify-end items-center space-x-2'>
              {selectedRows.length > 0 && (
                <motion.button
                  onClick={handleDownloadSelected}
                  whileTap={{ scale: 0.9 }}
                  whileHover={{ scale: 1.1 }}
                  className='flex space-x-1 items-center px-2 py-1 bg-emerald-950 text-lime-300 text-sm rounded'
                >
                  <IconCloudDownload />
                  <span>Download file SKHP</span>
                </motion.button>
              )}
              <motion.a
                href='/skhp'
                whileTap={{ scale: 0.9 }}
                whileHover={{ scale: 1.1 }}
                className='flex space-x-1 items-center px-2 py-1 bg-emerald-950 text-lime-300 text-sm rounded'
              >
                <IconRefresh className='hover:rotate-180 transition duration-500' />
                <span>Refresh</span>
              </motion.a>
              <Link
                to='/skhp/tambah'
                className='flex space-x-1 items-center px-2 py-1 bg-emerald-950 text-lime-300 text-sm rounded  hover:scale-110 transition duration-100'
              >
                <IconPlus className='hover:rotate-180 transition duration-500' />
                <span>Tambah</span>
              </Link>
            </div>
          </div>
          <div>
            <DataGrid
              rows={skhp}
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
                    quickFilterLogicOperator: GridLogicOperator.Or,
                  },
                },
              }}
              pageSizeOptions={[10, 25, 50, { value: -1, label: 'All' }]}
              onRowSelectionModelChange={(newSelectionModel) => {
                setSelectedRows(newSelectionModel); // Update state dengan ID yang dipilih
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Skhp;
