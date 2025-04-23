import { Link, useParams } from "react-router-dom";
import { getSpkProgressByContract, deleteSpkProgress } from "../../services/spk_progress.service";
import { useState } from "react";
import { useEffect } from "react";
import { DataGrid, GridLogicOperator, GridToolbarQuickFilter } from "@mui/x-data-grid";
import * as motion from 'motion/react-client';
import { IconCircleMinus } from "@tabler/icons-react";
import { IconPencil } from "@tabler/icons-react";
import { IconPlus } from "@tabler/icons-react";
import Swal from "sweetalert2";
import { IconCloudDownload } from "@tabler/icons-react";
import { api_public } from '../../services/config';
// import { getSpkByContract, getSpkById } from "../../services/spk.service";
// import { Box, Modal } from "@mui/material";

const SpkProgress = () => {
    
    const { id } = useParams();
    const [isLoading, setLoading] = useState(true);
    const [spkProgress, setSpkProgress] = useState([]);
    // const [spkData, setSpkData] = useState([]);
    // const [spk, setSpk] = useState([]);
    // const [open, setOpen] = useState(false);
    // const [filteredSpk, setFilteredSpk] = useState([]);
    // const [selectedSpk, setSelectedSpk] = useState("");

    // const [openEdit, setOpenEdit] = useState(false);
    // const [editSpkProgress, setEditSpkProgress] = useState({});
    const base_public_url = api_public;

    // const style = {
    //     position: 'absolute',
    //     top: '50%',
    //     left: '50%',
    //     transform: 'translate(-50%, -50%)',
    //     width: 360,
    //     bgcolor: 'background.paper',
    //     boxShadow: 30,
    //     p: 4,
    //     borderRadius: 2
    // };

    useEffect(() => {
        fetchSpkProgress();
        // fetchSpk();
    }, [id]);

    const fetchSpkProgress = async () => {
        try {
            setLoading(true);
            const data = await getSpkProgressByContract(id);
            setSpkProgress(data.data);
    
            // Fetch all related SPK data
            // const spkMap = {};
            // for (const item of data.data) {
            //     if (!spkMap[item.spk_id]) {
            //         const spk = await getSpkById(item.spk_id);
            //         spkMap[item.spk_id] = spk;
            //     }
            // }
            // setSpkData(spkMap);
            console.log(data.data);
        } catch (error) {
            console.error("Error fetching spk progress:", error);
        } finally {
            setLoading(false);
        }
    };
    
    // const fetchSpk = async () => {
    //     try {
    //         setLoading(true);
    //         const data = await getSpkByContract(id);
    //         setSpk(data.data);
    //         console.log('SPK : ', data.data);
    //     } catch (error) {
    //         console.error("Error fetching spk:", error);
    //     } finally {
    //         setLoading(false);
    //     }
    // }

    // const handleSpkChange = async (id) => {
    //     try {
    //         setLoading(true);
    //         const data = await getSpkById(id);
    //         setFilteredSpk(data.data);
    //         console.log(data.data);
    //     } catch (error) {
    //         console.error("Error fetching spk:", error);
    //     } finally {
    //         setLoading(false);
    //     }
    // }

    // const editspkProgress = async (id) => {
    //     try {
    //         const data = await getSpkProgressById(id);
    //         setEditSpkProgress(data.data);
    //         setOpenEdit(true);
    //     } catch (error) {
    //         console.error("Error fetching spk progress Status:", error);
    //     }
    // };

    const handleDelete = async (row) => {
        const result = await Swal.fire({
            title: "Apakah Anda yakin?",
            text: "Data SPK akan dihapus secara permanen!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Ya, hapus!",
            cancelButtonText: "Batal",
        });
    
        if (result.isConfirmed) {
            try {
                const res = await deleteSpkProgress(row.id);
                if (res.success) {
                    Swal.fire("Berhasil!", "spk berhasil dihapus!", "success");
                    fetchSpkProgress();
                } else {
                    Swal.fire("Gagal!", "Terjadi kesalahan saat menghapus spk!", "error");
                }
            } catch (error) {
                console.error("Error deleting spk:", error);
                Swal.fire("Gagal!", "Terjadi kesalahan saat menghapus spk!", "error");
            }
        }
    };

    const columns = [
        { 
            field: 'spk', 
            headerName: 'SPK', 
            width: 250, 
            renderCell: (params) => (
              <div className="py-4">
                {params.row.spk?.spk_name ?? '-'}
              </div>
            ) 
          }
        ,          
        // { field: "week", headerName: "Week", width: 250, renderCell: (params) => {
        //     const spk = spkData[params.row.spk_id];
        //     const weeks = spk.data.weeks[(params.row.week - 1)].week;
        //     const label = spk.data.weeks[(params.row.week - 1)].label;
        //     return <div className="py-4">{weeks == params.value && label }</div>;
        // }},        
        { field: "plan_progress", headerName: "Progress Plan", width: 110, renderCell: (params) => <div className="py-4">
            {params.value} %
        </div> },
        { field: "actual_progress", headerName: "Progress Aktual", width: 120, renderCell: (params) => <div className="py-4">
            {params.value} %
        </div> },
        { field: "progress_file", headerName: "File Progress", width: 110, renderCell: (params) => <div className="">
            <Link
                to={`${base_public_url}contract/spk/${params.value}`}
                target='_blank'
                className='text-lime-400 px-2 rounded-md hover:underline cursor-pointer'
            >
                <IconCloudDownload />
            </Link>
        </div> },
        
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
                        // onClick={() => editspkProgress(params.row.id)}
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
            <div className='flex flex-row justify-between py-2'>
                <h1 className='text-xl font-bold uppercase'>Progress Pekerjaan</h1>
                <div className='flex flex-row justify-end items-center space-x-2'>
                    <button
                        // onClick={() => setOpen(true)}
                        className='flex space-x-1 items-center px-2 py-1 bg-emerald-950 text-lime-300 text-sm rounded  hover:scale-110 transition duration-100'
                    >
                        <IconPlus className='hover:rotate-180 transition duration-500' />
                        <span>Tambah</span>
                    </button>
                </div>
            </div>
            {/* modals add */}
            {/* <Modal 
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
                        // onSubmit={(e) => handleAddTermBilling(e)}
                    >
                            <div className='w-full'>
                                <label className='text-emerald-950'>
                                    SPK <sup className='text-red-500'>*</sup>{' '}
                                </label>
                                <select
                                    className="w-full px-1 py-2 border border-gray-300 rounded-md"
                                    name="spk_id"
                                    id="spk_id"
                                    value={selectedSpk}
                                    onChange={(e) => setSelectedSpk(e.target.value)}
                                    required
                                >
                                    <option value="">Pilih Kategori</option>
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
            </Modal> */}
            {/* modals add  */}
            { isLoading ? <div>Loading...</div> : 
                <DataGrid
                    rows={spkProgress}
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

export default SpkProgress;
