import { Breadcrumbs, Modal, Typography } from "@mui/material"
import Header from "../Header"
import { IconChevronRight } from "@tabler/icons-react"
import { Link, useParams } from "react-router-dom"
import { DataGrid, GridToolbarQuickFilter } from "@mui/x-data-grid"
import { GridLogicOperator } from '@mui/x-data-grid';
import * as motion from 'motion/react-client';
import { useState } from "react"
import { IconCircleMinus } from "@tabler/icons-react"
import { addReport, deleteReport, getReportByPlo } from "../../services/report_plo.service"
import { useEffect } from "react"
import { api_public } from '../../services/config';
import { IconCloudDownload } from "@tabler/icons-react"
import { IconPlus } from "@tabler/icons-react"
import Swal from "sweetalert2"
import { IconArrowLeft } from "@tabler/icons-react"
import { IconArrowRight } from "@tabler/icons-react"
import { IconLoader2 } from "@tabler/icons-react"

const ReportPlo = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [report, setReport] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const base_public_url = api_public;
  const [hide, setHide] = useState(false);

  useEffect(() => {
    fetchReport();
  }, [id])

  const fetchReport = async () => {
    try {
      setLoading(true);
      const data = await getReportByPlo(id);
      setReport(data.data);
    } catch (error) {
      console.error("Error fetching REPORT PLO:", error);
    } finally {
      setLoading(false);
    }
  }

  const handleSubmit = async (e) => {
    setIsSubmitting(true);
    e.preventDefault();
    try {
      const formData = new FormData(e.target);
      formData.append('plo_id', id);
      const res = await addReport(formData);
      if (res.success) {
        fetchReport();
        setOpen(false);
      } else {
        console.log(res.response.data.errors);
      }
    } catch (error) {
      console.error("Error adding REPORT PLO:", error);
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleDelete = async (row) => {
      const result = await Swal.fire({
        title: "Apakah Anda yakin?",
        text: "File Report PLO akan dihapus secara permanen!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Ya, hapus!",
        cancelButtonText: "Batal",
      });
  
      if (result.isConfirmed) {
        try {
          const res = await deleteReport(row.id);
          if (res.success) {
            Swal.fire("Berhasil!", "Report PLO berhasil dihapus!", "success");
            fetchReport();
          } else {
            Swal.fire("Gagal!", "Terjadi kesalahan saat menghapus Report PLO!", "error");
          }
        } catch (error) {
          console.log(error);
          Swal.fire("Gagal!", "Terjadi kesalahan saat menghapus Report PLO!", "error");
        }
      }
    };

  const columns = [
    { field: 'plo', headerName: 'PLO',  valueGetter: (params) => params.unit.unit_name ,renderCell: (params) => <div className="py-4">
      {params.value}
    </div> },
    { field: 'report_plo', headerName: 'Report PLO', width:400, renderCell: (params) => <div className="py-4">
      <Link
        to={`${base_public_url}plo/reports/${params.row.report_plo}`}
        target='_blank'
        className='text-lime-500 underline'
      >
        {params.value}
      </Link>
    </div> },
    { field: 'file_report', headerName: ' File Report', width:100, renderCell: (params) => <div className="py-4">
      <Link
        to={`${base_public_url}plo/reports/${params.row.report_plo}`}
        target='_blank'
        className='text-lime-500 underline'
      >
        <IconCloudDownload stroke={2} />
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

  const handleClose = () => {
    setOpen(false);
  };


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
        {/* get report plo  */}
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
            <Link className='hover:underline text-emerald-950' to='/plo'>
              PLO
            </Link>
            <Typography className='text-lime-500'>Report PLO </Typography>
          </Breadcrumbs>
          <div>
            <div className="flex flex-row justify-end py-2">
              <button onClick={() => setOpen(true)} className='flex space-x-1 items-center px-2 py-1 bg-emerald-950 text-lime-300 text-sm rounded  hover:scale-110 transition duration-100' >
                <IconPlus className='hover:rotate-180 transition duration-500' />
                <span>Tambah Report</span>
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
                  <h2 id="modal-modal-title" className="text-emerald-950 font-bold uppercase text-center">Tambah Report</h2>
                  <form method="post" encType="multipart/form-data" onSubmit={handleSubmit}>
                    <div className="m-2">
                      <div className="text-emerald-950">
                        Upload Report PLO
                      </div>
                      <input
                        type="file"
                        id="report_plo"
                        name="report_plo"
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
            : <DataGrid
              rows={report}
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

export default ReportPlo