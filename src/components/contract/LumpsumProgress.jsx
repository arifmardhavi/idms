import { DataGrid, GridLogicOperator, GridToolbarQuickFilter } from "@mui/x-data-grid";
import { IconCloudDownload } from "@tabler/icons-react";
import { IconPlus } from "@tabler/icons-react"
import { Link, useParams } from "react-router-dom";
import { api_public } from '../../services/config';
import * as motion from 'motion/react-client';
import { IconCircleMinus } from "@tabler/icons-react";
import { IconPencil } from "@tabler/icons-react";
import { useEffect } from "react";
import { useState } from "react";
import { addLumpsumProgress, deleteLumpsumProgress, getLumpsumProgressByContract, getLumpsumProgressById, updateLumpsumProgress } from "../../services/lumpsum_progress.service";
import Swal from "sweetalert2";
import { Box, Modal } from "@mui/material";
import { getContractById } from "../../services/contract.service";
import { IconLoader2 } from "@tabler/icons-react";
import { jwtDecode } from "jwt-decode";

const LumpsumProgress = () => {
    
    const base_public_url = api_public;
    const { id } = useParams();
    const [isLoading, setLoading] = useState(true);
    const [progress, setProgress] = useState([]);
    const [IsWeeks, setIsWeeks] = useState([]);
    const [open, setOpen] = useState(false);
    const [openEdit, setOpenEdit] = useState(false);
    const [validation, setValidation] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedWeek, setSelectedWeek] = useState('');
    const [editProgress, setEditProgress] = useState('');
    const [userLevel, setUserLevel] = useState('');

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
        const token = localStorage.getItem('token');
        let level = '';
        try {
            level = String(jwtDecode(token).level_user);
        } catch (error) {
            console.error('Invalid token:', error);
        }
        setUserLevel(level);
        fetchProgress();
        fetchContract();
    }, [id]);

    const fetchProgress = async () => {
        try {
            setLoading(true);
            const data = await getLumpsumProgressByContract(id);
            setProgress(data.data);
            setIsWeeks(data.data[0]?.weeks ?? []);
            // console.log(data.data);
        } catch (error) {
            console.error("Error fetching progress:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchContract = async () => {
        try {
            setLoading(true);
            const data = await getContractById(id);
            setIsWeeks(data.data?.weeks ?? []);
        } catch (error) {
            console.error("Error fetching contract:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchProgressById = async (id) => {
        try {
            const data = await getLumpsumProgressById(id);
            setEditProgress(data.data)
            setSelectedWeek(data.data.week);
            setOpenEdit(true);
        }  catch (error) {
            console.error("Error fetching progress:", error);
        }
    }

    const handleAddProgress = async (e) => {
        e.preventDefault();
        setOpen(true);
        const formData = new FormData(e.target);
        formData.append('contract_id', id);
        setIsSubmitting(true);
        try {
            const res = await addLumpsumProgress(formData);
            if (res.success) {
                Swal.fire("Berhasil!", "sukses menambahkan progress pekerjaan!", "success");
                setOpen(false);
                fetchProgress();
            } else {
                setValidation(res.response?.data.errors || []);
                Swal.fire("Error!", "failed add Progress!", "error");
            }
        } catch (error) {
            console.error("Error adding progress:", error);
            setValidation(error.response?.data.errors || []);
        } finally {
            setIsSubmitting(false);
        }
    }

    const handleUpdateProgress = async (e) => {
        setIsSubmitting(true);
        e.preventDefault();
        const ProgressId = editProgress.id;
        const formData = new FormData(e.target);
        formData.append('contract_id', id);
        try {
            const res = await updateLumpsumProgress(ProgressId, formData);
            if (res.success) {
                Swal.fire("Berhasil!", "sukses update progress pekerjaan!", "success");
                fetchProgress();
            } else {
                setValidation(res.response?.data.errors || []);
                Swal.fire("Error!", "failed update spk!", "error");
            }
        } catch (error) {
            console.error("Error update progress:", error);
            Swal.fire("Error!", "something went wrong Update!", "error");
        } finally {
            setIsSubmitting(false);
            setOpenEdit(false);
        }
    }

    const handleDelete = async (row) => {
        const result = await Swal.fire({
            title: "Apakah Anda yakin?",
            text: "Data Progress akan dihapus secara permanen!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Ya, hapus!",
            cancelButtonText: "Batal",
        });
    
        if (result.isConfirmed) {
            try {
                const res = await deleteLumpsumProgress(row.id);
                if (res.success) {
                    Swal.fire("Berhasil!", "Progress berhasil dihapus!", "success");
                    fetchProgress();
                } else {
                    Swal.fire("Gagal!", "Terjadi kesalahan saat menghapus Progress!", "error");
                }
            } catch (error) {
                console.error("Error deleting Progress:", error);
                Swal.fire("Gagal!", "Terjadi kesalahan saat menghapus Progress!", "error");
            }
        }
    };

    const columns = [
        { field: "week_label", 
            headerName: "Week", 
            width: 250, 
            renderCell: (params) => {
                return <div className="py-4">{params.value}</div>;
            },
        },                
        { field: "plan_progress", headerName: "Progress Plan", width: 110, renderCell: (params) => <div className="py-4">
            {params.value}%
        </div> },
        { field: "actual_progress", headerName: "Progress Aktual", width: 120, renderCell: (params) => <div className="py-4">
            {params.value}%
        </div> },
        { field: "progress_file", headerName: "File Progress", width: 110, renderCell: (params) => <div className="">
            <Link
                to={`${base_public_url}contract/lumpsum/progress/${params.value}`}
                target='_blank'
                className='text-lime-400 px-2 rounded-md hover:underline cursor-pointer'
            >
                <IconCloudDownload />
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
                        className='px-2 py-1 bg-emerald-950 text-lime-400 text-sm rounded'
                        onClick={() => fetchProgressById(params.row.id)}
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
        }] : []),
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
        <div className='flex flex-row justify-between py-2'>
            <h1 className='text-xl font-bold uppercase'>Progress Pekerjaan</h1>
            { userLevel !== '4' && userLevel !== '5' && <div className='flex flex-row justify-end items-center space-x-2'>
                <button
                    onClick={() => setOpen(true)}
                    className='flex space-x-1 items-center px-2 py-1 bg-emerald-950 text-lime-300 text-sm rounded  hover:scale-110 transition duration-100'
                >
                    <IconPlus className='hover:rotate-180 transition duration-500' />
                    <span>Tambah</span>
                </button>
            </div>}
        </div>
        {/* modals add */}
        <Modal 
            open={open} 
            onClose={() => setOpen(false)} 
            center
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-billing_value"
        >
            <Box sx={style}>
                <h2 id="modal-modal-title" className="text-xl font-bold">Tambah Progress Pekerjaan</h2>
                <form 
                    className="flex flex-col space-y-2" 
                    method='post'
                    encType="multipart/form-data"
                    onSubmit={(e) => handleAddProgress(e)}
                >
                        <div className='w-full'>
                            <label className='text-emerald-950'>
                                Week <sup className='text-red-500'>*</sup>{' '}
                            </label>
                            <select
                                className="w-full px-1 py-2 border border-gray-300 rounded-md"
                                name="week"
                                id="week"
                                required
                            >
                                <option value="">Pilih Week</option>
                                {
                                    IsWeeks.length > 0 ?
                                    IsWeeks.map((item) => (
                                            <option key={item.week} value={item.week}>
                                                {item.label}
                                            </option>
                                        ))
                                    : 
                                    <option value="" disabled>Tidak Ada Week</option>
                                }
                            </select>
                            {validation.week && (
                                validation.week.map((item, index) => (
                                    <div key={index}>
                                    <small className="text-red-600 text-sm">{item}</small>
                                    </div>
                                ))
                            )}
                        </div>
                        <div className='w-full'>
                            <label className='text-emerald-950'>
                                Plan Progress <small>(%)</small> <sup className='text-red-500'>*</sup>{' '}
                            </label>
                            <input
                                type='number'
                                name='plan_progress'
                                id='plan_progress'
                                placeholder='ex: 10'
                                required
                                className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-950'
                            />
                            {validation.plan_progress && (
                                validation.plan_progress.map((item, index) => (
                                    <div key={index}>
                                    <small className="text-red-600 text-sm">{item}</small>
                                    </div>
                                ))
                            )}
                        </div>
                        <div className='w-full'>
                            <label className='text-emerald-950'>
                                Aktual Progress <small>(%)</small> <sup className='text-red-500'>*</sup>{' '}
                            </label>
                            <input
                                type='number'
                                name='actual_progress'
                                id='actual_progress'
                                placeholder="ex: 10"
                                required
                                className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-950'
                            />
                            {validation.actual_progress && (
                                validation.actual_progress.map((item, index) => (
                                    <div key={index}>
                                    <small className="text-red-600 text-sm">{item}</small>
                                    </div>
                                ))
                            )}
                        </div>
                        <div className='w-full'>
                            <label className='text-emerald-950'>
                                File Progress <sup className='text-red-500'>*</sup>{' '}
                            </label>
                            <input
                                type='file'
                                name='progress_file'
                                id='progress_file'
                                required
                                className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-950'
                            />
                            {validation.progress_file && (
                                validation.progress_file.map((item, index) => (
                                    <div key={index}>
                                    <small className="text-red-600 text-sm">{item}</small>
                                    </div>
                                ))
                            )}
                        </div>
                        <div className='w-full'>
                            <motion.button
                                whileTap={{ scale: 0.97 }}
                                whileHover={{ scale: 0.99 }}
                                type='submit'
                                className={`w-full bg-emerald-950 text-white py-2 rounded-md uppercase ${
                                isSubmitting
                                    ? 'bg-gray-500 cursor-not-allowed'
                                    : 'bg-emerald-950 text-white'
                                }`}
                                disabled={isSubmitting} // Disable tombol jika sedang submit
                            >
                                {isSubmitting ? 'Processing...' : 'Save'}
                            </motion.button>
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
            aria-describedby="modal-modal-billing_value"
        >
            <Box sx={style}>
                <h2 id="modal-modal-title" className="text-xl font-bold">Edit Progress Pekerjaan</h2>
                <form 
                    className="flex flex-col space-y-2" 
                    method='post'
                    encType="multipart/form-data"
                    onSubmit={(e) => handleUpdateProgress(e)}
                >
                        <div className='w-full'>
                            <label className='text-emerald-950'>
                                Week <sup className='text-red-500'>*</sup>{' '}
                            </label>
                            <select
                                className="w-full px-1 py-2 border border-gray-300 rounded-md"
                                name="week"
                                id="week"
                                value={selectedWeek}
                                onChange={(e) => setSelectedWeek(e.target.value)}
                                required
                            >
                                <option value="">Pilih Week</option>
                                {
                                    IsWeeks.length > 0 ?
                                    IsWeeks.map((item) => (
                                            <option key={item.week} value={item.week}>
                                                {item.label}
                                            </option>
                                        ))
                                    : 
                                    <option value="" disabled>Tidak Ada Week</option>
                                }
                            </select>
                            {validation.week && (
                                validation.week.map((item, index) => (
                                    <div key={index}>
                                    <small className="text-red-600 text-sm">{item}</small>
                                    </div>
                                ))
                            )}
                        </div>
                        <div className='w-full'>
                            <label className='text-emerald-950'>
                                Plan Progress <small>(%)</small> <sup className='text-red-500'>*</sup>{' '}
                            </label>
                            <input
                                type='number'
                                name='plan_progress'
                                id='plan_progress'
                                placeholder='ex: 10'
                                defaultValue={editProgress.plan_progress}
                                required
                                className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-950'
                            />
                            {validation.plan_progress && (
                                validation.plan_progress.map((item, index) => (
                                    <div key={index}>
                                    <small className="text-red-600 text-sm">{item}</small>
                                    </div>
                                ))
                            )}
                        </div>
                        <div className='w-full'>
                            <label className='text-emerald-950'>
                                Aktual Progress <small>(%)</small> <sup className='text-red-500'>*</sup>{' '}
                            </label>
                            <input
                                type='number'
                                name='actual_progress'
                                id='actual_progress'
                                placeholder='ex: 10'
                                defaultValue={editProgress.actual_progress}
                                required
                                className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-950'
                            />
                            {validation.actual_progress && (
                                validation.actual_progress.map((item, index) => (
                                    <div key={index}>
                                    <small className="text-red-600 text-sm">{item}</small>
                                    </div>
                                ))
                            )}
                        </div>
                        <div className='w-full'>
                            <label className='text-emerald-950'>
                                File Progress <sup className='text-red-500'>*</sup>{' '}
                            </label>
                            <input
                                type='file'
                                name='progress_file'
                                id='progress_file'
                                className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-950'
                            />
                            {validation.progress_file && (
                                validation.progress_file.map((item, index) => (
                                    <div key={index}>
                                    <small className="text-red-600 text-sm">{item}</small>
                                    </div>
                                ))
                            )}
                            <div className="w-full p-2 bg-lime-400 text-emerald-950" >
                                <Link
                                    to={`${base_public_url}contract/lumpsum/progress/${editProgress.progress_file}`}
                                    target='_blank'
                                    className='hover:underline'
                                >
                                        {editProgress.progress_file}
                                    </Link>
                            </div>
                        </div>
                        <div className='w-full space-y-1'>
                            <motion.button
                                whileTap={{ scale: 0.97 }}
                                whileHover={{ scale: 0.99 }}
                                type='submit'
                                className={`w-full bg-emerald-950 text-white py-2 rounded-md uppercase ${
                                isSubmitting
                                    ? 'bg-gray-500 cursor-not-allowed'
                                    : 'bg-emerald-950 text-white'
                                }`}
                                disabled={isSubmitting} // Disable tombol jika sedang submit
                            >
                                {isSubmitting ? 'Processing...' : 'Save'}
                            </motion.button>
                            <button className="w-full bg-slate-500 text-white py-2 rounded-md uppercase" onClick={() => setOpenEdit(false)} >Cancel</button>
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
                rows={progress}
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
                pageSizeOptions={[5, 10, 25, 50, { value: -1, label: 'All' }]}
            />
        }
    </div>
  )
}

export default LumpsumProgress