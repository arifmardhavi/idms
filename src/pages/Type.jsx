import { useEffect, useState } from 'react';
import Header from '../components/Header';
import * as motion from 'motion/react-client';
import {
  DataGrid,
  GridToolbarQuickFilter,
  GridLogicOperator,
} from '@mui/x-data-grid';
import { ActiveCategory } from '../services/category.service';
import {
  getType,
  addType,
  updateType,
  nonactiveType,
  deleteType,
} from '../services/type.service';
import { IconPencil } from '@tabler/icons-react';
import { IconCircleMinus } from '@tabler/icons-react';
import Swal from 'sweetalert2';
import { IconRefresh } from '@tabler/icons-react';
import { IconTrash } from '@tabler/icons-react';
import { jwtDecode } from 'jwt-decode';

const Type = () => {
  const [type, setType] = useState([]);
  const [category, setCategory] = useState([]);
  const [editType, setEditType] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false); // Loading state
  const [validation, setValidation] =useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const token = localStorage.getItem('token');
  const userLevel = String(jwtDecode(token).level_user);

  useEffect(() => {
    fetchTypes();
    fetchCategories();
  }, []);

  const fetchTypes = async () => {
    try {
      setLoading(true);
      const data = await getType();
      setType(data.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const data = await ActiveCategory();
      setCategory(data.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // add type
  const handleAddType = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData);

    try {
      await addType(data);
      Swal.fire("Berhasil!", "Tipe berhasil ditambahkan!", "success");
      fetchTypes();
      event.target.reset();
      setValidation([]);
    } catch (error) {
      console.log(error.response.data.errors);
      setValidation(error.response?.data.errors || []);
      Swal.fire("Gagal!", "Terjadi kesalahan saat menambahkan tipe!", "error");
    }
    setIsSubmitting(false);
  };

  // edit type
  const handleEdit = (row) => {
    // Set ke mode edit
    setEditMode(true);
    setEditType(row);
  };

  // update Type
  const handleUpdateType = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData);

    try {
      await updateType(editType.id, data);
      Swal.fire("Berhasil!", "Tipe berhasil diperbarui!", "success");
      fetchTypes();
      setEditMode(false);
      setEditType(null);
      setValidation([]);
    } catch (error) {
      console.log(error.response.data.errors);
    setValidation(error.response?.data.errors || []);
      Swal.fire("Gagal!", "Terjadi kesalahan saat memperbarui tipe!", "error");
    }
  };

  // delete Type
  const handleNonactive = async (type) => {
    const confirm = await Swal.fire({
      title: "Apakah Anda yakin?",
      text: "Data tipe akan dinonaktifkan!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, Nonaktifkan!",
      cancelButtonText: "Batal",
    });

    if (confirm.isConfirmed) {
      try {
        await nonactiveType(type.id);
        Swal.fire("Berhasil!", "Tipe berhasil dinonaktifkan!", "success");
        fetchTypes();
      } catch (error) {
        console.log(error);
        Swal.fire("Gagal!", "Terjadi kesalahan saat menonaktifkan tipe!", "error");
      }
    }
  };

  const handleDelete = async (id) => {
      const confirm = await Swal.fire({
        title: 'Apakah Anda yakin?',
        text: 'Data Tipe akan dihapus secara permanen!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Ya, Hapus!',
        cancelButtonText: 'Batal',
      });
    
      if (confirm.isConfirmed) {
        try {
          await deleteType(id);
          Swal.fire('Berhasil!', 'Tipe berhasil dihapus!', 'success');
          fetchTypes();
        } catch (error) {
          console.error(error);
          Swal.fire('Gagal!', 'Terjadi kesalahan saat menghapus Tipe!', 'error');
        }
      }
    };

  const columns = [
    {
      field: 'type_name',
      headerName: 'Nama Tipe',
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
      field: 'category',
      valueGetter: (params) => params.category_name,
      headerName: 'Kategori',
      width: 300,
      renderCell: (params) => <div className='py-4'>{params.value}</div>,
    },
    {
      field: 'status',
      headerName: 'Status',
      valueGetter: (params) => (params == 1 ? 'Aktif' : 'Nonaktif'),
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
          {params.row.status == 1 ? 
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className='px-2 py-1 bg-emerald-950 text-red-500 text-sm rounded'
              onClick={() => handleNonactive(params.row)}
            >
              <IconCircleMinus stroke={2} />
            </motion.button>
            : ''
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
  return (
    <div className='flex flex-col md:flex-row w-full'>
      <Header />
      <div className='flex flex-col md:pl-64 w-full px-2 py-4 space-y-3'>
        {/* Get Type */}
        <div className='w-full bg-white shadow-sm px-2 py-4 rounded-lg space-y-2'>
          <div className='flex flex-row justify-between'>
            <h1 className='text-xl font-bold uppercase'>Tipe Peralatan</h1>
            <motion.a
              href='/type'
              whileTap={{ scale: 0.9 }}
              whileHover={{ scale: 1.1 }}
              className='flex space-x-1 items-center px-2 py-1 bg-emerald-950 text-lime-300 text-sm rounded'
            >
              <IconRefresh className='hover:rotate-180 transition duration-500' />
              <span>Refresh</span>
            </motion.a>
          </div>
          <div>
          {loading ? <p>Loading...</p> : <DataGrid
              rows={type}
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
            />}
          </div>
        </div>
        {/* Get Type */}

        {/* Add Type */}
        {editMode === false && (
          <div className='w-full h-fit bg-white shadow-sm px-2 py-4 rounded-lg space-y-2'>
            <h1 className='text-xl font-bold uppercase'>Tambah Tipe</h1>
            <form method='POST' onSubmit={(event) => handleAddType(event)}>
              <div className='flex flex-col space-y-4'>
                <div className='w-full'>
                  <label className='text-sm uppercase' htmlFor='type_name'>
                    Nama Tipe<sup className='text-red-500'>*</sup>
                  </label>
                  <input
                    className='w-full px-1 py-2 border border-gray-300 rounded-md'
                    type='text'
                    name='type_name'
                    id='type_name'
                    placeholder='Masukkan Nama Tipe...'
                    required
                  />
                  {validation.type_name && (
                    validation.type_name.map((item, index) => (
                      <div key={index}>
                        <small className="text-red-600 text-sm">{item}</small>
                      </div>
                    ))
                  )}
                </div>
                <div className='flex flex-row space-x-2'>
                  <div className='w-full'>
                    <label className='text-sm uppercase' htmlFor='category'>
                      Kategori<sup className='text-red-500'>*</sup>
                    </label>
                    <select
                      name='category_id'
                      id='category'
                      className='w-full px-1 py-2 border border-gray-300 rounded-md'
                      required
                    >
                      <option value=''>Pilih Kategori</option>
                      {category.length > 0 ? (
                        category.map((category) => (
                          <option key={category.id} value={category.id}>
                            {category.category_name}
                          </option>
                        ))
                      ) : (
                        <option value='' disabled>
                          Tidak ada kategori
                        </option>
                      )}
                    </select>
                    {validation.category_id && (
                      validation.category_id.map((item, index) => (
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
                    Deskripsi Tipe
                  </label>
                  <textarea
                    className='w-full p-1 border border-gray-300 rounded-md'
                    name='description'
                    id='description'
                    rows={4}
                  ></textarea>
                  {validation.description && (
                      validation.description.map((item, index) => (
                        <div key={index}>
                          <small className="text-red-600 text-sm">{item}</small>
                        </div>
                      ))
                    )}
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
        {/* Add Type */}

        {/* Edit Type */}
        {editMode && (
          <div className='w-full h-fit bg-white shadow-sm px-2 py-4 rounded-lg space-y-2'>
            <h1 className='text-xl font-bold uppercase'>Edit Tipe</h1>
            <form method='POST' onSubmit={(event) => handleUpdateType(event)} key={editType.id}>
              <div className='flex flex-col space-y-4'>
                <div className='w-full'>
                  <label className='text-sm uppercase' htmlFor='type_name'>
                    Nama Tipe<sup className='text-red-500'>*</sup>
                  </label>
                  <input
                    className='w-full px-1 py-2 border border-gray-300 rounded-md'
                    type='text'
                    name='type_name'
                    id='type_name'
                    placeholder='Masukkan Nama Tipe...'
                    defaultValue={editType.type_name}
                    required
                  />
                </div>
                <div className='flex flex-row space-x-2'>
                  <div className='w-full'>
                    <label className='text-sm uppercase' htmlFor='category'>
                      Kategori<sup className='text-red-500'>*</sup>
                    </label>
                    <select
                      name='category_id'
                      id='category'
                      className='w-full px-1 py-2 border border-gray-300 rounded-md'
                      required
                      defaultValue={editType.category_id}
                    >
                      <option value=''>Pilih Kategori</option>
                      {category.length > 0 ? (
                        category.map((category) => (
                          <option key={category.id} value={category.id}>
                            {category.category_name}
                          </option>
                        ))
                      ) : (
                        <option value='' disabled>
                          Tidak ada kategori
                        </option>
                      )}
                    </select>
                  </div>
                  <div className='w-full'>
                    <label htmlFor='status'>
                      Status<sup className='text-red-500'>*</sup>
                    </label>
                    <select
                      className='w-full px-1 py-2 border border-gray-300 rounded-md'
                      name='status'
                      id='status'
                      defaultValue={editType.status}
                    >
                      <option value='1'>Aktif</option>
                      <option value='0'>Nonaktif</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className='text-sm uppercase' htmlFor='description'>
                    Deskripsi Tipe
                  </label>
                  <textarea
                    className='w-full p-1 border border-gray-300 rounded-md'
                    name='description'
                    id='description'
                    rows={4}
                    defaultValue={editType.description}
                  ></textarea>
                </div>
                <div className='flex flex-row space-x-2'>
                  <motion.button
                    whileTap={{ scale: 0.8 }}
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
                      setEditType({});
                    }}
                  >
                    batal
                  </motion.button>
                </div>
              </div>
            </form>
          </div>
        )}
        {/* Edit Type */}
      </div>
    </div>
  );
};

export default Type;
