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
import { addDatasheet, deleteDatasheet, getDatasheetByEngineering, updateDatasheet } from "../../services/datasheet.service"
import { useEffect } from "react"
import { IconRefresh } from "@tabler/icons-react"
import { IconLoader2 } from "@tabler/icons-react"
import { IconArrowLeft } from "@tabler/icons-react"
import { IconArrowRight } from "@tabler/icons-react"
import { IconPencil } from "@tabler/icons-react"
import { jwtDecode } from "jwt-decode"
import { IconCloudDownload } from "@tabler/icons-react"
import { IconFiles } from "@tabler/icons-react"
import { IconFile } from "@tabler/icons-react"
import { getCoiByTagNumber } from "../../services/coi.service"
import { getEngineeringDataById } from "../../services/engineering_data.service"
import { handleAddActivity } from "../../utils/handleAddActivity"

const Datasheet = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [Datasheet, setDatasheet] = useState([]);
  const base_public_url = api_public;
  const [hide, setHide] = useState(false);
  const [editDatasheet, setEditDatasheet] = useState(null);
  const [openEdit, setOpenEdit] = useState(false);
  const [openMultiple, setOpenMultiple] = useState(false);
  const [validation, setValidation] = useState([]);
  const [userLevel, setUserLevel] = useState('')
  const [uploadProgress, setUploadProgress] = useState({});
  const [animatedProgress, setAnimatedProgress] = useState({});
  const [isMultiple, setIsMultiple] = useState(false);
  const [isReEng, setIsReEng] = useState(null);

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
    fetchDatasheet();
    fetchReEngineering();
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

  const fetchDatasheetById = async (row) => {
      try {
          setEditDatasheet(row);
          setOpenEdit(true);
      } catch (error) {
          console.error("Error fetching Datasheet:", error);
      } finally {
          setLoading(false);
      }
  };
  const fetchReEngineering = async () => {
    try {
      setLoading(true);
      const tag_number = await getEngineeringDataById(id);
      const tag_number_id = tag_number.data.tag_number_id;
      // console.log('tagNUMBER : ', tag_number_id);
      const data = await getCoiByTagNumber(tag_number_id);
      if( data.data.re_engineer == 1) {
        // console.log('data COI : ', data.data.re_engineer_certificate);
        setIsReEng(data.data.re_engineer_certificate);
      }
    } catch (error) {
      console.error("Error fetching Datasheet:", error);
    } finally {
      setLoading(false);
    }
  }

  const handleSubmitEdit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const formData = new FormData(e.target);
      formData.append('engineering_data_id', id);
      console.log(formData);
      const res = await updateDatasheet(editDatasheet.id, formData);
      if (res.success) {
        setIsSubmitting(false);
        setOpenEdit(false);
        Swal.fire("Berhasil!", "Datasheet berhasil diupdate!", "success");
        fetchDatasheet();
        setValidation([])
      } else {
        setValidation(res.response?.data.errors || []);
        // Swal.fire("Error!", "something went wrong " . error.response?.data.errors.datasheet_file, "error");
        console.log(res.response.data.errors);
        setIsSubmitting(false);
      }
    } catch (error) {
      setValidation(error.response?.data.errors || []);
      setIsSubmitting(false);
      // Swal.fire("Error!", "something went wrong " . error.response?.data.errors.datasheet_file, "error");
      console.error("Error updating Datasheet:", error);
    }
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    const files = e.target.datasheet_file.files;

    if (files.length > 10) {
      Swal.fire("Batas Terlampaui", "Maksimal 10 file!", "warning");
      return;
    }

    setIsSubmitting(true);
    let failedFiles = [];

    for (let i = 0; i < files.length; i++) {
      const formData = new FormData();
      if (!isMultiple && files.length === 1) {
        formData.append('no_dokumen', e.target.no_dokumen.value);
        formData.append('date_datasheet', e.target.date_datasheet.value);
      }
      formData.append('datasheet_file[]', files[i]);
      formData.append('engineering_data_id', id);

      try {
        console.log(formData);
        await addDatasheet(formData, (progressEvent) => {
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
            const match = key.match(/^datasheet_file\.(\d+)$/);
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
    fetchDatasheet();
    setOpenMultiple(false);
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
          setDatasheet([]);
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
    { field: 'no_dokumen', headerName: 'No Dokumen', width:400, renderCell: (params) => <div className="">
      {params.value ? <Link
        to={`${base_public_url}engineering_data/datasheet/${params.row.datasheet_file}`}
        target='_blank'
        className='text-lime-500 underline'
        onClick={() => handleAddActivity(params.row.datasheet_file, "DATASHEET")}
      >
        {params.value}
      </Link> : '-'}
    </div> },
    {
      field: 'date_datasheet',
      headerName: 'Tanggal Dokumen',
      width: 150,
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
      field: 'datasheet_file',
      headerName: 'File',
      width: 100,
      renderCell: (params) => (
        <div className='py-4 flex flex-row justify-center items-center'>
          <Link
            to={`${base_public_url}engineering_data/datasheet/${params.row.datasheet_file}`}
            target='_blank'
            className='item-center text-lime-500'
            onClick={() => handleAddActivity(params.row.datasheet_file, "DATASHEET")}
          >
            <IconCloudDownload stroke={2} />
          </Link>
        </div>
      ),
    },
    ...(userLevel !== '4' && userLevel !== '5' ? [{
      field: 'actions',
      headerName: 'Aksi',
      width: 150,
      renderCell: (params) => (
        <div className='flex flex-row justify-center py-2 items-center space-x-2'>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className='px-2 py-1 bg-emerald-950 text-lime-300 text-sm rounded'
            onClick={() => fetchDatasheetById(params.row)}
          >
            <IconPencil stroke={2} />
          </motion.button>
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
    }] : [])
  ]


  const handleCloseEdit = () => {
      setOpenEdit(false);
      setValidation([])
  };
  const handleCloseMultiple = () => {
      setOpenMultiple(false);
      setValidation([])
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
                  { userLevel !== '4' && userLevel !== '5' && <button
                      onClick={() => setOpenMultiple(true)}
                      className='flex space-x-1 items-center px-2 py-1 bg-emerald-950 text-lime-300 text-sm rounded  hover:scale-110 transition duration-100'
                  >
                      <IconPlus className='hover:rotate-180 transition duration-500' />
                      <span>Tambah</span>
                  </button>}
              </div>

              {/* start modal add datasheet */}
              <Modal
                open={openMultiple}
                onClose={handleCloseMultiple}
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
                  <h2 id="modal-modal-title" className="text-emerald-950 font-bold uppercase text-center">Tambah Datasheet</h2>
                  <form method="post" encType="multipart/form-data" onSubmit={handleSubmit}>
                    <div className="flex flex-row justify-center items-center">
                      { isMultiple ? 
                        <div className="text-lime-300 bg-emerald-950 w-fit p-1 rounded text-sm flex justify-center items-center cursor-pointer" onClick={() => setIsMultiple(false)}>< IconFiles /> &nbsp; Multiple File Upload Mode</div>
                      :
                        <div className="bg-lime-300 text-emerald-950 w-fit p-1 rounded text-sm flex justify-center items-center cursor-pointer" onClick={() => setIsMultiple(true)}>< IconFile /> &nbsp; Single File Upload Mode</div>
                      }
                    </div>
                    {!isMultiple &&<div className="m-2">
                      <div className="text-emerald-950">
                        No Dokumen
                      </div>
                      <input
                        type="text"
                        id="no_dokumen"
                        name="no_dokumen"
                        className="w-full p-2 rounded border"
                        placeholder="Masukkan nomor dokumen"
                        
                      />
                      {validation.no_dokumen && validation.no_dokumen.map((item, index) => (
                        <div key={index} className="text-red-600 text-sm">
                          {item}
                        </div>
                      ))}
                    </div>}
                    <div className="m-2">
                      <div className="text-emerald-950">
                        Upload Datasheet File
                      </div>
                      <input
                        type="file"
                        id="datasheet_file"
                        name="datasheet_file[]"
                        multiple
                        accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.jpg,.jpeg,.png,.zip,.rar"
                        className="w-full p-2 rounded border"
                      />
                    </div>
                    {!isMultiple && <div className="m-2">
                      <div className="text-emerald-950">
                        Tanggal Dokumen
                      </div>
                      <input
                        type="date"
                        id="date_datasheet"
                        name="date_datasheet"
                        className="w-full p-2 rounded border"
                        required
                      />
                      {validation.date_datasheet && validation.date_datasheet.map((item, index) => (
                        <div key={index} className="text-red-600 text-sm">
                          {item}
                        </div>
                      ))}
                    </div>}
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
              {/* end modal add datasheet */}

              {/* start modal edit datasheet */}
              <Modal
                open={openEdit}
                onClose={handleCloseEdit}
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
                  <h2 id="modal-modal-title" className="text-emerald-950 font-bold uppercase text-center">Edit Datasheet</h2>
                  {editDatasheet && <form method="post" encType="multipart/form-data" onSubmit={handleSubmitEdit}>
                    <div className="m-2">
                      <div className="text-emerald-950">
                        No Dokumen
                      </div>
                      <input
                        type="text"
                        id="no_dokumen"
                        name="no_dokumen"
                        className="w-full p-2 rounded border"
                        placeholder="Masukkan nomor dokumen"
                        defaultValue={editDatasheet.no_dokumen}
                      />
                      {validation.no_dokumen && validation.no_dokumen.map((item, index) => (
                        <div key={index} className="text-red-600 text-sm">
                          {item}
                        </div>
                      ))}
                    </div>
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
                      {validation.datasheet_file && validation.datasheet_file.map((item, index) => (
                        <div key={index} className="text-red-600 text-sm">
                          {item}
                        </div>
                      ))}
                    </div>
                    {editDatasheet && editDatasheet.datasheet_file && <div className="m-2 bg-lime-300 text-emerald-950 p-1">
                      <Link 
                        to={`${base_public_url}engineering_data/datasheet/${editDatasheet.datasheet_file}`} 
                        target='_blank'
                        className="hover:underline" 
                        onClick={() => handleAddActivity(editDatasheet.datasheet_file, "DATASHEET")}
                      >
                        {editDatasheet.datasheet_file}
                      </Link>
                    </div>}
                    <div className="m-2">
                      <div className="text-emerald-950">
                        Tanggal Terbit
                      </div>
                      <input
                        type="date"
                        id="date_datasheet"
                        name="date_datasheet"
                        className="w-full p-2 rounded border"
                        defaultValue={editDatasheet.date_datasheet}
                      />
                      {validation.date_datasheet && validation.date_datasheet.map((item, index) => (
                        <div key={index} className="text-red-600 text-sm">
                          {item}
                        </div>
                      ))}
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
                  </form>}
                </div>
              </Modal>
              {/* end modal edit datasheet */}


            </div>
            {loading ? 
              <div className="flex flex-col items-center justify-center h-20">
                  <IconLoader2 stroke={2} className="animate-spin rounded-full h-10 w-10 " />
              </div> 
            :
            <>
            {isReEng && <div className="mb-2 bg-lime-300 text-emerald-950 w-fit p-1 rounded">Re Engineering : &nbsp; 
              <Link to={`${base_public_url}coi/re_engineer/${isReEng}`} target="_blank" className=" underline" onClick={() => handleAddActivity(isReEng, "DATASHEET")}>
                {isReEng}
              </Link>
            </div>}
            <DataGrid
              rows={Datasheet}
              columns={columns}
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
                  paginationModel: { pageSize: 10, page: 0 },
                },
                filter: {
                  filterModel: {
                    items: [],
                    quickFilterExcludeHiddenColumns: false,
                    quickFilterLogicOperator: GridLogicOperator.And,
                  },
                },
              }}
              pageSizeOptions={[ 10, 25, 50, { value: -1, label: 'All' }]}
            />
            </>}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Datasheet