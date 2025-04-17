import { useParams } from "react-router-dom";
import { getSpkByContract, deleteSpk } from "../../services/spk.service";
import { useState } from "react";
import { useEffect } from "react";
import { DataGrid, GridLogicOperator, GridToolbarQuickFilter } from "@mui/x-data-grid";
import * as motion from 'motion/react-client';
import { IconCircleMinus } from "@tabler/icons-react";
import { IconPencil } from "@tabler/icons-react";
import { IconPlus } from "@tabler/icons-react";
import Swal from "sweetalert2";

const Spk = () => {
    
    const { id } = useParams();
    const [isLoading, setLoading] = useState(true);
    const [spk, setSpk] = useState([]);

    useEffect(() => {
        fetchSpk();
    }, [id]);

    const fetchSpk = async () => {
        try {
            setLoading(true);
            const data = await getSpkByContract(id);
            setSpk(data.data);
        } catch (error) {
            console.error("Error fetching spk:", error);
        } finally {
            setLoading(false);
        }
    };

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
                const res = await deleteSpk(row.id);
                if (res.success) {
                    Swal.fire("Berhasil!", "spk berhasil dihapus!", "success");
                    fetchSpk();
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
        { field: 'no_spk', headerName: 'No SPK', width: 200, renderCell: (params) => <div className="py-4">{params.value}</div> },
        { field: "spk_name", headerName: "Judul SPK", width: 300, renderCell: (params) => <div className="py-4">{params.value}</div> },
        { field: "spk_start_date", headerName: "Tanggal Mulai", width: 150, renderCell: (params) => <div className="py-4">{params.value}</div> },
        { field: "spk_end_date", headerName: "Tanggal Berakhir", width: 150, renderCell: (params) => <div className="py-4">{params.value}</div> },
        { field: "spk_price", headerName: "Nilai SPK", width: 150, renderCell: (params) => <div className="py-4">{params.value}</div> },
        { field: "spk_file", headerName: "File SPK", width: 100, renderCell: (params) => <div className="py-4">{params.value}</div> },
        { field: "spk_status", headerName: "Keterangan", width: 100, renderCell: (params) => <div className="py-4">{params.value}</div> },
        { field: "invoice", headerName: "Penagihan", width: 100, renderCell: (params) => <div className="py-4">{params.value}</div> },
        { field: "invoice_value", headerName: "Nilai Penagihan", width: 150, renderCell: (params) => <div className="py-4">{params.value}</div> },
        { field: "invoice_file", headerName: "Bukti Pembayaran", width: 100, renderCell: (params) => <div className="py-4">{params.value}</div> },
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
                        // onClick={() => fetchSpkById(params.row.id)}
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
                <span className="text-xl font-bold uppercase">SPK</span>
                <button 
                    className="p-2 bg-emerald-950 text-lime-400 text-sm rounded flex flex-row space-x-1 items-center"
                    // onClick={() => setOpen(true)}
                >
                    <IconPlus /> Tambah
                </button>
            </div>
            { isLoading ? <div>Loading...</div> : 
                <DataGrid
                    rows={spk}
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

export default Spk;
