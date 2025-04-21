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
import { getSpkById } from "../../services/spk.service";

const SpkProgress = () => {
    
    const { id } = useParams();
    const [isLoading, setLoading] = useState(true);
    const [spkProgress, setSpkProgress] = useState([]);
    const [spkData, setSpkData] = useState({});
    const base_public_url = api_public;

    useEffect(() => {
        fetchSpkProgress();
    }, [id]);

    const fetchSpkProgress = async () => {
        try {
            setLoading(true);
            const data = await getSpkProgressByContract(id);
            setSpkProgress(data.data);
    
            // Fetch all related SPK data
            const spkMap = {};
            for (const item of data.data) {
                if (!spkMap[item.spk_id]) {
                    const spk = await getSpkById(item.spk_id);
                    spkMap[item.spk_id] = spk;
                }
            }
            setSpkData(spkMap);
        } catch (error) {
            console.error("Error fetching spk progress:", error);
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
        { field: "week", headerName: "Week", width: 250, renderCell: (params) => {
            const spk = spkData[params.row.spk_id];
            const weeks = spk.data.weeks[(params.row.week - 1)].week;
            const label = spk.data.weeks[(params.row.week - 1)].label;
            return <div className="py-4">{weeks == params.value && label }</div>;
        }},        
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
                <h1 className='text-xl font-bold uppercase'>Progress Pekerjaan</h1>
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
