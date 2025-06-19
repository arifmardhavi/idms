import { useParams } from "react-router-dom";
import { addTermin, deleteTermin, getTerminByContract, getTerminById, updateTermin } from "../../services/termin.service";
import { useState } from "react";
import { useEffect } from "react";
import { DataGrid, GridLogicOperator, GridToolbarQuickFilter } from "@mui/x-data-grid";
import * as motion from 'motion/react-client';
import { IconCircleMinus } from "@tabler/icons-react";
import { IconPencil } from "@tabler/icons-react";
import { IconPlus } from "@tabler/icons-react";
import { Box, Modal } from "@mui/material";
import Swal from "sweetalert2";
import { IconLoader2 } from "@tabler/icons-react";

const Termin = ({ onAddedTermin }) => {
    
    const { id } = useParams();
    const [isLoading, setLoading] = useState(true);
    const [termin, setTermin] = useState([]);
    const [editTermin, setEditTermin] = useState([]);
    const [open, setOpen] = useState(false);
    const [openEdit, setOpenEdit] = useState(false);

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 360,
        bgcolor: 'background.paper',
        boxShadow: 30,
        p: 4,
        borderRadius: 2
    };

    useEffect(() => {
        fetchTermin();
    }, [id]);

    const fetchTermin = async () => {
        try {
            setLoading(true);
            const data = await getTerminByContract(id);
            setTermin(data.data);
        } catch (error) {
            console.error("Error fetching Termin:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchTerminById = async (termin_id) => {
        try {
            const data = await getTerminById(termin_id);
            setEditTermin(data.data);
            setOpenEdit(true);
        } catch (error) {
            console.error("Error fetching Termin:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddTermin = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData(e.target);
            formData.append('contract_id', id);
            const res = await addTermin(formData);
            if (res.success) {
                setOpen(false);
                Swal.fire("Berhasil!", "success add termin!", "success");
                fetchTermin();
                onAddedTermin();
            } else {
                Swal.fire("Error!", "failed add termin!", "error");
            }
        } catch (error) {
            console.error("Error adding Termin:", error);
            Swal.fire("Error!", "something went wrong add termin!", "error");
        }
    }

    const handleEditTermin = async (e) => {
        e.preventDefault();
        try {
            // const formData = new FormData(e.target);
            const termin_id = editTermin.id;
            const formData = new FormData();
            formData.append('termin', e.target.termin.value);
            formData.append('description', e.target.description.value);
            console.log(formData);
            console.log("DATA TERMIN : ", e.target.termin.value);
            console.log("DATA DESCRIPTION : ", e.target.description.value);
            const res = await updateTermin(termin_id, formData);
            if (res.success) {
                Swal.fire("Berhasil!", "success Update termin!", "success");
                fetchTermin();
                onAddedTermin();
            } else {
                Swal.fire("Error!", "failed Update termin!", "error");
            }
        } catch (error) {
            console.error("Error Update Termin:", error);
            Swal.fire("Error!", "something went wrong Update termin!", "error");
        } finally {
            setOpenEdit(false);
        }
    }

    const handleDelete = async (row) => {
        const result = await Swal.fire({
            title: "Apakah Anda yakin?",
            text: "Data Termin akan dihapus secara permanen!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Ya, hapus!",
            cancelButtonText: "Batal",
        });
    
        if (result.isConfirmed) {
            try {
                const res = await deleteTermin(row.id);
                if (res.success) {
                    Swal.fire("Berhasil!", "Termin berhasil dihapus!", "success");
                    fetchTermin();
                    onAddedTermin();
                } else {
                    Swal.fire("Gagal!", "Terjadi kesalahan saat menghapus Termin!", "error");
                }
            } catch (error) {
                console.error("Error deleting Termin:", error);
                Swal.fire("Gagal!", "Terjadi kesalahan saat menghapus Termin!", "error");
            }
        }
    };

    const columns = [
        { field: 'termin', headerName: 'Termin', width: 200, renderCell: (params) => <div className="py-4">{params.value}</div> },
        { field: "description", headerName: "Keterangan", width: 300, renderCell: (params) => <div className="py-4">{params.value}</div> },
        {
            field: 'actions',
            headerName: 'Aksi',
            width: 150,
            renderCell: (params) => (
                <div className='flex flex-row justify-center py-2 items-center space-x-2'>
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        className='px-2 py-1 bg-emerald-950 text-lime-400 text-sm rounded'
                        onClick={() => fetchTerminById(params.row.id)}
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
        <div>
            <div className="flex flex-row justify-between py-2 items-center">
                <span className="text-xl font-bold uppercase">Termin</span>
                <button 
                    className="p-2 bg-emerald-950 text-lime-400 text-sm rounded flex flex-row space-x-1 items-center"
                    onClick={() => setOpen(true)}
                >
                    <IconPlus /> Tambah
                </button>
            </div>
            {/* modals add */}
            <Modal 
                open={open} 
                onClose={() => setOpen(false)} 
                center
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <h2 id="modal-modal-title" className="text-xl font-bold">Tambah Termin</h2>
                    <form 
                        className="flex flex-col space-y-2" 
                        method='post'
                        onSubmit={(e) => handleAddTermin(e)}
                    >
                        <div className="flex flex-col space-y-2"></div>
                            <div className='w-full'>
                                <label className='text-emerald-950'>
                                    Termin <sup className='text-red-500'>*</sup>{' '}
                                </label>
                                <input
                                    type='text'
                                    name='termin'
                                    id='termin'
                                    placeholder='Termin 1'
                                    required
                                    className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-950'
                                />
                            </div>
                            <div className='w-full'>
                                <label className='text-emerald-950'>
                                    Deskripsi <sup className='text-red-500'>*</sup>{' '}
                                </label>
                                <input
                                    type='text'
                                    name='description'
                                    id='description'
                                    placeholder='ex: Progress 60% Penagihan'
                                    required
                                    className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-950'
                                />
                            </div>
                            <div className='w-full'>
                                <button type='submit' className='text-lime-400 bg-emerald-950 w-full text-center py-2 px-4 rounded'>Simpan</button>
                            </div>
                    </form>
                </Box>
            </Modal>
            {/* modals add  */}
            {/* modals edit */}
            <Modal 
                open={openEdit} 
                onClose={() => setOpenEdit(false)} 
                center
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <h2 id="modal-modal-title" className="text-xl font-bold">Edit Termin</h2>
                    <form 
                        className="flex flex-col space-y-2" 
                        method='post'
                        onSubmit={(e) => handleEditTermin(e)}
                    >
                        <div className="flex flex-col space-y-2"></div>
                            <div className='w-full'>
                                <label className='text-emerald-950'>
                                    Termin <sup className='text-red-500'>*</sup>{' '}
                                </label>
                                <input
                                    type='text'
                                    name='termin'
                                    id='termin'
                                    placeholder='Termin 1'
                                    required
                                    defaultValue={editTermin.termin}
                                    className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-950'
                                />
                            </div>
                            <div className='w-full'>
                                <label className='text-emerald-950'>
                                    Deskripsi <sup className='text-red-500'>*</sup>{' '}
                                </label>
                                <input
                                    type='text'
                                    name='description'
                                    id='description'
                                    placeholder='ex: Progress 60% Penagihan'
                                    defaultValue={editTermin.description}
                                    required
                                    className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-950'
                                />
                            </div>
                            <div className='w-full flex flex-col space-y-1'>
                                <button type='submit' className='text-lime-400 bg-emerald-950 w-full text-center py-2 px-4 rounded'>Simpan</button>
                                <button type='button' onClick={()=> setOpenEdit(false)} className='bg-gray-600 text-white w-full text-center py-2 px-4 rounded'>Cancel</button>
                            </div>
                    </form>
                </Box>
            </Modal>
            {/* modals edit  */}
            {isLoading ?
              <div className="flex flex-col items-center justify-center h-20">
                  <IconLoader2 stroke={2} className="animate-spin rounded-full h-10 w-10 " />
              </div> 
            : 
                <DataGrid
                    rows={termin}
                    columns={columns}
                    disableColumnFilter
                    disableColumnSelector
                    disableDensitySelector
                    pagination
                    getRowHeight={() => 'auto'}
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
                            paginationModel: { pageSize: 5, page: 0 },
                        },
                        filter: {
                            filterModel: {
                                items: [],
                                quickFilterExcludeHiddenColumns: false,
                                quickFilterLogicOperator: GridLogicOperator.And,
                            },
                        },
                    }}
                    pageSizeOptions={[5, 10, 25, 50, { value: -1, label: 'All' }]}
                />
            }
        </div>
    );
};

export default Termin;
