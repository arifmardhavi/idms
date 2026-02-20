import { useState } from 'react'
import { IconFolder, IconLoader2, IconPencil, IconPlus, IconRefresh, IconTrash } from '@tabler/icons-react'
import { useEffect } from 'react'
import { jwtDecode } from 'jwt-decode'
import { DataGrid, GridLogicOperator, GridToolbarQuickFilter } from '@mui/x-data-grid'
import { addMdrFolder, deleteMdrFolder, getMdrFolderByEngineering, updateMdrFolder } from '../../services/mdr_folder.service'
import { Link, useParams } from 'react-router-dom'
import Swal from 'sweetalert2'
import { Box, Modal } from '@mui/material'

const MdrTable = () => {
  const {id} = useParams();
  const [userLevel, setUserLevel] = useState('');
  const [loading, setLoading] = useState(false);
  const [mdrFolder, setMdrFolder] = useState([]);
  const [openEvent, setOpenEvent] = useState(false);
  const [selectedMdrFolder, setSelectedMdrFolder] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validation, setValidation] = useState({});

  useEffect(() => {
      const token = localStorage.getItem('token');
      let level = '';
      try {
          level = String(jwtDecode(token).level_user);
      } catch (error) {
          console.error('Invalid token:', error);
      }
      setUserLevel(level);
      fetchMdrFolder();
  }, []);

  const fetchMdrFolder = async () => {
      setLoading(true);
      try {
          const data = await getMdrFolderByEngineering(id);
          setMdrFolder(data.data);
      } catch (error) {
          console.error('Error fetching MDR data:', error);
      } finally {
          setLoading(false);
      }
  };

  const handleAddMdrFolder = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
        const formData = new FormData(e.target);
        formData.append('engineering_data_id', id);
        const res = await addMdrFolder(formData);
        if (res.success) {
            Swal.fire("Berhasil!", "MDR Folder berhasil ditambahkan!", "success");
            eventClose();
            fetchMdrFolder();
            setValidation({});
        } else {
            setValidation(res.response?.data.errors || []);
            Swal.fire("Gagal!", "Terjadi kesalahan saat menambahkan MDR Folder!", "error");
        }
    } catch (error) {
        setValidation(error.response?.data.errors || []);
        console.error("Error adding MDR Folder:", error);
        Swal.fire("Gagal!", "Terjadi kesalahan saat menambahkan MDR Folder!", "error");
    } finally {
        setIsSubmitting(false);
    }
  };

  const handleUpdateMdrFolder = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
        const formData = new FormData(e.target);
        const res = await updateMdrFolder(selectedMdrFolder.id, formData);
        if (res.success) {
            Swal.fire("Berhasil!", "MDR Folder berhasil diupdate!", "success");
            eventClose();
            fetchMdrFolder();
            setValidation({});
        } else {
            setValidation(res.response?.data.errors || []);
            Swal.fire("Gagal!", "Terjadi kesalahan saat mengupdate MDR Folder!", "error");
        }
    } catch (error) {
        setValidation(error.response?.data.errors || []);
        console.error("Error updating MDR Folder:", error);
        Swal.fire("Gagal!", "Terjadi kesalahan saat mengupdate MDR Folder!", "error");
    } finally {
        setIsSubmitting(false);
    }
  };

  const handleDeleteMdrFolder = async (row) => {
    const result = await Swal.fire({
      title: "Apakah Anda yakin?",
      text: "Data Folder beserta File didalamnya akan dihapus secara permanen!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
    });

    if (result.isConfirmed) {
        try {
            const res = await deleteMdrFolder(row.id);
            if (res.success) {
                Swal.fire("Berhasil!", "Folder berhasil dihapus!", "success");
                fetchMdrFolder();
            } else {
                Swal.fire("Gagal!", "Terjadi kesalahan saat menghapus Folder!", "error");
            }
        } catch (error) {
            console.error("Error deleting MDR Folder:", error);
            Swal.fire("Gagal!", "Terjadi kesalahan saat MDR Folder!", "error");
        }
    }
  };

  const updateEventOpen = (row) => {
    setSelectedMdrFolder(row);
    setOpenEvent(true);
  }

  const columns = [
    { field: 'folder_name', 
      headerName: 'Nama Folder', 
      width: 250, 
      renderCell: (params) => (
        <div className='flex flex-row justify-start items-center space-x-2'>
          <Link to={`/engineering_data/mdr/${params.row.folder_name}/${params.row.id}`} className='flex flex-row justify-start items-center space-x-2 hover:underline hover:text-lime-400'>
            <IconFolder />
            <span>{params.row.folder_name}</span>
          </Link>
        </div>
      ),
    },
    {
      field: 'action',
      headerName: 'Aksi',
      width: 100,
      renderCell: (params) => (
        <div className='py-2 flex flex-row justify-center items-center'>
          <button
            onClick={() => updateEventOpen(params.row)}
            className='bg-yellow-500 text-sm rounded-full px-2 py-1 hover:scale-110 transition duration-100 mr-2 flex items-center space-x-1'
          >
            <IconPencil />
          </button>
          <button
            onClick={() => handleDeleteMdrFolder(params.row)}
            className='bg-red-500 text-white text-sm rounded-full px-2 py-1 hover:scale-110 transition duration-100 flex items-center space-x-1'
          >
            <IconTrash />
          </button>
        </div>
      ),
    },
  ];

  const eventOpen = () => {
    setSelectedMdrFolder({});
    setOpenEvent(true);
  }
  const eventClose = () => {
    setOpenEvent(false);
    setSelectedMdrFolder({});
  };

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
    <div className='w-full bg-white shadow-sm px-2 py-4 rounded-lg space-y-2'>
      <div className='flex flex-row justify-end items-center space-x-2'>
          <button
              className='flex space-x-1 items-center px-2 py-1 bg-emerald-950 text-lime-300 text-sm rounded hover:scale-110 transition duration-100'
              onClick={fetchMdrFolder}
          >
              <IconRefresh className='hover:rotate-180 transition duration-500' />
              <span>Refresh</span>
          </button>
          { userLevel !== '4' && userLevel !== '5' && <button
              onClick={eventOpen}
              className='flex space-x-1 items-center px-2 py-1 bg-emerald-950 text-lime-300 text-sm rounded  hover:scale-110 transition duration-100'
          >
              <IconPlus className='hover:rotate-180 transition duration-500' />
              <span>Tambah</span>
          </button>}
          
          {/* modal MDR FOLDER */}
          <Modal
            open={openEvent}
            onClose={eventClose} 
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box className="bg-white rounded-2xl shadow-lg p-4 relative top-1/2 left-1/2 w-[90%] md:w-1/3 transform -translate-x-1/2 -translate-y-1/2 ">
              <form onSubmit={(e) => {selectedMdrFolder.id ? handleUpdateMdrFolder(e) : handleAddMdrFolder(e)}} method="POST">
                <h1 className="text-xl uppercase text-gray-900 mb-4">
                  {selectedMdrFolder.id ? "Update" : "Tambah"} MDR Folder
                </h1>
                <div className="flex flex-col space-y-2">
                  <div>
                    <label htmlFor="folder_name">Nama Folder <sup className='text-red-500'>*</sup></label>
                    <input
                      type="text"
                      name="folder_name"
                      id="folder_name"
                      placeholder="Masukkan Nama Folder"
                      className="border border-slate-200 rounded-md p-2 w-full bg-transparent outline-none"
                      defaultValue={selectedMdrFolder ? selectedMdrFolder.folder_name : ''}
                      required
                    />
                    {validation.folder_name && (
                      validation.folder_name.map((item, index) => (
                        <div key={index}>
                          <small className="text-red-600 text-sm">{item}</small>
                        </div>
                      ))
                    )}
                  </div>
                </div>
                <div className="flex flex-row space-x-2 justify-end text-center items-center mt-4">
                  {selectedMdrFolder.id 
                    ? <button type="submit" className={`bg-yellow-400 text-black p-2  rounded-xl flex hover:bg-yellow-500 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}>Update</button> 
                    : <button type="submit" className={`bg-emerald-950 text-lime-300 p-2  rounded-xl flex hover:bg-emerald-900 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}>Simpan</button>
                  }
                  <button type="button" onClick={eventClose} className="bg-slate-700 p-2 cursor-pointer rounded-xl flex text-white hover:bg-slate-600">Batal</button>
                </div>
              </form>
            </Box>
          </Modal>
      
      </div>
      <div>
        {loading ? (
            <div className="flex flex-col items-center justify-center h-20">
                <IconLoader2 stroke={2} className="animate-spin rounded-full h-10 w-10 " />
            </div>
        ) :<DataGrid
          rows={mdrFolder}
          columns={columns}
          slots={{ toolbar: CustomQuickFilter }}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 20 },
            },
            filter: {
                filterModel: {
                    items: [],
                    quickFilterExcludeHiddenColumns: false,
                    quickFilterLogicOperator: GridLogicOperator.And,
                },
            },
          }}
          pageSizeOptions={[20, 50, 100, 200, { value: -1, label: 'All' }]}
          // checkboxSelection
        />}
      </div>
    </div>
  )
}

export default MdrTable