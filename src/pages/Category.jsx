import { useEffect, useState } from 'react';
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
  deleteCategory,
} from '../services/category.service';
import { IconArticle, IconPencil } from '@tabler/icons-react';
import { IconCircleMinus } from '@tabler/icons-react';
import Swal from 'sweetalert2';
import { IconRefresh } from '@tabler/icons-react';
import { IconTrash } from '@tabler/icons-react';
import { jwtDecode } from 'jwt-decode';
import { IconLoader2 } from '@tabler/icons-react';

const Category = () => {
  const [category, setCategory] = useState([]);
  const [editCategory, setEditCategory] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false); // Loading state
  const [validation, setValidation] =useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const token = localStorage.getItem('token');
  const userLevel = String(jwtDecode(token).level_user);
  const [hide, setHide] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);
  const fetchCategories = async () => {
    try {
      setLoading(true);
      const data = await getCategory();
      setCategory(data.data);
    }catch (err){
      console.log(err);

    }finally {
      setLoading(false);
    }
  };

  // add category
  const handleAddCategory = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData);
    try {
      await addCategory(data);
      Swal.fire('Berhasil!', 'Kategori berhasil ditambahkan!', 'success');
      fetchCategories();
      event.target.reset();
    } catch (error) {
      setValidation(error.response.data);
      Swal.fire('Gagal!', 'Terjadi kesalahan saat menambahkan kategori!', 'error');
    }
    setIsSubmitting(false);
  };

  // edit category
  const handleEdit = (row) => {
    // Set ke mode edit
    setEditMode(true);
    setEditCategory(row);
  };

  // update category
  const handleUpdateCategory = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData);

    try {
      await updateCategory(editCategory.id, data);
      Swal.fire('Berhasil!', 'Kategori berhasil diperbarui!', 'success');
      fetchCategories();
      setEditMode(false);
      setEditCategory(null);
      setValidation([]);
    } catch (error) {
      console.log(error.response.data.errors);
      setValidation(error.response?.data.errors || []);
      Swal.fire('Gagal!', 'Terjadi kesalahan saat memperbarui kategori!', 'error');
    }
  };
  // Nonaktifkan category
  const handleNonactive = async (category) => {
    const confirm = await Swal.fire({
      title: 'Apakah Anda yakin?',
      text: 'Data kategori akan dinonaktifkan!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Ya, Nonaktifkan!',
      cancelButtonText: 'Batal',
    });

    if (confirm.isConfirmed) {
      try {
        await nonactiveCategory(category.id);
        Swal.fire('Berhasil!', 'Kategori berhasil dinonaktifkan!', 'success');
        fetchCategories();
      } catch (error) {
        console.log(error);
        Swal.fire('Gagal!', 'Terjadi kesalahan saat menonaktifkan kategori!', 'error');
      }
    }
  };

  
  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: 'Apakah Anda yakin?',
      text: 'Data Kategori akan dihapus secara permanen!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Ya, Hapus!',
      cancelButtonText: 'Batal',
    });
  
    if (confirm.isConfirmed) {
      try {
        await deleteCategory(id);
        Swal.fire('Berhasil!', 'Kategori berhasil dihapus!', 'success');
        fetchCategories();
      } catch (error) {
        console.error(error);
        Swal.fire('Gagal!', 'Terjadi kesalahan saat menghapus Kategori!', 'error');
      }
    }
  };

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
          {params.row.status == 1 && 
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className='px-2 py-1 bg-emerald-950 text-red-500 text-sm rounded'
            onClick={() => handleNonactive(params.row)}
          >
            <IconCircleMinus stroke={2} />
          </motion.button>
          }
          {userLevel == 99 && 
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className='px-2 py-1 bg-emerald-950 text-red-500 text-sm rounded'
              onClick={() => handleDelete(params.row.id)}
            >
              <IconTrash stroke={2} />
            </motion.button>
          }
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
          {loading ? 
              <div className="flex flex-col items-center justify-center h-20">
                  <IconLoader2 stroke={2} className="animate-spin rounded-full h-10 w-10 " />
              </div> 
            : <DataGrid
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
                    quickFilterLogicOperator: GridLogicOperator.And,
                  },
                },
              }}
              pageSizeOptions={[5, 10, 25, { value: -1, label: 'All' }]}
            /> }
          </div>
        </div>
        {/* Get Category */}

        {/* Add Category */}
        {editMode === false && (
          <div className='w-full h-fit bg-white shadow-sm px-2 py-4 rounded-lg space-y-2'>
            <h1 className='text-xl font-bold uppercase'>Tambah Kategori</h1>
            <form method='POST' onSubmit={(event) => handleAddCategory(event)} >
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
                    {validation.category_name && (
                      validation.category_name.map((item, index) => (
                        <div key={index}>
                          <small className="text-red-600 text-sm">{item}</small>
                        </div>
                      ))
                    )}
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
                    {validation.status && (
                      validation.status.map((item, index) => (
                        <div key={index}>
                          <small className="text-red-600 text-sm">{item}</small>
                        </div>
                      ))
                    )}
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
                  className={`w-full bg-emerald-950 text-white py-2 rounded-md uppercase ${
                    isSubmitting
                      ? 'bg-gray-500 cursor-not-allowed'
                      : 'bg-emerald-950 text-white'
                  }`}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Processing...' : 'Save'}
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
              key={editCategory.id}
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
                      defaultValue={editCategory.category_name}
                      required
                    />
                    {validation.category_name && (
                      validation.category_name.map((item, index) => (
                        <div key={index}>
                          <small className="text-red-600 text-sm">{item}</small>
                        </div>
                      ))
                    )}
                  </div>
                  <div className='w-full'>
                    <label htmlFor='status'>
                      Status<sup className='text-red-500'>*</sup>
                    </label>
                    <select
                      className='w-full px-1 py-2 border border-gray-300 rounded-md'
                      name='status'
                      id='status'
                      defaultValue={editCategory.status}
                    >
                      <option value='1'>Aktif</option>
                      <option value='0'>Nonaktif</option>
                    </select>
                    {validation.status && (
                      validation.status.map((item, index) => (
                        <div key={index}>
                          <small className="text-red-600 text-sm">{item}</small>
                        </div>
                      ))
                    )}
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
                    defaultValue={editCategory.description}
                  ></textarea>
                </div>
                <div className='flex flex-row space-x-2'>
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    whileHover={{ scale: 0.98 }}
                    type='submit'
                    className={`w-4/5 bg-lime-400 text-emerald-950 py-2 rounded-md uppercase ${
                      isSubmitting
                        ? 'bg-gray-500 cursor-not-allowed'
                        : 'bg-emerald-950 text-white'
                    }`}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Processing...' : 'Update'}
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
