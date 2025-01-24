import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import * as motion from 'motion/react-client';
import { DataGrid, GridToolbarQuickFilter, GridLogicOperator } from '@mui/x-data-grid';
import { getTagnumber, addTagnumber, updateTagnumber, nonactiveTagnumber } from '../services/tagnumber.service';
import { getUnit } from '../services/unit.service';
import { getCategory } from '../services/category.service';
import { getCategoryByUnit } from '../services/category.service';
import { getTypeByCategory } from '../services/type.service';
import { IconPencil } from '@tabler/icons-react';
import { IconCircleMinus } from '@tabler/icons-react';
import Swal from 'sweetalert2';
import { IconRefresh } from '@tabler/icons-react';

const Tagnumber = () => {
  const [tagnumber, setTagnumber] = useState([]);
  const [IsUnit, setIsUnit] = useState([]);
  const [IsCategory, setIsCategory] = useState([]);
  const [editTagnumber, setEditTagnumber] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState(''); // Untuk menyimpan unit yang dipilih
  const [selectedCategory, setSelectedCategory] = useState('');
  const [filteredTypes, setFilteredTypes] = useState([]); // Tipe yang ditampilkan

  useEffect(() => {
    getTagnumber((data) => {
      localStorage.setItem('tagnumber', JSON.stringify(data.data));
      setTagnumber(localStorage.getItem('tagnumber') ? JSON.parse(localStorage.getItem('tagnumber')) : data.data);
    });
    getUnit((data) => {
      setIsUnit(data.data);
    });
    getCategory((data) => {
      setIsCategory(data.data);
    });
  }, []);

  // get tag number
  const columns = [
    { field: 'tag_number', headerName: 'Tag Number', width: 200, renderCell: (params) => <div className="py-4">{params.value}</div> },
    { field: 'unit', valueGetter: (params) => params.unit_name, headerName: 'Unit', width: 130, renderCell: (params) => <div className="py-4">{params.value}</div> },
    { field: 'type', valueGetter: (params) => params.type_name, headerName: 'Tipe', width: 130, renderCell: (params) => <div className="py-4">{params.value}</div> },
    { field: 'description', headerName: 'Deskripsi', width: 300, renderCell: (params) => <div className="py-4">{params.value}</div> },
    {
      field: 'status',
      headerName: 'Status',
      valueGetter: (params) => params == 1 ? 'Aktif' : 'Nonaktif',
      renderCell: (params) => (
        <div className={`${params.row.status == '1' ? 'bg-lime-300 text-emerald-950' : 'text-lime-300 bg-emerald-950'} my-2 p-2 rounded flex flex-col justify-center items-center`}>
          {params.row.status == '1' ? 'Aktif' : 'Nonaktif'}
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
      placeholder="Cari data disini..."
      className="text-lime-300 px-4 py-4 border outline-none"
      quickFilterParser={(searchInput) =>
        searchInput
          .split(',')
          .map((value) => value.trim())
          .filter((value) => value !== '')
      }
    />
  );
  // get tag number 


  // handle onChange input type by category
  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId); // Simpan kategori yang dipilih
    if (categoryId) {
      // Memanggil API untuk mendapatkan tipe berdasarkan kategori
      getTypeByCategory(categoryId, (data) => {
        if (data === null) {
          setFilteredTypes([]);
        }else{
          setFilteredTypes(data.data);
        }
      });
    } else {
      setFilteredTypes([]); // Kosongkan jika tidak ada unit dipilih
    }
  }
  // handle onChange input type by category

  // add tagnumber
  const handleAddTagnumber = (event) => {
    event.preventDefault();
    const data = {
      tag_number: event.target.tag_number.value,
      description: event.target.description.value,
      status: event.target.status.value,
      type_id: event.target.type_id.value,
      unit_id: event.target.unit.value,
    };

    addTagnumber(data, (res) => {
      if (res.success) {
        // Tampilkan alert sukses
        Swal.fire({
          title: 'Berhasil!',
          text: 'Tag Number berhasil ditambahkan!',
          icon: 'success',
        });

        // Perbarui state dan localStorage
        getTagnumber((data) => {
          localStorage.setItem('tagnumber', JSON.stringify(data.data));
          setTagnumber(localStorage.getItem('tagnumber') ? JSON.parse(localStorage.getItem('tagnumber')) : data.data);
        });

        // Reset form
        setFilteredTypes([]);
        setSelectedUnit(null);
        setSelectedCategory(null);
        event.target.reset();
      } else {
        // Tampilkan alert error
        Swal.fire({
          title: 'Gagal!',
          text: 'Terjadi kesalahan saat menambahkan Tag Number!',
          icon: 'error',
        });
      }
    });
  };

  // edit tagnumber
  const handleEdit = (row) => {
    // Set ke mode edit
    setEditMode(true);
    setEditTagnumber(row);
    // mengambil unit id 
    setSelectedUnit(row.unit_id);
    // mengambil category id
    handleCategoryChange(row.type.category_id);
  };

  // update tagnumber
  const handleUpdateTagnumber = (event) => {
    event.preventDefault();
    const data = {
      tag_number: event.target.tag_number.value,
      description: event.target.description.value,
      status: event.target.status.value,
      type_id: event.target.type.value,
      unit_id: event.target.unit.value,
    };

    updateTagnumber(editTagnumber.id, data, (res) => {
      if (res.success) {
        // Tampilkan alert sukses
        Swal.fire({
          title: 'Berhasil!',
          text: 'Tag Number berhasil diperbarui!',
          icon: 'success',
        });

        // Perbarui state dan localStorage
        getTagnumber((data) => {
          localStorage.setItem('tagnumber', JSON.stringify(data.data));
          setTagnumber(localStorage.getItem('tagnumber') ? JSON.parse(localStorage.getItem('tagnumber')) : data.data);
        });

        // Reset mode edit
        setEditMode(false);
        setEditTagnumber({});
        setFilteredTypes([]);
        setSelectedUnit(null);
        setSelectedCategory(null);
        event.target.reset();
      } else {
        // Tampilkan alert error
        Swal.fire({
          title: 'Gagal!',
          text: 'Terjadi kesalahan saat memperbarui tag number!',
          icon: 'error',
        });
      }
    });
  };

  // delete tagnumber
  const handleDelete = (row) => {
    Swal.fire({
      title: 'Apakah Anda yakin?',
      text: 'Data tag number akan dihapus secara permanen!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Ya, hapus!',
      cancelButtonText: 'Batal',
    }).then((result) => {
      if (result.isConfirmed) {
        nonactiveTagnumber(row.id, (res) => {
          if (res.success) {
            // Tampilkan alert sukses
            Swal.fire({
              title: 'Berhasil!',
              text: 'Tag Number berhasil dihapus!',
              icon: 'success',
            });

            // Perbarui state dan localStorage
            getTagnumber((data) => {
              localStorage.setItem('tagnumber', JSON.stringify(data.data));
              setTagnumber(localStorage.getItem('tagnumber') ? JSON.parse(localStorage.getItem('tagnumber')) : data.data);
            });
          } else {
            // Tampilkan alert error
            Swal.fire({
              title: 'Gagal!',
              text: 'Terjadi kesalahan saat menghapus tag number!',
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
          {/* Get Tag Number */}
          <div className="w-full bg-white shadow-sm px-2 py-4 rounded-lg space-y-2">
            <div className="flex flex-row justify-between">
              <h1 className="text-xl font-bold uppercase">Tag Number</h1>
              <motion.a
                href='/tagnumber'
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
                rows={tagnumber}
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
          {/* Get Tag Number */}

          {/* Add Tagnumber */}
          {editMode === false && (
            <div className="w-full h-fit bg-white shadow-sm px-2 py-4 rounded-lg space-y-2">
              <h1 className="text-xl font-bold uppercase">Tambah Tag Number</h1>
              <form method="POST" onSubmit={(event) => handleAddTagnumber(event)}>
                <div className="flex flex-col space-y-4">
                  <div className='w-full'>
                    <label className="text-sm uppercase" htmlFor="tag_number">
                      Tag Number<sup className='text-red-500'>*</sup>
                    </label>
                    <input
                      className="w-full px-1 py-2 border border-gray-300 rounded-md"
                      type="text"
                      name="tag_number"
                      id="tag_number"
                      placeholder="Masukkan Tag Number..."
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
                        onChange={(e) => setSelectedUnit(e.target.value)} // Panggil fungsi saat unit berubah
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
                        value={selectedCategory}
                        onChange={(e) => handleCategoryChange(e.target.value)}
                        required
                      >
                        <option value="">Pilih Kategori</option>
                        {
                          IsCategory.length > 0 
                            ? IsCategory.map((category) => (
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
                      <label className="text-sm uppercase" htmlFor="type">
                        Tipe<sup className='text-red-500'>*</sup>
                      </label>
                      <select
                        name="type_id"
                        id="type"
                        className="w-full px-1 py-2 border border-gray-300 rounded-md"
                        required
                      >
                        <option value="">Pilih Tipe</option>
                        {
                          filteredTypes.length > 0 
                            ? filteredTypes.map((type) => (
                                <option key={type.id} value={type.id}>
                                  {type.type_name}
                                </option>
                              ))
                            : <option value="" disabled>Tidak ada Tipe</option>
                        }
                      </select>
                    </div>
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
                      Deskripsi Tag Number
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
              <h1 className="text-xl font-bold uppercase">Edit Tag Number</h1>
              <form method="POST" onSubmit={(event) => handleUpdateTagnumber(event)}>
                <div className="flex flex-col space-y-4">
                  <div className='w-full'>
                    <label className="text-sm uppercase" htmlFor="type_name">
                      Tag Number<sup className='text-red-500'>*</sup>
                    </label>
                    <input
                      className="w-full px-1 py-2 border border-gray-300 rounded-md"
                      type="text"
                      name="tag_number"
                      id="tag_number"
                      placeholder="Masukkan Tag Number..."
                      value={editTagnumber.tag_number || ''}
                      onChange={(e) => setEditTagnumber({ ...editTagnumber, tag_number: e.target.value })}
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
                        onChange={(e) => {
                          setSelectedUnit(e.target.value);
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
                        value={selectedCategory}
                        onChange={(e) => handleCategoryChange(e.target.value)}
                      >
                        <option value="">Pilih Kategori</option>
                        {
                          IsCategory.length > 0 
                            ? IsCategory.map((category) => (
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
                      <label className="text-sm uppercase" htmlFor="type">
                        Tipe<sup className='text-red-500'>*</sup>
                      </label>
                      <select
                        name="type_id"
                        id="type"
                        className="w-full px-1 py-2 border border-gray-300 rounded-md"
                        value={editTagnumber.type_id || ''}
                        onChange={(e) => setEditTagnumber({ ...editTagnumber, type_id: e.target.value })}
                        required
                      >
                        <option value="">Pilih Tipe</option>
                        {
                          filteredTypes.length > 0 
                            ? filteredTypes.map((type) => (
                                <option key={type.id} value={type.id}>
                                  {type.type_name}
                                </option>
                              ))
                            : <option value="" disabled>Tidak ada Tipe</option>
                        }
                      </select>
                    </div>
                    <div className='w-full'>
                      <label htmlFor="status">Status<sup className='text-red-500'>*</sup></label>
                      <select
                        className="w-full px-1 py-2 border border-gray-300 rounded-md"
                        name="status"
                        id="status"
                        value={editTagnumber.status || '0'}
                        onChange={(e) => setEditTagnumber({ ...editTagnumber, status: e.target.value })}
                      >
                        <option value="1">Aktif</option>
                        <option value="0">Nonaktif</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm uppercase" htmlFor="description">
                      Deskripsi Tag Number
                    </label>
                    <textarea
                      className="w-full p-1 border border-gray-300 rounded-md"
                      name="description"
                      id="description"
                      rows={4}
                      value={editTagnumber.description || ''}
                      onChange={(e) => setEditTagnumber({ ...editTagnumber, description: e.target.value })}
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
                      onClick={() => {setSelectedUnit(''); setEditMode(false); setEditType({})}}
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

export default Tagnumber