import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import * as motion from 'motion/react-client';
import { DataGrid, GridToolbarQuickFilter } from '@mui/x-data-grid';
import { getType, addType, updateType, deleteType } from '../services/type.service';
import { getUnit } from '../services/unit.service';
import { getCategoryByUnit } from '../services/category.service';
import { IconPencil } from '@tabler/icons-react';
import { IconCircleMinus } from '@tabler/icons-react';
import Swal from 'sweetalert2';
import { IconRefresh } from '@tabler/icons-react';

const Type = () => {
  const [type, setType] = useState([]);
  const [IsUnit, setIsUnit] = useState([]);
  const [editType, setEditType] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState(''); // Untuk menyimpan unit yang dipilih
  const [filteredCategories, setFilteredCategories] = useState([]); // Kategori yang ditampilkan

  useEffect(() => {
    getType((data) => {
      localStorage.setItem('type', JSON.stringify(data.data));
      setType(localStorage.getItem('type') ? JSON.parse(localStorage.getItem('type')) : data.data);
    });
    getUnit((data) => {
      setIsUnit(data.data);
    });
    
  }, []);

  const handleUnitChange = (unitId) => {
    setSelectedUnit(unitId); // Simpan unit yang dipilih
    if (unitId) {
      // Memanggil API untuk mendapatkan kategori berdasarkan unit
      getCategoryByUnit(unitId, (data) => {
        console.log(data);
        if (data === null) {
          setFilteredCategories([]);
        }else{
          setFilteredCategories(data.data);
        }
      });
    } else {
      setFilteredCategories([]); // Kosongkan jika tidak ada unit dipilih
    }
  };

  const columns = [
    { field: 'type_name', headerName: 'Nama Tipe', width: 200, renderCell: (params) => <div className="py-4">{params.value}</div> },
    { field: 'description', headerName: 'Deskripsi', width: 300, renderCell: (params) => <div className="py-4">{params.value}</div> },
    { field: 'category', headerName: 'Kategori', width: 300, renderCell: (params) => <div className="py-4">{params.value.category_name}</div> },
    { 
      field: 'status', 
      headerName: 'Status',
      renderCell: (params) => (
        <div className={`${params.value == '1' ? 'bg-lime-300 text-emerald-950' : 'text-lime-300 bg-emerald-950'} my-2 p-2 rounded flex flex-col justify-center items-center`}>
          {params.value == '1' ? 'Aktif' : 'Nonaktif'}
        </div>
      )
    },
    {
      field: 'actions',
      headerName: 'Aksi',
      width: 150,
      renderCell: (params) => (
        <div className="flex flex-row justify-center py-2 items-center space-x-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="px-2 py-1 bg-emerald-950 text-lime-300 text-sm rounded"
            onClick={() => handleEdit(params.row)}
          >
            <IconPencil stroke={2} />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="px-2 py-1 bg-emerald-950 text-red-500 text-sm rounded"
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
      placeholder="Cari data berdasarkan nama tipe dan deskripsi..."
      className="text-lime-300 px-4 py-4 border outline-none"
    />
  );

  // add type
  const handleAddType = (event) => {
    event.preventDefault();
    const data = {
      type_name: event.target.type_name.value,
      description: event.target.description.value,
      status: event.target.status.value,
      category_id: event.target.category.value,
    };

    addType(data, (res) => {
      if (res.success) {
        // Tampilkan alert sukses
        Swal.fire({
          title: 'Berhasil!',
          text: 'Tipe berhasil ditambahkan!',
          icon: 'success',
        });

        // Perbarui state dan localStorage
        getType((data) => {
          localStorage.setItem('type', JSON.stringify(data.data));
          setType(localStorage.getItem('type') ? JSON.parse(localStorage.getItem('type')) : data.data);
        });

        // Reset form
        setSelectedUnit(null);
        setFilteredCategories([]);
        event.target.reset();
      } else {
        // Tampilkan alert error
        Swal.fire({
          title: 'Gagal!',
          text: 'Terjadi kesalahan saat menambahkan Tipe!',
          icon: 'error',
        });
      }
    });
  };

  // edit type
  const handleEdit = (row) => {
    // Set ke mode edit
    setEditMode(true);
    setEditType(row);
    setSelectedUnit(row.category.unit_id);
    handleUnitChange(row.category.unit_id);
  };

  // update Type
  const handleUpdateType = (event) => {
    event.preventDefault();
    const data = {
      type_name: event.target.type_name.value,
      description: event.target.description.value,
      status: event.target.status.value,
      category_id: event.target.category.value,
    };

    updateType(editType.id, data, (res) => {
      if (res.success) {
        // Tampilkan alert sukses
        Swal.fire({
          title: 'Berhasil!',
          text: 'Tipe berhasil diperbarui!',
          icon: 'success',
        });

        // Perbarui state dan localStorage
        getType((data) => {
          localStorage.setItem('type', JSON.stringify(data.data));
          setType(localStorage.getItem('type') ? JSON.parse(localStorage.getItem('type')) : data.data);
        });

        // Reset mode edit
        setEditMode(false);
        setEditType({});
        setSelectedUnit(null);
        event.target.reset();
      } else {
        // Tampilkan alert error
        Swal.fire({
          title: 'Gagal!',
          text: 'Terjadi kesalahan saat memperbarui tipe!',
          icon: 'error',
        });
      }
    });
  };

  // delete Type
  const handleDelete = (row) => {
    Swal.fire({
      title: 'Apakah Anda yakin?',
      text: 'Data tipe akan dihapus secara permanen!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Ya, hapus!',
      cancelButtonText: 'Batal',
    }).then((result) => {
      if (result.isConfirmed) {
        deleteType(row.id, (res) => {
          if (res.success) {
            // Tampilkan alert sukses
            Swal.fire({
              title: 'Berhasil!',
              text: 'Tipe berhasil dihapus!',
              icon: 'success',
            });

            // Perbarui state dan localStorage
            getType((data) => {
              localStorage.setItem('type', JSON.stringify(data.data));
              setType(localStorage.getItem('type') ? JSON.parse(localStorage.getItem('type')) : data.data);
            });
          } else {
            // Tampilkan alert error
            Swal.fire({
              title: 'Gagal!',
              text: 'Terjadi kesalahan saat menghapus tipe!',
              icon: 'error',
            });
          }
        });
      }
    });
  };
  return (
    <div className="flex flex-col md:flex-row w-full">
        <Header />
        <div className="flex flex-col md:pl-64 w-full px-2 py-4 space-y-3">
          {/* Get Type */}
          <div className="w-full bg-white shadow-sm px-2 py-4 rounded-lg space-y-2">
            <div className="flex flex-row justify-between">
              <h1 className="text-xl font-bold uppercase">Tipe</h1>
              <motion.a
                href='/type'
                whileTap={{ scale: 0.9 }}
                whileHover={{ scale: 1.1 }}
                className="flex space-x-1 items-center px-2 py-1 bg-emerald-950 text-lime-300 text-sm rounded"
              >
                <IconRefresh className='hover:rotate-180 transition duration-500' />
                <span>Refresh</span>
              </motion.a>
            </div>
            <div>
              <DataGrid
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
                }}
                pageSizeOptions={[5, 10, 25, { value: -1, label: 'All' }]}
              />
            </div>
          </div>
          {/* Get Type */}

          {/* Add Type */}
          {editMode === false && (
            <div className="w-full h-fit bg-white shadow-sm px-2 py-4 rounded-lg space-y-2">
              <h1 className="text-xl font-bold uppercase">Tambah Tipe</h1>
              <form method="POST" onSubmit={(event) => handleAddType(event)}>
                <div className="flex flex-col space-y-4">
                  <div className='w-full'>
                    <label className="text-sm uppercase" htmlFor="type_name">
                      Nama Tipe<sup className='text-red-500'>*</sup>
                    </label>
                    <input
                      className="w-full px-1 py-2 border border-gray-300 rounded-md"
                      type="text"
                      name="type_name"
                      id="type_name"
                      placeholder="Masukkan Nama Tipe..."
                      required
                    />
                  </div>
                  <div className='flex flex-row space-x-2'>
                    <div className='w-full'>
                      <label className="text-sm uppercase" htmlFor="unit">
                        Unit<sup className='text-red-500'>*</sup>
                      </label>
                      <select
                        name="unit"
                        id="unit"
                        className="w-full px-1 py-2 border border-gray-300 rounded-md"
                        value={selectedUnit}
                        onChange={(e) => handleUnitChange(e.target.value)} // Panggil fungsi saat unit berubah
                        required
                      >
                        <option value="">Pilih Unit</option>
                        {IsUnit.map((unit) => (
                          <option key={unit.id} value={unit.id}>
                            {unit.unit_name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className='w-full'>
                      <label className="text-sm uppercase" htmlFor="category">
                        Kategori<sup className='text-red-500'>*</sup>
                      </label>
                      <select
                        name="category_id"
                        id="category"
                        className="w-full px-1 py-2 border border-gray-300 rounded-md"
                        required
                      >
                        <option value="">Pilih Kategori</option>
                        {
                          filteredCategories.length > 0 
                            ? filteredCategories.map((category) => (
                                <option key={category.id} value={category.id}>
                                  {category.category_name}
                                </option>
                              ))
                            : <option value="" disabled>Tidak ada kategori</option>
                        }
                      </select>

                    </div>
                  </div>
                  <div className='flex flex-row space-x-2'>
                    <div className='w-full'>
                      <label htmlFor="status">Status<sup className='text-red-500'>*</sup></label>
                      <select
                        className="w-full px-1 py-2 border border-gray-300 rounded-md"
                        name="status"
                        id="status"
                      >
                        <option value="1">Aktif</option>
                        <option value="0">Nonaktif</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm uppercase" htmlFor="description">
                      Deskripsi Tipe
                    </label>
                    <textarea
                      className="w-full p-1 border border-gray-300 rounded-md"
                      name="description"
                      id="description"
                      rows={4}
                    ></textarea>
                  </div>
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    whileHover={{ scale: 0.98 }}
                    className="w-full bg-emerald-950 text-white py-2 rounded-md uppercase"
                  >
                    Submit
                  </motion.button>
                </div>
              </form>
            </div>
          )}
          {/* Add Type */}

          {/* Edit Type */}
          {editMode && (
            <div className="w-full h-fit bg-white shadow-sm px-2 py-4 rounded-lg space-y-2">
              <h1 className="text-xl font-bold uppercase">Edit Tipe</h1>
              <form method="POST" onSubmit={(event) => handleUpdateType(event)}>
                <div className="flex flex-col space-y-4">
                  <div className='w-full'>
                    <label className="text-sm uppercase" htmlFor="type_name">
                      Nama Tipe<sup className='text-red-500'>*</sup>
                    </label>
                    <input
                      className="w-full px-1 py-2 border border-gray-300 rounded-md"
                      type="text"
                      name="type_name"
                      id="type_name"
                      placeholder="Masukkan Nama Tipe..."
                      value={editType.type_name || ''}
                      onChange={(e) => setEditType({ ...editType, type_name: e.target.value })}
                      required
                    />
                  </div>
                  <div className='flex flex-row space-x-2'>
                    <div className='w-full'>
                      <label className="text-sm uppercase" htmlFor="unit">
                        Unit<sup className='text-red-500'>*</sup>
                      </label>
                      <select
                        name="unit"
                        id="unit"
                        className="w-full px-1 py-2 border border-gray-300 rounded-md"
                        value={selectedUnit || ''}
                        onChange={(e) => {
                          handleUnitChange(e.target.value);
                        }}
                        required
                      >
                        <option value="">Pilih Unit</option>
                        {IsUnit.map((unit) => (
                          <option key={unit.id} value={unit.id}>
                            {unit.unit_name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className='w-full'>
                      <label className="text-sm uppercase" htmlFor="category">
                        Kategori<sup className='text-red-500'>*</sup>
                      </label>
                      <select
                        name="category_id"
                        id="category"
                        className="w-full px-1 py-2 border border-gray-300 rounded-md"
                        required
                        value={editType.category_id || ''}
                        onChange={(e) => setEditType({ ...editType, category_id: e.target.value })}
                      >
                        <option value="">Pilih Kategori</option>
                        {
                          filteredCategories.length > 0 
                            ? filteredCategories.map((category) => (
                                <option key={category.id} value={category.id}>
                                  {category.category_name}
                                </option>
                              ))
                            : <option value="" disabled>Tidak ada kategori</option>
                        }
                      </select>

                    </div>
                  </div>
                  <div className='flex flex-row space-x-2'>
                    <div className='w-full'>
                      <label htmlFor="status">Status<sup className='text-red-500'>*</sup></label>
                      <select
                        className="w-full px-1 py-2 border border-gray-300 rounded-md"
                        name="status"
                        id="status"
                        value={editType.status || '0'}
                        onChange={(e) => setEditType({ ...editType, status: e.target.value })}
                      >
                        <option value="1">Aktif</option>
                        <option value="0">Nonaktif</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm uppercase" htmlFor="description">
                      Deskripsi Tipe
                    </label>
                    <textarea
                      className="w-full p-1 border border-gray-300 rounded-md"
                      name="description"
                      id="description"
                      rows={4}
                      value={editType.description || ''}
                      onChange={(e) => setEditType({ ...editType, description: e.target.value })}
                    ></textarea>
                  </div>
                  <div className='flex flex-row space-x-2' >
                    <motion.button
                      whileTap={{ scale: 0.8 }}
                      whileHover={{ scale: 0.98 }}
                      className="w-4/5 bg-lime-400 text-emerald-950 py-2 rounded-md uppercase"
                      type='submit'
                    >
                      Edit
                    </motion.button>
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      whileHover={{ scale: 0.98 }}
                      className="w-1/5 bg-emerald-950 text-lime-300 py-2 rounded-md uppercase"
                      onClick={() => {setSelectedUnit(''); setFilteredCategories([]); setEditMode(false); setEditType({})}}
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
  )
}

export default Type