import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import * as motion from 'motion/react-client';
import { DataGrid, GridToolbarQuickFilter } from '@mui/x-data-grid';
import { getUnit, addUnit, updateUnit, deleteUnit } from '../services/unit.service';
import { IconPencil } from '@tabler/icons-react';
import { IconCircleMinus } from '@tabler/icons-react';
import Swal from 'sweetalert2';
import { IconRefresh } from '@tabler/icons-react';

const Unit = () => {
  const [unit, setUnit] = useState([]);
  const [editUnit, setEditUnit] = useState({});
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    getUnit((data) => {
      // console.log(data.data);
      setUnit(data.data);
      localStorage.setItem('unit', JSON.stringify(data.data));
    });
  }, []);

  const columns = [
    { field: 'unit_name', headerName: 'Nama Unit', width: 200, renderCell: (params) => <div className="py-4">{params.value}</div> },
    { field: 'description', headerName: 'Deskripsi', width: 300, renderCell: (params) => <div className="py-4">{params.value}</div> },
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
        placeholder="Cari data berdasarkan nama unit dan deskripsi..."
        className="text-lime-300 px-4 py-4 border outline-none"
      />
  );

  // add unit
const handleAddUnit = (event) => {
  event.preventDefault();
  const data = {
    unit_name: event.target.unit_name.value,
    description: event.target.description.value,
    status: event.target.status.value,
  };

  addUnit(data, (res) => {
    if (res.success) {
      // Tampilkan alert sukses
      Swal.fire({
        title: 'Berhasil!',
        text: 'Unit berhasil ditambahkan!',
        icon: 'success',
      });

      // Perbarui state dan localStorage
      setUnit([...unit, res.data]);
      localStorage.setItem('unit', JSON.stringify([...unit, res.data]));

      // Reset form
      event.target.reset();
    } else {
      // Tampilkan alert error
      Swal.fire({
        title: 'Gagal!',
        text: 'Terjadi kesalahan saat menambahkan unit!',
        icon: 'error',
      });
    }
  });
};

// edit unit
const handleEdit = (row) => {
  // Set ke mode edit
  setEditMode(true);
  setEditUnit(row);
};

// update unit
const handleUpdateUnit = (event) => {
  event.preventDefault();
  const data = {
    unit_name: event.target.unit_name.value,
    description: event.target.description.value,
    status: event.target.status.value,
  };

  updateUnit(editUnit.id, data, (res) => {
    if (res.success) {
      // Tampilkan alert sukses
      Swal.fire({
        title: 'Berhasil!',
        text: 'Unit berhasil diperbarui!',
        icon: 'success',
      });

      // Perbarui state dan localStorage
      setUnit(unit.map((item) => (item.id === editUnit.id ? res.data : item)));
      localStorage.setItem(
        'unit',
        JSON.stringify(unit.map((item) => (item.id === editUnit.id ? res.data : item)))
      );

      // Reset mode edit
      setEditMode(false);
      setEditUnit({});
      event.target.reset();
    } else {
      // Tampilkan alert error
      Swal.fire({
        title: 'Gagal!',
        text: 'Terjadi kesalahan saat memperbarui unit!',
        icon: 'error',
      });
    }
  });
};

// delete unit
const handleDelete = (row) => {
  Swal.fire({
    title: 'Apakah Anda yakin?',
    text: 'Data unit akan dihapus secara permanen!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Ya, hapus!',
    cancelButtonText: 'Batal',
  }).then((result) => {
    if (result.isConfirmed) {
      deleteUnit(row.id, (res) => {
        if (res.success) {
          // Tampilkan alert sukses
          Swal.fire({
            title: 'Berhasil!',
            text: 'Unit berhasil dihapus!',
            icon: 'success',
          });

          // Perbarui state dan localStorage
          setUnit(unit.filter((item) => item.id !== row.id));
          localStorage.setItem(
            'unit',
            JSON.stringify(unit.filter((item) => item.id !== row.id))
          );
        } else {
          // Tampilkan alert error
          Swal.fire({
            title: 'Gagal!',
            text: 'Terjadi kesalahan saat menghapus unit!',
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
        {/* Get Unit */}
        <div className="w-full bg-white shadow-sm px-2 py-4 rounded-lg space-y-2">
          <div className="flex flex-row justify-between">
            <h1 className="text-xl font-bold uppercase">Unit</h1>
            <motion.a
              href='/unit'
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
              rows={unit}
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
        {/* Get Unit */}

        {/* Add Unit */}
        {editMode === false && (
          <div className="w-full h-fit bg-white shadow-sm px-2 py-4 rounded-lg space-y-2">
            <h1 className="text-xl font-bold uppercase">Tambah Unit</h1>
            <form method="POST" onSubmit={(event) => handleAddUnit(event)}>
              <div className="flex flex-col space-y-4">
                <div className='flex flex-row space-x-2'>
                  <div className='w-full'>
                    <label className="text-sm uppercase" htmlFor="unit_name">
                      Nama Unit<sup className='text-red-500'>*</sup>
                    </label>
                    <input
                      className="w-full px-1 py-2 border border-gray-300 rounded-md"
                      type="text"
                      name="unit_name"
                      id="unit_name"
                      placeholder="Masukkan Nama Unit..."
                      required
                    />
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
                    Deskripsi Unit
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
        {/* Add Unit */}

        {/* Edit Unit */}
        {editMode && (
          <div className="w-full h-fit bg-white shadow-sm px-2 py-4 rounded-lg space-y-2">
            <h1 className="text-xl font-bold uppercase">Edit Unit</h1>
            <form method="POST" onSubmit={(event) => handleUpdateUnit(event)}>
              <div className="flex flex-col space-y-4">
                <div className='flex flex-row space-x-2'>
                  <div className='w-full'>
                    <label className="text-sm uppercase" htmlFor="unit_name">
                      Nama Unit<sup className='text-red-500'>*</sup>
                    </label>
                    <input
                      className="w-full px-1 py-2 border border-gray-300 rounded-md"
                      type="text"
                      name="unit_name"
                      id="unit_name"
                      placeholder="Masukkan Nama Unit..." 
                      value={editUnit.unit_name}
                      onChange={(e) => setEditUnit({ ...editUnit, unit_name: e.target.value })}
                      required
                    />
                  </div>
                  <div className='w-full'>
                    <label htmlFor="status">Status<sup className='text-red-500'>*</sup></label>
                    <select
                      className="w-full px-1 py-2 border border-gray-300 rounded-md"
                      name="status"
                      id="status"
                      value={editUnit.status}
                      onChange={(e) => setEditUnit({ ...editUnit, status: e.target.value })}
                    >
                      <option value="1">Aktif</option>
                      <option value="0">Nonaktif</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-sm uppercase" htmlFor="description">
                    Deskripsi Unit
                  </label>
                  <textarea
                    className="w-full p-1 border border-gray-300 rounded-md"
                    name="description"
                    id="description"
                    rows={4}
                    value={editUnit.description}
                    onChange={(e) => setEditUnit({ ...editUnit, description: e.target.value })}
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
                    onClick={() => {setEditMode(false); setEditCategory({})}}
                  >
                    batal
                  </motion.button>

                </div>
              </div>
            </form>
          </div>
        )}
        {/* Edit Unit */}
      </div>
    </div>
  );
};

export default Unit;
