import { IconArrowLeft, IconArrowRight, IconLoader2, IconPencil, IconPlus, IconPointFilled, IconRefresh, IconTrash } from "@tabler/icons-react"
import { useState } from "react";
import Header from "../components/Header";
import { addReadinessMaterial, deleteReadinessMaterial, getReadinessMaterial, updateReadinessMaterial } from "../services/readiness_material.service";
import { useEffect } from "react";
import { DataGrid, GridLogicOperator, GridToolbarQuickFilter } from "@mui/x-data-grid";
import { Autocomplete, Box, Chip, Modal, Stack, TextField, Tooltip } from "@mui/material";
import { getHistoricalMemorandum } from "../services/historical_memorandum.service";
import Swal from "sweetalert2";
import { addRekomendasiMaterial, deleteRekomendasiMaterial, updateRekomendasiMaterial } from "../services/rekomendasi_material.service";
import { Link } from "react-router-dom";
import { api_public } from "../services/config";
import { addNotifMaterial, deleteNotifMaterial, updateNotifMaterial } from "../services/notif_material.service";
import { addJobPlanMaterial, deleteJobPlanMaterial, updateJobPlanMaterial } from "../services/job_plan_material.service";

const ReadinessMaterial = () => {
  const base_public_url = api_public;
  const [hide, setHide] = useState(false);
  const [loading, setLoading] = useState(false);
  const [readinessMaterial, setReadinessMaterial] = useState([]);
  const [openRekomendasi, setOpenRekomendasi] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [hasMemo, setHasMemo] = useState(false);
  const [historicalMemorandum, setHistoricalMemorandum] = useState([]);
  const [selectedHistoricalMemo, setSelectedHistoricalMemo] = useState(null);
  const [validation, setValidation] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [openReadiness, setOpenReadiness] = useState(false);
  const [selectedReadiness, setSelectedReadiness] = useState([]);
  const [openNotif, setOpenNotif] = useState(false);
  const [openJobPlan, setOpenJobPlan] = useState(false);

  

  useEffect(() => {
    fetchReadinessMaterial();
    fetchHistoricalMemorandum();
  }, []);

  // fetch area

  const fetchReadinessMaterial = async () => {
    setLoading(true);
    try {
      const data = await getReadinessMaterial();
      setReadinessMaterial(data.data);
      console.log(data.data);
    } catch (error) {
      console.error("Error fetching readiness material:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchHistoricalMemorandum = async () => {
      try {
          setLoading(true);
          const data = await getHistoricalMemorandum();
          setHistoricalMemorandum(data.data);
          console.log(data.data);
      } catch (error) {
          console.error("Error fetching historical memorandum:", error);
      } finally {
          setLoading(false);
      }
  }




  
  // readiness area 

  const readinessOpen = () => {
    setOpenReadiness(true);
  };
  const readinessClose = () => {
    setOpenReadiness(false);
    setValidation({});
    setIsSubmitting(false);
    setSelectedReadiness([]);
  };

  const updateReadiness = (row) => {
    setSelectedReadiness(row);
    setSelectedId(row.id);
    setOpenReadiness(true);
  };

  const handleAddReadiness = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    try {
      setIsSubmitting(true);
      const res = await addReadinessMaterial(formData);
      if (res.success) {
        fetchReadinessMaterial();
        Swal.fire("Berhasil!", "Readiness Material berhasil ditambahkan!", "success");
        readinessClose();
      } else {
        console.log(res.response.data.errors);
        setValidation(res.response?.data.errors || []);
      }
    } catch (error) {
      console.error("Error adding Readiness Material:", error);
      setValidation(error.response?.data.errors || []);
    } finally {
      setIsSubmitting(false);
    }
  }
  const handleUpdateReadiness = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    try {
      setIsSubmitting(true);
      const res = await updateReadinessMaterial( selectedId, formData);
      if (res.success) {
        fetchReadinessMaterial();
        Swal.fire("Berhasil!", "Readiness Material berhasil diupdate!", "success");
        readinessClose();
      } else {
        console.log(res.response.data.errors);
        setValidation(res.response?.data.errors || []);
      }
    } catch (error) {
      console.error("Error updating Readiness Material:", error);
      setValidation(error.response?.data.errors || []);
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleDeleteReadiness = async (row) => {
    const result = await Swal.fire({
      title: "Apakah Anda yakin?",
      text: "Data Readiness Material akan dihapus secara permanen!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
    });

    if (result.isConfirmed) {
        try {
            const res = await deleteReadinessMaterial(row.id);
            if (res.success) {
                Swal.fire("Berhasil!", "Readiness Material berhasil dihapus!", "success");
                setReadinessMaterial([]);
                fetchReadinessMaterial();
            } else {
                Swal.fire("Gagal!", "Terjadi kesalahan saat menghapus Readiness Material!", "error");
            }
        } catch (error) {
            console.error("Error deleting readiness material:", error);
            Swal.fire("Gagal!", "Terjadi kesalahan saat readiness material!", "error");
        }
    }
  };

  



  // rekomendasi area 

  const rekomendasiOpen = (row) => {
    setOpenRekomendasi(true);
    setSelectedReadiness(row);
    setSelectedId(row.id);
    setSelectedHistoricalMemo(row.rekomendasi_material?.historical_memorandum_id ? row.rekomendasi_material?.historical_memorandum_id : null);
    setHasMemo(row.rekomendasi_material?.historical_memorandum ? true : false);

  };

  const rekomendasiClose = () => {
    setOpenRekomendasi(false);
    setSelectedReadiness([]);
    setSelectedId(null);
    setSelectedHistoricalMemo(null);
    setHasMemo(false);
    setValidation({});
    setIsSubmitting(false);
  }
  const handleAddRekomendasi = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    formData.append('readiness_material_id', selectedId);
    hasMemo ? formData.append('historical_memorandum_id', selectedHistoricalMemo) : formData.append('rekomendasi_file', e.target.rekomendasi_file.files[0]);
    console.log(formData);
    try {
      setIsSubmitting(true);
      const res = await addRekomendasiMaterial(formData);
      if (res.success) {
        fetchReadinessMaterial();
        Swal.fire("Berhasil!", "Rekomendasi Material berhasil ditambahkan!", "success");
        rekomendasiClose();
      } else {
        console.log(res.response.data.errors);
        setValidation(res.response?.data.errors || []);
      }
    } catch (error) {
      console.error("Error adding Rekomendasi Material:", error);
      setValidation(error.response?.data.errors || []);
    } finally {
      setIsSubmitting(false);
    }
  }
  const handleUpdateRekomendasi = async (e, id) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    formData.append('readiness_material_id', selectedId);
    hasMemo ? formData.append('historical_memorandum_id', selectedHistoricalMemo) : formData.append('rekomendasi_file', e.target.rekomendasi_file.files[0]);
    console.log(formData);
    try {
      setIsSubmitting(true);
      const res = await updateRekomendasiMaterial(id, formData);
      if (res.success) {
        fetchReadinessMaterial();
        Swal.fire("Berhasil!", "Rekomendasi Material berhasil di update!", "success");
        rekomendasiClose();
      } else {
        console.log(res.response.data.errors);
        setValidation(res.response?.data.errors || []);
      }
    } catch (error) {
      console.error("Error updating Rekomendasi Material:", error);
      setValidation(error.response?.data.errors || []);
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleDeleteRekomendasi = async (row) => {
    setOpenRekomendasi(false);
    const result = await Swal.fire({
      title: "Apakah Anda yakin?",
      text: "Data Rekomendasi Material akan dihapus secara permanen!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
    });

    if (result.isConfirmed) {
        try {
            const res = await deleteRekomendasiMaterial(row.id);
            if (res.success) {
                Swal.fire("Berhasil!", "Rekomendasi Material berhasil dihapus!", "success");
                setReadinessMaterial([]);
                fetchReadinessMaterial();
            } else {
                Swal.fire("Gagal!", "Terjadi kesalahan saat menghapus Rekomendasi Material!", "error");
            }
        } catch (error) {
            console.error("Error deleting Rekomendasi material:", error);
            Swal.fire("Gagal!", "Terjadi kesalahan saat Rekomendasi material!", "error");
        }
    }else {
      setOpenRekomendasi(true);
    }
  };




  // notif area

  const notifOpen = (row) => {
    setOpenNotif(true);
    setSelectedReadiness(row);
    setSelectedId(row.id);
  };

  const notifClose = () => {
    setOpenNotif(false);
    setSelectedReadiness([]);
    setSelectedId(null);
    setValidation({});
    setIsSubmitting(false);
  }


  const handleAddNotif = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    formData.append('readiness_material_id', selectedId);
    try {
      setIsSubmitting(true);
      const res = await addNotifMaterial(formData);
      if (res.success) {
        fetchReadinessMaterial();
        Swal.fire("Berhasil!", "Notif Material berhasil ditambahkan!", "success");
        notifClose();
      } else {
        console.log(res.response.data.errors);
        setValidation(res.response?.data.errors || []);
      }
    } catch (error) {
      console.error("Error adding Notif Material:", error);
      setValidation(error.response?.data.errors || []);
    } finally {
      setIsSubmitting(false);
    }
  }
  const handleUpdateNotif = async (e, id) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    formData.append('readiness_material_id', selectedId);
    try {
      setIsSubmitting(true);
      const res = await updateNotifMaterial( id, formData);
      if (res.success) {
        fetchReadinessMaterial();
        Swal.fire("Berhasil!", "Notif Material berhasil diupdate!", "success");
        notifClose();
      } else {
        console.log(res.response.data.errors);
        setValidation(res.response?.data.errors || []);
      }
    } catch (error) {
      console.error("Error updating Notif Material:", error);
      setValidation(error.response?.data.errors || []);
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleDeleteNotif = async (row) => {
    setOpenNotif(false);
    const result = await Swal.fire({
      title: "Apakah Anda yakin?",
      text: "Data Notif Material akan dihapus secara permanen!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
    });

    if (result.isConfirmed) {
        try {
            const res = await deleteNotifMaterial(row.id);
            if (res.success) {
                Swal.fire("Berhasil!", "Notif Material berhasil dihapus!", "success");
                fetchReadinessMaterial();
            } else {
                Swal.fire("Gagal!", "Terjadi kesalahan saat menghapus Notif Material!", "error");
            }
        } catch (error) {
            console.error("Error deleting  Notif material:", error);
            Swal.fire("Gagal!", "Terjadi kesalahan saat Notif material!", "error");
        }
    } else {
      setOpenNotif(true);
    }
  };



  // job plan area

  const jobPlanOpen = (row) => {
    setOpenJobPlan(true);
    setSelectedReadiness(row);
    setSelectedId(row.id);
  };

  const jobPlanClose = () => {
    setOpenJobPlan(false);
    setSelectedReadiness([]);
    setSelectedId(null);
    setValidation({});
    setIsSubmitting(false);
  }


  const handleAddJobPlan = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    formData.append('readiness_material_id', selectedId);
    try {
      setIsSubmitting(true);
      const res = await addJobPlanMaterial(formData);
      if (res.success) {
        fetchReadinessMaterial();
        Swal.fire("Berhasil!", "Job Plan Material berhasil ditambahkan!", "success");
        jobPlanClose();
      } else {
        console.log(res.response.data.errors);
        setValidation(res.response?.data.errors || []);
      }
    } catch (error) {
      console.error("Error adding Job Plan Material:", error);
      setValidation(error.response?.data.errors || []);
    } finally {
      setIsSubmitting(false);
    }
  }
  const handleUpdateJobPlan = async (e, id) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    try {
      setIsSubmitting(true);
      const res = await updateJobPlanMaterial( id, formData);
      if (res.success) {
        fetchReadinessMaterial();
        Swal.fire("Berhasil!", "Job Plan Material berhasil diupdate!", "success");
        jobPlanClose();
      } else {
        console.log(res.response.data.errors);
        setValidation(res.response?.data.errors || []);
      }
    } catch (error) {
      console.error("Error updating Job Plan Material:", error);
      setValidation(error.response?.data.errors || []);
    } finally {
      setIsSubmitting(false);
    }
  }
  const handleupdateStatusJobPlan = async (status, id) => {
    const formData = new FormData();
    formData.append('status', status);
    try {
      setIsSubmitting(true);
      const res = await updateJobPlanMaterial( id, formData);
      if (res.success) {
        fetchReadinessMaterial();
        Swal.fire("Berhasil!", "Status Job Plan Material Selesai!", "success");
        jobPlanClose();
      } else {
        console.log(res.response.data.errors);
        setValidation(res.response?.data.errors || []);
      }
    } catch (error) {
      console.error("Error updating status Job Plan Material:", error);
      setValidation(error.response?.data.errors || []);
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleDeleteJobPlan = async (row) => {
    setOpenJobPlan(false);
    const result = await Swal.fire({
      title: "Apakah Anda yakin?",
      text: "Data Job Plan Material akan dihapus secara permanen!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
    });

    if (result.isConfirmed) {
        try {
            const res = await deleteJobPlanMaterial(row.id);
            if (res.success) {
                Swal.fire("Berhasil!", "Job Plan Material berhasil dihapus!", "success");
                fetchReadinessMaterial();
            } else {
                Swal.fire("Gagal!", "Terjadi kesalahan saat menghapus Job Plan Material!", "error");
            }
        } catch (error) {
            console.error("Error deleting  Job Plan material:", error);
            Swal.fire("Gagal!", "Terjadi kesalahan saat Job Plan material!", "error");
        }
    } else {
      setOpenJobPlan(true);
    }
  };






  // data table area

  const columns = [
    { field: 'material_name', headerName: 'Nama Material', width: 150 },
    {
      field: 'rekomendasi_material',
      headerName: 'Rekom',
      width: 80,
      renderCell: (params) => (
        <div className='py-4 flex flex-row justify-center items-center'>
          <button
            onClick={() => rekomendasiOpen(params.row)}
            className={params.row.rekomendasi_material ? 'text-blue-500' : 'text-slate-200'}
          >
            <Tooltip title={params.row.rekomendasi_material ? 'Lihat Rekomendasi' : 'Tambah Rekomendasi'} placement="left" arrow>  
              <IconPointFilled />
            </Tooltip>
          </button>
        </div>
      ),
    },
    {
      field: 'notif_material',
      headerName: 'Notif',
      width: 80,
      renderCell: (params) => (
        <div className='py-4 flex flex-row justify-center items-center'>
          <button
            onClick={() => notifOpen(params.row)}
            className={params.row?.notif_material ? 'text-blue-500' : 'text-slate-200'}
          >
            <Tooltip title={params.row?.notif_material ? 'Lihat Notifikasi' : 'Tambah Notifikasi'} placement="left" arrow>  
              <IconPointFilled />
            </Tooltip>
          </button>
        </div>
      ),
    },
    {
      field: 'job_plan_material',
      headerName: 'Job Plan',
      width: 80,
      renderCell: (params) => (
        <div className='py-4 flex flex-row justify-center items-center'>
          <button
            onClick={() => jobPlanOpen(params.row)}
            className={params.row?.job_plan_material?.status == 1 ? 'text-blue-500' : params.row?.job_plan_material?.status == 0 ? 'text-green-500' : 'text-slate-200'}
          >
            <Tooltip title={params.row?.job_plan_material ? 'Lihat Job Plan' : 'Tambah Job Plan'} placement="left" arrow>  
              <IconPointFilled />
            </Tooltip>
          </button>
        </div>
      ),
    },
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
      field: 'status', 
      headerName: 'Status',
      valueGetter: (params) => params == 0 ? 'Aktif' : 'Done',
      renderCell: (params) => (
        <div className="flex flex-col justify-center items-center p-2" >
          <Stack direction="row" spacing={1}>
            <Chip label={params.row.status == 0 ? 'Aktif' : 'Done'} color={params.row.status == 0 ? 'success' : 'primary'} />
          </Stack>
          
        </div>
      )
    },
    {
      field: 'action',
      headerName: 'Aksi',
      width: 100,
      renderCell: (params) => (
        <div className='py-2 flex flex-row justify-center items-center'>
          <button
            onClick={() => updateReadiness(params.row)}
            className='bg-emerald-950 text-lime-300 text-sm rounded-full px-2 py-1 hover:scale-110 transition duration-100 mr-2 flex items-center space-x-1'
          >
            <IconPencil />
          </button>
          <button
            onClick={() => handleDeleteReadiness(params.row)}
            className='bg-emerald-950 text-red-500 text-sm rounded-full px-2 py-1 hover:scale-110 transition duration-100 flex items-center space-x-1'
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
                  <IconArrowLeft />
              </div>
          </div>
          <div className={` ${hide ? 'block' : 'hidden'}  w-fit bg-emerald-950 text-lime-300 p-2 cursor-pointer rounded-md`} onClick={() => setHide(false)}>
              <IconArrowRight />
          </div>
        <div className='w-full bg-white shadow-sm px-2 py-4 rounded-lg space-y-2'>
          <div className='flex flex-row justify-between'>
            <h1 className='text-xl font-bold uppercase'>Readiness Material</h1>
            <div className='flex flex-row justify-end items-center space-x-2'>
                <button
                    className='flex space-x-1 items-center px-2 py-1 bg-emerald-950 text-lime-300 text-sm rounded hover:scale-110 transition duration-100'
                    onClick={fetchReadinessMaterial}
                >
                    <IconRefresh className='hover:rotate-180 transition duration-500' />
                    <span>Refresh</span>
                </button>
                <button
                  onClick={readinessOpen}
                  className="flex space-x-1 items-center px-2 py-1 bg-emerald-950 text-lime-300 text-sm rounded hover:scale-110 transition duration-100"
                >
                  <IconPlus className='hover:rotate-90 transition duration-500' /> Tambah
                </button>
                


                {/* modal readiness material */}
                <Modal
                  open={openReadiness}
                  onClose={readinessClose} 
                  aria-labelledby="modal-modal-title"
                  aria-describedby="modal-modal-description"
                >
                  <Box className="bg-white rounded-2xl shadow-lg p-4 relative top-1/2 left-1/2 w-[90%] md:w-1/3 transform -translate-x-1/2 -translate-y-1/2 ">
                    <form onSubmit={(e) => {selectedReadiness.id ? handleUpdateReadiness(e) : handleAddReadiness(e)}} method="POST">
                      <h1 className="text-xl uppercase text-gray-900 mb-4">
                        {selectedReadiness ? "Update" : "Tambah"} Readiness Material
                      </h1>
                      <div className="flex flex-col space-y-2">
                        <div>
                          <label htmlFor="material_name">Nama Material <sup className='text-red-500'>*</sup></label>
                          <input
                            type="text"
                            name="material_name"
                            id="material_name"
                            placeholder="Masukkan Nama Material"
                            className="border border-slate-200 rounded-md p-2 w-full bg-transparent outline-none"
                            defaultValue={selectedReadiness ? selectedReadiness.material_name : ''}
                            required
                          />
                        </div>
                        <div>
                          <label htmlFor="tanggal_ta">Tanggal TA <sup className='text-red-500'>*</sup></label>
                          <input
                            type="date"
                            name="tanggal_ta"
                            id="tanggal_ta"
                            className="border border-slate-200 rounded-md p-2 w-full bg-transparent outline-none"
                            defaultValue={selectedReadiness ? selectedReadiness.tanggal_ta : ''}
                            required
                          />
                        </div>
                      </div>
                      <div className="flex flex-row space-x-2 justify-end text-center items-center mt-4">
                        {selectedReadiness.tanggal_ta 
                          ? <button type="submit" className={`bg-yellow-400 text-black p-2  rounded-xl flex hover:bg-yellow-500 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}>Update</button> 
                          : <button type="submit" className={`bg-emerald-950 text-lime-300 p-2  rounded-xl flex hover:bg-emerald-900 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}>Simpan</button>
                        }
                        <button type="button" onClick={readinessClose} className="bg-slate-700 p-2 cursor-pointer rounded-xl flex text-white hover:bg-slate-600">Batal</button>
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
              rows={readinessMaterial}
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


      {/* modal rekomendasi */}
      <Modal
        open={openRekomendasi}
        onClose={rekomendasiClose} 
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box className="bg-white rounded-2xl shadow-lg p-4 relative top-1/2 left-1/2 w-[90%] md:w-1/3 transform -translate-x-1/2 -translate-y-1/2 ">
          <form onSubmit={(e) => {selectedReadiness?.rekomendasi_material ? handleUpdateRekomendasi(e, selectedReadiness.rekomendasi_material.id) : handleAddRekomendasi(e)}} method="POST">
            <h1 className="text-xl uppercase text-gray-900 mb-4">
              Tambah Rekomendasi Material
            </h1>
            <div className="flex flex-col space-y-2">
              <div>
                <label htmlFor="inspection_date">Ada Memo ?</label>
                <select defaultValue={hasMemo ? 'yes' : 'no'} onChange={(e) => (e.target.value === 'yes') ? setHasMemo(true) : setHasMemo(false) } className="border rounded-md p-2 w-full">
                  <option value="no">Tidak</option>
                  <option value="yes">Ada</option>
                </select>
              </div>
              {hasMemo ?
                <div className="flex flex-col space-y-2">
                  <label htmlFor="historicalMemorandum">Historical Memorandum<sup className='text-red-500'>*</sup></label>
                  <Autocomplete
                    id="historical_memorandum_id"
                    options={Array.isArray(historicalMemorandum) ? historicalMemorandum : []}
                    getOptionLabel={(option) => `${option?.no_dokumen ?? ''} - ${option?.perihal ?? ''}`}
                    isOptionEqualToValue={(option, value) => option.id === value.id}
                    value={historicalMemorandum.find((item) => item.id === selectedHistoricalMemo) || null}
                    onChange={(e, value) => {
                        setSelectedHistoricalMemo(value?.id || null);
                    }}
                    required
                    renderInput={(params) => (
                    <TextField
                        {...params}
                        name="historical_memorandum_id" // Tambahkan name di sini
                        placeholder={'N/A'}
                        variant="outlined"
                        error={!!validation.historical_memorandum_id}
                        helperText={
                        validation.historical_memorandum_id &&
                        validation.historical_memorandum_id.map((item, index) => (
                            <span key={index} className="text-red-600 text-sm">
                            {item}
                            </span>
                        ))
                        }
                    />
                    )}
                  />
                </div>
                :
                <div>
                  <label htmlFor="rekomendasi_file">Rekomendasi File<sup className='text-red-500'>*</sup></label>
                  <input 
                    type="file" 
                    name="rekomendasi_file"
                    className="border rounded-md p-2 w-full" />
                    {selectedReadiness?.rekomendasi_material?.rekomendasi_file ? (
                      <div className='flex flex-row justify-between items-center w-full border bg-lime-400 rounded p-1'>
                          <Link
                            to={`${base_public_url}readiness_ta/material/rekomendasi/${selectedReadiness?.rekomendasi_material?.rekomendasi_file}`}
                            target='_blank'
                            className='text-emerald-950 hover:underline cursor-pointer text-xs'
                          >
                            {selectedReadiness?.rekomendasi_material?.rekomendasi_file}
                          </Link>
                      </div>
                    ) : (
                      ''
                    )}
                </div>
              }
              <div>
                <label htmlFor="target_date">Target Date <sup className='text-red-500'>*</sup></label>
                <input 
                  type="date" 
                  name="target_date"
                  className="border rounded-md p-2 w-full"
                  defaultValue={selectedReadiness?.rekomendasi_material?.target_date} 
                  required />
              </div>
            </div>
            <div className="flex flex-row space-x-2 justify-end text-center items-center mt-4">
              {selectedReadiness?.rekomendasi_material ? (
                <>
                  <button type="button" onClick={() => handleDeleteRekomendasi(selectedReadiness?.rekomendasi_material)} className={`bg-red-500 text-white p-2 rounded-xl flex justify-center items-center hover:bg-red-600 cursor-pointer gap-1 text-sm`}><IconTrash className="w-5" /> Hapus</button>
                  <button type="submit" className={`bg-yellow-400 text-black p-2  rounded-xl flex hover:bg-yellow-500 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}>Update</button>
                </>
              ) : <button type="submit" className={`bg-emerald-950 text-lime-300 p-2  rounded-xl flex hover:bg-emerald-900 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}>Simpan</button>}
              <button type="button" onClick={rekomendasiClose} className="bg-slate-500 p-2 cursor-pointer rounded-xl flex text-white hover:bg-slate-600">Batal</button>
            </div>
          </form>
        </Box>
      </Modal>




      {/* modal Notif material */}
      <Modal
        open={openNotif}
        onClose={notifClose} 
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box className="bg-white rounded-2xl shadow-lg p-4 relative top-1/2 left-1/2 w-[90%] md:w-1/3 transform -translate-x-1/2 -translate-y-1/2 ">
          <form onSubmit={(e) => {selectedReadiness.notif_material ? handleUpdateNotif(e, selectedReadiness.notif_material.id) : handleAddNotif(e)}} method="POST">
            <h1 className="text-xl uppercase text-gray-900 mb-4">
              {selectedReadiness.notif_material ? "Update" : "Tambah"} Notif Material
            </h1>
            <div className="flex flex-col space-y-2">
              <div>
                <label htmlFor="no_notif">No Notif <sup className='text-red-500'>*</sup></label>
                <input
                  type="number"
                  name="no_notif"
                  id="no_notif"
                  placeholder="Masukkan No Notif Material"
                  className="border border-slate-200 rounded-md p-2 w-full bg-transparent outline-none"
                  defaultValue={selectedReadiness.notif_material ? selectedReadiness.notif_material.no_notif : ''}
                  required
                />
              </div>
              <div>
                <label htmlFor="target_date">Target Date <sup className='text-red-500'>*</sup></label>
                <input
                  type="date"
                  name="target_date"
                  id="target_date"
                  className="border border-slate-200 rounded-md p-2 w-full bg-transparent outline-none"
                  defaultValue={selectedReadiness.notif_material ? selectedReadiness.notif_material.target_date : ''}
                  required
                />
              </div>
            </div>
            <div className="flex flex-row space-x-2 justify-end text-center items-center mt-4">
              {selectedReadiness.notif_material?.target_date 
                ? 
                <>
                  <button type="button" onClick={() => handleDeleteNotif(selectedReadiness?.notif_material)} className={`bg-red-500 text-white p-2 rounded-xl flex justify-center items-center hover:bg-red-600 cursor-pointer gap-1 text-sm`}><IconTrash className="w-5" /> Hapus</button>
                  <button type="submit" className={`bg-yellow-400 text-black p-2  rounded-xl flex hover:bg-yellow-500 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}>Update</button> 
                </>
                : <button type="submit" className={`bg-emerald-950 text-lime-300 p-2  rounded-xl flex hover:bg-emerald-900 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}>Simpan</button>
              }
              <button type="button" onClick={notifClose} className="bg-slate-700 p-2 cursor-pointer rounded-xl flex text-white hover:bg-slate-600">Batal</button>
            </div>
          </form>
        </Box>
      </Modal>




      {/* modal Job Plan material */}
      <Modal
        open={openJobPlan}
        onClose={jobPlanClose} 
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box className="bg-white rounded-2xl shadow-lg p-4 relative top-1/2 left-1/2 w-[90%] md:w-1/3 transform -translate-x-1/2 -translate-y-1/2 ">
          <form onSubmit={(e) => {selectedReadiness.job_plan_material ? handleUpdateJobPlan(e, selectedReadiness.job_plan_material.id) : handleAddJobPlan(e)}} method="POST">
            <h1 className="text-xl uppercase text-gray-900 mb-4">
              {selectedReadiness.job_plan_material ? "Update" : "Tambah"} Job Plan Material
            </h1>
            <div className="flex flex-col space-y-2">
              <div>
                <label htmlFor="no_wo">No WO <sup className='text-red-500'>*</sup></label>
                <input
                  type="number"
                  name="no_wo"
                  id="no_wo"
                  placeholder="Masukkan No Wo "
                  className="border border-slate-200 rounded-md p-2 w-full bg-transparent outline-none"
                  defaultValue={selectedReadiness.job_plan_material ? selectedReadiness.job_plan_material.no_wo : ''}
                  required
                />
              </div>
              <div>
                <label htmlFor="kak_file">KAK File</label>
                <input 
                  type="file" 
                  name="kak_file"
                  className="border rounded-md p-2 w-full" />
                  {selectedReadiness?.job_plan_material?.kak_file ? (
                    <div className='flex flex-row justify-between items-center w-full border bg-lime-400 rounded p-1'>
                        <Link
                          to={`${base_public_url}readiness_ta/material/job_plan/kak/${selectedReadiness?.job_plan_material?.kak_file}`}
                          target='_blank'
                          className='text-emerald-950 hover:underline cursor-pointer text-xs'
                        >
                          {selectedReadiness?.job_plan_material?.kak_file}
                        </Link>
                    </div>
                  ) : (
                    ''
                  )}
              </div>
              <div>
                <label htmlFor="kak_file">BOQ File</label>
                <input 
                  type="file" 
                  name="boq_file"
                  className="border rounded-md p-2 w-full" />
                  {selectedReadiness?.job_plan_material?.boq_file ? (
                    <div className='flex flex-row justify-between items-center w-full border bg-lime-400 rounded p-1'>
                        <Link
                          to={`${base_public_url}readiness_ta/material/job_plan/boq/${selectedReadiness?.job_plan_material?.boq_file}`}
                          target='_blank'
                          className='text-emerald-950 hover:underline cursor-pointer text-xs'
                        >
                          {selectedReadiness?.job_plan_material?.boq_file}
                        </Link>
                    </div>
                  ) : (
                    ''
                  )}
              </div>
              <div>
                <label htmlFor="target_date">Target Date <sup className='text-red-500'>*</sup></label>
                <input
                  type="date"
                  name="target_date"
                  id="target_date"
                  className="border border-slate-200 rounded-md p-2 w-full bg-transparent outline-none"
                  defaultValue={selectedReadiness.job_plan_material ? selectedReadiness.job_plan_material.target_date : ''}
                  required
                />
              </div>
            </div>
            <div className="flex flex-row space-x-2 justify-end text-center items-center mt-4">
              {selectedReadiness.job_plan_material?.target_date 
                ? 
                <>
                  {selectedReadiness.job_plan_material?.status == 0 ?
                    <button type="button" onClick={() => handleupdateStatusJobPlan(1, selectedReadiness.job_plan_material.id)} className={`bg-green-500 text-white p-2 rounded-xl flex justify-center items-center hover:bg-green-600 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} gap-1 text-xs`} disabled={isSubmitting}>Selesai</button>
                    : 
                    <button type="button" onClick={() => handleupdateStatusJobPlan(0, selectedReadiness?.job_plan_material.id)} className={`bg-slate-500 text-white p-2 rounded-xl flex justify-center items-center hover:bg-slate-600 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} gap-1 text-xs py-3`} disabled={isSubmitting}>Batalkan Selesai</button>
                  }
                  <button type="submit" className={`bg-yellow-400 text-black p-2 text-xs md:text-sm rounded-xl flex hover:bg-yellow-500 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`} disabled={isSubmitting} >Update</button> 
                  <button type="button" onClick={() => handleDeleteJobPlan(selectedReadiness?.job_plan_material)} className={`bg-red-500 text-white p-2 rounded-xl flex justify-center items-center hover:bg-red-600 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} gap-1 text-xs`} disabled={isSubmitting}><IconTrash className="w-5" /> Hapus</button>
                </>
                : <button type="submit" className={`bg-emerald-950 text-lime-300 p-2  rounded-xl flex hover:bg-emerald-900 text-xs md:text-sm ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`} disabled={isSubmitting}>Simpan</button>
              }
              <button type="button" onClick={jobPlanClose} className="bg-slate-700 p-2 cursor-pointer rounded-xl flex text-white hover:bg-slate-600 text-xs md:text-sm">Batal</button>
            </div>
          </form>
        </Box>
      </Modal>








    </div>
  )
}

export default ReadinessMaterial