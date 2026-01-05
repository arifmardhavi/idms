import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { addOverhaul, deleteOverhaul, getOverhaulByLaporanInspection, updateOverhaul } from "../../services/overhaul.service";
import { useEffect } from "react";
import { DataGrid, GridToolbarQuickFilter } from "@mui/x-data-grid";
import { Autocomplete, Box, Modal, TextField, Tooltip } from "@mui/material";
import * as motion from 'motion/react-client';
import { IconCircleMinus, IconCloudDownload, IconPencil, IconPlus, IconRefresh } from "@tabler/icons-react";
import { getHistoricalMemorandum } from "../../services/historical_memorandum.service";
import { api_public } from '../../services/config';
import Swal from "sweetalert2";
import { handleAddActivity } from "../../utils/handleAddActivity";

const Overhaul = () => {
  const { id } = useParams();
  const [Overhaul, setOverhaul] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [historicalMemorandum, setHistoricalMemorandum] = useState([]);
  const [selectedHistoricalMemo, setSelectedHistoricalMemo] = useState(null);
  const [validation, setValidation] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [SelectedEditData, setSelectedEditData] = useState([]);
  const [hasMemo, setHasMemo] = useState(false);
  const base_public_url = api_public;
  const handleClose = () => {setOpen(false); setOpenEdit(false); setValidation({}); setSelectedHistoricalMemo(null); setHasMemo(false);};
  useEffect(() => {
    fetchOverhaul();
    fetchHistoricalMemorandum();
  }, []);
  

  const fetchOverhaul = async () => {
    try {
      setLoading(true);
      const data = await getOverhaulByLaporanInspection(id);
      setOverhaul(data.data);
      console.log("Overhaul Data:", data.data);
      
      // Fetch data logic here
      // setOverhaul(data);
    } catch (error) {
      console.error("Error fetching Overhaul data:", error);
    } finally {
      setLoading(false);
    }
  }

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
      

  const handleAddOverhaul = async (e) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      const formData = new FormData(e.target);
      hasMemo ? formData.append('historical_memorandum_id', selectedHistoricalMemo) : formData.append('laporan_file', e.target.laporan_file.files[0]);
      formData.append('laporan_inspection_id', id);
      const data = await addOverhaul(formData);
      console.log("Added Overhaul:", data);
      handleClose();
      fetchOverhaul();
      Swal.fire({
        title: 'Berhasil!',
        text: 'Overhaul berhasil ditambahkan!',
        icon: 'success',
        showConfirmButton: true,
        timer: 1500
      });
    } catch (error) {
      console.error("Error adding Overhaul:", error);
      setValidation(error.response?.data.errors || []);
    } finally {
      setIsSubmitting(false);
    }
  }
  const handleUpdateOverhaul = async (e) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      const formData = new FormData(e.target);
      if(hasMemo) {
        formData.append('historical_memorandum_id', selectedHistoricalMemo);
        formData.delete('laporan_file');
      }else{
        e.target.laporan_file.files[0] && formData.append('laporan_file', e.target.laporan_file?.files[0])
        formData.delete('historical_memorandum_id');
      }
      formData.append('laporan_inspection_id', id);
      const data = await updateOverhaul(SelectedEditData.id, formData);
      console.log("updated Overhaul:", data);
      handleClose();
      fetchOverhaul();
      Swal.fire({
        title: 'Berhasil!',
        text: 'Overhaul berhasil diupdate!',
        icon: 'success',
        showConfirmButton: true,
        timer: 1500
      });
    } catch (error) {
      console.error("Error updating Overhaul:", error);
      setValidation(error.response?.data.errors || []);
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleClickEdit = (row) => {
    row.historical_memorandum ? setSelectedHistoricalMemo(row.historical_memorandum.id) : setSelectedHistoricalMemo(null);
    setSelectedEditData(row);
    setHasMemo(row.historical_memorandum ? true : false);
    setOpenEdit(true);
  }

  const columns = [
    { field: 'judul', headerName: 'Judul', width: 200 },
    { field: 'overhaul_date', headerName: 'Tanggal Overhaul', width: 220 },
    { field: 'historical_memorandum',
      valueGetter: (params) => {params ? (params?.perihal + '-' + params?.no_dokumen) : '-';},
      headerName: 'Historical Memo', 
      width: 150, 
      renderCell: (params) => (
        <div className='flex py-2 pl-5 '>
          { params.row.historical_memorandum ?
            <Tooltip title={`${params.row.historical_memorandum.no_dokumen} - ${params.row.historical_memorandum.perihal}`} placement='bottom'>
              <Link
                  to={`${base_public_url}historical_memorandum/${params.row.historical_memorandum.memorandum_file}`}
                  target='_blank'
                  className='text-lime-400 px-2 rounded-md hover:underline cursor-pointer'
                  onClick={() => handleAddActivity(params.row.historical_memorandum.memorandum_file, "LAPORAN INSPEKSI") }
              >
                  <IconCloudDownload />
              </Link> 
            </Tooltip> : '-'
          }
        </div>
        // <span>
        //   {params.row.historical_memorandum
        //     ? [
        //         params.row.historical_memorandum.no_dokumen,
        //         params.row.historical_memorandum.perihal
        //       ]
        //         .filter(Boolean) // buang null/undefined/empty
        //         .join(" - ")
        //     : 'N/A'}
        // </span>

    )},
    { field: 'laporan_file', headerName: 'Laporan File', width: 100, renderCell: (params) => (
      <div className='flex py-2 pl-5 '>
        {params.row.laporan_file ? (
          <Tooltip title={`${params.row.laporan_file}`} placement='bottom'>
            <Link
              to={`${base_public_url}laporan_inspection/overhaul/${params.value}`}
              target='_blank'
              className='text-lime-400 px-2 rounded-md hover:underline cursor-pointer'
              onClick={() => handleAddActivity(params.row.laporan_file, "LAPORAN INSPEKSI") }
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
            <IconCircleMinus stroke={2} />
          </motion.button>
          </Tooltip>
        </div>
      ),
    },
  ]

  const handleDelete = async (row) => {
      const result = await Swal.fire({
          title: "Apakah Anda yakin?",
          text: "Data Overhaul akan dihapus secara permanen!",
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Ya, hapus!",
          cancelButtonText: "Batal",
      });
  
      if (result.isConfirmed) {
          try {
              const res = await deleteOverhaul(row.id);
              if (res.success) {
                  Swal.fire("Berhasil!", "Overhaul berhasil dihapus!", "success");
                  fetchOverhaul();
              } else {
                  Swal.fire("Gagal!", "Terjadi kesalahan saat menghapus Overhaul!", "error");
              }
          } catch (error) {
              console.error("Error deleting Overhaul:", error);
              Swal.fire("Gagal!", "Terjadi kesalahan saat menghapus Overhaul!", "error");
          }
      }
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
    <div className="flex flex-col space-y-4">
      <div className="flex flex-row justify-between space-x-4">
        <h1 className="text-xl font-bold p-2 uppercase">Overhaul</h1>
        <div className="flex justify-end gap-2 items-center">
          <button className="bg-emerald-950 text-lime-300 p-2 cursor-pointer rounded-xl flex gap-1 hover:bg-emerald-900" onClick={() => setOpen(true)}> <IconPlus className="hover:rotate-90 duration-300" /> Tambah</button>
          <button
            onClick={fetchOverhaul}
            className="bg-emerald-950 text-lime-300 p-2 cursor-pointer rounded-xl flex gap-1 hover:bg-emerald-900"
          >
          <IconRefresh className="hover:rotate-90 duration-300" /> Refresh
          </button>
        </div>
      </div>
      <div>
        { loading ? <p>Loading...</p> : <DataGrid
          rows={Overhaul}
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
          <form onSubmit={(e) => handleAddOverhaul(e)} method="POST" className="space-y-4">
            <h1 className="text-xl uppercase text-gray-900 mb-4">
              Tambah Overhaul
            </h1>
            <div className="space-y-3">
              <div>
                <label htmlFor="judul">Judul<sup className='text-red-500'>*</sup> </label>
                <input type="text" name="judul" className="border rounded-md p-2 w-full" placeholder="Masukkan Judul" required />
              </div>
              <div>
                <label htmlFor="overhaul_date">Overhaul Date<sup className='text-red-500'>*</sup></label>
                <input type="date" name="overhaul_date" className="border rounded-md p-2 w-full" required />
              </div>
              <div>
                <label htmlFor="memo">Ada Memo ?</label>
                <select onChange={(e) => (e.target.value === 'yes') ? setHasMemo(true) : setHasMemo(false) } className="border rounded-md p-2 w-full">
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
                <label htmlFor="laporan_file">Upload Laporan<sup className='text-red-500'>*</sup></label>
                <input 
                  type="file" 
                  name="laporan_file"
                  className="border rounded-md p-2 w-full" />
              </div>
              }
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
          <form onSubmit={(e) => handleUpdateOverhaul(e)} method="POST" className="space-y-4">
            <h1 className="text-xl uppercase text-gray-900 mb-4">
              Update Overhaul
            </h1>
            <div className="space-y-3">
              <div>
                <label htmlFor="judul">Judul<sup className='text-red-500'>*</sup> </label>
                <input type="text" name="judul" className="border rounded-md p-2 w-full" placeholder="Masukkan Judul" defaultValue={SelectedEditData.judul} required />
              </div>
              <div>
                <label htmlFor="overhaul_date">Overhaul Date<sup className='text-red-500'>*</sup></label>
                <input type="date" name="overhaul_date" defaultValue={SelectedEditData.overhaul_date} className="border rounded-md p-2 w-full" required />
              </div>
              <div>
                <label htmlFor="overhaul_date">Ada Memo ?</label>
                <select onChange={(e) => (e.target.value === 'yes') ? setHasMemo(true) : setHasMemo(false) } defaultValue={hasMemo ? 'yes' : 'no'} className="border rounded-md p-2 w-full">
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
                <label htmlFor="laporan_file">Upload Laporan<sup className='text-red-500'>*</sup></label>
                <input 
                  type="file" 
                  name="laporan_file"
                  className="border rounded-md p-2 w-full" />
                  <div className="text-sm bg-lime-300 text-emerald-950 p-2 rounded-xl">
                    <Link className="hover:underline" target="_blank" onClick={() => handleAddActivity(SelectedEditData?.laporan_file, "LAPORAN INSPEKSI") } to={`${base_public_url}laporan_inspection/overhaul/${SelectedEditData.laporan_file}`}>{SelectedEditData.laporan_file ? SelectedEditData.laporan_file : '-'}</Link>
                  </div>
              </div>
              }
            </div>
            <div className="flex flex-row space-x-2 justify-end text-center items-center">
              <button type="submit" className={`bg-emerald-950 text-lime-300 p-2  rounded-xl flex hover:bg-emerald-900 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}>Simpan</button>
              <button type="button" onClick={handleClose} className="bg-slate-700 p-2 cursor-pointer rounded-xl flex text-white hover:bg-slate-600">Batal</button>
            </div>
          </form>
        </Box>
      </Modal>
    </div>
  )
}

export default Overhaul