import { IconArticle, IconCheck, IconChevronRight, IconLoader2, IconPencil, IconPlus, IconPointFilled, IconRefresh, IconRotateClockwise, IconTrash, IconX } from "@tabler/icons-react"
import { useState } from "react";
import Header from "../components/Header";
import { Breadcrumbs, Modal, Typography, Box, Tooltip, Chip, Stack, Autocomplete, TextField } from "@mui/material";
import { Link, useParams } from "react-router-dom";
import { useEffect } from "react";
import { addReadinessJasa, deleteReadinessJasa, getReadinessJasaByEvent, updateReadinessJasa } from "../services/readiness_jasa.service";
import { getHistoricalMemorandum } from "../services/historical_memorandum.service";
import Swal from "sweetalert2";
import { DataGrid, GridLogicOperator, GridToolbarQuickFilter } from "@mui/x-data-grid";
import { api_public } from "../services/config";
import { addRekomendasiJasa, deleteRekomendasiJasa, updateRekomendasiJasa } from "../services/rekomendasi_jasa.service";
import { addNotifJasa, deleteNotifJasa, updateNotifJasa } from "../services/notif_jasa.service";
import { addJobPlanJasa, deleteJobPlanJasa, updateJobPlanJasa } from "../services/job_plan_jasa.service";
import { addPrJasa, deletePrJasa, updatePrJasa } from "../services/pr_jasa.service";
import { addTenderJasa, deleteTenderJasa, updateTenderJasa } from "../services/tender_jasa.service";
import { addContractJasa, deleteContractJasa, updateContractJasa } from "../services/contract_jasa.service";
import { handleAddActivity } from "../utils/handleAddActivity";
import { getContractByUnPoMaterial } from "../services/contract.service";
import { getEventReadinessById } from "../services/event_readiness.service";

