import { Link, useParams } from "react-router-dom";
import { getSpkByContract, deleteSpk } from "../../services/spk.service";
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

const Spk = () => {
    
    const { id } = useParams();
    const [isLoading, setLoading] = useState(true);
    const [spk, setSpk] = useState([]);
    const base_public_url = api_public;

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
        { field: "spk_start_date", headerName: "Tanggal Mulai", width: 150, renderCell: (params) => <div className="py-4">
            {new Intl.DateTimeFormat('id-ID', {
                day: '2-digit',
                month: 'long',
                year: 'numeric',
            }).format(new Date(params.value))}
        </div> },
        { field: "spk_end_date", headerName: "Tanggal Berakhir", width: 150, renderCell: (params) => <div className="py-4">
            {new Intl.DateTimeFormat('id-ID', {
                day: '2-digit',
                month: 'long',
                year: 'numeric',
            }).format(new Date(params.value))}
        </div> },
        { field: "spk_price", headerName: "Nilai SPK", width: 150, renderCell: (params) => <div className="py-4">
            {new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
            }).format(params.value)}
        </div> },
        { field: "spk_file", headerName: "File SPK", width: 100, renderCell: (params) => <div className="">
            <Link
                to={`${base_public_url}contract/spk/${params.value}`}
                target='_blank'
                className='text-lime-400 px-2 rounded-md hover:underline cursor-pointer'
            >
                <IconCloudDownload />
            </Link>
        </div> },
        { 
            field: 'spk_status', 
            headerName: 'Status SPK',
            valueGetter: (params) => params == 1 ? 'Aktif' : 'Selesai',
            renderCell: (params) => (
              <div className={`${params.row.spk_status == '1' ? 'bg-lime-300 text-emerald-950' : 'text-lime-300 bg-emerald-950'} my-2 p-2 rounded flex flex-col justify-center items-center`}>
                {params.row.spk_status == '1' ? 'Aktif' : 'Selesai'}
              </div>
            )
        },
        { 
            field: 'invoice', 
            headerName: 'Penagihan',
            valueGetter: (params) => params == 1 ? 'Ada' : 'Belum Ada',
            width: 120,
            renderCell: (params) => (
              <div className={`${params.row.invoice == '1' ? 'bg-lime-300 text-emerald-950' : 'text-lime-300 bg-emerald-950'} my-2 p-2 rounded flex flex-col justify-center items-center`}>
                {params.row.invoice == '1' ? 'Ada' : 'Belum Ada'}
              </div>
            )
        },
        { field: "invoice_value", headerName: "Nilai Penagihan", width: 150, renderCell: (params) => <div className="py-4">
            {params.value ?
            new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
            }).format(params.value)
            : '-'}
        </div> },
        { field: "invoice_file", headerName: "Bukti Pembayaran", width: 150, renderCell: (params) => <div className={params.value ? '' : 'py-4'}>
            {params.value ? (
                <Link
                to={`${base_public_url}contract/spk/invoice/${params.value}`}
                target='_blank'
                className='text-lime-400 px-2 rounded-md hover:underline cursor-pointer'
            >
                <IconCloudDownload />
            </Link>
            ) : (
                '-'
            )}
        </div> },
        {
            field: 'actions',
            headerName: 'Aksi',
            width: 150,
            renderCell: (params) => (
                <div className='flex flex-row justify-center py-2 items-center space-x-2'>
                    <Link to={`/contract/editspk/${id}/${params.row.id}`}>
                        <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        className='px-2 py-1 bg-emerald-950 text-lime-300 text-sm rounded'
                        // onClick={() => handleEdit(params.row)}
                        >
                        <IconPencil stroke={2} />
                        </motion.button>
                    </Link>
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
                <h1 className='text-xl font-bold uppercase'>SPK</h1>
                <div className='flex flex-row justify-end items-center space-x-2'>
                    <Link
                        to={`/contract/addspk/${id}`}
                        className='flex space-x-1 items-center px-2 py-1 bg-emerald-950 text-lime-300 text-sm rounded  hover:scale-110 transition duration-100'
                    >
                        <IconPlus className='hover:rotate-180 transition duration-500' />
                        <span>Tambah</span>
                    </Link>
                </div>
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
