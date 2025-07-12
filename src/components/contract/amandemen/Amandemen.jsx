import { IconPlus } from "@tabler/icons-react"
import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { deleteAmandemen, getAmandemenByContract } from "../../../services/amandemen.service";
import { IconLoader2 } from "@tabler/icons-react";
import { DataGrid, GridToolbarQuickFilter, GridLogicOperator } from "@mui/x-data-grid";
import { IconCloudDownload } from "@tabler/icons-react";
import { api_public } from '../../../services/config';
import { IconPencil } from "@tabler/icons-react";
import { IconCircleMinus } from "@tabler/icons-react";
import * as motion from 'motion/react-client';
import Swal from "sweetalert2";
import { jwtDecode } from "jwt-decode";

const Amandemen = () => {
    const { id } = useParams();
    const base_public_url = api_public;
    const [loading, setLoading] = useState(false);
    const [amandemen, setAmandemen] = useState([]);
    const [userLevel, setUserLevel] = useState('');
    useEffect(() => {
        const token = localStorage.getItem('token');
            let level = '';
            try {
                level = String(jwtDecode(token).level_user);
            } catch (error) {
                console.error('Invalid token:', error);
            }
            setUserLevel(level);
        fetchAmandemen();
    }, [id]);
    const fetchAmandemen = async () => {
        try {
            setLoading(true);
            const data = await getAmandemenByContract(id);
            setAmandemen(data.data);
        } catch (error) {
            console.error("Error fetching amandemen:", error);
        } finally {
            setLoading(false);
        }
    }

    const handleDelete = async (row) => {
        const result = await Swal.fire({
            title: "Apakah Anda yakin?",
            text: "Data Amandemen akan dihapus secara permanen!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Ya, hapus!",
            cancelButtonText: "Batal",
        });
    
        if (result.isConfirmed) {
            try {
                const res = await deleteAmandemen(row.id);
                if (res.success) {
                    Swal.fire("Berhasil!", "amandemen berhasil dihapus!", "success");
                    fetchAmandemen();
                } else {
                    Swal.fire("Gagal!", "Terjadi kesalahan saat menghapus amandemen!", "error");
                }
            } catch (error) {
                console.error("Error deleting amandemen:", error);
                Swal.fire("Gagal!", "Terjadi kesalahan saat menghapus amandemen!", "error");
            }
        }
    };

    const columns = [
        { field: 'amandemen_end_date', headerName: 'Perubahan Waktu', width: 160, renderCell: (params) => <div className="py-4">
            {params.value === null ? '-' : new Intl.DateTimeFormat('id-ID', {
                day: '2-digit',
                month: 'long',
                year: 'numeric',
            }).format(new Date(params.value))}
        </div>  },
        {
            field: 'amandemen_penalty',
            headerName: 'Denda',
            width: 100,
            valueGetter: (params) => {
                const value = params;
                return value === 0 || value === null ? '-' : `${value}%`;
            },
            renderCell: (params) => (
                <div className="py-4">
                {params.row.amandemen_penalty === 0 || params.row.amandemen_penalty === null ? '-' : `${params.row.amandemen_penalty}%`}
                </div>
            )
        },
        { field: 'amandemen_price', headerName: 'Perubahan Nilai', width: 160, renderCell: (params) => <div className="py-4">
            {params.value === 0 || params.value === null ? '-' : new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
            }).format(params.value)}
        </div> },
        { field: 'principle_permit_file', headerName: 'Ijin Prinsip', width: 150, renderCell: (params) => <div className="flex flex-row justify-center items-center">
            {params.value === null ? '-' : <Link
                to={`${base_public_url}contract/amandemen/principle_permit/${params.value}`}
                target='_blank'
                className='text-lime-400 px-2 rounded-md hover:underline cursor-pointer'
            >
                <IconCloudDownload />
            </Link>}
        </div> },
        { field: 'ba_agreement_file', headerName: 'BA Kesepakatan', width: 150, renderCell: (params) => <div className="flex flex-row justify-center items-center">
            {params.value === null ? '-' : <Link
                to={`${base_public_url}contract/amandemen/ba_agreement/${params.value}`}
                target='_blank'
                className='text-lime-400 px-2 rounded-md hover:underline cursor-pointer'
            >
                <IconCloudDownload />
            </Link>}
        </div> },
        { field: 'result_amandemen_file', headerName: 'Hasil Amandemen', width: 150, renderCell: (params) => <div className="flex flex-row justify-center items-center">
            {params.value === null ? '-' : <Link
                to={`${base_public_url}contract/amandemen/result_amandemen/${params.value}`}
                target='_blank'
                className='text-lime-400 px-2 rounded-md hover:underline cursor-pointer'
            >
                <IconCloudDownload />
            </Link>}
        </div> },
        ...(userLevel !== '4' && userLevel !== '5' ? [{
            field: 'actions',
            headerName: 'Aksi',
            width: 150,
            renderCell: (params) => (
                <div className='flex flex-row justify-center py-2 items-center space-x-2'>
                    <Link to={`/contract/editamandemen/${id}/${params.row.id}`}>
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
            <h1 className='text-xl font-bold uppercase'>Amandemen</h1>
            <div className='flex flex-row justify-end items-center space-x-2'>
                { userLevel !== '4' && <Link
                    to={`/contract/addamandemen/${id}`}
                    // onClick={() => setOpen(true)}
                    className='flex space-x-1 items-center px-2 py-1 bg-emerald-950 text-lime-300 text-sm rounded  hover:scale-110 transition duration-100'
                >
                    <IconPlus className='hover:rotate-180 transition duration-500' />
                    <span>Tambah</span>
                </Link>}
            </div>
        </div>
        {loading ? (
            <div className="flex flex-col items-center justify-center h-20">
                <IconLoader2 stroke={2} className="animate-spin rounded-full h-10 w-10 " />
            </div>
        ) : (
            <DataGrid
                    rows={amandemen}
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
        )}
    </div>
  )
}

export default Amandemen