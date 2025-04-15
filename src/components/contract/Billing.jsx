import { Link, useParams } from "react-router-dom";
import { addTermBilling, deleteTermBilling, getTermBillingByContract, getTermBillingById, updateTermBilling } from "../../services/billing.service";
import { getTerminByContract } from "../../services/termin.service";
import { useState } from "react";
import { useEffect } from "react";
import { DataGrid, GridLogicOperator, GridToolbarQuickFilter } from "@mui/x-data-grid";
import * as motion from 'motion/react-client';
import { IconCircleMinus } from "@tabler/icons-react";
import { IconPencil } from "@tabler/icons-react";
import { IconPlus } from "@tabler/icons-react";
import { Box, Modal } from "@mui/material";
import Swal from "sweetalert2";
import { IconCloudDownload } from "@tabler/icons-react";
import { api_public } from '../../services/config';

const Billing = () => {
    
    const { id } = useParams();
    const [isLoading, setLoading] = useState(true);
    const [TermBilling, setTermBilling] = useState([]);
    const [termin, setTermin] = useState([]);
    const [editTermBilling, setEditTermBilling] = useState([]);
    const [open, setOpen] = useState(false);
    const [openEdit, setOpenEdit] = useState(false);
    const base_public_url = api_public;

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
        fetchTermBilling();
        fetchTermin();
    }, [id]);

    const fetchTermBilling = async () => {
        try {
            setLoading(true);
            const data = await getTermBillingByContract(id);
            setTermBilling(data.data);
        } catch (error) {
            console.error("Error fetching TermBilling:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchTermin = async () => {
        try {
            setLoading(true);
            const data = await getTerminByContract(id);
            setTermin(data.data);
        } catch (error) {
            console.error("Error fetching TermBilling:", error);
        } finally {
            setLoading(false);
        }
    }

    const fetchTermBillingById = async (TermBilling_id) => {
        try {
            const data = await getTermBillingById(TermBilling_id);
            setEditTermBilling(data.data);
            setOpenEdit(true);
        } catch (error) {
            console.error("Error fetching Term Billing Status:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddTermBilling = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData(e.target);
            formData.append('contract_id', id);
            const res = await addTermBilling(formData);
            if (res.success) {
                setOpen(false);
                Swal.fire("Berhasil!", "success add Term Billing Status!", "success");
                fetchTermBilling();
            } else {
                Swal.fire("Error!", "failed add Term Billing Status!", "error");
            }
        } catch (error) {
            console.error("Error adding Term Billing Status:", error);
            Swal.fire("Error!", "something went wrong add Term Billing Status!", "error");
        }
    }

    const handleEditTermBilling = async (e) => {
        e.preventDefault();
        try {
            // const formData = new FormData(e.target);
            const TermBilling_id = editTermBilling.id;
            const formData = new FormData(e.target);
            const res = await updateTermBilling(TermBilling_id, formData);
            if (res.success) {
                Swal.fire("Berhasil!", "success Update Term Billing Status!", "success");
                fetchTermBilling();
            } else {
                Swal.fire("Error!", "failed Update Term Billing Status!", "error");
            }
        } catch (error) {
            console.error("Error Update Term Billing Status:", error);
            Swal.fire("Error!", "something went wrong Update Term Billing Status!", "error");
        } finally {
            setOpenEdit(false);
        }
    }

    const handleDelete = async (row) => {
        const result = await Swal.fire({
            title: "Apakah Anda yakin?",
            text: "Data Status Penagihan akan dihapus secara permanen!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Ya, hapus!",
            cancelButtonText: "Batal",
        });
    
        if (result.isConfirmed) {
            try {
                const res = await deleteTermBilling(row.id);
                if (res.success) {
                    Swal.fire("Berhasil!", "Term Billing Status berhasil dihapus!", "success");
                    fetchTermBilling();
                } else {
                    Swal.fire("Gagal!", "Terjadi kesalahan saat menghapus Term Billing Status!", "error");
                }
            } catch (error) {
                console.error("Error deleting Term Billing Status:", error);
                Swal.fire("Gagal!", "Terjadi kesalahan saat menghapus Term Billing Status!", "error");
            }
        }
    };

    const columns = [
        {
            field: 'termin',
            valueGetter: (params) => params.termin,
            headerName: 'Termin',
            width: 200,
            renderCell: (params) => <div className='py-4'>{params.value}</div>,
        },
        { 
            field: "billing_value", 
            headerName: "Nilai Penagihan", 
            width: 200, 
            renderCell: (params) => 
            <div className='py-4'>
                {new Intl.NumberFormat('id-ID', {
                style: 'currency',
                currency: 'IDR',
                minimumFractionDigits: 0,
                }).format(params.value)}
            </div> },
        {
            field: 'payment_document',
            headerName: 'Bukti Pembayaran',
            width: 200,
            renderCell: (params) => (
              <div className='py-4'>
                <Link
                  to={`${base_public_url}contract/${params.row.payment_document}`}
                  target='_blank'
                  className='item-center text-lime-500'
                >
                  <IconCloudDownload stroke={2} />
                </Link>
              </div>
            ),
          },
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
                        onClick={() => fetchTermBillingById(params.row.id)}
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
        placeholder='Cari data disini...'
        className='text-lime-300 px-4 py-4 border outline-none'
        quickFilterParser={(searchInput) =>
            searchInput
            .split(',')
            .map((value) => value.trim())
            .filter((value) => value !== '')
        }
        />
    );

    return (
        <div>
            <div className="flex flex-row justify-between py-2 items-center">
                <span className="text-xl font-bold uppercase">Status Penagihan</span>
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
                aria-describedby="modal-modal-billing_value"
            >
                <Box sx={style}>
                    <h2 id="modal-modal-title" className="text-xl font-bold">Tambah Status Penagihan</h2>
                    <form 
                        className="flex flex-col space-y-2" 
                        method='post'
                        encType="multipart/form-data"
                        onSubmit={(e) => handleAddTermBilling(e)}
                    >
                            <div className='w-full'>
                                <label className='text-emerald-950'>
                                    Termin <sup className='text-red-500'>*</sup>{' '}
                                </label>
                                <select
                                    className="w-full px-1 py-2 border border-gray-300 rounded-md"
                                    name="termin_id"
                                    id="termin_id"
                                >
                                    {
                                        termin.length > 0 ? (
                                            termin.map((term) => (
                                            <option key={term.id} value={term.id}>
                                                {term.termin}
                                            </option>
                                            ))
                                        ) : (
                                            <option value='' disabled>
                                            Tidak ada Termin
                                            </option>
                                        )
                                    }
                                </select>
                            </div>
                            <div className='w-full'>
                                <label className='text-emerald-950'>
                                    Nilai Penagihan <sup className='text-red-500'>*</sup>{' '}
                                </label>
                                <input
                                    type='text'
                                    name='billing_value'
                                    id='billing_value'
                                    placeholder='ex: 2000000'
                                    required
                                    className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-950'
                                />
                            </div>
                            <div className='w-full'>
                                <label className='text-emerald-950'>
                                    Bukti Pembayaran <sup className='text-red-500'>*</sup>{' '}
                                </label>
                                <input
                                    type='file'
                                    name='payment_document'
                                    id='payment_document'
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
                aria-describedby="modal-modal-billing_value"
            >
                <Box sx={style}>
                    <h2 id="modal-modal-title" className="text-xl font-bold">Edit Status Penagihan</h2>
                    <form 
                        className="flex flex-col space-y-2" 
                        method='post'
                        encType="multipart/form-data"
                        onSubmit={(e) => handleEditTermBilling(e)}
                    >
                            <div className='w-full'>
                                <label className='text-emerald-950'>
                                    Termin <sup className='text-red-500'>*</sup>{' '}
                                </label>
                                <select
                                    className="w-full px-1 py-2 border border-gray-300 rounded-md"
                                    name="termin_id"
                                    id="termin_id"
                                    defaultValue={editTermBilling.termin_id}
                                >
                                    {
                                        termin.length > 0 ? (
                                            termin.map((term) => (
                                            <option key={term.id} value={term.id}>
                                                {term.termin}
                                            </option>
                                            ))
                                        ) : (
                                            <option value='' disabled>
                                            Tidak ada Termin
                                            </option>
                                        )
                                    }
                                </select>
                            </div>
                            <div className='w-full'>
                                <label className='text-emerald-950'>
                                    Nilai Penagihan <sup className='text-red-500'>*</sup>{' '}
                                </label>
                                <input
                                    type='text'
                                    name='billing_value'
                                    id='billing_value'
                                    placeholder='ex: 2000000'
                                    required
                                    defaultValue={editTermBilling.billing_value}
                                    className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-950'
                                />
                            </div>
                            <div className='w-full'>
                                <label className='text-emerald-950'>
                                    Bukti Pembayaran <sup className='text-red-500'>*</sup>{' '}
                                </label>
                                <input
                                    type='file'
                                    name='payment_document'
                                    id='payment_document'
                                    className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-950'
                                />
                                <div className="w-full p-2 bg-lime-400 text-emerald-950" >
                                    <Link
                                        to={`${base_public_url}contract/payment/${editTermBilling.payment_document}`}
                                        target='_blank'
                                        className='hover:underline'
                                    >
                                            {editTermBilling.payment_document}
                                        </Link>
                                </div>
                            </div>
                            <div className='w-full'>
                                <button type='submit' className='text-lime-400 bg-emerald-950 w-full text-center py-2 px-4 rounded'>Simpan</button>
                            </div>
                    </form>
                </Box>
            </Modal>
            {/* modals edit  */}
            { isLoading ? <div>Loading...</div> : 
                <DataGrid
                    rows={TermBilling}
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
                                quickFilterLogicOperator: GridLogicOperator.Or,
                            },
                        },
                    }}
                    pageSizeOptions={[5, 10, 25, 50, { value: -1, label: 'All' }]}
                />
            }
        </div>
    );
};

export default Billing;
