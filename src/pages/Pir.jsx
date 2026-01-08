import { IconArticle, IconCloudDownload, IconPencil, IconPlus, IconRefresh, IconTrash } from "@tabler/icons-react"
import Header from "../components/Header"
import { useState } from "react"
import { DataGrid, GridToolbarQuickFilter } from "@mui/x-data-grid"
import { Box, Modal, Tooltip } from "@mui/material"
import { addPir, deletePir, getPir, updatePir } from "../services/pir.service"
import { useEffect } from "react"
import Swal from "sweetalert2"
import { Link } from "react-router-dom"
import { handleAddActivity } from "../utils/handleAddActivity"
import * as motion from 'motion/react-client';
import { api_public } from "../services/config"

const Pir = () => {
  const [hide, setHide] = useState(false);
  const [Pir, setPir] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [SelectedEditData, setSelectedEditData] = useState({});
  const [validation, setValidation] = useState([]);
  const base_public_url = api_public;

  useEffect(() => {
    fetchPir();
  }, []);

  const fetchPir = async () => {
    try {
      setLoading(true);
      const data = await getPir();
      setPir(data.data);
      console.log("PIR Data:", data.data);
    } catch (error) {
      console.error("Error fetching PIR data:", error);
    } finally {
      setLoading(false);
    }
  }

  const handleClose = () => {
    setOpen(false);
    setOpenEdit(false);
    setIsSubmitting(false);
    setSelectedEditData({});
  }

  const handleAddPir = async (e) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      const formData = new FormData(e.target);
      const data = await addPir(formData);
      console.log("Added PIR:", data);
      handleClose();
      fetchPir();
      Swal.fire({
        title: 'Berhasil!',
        text: 'PIR berhasil ditambahkan!',
        icon: 'success',
        showConfirmButton: true,
        timer: 1500
      });
    } catch (error) {
      console.error("Error adding PIR:", error);
      setValidation(error.response?.data.errors || []);
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleUpdatePir = async (e) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      const formData = new FormData(e.target);
      const data = await updatePir(SelectedEditData.id, formData);
      console.log("Updated PIR:", data);
      handleClose();
      fetchPir();
      Swal.fire({
        title: 'Berhasil!',
        text: 'PIR berhasil diupdate!',
        icon: 'success',
        showConfirmButton: true,
        timer: 1500
      });
    } catch (error) {
      console.error("Error updating PIR:", error);
      setValidation(error.response?.data.errors || []);
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleClickEdit = (row) => {
    setSelectedEditData(row);
    setOpenEdit(true);
  }

  const handleDelete = async (row) => {
      const result = await Swal.fire({
          title: "Apakah Anda yakin?",
          text: "Data PIR akan dihapus secara permanen!",
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Ya, hapus!",
          cancelButtonText: "Batal",
      });

      if (result.isConfirmed) {
          try {
              const res = await deletePir(row.id);
              if (res.success) {
                  Swal.fire("Berhasil!", "PIR berhasil dihapus!", "success");
                  fetchPir();
              } else {
                  Swal.fire("Gagal!", "Terjadi kesalahan saat menghapus PIR!", "error");
              }
          } catch (error) {
              console.error("Error deleting PIR:", error);
              Swal.fire("Gagal!", "Terjadi kesalahan saat menghapus PIR!", "error");
          }
      }
  };

  const columns = [
    { field: 'judul', headerName: 'Judul', width: 300 },
    {
      field: 'tanggal_pir',
      headerName: 'Tanggal PIR',
      width: 150,
      renderCell: (params) => (
        <div className=''>
          {new Intl.DateTimeFormat('id-ID', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
          }).format(new Date(params.value))}
        </div>
      ),
    },    
    { field: 'pir_file', headerName: 'File', width: 100, renderCell: (params) => (
      <div className='flex py-2 pl-5 '>
        {params.row.pir_file ? (
          <Tooltip title={`${params.row.pir_file}`} placement='bottom'>
            <Link
              to={`${base_public_url}pir/${params.value}`}
              target='_blank'
              className='text-lime-400 px-2 rounded-md hover:underline cursor-pointer'
              onClick={() => handleAddActivity(params.row.pir_file, "PIR") }
            >
              <IconCloudDownload />
            </Link>
          </Tooltip>
        ) : '-'}
      </div>
    )},
    {field: 'actions',
      headerName: 'Aksi',
      width: 150,
      renderCell: (params) => (
        <div className="flex flex-row justify-center py-2 items-center space-x-2">
          <Tooltip title="Edit" placement="left">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="px-2 py-1 bg-emerald-950 text-lime-300 text-sm rounded"
            onClick={() => {handleClickEdit(params.row);}}
          >
            <IconPencil stroke={2} />
          </motion.button>
          </Tooltip>
          <Tooltip title="Delete" placement="right">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="px-2 py-1 bg-emerald-950 text-red-500 text-sm rounded"
            onClick={() => handleDelete(params.row)}
          >
            <IconTrash stroke={2} />
          </motion.button>
          </Tooltip>
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
    <div className="flex flex-col md:flex-row w-full">
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
          <div className="flex flex-col space-y-4">
            <div className="flex flex-row justify-between space-x-4">
              <h1 className="text-xl font-bold p-2 uppercase">PIR</h1>
              <div className="flex justify-end gap-2 items-center">
                <button className="bg-emerald-950 text-lime-300 p-2 cursor-pointer rounded-xl flex gap-1 hover:bg-emerald-900" onClick={() => setOpen(true)}> <IconPlus className="hover:rotate-90 duration-300" /> Tambah</button>
                <button
                  // onClick={fetchInternalInspection}
                  className="bg-emerald-950 text-lime-300 p-2 cursor-pointer rounded-xl flex gap-1 hover:bg-emerald-900"
                >
                <IconRefresh className="hover:rotate-90 duration-300" /> Refresh
                </button>
              </div>
            </div>
            <div>
              { loading ? <p>Loading...</p> : <DataGrid
                rows={Pir}
                columns={columns}
                slots={{ toolbar: CustomQuickFilter }}
                initialState={{
                  pagination: {
                    paginationModel: { page: 0, pageSize: 20 },
                  },
                }}
                pageSizeOptions={[20, 50, 100, 200, { value: -1, label: 'All' }]}
                // checkboxSelection
              />}
            </div>
      
            {/* MODALS */}
            {/* add modal */}
            <Modal
              open={open}
              onClose={handleClose} 
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box className="bg-white rounded-2xl shadow-lg p-4 relative top-1/2 left-1/2 w-[90%] md:w-1/3 transform -translate-x-1/2 -translate-y-1/2 ">
                <form onSubmit={(e) => handleAddPir(e)} method="POST" className="space-y-4">
                  <h1 className="text-xl uppercase text-gray-900 mb-4">
                    Tambah PIR
                  </h1>
                  <div className="space-y-3">
                    <div>
                      <label htmlFor="judul">Judul<sup className='text-red-500'>*</sup> </label>
                      <input type="text" name="judul" className="border rounded-md p-2 w-full" placeholder="Masukkan Judul" required />
                    </div>
                    <div>
                      <label htmlFor="tanggal_pir">Tanggal PIR<sup className='text-red-500'>*</sup></label>
                      <input type="date" name="tanggal_pir" className="border rounded-md p-2 w-full" required />
                    </div>
                    <div>
                      <label htmlFor="pir_file">PIR File<sup className='text-red-500'>*</sup></label>
                      <input type="file" name="pir_file" className="border rounded-md p-2 w-full" required />
                    </div>
                  </div>
                  <div className="flex flex-row space-x-2 justify-end text-center items-center">
                    <button type="submit" className={`bg-emerald-950 text-lime-300 p-2  rounded-xl flex hover:bg-emerald-900 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}>Simpan</button>
                    <button type="button" onClick={handleClose} className="bg-slate-700 p-2 cursor-pointer rounded-xl flex text-white hover:bg-slate-600">Batal</button>
                  </div>
                </form>
              </Box>
            </Modal>
            {/* Edit modal */}
            <Modal
              open={openEdit}
              onClose={handleClose} 
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box className="bg-white rounded-2xl shadow-lg p-4 relative top-1/2 left-1/2 w-[90%] md:w-1/3 transform -translate-x-1/2 -translate-y-1/2 ">
                <form onSubmit={(e) => handleUpdatePir(e)} method="POST" className="space-y-4">
                  <h1 className="text-xl uppercase text-gray-900 mb-4">
                    Update PIR
                  </h1>
                  <div className="space-y-3">
                    <div>
                      <label htmlFor="judul">Judul<sup className='text-red-500'>*</sup> </label>
                      <input type="text" name="judul" className="border rounded-md p-2 w-full" placeholder="Masukkan Judul" defaultValue={SelectedEditData.judul} required />
                      {validation.judul && (
                        validation.judul.map((item, index) => (
                          <div key={index}>
                            <small className="text-red-600 text-sm">{item}</small>
                          </div>
                        ))
                      )}
                    </div>
                    <div>
                      <label htmlFor="tanggal_pir">Tanggal PIR<sup className='text-red-500'>*</sup></label>
                      <input type="date" name="tanggal_pir" defaultValue={SelectedEditData.tanggal_pir} className="border rounded-md p-2 w-full" required />
                      {validation.tanggal_pir && (
                        validation.tanggal_pir.map((item, index) => (
                          <div key={index}>
                            <small className="text-red-600 text-sm">{item}</small>
                          </div>
                        ))
                      )}
                    </div>
                    <div>
                      <label htmlFor="pir_file">File PIR <sup className='text-red-500'>*</sup></label>
                      <input
                        type="file"
                        name="pir_file"
                        id="pir_file"
                        className="border border-slate-200 rounded-md p-2 w-full bg-transparent outline-none"
                        // required
                        accept=".pdf"
                      />
                      {validation.pir_file && (
                        validation.pir_file.map((item, index) => (
                          <div key={index}>
                            <small className="text-red-600 text-sm">{item}</small>
                          </div>
                        ))
                      )}
                      {SelectedEditData && SelectedEditData.pir_file && <div className="m-2 bg-lime-300 text-emerald-950 p-1">
                        <Link 
                          to={`${base_public_url}pir/${SelectedEditData.pir_file}`} 
                          target='_blank'
                          className="hover:underline" 
                          onClick={() => handleAddActivity(SelectedEditData.pir_file, "PIR")}
                        >
                          {SelectedEditData.pir_file}
                        </Link>
                      </div>
                      }
                    </div>
                  </div>
                  <div className="flex flex-row space-x-2 justify-end text-center items-center">
                    <button type="submit" className={`bg-emerald-950 text-lime-300 p-2  rounded-xl flex hover:bg-emerald-900 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}>Simpan</button>
                    <button type="button" onClick={handleClose} className="bg-slate-700 p-2 cursor-pointer rounded-xl flex text-white hover:bg-slate-600">Batal</button>
                  </div>
                </form>
              </Box>
            </Modal>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Pir