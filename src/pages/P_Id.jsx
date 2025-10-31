import { useState } from "react"
import Header from "../components/Header"
import { IconArticle, IconFile, IconFiles, IconLoader2, IconPencil, IconPlus, IconRefresh, IconTrash } from "@tabler/icons-react"
import { Box, Modal } from "@mui/material"
import { DataGrid, GridLogicOperator, GridToolbarQuickFilter } from "@mui/x-data-grid"
import { addP_id, deleteP_id, getP_id, updateP_id } from "../services/p_id.service"
import { useEffect } from "react"
import Swal from "sweetalert2"
import { Link } from "react-router-dom"
import { api_public } from "../services/config"
import { handleAddActivity } from "../utils/handleAddActivity"

const P_Id = () => {
  const [hide, setHide] = useState(false)
  const [loading, setLoading] = useState(false)
  const [p_id, setP_id] = useState([])
  const [addOpen, setAddOpen] = useState(false);
  const [updateOpen, setUpdateOpen] = useState(false);
  const [validation, setValidation] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  // const [animatedProgress, setAnimatedProgress] = useState({});
  const [updateData, setUpdateData] = useState(null);
  const [isMultiple, setIsMultiple] = useState(true);
  const base_public_url = api_public;

  useEffect(() => {
    fetchP_id();
  }, []);


  const handleUpdateOpen = (data) => {
    setUpdateData(data);
    setUpdateOpen(true);
  }

  const handleClose = () => {
    setAddOpen(false);
  };
  const handleUpdateClose = () => {
    setUpdateOpen(false);
  };



  const fetchP_id = async () => {
    setLoading(true);
    try {
      const data = await getP_id();
      setP_id(data.data);
      console.log(data.data);
    } catch (error) {
      console.error("Error fetching P & ID:", error);
    } finally {
      setLoading(false);
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const files = e.target.p_id_file.files;

    if (files.length > 10) {
      Swal.fire("Batas Terlampaui", "Maksimal 10 file!", "warning");
      return;
    }

    setIsSubmitting(true);
    let failedFiles = [];

    for (let i = 0; i < files.length; i++) {
      const formData = new FormData();
      if (!isMultiple && files.length === 1) {
        formData.append('file_name', e.target.file_name.value);
      }
      formData.append('p_id_file[]', files[i]);

      try {
        console.log(formData);
        await addP_id(formData, (progressEvent) => {
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
            const match = key.match(/^p_id_file\.(\d+)$/);
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
    fetchP_id();
    handleClose();
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

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.target);
    try {
      const res = await updateP_id(updateData.id, formData);
      if (res.success) {
        fetchP_id();
        Swal.fire("Berhasil!", "P & ID berhasil di update!", "success");
        handleUpdateClose();
      } else {
        console.log(res.response.data.errors);
        setValidation(res.response?.data.errors || []);
      }
    } catch (error) {
      console.error("Error updating P & ID:", error);
      setValidation(error.response?.data.errors || []);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (row) => {
      const result = await Swal.fire({
        title: "Apakah Anda yakin?",
        text: "File P & ID akan dihapus secara permanen!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Ya, hapus!",
        cancelButtonText: "Batal",
      });
  
      if (result.isConfirmed) {
        try {
          const res = await deleteP_id(row.id);
          if (res.success) {
            Swal.fire("Berhasil!", "P & ID berhasil dihapus!", "success");
            setP_id([]);
            fetchP_id();
          } else {
            Swal.fire("Gagal!", "Terjadi kesalahan saat menghapus P & ID!", "error");
          }
        } catch (error) {
          console.log(error);
          Swal.fire("Gagal!", "Terjadi kesalahan saat menghapus P & ID!", "error");
        }
      }
    };

  const columns = [
    { field: 'file_name', 
      headerName: 'P & ID', 
      width: 450,
      renderCell: (params) => (
        <div className=''>
          <Link 
            className="underline text-lime-400 cursor-pointer"
            to={`${base_public_url}p_id/${params.row.p_id_file}`}
            target='_blank'
            onClick={() => handleAddActivity(params.row.p_id_file, "P & ID")} 
          >
            {params.row.file_name? params.row.file_name : params.row.p_id_file}
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
            onClick={() => handleUpdateOpen(params.row)}
            className='bg-yellow-500 text-sm rounded-full px-2 py-1 hover:scale-110 transition duration-100 mr-2 flex items-center space-x-1'
          >
            <IconPencil />
          </button>
          <button
            onClick={() => handleDelete(params.row)}
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
          <div className='w-full bg-white shadow-sm px-2 py-4 rounded-lg space-y-2'>
            <div className='flex flex-row justify-between'>
              <h1 className='text-xl font-bold uppercase'>P & ID</h1>
              <div className='flex flex-row justify-end items-center space-x-2'>
                  <button
                      className='flex space-x-1 items-center px-2 py-1 bg-emerald-950 text-lime-300 text-sm rounded hover:scale-110 transition duration-100'
                      onClick={fetchP_id}
                  >
                      <IconRefresh className='hover:rotate-180 transition duration-500' />
                      <span>Refresh</span>
                  </button>
                  <button
                    onClick={() => setAddOpen(true)}
                    className="flex space-x-1 items-center px-2 py-1 bg-emerald-950 text-lime-300 text-sm rounded hover:scale-110 transition duration-100"
                  >
                    <IconPlus className='hover:rotate-90 transition duration-500' /> Tambah
                  </button>
                  
  
  
                  {/* modal add P & ID */}
                  <Modal
                    open={addOpen}
                    onClose={handleClose} 
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                  >
                    <Box className="bg-white rounded-2xl shadow-lg p-4 relative top-1/2 left-1/2 w-[90%] md:w-1/3 transform -translate-x-1/2 -translate-y-1/2 ">
                      <form method="post" onSubmit={handleSubmit} className="space-y-2" encType="multipart/form-data">
                        <h1 className="text-xl uppercase text-gray-900 mb-4 text-center">
                          Tambah P & ID
                        </h1>
                        <div className="flex justify-center w-full mb-2">
                          { isMultiple ? 
                            <div className="text-lime-300 bg-emerald-950 w-fit p-1 rounded text-sm flex justify-center items-center cursor-pointer" onClick={() => setIsMultiple(false)}>< IconFiles /> &nbsp; Multiple File Upload Mode</div>
                          :
                            <div className="bg-lime-300 text-emerald-950 w-fit p-1 rounded text-sm flex justify-center items-center cursor-pointer" onClick={() => setIsMultiple(true)}>< IconFile /> &nbsp; Single File Upload Mode</div>
                          }
                        </div>
                        { !isMultiple && <div>
                          <label htmlFor="file_name">Deskripsi</label>
                          <input
                            type="text"
                            name="file_name"
                            id="file_name"
                            placeholder="Masukkan Deskripsi"
                            className="border border-slate-200 rounded-md p-2 w-full bg-transparent outline-none"
                            // required
                          />
                          {validation.file_name && (
                            validation.file_name.map((item, index) => (
                              <div key={index}>
                                <small className="text-red-600 text-sm">{item}</small>
                              </div>
                            ))
                          )}
                        </div>}
                        <div>
                          <label htmlFor="p_id_file">File P & ID <sup className='text-red-500'>*</sup></label>
                          <input
                            type="file"
                            name="p_id_file[]"
                            id="p_id_file"
                            className="border border-slate-200 rounded-md p-2 w-full bg-transparent outline-none"
                            required
                            accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.jpg,.jpeg,.png"
                            multiple={isMultiple}
                          />
                          {validation.p_id_file && (
                            validation.p_id_file.map((item, index) => (
                              <div key={index}>
                                <small className="text-red-600 text-sm">{item}</small>
                              </div>
                            ))
                          )}
                        </div>
                        <div className="flex flex-row space-x-2 justify-end text-center items-center mt-4">
                          <button type="submit" className={`bg-emerald-950 text-lime-300 p-2  rounded-xl flex hover:bg-emerald-900 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`} disabled={isSubmitting}>Simpan</button>
                          <button type="button" onClick={handleClose} className="bg-slate-700 p-2 cursor-pointer rounded-xl flex text-white hover:bg-slate-600">Batal</button>
                        </div>
                        {Object.keys(uploadProgress).length > 0 && (
                          <div className="mt-4 space-y-4">
                            {Object.entries(uploadProgress).map(([filename, { value }]) => {
                              const percentText = value.toFixed(2).replace('.', ',') + '%';


                              return (
                                <div key={filename}>
                                  <div className="text-sm text-emerald-950 mb-1">{filename}</div>
                                  <div className="w-full bg-gray-200 rounded h-2 overflow-hidden">
                                    <div
                                      className="bg-emerald-600 h-2 rounded transition-all duration-200 ease-in-out"
                                      style={{ width: `${value}%` }}
                                    ></div>

                                  </div>
                                  {value < 100 && (
                                    <div className="text-center text-sm text-emerald-950 font-medium">
                                      Uploading... {percentText}
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </form>
                    </Box>
                  </Modal>


                  {/* modal Update P & ID */}
                  <Modal
                    open={updateOpen}
                    onClose={handleUpdateClose} 
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                  >
                    <Box className="bg-white rounded-2xl shadow-lg p-4 relative top-1/2 left-1/2 w-[90%] md:w-1/3 transform -translate-x-1/2 -translate-y-1/2 ">
                      <form method="post" onSubmit={handleUpdateSubmit} className="space-y-2" encType="multipart/form-data">
                        <h1 className="text-xl uppercase text-gray-900 mb-4 text-center">
                          Tambah P & ID
                        </h1>
                        <div>
                          <label htmlFor="file_name">Deskripsi</label>
                          <input
                            type="text"
                            name="file_name"
                            id="file_name"
                            placeholder="Masukkan Deskripsi"
                            className="border border-slate-200 rounded-md p-2 w-full bg-transparent outline-none"
                            defaultValue={updateData?.file_name != null ? updateData?.file_name : ''}
                            // required
                          />
                          {validation.file_name && (
                            validation.file_name.map((item, index) => (
                              <div key={index}>
                                <small className="text-red-600 text-sm">{item}</small>
                              </div>
                            ))
                          )}
                        </div>
                        <div>
                          <label htmlFor="p_id_file">File P & ID <sup className='text-red-500'>*</sup></label>
                          <input
                            type="file"
                            name="p_id_file"
                            id="p_id_file"
                            className="border border-slate-200 rounded-md p-2 w-full bg-transparent outline-none"
                            // required
                            accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.jpg,.jpeg,.png"
                          />
                          {validation.p_id_file && (
                            validation.p_id_file.map((item, index) => (
                              <div key={index}>
                                <small className="text-red-600 text-sm">{item}</small>
                              </div>
                            ))
                          )}
                          {updateData && updateData.p_id_file && <div className="m-2 bg-lime-300 text-emerald-950 p-1">
                            <Link 
                              to={`${base_public_url}p_id/${updateData.p_id_file}`} 
                              target='_blank'
                              className="hover:underline" 
                              onClick={() => handleAddActivity(updateData.p_id_file, "P & ID")}
                            >
                              {updateData.p_id_file}
                            </Link>
                          </div>
                          }
                        </div>
                        <div className="flex flex-row space-x-2 justify-end text-center items-center mt-4">
                          <button type="submit" className={`bg-emerald-950 text-lime-300 p-2  rounded-xl flex hover:bg-emerald-900 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`} disabled={isSubmitting}>Update</button>
                          <button type="button" onClick={handleUpdateClose} className="bg-slate-700 p-2 cursor-pointer rounded-xl flex text-white hover:bg-slate-600">Batal</button>
                        </div>
                        {Object.keys(uploadProgress).length > 0 && (
                          <div className="mt-4 space-y-4">
                            {Object.entries(uploadProgress).map(([filename, { value }]) => {
                              const percentText = value.toFixed(2).replace('.', ',') + '%';

                              return (
                                <div key={filename}>
                                  <div className="text-sm text-emerald-950 mb-1">{filename}</div>
                                  <div className="w-full bg-gray-200 rounded h-2 overflow-hidden">
                                    <div
                                      className="bg-emerald-600 h-2 rounded transition-all duration-200 ease-in-out"
                                      style={{ width: `${value}%` }}
                                    ></div>

                                  </div>
                                  {value < 100 && (
                                    <div className="text-center text-sm text-emerald-950 font-medium">
                                      Uploading... {percentText}
                                    </div>
                                  )}

                                </div>
                              );
                            })}
                          </div>
                        )}
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
                rows={p_id}
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

export default P_Id