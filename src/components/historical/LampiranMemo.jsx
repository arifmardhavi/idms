import { Breadcrumbs, Modal, Typography } from "@mui/material"
import Header from "../Header"
import { IconChevronRight } from "@tabler/icons-react"
import { Link, useParams } from "react-router-dom"
import { DataGrid, GridToolbarQuickFilter } from "@mui/x-data-grid"
import { GridLogicOperator } from '@mui/x-data-grid';
import * as motion from 'motion/react-client';
import { useState } from "react"
import { IconCircleMinus } from "@tabler/icons-react"
import { addLampiran, deleteLampiran, getLampiranByHistorical } from "../../services/lampiran_memo.service"
import { useEffect } from "react"
import { api_public } from '../../services/config';
import { IconPlus } from "@tabler/icons-react"
import Swal from "sweetalert2"

const LampiranMemo = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [lampiran, setLampiran] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const base_public_url = api_public;

  useEffect(() => {
    fetchLampiran();
  }, [id])

  const fetchLampiran = async () => {
    try {
      setLoading(true);
      const data = await getLampiranByHistorical(id);
      setLampiran(data.data);
    } catch (error) {
      console.error("Error fetching Lampiran Historical:", error);
    } finally {
      setLoading(false);
    }
  }

  const handleSubmit = async (e) => {
    setIsSubmitting(true);
    e.preventDefault();
    try {
      const formData = new FormData(e.target);
      formData.append('historical_memorandum_id', id);
      const res = await addLampiran(formData);
      if (res.success) {
        Swal.fire("Berhasil!", "Lampiran Historical berhasil tambahkan!", "success");
        fetchLampiran();
        setOpen(false);
      } else {
        console.log(res.response.data.errors);
      }
    } catch (error) {
      console.error("Error adding Lampiran Historical:", error);
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleDelete = async (row) => {
      const result = await Swal.fire({
        title: "Apakah Anda yakin?",
        text: "File Lampiran Historical akan dihapus secara permanen!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Ya, hapus!",
        cancelButtonText: "Batal",
      });
  
      if (result.isConfirmed) {
        try {
          const res = await deleteLampiran(row.id);
          if (res.success) {
            Swal.fire("Berhasil!", "Lampiran Historical berhasil dihapus!", "success");
            fetchLampiran();
          } else {
            Swal.fire("Gagal!", "Terjadi kesalahan saat menghapus Lampiran Historical!", "error");
          }
        } catch (error) {
          console.log(error);
          Swal.fire("Gagal!", "Terjadi kesalahan saat menghapus Lampiran Historical!", "error");
        }
      }
    };

  const columns = [
    { field: 'lampiran_memo', headerName: 'Lampiran Historical', width:400, renderCell: (params) => <div className="py-4">
      <Link
        to={`${base_public_url}historical_memorandum/lampiran/${params.value}`}
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

  const handleClose = () => {
    setOpen(false);
  };


  return (
    <div className='flex flex-col md:flex-row w-full'>
      <Header />
      <div className='flex flex-col md:pl-64 w-full px-2 py-4 space-y-3'>
        {/* get Lampiran Historical  */}
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
            <Link className='hover:underline text-emerald-950' to='/historical_memorandum'>
              Historical Memorandum
            </Link>
            <Typography className='text-lime-500'>Lampiran </Typography>
          </Breadcrumbs>
          {/* <p className='text-emerald-950 text-md font-semibold uppercase w-full text-center'>{lampiran[0].historical_memorandum.perihal}</p> */}
          <div>
            <div className="flex flex-row justify-end py-2">
              <button onClick={() => setOpen(true)} className='flex space-x-1 items-center px-2 py-1 bg-emerald-950 text-lime-300 text-sm rounded  hover:scale-110 transition duration-100' >
                <IconPlus className='hover:rotate-180 transition duration-500' />
                <span>Tambah Lampiran</span>
              </button>
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
                        Upload Lampiran Historical
                      </div>
                      <input
                        type="file"
                        id="lampiran_memo"
                        name="lampiran_memo"
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
            {loading ? <p>Loading...</p> : 
            <DataGrid
              rows={lampiran}
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

export default LampiranMemo