import { IconArrowLeft, IconArrowRight, IconCheck, IconChevronRight, IconLoader2, IconPencil, IconPlus, IconPointFilled, IconRefresh, IconRotateClockwise, IconTrash, IconX } from "@tabler/icons-react"
import { useState } from "react";
import Header from "../components/Header";
import { addReadinessMaterial, deleteReadinessMaterial, getReadinessMaterialByEvent, updateReadinessMaterial } from "../services/readiness_material.service";
import { useEffect } from "react";
import { DataGrid, GridLogicOperator, GridToolbarQuickFilter } from "@mui/x-data-grid";
import { Autocomplete, Box, Breadcrumbs, Chip, Modal, Stack, TextField, Tooltip, Typography } from "@mui/material";
import { getHistoricalMemorandum } from "../services/historical_memorandum.service";
import Swal from "sweetalert2";
import { addRekomendasiMaterial, deleteRekomendasiMaterial, updateRekomendasiMaterial } from "../services/rekomendasi_material.service";
import { Link, useParams } from "react-router-dom";
import { api_public } from "../services/config";
import { addNotifMaterial, deleteNotifMaterial, updateNotifMaterial } from "../services/notif_material.service";
import { addJobPlanMaterial, deleteJobPlanMaterial, updateJobPlanMaterial } from "../services/job_plan_material.service";
import { addPrMaterial, deletePrMaterial, updatePrMaterial } from "../services/pr_material.service";
import { addTenderMaterial, deleteTenderMaterial, updateTenderMaterial } from "../services/tender_material.service";
import { addPoMaterial, deletePoMaterial, updatePoMaterial } from "../services/po_material.service";
import { addFabrikasiMaterial, deleteFabrikasiMaterial, updateFabrikasiMaterial } from "../services/fabrikasi_material.service";
import { addDeliveryMaterial, deleteDeliveryMaterial, updateDeliveryMaterial } from "../services/delivery_material.service";

