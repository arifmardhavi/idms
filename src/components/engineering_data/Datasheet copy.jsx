import { Breadcrumbs, Modal, Typography } from "@mui/material"
import Header from "../Header"
import { IconChevronRight } from "@tabler/icons-react"
import { Link, useParams } from "react-router-dom"
import { IconPlus } from "@tabler/icons-react"
import { DataGrid, GridLogicOperator, GridToolbarQuickFilter } from "@mui/x-data-grid"
import { IconCircleMinus } from "@tabler/icons-react"
import Swal from "sweetalert2"
import { useState } from "react"
import { api_public } from '../../services/config';
import * as motion from 'motion/react-client';
import { addDatasheet, deleteDatasheet, getDatasheetByEngineering, updateDatasheet } from "../../services/datasheet.service"
import { useEffect } from "react"
import { IconRefresh } from "@tabler/icons-react"
import { IconLoader2 } from "@tabler/icons-react"
import { IconArrowLeft } from "@tabler/icons-react"
import { IconArrowRight } from "@tabler/icons-react"
import { IconPencil } from "@tabler/icons-react"

const Datasheet = () => {
  const { id } = useParams();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [Datasheet, setDatasheet] = useState([]);
  const base_public_url = api_public;
  const [hide, setHide] = useState(false);
  const [editDatasheet, setEditDatasheet] = useState(null);
  const [openEdit, setOpenEdit] = useState(false);
  const [validation, setValidation] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    fetchDatasheet();
  }, [id]);


  const fetchDatasheet = async () => {
    try {
      setLoading(true);
      const data = await getDatasheetByEngineering(id);
      setDatasheet(data.data);
    } catch (error) {
      console.error("Error fetching Datasheet:", error);
    } finally {
      setLoading(false);
    }
  }

  const fetchDatasheetById = async (row) => {
      try {
          setEditDatasheet(row);
          setOpenEdit(true);
      } catch (error) {
          console.error("Error fetching Datasheet:", error);
      } finally {
          setLoading(false);
      }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidation([]);
    setIsSubmitting(true);
    try {
      const formData = new FormData(e.target);
      formData.append('engineering_data_id', id);
      const fileInput = e.target.elements.datasheet_file;
      const file = fileInput.files[0];

      // Cek apakah file ada dan ukurannya lebih dari 200MB
      if (file && file.size > 200 * 1024 * 1024) {
        setValidation({ datasheet_file: ["ukuran file anda " + Math.ceil(file.size / 1024 / 1024) + "MB, file harus kurang dari 200MB"] });
        setIsSubmitting(false);
        return;
      }
      const res = await addDatasheet(formData, (progressEvent) => {
        const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        setUploadProgress(percent);
      });
      if (res.success) {
        Swal.fire("Berhasil!", "Datasheet file berhasil tambahkan!", "success");
        fetchDatasheet();
        setOpen(false);
      } else {
        console.log(res.response.data.errors);
        setValidation(res.response?.data.errors || []);
      }
    } catch (error) {
      console.error("Error adding Datasheet:", error);
      setValidation(error.response?.data.errors || []);
    } finally {
      setIsSubmitting(false);
    }
  }
  const handleSubmitEdit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const formData = new FormData(e.target);
      formData.append('engineering_data_id', id);
      console.log(formData);
      const res = await updateDatasheet(editDatasheet.id, formData);
      if (res.success) {
        Swal.fire("Berhasil!", "Datasheet berhasil diupdate!", "success");
        fetchDatasheet();
      } else {
        setValidation(res.response?.data.errors || []);
        // Swal.fire("Error!", "something went wrong " . error.response?.data.errors.datasheet_file, "error");
        console.log(res.response.data.errors);
      }
    } catch (error) {
      setValidation(error.response?.data.errors || []);
      // Swal.fire("Error!", "something went wrong " . error.response?.data.errors.datasheet_file, "error");
      console.error("Error updating Datasheet:", error);
    } finally {
      setOpenEdit(false);
      setIsSubmitting(false);
    }
  }
  
  const handleDelete = async (row) => {
    const result = await Swal.fire({
      title: "Apakah Anda yakin?",
      text: "File Datasheet akan dihapus secara permanen!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
    });

    if (result.isConfirmed) {
      try {
        const res = await deleteDatasheet(row.id);
        if (res.success) {
          Swal.fire("Berhasil!", "Datasheet berhasil dihapus!", "success");
          fetchDatasheet();
        } else {
          Swal.fire("Gagal!", "Terjadi kesalahan saat menghapus Datasheet!", "error");
        }
      } catch (error) {
        console.log(error);
        Swal.fire("Gagal!", "Terjadi kesalahan saat menghapus Datasheet!", "error");
      }
    }
  };

  const columns = [
    { field: 'datasheet_file', headerName: 'Datasheet', width:400, renderCell: (params) => <div className="py-4">
      <Link
        to={`${base_public_url}engineering_data/datasheet/${params.value}`}
        target='_blank'
        className='text-lime-500 underline'
      >
        {params.value}
      </Link>
    </div> },
    {
      field: 'date_datasheet',
      headerName: 'Tanggal Terbit',
      width: 130,
      renderCell: (params) => (
        <div className='py-4'>
          {params.value ? new Intl.DateTimeFormat('id-ID', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
          }).format(new Date(params.value)) : '-'}
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
            onClick={() => fetchDatasheetById(params.row)}
          >
            <IconPencil stroke={2} />
          </motion.button>
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
  ]

  const handleClose = () => {
      setOpen(false);
  };
  const handleCloseEdit = () => {
      setOpenEdit(false);
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
    <div className='flex flex-col md:flex-row w-full'>
      { !hide && <Header />}
      <div className={`flex flex-col ${hide ? '' : 'md:pl-64'} w-full px-2 py-4 space-y-3`}>
        <div className='md:flex hidden'>
          <div className={`${hide ? 'hidden' : 'block'} w-fit bg-emerald-950 text-lime-300 p-2 cursor-pointer rounded-md`} onClick={() => setHide(true)}>
            <IconArrowLeft />
          </div>
        </div>
        <div className={` ${hide ? 'block' : 'hidden'}  w-fit bg-emerald-950 text-lime-300 p-2 cursor-pointer rounded-md`} onClick={() => setHide(false)}>
          <IconArrowRight />
        </div>
        {/* get Datasheet  */}
        <div className='w-full bg-white shadow-sm px-2 py-4 rounded-lg space-y-2'>
          <Breadcrumbs
            aria-label='breadcrumb'
            separator={
              <IconChevronRight className='text-emerald-950' stroke={2} />
            }
          >
            <Link className='hover:underline text-emerald-950' to='/'>
              Home
            </Link>
            <Link className='hover:underline text-emerald-950' to='/engineering_data'>
              Engineering Data
            </Link>
            <Typography className='text-lime-500'>Datasheet </Typography>
          </Breadcrumbs>
          {/* <p className='text-emerald-950 text-md font-semibold uppercase w-full text-center'>{lampiran[0].historical_memorandum.perihal}</p> */}
          <div>
            <div className="flex flex-row justify-end py-2">
              <div className='flex flex-row justify-end items-center space-x-2'>
                  <button
                      className='flex space-x-1 items-center px-2 py-1 bg-emerald-950 text-lime-300 text-sm rounded hover:scale-110 transition duration-100'
                      onClick={fetchDatasheet}
                  >
                      <IconRefresh className='hover:rotate-180 transition duration-500' />
                      <span>Refresh</span>
                  </button>
                  <button
                      onClick={() => setOpen(true)}
                      className='flex space-x-1 items-center px-2 py-1 bg-emerald-950 text-lime-300 text-sm rounded  hover:scale-110 transition duration-100'
                  >
                      <IconPlus className='hover:rotate-180 transition duration-500' />
                      <span>Tambah</span>
                  </button>
              </div>
              <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
              >
                <div
                  style={{
                    position: 'absolute',
                    top: '30%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    background: 'white',
                    padding: '20px',
                    borderRadius: '8px',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
                    minWidth: '330px',
                  }}
                >
                  <h2 id="modal-modal-title" className="text-emerald-950 font-bold uppercase text-center">Tambah Lampiran</h2>
                  <form method="post" encType="multipart/form-data" onSubmit={handleSubmit}>
                    <div className="m-2">
                      <div className="text-emerald-950">
                        Upload Datasheet
                      </div>
                      <input
                        type="file"
                        id="datasheet_file"
                        name="datasheet_file"
                        className="w-full p-2 rounded border"
                      />
                      {validation.datasheet_file && validation.datasheet_file.map((item, index) => (
                        <div key={index} className="text-red-600 text-sm">
                          {item}
                        </div>
                      ))}
                    </div>
                    <div className="m-2">
                      <div className="text-emerald-950">
                        Tanggal Terbit
                      </div>
                      <input
                        type="date"
                        id="date_datasheet"
                        name="date_datasheet"
                        className="w-full p-2 rounded border"
                      />
                      {validation.date_datasheet && validation.date_datasheet.map((item, index) => (
                        <div key={index} className="text-red-600 text-sm">
                          {item}
                        </div>
                      ))}
                    </div>
                    {isSubmitting && (
                      <div className="w-full mt-2">
                        <div className="text-center text-sm text-emerald-950 font-medium">
                          Uploading... {uploadProgress}%
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
                          <div
                            className="bg-emerald-950 h-2.5 rounded-full transition-all duration-200"
                            style={{ width: `${uploadProgress}%` }}
                          ></div>
                        </div>
                      </div>
                    )}

                    <div className="flex flex-row justify-center items-center">
                      <button
                        type="submit"
                        className={`px-4 py-2 text-sm rounded hover:scale-110 transition duration-100 ${
                        isSubmitting
                          ? 'bg-gray-500 cursor-not-allowed'
                          : 'bg-emerald-950 text-lime-300'
                      }`}
                      disabled={isSubmitting} // Disable tombol jika sedang submit
                    >
                      {isSubmitting ? 'Processing...' : 'Save'}
                      </button>
                    </div>
                  </form>
                </div>
              </Modal>

              {/* start modal edit datasheet */}
              <Modal
                open={openEdit}
                onClose={handleCloseEdit}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
              >
                <div
                  style={{
                    position: 'absolute',
                    top: '30%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    background: 'white',
                    padding: '20px',
                    borderRadius: '8px',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
                    minWidth: '330px',
                  }}
                >
                  <h2 id="modal-modal-title" className="text-emerald-950 font-bold uppercase text-center">Edit Datasheet</h2>
                  {editDatasheet && <form method="post" encType="multipart/form-data" onSubmit={handleSubmitEdit}>
                    <div className="m-2">
                      <div className="text-emerald-950">
                        Upload Datasheet
                      </div>
                      <input
                        type="file"
                        id="datasheet_file"
                        name="datasheet_file"
                        className="w-full p-2 rounded border"
                      />
                      {validation.datasheet_file && validation.datasheet_file.map((item, index) => (
                        <div key={index} className="text-red-600 text-sm">
                          {item}
                        </div>
                      ))}
                    </div>
                    {editDatasheet && editDatasheet && editDatasheet.datasheet_file && <div className="m-2 bg-lime-300 text-emerald-950 p-1">
                      <Link 
                        to={`${base_public_url}engineering_data/datasheet/${editDatasheet.datasheet_file}`} 
                        target='_blank'
                        className="hover:underline" 
                      >
                        {editDatasheet.datasheet_file}
                      </Link>
                    </div>}
                    <div className="m-2">
                      <div className="text-emerald-950">
                        Tanggal Terbit
                      </div>
                      <input
                        type="date"
                        id="date_datasheet"
                        name="date_datasheet"
                        className="w-full p-2 rounded border"
                        defaultValue={editDatasheet.date_datasheet}
                      />
                      {validation.date_datasheet && validation.date_datasheet.map((item, index) => (
                        <div key={index} className="text-red-600 text-sm">
                          {item}
                        </div>
                      ))}
                    </div>
                    <div className="flex flex-row justify-center items-center">
                      <button
                        type="submit"
                        className={`px-4 py-2 text-sm rounded hover:scale-110 transition duration-100 ${
                        isSubmitting
                          ? 'bg-gray-500 cursor-not-allowed'
                          : 'bg-emerald-950 text-lime-300'
                      }`}
                      disabled={isSubmitting} // Disable tombol jika sedang submit
                    >
                      {isSubmitting ? 'Processing...' : 'Save'}
                      </button>
                    </div>
                  </form>}
                </div>
              </Modal>
              {/* end modal edit datasheet */}


            </div>
            {loading ? 
              <div className="flex flex-col items-center justify-center h-20">
                  <IconLoader2 stroke={2} className="animate-spin rounded-full h-10 w-10 " />
              </div> 
            : 
            <DataGrid
              rows={Datasheet}
              columns={columns}
              disableColumnFilter
              disableColumnSelector
              disableDensitySelector
              pagination
              getRowId={(row) => row.id}
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
      </div>
    </div>
  )
}

export default Datasheet