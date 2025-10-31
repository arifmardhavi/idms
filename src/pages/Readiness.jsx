import { IconArticle, IconLoader2, IconPencil, IconPlus, IconRefresh, IconTrash } from "@tabler/icons-react"
import Header from "../components/Header"
import { useState } from "react";
import { DataGrid, GridLogicOperator, GridToolbarQuickFilter } from "@mui/x-data-grid";
import { addEventReadiness, deleteEventReadiness, getEventReadiness, updateEventReadiness } from "../services/event_readiness.service";
import Swal from "sweetalert2";
import { useEffect } from "react";
import { Box, Modal } from "@mui/material";
import { Link } from "react-router-dom";

const Readiness = () => {
  const [hide, setHide] = useState(false);
  const [loading, setLoading] = useState(false);
  const [eventReadiness, setEventReadiness] = useState([]);
  const [openEvent, setOpenEvent] = useState(false);
  const [selectedEventReadiness, setSelectedEventReadiness] = useState({});
  const [validation, setValidation] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchEventReadiness();
  }, []);

  const fetchEventReadiness = async () => {
    setLoading(true);
    try {
      const data = await getEventReadiness();
      setEventReadiness(data.data);
      console.log(data.data);
    } catch (error) {
      console.error("Error fetching Event Readiness:", error);
    } finally {
      setLoading(false);
    }
  };

  const eventOpen = () => {
    setSelectedEventReadiness({});
    setOpenEvent(true);
  }
  const updateEventOpen = (row) => {
    setSelectedEventReadiness(row);
    setOpenEvent(true);
  }
  const eventClose = () => {
    setOpenEvent(false);
    setSelectedEventReadiness({});
  };

  const handleAddEventReadiness = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
        const formData = new FormData(e.target);
        const res = await addEventReadiness(formData);
        if (res.success) {
            Swal.fire("Berhasil!", "Event Readiness berhasil ditambahkan!", "success");
            eventClose();
            fetchEventReadiness();
            setValidation({});
        } else {
            setValidation(res.response?.data.errors || []);
            Swal.fire("Gagal!", "Terjadi kesalahan saat menambahkan Event Readiness!", "error");
        }
    } catch (error) {
        setValidation(error.response?.data.errors || []);
        console.error("Error adding Event Readiness:", error);
        Swal.fire("Gagal!", "Terjadi kesalahan saat menambahkan Event Readiness!", "error");
    } finally {
        setIsSubmitting(false);
    }
  };

  const handleUpdateEventReadiness = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
        const formData = new FormData(e.target);
        const res = await updateEventReadiness(selectedEventReadiness.id, formData);
        if (res.success) {
            Swal.fire("Berhasil!", "Event Readiness berhasil diupdate!", "success");
            eventClose();
            fetchEventReadiness();
            setValidation({});
        } else {
            setValidation(res.response?.data.errors || []);
            Swal.fire("Gagal!", "Terjadi kesalahan saat mengupdate Event Readiness!", "error");
        }
    } catch (error) {
        setValidation(error.response?.data.errors || []);
        console.error("Error updating Event Readiness:", error);
        Swal.fire("Gagal!", "Terjadi kesalahan saat mengupdate Event Readiness!", "error");
    } finally {
        setIsSubmitting(false);
    }
  };
  const handleDeleteEventReadiness = async (row) => {
    const result = await Swal.fire({
      title: "Apakah Anda yakin?",
      text: "Data Event Readiness akan dihapus secara permanen!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
    });

    if (result.isConfirmed) {
        try {
            const res = await deleteEventReadiness(row.id);
            if (res.success) {
                Swal.fire("Berhasil!", "Event Readiness berhasil dihapus!", "success");
                fetchEventReadiness();
            } else {
                Swal.fire("Gagal!", "Terjadi kesalahan saat menghapus Event Readiness!", "error");
            }
        } catch (error) {
            console.error("Error deleting  Event Readiness:", error);
            Swal.fire("Gagal!", "Terjadi kesalahan saat Event Readiness!", "error");
        }
    }
  };


  const columns = [
    { field: 'event_name', headerName: 'Nama Event', width: 200 },
    {
      field: 'tanggal_ta',
      headerName: 'Tanggal TA',
      width: 140,
      renderCell: (params) => (
        <div className=''>
          {params.value ? new Intl.DateTimeFormat('id-ID', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
          }).format(new Date(params.value)) : '-'}
        </div>
      ),
    },
    {
      field: 'dashboard',
      headerName: 'Menu',
      width: 250,
      renderCell: (params) => (
        <div className='py-2 flex flex-row justify-center items-center space-x-1'>
          <Link to={`/readiness_ta_plantstop_material/${params.row.id}`}
            className='bg-green-500 text-white text-sm rounded-full px-2 py-1 hover:scale-110 transition duration-100 flex items-center space-x-1'
          >
            Material
          </Link>
          <Link to={`/readiness_ta_plantstop_jasa/${params.row.id}`}
            className='bg-blue-500 text-white text-sm rounded-full px-2 py-1 hover:scale-110 transition duration-100 flex items-center space-x-1'
          >
            Jasa
          </Link>
          <Link to={`/dashboard_readiness_ta_plantstop/${params.row.id}`}
            className='bg-emerald-950 text-lime-400 text-sm rounded-full px-2 py-1 hover:scale-110 transition duration-100 flex items-center space-x-1'
          >
            Dashboard
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
            onClick={() => handleDeleteEventReadiness(params.row)}
            className='bg-red-500 text-white text-sm rounded-full px-2 py-1 hover:scale-110 transition duration-100 flex items-center space-x-1'
          >
            <IconTrash />
          </button>
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
    <div className='flex flex-col md:flex-row w-full'>
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
          <div className='flex flex-row justify-between'>
            <h1 className='text-xl font-bold uppercase'>Event Readiness Ta / Plant Stop</h1>
            <div className='flex flex-row justify-end items-center space-x-2'>
                <button
                    className='flex space-x-1 items-center px-2 py-1 bg-emerald-950 text-lime-300 text-sm rounded hover:scale-110 transition duration-100'
                    onClick={fetchEventReadiness}
                >
                    <IconRefresh className='hover:rotate-180 transition duration-500' />
                    <span>Refresh</span>
                </button>
                <button
                  onClick={eventOpen}
                  className="flex space-x-1 items-center px-2 py-1 bg-emerald-950 text-lime-300 text-sm rounded hover:scale-110 transition duration-100"
                >
                  <IconPlus className='hover:rotate-90 transition duration-500' /> Tambah
                </button>
                


                {/* modal readiness material */}
                <Modal
                  open={openEvent}
                  onClose={eventClose} 
                  aria-labelledby="modal-modal-title"
                  aria-describedby="modal-modal-description"
                >
                  <Box className="bg-white rounded-2xl shadow-lg p-4 relative top-1/2 left-1/2 w-[90%] md:w-1/3 transform -translate-x-1/2 -translate-y-1/2 ">
                    <form onSubmit={(e) => {selectedEventReadiness.id ? handleUpdateEventReadiness(e) : handleAddEventReadiness(e)}} method="POST">
                      <h1 className="text-xl uppercase text-gray-900 mb-4">
                        {selectedEventReadiness.id ? "Update" : "Tambah"} Event Readiness Ta / Plant Stop
                      </h1>
                      <div className="flex flex-col space-y-2">
                        <div>
                          <label htmlFor="event_name">Nama Event <sup className='text-red-500'>*</sup></label>
                          <input
                            type="text"
                            name="event_name"
                            id="event_name"
                            placeholder="Masukkan Nama Event"
                            className="border border-slate-200 rounded-md p-2 w-full bg-transparent outline-none"
                            defaultValue={selectedEventReadiness ? selectedEventReadiness.event_name : ''}
                            required
                          />
                          {validation.event_name && (
                            validation.event_name.map((item, index) => (
                              <div key={index}>
                                <small className="text-red-600 text-sm">{item}</small>
                              </div>
                            ))
                          )}
                        </div>
                        <div>
                          <label htmlFor="tanggal_ta">Tanggal Ta / Plant Stop <sup className='text-red-500'>*</sup></label>
                          <input
                            type="date"
                            name="tanggal_ta"
                            id="tanggal_ta"
                            className="border border-slate-200 rounded-md p-2 w-full bg-transparent outline-none"
                            defaultValue={selectedEventReadiness ? selectedEventReadiness.tanggal_ta : ''}
                            required
                          />
                          {validation.tanggal_ta && (
                            validation.tanggal_ta.map((item, index) => (
                              <div key={index}>
                                <small className="text-red-600 text-sm">{item}</small>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                      <div className="flex flex-row space-x-2 justify-end text-center items-center mt-4">
                        {selectedEventReadiness.id 
                          ? <button type="submit" className={`bg-yellow-400 text-black p-2  rounded-xl flex hover:bg-yellow-500 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}>Update</button> 
                          : <button type="submit" className={`bg-emerald-950 text-lime-300 p-2  rounded-xl flex hover:bg-emerald-900 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}>Simpan</button>
                        }
                        <button type="button" onClick={eventClose} className="bg-slate-700 p-2 cursor-pointer rounded-xl flex text-white hover:bg-slate-600">Batal</button>
                      </div>
                    </form>
                  </Box>
                </Modal>
            </div>
          </div>
          <div>
            {loading ? (
                <div className="flex flex-col items-center justify-center h-20">
                    <IconLoader2 stroke={2} className="animate-spin rounded-full h-10 w-10 " />
                </div>
            ) :<DataGrid
              rows={eventReadiness}
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
      </div>
    </div>
  )
}

export default Readiness