const ReadinessJasa = () => {
  const {event_readiness_id} = useParams();
  const base_public_url = api_public;
    const [hide, setHide] = useState(false);
    const [loading, setLoading] = useState(false);
    const [readinessJasa, setReadinessJasa] = useState([]);
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
    const [openPr, setOpenPr] = useState(false);
    const [openTender, setOpenTender] = useState(false);
    const [openContract, setOpenContract] = useState(false);
    const [contract, setContract] = useState([]);
    const [selectedContract, setSelectedContract] = useState(null);
    const [eventReadiness, setEventReadiness] = useState({});


  useEffect(() => {
    fetchEventReadiness();
    fetchReadinessJasa();
    fetchHistoricalMemorandum();
    fetchContract();
  }, [event_readiness_id]);

  // fetch area

  const fetchReadinessJasa = async () => {
    setLoading(true);
    try {
      const data = await getReadinessJasaByEvent(event_readiness_id);
      setReadinessJasa(data.data);
      console.log(data.data);
    } catch (error) {
      console.error("Error fetching readiness Jasa:", error);
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

  const fetchContract = async () => {
      try {
          setLoading(true);
          const data = await getContractByUnPoMaterial();
          setContract(data.data);
          console.log(data.data);
      } catch (error) {
          console.error("Error fetching contracts PO:", error);
      } finally {
          setLoading(false);
      }
  }

  const fetchEventReadiness = async () => {
      setLoading(true);
      try {
        const data = await getEventReadinessById(event_readiness_id);
        setEventReadiness(data.data);
      } catch (error) {
        console.error("Error fetching Event Readiness:", error);
      } finally {
        setLoading(false);
      }
    };




  
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
    formData.append('event_readiness_id', event_readiness_id);
    formData.append('status', 1);
    console.log(formData);
    try {
      setIsSubmitting(true);
      const res = await addReadinessJasa(formData);
      if (res.success) {
        fetchReadinessJasa();
        Swal.fire("Berhasil!", "Readiness Jasa berhasil ditambahkan!", "success");
        readinessClose();
      } else {
        console.log(res.response.data.errors);
        setValidation(res.response?.data.errors || []);
      }
    } catch (error) {
      console.error("Error adding Readiness Jasa:", error);
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
      const res = await updateReadinessJasa( selectedId, formData);
      if (res.success) {
        fetchReadinessJasa();
        Swal.fire("Berhasil!", "Readiness Jasa berhasil diupdate!", "success");
        readinessClose();
      } else {
        console.log(res.response.data.errors);
        setValidation(res.response?.data.errors || []);
      }
    } catch (error) {
      console.error("Error updating Readiness Jasa:", error);
      setValidation(error.response?.data.errors || []);
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleupdateStatusReadiness = async (status, id) => {
    const formData = new FormData();
    formData.append('status', status);
    try {
      const result = await Swal.fire({
        title: "Apakah Anda yakin?",
        text: status == 0 ? "menyelesaikan Readiness Jasa ini?" : "mengaktifkan kembali Readiness Jasa ini?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yakin!",
        cancelButtonText: "Batal",
      });
      if (result.isConfirmed) {
        setIsSubmitting(true);
        const res = await updateReadinessJasa( id, formData);
        if (res.success) {
          fetchReadinessJasa();
          Swal.fire("Berhasil!", status == 0 ? "Status Readiness Jasa Selesai!" : "Status Readiness Jasa Aktif!", "success");
          readinessClose();
        } else {
          console.log(res.response.data.errors);
          setValidation(res.response?.data.errors || []);
        }
      }
    } catch (error) {
      console.error("Error updating status Readiness Jasa:", error);
      setValidation(error.response?.data.errors || []);
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleDeleteReadiness = async (row) => {
    const result = await Swal.fire({
      title: "Apakah Anda yakin?",
      text: "Data Readiness Jasa akan dihapus secara permanen!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
    });

    if (result.isConfirmed) {
        try {
            const res = await deleteReadinessJasa(row.id);
            if (res.success) {
                Swal.fire("Berhasil!", "Readiness Jasa berhasil dihapus!", "success");
                setReadinessJasa([]);
                fetchReadinessJasa();
            } else {
                Swal.fire("Gagal!", "Terjadi kesalahan saat menghapus Readiness Jasa!", "error");
            }
        } catch (error) {
            console.error("Error deleting readiness Jasa:", error);
            Swal.fire("Gagal!", "Terjadi kesalahan saat readiness Jasa!", "error");
        }
    }
  };
  
    
  
  
  
  // rekomendasi area 

  const rekomendasiOpen = (row) => {
    setOpenRekomendasi(true);
    setSelectedReadiness(row);
    setSelectedId(row.id);
    setSelectedHistoricalMemo(row.rekomendasi_jasa?.historical_memorandum_id ? row.rekomendasi_jasa?.historical_memorandum_id : null);
    setHasMemo(row.rekomendasi_jasa?.historical_memorandum_id ? true : false);

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
    formData.append('readiness_jasa_id', selectedId);
    hasMemo ? formData.append('historical_memorandum_id', selectedHistoricalMemo) : formData.append('rekomendasi_file', e.target.rekomendasi_file.files[0]);
    console.log(formData);
    try {
      setIsSubmitting(true);
      const res = await addRekomendasiJasa(formData);
      if (res.success) {
        fetchReadinessJasa();
        Swal.fire("Berhasil!", "Rekomendasi Jasa berhasil ditambahkan!", "success");
        rekomendasiClose();
      } else {
        console.log(res.response.data.errors);
        setValidation(res.response?.data.errors || []);
      }
    } catch (error) {
      console.error("Error adding Rekomendasi Jasa:", error);
      setValidation(error.response?.data.errors || []);
    } finally {
      setIsSubmitting(false);
    }
  }
  const handleUpdateRekomendasi = async (e, id) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    formData.append('readiness_jasa_id', selectedId);
    hasMemo ? formData.append('historical_memorandum_id', selectedHistoricalMemo) : (e.target.rekomendasi_file.files[0] && formData.append('rekomendasi_file', e.target.rekomendasi_file.files[0]));
    console.log(formData);
    try {
      setIsSubmitting(true);
      const res = await updateRekomendasiJasa(id, formData);
      if (res.success) {
        fetchReadinessJasa();
        Swal.fire("Berhasil!", "Rekomendasi Jasa berhasil di update!", "success");
        rekomendasiClose();
      } else {
        console.log(res.response.data.errors);
        setValidation(res.response?.data.errors || []);
      }
    } catch (error) {
      console.error("Error updating Rekomendasi Jasa:", error);
      setValidation(error.response?.data.errors || []);
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleupdateStatusRekomendasi = async (status, id) => {
    const formData = new FormData();
    formData.append('status', status);
    try {
      setIsSubmitting(true);
      const res = await updateRekomendasiJasa( id, formData);
      if (res.success) {
        fetchReadinessJasa();
        Swal.fire("Berhasil!", "Status Rekomendasi Jasa Berhasil di update!", "success");
        rekomendasiClose();
      } else {
        console.log(res.response.data.errors);
        setValidation(res.response?.data.errors || []);
      }
    } catch (error) {
      console.error("Error updating status Rekomendasi Jasa:", error);
      setValidation(error.response?.data.errors || []);
    } finally {
      setIsSubmitting(false);
    }
  }
  const handleaddStatusRekomendasi = async (status) => {
    const formData = new FormData();
    formData.append('readiness_jasa_id', selectedId);
    formData.append('status', status);
    try {
      setIsSubmitting(true);
      const res = await addRekomendasiJasa(formData);
      if (res.success) {
        fetchReadinessJasa();
        Swal.fire("Berhasil!", "Status Rekomendasi Jasa Berhasil ditambahkan!", "success");
        rekomendasiClose();
      } else {
        console.log(res.response.data.errors);
        setValidation(res.response?.data.errors || []);
      }
    } catch (error) {
      console.error("Error adding status Rekomendasi Jasa:", error);
      setValidation(error.response?.data.errors || []);
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleDeleteRekomendasi = async (row) => {
    setOpenRekomendasi(false);
    const result = await Swal.fire({
      title: "Apakah Anda yakin?",
      text: "Data Rekomendasi Jasa akan dihapus secara permanen!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
    });

    if (result.isConfirmed) {
        try {
            const res = await deleteRekomendasiJasa(row.id);
            if (res.success) {
                Swal.fire("Berhasil!", "Rekomendasi Jasa berhasil dihapus!", "success");
                setReadinessJasa([]);
                fetchReadinessJasa();
            } else {
                Swal.fire("Gagal!", "Terjadi kesalahan saat menghapus Rekomendasi Jasa!", "error");
            }
        } catch (error) {
            console.error("Error deleting Rekomendasi Jasa:", error);
            Swal.fire("Gagal!", "Terjadi kesalahan saat Rekomendasi Jasa!", "error");
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
      formData.append('readiness_jasa_id', selectedId);
      try {
        setIsSubmitting(true);
        const res = await addNotifJasa(formData);
        if (res.success) {
          fetchReadinessJasa();
          Swal.fire("Berhasil!", "Notif Jasa berhasil ditambahkan!", "success");
          notifClose();
        } else {
          console.log(res.response.data.errors);
          setValidation(res.response?.data.errors || []);
        }
      } catch (error) {
        console.error("Error adding Notif Jasa:", error);
        setValidation(error.response?.data.errors || []);
      } finally {
        setIsSubmitting(false);
      }
    }
    const handleUpdateNotif = async (e, id) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      formData.append('readiness_jasa_id', selectedId);
      try {
        setIsSubmitting(true);
        const res = await updateNotifJasa( id, formData);
        if (res.success) {
          fetchReadinessJasa();
          Swal.fire("Berhasil!", "Notif Jasa berhasil diupdate!", "success");
          notifClose();
        } else {
          console.log(res.response.data.errors);
          setValidation(res.response?.data.errors || []);
        }
      } catch (error) {
        console.error("Error updating Notif Jasa:", error);
        setValidation(error.response?.data.errors || []);
      } finally {
        setIsSubmitting(false);
      }
    }
  
    const handleaddStatusNotif = async (status) => {
      const formData = new FormData();
      formData.append('readiness_jasa_id', selectedId);
      formData.append('status', status);
      try {
        setIsSubmitting(true);
        const res = await addNotifJasa(formData);
        if (res.success) {
          fetchReadinessJasa();
          Swal.fire("Berhasil!", "Status Notif Jasa Berhasil ditambahkan!", "success");
          notifClose();
        } else {
          console.log(res.response.data.errors);
          setValidation(res.response?.data.errors || []);
        }
      } catch (error) {
        console.error("Error adding status Notif Jasa:", error);
        setValidation(error.response?.data.errors || []);
      } finally {
        setIsSubmitting(false);
      }
    }
    const handleupdateStatusNotif = async (status, id) => {
      const formData = new FormData();
      formData.append('status', status);
      try {
        setIsSubmitting(true);
        const res = await updateNotifJasa( id, formData);
        if (res.success) {
          fetchReadinessJasa();
          Swal.fire("Berhasil!", "Status Notif Jasa Berhasil di update!", "success");
          notifClose();
        } else {
          console.log(res.response.data.errors);
          setValidation(res.response?.data.errors || []);
        }
      } catch (error) {
        console.error("Error updating status Notif Jasa:", error);
        setValidation(error.response?.data.errors || []);
      } finally {
        setIsSubmitting(false);
      }
    }
  
    const handleDeleteNotif = async (row) => {
      setOpenNotif(false);
      const result = await Swal.fire({
        title: "Apakah Anda yakin?",
        text: "Data Notif Jasa akan dihapus secara permanen!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Ya, hapus!",
        cancelButtonText: "Batal",
      });
  
      if (result.isConfirmed) {
          try {
              const res = await deleteNotifJasa(row.id);
              if (res.success) {
                  Swal.fire("Berhasil!", "Notif Jasa berhasil dihapus!", "success");
                  fetchReadinessJasa();
              } else {
                  Swal.fire("Gagal!", "Terjadi kesalahan saat menghapus Notif Jasa!", "error");
              }
          } catch (error) {
              console.error("Error deleting  Notif Jasa:", error);
              Swal.fire("Gagal!", "Terjadi kesalahan saat Notif Jasa!", "error");
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
      formData.append('readiness_jasa_id', selectedId);
      formData.append('status', 1);
      try {
        setIsSubmitting(true);
        const res = await addJobPlanJasa(formData);
        if (res.success) {
          fetchReadinessJasa();
          Swal.fire("Berhasil!", "Job Plan Jasa berhasil ditambahkan!", "success");
          jobPlanClose();
        } else {
          console.log(res.response.data.errors);
          setValidation(res.response?.data.errors || []);
        }
      } catch (error) {
        console.error("Error adding Job Plan Jasa:", error);
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
        const res = await updateJobPlanJasa( id, formData);
        if (res.success) {
          fetchReadinessJasa();
          Swal.fire("Berhasil!", "Job Plan Jasa berhasil diupdate!", "success");
          jobPlanClose();
        } else {
          console.log(res.response.data.errors);
          setValidation(res.response?.data.errors || []);
        }
      } catch (error) {
        console.error("Error updating Job Plan Jasa:", error);
        setValidation(error.response?.data.errors || []);
      } finally {
        setIsSubmitting(false);
      }
    }
    const handleaddStatusJobPlan = async (status) => {
      const formData = new FormData();
      formData.append('readiness_jasa_id', selectedId);
      formData.append('status', status);
      try {
        setIsSubmitting(true);
        const res = await addJobPlanJasa(formData);
        if (res.success) {
          fetchReadinessJasa();
          Swal.fire("Berhasil!", "Status Job Plan Jasa Berhasil ditambahkan!", "success");
          jobPlanClose();
        } else {
          console.log(res.response.data.errors);
          setValidation(res.response?.data.errors || []);
        }
      } catch (error) {
        console.error("Error adding status Job Plan Jasa:", error);
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
        const res = await updateJobPlanJasa( id, formData);
        if (res.success) {
          fetchReadinessJasa();
          Swal.fire("Berhasil!", "Status Job Plan Jasa Berhasil di update!", "success");
          jobPlanClose();
        } else {
          console.log(res.response.data.errors);
          setValidation(res.response?.data.errors || []);
        }
      } catch (error) {
        console.error("Error updating status Job Plan Jasa:", error);
        setValidation(error.response?.data.errors || []);
      } finally {
        setIsSubmitting(false);
      }
    }
  
    const handleDeleteJobPlan = async (row) => {
      setOpenJobPlan(false);
      const result = await Swal.fire({
        title: "Apakah Anda yakin?",
        text: "Data Job Plan Jasa akan dihapus secara permanen!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Ya, hapus!",
        cancelButtonText: "Batal",
      });
  
      if (result.isConfirmed) {
          try {
              const res = await deleteJobPlanJasa(row.id);
              if (res.success) {
                  Swal.fire("Berhasil!", "Job Plan Jasa berhasil dihapus!", "success");
                  fetchReadinessJasa();
              } else {
                  console.log(res.response.data.errors);
                  Swal.fire("Gagal!", "Terjadi kesalahan saat menghapus Job Plan11 Jasa!", "error");
              }
          } catch (error) {
              console.error("Error deleting  Job Plan Jasa:", error);
              Swal.fire("Gagal!", "Terjadi kesalahan saat Job Plan Jasa!", "error");
          }
      } else {
        setOpenJobPlan(true);
      }
    };
    
    
    
    // PR area
  
    const prOpen = (row) => {
      setOpenPr(true);
      setSelectedReadiness(row);
      setSelectedId(row.id);
    };
  
    const prClose = () => {
      setOpenPr(false);
      setSelectedReadiness([]);
      setSelectedId(null);
      setValidation({});
      setIsSubmitting(false);
    }
  
  
    const handleAddPr = async (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      formData.append('readiness_jasa_id', selectedId);
      try {
        setIsSubmitting(true);
        const res = await addPrJasa(formData);
        if (res.success) {
          fetchReadinessJasa();
          Swal.fire("Berhasil!", "PR Jasa berhasil ditambahkan!", "success");
          prClose();
        } else {
          console.log(res.response.data.errors);
          setValidation(res.response?.data.errors || []);
        }
      } catch (error) {
        console.error("Error adding PR Jasa:", error);
        setValidation(error.response?.data.errors || []);
      } finally {
        setIsSubmitting(false);
      }
    }
    const handleUpdatePr = async (e, id) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      try {
        setIsSubmitting(true);
        const res = await updatePrJasa( id, formData);
        if (res.success) {
          fetchReadinessJasa();
          Swal.fire("Berhasil!", "PR Jasa berhasil diupdate!", "success");
          prClose();
        } else {
          console.log(res.response.data.errors);
          setValidation(res.response?.data.errors || []);
        }
      } catch (error) {
        console.error("Error updating PR Jasa:", error);
        setValidation(error.response?.data.errors || []);
      } finally {
        setIsSubmitting(false);
      }
    }
  
    const handleaddStatusPr = async (status) => {
      const formData = new FormData();
      formData.append('readiness_jasa_id', selectedId);
      formData.append('status', status);
      try {
        setIsSubmitting(true);
        const res = await addPrJasa(formData);
        if (res.success) {
          fetchReadinessJasa();
          Swal.fire("Berhasil!", "Status PR Jasa Berhasil ditambahkan!", "success");
          prClose();
        } else {
          console.log(res.response.data.errors);
          setValidation(res.response?.data.errors || []);
        }
      } catch (error) {
        console.error("Error adding status PR Jasa:", error);
        setValidation(error.response?.data.errors || []);
      } finally {
        setIsSubmitting(false);
      }
    }
    const handleupdateStatusPr = async (status, id) => {
      const formData = new FormData();
      formData.append('status', status);
      try {
        setIsSubmitting(true);
        const res = await updatePrJasa( id, formData);
        if (res.success) {
          fetchReadinessJasa();
          Swal.fire("Berhasil!", "Status PR Jasa Berhasil di update!", "success");
          prClose();
        } else {
          console.log(res.response.data.errors);
          setValidation(res.response?.data.errors || []);
        }
      } catch (error) {
        console.error("Error updating status PR Jasa:", error);
        setValidation(error.response?.data.errors || []);
      } finally {
        setIsSubmitting(false);
      }
    }
  
    const handleDeletePr = async (row) => {
      setOpenPr(false);
      const result = await Swal.fire({
        title: "Apakah Anda yakin?",
        text: "Data PR Jasa akan dihapus secara permanen!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Ya, hapus!",
        cancelButtonText: "Batal",
      });
  
      if (result.isConfirmed) {
          try {
              const res = await deletePrJasa(row.id);
              if (res.success) {
                  Swal.fire("Berhasil!", "PR Jasa berhasil dihapus!", "success");
                  fetchReadinessJasa();
              } else {
                  Swal.fire("Gagal!", "Terjadi kesalahan saat menghapus PR Jasa!", "error");
              }
          } catch (error) {
              console.error("Error deleting  PR Jasa:", error);
              Swal.fire("Gagal!", "Terjadi kesalahan saat PR Jasa!", "error");
          }
      } else {
        setOpenPr(true);
      }
    };
    
    
    
      // Tender area
    
      const tenderOpen = (row) => {
        setOpenTender(true);
        setSelectedReadiness(row);
        setSelectedId(row.id);
      };
    
      const tenderClose = () => {
        setOpenTender(false);
        setSelectedReadiness([]);
        setSelectedId(null);
        setValidation({});
        setIsSubmitting(false);
      }
    
    
      const handleAddTender = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        formData.append('readiness_jasa_id', selectedId);
        formData.append('status', 1);
        // console.log(formData);
        try {
          setIsSubmitting(true);
          const res = await addTenderJasa(formData);
          if (res.success) {
            fetchReadinessJasa();
            Swal.fire("Berhasil!", "Tender Jasa berhasil ditambahkan!", "success");
            tenderClose();
          } else {
            console.log(res.response.data.errors);
            setValidation(res.response?.data.errors || []);
          }
        } catch (error) {
          console.error("Error adding Tender Jasa:", error);
          setValidation(error.response?.data.errors || []);
        } finally {
          setIsSubmitting(false);
        }
      }
      const handleUpdateTender = async (e, id) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        try {
          setIsSubmitting(true);
          const res = await updateTenderJasa( id, formData);
          if (res.success) {
            fetchReadinessJasa();
            Swal.fire("Berhasil!", "Tender Jasa berhasil diupdate!", "success");
            tenderClose();
          } else {
            console.log(res.response.data.errors);
            setValidation(res.response?.data.errors || []);
          }
        } catch (error) {
          console.error("Error updating Tender Jasa:", error);
          setValidation(error.response?.data.errors || []);
        } finally {
          setIsSubmitting(false);
        }
      }
      const handleaddStatusTender = async (status) => {
        const formData = new FormData();
        formData.append('readiness_jasa_id', selectedId);
        formData.append('status', status);
        try {
          setIsSubmitting(true);
          const res = await addTenderJasa(formData);
          if (res.success) {
            fetchReadinessJasa();
            Swal.fire("Berhasil!", "Status Tender Jasa Berhasil ditambahkan!", "success");
            tenderClose();
          } else {
            console.log(res.response.data.errors);
            setValidation(res.response?.data.errors || []);
          }
        } catch (error) {
          console.error("Error adding status Tender Jasa:", error);
          setValidation(error.response?.data.errors || []);
        } finally {
          setIsSubmitting(false);
        }
      }
      const handleupdateStatusTender = async (status, id) => {
        const formData = new FormData();
        formData.append('status', status);
        try {
          setIsSubmitting(true);
          const res = await updateTenderJasa( id, formData);
          if (res.success) {
            fetchReadinessJasa();
            Swal.fire("Berhasil!", "Status Tender Jasa Berhasil di update!", "success");
            tenderClose();
          } else {
            console.log(res.response.data.errors);
            setValidation(res.response?.data.errors || []);
          }
        } catch (error) {
          console.error("Error updating status Tender Jasa:", error);
          setValidation(error.response?.data.errors || []);
        } finally {
          setIsSubmitting(false);
        }
      }
    
      const handleDeleteTender = async (row) => {
        setOpenTender(false);
        const result = await Swal.fire({
          title: "Apakah Anda yakin?",
          text: "Data Tender Jasa akan dihapus secara permanen!",
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Ya, hapus!",
          cancelButtonText: "Batal",
        });
    
        if (result.isConfirmed) {
            try {
                const res = await deleteTenderJasa(row.id);
                if (res.success) {
                    Swal.fire("Berhasil!", "Tender Jasa berhasil dihapus!", "success");
                    fetchReadinessJasa();
                } else {
                    Swal.fire("Gagal!", "Terjadi kesalahan saat menghapus Tender Jasa!", "error");
                }
            } catch (error) {
                console.error("Error deleting  Tender Jasa:", error);
                Swal.fire("Gagal!", "Terjadi kesalahan saat Tender Jasa!", "error");
            }
        } else {
          setOpenTender(true);
        }
      };
    
    
    
      // Contract area
    
      const contractOpen = (row) => {
        console.log('Contract :',row);
        setOpenContract(true);
        setSelectedReadiness(row);
        setSelectedId(row.id);
        setSelectedContract(row.contract_jasa?.contract_id ?? null);
      };
    
      const contractClose = () => {
        setOpenContract(false);
        setSelectedReadiness([]);
        setSelectedId(null);
        setValidation({});
        setIsSubmitting(false);
        setSelectedContract(null);
      }
    
    
      const handleAddContract = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        formData.append('readiness_jasa_id', selectedId);
        selectedContract && formData.append('contract_id', selectedContract);
        formData.append('status', 1);
        // console.log(formData);
        try {
          setIsSubmitting(true);
          const res = await addContractJasa(formData);
          if (res.success) {
            fetchReadinessJasa();
            Swal.fire("Berhasil!", "Contract Jasa berhasil ditambahkan!", "success");
            contractClose();
          } else {
            console.log(res.response.data.errors);
            setValidation(res.response?.data.errors || []);
          }
        } catch (error) {
          console.error("Error adding Contract Jasa:", error);
          setValidation(error.response?.data.errors || []);
        } finally {
          setIsSubmitting(false);
        }
      }
      const handleUpdateContract = async (e, id) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        selectedContract && formData.append('contract_id', selectedContract);
        try {
          setIsSubmitting(true);
          const res = await updateContractJasa( id, formData);
          if (res.success) {
            fetchReadinessJasa();
            Swal.fire("Berhasil!", "Contract Jasa berhasil diupdate!", "success");
            contractClose();
          } else {
            console.log(res.response.data.errors);
            setValidation(res.response?.data.errors || []);
          }
        } catch (error) {
          console.error("Error updating Contract Jasa:", error);
          setValidation(error.response?.data.errors || []);
        } finally {
          setIsSubmitting(false);
        }
      }
      const handleaddStatusContract = async (status) => {
        const formData = new FormData();
        formData.append('readiness_jasa_id', selectedId);
        formData.append('status', status);
        try {
          setIsSubmitting(true);
          const res = await addContractJasa(formData);
          if (res.success) {
            fetchReadinessJasa();
            Swal.fire("Berhasil!", "Status Contract Jasa Berhasil ditambahkan!", "success");
            contractClose();
          } else {
            console.log(res.response.data.errors);
            setValidation(res.response?.data.errors || []);
          }
        } catch (error) {
          console.error("Error adding status Contract Jasa:", error);
          setValidation(error.response?.data.errors || []);
        } finally {
          setIsSubmitting(false);
        }
      }
      const handleupdateStatusContract = async (status, id) => {
        const formData = new FormData();
        formData.append('status', status);
        try {
          setIsSubmitting(true);
          const res = await updateContractJasa( id, formData);
          if (res.success) {
            fetchReadinessJasa();
            Swal.fire("Berhasil!", "Status Contract Jasa Berhasil di update!", "success");
            contractClose();
          } else {
            console.log(res.response.data.errors);
            setValidation(res.response?.data.errors || []);
          }
        } catch (error) {
          console.error("Error updating status Contract Jasa:", error);
          setValidation(error.response?.data.errors || []);
        } finally {
          setIsSubmitting(false);
        }
      }
    
      const handleDeleteContract = async (row) => {
        setOpenContract(false);
        const result = await Swal.fire({
          title: "Apakah Anda yakin?",
          text: "Data Contract Jasa akan dihapus secara permanen!",
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Ya, hapus!",
          cancelButtonText: "Batal",
        });
    
        if (result.isConfirmed) {
            try {
                const res = await deleteContractJasa(row.id);
                if (res.success) {
                    Swal.fire("Berhasil!", "Contract Jasa berhasil dihapus!", "success");
                    fetchReadinessJasa();
                } else {
                    Swal.fire("Gagal!", "Terjadi kesalahan saat menghapus Contract Jasa!", "error");
                }
            } catch (error) {
                console.error("Error deleting Contract Jasa:", error);
                Swal.fire("Gagal!", "Terjadi kesalahan saat Contract Jasa!", "error");
            }
        } else {
          setOpenContract(true);
        }
      };





  // data table area
  
    const columns = [
      { field: 'jasa_name', headerName: 'Nama Jasa', width: 250 },
      { field: 'last_number_status', headerName: 'Notif/WO/PR/PO', width: 200 },
      {
        field: 'rekomendasi_jasa',
        headerName: 'Rekom',
        width: 70,
        renderCell: (params) => (
          <div className='py-4 flex flex-row justify-center items-center'>
            <button
              onClick={() => rekomendasiOpen(params.row)}
              className={params.row?.rekomendasi_jasa?.status == 0 ? 'text-blue-500' : params.row?.rekomendasi_jasa?.status == 1 ? 'text-green-500' : params.row?.rekomendasi_jasa?.status == 2 ? 'text-yellow-500' : params.row?.rekomendasi_jasa?.status == 3 ? 'text-red-500' : 'text-slate-200'}
            >
              <Tooltip title={params.row.rekomendasi_jasa ? 'Lihat Rekomendasi' : 'Tambah Rekomendasi'} placement="left" arrow>  
                <IconPointFilled />
              </Tooltip>
            </button>
          </div>
        ),
      },
      {
        field: 'notif_jasa',
        headerName: 'Notif',
        width: 60,
        renderCell: (params) => (
          <div className='py-4 flex flex-row justify-center items-center'>
            <button
              onClick={() => notifOpen(params.row)}
              className={params.row?.notif_jasa?.status == 0 ? 'text-blue-500' : params.row?.notif_jasa?.status == 1 ? 'text-green-500' : params.row?.notif_jasa?.status == 2 ? 'text-yellow-500' : params.row?.notif_jasa?.status == 3 ? 'text-red-500' : 'text-slate-200'}
            >
              <Tooltip title={params.row?.notif_jasa ? 'Lihat Notifikasi' : 'Tambah Notifikasi'} placement="left" arrow>  
                <IconPointFilled />
              </Tooltip>
            </button>
          </div>
        ),
      },
      {
        field: 'job_plan_jasa',
        headerName: 'Job Plan',
        width: 80,
        renderCell: (params) => (
          <div className='py-4 flex flex-row justify-center items-center'>
            <button
              onClick={() => jobPlanOpen(params.row)}
              className={params.row?.job_plan_jasa?.status == 0 ? 'text-blue-500' : params.row?.job_plan_jasa?.status == 1 ? 'text-green-500' : params.row?.job_plan_jasa?.status == 2 ? 'text-yellow-500' : params.row?.job_plan_jasa?.status == 3 ? 'text-red-500' : 'text-slate-200'}
            >
              <Tooltip title={params.row?.job_plan_jasa ? 'Lihat Job Plan' : 'Tambah Job Plan'} placement="left" arrow>  
                <IconPointFilled />
              </Tooltip>
            </button>
          </div>
        ),
      },
      {
        field: 'pr_jasa',
        headerName: 'PR',
        width: 40,
        renderCell: (params) => (
          <div className='py-4 flex flex-row justify-center items-center'>
            <button
              onClick={() => prOpen(params.row)}
              className={params.row?.pr_jasa?.status == 0 ? 'text-blue-500' : params.row?.pr_jasa?.status == 1 ? 'text-green-500' : params.row?.pr_jasa?.status == 2 ? 'text-yellow-500' : params.row?.pr_jasa?.status == 3 ? 'text-red-500' : 'text-slate-200'}
            >
              <Tooltip title={params.row?.pr_jasa ? 'Lihat PR' : 'Tambah PR'} placement="left" arrow>  
                <IconPointFilled />
              </Tooltip>
            </button>
          </div>
        ),
      },
      {
        field: 'tender_jasa',
        headerName: 'Tender',
        width: 70,
        renderCell: (params) => (
          <div className='py-4 flex flex-row justify-center items-center'>
            <button
              onClick={() => tenderOpen(params.row)}
              className={params.row?.tender_jasa?.status == 0 ? 'text-blue-500' : params.row?.tender_jasa?.status == 1 ? 'text-green-500' : params.row?.tender_jasa?.status == 2 ? 'text-yellow-500' : params.row?.tender_jasa?.status == 3 ? 'text-red-500' : 'text-slate-200'}
            >
              <Tooltip title={params.row?.tender_jasa ? 'Lihat Tender' : 'Tambah Tender'} placement="left" arrow>  
                <IconPointFilled />
              </Tooltip>
            </button>
          </div>
        ),
      },
      {
        field: 'contract_jasa',
        headerName: 'Kontrak',
        width: 70,
        renderCell: (params) => (
          <div className='py-4 flex flex-row justify-center items-center'>
            <button
              onClick={() => contractOpen(params.row)}
              className={params.row?.contract_jasa?.status == 0 ? 'text-blue-500' : params.row?.contract_jasa?.status == 1 ? 'text-green-500' : params.row?.contract_jasa?.status == 2 ? 'text-yellow-500' : params.row?.contract_jasa?.status == 3 ? 'text-red-500' : 'text-slate-200'}
            >
              <Tooltip title={params.row?.contract_jasa ? 'Lihat Contract' : 'Tambah Contract'} placement="left" arrow>  
                <IconPointFilled />
              </Tooltip>
            </button>
          </div>
        ),
      },
      {
        field: 'event_readiness',
        headerName: 'Tanggal TA',
        valueGetter: (params) => {params != null ? (params.event_readiness?.tanggal_ta ?? '-') : '-'},
        width: 140,
        renderCell: (params) => (
          <div className=''>
            {params.row.event_readiness?.tanggal_ta ? new Intl.DateTimeFormat('id-ID', {
              day: '2-digit',
              month: 'long',
              year: 'numeric',
            }).format(new Date(params.row.event_readiness?.tanggal_ta)) : '-'}
          </div>
        ),
      },
      {
        field: 'total_progress',
        headerName: 'Total Progress',
        width: 120,
      },
      {
        field: 'prognosa',
        headerName: 'Prognosa',
        valueGetter: (params) => {params != null ? (params.days_remaining ? params.days_remaining : '-') : null},
        width: 100,
        renderCell: (params) => {
          const color = params.row.prognosa ? (params.row.prognosa.color == 'red' ? 'error' : params.row.prognosa.color == 'yellow' ? 'warning' : 'success') : 'default';
          const title = params.row.prognosa != null ? `remaining: ${params.row.prognosa?.days_remaining ?? '-'}\n|\nTanggal TA : ${params.row.prognosa?.tanggal_ta ?? '-'}\n|\nDurasi Prepare (Job Plan): ${params.row.prognosa?.durasi_preparation ?? '-'}\n `: '-';
          return (
            <div className="flex flex-col justify-center items-center p-2" >
              <Tooltip title={title} placement="top" arrow>
                <Stack direction="row" spacing={1}>
                  <Chip label={params.row.prognosa?.days_remaining ?? '-'} color={color} />
                </Stack>
              </Tooltip>
            </div>
          );
        },
      },
      {
        field: 'ta_status',
        headerName: 'Days to TA',
        valueGetter: (params) => {params != null ? (params.days_remaining ? params.days_remaining : '-') : null},
        width: 100,
        renderCell: (params) => {
          const color = params.row.ta_status ? (params.row.ta_status.color == 'red' ? 'error' : params.row.ta_status.color == 'yellow' ? 'warning' : 'success') : 'default';
          return (
            <div className="flex flex-col justify-center items-center p-2" >
              <Stack direction="row" spacing={1}>
                <Chip label={params.row.ta_status?.days_remaining ?? '-'} color={color} />
              </Stack>
            </div>
          );
        },
      },
      { 
        field: 'status', 
        headerName: 'Status',
        valueGetter: (params) => params == 1 ? 'Aktif' : 'Selesai',
        renderCell: (params) => (
          <div className="flex flex-col justify-center items-center p-2" >
            <Stack direction="row" spacing={1}>
              <Chip label={params.row.status == 1 ? 'Aktif' : 'Selesai'} color={params.row.status == 1 ? 'success' : 'primary'} />
            </Stack>
            
          </div>
        )
      },
      {
        field: 'action',
        headerName: 'Aksi',
        width: 150,
        renderCell: (params) => (
          <div className='py-2 flex flex-row justify-center items-center'>
            { params.row.status == 1 ? 
              <Tooltip title="Selesaikan Readiness" placement="left" arrow>
                <button
                  onClick={() => handleupdateStatusReadiness(0, params.row.id)}
                  className='bg-emerald-950 text-lime-300 text-sm rounded-full px-2 py-1 hover:scale-110 transition duration-100 mr-2 flex items-center space-x-1'
                >
                  <IconCheck />
                </button>
              </Tooltip>
              :
              <Tooltip title="Aktifkan Kembali Readiness" placement="left" arrow>
                <button
  
                  onClick={() => handleupdateStatusReadiness(1, params.row.id)}
                  className='bg-slate-500 text-white text-sm rounded-full px-2 py-1 hover:scale-110 transition duration-100 mr-2 flex items-center space-x-1'
                >
                  <IconRotateClockwise />
                </button>
              </Tooltip>
  
            }
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
                <IconArticle />
            </div>
        </div>
        <div className={` ${hide ? 'block' : 'hidden'}  w-fit bg-emerald-950 text-lime-300 p-2 cursor-pointer rounded-md`} onClick={() => setHide(false)}>
            <IconArticle />
        </div>
        <Breadcrumbs
            aria-label='breadcrumb'
            className="uppercase"
            separator={
            <IconChevronRight className='text-emerald-950' stroke={2} />
            }
        >
            <Link className='hover:underline text-emerald-950' to='/readiness_ta_plantstop'>
            Event
            </Link>
            <Typography className='text-lime-500'>Readiness Ta / Plant Stop Jasa</Typography>
        </Breadcrumbs>
        <div className='w-full bg-white shadow-sm px-2 py-4 rounded-lg space-y-2'>
          <div className='flex flex-row justify-between'>
            <h1 className="text-xl font-bold uppercase ">
              {eventReadiness?.event_name ?? 'Readiness TA / Plant Stop Jasa'}
              <small className='text-xs font-normal'>
                {' ('}
                {eventReadiness?.tanggal_ta
                  ? new Date(eventReadiness.tanggal_ta).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })
                  : ''}
                {')'}
              </small>
            </h1>

            <div className='flex flex-row justify-end items-center space-x-2'>
                <button
                    className='flex space-x-1 items-center px-2 py-1 bg-emerald-950 text-lime-300 text-sm rounded hover:scale-110 transition duration-100'
                    onClick={fetchReadinessJasa}
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
                


                {/* modal readiness jasa */}
                <Modal
                  open={openReadiness}
                  onClose={readinessClose} 
                  aria-labelledby="modal-modal-title"
                  aria-describedby="modal-modal-description"
                >
                  <Box className="bg-white rounded-2xl shadow-lg p-4 relative top-1/2 left-1/2 w-[90%] md:w-1/3 transform -translate-x-1/2 -translate-y-1/2 ">
                    <form onSubmit={(e) => {selectedReadiness.id ? handleUpdateReadiness(e) : handleAddReadiness(e)}} method="POST">
                      <h1 className="text-xl uppercase text-gray-900 mb-4">
                        {selectedReadiness ? "Update" : "Tambah"} Readiness Ta / Plant Stop Jasa
                      </h1>
                      <div className="flex flex-col space-y-2">
                        <div>
                          <label htmlFor="jasa_name">Nama Jasa <sup className='text-red-500'>*</sup></label>
                          <input
                            type="text"
                            name="jasa_name"
                            id="jasa_name"
                            placeholder="Masukkan Nama jasa"
                            className="border border-slate-200 rounded-md p-2 w-full bg-transparent outline-none"
                            defaultValue={selectedReadiness ? selectedReadiness.jasa_name : ''}
                            required
                          />
                          {validation.jasa_name && (
                            validation.jasa_name.map((item, index) => (
                              <div key={index}>
                                <small className="text-red-600 text-sm">{item}</small>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                      <div className="flex flex-row space-x-2 justify-end text-center items-center mt-4">
                        {selectedReadiness.status 
                          ? 
                          <>
                            <button type="submit" className={`bg-yellow-400 text-black p-2  rounded-xl flex hover:bg-yellow-500 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}>Update</button> 
                          </>
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
              rows={readinessJasa}
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
        {/* Keterangan dan status area */}
        <div>
          <ul>
            <li className='text-sm'><span className='font-bold'>Keterangan Icon Status :</span></li>
            <li className='text-sm flex'> <span className='text-blue-500'><IconPointFilled /></span> : Selesai</li>
            <li className='text-sm flex'> <span className='text-green-500'><IconPointFilled /></span> : On Going</li>
            <li className='text-sm flex'> <span className='text-yellow-500'><IconPointFilled /></span> : {'Telat < 1bln'} </li>
            <li className='text-sm flex'> <span className='text-red-500'><IconPointFilled /></span> : {'Telat > 1bln'} </li>
          </ul>
        </div>
      </div>
      
      
      {/* modal rekomendasi */}
      <Modal
        open={openRekomendasi}
        onClose={rekomendasiClose} 
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box className="bg-white rounded-2xl shadow-lg p-4 relative top-1/2 left-1/2 w-[90%] md:w-1/2 transform -translate-x-1/2 -translate-y-1/2 ">
          <form onSubmit={(e) => {selectedReadiness?.rekomendasi_jasa ? handleUpdateRekomendasi(e, selectedReadiness.rekomendasi_jasa.id) : handleAddRekomendasi(e)}} method="POST">
            <h1 className="text-xl uppercase text-gray-900 mb-4">
              {selectedReadiness?.rekomendasi_jasa ? "Update" : "Tambah"} Rekomendasi Jasa <small className='text-xs'>{selectedReadiness.rekomendasi_jasa?.status == 0 ? '(Selesai)' : selectedReadiness.rekomendasi_jasa?.status == 1 ? '(On Going)' : selectedReadiness.rekomendasi_jasa?.status == 2 ? '(Telat < 1bln)' : selectedReadiness.rekomendasi_jasa?.status == 3 ? '(Telat > 1bln)' : ''}</small>
            </h1>
            <div className="flex flex-col space-y-2">
              <div>
                <label htmlFor="inspection_date">Ada Memo ?</label>
                <select defaultValue={hasMemo ? 'yes' : 'no'} onChange={(e) => (e.target.value === 'yes') ? setHasMemo(true) : setHasMemo(false) } className="border rounded-md p-2 w-full">
                  <option value="no">Tidak</option>
                  <option value="yes">Ada</option>
                </select>
                {validation.inspection_date && (
                  validation.inspection_date.map((item, index) => (
                    <div key={index}>
                      <small className="text-red-600 text-sm">{item}</small>
                    </div>
                  ))
                )}
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
                  {selectedReadiness?.rekomendasi_jasa?.historical_memorandum?.memorandum_file ? (
                      <div className='flex flex-row justify-between items-center w-full border bg-lime-400 rounded p-1'>
                          <Link
                            to={`${base_public_url}historical_memorandum/${selectedReadiness?.rekomendasi_jasa?.historical_memorandum?.memorandum_file}`}
                            target='_blank'
                            className='text-emerald-950 hover:underline cursor-pointer text-xs'
                            onClick={() => handleAddActivity(selectedReadiness?.rekomendasi_jasa?.historical_memorandum?.memorandum_file, "READINESS MATERIAL")}
                          >
                            {selectedReadiness?.rekomendasi_jasa?.historical_memorandum?.memorandum_file}
                          </Link>
                      </div>
                    ) : (
                      ''
                  )}
                </div>
                :
                <div>
                  <label htmlFor="rekomendasi_file">Rekomendasi File<sup className='text-red-500'>*</sup></label>
                  <input 
                    type="file" 
                    name="rekomendasi_file"
                    className="border rounded-md p-2 w-full" />
                    {selectedReadiness?.rekomendasi_jasa?.rekomendasi_file ? (
                      <div className='flex flex-row justify-between items-center w-full border bg-lime-400 rounded p-1'>
                          <Link
                            to={`${base_public_url}readiness_ta/jasa/rekomendasi/${selectedReadiness?.rekomendasi_jasa?.rekomendasi_file}`}
                            target='_blank'
                            className='text-emerald-950 hover:underline cursor-pointer text-xs'
                            onClick={() => handleAddActivity(selectedReadiness?.rekomendasi_jasa?.rekomendasi_file, "READINESS JASA")}
                          >
                            {selectedReadiness?.rekomendasi_jasa?.rekomendasi_file}
                          </Link>
                      </div>
                    ) : (
                      ''
                    )}
                    {validation.rekomendasi_file && (
                      validation.rekomendasi_file.map((item, index) => (
                        <div key={index}>
                          <small className="text-red-600 text-sm">{item}</small>
                        </div>
                      ))
                    )}
                </div>
              }
              <div>
                <label htmlFor="target_date">Target Date <sup className='text-red-500'>*</sup></label>
                <input 
                  type="date" 
                  name="target_date"
                  className="border rounded-md p-2 w-full"
                  defaultValue={selectedReadiness?.rekomendasi_jasa?.target_date} 
                   />
                {validation.target_date && (
                  validation.target_date.map((item, index) => (
                    <div key={index}>
                      <small className="text-red-600 text-sm">{item}</small>
                    </div>
                  ))
                )}
              </div>
            </div>
            <div className="flex flex-row space-x-2 justify-end text-center items-center mt-4">
              {selectedReadiness?.rekomendasi_jasa ? (
                <>
                {selectedReadiness.rekomendasi_jasa?.status == 1 ?
                  <>
                    <button type="button" onClick={() => handleupdateStatusRekomendasi(0, selectedReadiness.rekomendasi_jasa.id)} className={`bg-blue-500 text-white p-2 rounded-xl flex justify-center items-center hover:bg-blue-600 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} text-xs`} disabled={isSubmitting}>Selesai</button>
                    <button type="button" onClick={() => handleupdateStatusRekomendasi(2, selectedReadiness.rekomendasi_jasa.id)} className={`bg-yellow-500 text-white p-2 rounded-xl flex justify-center items-center hover:bg-yellow-600 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} text-xs`} disabled={isSubmitting}>{'Telat < 1bln'}</button>
                    <button type="button" onClick={() => handleupdateStatusRekomendasi(3, selectedReadiness.rekomendasi_jasa.id)} className={`bg-red-500 text-white p-2 rounded-xl flex justify-center items-center hover:bg-red-600 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} text-xs`} disabled={isSubmitting}>{'Telat > 1bln'}</button>
                  </>
                  : selectedReadiness.rekomendasi_jasa?.status == 2 ?
                  <>
                    <button type="button" onClick={() => handleupdateStatusRekomendasi(0, selectedReadiness.rekomendasi_jasa.id)} className={`bg-blue-500 text-white p-2 rounded-xl flex justify-center items-center hover:bg-blue-600 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} text-xs`} disabled={isSubmitting}>Selesai</button>
                    <button type="button" onClick={() => handleupdateStatusRekomendasi(1, selectedReadiness.rekomendasi_jasa.id)} className={`bg-green-500 text-white p-2 rounded-xl flex justify-center items-center hover:bg-green-600 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} text-xs`} disabled={isSubmitting}>{'On Going'}</button>
                    <button type="button" onClick={() => handleupdateStatusRekomendasi(3, selectedReadiness.rekomendasi_jasa.id)} className={`bg-red-500 text-white p-2 rounded-xl flex justify-center items-center hover:bg-red-600 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} text-xs`} disabled={isSubmitting}>{'Telat > 1bln'}</button>
                  </>
                  : selectedReadiness.rekomendasi_jasa?.status == 3 ?
                  <>
                    <button type="button" onClick={() => handleupdateStatusRekomendasi(0, selectedReadiness.rekomendasi_jasa.id)} className={`bg-blue-500 text-white p-2 rounded-xl flex justify-center items-center hover:bg-blue-600 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} text-xs`} disabled={isSubmitting}>Selesai</button>
                    <button type="button" onClick={() => handleupdateStatusRekomendasi(1, selectedReadiness.rekomendasi_jasa.id)} className={`bg-green-500 text-white p-2 rounded-xl flex justify-center items-center hover:bg-green-600 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} text-xs`} disabled={isSubmitting}>{'On Going'}</button>
                    <button type="button" onClick={() => handleupdateStatusRekomendasi(2, selectedReadiness.rekomendasi_jasa.id)} className={`bg-yellow-500 text-white p-2 rounded-xl flex justify-center items-center hover:bg-yellow-600 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} text-xs`} disabled={isSubmitting}>{'Telat < 1bln'}</button>
                  </>
                  : 
                  <>
                    <button type="button" onClick={() => handleupdateStatusRekomendasi(1, selectedReadiness.rekomendasi_jasa.id)} className={`bg-green-500 text-white p-2 rounded-xl flex justify-center items-center hover:bg-green-600 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} text-xs`} disabled={isSubmitting}>{'On Going'}</button>
                    <button type="button" onClick={() => handleupdateStatusRekomendasi(2, selectedReadiness.rekomendasi_jasa.id)} className={`bg-yellow-500 text-white p-2 rounded-xl flex justify-center items-center hover:bg-yellow-600 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} text-xs`} disabled={isSubmitting}>{'Telat < 1bln'}</button>
                    <button type="button" onClick={() => handleupdateStatusRekomendasi(3, selectedReadiness.rekomendasi_jasa.id)} className={`bg-red-500 text-white p-2 rounded-xl flex justify-center items-center hover:bg-red-600 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} text-xs`} disabled={isSubmitting}>{'Telat > 1bln'}</button>
                  </>
                }
                  <button type="button" onClick={() => handleDeleteRekomendasi(selectedReadiness?.rekomendasi_jasa)} className={`bg-slate-500 text-white p-2 rounded-xl flex justify-center items-center hover:bg-slate-600 cursor-pointer text-xs`}><IconTrash className="w-4" /> Hapus</button>
                  <button type="submit" className={`bg-slate-500 text-white p-2 text-xs rounded-xl flex hover:bg-slate-600 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} items-center`}> <IconPencil className="w-4" /> Update</button>
                </>
              ) :
                <>
                  <button type="button" onClick={() => handleaddStatusRekomendasi(1)} className={`bg-green-500 text-white p-2 rounded-xl flex justify-center items-center hover:bg-green-600 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} text-xs`} disabled={isSubmitting}>{'On Going'}</button>
                  <button type="button" onClick={() => handleaddStatusRekomendasi(2)} className={`bg-yellow-500 text-white p-2 rounded-xl flex justify-center items-center hover:bg-yellow-600 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} text-xs`} disabled={isSubmitting}>{'Telat < 1bln'}</button>
                  <button type="button" onClick={() => handleaddStatusRekomendasi(3)} className={`bg-red-500 text-white p-2 rounded-xl flex justify-center items-center hover:bg-red-600 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} text-xs`} disabled={isSubmitting}>{'Telat > 1bln'}</button>
                  {/* submit button  */}
                  <button type="submit" className={`bg-emerald-950 text-lime-300 p-2  rounded-xl flex hover:bg-emerald-900 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}>Simpan</button>
                </> 
              }
              <button type="button" onClick={rekomendasiClose} className="bg-slate-500 p-2 cursor-pointer rounded-xl flex text-white hover:bg-slate-600 text-xs items-center"> <IconX className="w-4" /> Batal</button>
            </div>
          </form>
        </Box>
      </Modal>
      
      
      
      
      {/* modal Notif Jasa */}
      <Modal
        open={openNotif}
        onClose={notifClose} 
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box className="bg-white rounded-2xl shadow-lg p-4 relative top-1/2 left-1/2 w-[90%] md:w-1/2 transform -translate-x-1/2 -translate-y-1/2 ">
          <form onSubmit={(e) => {selectedReadiness.notif_jasa ? handleUpdateNotif(e, selectedReadiness.notif_jasa.id) : handleAddNotif(e)}} method="POST">
            <h1 className="text-xl uppercase text-gray-900 mb-4">
              {selectedReadiness.notif_jasa ? "Update" : "Tambah"} Notif Jasa
            </h1>
            <div className="flex flex-col space-y-2">
              <div>
                <label htmlFor="no_notif">No Notif <sup className='text-red-500'>*(max 16)</sup></label>
                <input
                  type="number"
                  name="no_notif"
                  id="no_notif"
                  placeholder="Masukkan No Notif Jasa"
                  className="border border-slate-200 rounded-md p-2 w-full bg-transparent outline-none"
                  defaultValue={selectedReadiness.notif_jasa ? selectedReadiness.notif_jasa.no_notif : ''}
                  required
                />
                {validation.no_notif && (
                  validation.no_notif.map((item, index) => (
                    <div key={index}>
                      <small className="text-red-600 text-sm">{item}</small>
                    </div>
                  ))
                )}
              </div>
              <div>
                <label htmlFor="target_date">Target Date <sup className='text-red-500'>*</sup></label>
                <input
                  type="date"
                  name="target_date"
                  id="target_date"
                  className="border border-slate-200 rounded-md p-2 w-full bg-transparent outline-none"
                  defaultValue={selectedReadiness.notif_jasa ? selectedReadiness.notif_jasa.target_date : ''}
                  
                />
                {validation.target_date && (
                  validation.target_date.map((item, index) => (
                    <div key={index}>
                      <small className="text-red-600 text-sm">{item}</small>
                    </div>
                  ))
                )}
              </div>
            </div>
            <div className="flex flex-row space-x-2 justify-end text-center items-center mt-4">
              {selectedReadiness.notif_jasa 
                ? 
                <>
                  {selectedReadiness.notif_jasa?.status == 1 ?
                    <>
                      <button type="button" onClick={() => handleupdateStatusNotif(0, selectedReadiness.notif_jasa.id)} className={`bg-blue-500 text-white p-2 rounded-xl flex justify-center items-center hover:bg-blue-600 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} text-xs`} disabled={isSubmitting}>Selesai</button>
                      <button type="button" onClick={() => handleupdateStatusNotif(2, selectedReadiness.notif_jasa.id)} className={`bg-yellow-500 text-white p-2 rounded-xl flex justify-center items-center hover:bg-yellow-600 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} text-xs`} disabled={isSubmitting}>{'Telat < 1bln'}</button>
                      <button type="button" onClick={() => handleupdateStatusNotif(3, selectedReadiness.notif_jasa.id)} className={`bg-red-500 text-white p-2 rounded-xl flex justify-center items-center hover:bg-red-600 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} text-xs`} disabled={isSubmitting}>{'Telat > 1bln'}</button>
                    </>
                    : selectedReadiness.notif_jasa?.status == 2 ?
                    <>
                      <button type="button" onClick={() => handleupdateStatusNotif(0, selectedReadiness.notif_jasa.id)} className={`bg-blue-500 text-white p-2 rounded-xl flex justify-center items-center hover:bg-blue-600 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} text-xs`} disabled={isSubmitting}>Selesai</button>
                      <button type="button" onClick={() => handleupdateStatusNotif(1, selectedReadiness.notif_jasa.id)} className={`bg-green-500 text-white p-2 rounded-xl flex justify-center items-center hover:bg-green-600 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} text-xs`} disabled={isSubmitting}>{'On Going'}</button>
                      <button type="button" onClick={() => handleupdateStatusNotif(3, selectedReadiness.notif_jasa.id)} className={`bg-red-500 text-white p-2 rounded-xl flex justify-center items-center hover:bg-red-600 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} text-xs`} disabled={isSubmitting}>{'Telat > 1bln'}</button>
                    </>
                    : selectedReadiness.notif_jasa?.status == 3 ?
                    <>
                      <button type="button" onClick={() => handleupdateStatusNotif(0, selectedReadiness.notif_jasa.id)} className={`bg-blue-500 text-white p-2 rounded-xl flex justify-center items-center hover:bg-blue-600 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} text-xs`} disabled={isSubmitting}>Selesai</button>
                      <button type="button" onClick={() => handleupdateStatusNotif(1, selectedReadiness.notif_jasa.id)} className={`bg-green-500 text-white p-2 rounded-xl flex justify-center items-center hover:bg-green-600 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} text-xs`} disabled={isSubmitting}>{'On Going'}</button>
                      <button type="button" onClick={() => handleupdateStatusNotif(2, selectedReadiness.notif_jasa.id)} className={`bg-yellow-500 text-white p-2 rounded-xl flex justify-center items-center hover:bg-yellow-600 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} text-xs`} disabled={isSubmitting}>{'Telat < 1bln'}</button>
                    </>
                    : 
                    <>
                      <button type="button" onClick={() => handleupdateStatusNotif(1, selectedReadiness.notif_jasa.id)} className={`bg-green-500 text-white p-2 rounded-xl flex justify-center items-center hover:bg-green-600 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} text-xs`} disabled={isSubmitting}>{'On Going'}</button>
                      <button type="button" onClick={() => handleupdateStatusNotif(2, selectedReadiness.notif_jasa.id)} className={`bg-yellow-500 text-white p-2 rounded-xl flex justify-center items-center hover:bg-yellow-600 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} text-xs`} disabled={isSubmitting}>{'Telat < 1bln'}</button>
                      <button type="button" onClick={() => handleupdateStatusNotif(3, selectedReadiness.notif_jasa.id)} className={`bg-red-500 text-white p-2 rounded-xl flex justify-center items-center hover:bg-red-600 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} text-xs`} disabled={isSubmitting}>{'Telat > 1bln'}</button>
                    </>
                  }
                  <button type="button" onClick={() => handleDeleteNotif(selectedReadiness?.notif_jasa)} className={`bg-slate-500 text-white p-2 rounded-xl flex justify-center items-center hover:bg-slate-600 cursor-pointer text-xs`}><IconTrash className="w-4" /> Hapus</button>
                  <button type="submit" className={`bg-slate-500 text-xs text-white p-2  rounded-xl flex hover:bg-slate-600 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} items-center`}> <IconPencil className="w-4" /> Update</button> 
                </>
                :
                <>
                  <button type="button" onClick={() => handleaddStatusNotif(1)} className={`bg-green-500 text-white p-2 rounded-xl flex justify-center items-center hover:bg-green-600 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} text-xs`} disabled={isSubmitting}>{'On Going'}</button>
                  <button type="button" onClick={() => handleaddStatusNotif(2)} className={`bg-yellow-500 text-white p-2 rounded-xl flex justify-center items-center hover:bg-yellow-600 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} text-xs`} disabled={isSubmitting}>{'Telat < 1bln'}</button>
                  <button type="button" onClick={() => handleaddStatusNotif(3)} className={`bg-red-500 text-white p-2 rounded-xl flex justify-center items-center hover:bg-red-600 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} text-xs`} disabled={isSubmitting}>{'Telat > 1bln'}</button>
                  {/* submit button  */}
                  <button type="submit" className={`bg-emerald-950 text-lime-300 p-2  rounded-xl flex hover:bg-emerald-900 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}>Simpan</button>
                </>
              }
              <button type="button" onClick={notifClose} className="bg-slate-500 p-2 cursor-pointer rounded-xl flex text-white hover:bg-slate-600 text-xs items-center"> <IconX className="w-4" /> Batal</button>
            </div>
          </form>
        </Box>
      </Modal>
      
      
      
      
      {/* modal Job Plan jasa */}
      <Modal
        open={openJobPlan}
        onClose={jobPlanClose} 
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box className="bg-white rounded-2xl shadow-lg p-4 relative top-1/2 left-1/2 w-[90%] md:w-1/2 transform -translate-x-1/2 -translate-y-1/2 ">
          <form onSubmit={(e) => {selectedReadiness.job_plan_jasa ? handleUpdateJobPlan(e, selectedReadiness.job_plan_jasa.id) : handleAddJobPlan(e)}} method="POST">
            <h1 className="text-xl uppercase text-gray-900 mb-4">
              {selectedReadiness.job_plan_jasa ? "Update" : "Tambah"} Job Plan Jasa
            </h1>
            <div className="flex flex-col space-y-2">
              <div>
                <label htmlFor="no_wo">No WO <sup className='text-red-500'>*(max 16)</sup></label>
                <input
                  type="number"
                  name="no_wo"
                  id="no_wo"
                  placeholder="Masukkan No Wo "
                  className="border border-slate-200 rounded-md p-2 w-full bg-transparent outline-none"
                  defaultValue={selectedReadiness.job_plan_jasa ? selectedReadiness.job_plan_jasa.no_wo : ''}
                  required
                />
                {validation.no_wo && (
                  validation.no_wo.map((item, index) => (
                    <div key={index}>
                      <small className="text-red-600 text-sm">{item}</small>
                    </div>
                  ))
                )}
              </div>
              <div>
                <label htmlFor="durasi_preparation">Durasi Preparation Pekerjaan & Tender <sup className='text-red-500'>*</sup></label>
                <input
                  type="number"
                  name="durasi_preparation"
                  id="durasi_preparation"
                  placeholder="Masukkan No Wo "
                  className="border border-slate-200 rounded-md p-2 w-full bg-transparent outline-none"
                  defaultValue={selectedReadiness.job_plan_jasa ? selectedReadiness.job_plan_jasa.durasi_preparation : ''}
                  required
                />
                {validation.durasi_preparation && (
                  validation.durasi_preparation.map((item, index) => (
                    <div key={index}>
                      <small className="text-red-600 text-sm">{item}</small>
                    </div>
                  ))
                )}
              </div>
              <div>
                <label htmlFor="kak_file">KAK File</label>
                <input 
                  type="file" 
                  name="kak_file"
                  className="border rounded-md p-2 w-full" />
                  {selectedReadiness?.job_plan_jasa?.kak_file ? (
                    <div className='flex flex-row justify-between items-center w-full border bg-lime-400 rounded p-1'>
                        <Link
                          to={`${base_public_url}readiness_ta/jasa/job_plan/kak/${selectedReadiness?.job_plan_jasa?.kak_file}`}
                          target='_blank'
                          className='text-emerald-950 hover:underline cursor-pointer text-xs'
                          onClick={() => handleAddActivity(selectedReadiness?.job_plan_jasa?.kak_file, "READINESS JASA")}
                        >
                          {selectedReadiness?.job_plan_jasa?.kak_file}
                        </Link>
                    </div>
                  ) : (
                    ''
                  )}
                  {validation.kak_file && (
                    validation.kak_file.map((item, index) => (
                      <div key={index}>
                        <small className="text-red-600 text-sm">{item}</small>
                      </div>
                    ))
                  )}
              </div>
              <div>
                <label htmlFor="kak_file">BOQ File</label>
                <input 
                  type="file" 
                  name="boq_file"
                  className="border rounded-md p-2 w-full" />
                  {selectedReadiness?.job_plan_jasa?.boq_file ? (
                    <div className='flex flex-row justify-between items-center w-full border bg-lime-400 rounded p-1'>
                        <Link
                          to={`${base_public_url}readiness_ta/jasa/job_plan/boq/${selectedReadiness?.job_plan_jasa?.boq_file}`}
                          target='_blank'
                          className='text-emerald-950 hover:underline cursor-pointer text-xs'
                          onClick={() => handleAddActivity(selectedReadiness?.job_plan_jasa?.boq_file, "READINESS JASA")}
                        >
                          {selectedReadiness?.job_plan_jasa?.boq_file}
                        </Link>
                    </div>
                  ) : (
                    ''
                  )}
                  {validation.boq_file && (
                    validation.boq_file.map((item, index) => (
                      <div key={index}>
                        <small className="text-red-600 text-sm">{item}</small>
                      </div>
                    ))
                  )}
              </div>
              <div>
                <label htmlFor="target_date">Target Date <sup className='text-red-500'>*</sup></label>
                <input
                  type="date"
                  name="target_date"
                  id="target_date"
                  className="border border-slate-200 rounded-md p-2 w-full bg-transparent outline-none"
                  defaultValue={selectedReadiness.job_plan_jasa ? selectedReadiness.job_plan_jasa.target_date : ''}
                  
                />
                {validation.target_date && (
                  validation.target_date.map((item, index) => (
                    <div key={index}>
                      <small className="text-red-600 text-sm">{item}</small>
                    </div>
                  ))
                )}
              </div>
            </div>
            <div className="flex flex-row space-x-2 justify-end text-center items-center mt-4">
              {selectedReadiness.job_plan_jasa 
                ? 
                <>
                  {selectedReadiness.job_plan_jasa?.status == 1 ?
                    <>
                      <button type="button" onClick={() => handleupdateStatusJobPlan(0, selectedReadiness.job_plan_jasa.id)} className={`bg-blue-500 text-white p-2 rounded-xl flex justify-center items-center hover:bg-blue-600 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} text-xs`} disabled={isSubmitting}>Selesai</button>
                      <button type="button" onClick={() => handleupdateStatusJobPlan(2, selectedReadiness.job_plan_jasa.id)} className={`bg-yellow-500 text-white p-2 rounded-xl flex justify-center items-center hover:bg-yellow-600 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} text-xs`} disabled={isSubmitting}>{'Telat < 1bln'}</button>
                      <button type="button" onClick={() => handleupdateStatusJobPlan(3, selectedReadiness.job_plan_jasa.id)} className={`bg-red-500 text-white p-2 rounded-xl flex justify-center items-center hover:bg-red-600 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} text-xs`} disabled={isSubmitting}>{'Telat > 1bln'}</button>
                    </>
                    : selectedReadiness.job_plan_jasa?.status == 2 ?
                    <>
                      <button type="button" onClick={() => handleupdateStatusJobPlan(0, selectedReadiness.job_plan_jasa.id)} className={`bg-blue-500 text-white p-2 rounded-xl flex justify-center items-center hover:bg-blue-600 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} text-xs`} disabled={isSubmitting}>Selesai</button>
                      <button type="button" onClick={() => handleupdateStatusJobPlan(1, selectedReadiness.job_plan_jasa.id)} className={`bg-green-500 text-white p-2 rounded-xl flex justify-center items-center hover:bg-green-600 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} text-xs`} disabled={isSubmitting}>{'On Going'}</button>
                      <button type="button" onClick={() => handleupdateStatusJobPlan(3, selectedReadiness.job_plan_jasa.id)} className={`bg-red-500 text-white p-2 rounded-xl flex justify-center items-center hover:bg-red-600 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} text-xs`} disabled={isSubmitting}>{'Telat > 1bln'}</button>
                    </>
                    : selectedReadiness.job_plan_jasa?.status == 3 ?
                    <>
                      <button type="button" onClick={() => handleupdateStatusJobPlan(0, selectedReadiness.job_plan_jasa.id)} className={`bg-blue-500 text-white p-2 rounded-xl flex justify-center items-center hover:bg-blue-600 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} text-xs`} disabled={isSubmitting}>Selesai</button>
                      <button type="button" onClick={() => handleupdateStatusJobPlan(1, selectedReadiness.job_plan_jasa.id)} className={`bg-green-500 text-white p-2 rounded-xl flex justify-center items-center hover:bg-green-600 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} text-xs`} disabled={isSubmitting}>{'On Going'}</button>
                      <button type="button" onClick={() => handleupdateStatusJobPlan(2, selectedReadiness.job_plan_jasa.id)} className={`bg-yellow-500 text-white p-2 rounded-xl flex justify-center items-center hover:bg-yellow-600 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} text-xs`} disabled={isSubmitting}>{'Telat < 1bln'}</button>
                    </>
                    : 
                    <>
                      <button type="button" onClick={() => handleupdateStatusJobPlan(1, selectedReadiness.job_plan_jasa.id)} className={`bg-green-500 text-white p-2 rounded-xl flex justify-center items-center hover:bg-green-600 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} text-xs`} disabled={isSubmitting}>{'On Going'}</button>
                      <button type="button" onClick={() => handleupdateStatusJobPlan(2, selectedReadiness.job_plan_jasa.id)} className={`bg-yellow-500 text-white p-2 rounded-xl flex justify-center items-center hover:bg-yellow-600 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} text-xs`} disabled={isSubmitting}>{'Telat < 1bln'}</button>
                      <button type="button" onClick={() => handleupdateStatusJobPlan(3, selectedReadiness.job_plan_jasa.id)} className={`bg-red-500 text-white p-2 rounded-xl flex justify-center items-center hover:bg-red-600 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} text-xs`} disabled={isSubmitting}>{'Telat > 1bln'}</button>
                    </>
                  }
                  <button type="button" onClick={() => handleDeleteJobPlan(selectedReadiness?.job_plan_jasa)} className={`bg-slate-500 text-white p-2 rounded-xl flex justify-center items-center hover:bg-slate-600 cursor-pointer text-xs`}><IconTrash className="w-4" /> Hapus</button>
                  <button type="submit" className={`bg-slate-500 text-xs text-white p-2  rounded-xl flex hover:bg-slate-600 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} items-center`}> <IconPencil className="w-4" /> Update</button> 
                </>
                :
                <>
                  <button type="button" onClick={() => handleaddStatusJobPlan(1)} className={`bg-green-500 text-white p-2 rounded-xl flex justify-center items-center hover:bg-green-600 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} text-xs`} disabled={isSubmitting}>{'On Going'}</button>
                  <button type="button" onClick={() => handleaddStatusJobPlan(2)} className={`bg-yellow-500 text-white p-2 rounded-xl flex justify-center items-center hover:bg-yellow-600 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} text-xs`} disabled={isSubmitting}>{'Telat < 1bln'}</button>
                  <button type="button" onClick={() => handleaddStatusJobPlan(3)} className={`bg-red-500 text-white p-2 rounded-xl flex justify-center items-center hover:bg-red-600 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} text-xs`} disabled={isSubmitting}>{'Telat > 1bln'}</button>
                  {/* submit button  */}
                  <button type="submit" className={`bg-emerald-950 text-lime-300 p-2  rounded-xl flex hover:bg-emerald-900 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}>Simpan</button>
                </> 
              }
              <button type="button" onClick={jobPlanClose} className="bg-slate-500 p-2 cursor-pointer rounded-xl flex text-white hover:bg-slate-600 text-xs items-center"> <IconX className="w-4" /> Batal</button>
            </div>
          </form>
        </Box>
      </Modal>
      
      
      
      
      {/* modal PR Jasa */}
      <Modal
        open={openPr}
        onClose={prClose} 
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box className="bg-white rounded-2xl shadow-lg p-4 relative top-1/2 left-1/2 w-[90%] md:w-1/2 transform -translate-x-1/2 -translate-y-1/2 ">
          <form onSubmit={(e) => {selectedReadiness.pr_jasa ? handleUpdatePr(e, selectedReadiness.pr_jasa.id) : handleAddPr(e)}} method="POST">
            <h1 className="text-xl uppercase text-gray-900 mb-4">
              {selectedReadiness.pr_jasa ? "Update" : "Tambah"} PR Jasa
            </h1>
            <div className="flex flex-col space-y-2">
              <div>
                <label htmlFor="no_pr">No PR <sup className='text-red-500'>*(max 16)</sup></label>
                <input
                  type="number"
                  name="no_pr"
                  id="no_pr"
                  placeholder="Masukkan No PR Jasa"
                  className="border border-slate-200 rounded-md p-2 w-full bg-transparent outline-none"
                  defaultValue={selectedReadiness.pr_jasa ? selectedReadiness.pr_jasa.no_pr : ''}
                  required
                />
                {validation.no_pr && (
                  validation.no_pr.map((item, index) => (
                    <div key={index}>
                      <small className="text-red-600 text-sm">{item}</small>
                    </div>
                  ))
                )}
              </div>
              <div>
                <label htmlFor="target_date">Target Date <sup className='text-red-500'>*</sup></label>
                <input
                  type="date"
                  name="target_date"
                  id="target_date"
                  className="border border-slate-200 rounded-md p-2 w-full bg-transparent outline-none"
                  defaultValue={selectedReadiness.pr_jasa ? selectedReadiness.pr_jasa.target_date : ''}
                  
                />
                {validation.target_date && (
                  validation.target_date.map((item, index) => (
                    <div key={index}>
                      <small className="text-red-600 text-sm">{item}</small>
                    </div>
                  ))
                )}
              </div>
            </div>
            <div className="flex flex-row space-x-2 justify-end text-center items-center mt-4">
              {selectedReadiness.pr_jasa 
                ? 
                <>
                  {selectedReadiness.pr_jasa?.status == 1 ?
                    <>
                      <button type="button" onClick={() => handleupdateStatusPr(0, selectedReadiness.pr_jasa.id)} className={`bg-blue-500 text-white p-2 rounded-xl flex justify-center items-center hover:bg-blue-600 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} text-xs`} disabled={isSubmitting}>Selesai</button>
                      <button type="button" onClick={() => handleupdateStatusPr(2, selectedReadiness.pr_jasa.id)} className={`bg-yellow-500 text-white p-2 rounded-xl flex justify-center items-center hover:bg-yellow-600 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} text-xs`} disabled={isSubmitting}>{'Telat < 1bln'}</button>
                      <button type="button" onClick={() => handleupdateStatusPr(3, selectedReadiness.pr_jasa.id)} className={`bg-red-500 text-white p-2 rounded-xl flex justify-center items-center hover:bg-red-600 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} text-xs`} disabled={isSubmitting}>{'Telat > 1bln'}</button>
                    </>
                    : selectedReadiness.pr_jasa?.status == 2 ?
                    <>
                      <button type="button" onClick={() => handleupdateStatusPr(0, selectedReadiness.pr_jasa.id)} className={`bg-blue-500 text-white p-2 rounded-xl flex justify-center items-center hover:bg-blue-600 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} text-xs`} disabled={isSubmitting}>Selesai</button>
                      <button type="button" onClick={() => handleupdateStatusPr(1, selectedReadiness.pr_jasa.id)} className={`bg-green-500 text-white p-2 rounded-xl flex justify-center items-center hover:bg-green-600 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} text-xs`} disabled={isSubmitting}>{'On Going'}</button>
                      <button type="button" onClick={() => handleupdateStatusPr(3, selectedReadiness.pr_jasa.id)} className={`bg-red-500 text-white p-2 rounded-xl flex justify-center items-center hover:bg-red-600 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} text-xs`} disabled={isSubmitting}>{'Telat > 1bln'}</button>
                    </>
                    : selectedReadiness.pr_jasa?.status == 3 ?
                    <>
                      <button type="button" onClick={() => handleupdateStatusPr(0, selectedReadiness.pr_jasa.id)} className={`bg-blue-500 text-white p-2 rounded-xl flex justify-center items-center hover:bg-blue-600 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} text-xs`} disabled={isSubmitting}>Selesai</button>
                      <button type="button" onClick={() => handleupdateStatusPr(1, selectedReadiness.pr_jasa.id)} className={`bg-green-500 text-white p-2 rounded-xl flex justify-center items-center hover:bg-green-600 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} text-xs`} disabled={isSubmitting}>{'On Going'}</button>
                      <button type="button" onClick={() => handleupdateStatusPr(2, selectedReadiness.pr_jasa.id)} className={`bg-yellow-500 text-white p-2 rounded-xl flex justify-center items-center hover:bg-yellow-600 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} text-xs`} disabled={isSubmitting}>{'Telat < 1bln'}</button>
                    </>
                    : 
                    <>
                      <button type="button" onClick={() => handleupdateStatusPr(1, selectedReadiness.pr_jasa.id)} className={`bg-green-500 text-white p-2 rounded-xl flex justify-center items-center hover:bg-green-600 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} text-xs`} disabled={isSubmitting}>{'On Going'}</button>
                      <button type="button" onClick={() => handleupdateStatusPr(2, selectedReadiness.pr_jasa.id)} className={`bg-yellow-500 text-white p-2 rounded-xl flex justify-center items-center hover:bg-yellow-600 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} text-xs`} disabled={isSubmitting}>{'Telat < 1bln'}</button>
                      <button type="button" onClick={() => handleupdateStatusPr(3, selectedReadiness.pr_jasa.id)} className={`bg-red-500 text-white p-2 rounded-xl flex justify-center items-center hover:bg-red-600 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} text-xs`} disabled={isSubmitting}>{'Telat > 1bln'}</button>
                    </>
                  }
                  <button type="button" onClick={() => handleDeletePr(selectedReadiness?.pr_jasa)} className={`bg-slate-500 text-white p-2 rounded-xl flex justify-center items-center hover:bg-slate-600 cursor-pointer text-xs`}><IconTrash className="w-4" /> Hapus</button>
                  <button type="submit" className={`bg-slate-500 text-xs text-white p-2  rounded-xl flex hover:bg-slate-600 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} items-center`}> <IconPencil className="w-4" /> Update</button> 
                </>
                :
                <>
                  <button type="button" onClick={() => handleaddStatusPr(1)} className={`bg-green-500 text-white p-2 rounded-xl flex justify-center items-center hover:bg-green-600 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} text-xs`} disabled={isSubmitting}>{'On Going'}</button>
                  <button type="button" onClick={() => handleaddStatusPr(2)} className={`bg-yellow-500 text-white p-2 rounded-xl flex justify-center items-center hover:bg-yellow-600 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} text-xs`} disabled={isSubmitting}>{'Telat < 1bln'}</button>
                  <button type="button" onClick={() => handleaddStatusPr(3)} className={`bg-red-500 text-white p-2 rounded-xl flex justify-center items-center hover:bg-red-600 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} text-xs`} disabled={isSubmitting}>{'Telat > 1bln'}</button>
                  {/* submit button  */}
                  <button type="submit" className={`bg-emerald-950 text-lime-300 p-2  rounded-xl flex hover:bg-emerald-900 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}>Simpan</button>
                </> 
              }
              <button type="button" onClick={prClose} className="bg-slate-500 p-2 cursor-pointer rounded-xl flex text-white hover:bg-slate-600 text-xs items-center"> <IconX className="w-4" /> Batal</button>
            </div>
          </form>
        </Box>
      </Modal>
      
      
      
      
      {/* modal Tender Jasa */}
      <Modal
        open={openTender}
        onClose={tenderClose} 
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box className="bg-white rounded-2xl shadow-lg p-4 relative top-1/2 left-1/2 w-[90%] md:w-1/2 transform -translate-x-1/2 -translate-y-1/2 ">
          <form onSubmit={(e) => {selectedReadiness.tender_jasa ? handleUpdateTender(e, selectedReadiness.tender_jasa.id) : handleAddTender(e)}} method="POST">
            <h1 className="text-xl uppercase text-gray-900 mb-4">
              {selectedReadiness.tender_jasa ? "Update" : "Tambah"} Tender Jasa
            </h1>
            <div className="flex flex-col space-y-2">
              <div>
                <label htmlFor="description">Keterangan <sup className='text-red-500'>*</sup></label>
                <input
                  type="text"
                  name="description"
                  id="description"
                  placeholder="Masukkan Keterangan Tender Jasa"
                  className="border border-slate-200 rounded-md p-2 w-full bg-transparent outline-none"
                  defaultValue={selectedReadiness.tender_jasa ? selectedReadiness.tender_jasa.description : ''}
                  required
                />
                {validation.description && (
                  validation.description.map((item, index) => (
                    <div key={index}>
                      <small className="text-red-600 text-sm">{item}</small>
                    </div>
                  ))
                )}
              </div>
              <div>
                <label htmlFor="target_date">Target Date <sup className='text-red-500'>*</sup></label>
                <input
                  type="date"
                  name="target_date"
                  id="target_date"
                  className="border border-slate-200 rounded-md p-2 w-full bg-transparent outline-none"
                  defaultValue={selectedReadiness.tender_jasa ? selectedReadiness.tender_jasa.target_date : ''}
                  
                />
                {validation.target_date && (
                  validation.target_date.map((item, index) => (
                    <div key={index}>
                      <small className="text-red-600 text-sm">{item}</small>
                    </div>
                  ))
                )}
              </div>
            </div>
            <div className="flex flex-row space-x-2 justify-end text-center items-center mt-4">
              {selectedReadiness.tender_jasa 
                ? 
                <>
                  {selectedReadiness.tender_jasa?.status == 1 ?
                    <>
                      <button type="button" onClick={() => handleupdateStatusTender(0, selectedReadiness.tender_jasa.id)} className={`bg-blue-500 text-white p-2 rounded-xl flex justify-center items-center hover:bg-blue-600 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} text-xs`} disabled={isSubmitting}>Selesai</button>
                      <button type="button" onClick={() => handleupdateStatusTender(2, selectedReadiness.tender_jasa.id)} className={`bg-yellow-500 text-white p-2 rounded-xl flex justify-center items-center hover:bg-yellow-600 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} text-xs`} disabled={isSubmitting}>{'Telat < 1bln'}</button>
                      <button type="button" onClick={() => handleupdateStatusTender(3, selectedReadiness.tender_jasa.id)} className={`bg-red-500 text-white p-2 rounded-xl flex justify-center items-center hover:bg-red-600 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} text-xs`} disabled={isSubmitting}>{'Telat > 1bln'}</button>
                    </>
                    : selectedReadiness.tender_jasa?.status == 2 ?
                    <>
                      <button type="button" onClick={() => handleupdateStatusTender(0, selectedReadiness.tender_jasa.id)} className={`bg-blue-500 text-white p-2 rounded-xl flex justify-center items-center hover:bg-blue-600 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} text-xs`} disabled={isSubmitting}>Selesai</button>
                      <button type="button" onClick={() => handleupdateStatusTender(1, selectedReadiness.tender_jasa.id)} className={`bg-green-500 text-white p-2 rounded-xl flex justify-center items-center hover:bg-green-600 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} text-xs`} disabled={isSubmitting}>{'On Going'}</button>
                      <button type="button" onClick={() => handleupdateStatusTender(3, selectedReadiness.tender_jasa.id)} className={`bg-red-500 text-white p-2 rounded-xl flex justify-center items-center hover:bg-red-600 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} text-xs`} disabled={isSubmitting}>{'Telat > 1bln'}</button>
                    </>
                    : selectedReadiness.tender_jasa?.status == 3 ?
                    <>
                      <button type="button" onClick={() => handleupdateStatusTender(0, selectedReadiness.tender_jasa.id)} className={`bg-blue-500 text-white p-2 rounded-xl flex justify-center items-center hover:bg-blue-600 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} text-xs`} disabled={isSubmitting}>Selesai</button>
                      <button type="button" onClick={() => handleupdateStatusTender(1, selectedReadiness.tender_jasa.id)} className={`bg-green-500 text-white p-2 rounded-xl flex justify-center items-center hover:bg-green-600 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} text-xs`} disabled={isSubmitting}>{'On Going'}</button>
                      <button type="button" onClick={() => handleupdateStatusTender(2, selectedReadiness.tender_jasa.id)} className={`bg-yellow-500 text-white p-2 rounded-xl flex justify-center items-center hover:bg-yellow-600 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} text-xs`} disabled={isSubmitting}>{'Telat < 1bln'}</button>
                    </>
                    : 
                    <>
                      <button type="button" onClick={() => handleupdateStatusTender(1, selectedReadiness.tender_jasa.id)} className={`bg-green-500 text-white p-2 rounded-xl flex justify-center items-center hover:bg-green-600 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} text-xs`} disabled={isSubmitting}>{'On Going'}</button>
                      <button type="button" onClick={() => handleupdateStatusTender(2, selectedReadiness.tender_jasa.id)} className={`bg-yellow-500 text-white p-2 rounded-xl flex justify-center items-center hover:bg-yellow-600 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} text-xs`} disabled={isSubmitting}>{'Telat < 1bln'}</button>
                      <button type="button" onClick={() => handleupdateStatusTender(3, selectedReadiness.tender_jasa.id)} className={`bg-red-500 text-white p-2 rounded-xl flex justify-center items-center hover:bg-red-600 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} text-xs`} disabled={isSubmitting}>{'Telat > 1bln'}</button>
                    </>
                  }
                  <button type="button" onClick={() => handleDeleteTender(selectedReadiness?.tender_jasa)} className={`bg-slate-500 text-white p-2 rounded-xl flex justify-center items-center hover:bg-slate-600 cursor-pointer text-xs`}><IconTrash className="w-4" /> Hapus</button>
                  <button type="submit" className={`bg-slate-500 text-xs text-white p-2  rounded-xl flex hover:bg-slate-600 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} items-center`}> <IconPencil className="w-4" /> Update</button> 
                </>
                :
                <>
                  <button type="button" onClick={() => handleaddStatusTender(1)} className={`bg-green-500 text-white p-2 rounded-xl flex justify-center items-center hover:bg-green-600 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} text-xs`} disabled={isSubmitting}>{'On Going'}</button>
                  <button type="button" onClick={() => handleaddStatusTender(2)} className={`bg-yellow-500 text-white p-2 rounded-xl flex justify-center items-center hover:bg-yellow-600 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} text-xs`} disabled={isSubmitting}>{'Telat < 1bln'}</button>
                  <button type="button" onClick={() => handleaddStatusTender(3)} className={`bg-red-500 text-white p-2 rounded-xl flex justify-center items-center hover:bg-red-600 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} text-xs`} disabled={isSubmitting}>{'Telat > 1bln'}</button>
                  {/* submit button  */}
                  <button type="submit" className={`bg-emerald-950 text-lime-300 p-2  rounded-xl flex hover:bg-emerald-900 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}>Simpan</button>
                </> 
              }
              <button type="button" onClick={tenderClose} className="bg-slate-500 p-2 cursor-pointer rounded-xl flex text-white hover:bg-slate-600 text-xs items-center"> <IconX className="w-4" /> Batal</button>
            </div>
          </form>
        </Box>
      </Modal>
      
      
      
      
      {/* modal Contract Jasa */}
      <Modal
        open={openContract}
        onClose={contractClose} 
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box className="bg-white rounded-2xl shadow-lg p-4 relative top-1/2 left-1/2 w-[90%] md:w-1/2 transform -translate-x-1/2 -translate-y-1/2 ">
          <form onSubmit={(e) => {selectedReadiness.contract_jasa ? handleUpdateContract(e, selectedReadiness.contract_jasa.id) : handleAddContract(e)}} method="POST">
            <h1 className="text-xl uppercase text-gray-900 mb-4">
              {selectedReadiness.contract_jasa ? "Update" : "Tambah"} Contract Jasa
            </h1>
            <div className="flex flex-row space-x-1">
              <div className="flex flex-col w-full space-y-2">
                <label htmlFor="contract">Pilih Contract<sup className='text-red-500'>*</sup></label>
                <Autocomplete
                  id="contract"
                  options={Array.isArray(contract) ? contract : []}
                  getOptionLabel={(option) => `${option?.contract_name ?? ''}`}
                  isOptionEqualToValue={(option, value) => option.id === value.id}
                  value={contract.find((item) => item.id === selectedContract) || null}
                  onChange={(e, value) => {
                      setSelectedContract(value?.id || null);
                  }}
                  required
                  renderInput={(params) => (
                  <TextField
                      {...params}
                      name="contract_id" // Tambahkan name di sini
                      placeholder={'N/A'}
                      variant="outlined"
                      error={!!validation.contract_id}
                      helperText={
                      validation.contract_id &&
                      validation.contract_id.map((item, index) => (
                          <span key={index} className="text-red-600 text-sm">
                          {item}
                          </span>
                      ))
                      }
                  />
                  )}
                />
                {selectedReadiness?.contract_jasa?.contract?.contract_file ? (
                    <div className='flex flex-row justify-between items-center w-full border bg-lime-400 rounded p-1'>
                        <Link
                          to={`${base_public_url}contract/${selectedReadiness?.contract_jasa?.contract?.contract_file}`}
                          target='_blank'
                          className='text-emerald-950 hover:underline cursor-pointer text-xs'
                          onClick={() => handleAddActivity(selectedReadiness?.contract_jasa?.contract?.contract_file, "READINESS MATERIAL")}
                        >
                          {selectedReadiness?.contract_jasa?.contract?.contract_file}
                        </Link>
                    </div>
                  ) : (
                    ''
                )}
              </div>
              <Tooltip title="Tambah Contract" placement="left">
                <Link to={`/contract/tambah`} className="self-end mb-2 text-xs bg-blue-500 p-2 rounded-xl text-white hover:bg-blue-600 flex justify-center items-center">
                  <IconPlus className="w-6" />
                </Link>
              </Tooltip>
            </div>
            <div className="flex flex-row space-x-2 justify-end text-center items-center mt-4">
              {selectedReadiness.contract_jasa 
                ? 
                <>
                  {selectedReadiness.contract_jasa?.status == 1 ?
                    <>
                      <button type="button" onClick={() => handleupdateStatusContract(0, selectedReadiness.contract_jasa.id)} className={`bg-blue-500 text-white p-2 rounded-xl flex justify-center items-center hover:bg-blue-600 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} text-xs`} disabled={isSubmitting}>Selesai</button>
                      <button type="button" onClick={() => handleupdateStatusContract(2, selectedReadiness.contract_jasa.id)} className={`bg-yellow-500 text-white p-2 rounded-xl flex justify-center items-center hover:bg-yellow-600 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} text-xs`} disabled={isSubmitting}>{'Telat < 1bln'}</button>
                      <button type="button" onClick={() => handleupdateStatusContract(3, selectedReadiness.contract_jasa.id)} className={`bg-red-500 text-white p-2 rounded-xl flex justify-center items-center hover:bg-red-600 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} text-xs`} disabled={isSubmitting}>{'Telat > 1bln'}</button>
                    </>
                    : selectedReadiness.contract_jasa?.status == 2 ?
                    <>
                      <button type="button" onClick={() => handleupdateStatusContract(0, selectedReadiness.contract_jasa.id)} className={`bg-blue-500 text-white p-2 rounded-xl flex justify-center items-center hover:bg-blue-600 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} text-xs`} disabled={isSubmitting}>Selesai</button>
                      <button type="button" onClick={() => handleupdateStatusContract(1, selectedReadiness.contract_jasa.id)} className={`bg-green-500 text-white p-2 rounded-xl flex justify-center items-center hover:bg-green-600 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} text-xs`} disabled={isSubmitting}>{'On Going'}</button>
                      <button type="button" onClick={() => handleupdateStatusContract(3, selectedReadiness.contract_jasa.id)} className={`bg-red-500 text-white p-2 rounded-xl flex justify-center items-center hover:bg-red-600 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} text-xs`} disabled={isSubmitting}>{'Telat > 1bln'}</button>
                    </>
                    : selectedReadiness.contract_jasa?.status == 3 ?
                    <>
                      <button type="button" onClick={() => handleupdateStatusContract(0, selectedReadiness.contract_jasa.id)} className={`bg-blue-500 text-white p-2 rounded-xl flex justify-center items-center hover:bg-blue-600 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} text-xs`} disabled={isSubmitting}>Selesai</button>
                      <button type="button" onClick={() => handleupdateStatusContract(1, selectedReadiness.contract_jasa.id)} className={`bg-green-500 text-white p-2 rounded-xl flex justify-center items-center hover:bg-green-600 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} text-xs`} disabled={isSubmitting}>{'On Going'}</button>
                      <button type="button" onClick={() => handleupdateStatusContract(2, selectedReadiness.contract_jasa.id)} className={`bg-yellow-500 text-white p-2 rounded-xl flex justify-center items-center hover:bg-yellow-600 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} text-xs`} disabled={isSubmitting}>{'Telat < 1bln'}</button>
                    </>
                    : 
                    <>
                      <button type="button" onClick={() => handleupdateStatusContract(1, selectedReadiness.contract_jasa.id)} className={`bg-green-500 text-white p-2 rounded-xl flex justify-center items-center hover:bg-green-600 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} text-xs`} disabled={isSubmitting}>{'On Going'}</button>
                      <button type="button" onClick={() => handleupdateStatusContract(2, selectedReadiness.contract_jasa.id)} className={`bg-yellow-500 text-white p-2 rounded-xl flex justify-center items-center hover:bg-yellow-600 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} text-xs`} disabled={isSubmitting}>{'Telat < 1bln'}</button>
                      <button type="button" onClick={() => handleupdateStatusContract(3, selectedReadiness.contract_jasa.id)} className={`bg-red-500 text-white p-2 rounded-xl flex justify-center items-center hover:bg-red-600 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} text-xs`} disabled={isSubmitting}>{'Telat > 1bln'}</button>
                    </>
                  }
                  <button type="button" onClick={() => handleDeleteContract(selectedReadiness?.contract_jasa)} className={`bg-slate-500 text-white p-2 rounded-xl flex justify-center items-center hover:bg-slate-600 cursor-pointer text-xs`}><IconTrash className="w-4" /> Hapus</button>
                  <button type="submit" className={`bg-slate-500 text-xs text-white p-2  rounded-xl flex hover:bg-slate-600 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} items-center`}> <IconPencil className="w-4" /> Update</button> 
                </>
                :
                <>
                  <button type="button" onClick={() => handleaddStatusContract(1)} className={`bg-green-500 text-white p-2 rounded-xl flex justify-center items-center hover:bg-green-600 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} text-xs`} disabled={isSubmitting}>{'On Going'}</button>
                  <button type="button" onClick={() => handleaddStatusContract(2)} className={`bg-yellow-500 text-white p-2 rounded-xl flex justify-center items-center hover:bg-yellow-600 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} text-xs`} disabled={isSubmitting}>{'Telat < 1bln'}</button>
                  <button type="button" onClick={() => handleaddStatusContract(3)} className={`bg-red-500 text-white p-2 rounded-xl flex justify-center items-center hover:bg-red-600 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} text-xs`} disabled={isSubmitting}>{'Telat > 1bln'}</button>
                  {/* submit button  */}
                  <button type="submit" className={`bg-emerald-950 text-lime-300 p-2  rounded-xl flex hover:bg-emerald-900 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}>Simpan</button>
                </> 
              }
              <button type="button" onClick={contractClose} className="bg-slate-500 p-2 cursor-pointer rounded-xl flex text-white hover:bg-slate-600 text-xs items-center"> <IconX className="w-4" /> Batal</button>
            </div>
          </form>
        </Box>
      </Modal>



    </div>
  )
}

export default ReadinessJasa