const ReadinessMaterial = () => {
  const { event_readiness_id } = useParams();
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
  const [openPr, setOpenPr] = useState(false);
  const [openTender, setOpenTender] = useState(false);
  const [openPo, setOpenPo] = useState(false);
  const [openFabrikasi, setOpenFabrikasi] = useState(false);
  const [openDelivery, setOpenDelivery] = useState(false);

  

  useEffect(() => {
    fetchReadinessMaterial();
    fetchHistoricalMemorandum();
  }, [event_readiness_id]);

  // fetch area

  const fetchReadinessMaterial = async () => {
    setLoading(true);
    try {
      const data = await getReadinessMaterialByEvent(event_readiness_id);
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
    formData.append('event_readiness_id', event_readiness_id);
    formData.append('status', 1);
    console.log(formData);
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

  const handleupdateStatusReadiness = async (status, id) => {
    const formData = new FormData();
    formData.append('status', status);
    try {
      const result = await Swal.fire({
        title: "Apakah Anda yakin?",
        text: status == 0 ? "menyelesaikan Readiness Material ini?" : "mengaktifkan kembali Readiness Material ini?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yakin!",
        cancelButtonText: "Batal",
      });
      if (result.isConfirmed) {
        setIsSubmitting(true);
        const res = await updateReadinessMaterial( id, formData);
        if (res.success) {
          fetchReadinessMaterial();
          Swal.fire("Berhasil!", "Status Readiness Material berhasil diupdate!", "success");
          readinessClose();
        } else {
          console.log(res.response.data.errors);
          setValidation(res.response?.data.errors || []);
        }
      }
    } catch (error) {
      console.error("Error updating status Readiness Material:", error);
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
    setHasMemo(row.rekomendasi_material?.historical_memorandum_id ? true : false);

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
    hasMemo ? formData.append('historical_memorandum_id', selectedHistoricalMemo) : (e.target.rekomendasi_file.files[0] && formData.append('rekomendasi_file', e.target.rekomendasi_file.files[0]));
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

  const handleupdateStatusRekomendasi = async (status, id) => {
    const formData = new FormData();
    formData.append('status', status);
    try {
      setIsSubmitting(true);
      const res = await updateRekomendasiMaterial( id, formData);
      if (res.success) {
        fetchReadinessMaterial();
        Swal.fire("Berhasil!", "Status Rekomendasi Material berhasil diupdate!", "success");
        rekomendasiClose();
      } else {
        console.log(res.response.data.errors);
        setValidation(res.response?.data.errors || []);
      }
    } catch (error) {
      console.error("Error updating status Rekomendasi Material:", error);
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

  const handleupdateStatusNotif = async (status, id) => {
    const formData = new FormData();
    formData.append('status', status);
    try {
      setIsSubmitting(true);
      const res = await updateNotifMaterial( id, formData);
      if (res.success) {
        fetchReadinessMaterial();
        Swal.fire("Berhasil!", "Status Notif Material berhasil diupdate!", "success");
        notifClose();
      } else {
        console.log(res.response.data.errors);
        setValidation(res.response?.data.errors || []);
      }
    } catch (error) {
      console.error("Error updating status Notif Material:", error);
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
    formData.append('status', 1);
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
        Swal.fire("Berhasil!", "Status Job Plan Material berhasil diupdate!", "success");
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
    formData.append('readiness_material_id', selectedId);
    try {
      setIsSubmitting(true);
      const res = await addPrMaterial(formData);
      if (res.success) {
        fetchReadinessMaterial();
        Swal.fire("Berhasil!", "PR Material berhasil ditambahkan!", "success");
        prClose();
      } else {
        console.log(res.response.data.errors);
        setValidation(res.response?.data.errors || []);
      }
    } catch (error) {
      console.error("Error adding PR Material:", error);
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
      const res = await updatePrMaterial( id, formData);
      if (res.success) {
        fetchReadinessMaterial();
        Swal.fire("Berhasil!", "PR Material berhasil diupdate!", "success");
        prClose();
      } else {
        console.log(res.response.data.errors);
        setValidation(res.response?.data.errors || []);
      }
    } catch (error) {
      console.error("Error updating PR Material:", error);
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
      const res = await updatePrMaterial( id, formData);
      if (res.success) {
        fetchReadinessMaterial();
        Swal.fire("Berhasil!", "Status PR Material berhasil diupdate!", "success");
        prClose();
      } else {
        console.log(res.response.data.errors);
        setValidation(res.response?.data.errors || []);
      }
    } catch (error) {
      console.error("Error updating status PR Material:", error);
      setValidation(error.response?.data.errors || []);
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleDeletePr = async (row) => {
    setOpenPr(false);
    const result = await Swal.fire({
      title: "Apakah Anda yakin?",
      text: "Data PR Material akan dihapus secara permanen!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
    });

    if (result.isConfirmed) {
        try {
            const res = await deletePrMaterial(row.id);
            if (res.success) {
                Swal.fire("Berhasil!", "PR Material berhasil dihapus!", "success");
                fetchReadinessMaterial();
            } else {
                Swal.fire("Gagal!", "Terjadi kesalahan saat menghapus PR Material!", "error");
            }
        } catch (error) {
            console.error("Error deleting  PR material:", error);
            Swal.fire("Gagal!", "Terjadi kesalahan saat PR material!", "error");
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
    formData.append('readiness_material_id', selectedId);
    formData.append('status', 1);
    try {
      setIsSubmitting(true);
      const res = await addTenderMaterial(formData);
      if (res.success) {
        fetchReadinessMaterial();
        Swal.fire("Berhasil!", "Tender Material berhasil ditambahkan!", "success");
        tenderClose();
      } else {
        console.log(res.response.data.errors);
        setValidation(res.response?.data.errors || []);
      }
    } catch (error) {
      console.error("Error adding Tender Material:", error);
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
      const res = await updateTenderMaterial( id, formData);
      if (res.success) {
        fetchReadinessMaterial();
        Swal.fire("Berhasil!", "Tender Material berhasil diupdate!", "success");
        tenderClose();
      } else {
        console.log(res.response.data.errors);
        setValidation(res.response?.data.errors || []);
      }
    } catch (error) {
      console.error("Error updating Tender Material:", error);
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
      const res = await updateTenderMaterial( id, formData);
      if (res.success) {
        fetchReadinessMaterial();
        Swal.fire("Berhasil!", "Status Tender Material berhasil diupdate!", "success");
        tenderClose();
      } else {
        console.log(res.response.data.errors);
        setValidation(res.response?.data.errors || []);
      }
    } catch (error) {
      console.error("Error updating status Tender Material:", error);
      setValidation(error.response?.data.errors || []);
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleDeleteTender = async (row) => {
    setOpenTender(false);
    const result = await Swal.fire({
      title: "Apakah Anda yakin?",
      text: "Data Tender Material akan dihapus secara permanen!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
    });

    if (result.isConfirmed) {
        try {
            const res = await deleteTenderMaterial(row.id);
            if (res.success) {
                Swal.fire("Berhasil!", "Tender Material berhasil dihapus!", "success");
                fetchReadinessMaterial();
            } else {
                Swal.fire("Gagal!", "Terjadi kesalahan saat menghapus Tender Material!", "error");
            }
        } catch (error) {
            console.error("Error deleting  Tender material:", error);
            Swal.fire("Gagal!", "Terjadi kesalahan saat Tender material!", "error");
        }
    } else {
      setOpenTender(true);
    }
  };



  // PO area

  const poOpen = (row) => {
    setOpenPo(true);
    setSelectedReadiness(row);
    setSelectedId(row.id);
  };

  const poClose = () => {
    setOpenPo(false);
    setSelectedReadiness([]);
    setSelectedId(null);
    setValidation({});
    setIsSubmitting(false);
  }


  const handleAddPo = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    formData.append('readiness_material_id', selectedId);
    try {
      setIsSubmitting(true);
      const res = await addPoMaterial(formData);
      if (res.success) {
        fetchReadinessMaterial();
        Swal.fire("Berhasil!", "PO Material berhasil ditambahkan!", "success");
        poClose();
      } else {
        console.log(res.response.data.errors);
        setValidation(res.response?.data.errors || []);
      }
    } catch (error) {
      console.error("Error adding PO Material:", error);
      setValidation(error.response?.data.errors || []);
    } finally {
      setIsSubmitting(false);
    }
  }
  const handleUpdatePo = async (e, id) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    try {
      setIsSubmitting(true);
      const res = await updatePoMaterial( id, formData);
      if (res.success) {
        fetchReadinessMaterial();
        Swal.fire("Berhasil!", "PO Material berhasil diupdate!", "success");
        poClose();
      } else {
        console.log(res.response.data.errors);
        setValidation(res.response?.data.errors || []);
      }
    } catch (error) {
      console.error("Error updating PO Material:", error);
      setValidation(error.response?.data.errors || []);
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleupdateStatusPo = async (status, id) => {
    const formData = new FormData();
    formData.append('status', status);
    try {
      setIsSubmitting(true);
      const res = await updatePoMaterial( id, formData);
      if (res.success) {
        fetchReadinessMaterial();
        Swal.fire("Berhasil!", "Status PO Material berhasil diupdate!", "success");
        poClose();
      } else {
        console.log(res.response.data.errors);
        setValidation(res.response?.data.errors || []);
      }
    } catch (error) {
      console.error("Error updating status PO Material:", error);
      setValidation(error.response?.data.errors || []);
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleDeletePo = async (row) => {
    setOpenPo(false);
    const result = await Swal.fire({
      title: "Apakah Anda yakin?",
      text: "Data PO Material akan dihapus secara permanen!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
    });

    if (result.isConfirmed) {
        try {
            const res = await deletePoMaterial(row.id);
            if (res.success) {
                Swal.fire("Berhasil!", "PO Material berhasil dihapus!", "success");
                fetchReadinessMaterial();
            } else {
                Swal.fire("Gagal!", "Terjadi kesalahan saat menghapus PO Material!", "error");
            }
        } catch (error) {
            console.error("Error deleting  PO material:", error);
            Swal.fire("Gagal!", "Terjadi kesalahan saat PO material!", "error");
        }
    } else {
      setOpenPo(true);
    }
  };



  // Fabrikasi area

  const fabrikasiOpen = (row) => {
    setOpenFabrikasi(true);
    setSelectedReadiness(row);
    setSelectedId(row.id);
  };

  const fabrikasiClose = () => {
    setOpenFabrikasi(false);
    setSelectedReadiness([]);
    setSelectedId(null);
    setValidation({});
    setIsSubmitting(false);
  }


  const handleAddFabrikasi = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    formData.append('readiness_material_id', selectedId);
    formData.append('status', 1);
    try {
      setIsSubmitting(true);
      const res = await addFabrikasiMaterial(formData);
      if (res.success) {
        fetchReadinessMaterial();
        Swal.fire("Berhasil!", "Fabrikasi Material berhasil ditambahkan!", "success");
        fabrikasiClose();
      } else {
        console.log(res.response.data.errors);
        setValidation(res.response?.data.errors || []);
      }
    } catch (error) {
      console.error("Error adding Fabrikasi Material:", error);
      setValidation(error.response?.data.errors || []);
    } finally {
      setIsSubmitting(false);
    }
  }
  const handleUpdateFabrikasi = async (e, id) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    try {
      setIsSubmitting(true);
      const res = await updateFabrikasiMaterial( id, formData);
      if (res.success) {
        fetchReadinessMaterial();
        Swal.fire("Berhasil!", "Fabrikasi Material berhasil diupdate!", "success");
        fabrikasiClose();
      } else {
        console.log(res.response.data.errors);
        setValidation(res.response?.data.errors || []);
      }
    } catch (error) {
      console.error("Error updating Fabrikasi Material:", error);
      setValidation(error.response?.data.errors || []);
    } finally {
      setIsSubmitting(false);
    }
  }
  const handleupdateStatusFabrikasi = async (status, id) => {
    const formData = new FormData();
    formData.append('status', status);
    try {
      setIsSubmitting(true);
      const res = await updateFabrikasiMaterial( id, formData);
      if (res.success) {
        fetchReadinessMaterial();
        Swal.fire("Berhasil!", "Status Fabrikasi Material berhasil diupdate!", "success");
        fabrikasiClose();
      } else {
        console.log(res.response.data.errors);
        setValidation(res.response?.data.errors || []);
      }
    } catch (error) {
      console.error("Error updating status Fabrikasi Material:", error);
      setValidation(error.response?.data.errors || []);
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleDeleteFabrikasi = async (row) => {
    setOpenFabrikasi(false);
    const result = await Swal.fire({
      title: "Apakah Anda yakin?",
      text: "Data Fabrikasi Material akan dihapus secara permanen!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
    });

    if (result.isConfirmed) {
        try {
            const res = await deleteFabrikasiMaterial(row.id);
            if (res.success) {
                Swal.fire("Berhasil!", "Fabrikasi Material berhasil dihapus!", "success");
                fetchReadinessMaterial();
            } else {
                Swal.fire("Gagal!", "Terjadi kesalahan saat menghapus Fabrikasi Material!", "error");
            }
        } catch (error) {
            console.error("Error deleting  Fabrikasi material:", error);
            Swal.fire("Gagal!", "Terjadi kesalahan saat Fabrikasi material!", "error");
        }
    } else {
      setOpenFabrikasi(true);
    }
  };



  // Delivery area

  const deliveryOpen = (row) => {
    setOpenDelivery(true);
    setSelectedReadiness(row);
    setSelectedId(row.id);
  };

  const deliveryClose = () => {
    setOpenDelivery(false);
    setSelectedReadiness([]);
    setSelectedId(null);
    setValidation({});
    setIsSubmitting(false);
  }


  const handleAddDelivery = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    formData.append('readiness_material_id', selectedId);
    formData.append('status', 1);
    try {
      setIsSubmitting(true);
      const res = await addDeliveryMaterial(formData);
      if (res.success) {
        fetchReadinessMaterial();
        Swal.fire("Berhasil!", "Delivery Material berhasil ditambahkan!", "success");
        deliveryClose();
      } else {
        console.log(res.response.data.errors);
        setValidation(res.response?.data.errors || []);
      }
    } catch (error) {
      console.error("Error adding Delivery Material:", error);
      setValidation(error.response?.data.errors || []);
    } finally {
      setIsSubmitting(false);
    }
  }
  const handleUpdateDelivery = async (e, id) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    try {
      setIsSubmitting(true);
      const res = await updateDeliveryMaterial( id, formData);
      if (res.success) {
        fetchReadinessMaterial();
        Swal.fire("Berhasil!", "Delivery Material berhasil diupdate!", "success");
        deliveryClose();
      } else {
        console.log(res.response.data.errors);
        setValidation(res.response?.data.errors || []);
      }
    } catch (error) {
      console.error("Error updating Delivery Material:", error);
      setValidation(error.response?.data.errors || []);
    } finally {
      setIsSubmitting(false);
    }
  }
  const handleupdateStatusDelivery = async (status, id) => {
    const formData = new FormData();
    formData.append('status', status);
    try {
      setIsSubmitting(true);
      const res = await updateDeliveryMaterial( id, formData);
      if (res.success) {
        fetchReadinessMaterial();
        Swal.fire("Berhasil!", "Status Delivery Material berhasil diupdate!", "success");
        deliveryClose();
      } else {
        console.log(res.response.data.errors);
        setValidation(res.response?.data.errors || []);
      }
    } catch (error) {
      console.error("Error updating status Delivery Material:", error);
      setValidation(error.response?.data.errors || []);
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleDeleteDelivery = async (row) => {
    setOpenDelivery(false);
    const result = await Swal.fire({
      title: "Apakah Anda yakin?",
      text: "Data Delivery Material akan dihapus secara permanen!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
    });

    if (result.isConfirmed) {
        try {
            const res = await deleteDeliveryMaterial(row.id);
            if (res.success) {
                Swal.fire("Berhasil!", "Delivery Material berhasil dihapus!", "success");
                fetchReadinessMaterial();
            } else {
                Swal.fire("Gagal!", "Terjadi kesalahan saat menghapus Delivery Material!", "error");
            }
        } catch (error) {
            console.error("Error deleting  Delivery material:", error);
            Swal.fire("Gagal!", "Terjadi kesalahan saat Delivery material!", "error");
        }
    } else {
      setOpenDelivery(true);
    }
  };






  // data table area

  const columns = [
    { field: 'material_name', headerName: 'Nama Material', width: 250 },
    { field: 'last_number_status', headerName: 'Notif/WO/PR/PO', width: 200 },
    {
      field: 'rekomendasi_material',
      headerName: 'Rekom',
      width: 70,
      renderCell: (params) => (
        <div className='py-4 flex flex-row justify-center items-center'>
          <button
            onClick={() => rekomendasiOpen(params.row)}
            className={params.row?.rekomendasi_material?.status == 0 ? 'text-blue-500' : params.row?.rekomendasi_material?.status == 1 ? 'text-green-500' : params.row?.rekomendasi_material?.status == 2 ? 'text-yellow-500' : params.row?.rekomendasi_material?.status == 3 ? 'text-red-500' : 'text-slate-200'}
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
      width: 60,
      renderCell: (params) => (
        <div className='py-4 flex flex-row justify-center items-center'>
          <button
            onClick={() => notifOpen(params.row)}
            className={params.row?.notif_material?.status == 0 ? 'text-blue-500' : params.row?.notif_material?.status == 1 ? 'text-green-500' : params.row?.notif_material?.status == 2 ? 'text-yellow-500' : params.row?.notif_material?.status == 3 ? 'text-red-500' : 'text-slate-200'}
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
            className={params.row?.job_plan_material?.status == 0 ? 'text-blue-500' : params.row?.job_plan_material?.status == 1 ? 'text-green-500' : params.row?.job_plan_material?.status == 2 ? 'text-yellow-500' : params.row?.job_plan_material?.status == 3 ? 'text-red-500' : 'text-slate-200'}
          >
            <Tooltip title={params.row?.job_plan_material ? 'Lihat Job Plan' : 'Tambah Job Plan'} placement="left" arrow>  
              <IconPointFilled />
            </Tooltip>
          </button>
        </div>
      ),
    },
    {
      field: 'pr_material',
      headerName: 'PR',
      width: 40,
      renderCell: (params) => (
        <div className='py-4 flex flex-row justify-center items-center'>
          <button
            onClick={() => prOpen(params.row)}
            className={params.row?.pr_material?.status == 0 ? 'text-blue-500' : params.row?.pr_material?.status == 1 ? 'text-green-500' : params.row?.pr_material?.status == 2 ? 'text-yellow-500' : params.row?.pr_material?.status == 3 ? 'text-red-500' : 'text-slate-200'}
          >
            <Tooltip title={params.row?.pr_material ? 'Lihat PR' : 'Tambah PR'} placement="left" arrow>  
              <IconPointFilled />
            </Tooltip>
          </button>
        </div>
      ),
    },
    {
      field: 'tender_material',
      headerName: 'Tender',
      width: 70,
      renderCell: (params) => (
        <div className='py-4 flex flex-row justify-center items-center'>
          <button
            onClick={() => tenderOpen(params.row)}
            className={params.row?.tender_material?.status == 0 ? 'text-blue-500' : params.row?.tender_material?.status == 1 ? 'text-green-500' : params.row?.tender_material?.status == 2 ? 'text-yellow-500' : params.row?.tender_material?.status == 3 ? 'text-red-500' : 'text-slate-200'}
          >
            <Tooltip title={params.row?.tender_material ? 'Lihat Tender' : 'Tambah Tender'} placement="left" arrow>  
              <IconPointFilled />
            </Tooltip>
          </button>
        </div>
      ),
    },
    {
      field: 'po_material',
      headerName: 'PO',
      width: 40,
      renderCell: (params) => (
        <div className='py-4 flex flex-row justify-center items-center'>
          <button
            onClick={() => poOpen(params.row)}
            className={params.row?.po_material?.status == 0 ? 'text-blue-500' : params.row?.po_material?.status == 1 ? 'text-green-500' : params.row?.po_material?.status == 2 ? 'text-yellow-500' : params.row?.po_material?.status == 3 ? 'text-red-500' : 'text-slate-200'}
          >
            <Tooltip title={params.row?.po_material ? 'Lihat PO' : 'Tambah PO'} placement="left" arrow>  
              <IconPointFilled />
            </Tooltip>
          </button>
        </div>
      ),
    },
    {
      field: 'fabrikasi_material',
      headerName: 'Fabrikasi',
      width: 80,
      renderCell: (params) => (
        <div className='py-4 flex flex-row justify-center items-center'>
          <button
            onClick={() => fabrikasiOpen(params.row)}
            className={params.row?.fabrikasi_material?.status == 0 ? 'text-blue-500' : params.row?.fabrikasi_material?.status == 1 ? 'text-green-500' : params.row?.fabrikasi_material?.status == 2 ? 'text-yellow-500' : params.row?.fabrikasi_material?.status == 3 ? 'text-red-500' : 'text-slate-200'}
          >
            <Tooltip title={params.row?.fabrikasi_material ? 'Lihat Fabrikasi' : 'Tambah Fabrikasi'} placement="left" arrow>  
              <IconPointFilled />
            </Tooltip>
          </button>
        </div>
      ),
    },
    {
      field: 'delivery_material',
      headerName: 'Delivery',
      width: 80,
      renderCell: (params) => (
        <div className='py-4 flex flex-row justify-center items-center'>
          <button
            onClick={() => deliveryOpen(params.row)}
            className={params.row?.delivery_material?.status == 0 ? 'text-blue-500' : params.row?.delivery_material?.status == 1 ? 'text-green-500' : params.row?.delivery_material?.status == 2 ? 'text-yellow-500' : params.row?.delivery_material?.status == 3 ? 'text-red-500' : 'text-slate-200'}
          >
            <Tooltip title={params.row?.delivery_material ? 'Lihat Delivery' : 'Tambah Delivery'} placement="left" arrow>  
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
      field: 'last_target_status',
      headerName: 'Target Status',
      valueGetter: (params) => {params != null ? (params.days_remaining ? params.days_remaining : '-') : null},
      width: 120,
      renderCell: (params) => {
        const color = params.row.last_target_status != null ? (params.row.last_target_status?.color == 'red' ? 'error' : params.row.last_target_status?.color == 'yellow' ? 'warning' : 'success') : 'default';
        const title = params.row.last_target_status != null ? `remaining: ${params.row.last_target_status?.days_remaining ?? '-'}\n|\nDate: ${params.row.last_target_status?.date_used ?? '-'}\n|\nStep: ${params.row.last_target_status?.step_used ?? '-'}\n `: '-';
        return (
          <div className="flex flex-col justify-center items-center p-2" >
            <Tooltip title={title} placement="top" arrow>
              <Stack direction="row" spacing={1}>
                <Chip label={params.row.last_target_status?.days_remaining ?? '-'} color={color} />
              </Stack>
            </Tooltip>
          </div>
        );
      },
    },
    {
      field: 'prognosa',
      headerName: 'Prognosa',
      valueGetter: (params) => {params != null ? (params.days_remaining ? params.days_remaining : '-') : null},
      width: 100,
      renderCell: (params) => {
        const color = params.row.prognosa ? (params.row.prognosa.color == 'red' ? 'error' : params.row.prognosa.color == 'yellow' ? 'warning' : 'success') : 'default';
        const title = params.row.prognosa != null ? `remaining: ${params.row.prognosa?.days_remaining ?? '-'}\n|\nDelivery Date (PO): ${params.row.prognosa?.delivery_date ?? '-'}\n|\nTarget Date (Delivery): ${params.row.prognosa?.target_date ?? '-'}\n|\nTanggal TA : ${params.row.prognosa?.tanggal_ta ?? '-'}\n `: '-';
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
      headerName: 'TA Status',
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
                  <IconArrowLeft />
              </div>
          </div>
          <div className={` ${hide ? 'block' : 'hidden'}  w-fit bg-emerald-950 text-lime-300 p-2 cursor-pointer rounded-md`} onClick={() => setHide(false)}>
              <IconArrowRight />
          </div>
          <Breadcrumbs
              aria-label='breadcrumb'
              className="uppercase"
              separator={
              <IconChevronRight className='text-emerald-950' stroke={2} />
              }
          >
              <Link className='hover:underline text-emerald-950' to='/readiness'>
              Event
              </Link>
              <Typography className='text-lime-500'>Readiness Material</Typography>
          </Breadcrumbs>
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
                            {validation.material_name && (
                              validation.material_name.map((item, index) => (
                                <div key={index}>
                                  <small className="text-red-600 text-sm">{item}</small>
                                </div>
                              ))
                            )}
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
                          {selectedReadiness.tanggal_ta 
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
        <Box className="bg-white rounded-2xl shadow-lg p-4 relative top-1/2 left-1/2 w-[90%] md:w-1/2 transform -translate-x-1/2 -translate-y-1/2 ">
          <form onSubmit={(e) => {selectedReadiness?.rekomendasi_material ? handleUpdateRekomendasi(e, selectedReadiness.rekomendasi_material.id) : handleAddRekomendasi(e)}} method="POST">
            <h1 className="text-xl uppercase text-gray-900 mb-4">
              {selectedReadiness?.rekomendasi_material ? "Update" : "Tambah"} Rekomendasi Material <small className='text-xs'>{selectedReadiness.rekomendasi_material?.status == 0 ? '(Selesai)' : selectedReadiness.rekomendasi_material?.status == 1 ? '(On Going)' : selectedReadiness.rekomendasi_material?.status == 2 ? '(Telat < 1bln)' : selectedReadiness.rekomendasi_material?.status == 3 ? '(Telat > 1bln)' : ''}</small>
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
                  defaultValue={selectedReadiness?.rekomendasi_material?.target_date} 
                  required />
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
              {selectedReadiness?.rekomendasi_material ? (
                <>
                {selectedReadiness.rekomendasi_material?.status == 1 ?
                  <>
                    <button type="button" onClick={() => handleupdateStatusRekomendasi(0, selectedReadiness.rekomendasi_material.id)} className={`bg-blue-500 text-white p-2 rounded-xl flex justify-center items-center hover:bg-blue-600 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} text-xs`} disabled={isSubmitting}>Selesai</button>
                    <button type="button" onClick={() => handleupdateStatusRekomendasi(2, selectedReadiness.rekomendasi_material.id)} className={`bg-yellow-500 text-white p-2 rounded-xl flex justify-center items-center hover:bg-yellow-600 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} text-xs`} disabled={isSubmitting}>{'Telat < 1bln'}</button>
                    <button type="button" onClick={() => handleupdateStatusRekomendasi(3, selectedReadiness.rekomendasi_material.id)} className={`bg-red-500 text-white p-2 rounded-xl flex justify-center items-center hover:bg-red-600 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} text-xs`} disabled={isSubmitting}>{'Telat > 1bln'}</button>
                  </>
                  : selectedReadiness.rekomendasi_material?.status == 2 ?
                  <>
                    <button type="button" onClick={() => handleupdateStatusRekomendasi(0, selectedReadiness.rekomendasi_material.id)} className={`bg-blue-500 text-white p-2 rounded-xl flex justify-center items-center hover:bg-blue-600 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} text-xs`} disabled={isSubmitting}>Selesai</button>
                    <button type="button" onClick={() => handleupdateStatusRekomendasi(1, selectedReadiness.rekomendasi_material.id)} className={`bg-green-500 text-white p-2 rounded-xl flex justify-center items-center hover:bg-green-600 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} text-xs`} disabled={isSubmitting}>{'On Going'}</button>
                    <button type="button" onClick={() => handleupdateStatusRekomendasi(3, selectedReadiness.rekomendasi_material.id)} className={`bg-red-500 text-white p-2 rounded-xl flex justify-center items-center hover:bg-red-600 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} text-xs`} disabled={isSubmitting}>{'Telat > 1bln'}</button>
                  </>
                  : selectedReadiness.rekomendasi_material?.status == 3 ?
                  <>
                    <button type="button" onClick={() => handleupdateStatusRekomendasi(0, selectedReadiness.rekomendasi_material.id)} className={`bg-blue-500 text-white p-2 rounded-xl flex justify-center items-center hover:bg-blue-600 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} text-xs`} disabled={isSubmitting}>Selesai</button>
                    <button type="button" onClick={() => handleupdateStatusRekomendasi(1, selectedReadiness.rekomendasi_material.id)} className={`bg-green-500 text-white p-2 rounded-xl flex justify-center items-center hover:bg-green-600 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} text-xs`} disabled={isSubmitting}>{'On Going'}</button>
                    <button type="button" onClick={() => handleupdateStatusRekomendasi(2, selectedReadiness.rekomendasi_material.id)} className={`bg-yellow-500 text-white p-2 rounded-xl flex justify-center items-center hover:bg-yellow-600 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} text-xs`} disabled={isSubmitting}>{'Telat < 1bln'}</button>
                  </>
                  : 
                  <>
                    <button type="button" onClick={() => handleupdateStatusRekomendasi(1, selectedReadiness.rekomendasi_material.id)} className={`bg-green-500 text-white p-2 rounded-xl flex justify-center items-center hover:bg-green-600 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} text-xs`} disabled={isSubmitting}>{'On Going'}</button>
                    <button type="button" onClick={() => handleupdateStatusRekomendasi(2, selectedReadiness.rekomendasi_material.id)} className={`bg-yellow-500 text-white p-2 rounded-xl flex justify-center items-center hover:bg-yellow-600 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} text-xs`} disabled={isSubmitting}>{'Telat < 1bln'}</button>
                    <button type="button" onClick={() => handleupdateStatusRekomendasi(3, selectedReadiness.rekomendasi_material.id)} className={`bg-red-500 text-white p-2 rounded-xl flex justify-center items-center hover:bg-red-600 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} text-xs`} disabled={isSubmitting}>{'Telat > 1bln'}</button>
                  </>
                }
                  <button type="button" onClick={() => handleDeleteRekomendasi(selectedReadiness?.rekomendasi_material)} className={`bg-slate-500 text-white p-2 rounded-xl flex justify-center items-center hover:bg-slate-600 cursor-pointer text-xs`}><IconTrash className="w-4" /> Hapus</button>
                  <button type="submit" className={`bg-slate-500 text-white p-2 text-xs rounded-xl flex hover:bg-slate-600 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} items-center`}> <IconPencil className="w-4" /> Update</button>
                </>
              ) : <button type="submit" className={`bg-emerald-950 text-lime-300 p-2  rounded-xl flex hover:bg-emerald-900 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}>Simpan</button>}
              <button type="button" onClick={rekomendasiClose} className="bg-slate-500 p-2 cursor-pointer rounded-xl flex text-white hover:bg-slate-600 text-xs items-center"> <IconX className="w-4" /> Batal</button>
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
        <Box className="bg-white rounded-2xl shadow-lg p-4 relative top-1/2 left-1/2 w-[90%] md:w-1/2 transform -translate-x-1/2 -translate-y-1/2 ">
          <form onSubmit={(e) => {selectedReadiness.notif_material ? handleUpdateNotif(e, selectedReadiness.notif_material.id) : handleAddNotif(e)}} method="POST">
            <h1 className="text-xl uppercase text-gray-900 mb-4">
              {selectedReadiness.notif_material ? "Update" : "Tambah"} Notif Material
            </h1>
            <div className="flex flex-col space-y-2">
              <div>
                <label htmlFor="no_notif">No Notif <sup className='text-red-500'>*(max 16)</sup></label>
                <input
                  type="number"
                  name="no_notif"
                  id="no_notif"
                  placeholder="Masukkan No Notif Material"
                  className="border border-slate-200 rounded-md p-2 w-full bg-transparent outline-none"
                  defaultValue={selectedReadiness.notif_material ? selectedReadiness.notif_material.no_notif : ''}
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
                  defaultValue={selectedReadiness.notif_material ? selectedReadiness.notif_material.target_date : ''}
                  required
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
              {selectedReadiness.notif_material?.target_date 
                ? 
                <>
                  {selectedReadiness.notif_material?.status == 1 ?
                    <>
                      <button type="button" onClick={() => handleupdateStatusNotif(0, selectedReadiness.notif_material.id)} className={`bg-blue-500 text-white p-2 rounded-xl flex justify-center items-center hover:bg-blue-600 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} text-xs`} disabled={isSubmitting}>Selesai</button>
                      <button type="button" onClick={() => handleupdateStatusNotif(2, selectedReadiness.notif_material.id)} className={`bg-yellow-500 text-white p-2 rounded-xl flex justify-center items-center hover:bg-yellow-600 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} text-xs`} disabled={isSubmitting}>{'Telat < 1bln'}</button>
                      <button type="button" onClick={() => handleupdateStatusNotif(3, selectedReadiness.notif_material.id)} className={`bg-red-500 text-white p-2 rounded-xl flex justify-center items-center hover:bg-red-600 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} text-xs`} disabled={isSubmitting}>{'Telat > 1bln'}</button>
                    </>
                    : selectedReadiness.notif_material?.status == 2 ?
                    <>
                      <button type="button" onClick={() => handleupdateStatusNotif(0, selectedReadiness.notif_material.id)} className={`bg-blue-500 text-white p-2 rounded-xl flex justify-center items-center hover:bg-blue-600 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} text-xs`} disabled={isSubmitting}>Selesai</button>
                      <button type="button" onClick={() => handleupdateStatusNotif(1, selectedReadiness.notif_material.id)} className={`bg-green-500 text-white p-2 rounded-xl flex justify-center items-center hover:bg-green-600 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} text-xs`} disabled={isSubmitting}>{'On Going'}</button>
                      <button type="button" onClick={() => handleupdateStatusNotif(3, selectedReadiness.notif_material.id)} className={`bg-red-500 text-white p-2 rounded-xl flex justify-center items-center hover:bg-red-600 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} text-xs`} disabled={isSubmitting}>{'Telat > 1bln'}</button>
                    </>
                    : selectedReadiness.notif_material?.status == 3 ?
                    <>
                      <button type="button" onClick={() => handleupdateStatusNotif(0, selectedReadiness.notif_material.id)} className={`bg-blue-500 text-white p-2 rounded-xl flex justify-center items-center hover:bg-blue-600 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} text-xs`} disabled={isSubmitting}>Selesai</button>
                      <button type="button" onClick={() => handleupdateStatusNotif(1, selectedReadiness.notif_material.id)} className={`bg-green-500 text-white p-2 rounded-xl flex justify-center items-center hover:bg-green-600 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} text-xs`} disabled={isSubmitting}>{'On Going'}</button>
                      <button type="button" onClick={() => handleupdateStatusNotif(2, selectedReadiness.notif_material.id)} className={`bg-yellow-500 text-white p-2 rounded-xl flex justify-center items-center hover:bg-yellow-600 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} text-xs`} disabled={isSubmitting}>{'Telat < 1bln'}</button>
                    </>
                    : 
                    <>
                      <button type="button" onClick={() => handleupdateStatusNotif(1, selectedReadiness.notif_material.id)} className={`bg-green-500 text-white p-2 rounded-xl flex justify-center items-center hover:bg-green-600 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} text-xs`} disabled={isSubmitting}>{'On Going'}</button>
                      <button type="button" onClick={() => handleupdateStatusNotif(2, selectedReadiness.notif_material.id)} className={`bg-yellow-500 text-white p-2 rounded-xl flex justify-center items-center hover:bg-yellow-600 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} text-xs`} disabled={isSubmitting}>{'Telat < 1bln'}</button>
                      <button type="button" onClick={() => handleupdateStatusNotif(3, selectedReadiness.notif_material.id)} className={`bg-red-500 text-white p-2 rounded-xl flex justify-center items-center hover:bg-red-600 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} text-xs`} disabled={isSubmitting}>{'Telat > 1bln'}</button>
                    </>
                  }
                  <button type="button" onClick={() => handleDeleteNotif(selectedReadiness?.notif_material)} className={`bg-slate-500 text-white p-2 rounded-xl flex justify-center items-center hover:bg-slate-600 cursor-pointer text-xs`}><IconTrash className="w-4" /> Hapus</button>
                  <button type="submit" className={`bg-slate-500 text-xs text-white p-2  rounded-xl flex hover:bg-slate-600 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} items-center`}> <IconPencil className="w-4" /> Update</button> 
                </>
                : <button type="submit" className={`bg-emerald-950 text-lime-300 p-2  rounded-xl flex hover:bg-emerald-900 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}>Simpan</button>
              }
              <button type="button" onClick={notifClose} className="bg-slate-500 p-2 cursor-pointer rounded-xl flex text-white hover:bg-slate-600 text-xs items-center"> <IconX className="w-4" /> Batal</button>
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
        <Box className="bg-white rounded-2xl shadow-lg p-4 relative top-1/2 left-1/2 w-[90%] md:w-1/2 transform -translate-x-1/2 -translate-y-1/2 ">
          <form onSubmit={(e) => {selectedReadiness.job_plan_material ? handleUpdateJobPlan(e, selectedReadiness.job_plan_material.id) : handleAddJobPlan(e)}} method="POST">
            <h1 className="text-xl uppercase text-gray-900 mb-4">
              {selectedReadiness.job_plan_material ? "Update" : "Tambah"} Job Plan Material
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
                  defaultValue={selectedReadiness.job_plan_material ? selectedReadiness.job_plan_material.no_wo : ''}
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
                  defaultValue={selectedReadiness.job_plan_material ? selectedReadiness.job_plan_material.target_date : ''}
                  required
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
              {selectedReadiness.job_plan_material?.target_date 
                ? 
                <>
                  {selectedReadiness.job_plan_material?.status == 1 ?
                    <>
                      <button type="button" onClick={() => handleupdateStatusJobPlan(0, selectedReadiness.job_plan_material.id)} className={`bg-blue-500 text-white p-2 rounded-xl flex justify-center items-center hover:bg-blue-600 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} text-xs`} disabled={isSubmitting}>Selesai</button>
                      <button type="button" onClick={() => handleupdateStatusJobPlan(2, selectedReadiness.job_plan_material.id)} className={`bg-yellow-500 text-white p-2 rounded-xl flex justify-center items-center hover:bg-yellow-600 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} text-xs`} disabled={isSubmitting}>{'Telat < 1bln'}</button>
                      <button type="button" onClick={() => handleupdateStatusJobPlan(3, selectedReadiness.job_plan_material.id)} className={`bg-red-500 text-white p-2 rounded-xl flex justify-center items-center hover:bg-red-600 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} text-xs`} disabled={isSubmitting}>{'Telat > 1bln'}</button>
                    </>
                    : selectedReadiness.job_plan_material?.status == 2 ?
                    <>
                      <button type="button" onClick={() => handleupdateStatusJobPlan(0, selectedReadiness.job_plan_material.id)} className={`bg-blue-500 text-white p-2 rounded-xl flex justify-center items-center hover:bg-blue-600 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} text-xs`} disabled={isSubmitting}>Selesai</button>
                      <button type="button" onClick={() => handleupdateStatusJobPlan(1, selectedReadiness.job_plan_material.id)} className={`bg-green-500 text-white p-2 rounded-xl flex justify-center items-center hover:bg-green-600 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} text-xs`} disabled={isSubmitting}>{'On Going'}</button>
                      <button type="button" onClick={() => handleupdateStatusJobPlan(3, selectedReadiness.job_plan_material.id)} className={`bg-red-500 text-white p-2 rounded-xl flex justify-center items-center hover:bg-red-600 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} text-xs`} disabled={isSubmitting}>{'Telat > 1bln'}</button>
                    </>
                    : selectedReadiness.job_plan_material?.status == 3 ?
                    <>
                      <button type="button" onClick={() => handleupdateStatusJobPlan(0, selectedReadiness.job_plan_material.id)} className={`bg-blue-500 text-white p-2 rounded-xl flex justify-center items-center hover:bg-blue-600 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} text-xs`} disabled={isSubmitting}>Selesai</button>
                      <button type="button" onClick={() => handleupdateStatusJobPlan(1, selectedReadiness.job_plan_material.id)} className={`bg-green-500 text-white p-2 rounded-xl flex justify-center items-center hover:bg-green-600 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} text-xs`} disabled={isSubmitting}>{'On Going'}</button>
                      <button type="button" onClick={() => handleupdateStatusJobPlan(2, selectedReadiness.job_plan_material.id)} className={`bg-yellow-500 text-white p-2 rounded-xl flex justify-center items-center hover:bg-yellow-600 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} text-xs`} disabled={isSubmitting}>{'Telat < 1bln'}</button>
                    </>
                    : 
                    <>
                      <button type="button" onClick={() => handleupdateStatusJobPlan(1, selectedReadiness.job_plan_material.id)} className={`bg-green-500 text-white p-2 rounded-xl flex justify-center items-center hover:bg-green-600 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} text-xs`} disabled={isSubmitting}>{'On Going'}</button>
                      <button type="button" onClick={() => handleupdateStatusJobPlan(2, selectedReadiness.job_plan_material.id)} className={`bg-yellow-500 text-white p-2 rounded-xl flex justify-center items-center hover:bg-yellow-600 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} text-xs`} disabled={isSubmitting}>{'Telat < 1bln'}</button>
                      <button type="button" onClick={() => handleupdateStatusJobPlan(3, selectedReadiness.job_plan_material.id)} className={`bg-red-500 text-white p-2 rounded-xl flex justify-center items-center hover:bg-red-600 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} text-xs`} disabled={isSubmitting}>{'Telat > 1bln'}</button>
                    </>
                  }
                  <button type="button" onClick={() => handleDeleteJobPlan(selectedReadiness?.job_plan_material)} className={`bg-slate-500 text-white p-2 rounded-xl flex justify-center items-center hover:bg-slate-600 cursor-pointer text-xs`}><IconTrash className="w-4" /> Hapus</button>
                  <button type="submit" className={`bg-slate-500 text-xs text-white p-2  rounded-xl flex hover:bg-slate-600 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} items-center`}> <IconPencil className="w-4" /> Update</button> 
                </>
                : <button type="submit" className={`bg-emerald-950 text-lime-300 p-2  rounded-xl flex hover:bg-emerald-900 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}>Simpan</button>
              }
              <button type="button" onClick={jobPlanClose} className="bg-slate-500 p-2 cursor-pointer rounded-xl flex text-white hover:bg-slate-600 text-xs items-center"> <IconX className="w-4" /> Batal</button>
            </div>
          </form>
        </Box>
      </Modal>




      {/* modal PR material */}
      <Modal
        open={openPr}
        onClose={prClose} 
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box className="bg-white rounded-2xl shadow-lg p-4 relative top-1/2 left-1/2 w-[90%] md:w-1/2 transform -translate-x-1/2 -translate-y-1/2 ">
          <form onSubmit={(e) => {selectedReadiness.pr_material ? handleUpdatePr(e, selectedReadiness.pr_material.id) : handleAddPr(e)}} method="POST">
            <h1 className="text-xl uppercase text-gray-900 mb-4">
              {selectedReadiness.pr_material ? "Update" : "Tambah"} PR Material
            </h1>
            <div className="flex flex-col space-y-2">
              <div>
                <label htmlFor="no_pr">No PR <sup className='text-red-500'>*(max 16)</sup></label>
                <input
                  type="number"
                  name="no_pr"
                  id="no_pr"
                  placeholder="Masukkan No PR Material"
                  className="border border-slate-200 rounded-md p-2 w-full bg-transparent outline-none"
                  defaultValue={selectedReadiness.pr_material ? selectedReadiness.pr_material.no_pr : ''}
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
                  defaultValue={selectedReadiness.pr_material ? selectedReadiness.pr_material.target_date : ''}
                  required
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
              {selectedReadiness.pr_material?.target_date 
                ? 
                <>
                  {selectedReadiness.pr_material?.status == 1 ?
                    <>
                      <button type="button" onClick={() => handleupdateStatusPr(0, selectedReadiness.pr_material.id)} className={`bg-blue-500 text-white p-2 rounded-xl flex justify-center items-center hover:bg-blue-600 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} text-xs`} disabled={isSubmitting}>Selesai</button>
                      <button type="button" onClick={() => handleupdateStatusPr(2, selectedReadiness.pr_material.id)} className={`bg-yellow-500 text-white p-2 rounded-xl flex justify-center items-center hover:bg-yellow-600 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} text-xs`} disabled={isSubmitting}>{'Telat < 1bln'}</button>
                      <button type="button" onClick={() => handleupdateStatusPr(3, selectedReadiness.pr_material.id)} className={`bg-red-500 text-white p-2 rounded-xl flex justify-center items-center hover:bg-red-600 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} text-xs`} disabled={isSubmitting}>{'Telat > 1bln'}</button>
                    </>
                    : selectedReadiness.pr_material?.status == 2 ?
                    <>
                      <button type="button" onClick={() => handleupdateStatusPr(0, selectedReadiness.pr_material.id)} className={`bg-blue-500 text-white p-2 rounded-xl flex justify-center items-center hover:bg-blue-600 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} text-xs`} disabled={isSubmitting}>Selesai</button>
                      <button type="button" onClick={() => handleupdateStatusPr(1, selectedReadiness.pr_material.id)} className={`bg-green-500 text-white p-2 rounded-xl flex justify-center items-center hover:bg-green-600 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} text-xs`} disabled={isSubmitting}>{'On Going'}</button>
                      <button type="button" onClick={() => handleupdateStatusPr(3, selectedReadiness.pr_material.id)} className={`bg-red-500 text-white p-2 rounded-xl flex justify-center items-center hover:bg-red-600 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} text-xs`} disabled={isSubmitting}>{'Telat > 1bln'}</button>
                    </>
                    : selectedReadiness.pr_material?.status == 3 ?
                    <>
                      <button type="button" onClick={() => handleupdateStatusPr(0, selectedReadiness.pr_material.id)} className={`bg-blue-500 text-white p-2 rounded-xl flex justify-center items-center hover:bg-blue-600 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} text-xs`} disabled={isSubmitting}>Selesai</button>
                      <button type="button" onClick={() => handleupdateStatusPr(1, selectedReadiness.pr_material.id)} className={`bg-green-500 text-white p-2 rounded-xl flex justify-center items-center hover:bg-green-600 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} text-xs`} disabled={isSubmitting}>{'On Going'}</button>
                      <button type="button" onClick={() => handleupdateStatusPr(2, selectedReadiness.pr_material.id)} className={`bg-yellow-500 text-white p-2 rounded-xl flex justify-center items-center hover:bg-yellow-600 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} text-xs`} disabled={isSubmitting}>{'Telat < 1bln'}</button>
                    </>
                    : 
                    <>
                      <button type="button" onClick={() => handleupdateStatusPr(1, selectedReadiness.pr_material.id)} className={`bg-green-500 text-white p-2 rounded-xl flex justify-center items-center hover:bg-green-600 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} text-xs`} disabled={isSubmitting}>{'On Going'}</button>
                      <button type="button" onClick={() => handleupdateStatusPr(2, selectedReadiness.pr_material.id)} className={`bg-yellow-500 text-white p-2 rounded-xl flex justify-center items-center hover:bg-yellow-600 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} text-xs`} disabled={isSubmitting}>{'Telat < 1bln'}</button>
                      <button type="button" onClick={() => handleupdateStatusPr(3, selectedReadiness.pr_material.id)} className={`bg-red-500 text-white p-2 rounded-xl flex justify-center items-center hover:bg-red-600 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} text-xs`} disabled={isSubmitting}>{'Telat > 1bln'}</button>
                    </>
                  }
                  <button type="button" onClick={() => handleDeletePr(selectedReadiness?.pr_material)} className={`bg-slate-500 text-white p-2 rounded-xl flex justify-center items-center hover:bg-slate-600 cursor-pointer text-xs`}><IconTrash className="w-4" /> Hapus</button>
                  <button type="submit" className={`bg-slate-500 text-xs text-white p-2  rounded-xl flex hover:bg-slate-600 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} items-center`}> <IconPencil className="w-4" /> Update</button> 
                </>
                : <button type="submit" className={`bg-emerald-950 text-lime-300 p-2  rounded-xl flex hover:bg-emerald-900 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}>Simpan</button>
              }
              <button type="button" onClick={prClose} className="bg-slate-500 p-2 cursor-pointer rounded-xl flex text-white hover:bg-slate-600 text-xs items-center"> <IconX className="w-4" /> Batal</button>
            </div>
          </form>
        </Box>
      </Modal>




      {/* modal Tender material */}
      <Modal
        open={openTender}
        onClose={tenderClose} 
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box className="bg-white rounded-2xl shadow-lg p-4 relative top-1/2 left-1/2 w-[90%] md:w-1/2 transform -translate-x-1/2 -translate-y-1/2 ">
          <form onSubmit={(e) => {selectedReadiness.tender_material ? handleUpdateTender(e, selectedReadiness.tender_material.id) : handleAddTender(e)}} method="POST">
            <h1 className="text-xl uppercase text-gray-900 mb-4">
              {selectedReadiness.tender_material ? "Update" : "Tambah"} Tender Material
            </h1>
            <div className="flex flex-col space-y-2">
              <div>
                <label htmlFor="description">Keterangan <sup className='text-red-500'>*</sup></label>
                <input
                  type="text"
                  name="description"
                  id="description"
                  placeholder="Masukkan Keterangan Tender Material"
                  className="border border-slate-200 rounded-md p-2 w-full bg-transparent outline-none"
                  defaultValue={selectedReadiness.tender_material ? selectedReadiness.tender_material.description : ''}
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
                  defaultValue={selectedReadiness.tender_material ? selectedReadiness.tender_material.target_date : ''}
                  required
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
              {selectedReadiness.tender_material?.target_date 
                ? 
                <>
                  {selectedReadiness.tender_material?.status == 1 ?
                    <>
                      <button type="button" onClick={() => handleupdateStatusTender(0, selectedReadiness.tender_material.id)} className={`bg-blue-500 text-white p-2 rounded-xl flex justify-center items-center hover:bg-blue-600 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} text-xs`} disabled={isSubmitting}>Selesai</button>
                      <button type="button" onClick={() => handleupdateStatusTender(2, selectedReadiness.tender_material.id)} className={`bg-yellow-500 text-white p-2 rounded-xl flex justify-center items-center hover:bg-yellow-600 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} text-xs`} disabled={isSubmitting}>{'Telat < 1bln'}</button>
                      <button type="button" onClick={() => handleupdateStatusTender(3, selectedReadiness.tender_material.id)} className={`bg-red-500 text-white p-2 rounded-xl flex justify-center items-center hover:bg-red-600 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} text-xs`} disabled={isSubmitting}>{'Telat > 1bln'}</button>
                    </>
                    : selectedReadiness.tender_material?.status == 2 ?
                    <>
                      <button type="button" onClick={() => handleupdateStatusTender(0, selectedReadiness.tender_material.id)} className={`bg-blue-500 text-white p-2 rounded-xl flex justify-center items-center hover:bg-blue-600 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} text-xs`} disabled={isSubmitting}>Selesai</button>
                      <button type="button" onClick={() => handleupdateStatusTender(1, selectedReadiness.tender_material.id)} className={`bg-green-500 text-white p-2 rounded-xl flex justify-center items-center hover:bg-green-600 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} text-xs`} disabled={isSubmitting}>{'On Going'}</button>
                      <button type="button" onClick={() => handleupdateStatusTender(3, selectedReadiness.tender_material.id)} className={`bg-red-500 text-white p-2 rounded-xl flex justify-center items-center hover:bg-red-600 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} text-xs`} disabled={isSubmitting}>{'Telat > 1bln'}</button>
                    </>
                    : selectedReadiness.tender_material?.status == 3 ?
                    <>
                      <button type="button" onClick={() => handleupdateStatusTender(0, selectedReadiness.tender_material.id)} className={`bg-blue-500 text-white p-2 rounded-xl flex justify-center items-center hover:bg-blue-600 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} text-xs`} disabled={isSubmitting}>Selesai</button>
                      <button type="button" onClick={() => handleupdateStatusTender(1, selectedReadiness.tender_material.id)} className={`bg-green-500 text-white p-2 rounded-xl flex justify-center items-center hover:bg-green-600 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} text-xs`} disabled={isSubmitting}>{'On Going'}</button>
                      <button type="button" onClick={() => handleupdateStatusTender(2, selectedReadiness.tender_material.id)} className={`bg-yellow-500 text-white p-2 rounded-xl flex justify-center items-center hover:bg-yellow-600 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} text-xs`} disabled={isSubmitting}>{'Telat < 1bln'}</button>
                    </>
                    : 
                    <>
                      <button type="button" onClick={() => handleupdateStatusTender(1, selectedReadiness.tender_material.id)} className={`bg-green-500 text-white p-2 rounded-xl flex justify-center items-center hover:bg-green-600 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} text-xs`} disabled={isSubmitting}>{'On Going'}</button>
                      <button type="button" onClick={() => handleupdateStatusTender(2, selectedReadiness.tender_material.id)} className={`bg-yellow-500 text-white p-2 rounded-xl flex justify-center items-center hover:bg-yellow-600 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} text-xs`} disabled={isSubmitting}>{'Telat < 1bln'}</button>
                      <button type="button" onClick={() => handleupdateStatusTender(3, selectedReadiness.tender_material.id)} className={`bg-red-500 text-white p-2 rounded-xl flex justify-center items-center hover:bg-red-600 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} text-xs`} disabled={isSubmitting}>{'Telat > 1bln'}</button>
                    </>
                  }
                  <button type="button" onClick={() => handleDeleteTender(selectedReadiness?.tender_material)} className={`bg-slate-500 text-white p-2 rounded-xl flex justify-center items-center hover:bg-slate-600 cursor-pointer text-xs`}><IconTrash className="w-4" /> Hapus</button>
                  <button type="submit" className={`bg-slate-500 text-xs text-white p-2  rounded-xl flex hover:bg-slate-600 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} items-center`}> <IconPencil className="w-4" /> Update</button> 
                </>
                : <button type="submit" className={`bg-emerald-950 text-lime-300 p-2  rounded-xl flex hover:bg-emerald-900 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}>Simpan</button>
              }
              <button type="button" onClick={tenderClose} className="bg-slate-500 p-2 cursor-pointer rounded-xl flex text-white hover:bg-slate-600 text-xs items-center"> <IconX className="w-4" /> Batal</button>
            </div>
          </form>
        </Box>
      </Modal>




      {/* modal PO material */}
      <Modal
        open={openPo}
        onClose={poClose} 
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box className="bg-white rounded-2xl shadow-lg p-4 relative top-1/2 left-1/2 w-[90%] md:w-1/2 transform -translate-x-1/2 -translate-y-1/2 ">
          <form onSubmit={(e) => {selectedReadiness.po_material ? handleUpdatePo(e, selectedReadiness.po_material.id) : handleAddPo(e)}} method="POST">
            <h1 className="text-xl uppercase text-gray-900 mb-4">
              {selectedReadiness.po_material ? "Update" : "Tambah"} PO Material
            </h1>
            <div className="flex flex-col space-y-2">
              <div>
                <label htmlFor="no_po">No PO <sup className='text-red-500'>*(max 16)</sup></label>
                <input
                  type="number"
                  name="no_po"
                  id="no_po"
                  placeholder="Masukkan No PO Material"
                  className="border border-slate-200 rounded-md p-2 w-full bg-transparent outline-none"
                  defaultValue={selectedReadiness.po_material ? selectedReadiness.po_material.no_po : ''}
                  required
                />
                {validation.no_po && (
                  validation.no_po.map((item, index) => (
                    <div key={index}>
                      <small className="text-red-600 text-sm">{item}</small>
                    </div>
                  ))
                )}
              </div>
              <div>
                <label htmlFor="po_file">PO File {selectedReadiness?.po_material?.po_file ? '' : <sup className='text-red-500'>*</sup> }</label>
                <input 
                  type="file" 
                  name="po_file"
                  required={selectedReadiness?.po_material?.po_file ? false : true}
                  className="border rounded-md p-2 w-full" />
                  {selectedReadiness?.po_material?.po_file ? (
                    <div className='flex flex-row justify-between items-center w-full border bg-lime-400 rounded p-1'>
                        <Link
                          to={`${base_public_url}readiness_ta/material/po/${selectedReadiness?.po_material?.po_file}`}
                          target='_blank'
                          className='text-emerald-950 hover:underline cursor-pointer text-xs'
                        >
                          {selectedReadiness?.po_material?.po_file}
                        </Link>
                    </div>
                  ) : (
                    ''
                  )}
                {validation.po_file && (
                  validation.po_file.map((item, index) => (
                    <div key={index}>
                      <small className="text-red-600 text-sm">{item}</small>
                    </div>
                  ))
                )}
              </div>
              <div>
                <label htmlFor="delivery_date">Delivery Date <sup className='text-red-500'>*</sup></label>
                <input
                  type="date"
                  name="delivery_date"
                  id="delivery_date"
                  className="border border-slate-200 rounded-md p-2 w-full bg-transparent outline-none"
                  defaultValue={selectedReadiness.po_material ? selectedReadiness.po_material.delivery_date : ''}
                  required
                />
                {validation.delivery_date && (
                  validation.delivery_date.map((item, index) => (
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
                  defaultValue={selectedReadiness.po_material ? selectedReadiness.po_material.target_date : ''}
                  required
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
              {selectedReadiness.po_material?.target_date 
                ? 
                <>
                  {selectedReadiness.po_material?.status == 1 ?
                    <>
                      <button type="button" onClick={() => handleupdateStatusPo(0, selectedReadiness.po_material.id)} className={`bg-blue-500 text-white p-2 rounded-xl flex justify-center items-center hover:bg-blue-600 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} text-xs`} disabled={isSubmitting}>Selesai</button>
                      <button type="button" onClick={() => handleupdateStatusPo(2, selectedReadiness.po_material.id)} className={`bg-yellow-500 text-white p-2 rounded-xl flex justify-center items-center hover:bg-yellow-600 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} text-xs`} disabled={isSubmitting}>{'Telat < 1bln'}</button>
                      <button type="button" onClick={() => handleupdateStatusPo(3, selectedReadiness.po_material.id)} className={`bg-red-500 text-white p-2 rounded-xl flex justify-center items-center hover:bg-red-600 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} text-xs`} disabled={isSubmitting}>{'Telat > 1bln'}</button>
                    </>
                    : selectedReadiness.po_material?.status == 2 ?
                    <>
                      <button type="button" onClick={() => handleupdateStatusPo(0, selectedReadiness.po_material.id)} className={`bg-blue-500 text-white p-2 rounded-xl flex justify-center items-center hover:bg-blue-600 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} text-xs`} disabled={isSubmitting}>Selesai</button>
                      <button type="button" onClick={() => handleupdateStatusPo(1, selectedReadiness.po_material.id)} className={`bg-green-500 text-white p-2 rounded-xl flex justify-center items-center hover:bg-green-600 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} text-xs`} disabled={isSubmitting}>{'On Going'}</button>
                      <button type="button" onClick={() => handleupdateStatusPo(3, selectedReadiness.po_material.id)} className={`bg-red-500 text-white p-2 rounded-xl flex justify-center items-center hover:bg-red-600 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} text-xs`} disabled={isSubmitting}>{'Telat > 1bln'}</button>
                    </>
                    : selectedReadiness.po_material?.status == 3 ?
                    <>
                      <button type="button" onClick={() => handleupdateStatusPo(0, selectedReadiness.po_material.id)} className={`bg-blue-500 text-white p-2 rounded-xl flex justify-center items-center hover:bg-blue-600 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} text-xs`} disabled={isSubmitting}>Selesai</button>
                      <button type="button" onClick={() => handleupdateStatusPo(1, selectedReadiness.po_material.id)} className={`bg-green-500 text-white p-2 rounded-xl flex justify-center items-center hover:bg-green-600 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} text-xs`} disabled={isSubmitting}>{'On Going'}</button>
                      <button type="button" onClick={() => handleupdateStatusPo(2, selectedReadiness.po_material.id)} className={`bg-yellow-500 text-white p-2 rounded-xl flex justify-center items-center hover:bg-yellow-600 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} text-xs`} disabled={isSubmitting}>{'Telat < 1bln'}</button>
                    </>
                    : 
                    <>
                      <button type="button" onClick={() => handleupdateStatusPo(1, selectedReadiness.po_material.id)} className={`bg-green-500 text-white p-2 rounded-xl flex justify-center items-center hover:bg-green-600 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} text-xs`} disabled={isSubmitting}>{'On Going'}</button>
                      <button type="button" onClick={() => handleupdateStatusPo(2, selectedReadiness.po_material.id)} className={`bg-yellow-500 text-white p-2 rounded-xl flex justify-center items-center hover:bg-yellow-600 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} text-xs`} disabled={isSubmitting}>{'Telat < 1bln'}</button>
                      <button type="button" onClick={() => handleupdateStatusPo(3, selectedReadiness.po_material.id)} className={`bg-red-500 text-white p-2 rounded-xl flex justify-center items-center hover:bg-red-600 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} text-xs`} disabled={isSubmitting}>{'Telat > 1bln'}</button>
                    </>
                  }
                  <button type="button" onClick={() => handleDeletePo(selectedReadiness?.po_material)} className={`bg-slate-500 text-white p-2 rounded-xl flex justify-center items-center hover:bg-slate-600 cursor-pointer text-xs`}><IconTrash className="w-4" /> Hapus</button>
                  <button type="submit" className={`bg-slate-500 text-xs text-white p-2  rounded-xl flex hover:bg-slate-600 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} items-center`}> <IconPencil className="w-4" /> Update</button> 
                </>
                : <button type="submit" className={`bg-emerald-950 text-lime-300 p-2  rounded-xl flex hover:bg-emerald-900 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}>Simpan</button>
              }
              <button type="button" onClick={poClose} className="bg-slate-500 p-2 cursor-pointer rounded-xl flex text-white hover:bg-slate-600 text-xs items-center"> <IconX className="w-4" /> Batal</button>
            </div>
          </form>
        </Box>
      </Modal>




      {/* modal Fabrikasi material */}
      <Modal
        open={openFabrikasi}
        onClose={fabrikasiClose} 
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box className="bg-white rounded-2xl shadow-lg p-4 relative top-1/2 left-1/2 w-[90%] md:w-1/2 transform -translate-x-1/2 -translate-y-1/2 ">
          <form onSubmit={(e) => {selectedReadiness.fabrikasi_material ? handleUpdateFabrikasi(e, selectedReadiness.fabrikasi_material.id) : handleAddFabrikasi(e)}} method="POST">
            <h1 className="text-xl uppercase text-gray-900 mb-4">
              {selectedReadiness.fabrikasi_material ? "Update" : "Tambah"} Fabrikasi Material
            </h1>
            <div className="flex flex-col space-y-2">
              <div>
                <label htmlFor="description">Keterangan <sup className='text-red-500'>*</sup></label>
                <input
                  type="text"
                  name="description"
                  id="description"
                  placeholder="Masukkan Keterangan Fabrikasi Material"
                  className="border border-slate-200 rounded-md p-2 w-full bg-transparent outline-none"
                  defaultValue={selectedReadiness.fabrikasi_material ? selectedReadiness.fabrikasi_material.description : ''}
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
                  defaultValue={selectedReadiness.fabrikasi_material ? selectedReadiness.fabrikasi_material.target_date : ''}
                  required
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
              {selectedReadiness.fabrikasi_material?.target_date 
                ? 
                <>
                  {selectedReadiness.fabrikasi_material?.status == 1 ?
                    <>
                      <button type="button" onClick={() => handleupdateStatusFabrikasi(0, selectedReadiness.fabrikasi_material.id)} className={`bg-blue-500 text-white p-2 rounded-xl flex justify-center items-center hover:bg-blue-600 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} text-xs`} disabled={isSubmitting}>Selesai</button>
                      <button type="button" onClick={() => handleupdateStatusFabrikasi(2, selectedReadiness.fabrikasi_material.id)} className={`bg-yellow-500 text-white p-2 rounded-xl flex justify-center items-center hover:bg-yellow-600 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} text-xs`} disabled={isSubmitting}>{'Telat < 1bln'}</button>
                      <button type="button" onClick={() => handleupdateStatusFabrikasi(3, selectedReadiness.fabrikasi_material.id)} className={`bg-red-500 text-white p-2 rounded-xl flex justify-center items-center hover:bg-red-600 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} text-xs`} disabled={isSubmitting}>{'Telat > 1bln'}</button>
                    </>
                    : selectedReadiness.fabrikasi_material?.status == 2 ?
                    <>
                      <button type="button" onClick={() => handleupdateStatusFabrikasi(0, selectedReadiness.fabrikasi_material.id)} className={`bg-blue-500 text-white p-2 rounded-xl flex justify-center items-center hover:bg-blue-600 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} text-xs`} disabled={isSubmitting}>Selesai</button>
                      <button type="button" onClick={() => handleupdateStatusFabrikasi(1, selectedReadiness.fabrikasi_material.id)} className={`bg-green-500 text-white p-2 rounded-xl flex justify-center items-center hover:bg-green-600 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} text-xs`} disabled={isSubmitting}>{'On Going'}</button>
                      <button type="button" onClick={() => handleupdateStatusFabrikasi(3, selectedReadiness.fabrikasi_material.id)} className={`bg-red-500 text-white p-2 rounded-xl flex justify-center items-center hover:bg-red-600 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} text-xs`} disabled={isSubmitting}>{'Telat > 1bln'}</button>
                    </>
                    : selectedReadiness.fabrikasi_material?.status == 3 ?
                    <>
                      <button type="button" onClick={() => handleupdateStatusFabrikasi(0, selectedReadiness.fabrikasi_material.id)} className={`bg-blue-500 text-white p-2 rounded-xl flex justify-center items-center hover:bg-blue-600 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} text-xs`} disabled={isSubmitting}>Selesai</button>
                      <button type="button" onClick={() => handleupdateStatusFabrikasi(1, selectedReadiness.fabrikasi_material.id)} className={`bg-green-500 text-white p-2 rounded-xl flex justify-center items-center hover:bg-green-600 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} text-xs`} disabled={isSubmitting}>{'On Going'}</button>
                      <button type="button" onClick={() => handleupdateStatusFabrikasi(2, selectedReadiness.fabrikasi_material.id)} className={`bg-yellow-500 text-white p-2 rounded-xl flex justify-center items-center hover:bg-yellow-600 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} text-xs`} disabled={isSubmitting}>{'Telat < 1bln'}</button>
                    </>
                    : 
                    <>
                      <button type="button" onClick={() => handleupdateStatusFabrikasi(1, selectedReadiness.fabrikasi_material.id)} className={`bg-green-500 text-white p-2 rounded-xl flex justify-center items-center hover:bg-green-600 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} text-xs`} disabled={isSubmitting}>{'On Going'}</button>
                      <button type="button" onClick={() => handleupdateStatusFabrikasi(2, selectedReadiness.fabrikasi_material.id)} className={`bg-yellow-500 text-white p-2 rounded-xl flex justify-center items-center hover:bg-yellow-600 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} text-xs`} disabled={isSubmitting}>{'Telat < 1bln'}</button>
                      <button type="button" onClick={() => handleupdateStatusFabrikasi(3, selectedReadiness.fabrikasi_material.id)} className={`bg-red-500 text-white p-2 rounded-xl flex justify-center items-center hover:bg-red-600 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} text-xs`} disabled={isSubmitting}>{'Telat > 1bln'}</button>
                    </>
                  }
                  <button type="button" onClick={() => handleDeleteFabrikasi(selectedReadiness?.fabrikasi_material)} className={`bg-slate-500 text-white p-2 rounded-xl flex justify-center items-center hover:bg-slate-600 cursor-pointer text-xs`}><IconTrash className="w-4" /> Hapus</button>
                  <button type="submit" className={`bg-slate-500 text-xs text-white p-2  rounded-xl flex hover:bg-slate-600 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} items-center`}> <IconPencil className="w-4" /> Update</button> 
                </>
                : <button type="submit" className={`bg-emerald-950 text-lime-300 p-2  rounded-xl flex hover:bg-emerald-900 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}>Simpan</button>
              }
              <button type="button" onClick={fabrikasiClose} className="bg-slate-500 p-2 cursor-pointer rounded-xl flex text-white hover:bg-slate-600 text-xs items-center"> <IconX className="w-4" /> Batal</button>
            </div>
          </form>
        </Box>
      </Modal>




      {/* modal Delivery material */}
      <Modal
        open={openDelivery}
        onClose={deliveryClose} 
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box className="bg-white rounded-2xl shadow-lg p-4 relative top-1/2 left-1/2 w-[90%] md:w-1/2 transform -translate-x-1/2 -translate-y-1/2 ">
          <form onSubmit={(e) => {selectedReadiness.delivery_material ? handleUpdateDelivery(e, selectedReadiness.delivery_material.id) : handleAddDelivery(e)}} method="POST">
            <h1 className="text-xl uppercase text-gray-900 mb-4">
              {selectedReadiness.delivery_material ? "Update" : "Tambah"} Delivery Material
            </h1>
            <div className="flex flex-col space-y-2">
              <div>
                <label htmlFor="description">Keterangan <sup className='text-red-500'>*</sup></label>
                <input
                  type="text"
                  name="description"
                  id="description"
                  placeholder="Masukkan Keterangan Delivery Material"
                  className="border border-slate-200 rounded-md p-2 w-full bg-transparent outline-none"
                  defaultValue={selectedReadiness.delivery_material ? selectedReadiness.delivery_material.description : ''}
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
                <label htmlFor="delivery_file">Delivery File</label>
                <input 
                  type="file" 
                  name="delivery_file"
                  className="border rounded-md p-2 w-full" />
                  {selectedReadiness?.delivery_material?.delivery_file ? (
                    <div className='flex flex-row justify-between items-center w-full border bg-lime-400 rounded p-1'>
                        <Link
                          to={`${base_public_url}readiness_ta/material/delivery/${selectedReadiness?.delivery_material?.delivery_file}`}
                          target='_blank'
                          className='text-emerald-950 hover:underline cursor-pointer text-xs'
                        >
                          {selectedReadiness?.delivery_material?.delivery_file}
                        </Link>
                    </div>
                  ) : (
                    ''
                  )}
                {validation.delivery_file && (
                  validation.delivery_file.map((item, index) => (
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
                  defaultValue={selectedReadiness.delivery_material ? selectedReadiness.delivery_material.target_date : ''}
                  required
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
              {selectedReadiness.delivery_material?.target_date 
                ? 
                <>
                  {selectedReadiness.delivery_material?.status == 1 ?
                    <>
                      <button type="button" onClick={() => handleupdateStatusDelivery(0, selectedReadiness.delivery_material.id)} className={`bg-blue-500 text-white p-2 rounded-xl flex justify-center items-center hover:bg-blue-600 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} text-xs`} disabled={isSubmitting}>Selesai</button>
                      <button type="button" onClick={() => handleupdateStatusDelivery(2, selectedReadiness.delivery_material.id)} className={`bg-yellow-500 text-white p-2 rounded-xl flex justify-center items-center hover:bg-yellow-600 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} text-xs`} disabled={isSubmitting}>{'Telat < 1bln'}</button>
                      <button type="button" onClick={() => handleupdateStatusDelivery(3, selectedReadiness.delivery_material.id)} className={`bg-red-500 text-white p-2 rounded-xl flex justify-center items-center hover:bg-red-600 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} text-xs`} disabled={isSubmitting}>{'Telat > 1bln'}</button>
                    </>
                    : selectedReadiness.delivery_material?.status == 2 ?
                    <>
                      <button type="button" onClick={() => handleupdateStatusDelivery(0, selectedReadiness.delivery_material.id)} className={`bg-blue-500 text-white p-2 rounded-xl flex justify-center items-center hover:bg-blue-600 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} text-xs`} disabled={isSubmitting}>Selesai</button>
                      <button type="button" onClick={() => handleupdateStatusDelivery(1, selectedReadiness.delivery_material.id)} className={`bg-green-500 text-white p-2 rounded-xl flex justify-center items-center hover:bg-green-600 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} text-xs`} disabled={isSubmitting}>{'On Going'}</button>
                      <button type="button" onClick={() => handleupdateStatusDelivery(3, selectedReadiness.delivery_material.id)} className={`bg-red-500 text-white p-2 rounded-xl flex justify-center items-center hover:bg-red-600 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} text-xs`} disabled={isSubmitting}>{'Telat > 1bln'}</button>
                    </>
                    : selectedReadiness.delivery_material?.status == 3 ?
                    <>
                      <button type="button" onClick={() => handleupdateStatusDelivery(0, selectedReadiness.delivery_material.id)} className={`bg-blue-500 text-white p-2 rounded-xl flex justify-center items-center hover:bg-blue-600 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} text-xs`} disabled={isSubmitting}>Selesai</button>
                      <button type="button" onClick={() => handleupdateStatusDelivery(1, selectedReadiness.delivery_material.id)} className={`bg-green-500 text-white p-2 rounded-xl flex justify-center items-center hover:bg-green-600 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} text-xs`} disabled={isSubmitting}>{'On Going'}</button>
                      <button type="button" onClick={() => handleupdateStatusDelivery(2, selectedReadiness.delivery_material.id)} className={`bg-yellow-500 text-white p-2 rounded-xl flex justify-center items-center hover:bg-yellow-600 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} text-xs`} disabled={isSubmitting}>{'Telat < 1bln'}</button>
                    </>
                    : 
                    <>
                      <button type="button" onClick={() => handleupdateStatusDelivery(1, selectedReadiness.delivery_material.id)} className={`bg-green-500 text-white p-2 rounded-xl flex justify-center items-center hover:bg-green-600 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} text-xs`} disabled={isSubmitting}>{'On Going'}</button>
                      <button type="button" onClick={() => handleupdateStatusDelivery(2, selectedReadiness.delivery_material.id)} className={`bg-yellow-500 text-white p-2 rounded-xl flex justify-center items-center hover:bg-yellow-600 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} text-xs`} disabled={isSubmitting}>{'Telat < 1bln'}</button>
                      <button type="button" onClick={() => handleupdateStatusDelivery(3, selectedReadiness.delivery_material.id)} className={`bg-red-500 text-white p-2 rounded-xl flex justify-center items-center hover:bg-red-600 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} text-xs`} disabled={isSubmitting}>{'Telat > 1bln'}</button>
                    </>
                  }
                  <button type="button" onClick={() => handleDeleteDelivery(selectedReadiness?.delivery_material)} className={`bg-slate-500 text-white p-2 rounded-xl flex justify-center items-center hover:bg-slate-600 cursor-pointer text-xs`}><IconTrash className="w-4" /> Hapus</button>
                  <button type="submit" className={`bg-slate-500 text-xs text-white p-2  rounded-xl flex hover:bg-slate-600 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} items-center`}> <IconPencil className="w-4" /> Update</button> 
                </>
                : <button type="submit" className={`bg-emerald-950 text-lime-300 p-2  rounded-xl flex hover:bg-emerald-900 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}>Simpan</button>
              }
              <button type="button" onClick={deliveryClose} className="bg-slate-500 p-2 cursor-pointer rounded-xl flex text-white hover:bg-slate-600 text-xs items-center"> <IconX className="w-4" /> Batal</button>
            </div>
          </form>
        </Box>
      </Modal>


    </div>
  )
}

export default ReadinessMaterial