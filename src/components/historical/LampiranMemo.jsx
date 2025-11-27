import { Breadcrumbs, Modal, Typography } from "@mui/material"
import Header from "../Header"
import { IconArticle, IconChevronRight, IconCloudDownload } from "@tabler/icons-react"
import { Link, useParams } from "react-router-dom"
import { DataGrid, GridToolbarQuickFilter } from "@mui/x-data-grid"
import * as motion from 'motion/react-client';
import { useState } from "react"
import { IconCircleMinus } from "@tabler/icons-react"
import { addLampiran, deleteLampiran, downloadSelectedLampiran, getLampiranByHistorical } from "../../services/lampiran_memo.service"
import { useEffect } from "react"
import { api_public } from '../../services/config';
import { IconPlus } from "@tabler/icons-react"
import Swal from "sweetalert2"
import { jwtDecode } from "jwt-decode"
import { handleAddActivity } from "../../utils/handleAddActivity"

const LampiranMemo = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [lampiran, setLampiran] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const base_public_url = api_public;
  const [hide, setHide] = useState(false);
  const [userLevel, setUserLevel] = useState('');
  const [uploadProgress, setUploadProgress] = useState({});
  const [animatedProgress, setAnimatedProgress] = useState({});
  const [selectedRows, setSelectedRows] = useState([])

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimatedProgress((prev) => {
        const updated = { ...prev };
        Object.entries(uploadProgress).forEach(([filename, { value }]) => {
          const current = prev[filename]?.value || 0;
          const diff = value - current;

          if (Math.abs(diff) > 0.01) {
            updated[filename] = {
              value: current + diff * 0.1, // naikkan 10% dari jarak setiap interval
            };
          } else {
            updated[filename] = { value }; // capai target
          }
        });
        return updated;
      });
    }, 30); // update setiap 30ms untuk smooth

    return () => clearInterval(interval);
  }, [uploadProgress]);



  useEffect(() => {
    const token = localStorage.getItem('token');
    let level = '';
    try {
        level = String(jwtDecode(token).level_user);
    } catch (error) {
        console.error('Invalid token:', error);
    }
    setUserLevel(level);
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
    e.preventDefault();
    const files = e.target.lampiran_memo.files;

    if (files.length > 10) {
      Swal.fire("Batas Terlampaui", "Maksimal 10 file!", "warning");
      return;
    }

    const MAX_SIZE = 200 * 1024 * 1024; // 200 MB dalam byte
    const oversizedFiles = Array.from(files).filter(file => file.size > MAX_SIZE);

    if (oversizedFiles.length > 0) {
      const list = oversizedFiles.map(f => `• ${f.name} (${(f.size / 1024 / 1024).toFixed(2)} MB)`).join('\n');
      handleClose();
      Swal.fire({
        icon: "error",
        title: "Ukuran File Terlalu Besar!",
        html: `<pre class="text-left text-sm whitespace-pre-wrap">${list}</pre>`,
        footer: "Setiap file maksimal 200 MB."
      });
      return; // stop submit
    }

    setIsSubmitting(true);
    let failedFiles = [];

    for (let i = 0; i < files.length; i++) {
      const formData = new FormData();
      formData.append('lampiran_memo[]', files[i]);
      formData.append('historical_memorandum_id', id);

      try {
        await addLampiran(formData, (progressEvent) => {
          const rawPercent = (progressEvent.loaded / progressEvent.total) * 100;
          const percentDisplay = rawPercent.toFixed(2).replace('.', ',') + '%';

          setUploadProgress((prev) => ({
            ...prev,
            [files[i].name]: {
              value: rawPercent,
              display: percentDisplay
            }
          }));
        });
      } catch (error) {
        const fileName = files[i].name;

        if (error?.response?.status === 422) {
          const errorData = error.response.data.errors;
          const matchingErrors = [];

          for (const [key, messages] of Object.entries(errorData)) {
            const match = key.match(/^lampiran_memo\.(\d+)$/);
            if (match && parseInt(match[1]) === 0) {
              matchingErrors.push(...messages);
            }
          }

          failedFiles.push({
            name: fileName,
            error: matchingErrors.length > 0 ? matchingErrors.join('; ') : 'Validasi gagal.'
          });
        } else {
          failedFiles.push({
            name: fileName,
            error: error?.response?.data?.message || 'Terjadi kesalahan saat upload.'
          });
        }

        console.error(`Gagal mengunggah file ${fileName}:`, error);
      }
    }

    setIsSubmitting(false);
    fetchLampiran();
    setOpen(false);
    setUploadProgress({}); // reset progress

    if (failedFiles.length > 0) {
      const list = failedFiles.map(f => `• ${f.name} (${f.error})`).join('\n');
      Swal.fire({
        icon: "warning",
        title: `${failedFiles.length} file gagal diunggah`,
        html: `<pre class="text-left text-sm whitespace-pre-wrap">${list}</pre>`,
      });
    } else {
      Swal.fire("Sukses", "Semua file berhasil diunggah!", "success");
    }
  };


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
          setLampiran([]);
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
        onClick={() => handleAddActivity(params.value, "LAMPIRAN HISTORICAL MEMO")}
      >
        {params.value}
      </Link>
    </div> },
    ...(userLevel !== '4' && userLevel !== '5' ? [{
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
    }] : []),
  ];

  const handleDownloadSelected = () => {
      if (selectedRows.length === 0) {
        Swal.fire("Peringatan!", "Tidak ada file yang dipilih!", "warning");
        return;
      }
  
      downloadSelectedLampiran(selectedRows);
      Swal.fire("Berhasil!", `${selectedRows.length} file berhasil didownload!`, "success");
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

  const handleClose = () => {
    setOpen(false);
  };


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
            <div className="flex flex-row justify-end py-2 gap-1">
              {selectedRows.length > 0 && (
                <button
                    onClick={handleDownloadSelected}
                    className='flex space-x-1 items-center px-2 py-1 bg-emerald-950 text-lime-300 text-sm rounded hover:scale-110 transition duration-100'
                >
                    <IconCloudDownload />
                    <span>Download file Lampiran Memo</span>
                </button>
                )}
              { userLevel !== '4' && userLevel !== '5' && <button onClick={() => setOpen(true)} className='flex space-x-1 items-center px-2 py-1 bg-emerald-950 text-lime-300 text-sm rounded  hover:scale-110 transition duration-100' >
                <IconPlus className='hover:rotate-180 transition duration-500' />
                <span>Tambah Lampiran</span>
              </button>}
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
                        name="lampiran_memo[]"
                        multiple
                        accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.jpg,.jpeg,.png,.zip,.rar"
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
                  {Object.keys(uploadProgress).length > 0 && (
                    <div className="mt-4 space-y-4">
                      {Object.entries(uploadProgress).map(([filename, { value }]) => {
                        const animated = animatedProgress[filename]?.value || 0;
                        const percentText = animated.toFixed(2).replace('.', ',') + '%';

                        return (
                          <div key={filename}>
                            <div className="text-sm text-emerald-950 mb-1">{filename}</div>
                            <div className="w-full bg-gray-200 rounded h-2 overflow-hidden">
                              <div
                                className="bg-emerald-600 h-2 rounded transition-all duration-200 ease-in-out"
                                style={{ width: `${animated}%` }}
                              ></div>
                            </div>
                            {animated < 100 && (
                              <div className="text-center text-sm text-emerald-950 font-medium">
                                Uploading... {percentText}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}



                </div>
              </Modal>

            </div>
            {loading ? <p>Loading...</p> : 
            <DataGrid
              rows={lampiran}
              columns={columns}
              slots={{ toolbar: CustomQuickFilter }}
              initialState={{
                pagination: {
                  paginationModel: { page: 0, pageSize: 20 },
                },
              }}
              checkboxSelection
              pageSizeOptions={[20, 50, 100, 200, { value: -1, label: 'All' }]}
              onRowSelectionModelChange={(newSelectionModel) => {
                  setSelectedRows(newSelectionModel); // Update state dengan ID yang dipilih
              }}
            />}
          </div>
        </div>
      </div>
    </div>
  )
}

export default LampiranMemo