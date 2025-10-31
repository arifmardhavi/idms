import { IconArticle, IconCircleMinus, IconPencil, IconPlus, IconSettings } from "@tabler/icons-react"
import Header from "../components/Header"
import { useState, useEffect } from "react"
import { addLaporanInspection, deleteLaporanInspection, getLaporanInspection, updateLaporanInspection } from "../services/laporan_inspection.service"
import { DataGrid, GridToolbarQuickFilter } from "@mui/x-data-grid"
import { Link } from "react-router-dom"
import { Autocomplete, Box, Modal, TextField, Tooltip } from "@mui/material"
import { getTagnumber } from "../services/tagnumber.service"
import Swal from "sweetalert2"

const LaporanInspection = () => {
  const [hide, setHide] = useState(false)
  const [laporanInspection, setLaporanInspection] = useState([])
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [tag_number, setTagNumber] = useState([])
  const [selectedTagNumber, setSelectedTagNumber] = useState([])
  const [validation, setValidation] = useState([])
  const [isSubmitting, setIsSubmitting] = useState(false)


  const handleOpen = () => setOpen(true);
  const handleClose = () => {setOpen(false); setSelectedTagNumber([]); setValidation([]); setIsSubmitting(false);};
  const handleEditOpen = () => setEditOpen(true);
  const handleEditClose = () => {setEditOpen(false); setEditId(null); setSelectedTagNumber([]); setValidation([]); setIsSubmitting(false);};
  const [edit_id, setEditId] = useState(null);
  useEffect(() => {
    fetchLaporanInspection();
    fetchTagnumber();
  }, [])

  const fetchLaporanInspection = async () => {
    try {
      setLoading(true);
      // Fetch data from the laporan_inspection service
      const data = await getLaporanInspection();
      setLaporanInspection(data.data);
      console.log(data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }
  const fetchTagnumber = async () => {
      try {
          setLoading(true);
          const data = await getTagnumber();
          setTagNumber(data.data);
          console.log(data.data);
      } catch (error) {
          console.error("Error fetching tag number:", error);
      } finally {
          setLoading(false);
      }
  }

  const handleAddLaporanInspection = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    formData.append('tag_number_id', selectedTagNumber);
    try {
      setIsSubmitting(true);
      const res = await addLaporanInspection(formData);
      if (res.success) {
        fetchLaporanInspection();
        handleClose();
        Swal.fire("Berhasil!", "Laporan Inspection berhasil ditambahkan!", "success");
      } else {
        console.log(res.response.data.errors);
        setValidation(res.response?.data.errors || []);
      }
    } catch (error) {
      console.error("Error adding laporan_inspection:", error);
      setValidation(error.response?.data.errors || []);
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleEdit = (row) => {
    setSelectedTagNumber(row.tag_number_id);
    setEditId(row.id);
    handleEditOpen();
  }

  const handleupdateLaporanInspection = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    formData.append('tag_number_id', selectedTagNumber);
    try {
      setIsSubmitting(true);
      const res = await updateLaporanInspection(edit_id, formData);
      if (res.success) {
        fetchLaporanInspection();
        handleEditClose();
        Swal.fire("Berhasil!", "Laporan Inspection berhasil diperbarui!", "success");
      } else {
        console.log(res.response.data.errors);
        setValidation(res.response?.data.errors || []);
      }
    } catch (error) {
      console.error("Error updating laporan_inspection:", error);
      setValidation(error.response?.data.errors || []);
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Apakah Anda yakin?",
      text: "Anda akan menghapus data ini!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
    });
    if (result.isConfirmed) {
      try {
        const res = await deleteLaporanInspection(id);
        if (res.success) {
          fetchLaporanInspection();
          Swal.fire("Berhasil!", "Laporan Inspection berhasil dihapus!", "success");
        } else {
          console.log(res.response.data.errors);
          setValidation(res.response?.data.errors || []);
        }
      } catch (error) {
        console.error("Error deleting laporan_inspection:", error);
        setValidation(error.response?.data.errors || []);
      }
    }
  }


  const columns = [
    { field: 'unit', 
      headerName: 'Unit',
      valueGetter: (params) => params.unit_name, 
      width: 150, 
      renderCell: (params) => (<div className="">{params.value}</div>) },
    { field: 'category',
      valueGetter: (params) => params.category_name,
      headerName: 'Kategori', 
      width: 150,
      renderCell: (params) => (<div className="">{params.value}</div>), 
    },
    { field: 'type', 
      headerName: 'Tipe',
      valueGetter: (params => params.type_name), 
      width: 150,
      renderCell: (params) => (<div className="">{params.value}</div>),  
    },
    { field: 'tag_number', 
      headerName: 'Tag Number',
      valueGetter: (params => params.tag_number), 
      width: 150,
      renderCell: (params) => (<div className="">{params.value}</div>),  
    },
    { field: 'action', 
      headerName: 'Aksi', 
      width: 180,
      renderCell: (params) => (
          <div className='flex flex-row justify-center py-2 items-center space-x-2'>
            <Tooltip title="details" placement="left" arrow>
              <Link
              to={`/laporan_inspection/details/${params.row.id}`}
              className='px-2 py-1 bg-emerald-950 text-lime-300 text-sm rounded hover:scale-110 transition duration-100'
              >
                <IconSettings stroke={2} />
              </Link>
            </Tooltip>
            <button
                className='px-2 py-1 bg-emerald-950 text-lime-300 text-sm rounded hover:scale-110 transition duration-100'
                onClick={() => handleEdit(params.row)}
            >
                <IconPencil stroke={2} />
            </button>
            <button
                className='px-2 py-1 bg-emerald-950 text-red-500 text-sm rounded hover:scale-110 transition duration-100'
                onClick={() => handleDelete(params.row.id)}
            >
                <IconCircleMinus stroke={2} />
            </button>
          </div>
      ), 
    },
    // Add more fields as necessary
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
        <div className="flex flex-col space-y-4 bg-white p-2 rounded-xl shadow-md">
          <div className="flex justify-between items-center mb-4">
            <p className="text-2xl text-gray-900">Laporan Inspection</p>

            <button
              onClick={handleOpen}
              className="bg-emerald-950 text-lime-300 p-2 cursor-pointer rounded-md flex hover:bg-emerald-800"
            >
              <IconPlus /> Tambah
            </button>
          </div>
          <Modal
            open={open}
            onClose={handleClose} 
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box className="bg-white rounded-2xl shadow-lg p-4 relative top-1/2 left-1/2 w-[90%] md:w-1/3 transform -translate-x-1/2 -translate-y-1/2 ">
              <form onSubmit={(e) => handleAddLaporanInspection(e)} method="POST">
                <h1 className="text-xl uppercase text-gray-900 mb-4">
                  Tambah Laporan Inspection
                </h1>
                <div className="flex flex-col space-y-2">
                  <label htmlFor="tag_number">Tag Number</label>
                  <Autocomplete
                    id="tag_number_id"
                    options={Array.isArray(tag_number) ? tag_number : []}
                    getOptionLabel={(option) => option.tag_number || ''}
                    isOptionEqualToValue={(option, value) => option.id === value.id}
                    value={tag_number.find((item) => item.id === selectedTagNumber) || null}
                    onChange={(e, value) => {
                        setSelectedTagNumber(value?.id || null);
                    }}
                    renderInput={(params) => (
                    <TextField
                        {...params}
                        name="tag_number_id" // Tambahkan name di sini
                        placeholder={'N/A'}
                        variant="outlined"
                        error={!!validation.tag_number_id}
                        helperText={
                        validation.tag_number_id &&
                        validation.tag_number_id.map((item, index) => (
                            <span key={index} className="text-red-600 text-sm">
                            {item}
                            </span>
                        ))
                        }
                    />
                    )}
                />
                </div>
                <div className="flex flex-row space-x-2 justify-end text-center items-center mt-4">
                  <button type="submit" className={`bg-emerald-950 text-lime-300 p-2  rounded-xl flex hover:bg-emerald-900 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}>Simpan</button>
                  <button type="button" onClick={handleClose} className="bg-slate-700 p-2 cursor-pointer rounded-xl flex text-white hover:bg-slate-600">Batal</button>
                </div>
              </form>
            </Box>
          </Modal>
          <Modal
            open={editOpen}
            onClose={handleEditClose} 
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box className="bg-white rounded-2xl shadow-lg p-4 relative top-1/2 left-1/2 w-[90%] md:w-1/3 transform -translate-x-1/2 -translate-y-1/2 ">
              <form onSubmit={(e) => handleupdateLaporanInspection(e)} method="POST">
                <h1 className="text-xl uppercase text-gray-900 mb-4">
                  Edit Laporan Inspection
                </h1>
                <div className="flex flex-col space-y-2">
                  <label htmlFor="tag_number">Tag Number</label>
                  <Autocomplete
                    id="tag_number_id"
                    options={Array.isArray(tag_number) ? tag_number : []}
                    getOptionLabel={(option) => option.tag_number || ''}
                    isOptionEqualToValue={(option, value) => option.id === value.id}
                    value={tag_number.find((item) => item.id === selectedTagNumber) || null}
                    onChange={(e, value) => {
                        setSelectedTagNumber(value?.id || null);
                    }}
                    renderInput={(params) => (
                    <TextField
                        {...params}
                        name="tag_number_id" // Tambahkan name di sini
                        placeholder={'N/A'}
                        variant="outlined"
                        error={!!validation.tag_number_id}
                        helperText={
                        validation.tag_number_id &&
                        validation.tag_number_id.map((item, index) => (
                            <span key={index} className="text-red-600 text-sm">
                            {item}
                            </span>
                        ))
                        }
                    />
                    )}
                />
                </div>
                <div className="flex flex-row space-x-2 justify-end text-center items-center mt-4">
                  <button type="submit" className={`bg-emerald-950 text-lime-300 p-2  rounded-xl flex hover:bg-emerald-900 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}>Simpan</button>
                  <button type="button" onClick={handleEditClose} className="bg-slate-700 p-2 cursor-pointer rounded-xl flex text-white hover:bg-slate-600">Batal</button>
                </div>
              </form>
            </Box>
          </Modal>
          {loading ? <p>Loading...</p> : 
          <DataGrid
            rows={laporanInspection}
            columns={columns}
            slots={{ toolbar: CustomQuickFilter }}
            initialState={{
              pagination: {
                paginationModel: { page: 0, pageSize: 10 },
              },
            }}
            pageSizeOptions={[10, 20, 50, 100, { value: -1, label: 'All' }]}
          />
          }
        </div>
      </div>
    </div>
  )
}

export default LaporanInspection