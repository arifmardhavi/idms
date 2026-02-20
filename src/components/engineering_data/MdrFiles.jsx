import { useState } from 'react'
import { IconArticle, IconChevronRight, IconFolder, IconLoader2, IconPlus, IconRefresh, IconTrash } from '@tabler/icons-react'
import { useEffect } from 'react'
import { jwtDecode } from 'jwt-decode'
import { DataGrid, GridLogicOperator, GridToolbarQuickFilter } from '@mui/x-data-grid'
import { Link, useParams } from 'react-router-dom'
import Swal from 'sweetalert2'
import { Box, Breadcrumbs, Modal, Typography } from '@mui/material'
import Header from '../Header'
import { addMdrItem, deleteMdrItem, getMdrItemByFolder } from '../../services/mdr_item.service'
import { api_public } from '../../services/config'

const MdrFiles = () => {
  const {folder, id} = useParams();
  const base_public_url = api_public;
  const [hide, setHide] = useState(false);
  const [userLevel, setUserLevel] = useState('');
  const [loading, setLoading] = useState(false);
  const [mdrItem, setMdrItem] = useState([]);
  const [openEvent, setOpenEvent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validation, setValidation] = useState({});
  const [uploadProgress, setUploadProgress] = useState({});
  const [engineering_data_id, setEngineering_data_id ] = useState('');
  

  useEffect(() => {
      const token = localStorage.getItem('token');
      let level = '';
      try {
          level = String(jwtDecode(token).level_user);
      } catch (error) {
          console.error('Invalid token:', error);
      }
      setUserLevel(level);
      fetchMdrItem();
  }, []);

  const fetchMdrItem = async () => {
      setLoading(true);
      try {
          const data = await getMdrItemByFolder(id);
          setMdrItem(data.data);
          setEngineering_data_id(data.data[0].mdr_folder.engineering_data_id);
      } catch (error) {
          console.error('Error fetching MDR data:', error);
      } finally {
          setLoading(false);
      }
  };

  const handleAddMdrItem = async (e) => {
    e.preventDefault();
    const files = e.target.file_name.files;

    if (files.length > 10) {
      Swal.fire("Batas Terlampaui", "Maksimal 10 file!", "warning");
      return;
    }

    const MAX_SIZE = 150 * 1024 * 1024; // 200 MB dalam byte
    const oversizedFiles = Array.from(files).filter(file => file.size > MAX_SIZE);

    if (oversizedFiles.length > 0) {
      const list = oversizedFiles.map(f => `• ${f.name} (${(f.size / 1024 / 1024).toFixed(2)} MB)`).join('\n');
      eventClose();
      Swal.fire({
        icon: "error",
        title: "Ukuran File Terlalu Besar!",
        html: `<pre class="text-left text-sm whitespace-pre-wrap">${list}</pre>`,
        footer: "Setiap file maksimal 150 MB."
      });
      return; // stop submit
    }

    setIsSubmitting(true);
    let failedFiles = [];

    for (let i = 0; i < files.length; i++) {
      const formData = new FormData();
      formData.append('file_name[]', files[i]);
      formData.append('mdr_folder_id', id);

      try {
        console.log(formData);
        await addMdrItem(formData, (progressEvent) => {
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
            const match = key.match(/^file_name\.(\d+)$/);
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
    fetchMdrItem();
    setOpenEvent(false);
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

  const handleDeleteMdrItem = async (row) => {
    const result = await Swal.fire({
      title: "Apakah Anda yakin?",
      text: "Data File akan dihapus secara permanen!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
    });

    if (result.isConfirmed) {
        try {
            const res = await deleteMdrItem(row.id);
            if (res.success) {
                Swal.fire("Berhasil!", "File berhasil dihapus!", "success");
                fetchMdrItem();
            } else {
                Swal.fire("Gagal!", "Terjadi kesalahan saat menghapus File!", "error");
            }
        } catch (error) {
            console.error("Error deleting MDR Item:", error);
            Swal.fire("Gagal!", "Terjadi kesalahan saat MDR Item!", "error");
        }
    }
  };

  const columns = [
    { field: 'file_name', 
      headerName: 'Nama File', 
      width: 300, 
      renderCell: (params) => (
        <div className='flex flex-row justify-start items-center space-x-2'>
          <Link to={`${base_public_url}engineering_data/mdr/${params.row.file_name}`} target='_blank' className='flex flex-row justify-start items-center space-x-2 hover:underline hover:text-lime-400'>
            <span>{params.row.file_name}</span>
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
            onClick={() => handleDeleteMdrItem(params.row)}
            className='bg-red-500 text-white text-sm rounded-full px-2 py-1 hover:scale-110 transition duration-100 flex items-center space-x-1'
          >
            <IconTrash />
          </button>
        </div>
      ),
    },
  ];

  const eventOpen = () => {
    setOpenEvent(true);
    setValidation([]);
  }
  const eventClose = () => {
    setOpenEvent(false);
    setValidation([]);
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
          <Breadcrumbs
              aria-label='breadcrumb'
              className="uppercase"
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
            <Link className='hover:underline text-emerald-950' to={`/engineering_data/mdr/${engineering_data_id}`}>
              {folder}
            </Link>
            <Typography className='text-lime-500'>MDR File</Typography>
          </Breadcrumbs>
        <div className='w-full bg-white shadow-sm px-2 py-4 rounded-lg space-y-2'>
          <div className='flex flex-row justify-end items-center space-x-2'>
              <button
                  className='flex space-x-1 items-center px-2 py-1 bg-emerald-950 text-lime-300 text-sm rounded hover:scale-110 transition duration-100'
                  onClick={fetchMdrItem}
              >
                  <IconRefresh className='hover:rotate-180 transition duration-500' />
                  <span>Refresh</span>
              </button>
              { userLevel !== '4' && userLevel !== '5' && <button
                  onClick={eventOpen}
                  className='flex space-x-1 items-center px-2 py-1 bg-emerald-950 text-lime-300 text-sm rounded  hover:scale-110 transition duration-100'
              >
                  <IconPlus className='hover:rotate-180 transition duration-500' />
                  <span>Tambah</span>
              </button>}
              
              {/* modal MDR ITEM */}
              <Modal
                open={openEvent}
                onClose={eventClose} 
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
              >
                <Box className="bg-white rounded-2xl shadow-lg p-4 relative top-1/2 left-1/2 w-[90%] md:w-1/3 transform -translate-x-1/2 -translate-y-1/2 ">
                  <form onSubmit={(e) => {handleAddMdrItem(e)}} method="POST" encType="multipart/form-data">
                    <h1 className="text-xl uppercase text-gray-900 mb-4">
                      Tambah MDR File
                    </h1>
                    <div className="flex flex-col space-y-2">
                      <div>
                        <label htmlFor="file_name">Nama File <sup className='text-red-500'>*</sup></label>
                        <input
                          type="file"
                          id="file_name"
                          name="file_name[]"
                          multiple
                          accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.jpg,.jpeg,.png"
                          className="w-full p-2 rounded border"
                        />
                        {validation.file_name && (
                          validation.file_name.map((item, index) => (
                            <div key={index}>
                              <small className="text-red-600 text-sm">{item}</small>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                    <div className="flex flex-row space-x-2 justify-end text-center items-center mt-4">
                      <button type="submit" className={`bg-emerald-950 text-lime-300 p-2  rounded-xl flex hover:bg-emerald-900 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}>Simpan</button>
                      <button type="button" onClick={eventClose} className="bg-slate-700 p-2 cursor-pointer rounded-xl flex text-white hover:bg-slate-600">Batal</button>
                    </div>
                  </form>
                  {Object.keys(uploadProgress).length > 0 && (
                    <div className="mt-4 space-y-4">
                      {Object.entries(uploadProgress).map(([filename, { value }]) => (
                        <div key={filename}>
                          <div className="text-sm text-emerald-950 mb-1">{filename}</div>
                          <div className="w-full bg-gray-200 rounded h-2 overflow-hidden">
                            <div
                              className="bg-emerald-600 h-2 rounded"
                              style={{ width: `${value}%` }}
                            ></div>
                          </div>
                          <div className="text-center text-sm text-emerald-950 font-medium">
                            {value < 100 ? `Uploading... ${value.toFixed(2)}%` : "Completed"}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </Box>
              </Modal>
          
          </div>
          <div>
            {loading ? (
                <div className="flex flex-col items-center justify-center h-20">
                    <IconLoader2 stroke={2} className="animate-spin rounded-full h-10 w-10 " />
                </div>
            ) :<DataGrid
              rows={mdrItem}
              columns={columns}
              getRowId={(row) => row.id}
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

export default MdrFiles