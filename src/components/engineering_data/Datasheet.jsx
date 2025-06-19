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
import { addDatasheet, deleteDatasheet, getDatasheetByEngineering } from "../../services/datasheet.service"
import { useEffect } from "react"
import { IconRefresh } from "@tabler/icons-react"
import { IconLoader2 } from "@tabler/icons-react"
import { IconArrowLeft } from "@tabler/icons-react"
import { IconArrowRight } from "@tabler/icons-react"

const Datasheet = () => {
  const { id } = useParams();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [Datasheet, setDatasheet] = useState([]);
  const base_public_url = api_public;
  const [hide, setHide] = useState(false);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const formData = new FormData(e.target);
      formData.append('engineering_data_id', id);
      const res = await addDatasheet(formData);
      if (res.success) {
        Swal.fire("Berhasil!", "Datasheet file berhasil tambahkan!", "success");
        fetchDatasheet();
        setOpen(false);
      } else {
        console.log(res.response.data.errors);
      }
    } catch (error) {
      console.error("Error adding Datasheet:", error);
    } finally {
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
      field: 'actions',
      headerName: 'Aksi',
      width: 150,
      renderCell: (params) => (
        <div className='flex flex-row justify-center py-2 items-center space-x-2'>
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
                  </form>
                </div>
              </Modal>

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