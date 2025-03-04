import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import * as motion from 'motion/react-client';
import {
  DataGrid,
  GridToolbarQuickFilter,
  GridLogicOperator,
} from '@mui/x-data-grid';
import {
  getCategory,
  addCategory,
  updateCategory,
  nonactiveCategory,
} from '../services/category.service';
import { getUnit } from '../services/unit.service';
import { IconPencil } from '@tabler/icons-react';
import { IconCircleMinus } from '@tabler/icons-react';
import Swal from 'sweetalert2';
import { IconRefresh } from '@tabler/icons-react';

const Category = () => {
  const [category, setCategory] = useState([]);
  const [editCategory, setEditCategory] = useState({});
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    getCategory((data) => {
      localStorage.setItem('category', JSON.stringify(data.data));
      setCategory(
        localStorage.getItem('category')
          ? JSON.parse(localStorage.getItem('category'))
          : data.data
      );
    });
    getUnit((data) => {
      setIsUnit(data.data);
    });
  }, []);

  const columns = [
    {
      field: 'category_name',
      headerName: 'Nama Kategori',
      width: 200,
      renderCell: (params) => <div className='py-4'>{params.value}</div>,
    },
    {
      field: 'description',
      headerName: 'Deskripsi',
      width: 300,
      renderCell: (params) => <div className='py-4'>{params.value}</div>,
    },
    {
      field: 'status',
      headerName: 'Status',
      valueGetter: (params) => params,
      renderCell: (params) => (
        <div
          className={`${
            params.row.status == '1'
              ? 'bg-lime-300 text-emerald-950'
              : 'text-lime-300 bg-emerald-950'
          } my-2 p-2 rounded flex flex-col justify-center items-center`}
        >
          {params.row.status == '1' ? 'Aktif' : 'Nonaktif'}
        </div>
      ),
    },
    {
      field: 'actions',
      headerName: 'Aksi',
      width: 150,
      renderCell: (params) => (
        <div className='flex flex-row justify-center py-2 items-center space-x-2'>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className='px-2 py-1 bg-emerald-950 text-lime-300 text-sm rounded'
            onClick={() => handleEdit(params.row)}
          >
            <IconPencil stroke={2} />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className='px-2 py-1 bg-emerald-950 text-red-500 text-sm rounded'
            onClick={() => handleNonactive(params.row)}
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

  // add category
  const handleAddCategory = (event) => {
    event.preventDefault();
    const data = {
      category_name: event.target.category_name.value,
      description: event.target.description.value,
      status: event.target.status.value,
    };

    addCategory(data, (res) => {
      if (res.success) {
        // Tampilkan alert sukses
        Swal.fire({
          title: 'Berhasil!',
          text: 'Kategori berhasil ditambahkan!',
          icon: 'success',
        });

        // Perbarui state dan localStorage
        getCategory((data) => {
          localStorage.setItem('category', JSON.stringify(data.data));
          setCategory(
            localStorage.getItem('category')
              ? JSON.parse(localStorage.getItem('category'))
              : data.data
          );
        });

        // Reset form
        event.target.reset();
      } else {
        // Tampilkan alert error
        Swal.fire({
          title: 'Gagal!',
          text: 'Terjadi kesalahan saat menambahkan kategori!',
          icon: 'error',
        });
      }
    });
  };

  // edit category
  const handleEdit = (row) => {
    // Set ke mode edit
    setEditMode(true);
    setEditCategory(row);
  };

  // update category
  const handleUpdateCategory = (event) => {
    event.preventDefault();
    const data = {
      category_name: event.target.category_name.value,
      description: event.target.description.value,
      status: event.target.status.value,
    };

    updateCategory(editCategory.id, data, (res) => {
      if (res.success) {
        // Tampilkan alert sukses
        Swal.fire({
          title: 'Berhasil!',
          text: 'Kategori berhasil diperbarui!',
          icon: 'success',
        });

        // Perbarui state dan localStorage
        getCategory((data) => {
          localStorage.setItem('category', JSON.stringify(data.data));
          setCategory(
            localStorage.getItem('category')
              ? JSON.parse(localStorage.getItem('category'))
              : data.data
          );
        });

        // Reset mode edit
        setEditMode(false);
        setEditCategory({});
        event.target.reset();
      } else {
        // Tampilkan alert error
        Swal.fire({
          title: 'Gagal!',
          text: 'Terjadi kesalahan saat memperbarui kategori!',
          icon: 'error',
        });
      }
    });
  };

  // Nonaktifkan category
  const handleNonactive = (row) => {
    Swal.fire({
      title: 'Apakah Anda yakin?',
      text: 'Data kategori akan Dinonaktifkan!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Ya, Nonaktifkan!',
      cancelButtonText: 'Batal',
    }).then((result) => {
      if (result.isConfirmed) {
        nonactiveCategory(row.id, (res) => {
          if (res.success) {
            // Tampilkan alert sukses
            Swal.fire({
              title: 'Berhasil!',
              text: 'Kategori berhasil Dinonakatifkan!',
              icon: 'success',
            });

            // Perbarui state dan localStorage
            getCategory((data) => {
              localStorage.setItem('category', JSON.stringify(data.data));
              setCategory(
                localStorage.getItem('category')
                  ? JSON.parse(localStorage.getItem('category'))
                  : data.data
              );
            });
          } else {
            // Tampilkan alert error
            Swal.fire({
              title: 'Gagal!',
              text: 'Terjadi kesalahan saat menghapus kategori!',
              icon: 'error',
            });
          }
        });
      }
    });
  };

  return (
    <div className='flex flex-col md:flex-row w-full'>
      <Header />
      <div className='flex flex-col md:pl-64 w-full px-2 py-4 space-y-3'>
        {/* Get Category */}
        <div className='w-full bg-white shadow-sm px-2 py-4 rounded-lg space-y-2'>
          <div className='flex flex-row justify-between'>
            <h1 className='text-xl font-bold uppercase'>Kategori Peralatan</h1>
            <motion.a
              href='/category'
              whileTap={{ scale: 0.9 }}
              whileHover={{ scale: 1.1 }}
              className='flex space-x-1 items-center px-2 py-1 bg-emerald-950 text-lime-300 text-sm rounded'
            >
              <IconRefresh className='hover:rotate-180 transition duration-500' />
              <span>Refresh</span>
            </motion.a>
          </div>
          <div>
            <DataGrid
              rows={category}
              columns={columns}
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
                  paginationModel: { pageSize: 5, page: 0 },
                },
                filter: {
                  filterModel: {
                    items: [],
                    quickFilterExcludeHiddenColumns: false,
                    quickFilterLogicOperator: GridLogicOperator.Or,
                  },
                },
              }}
              pageSizeOptions={[5, 10, 25, { value: -1, label: 'All' }]}
            />
          </div>
        </div>
        {/* Get Category */}

        {/* Add Category */}
        {editMode === false && (
          <div className='w-full h-fit bg-white shadow-sm px-2 py-4 rounded-lg space-y-2'>
            <h1 className='text-xl font-bold uppercase'>Tambah Kategori</h1>
            <form method='POST' onSubmit={(event) => handleAddCategory(event)}>
              <div className='flex flex-col space-y-4'>
                <div className='flex flex-row space-x-2'>
                  <div className='w-full'>
                    <label
                      className='text-sm uppercase'
                      htmlFor='category_name'
                    >
                      Nama Kategori<sup className='text-red-500'>*</sup>
                    </label>
                    <input
                      className='w-full px-1 py-2 border border-gray-300 rounded-md'
                      type='text'
                      name='category_name'
                      id='category_name'
                      placeholder='Masukkan Nama Kategori...'
                      required
                    />
                  </div>
                  <div className='w-full'>
                    <label htmlFor='status'>
                      Status<sup className='text-red-500'>*</sup>
                    </label>
                    <select
                      className='w-full px-1 py-2 border border-gray-300 rounded-md'
                      name='status'
                      id='status'
                    >
                      <option value='1'>Aktif</option>
                      <option value='0'>Nonaktif</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className='text-sm uppercase' htmlFor='description'>
                    Deskripsi Kategori
                  </label>
                  <textarea
                    className='w-full p-1 border border-gray-300 rounded-md'
                    name='description'
                    id='description'
                    rows={4}
                  ></textarea>
                </div>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  whileHover={{ scale: 0.98 }}
                  className='w-full bg-emerald-950 text-white py-2 rounded-md uppercase'
                >
                  Submit
                </motion.button>
              </div>
            </form>
          </div>
        )}
        {/* Add Category */}

        {/* Edit Category */}
        {editMode && (
          <div className='w-full h-fit bg-white shadow-sm px-2 py-4 rounded-lg space-y-2'>
            <h1 className='text-xl font-bold uppercase'>Edit Kategori</h1>
            <form
              method='POST'
              onSubmit={(event) => handleUpdateCategory(event)}
            >
              <div className='flex flex-col space-y-4'>
                <div className='flex flex-row space-x-2'>
                  <div className='w-full'>
                    <label
                      className='text-sm uppercase'
                      htmlFor='category_name'
                    >
                      Nama Kategori<sup className='text-red-500'>*</sup>
                    </label>
                    <input
                      className='w-full px-1 py-2 border border-gray-300 rounded-md'
                      type='text'
                      name='category_name'
                      id='category_name'
                      placeholder='Masukkan Nama Kategori...'
                      value={editCategory.category_name || ''}
                      onChange={(e) =>
                        setEditCategory({
                          ...editCategory,
                          category_name: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                  <div className='w-full'>
                    <label htmlFor='status'>
                      Status<sup className='text-red-500'>*</sup>
                    </label>
                    <select
                      className='w-full px-1 py-2 border border-gray-300 rounded-md'
                      name='status'
                      id='status'
                      value={editCategory.status}
                      onChange={(e) =>
                        setEditCategory({
                          ...editCategory,
                          status: e.target.value,
                        })
                      }
                    >
                      <option value='1'>Aktif</option>
                      <option value='0'>Nonaktif</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className='text-sm uppercase' htmlFor='description'>
                    Deskripsi Kategori
                  </label>
                  <textarea
                    className='w-full p-1 border border-gray-300 rounded-md'
                    name='description'
                    id='description'
                    rows={4}
                    value={editCategory.description || ''}
                    onChange={(e) =>
                      setEditCategory({
                        ...editCategory,
                        description: e.target.value,
                      })
                    }
                  ></textarea>
                </div>
                <div className='flex flex-row space-x-2'>
                  <motion.button
                    whileTap={{ scale: 0.8 }}
                    whileHover={{ scale: 0.98 }}
                    className='w-4/5 bg-lime-400 text-emerald-950 py-2 rounded-md uppercase'
                    type='submit'
                  >
                    Edit
                  </motion.button>
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    whileHover={{ scale: 0.98 }}
                    className='w-1/5 bg-emerald-950 text-lime-300 py-2 rounded-md uppercase'
                    onClick={() => {
                      setEditMode(false);
                      setEditCategory({});
                    }}
                  >
                    batal
                  </motion.button>
                </div>
              </div>
            </form>
          </div>
        )}
        {/* Edit Category */}
      </div>
    </div>
  );
};

export default Category;
