import { IconRefresh } from "@tabler/icons-react"
import Header from "../components/Header"
import { Link } from "react-router-dom"
import { IconPlus } from "@tabler/icons-react"
import { useState } from "react"
import { DataGrid, GridLogicOperator, GridToolbarQuickFilter } from "@mui/x-data-grid"
import { IconLoader2 } from "@tabler/icons-react"
import { useEffect } from "react"
import { deleteEngineeringData, getEngineeringData } from "../services/engineering_data.service"
import { IconEye } from "@tabler/icons-react"
import { IconPencil } from "@tabler/icons-react"
import { IconCircleMinus } from "@tabler/icons-react"
import Swal from "sweetalert2"
import { Badge } from "@mui/material"

const EngineeringData = () => {
    const [loading, setLoading] = useState(true)
    const [EngineeringData, setEngineeringData] = useState([])

    useEffect(() => {
        fetchEngineeringData()
    }, [])

    const fetchEngineeringData = async () => {
        try {
            setLoading(true)
            const data = await getEngineeringData();
            setEngineeringData(data.data)
        } catch (error) {
            console.error('Error fetching engineering data:', error)
        } finally {
            setLoading(false)
        }
    }


    const handleDelete = async (row) => {
        const result = await Swal.fire({
            title: "Apakah Anda yakin?",
            text: "Data Engineering beserta GA Drawing dan Datasheet akan dihapus secara permanen!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Ya, hapus!",
            cancelButtonText: "Batal",
        });
    
        if (result.isConfirmed) {
            try {
                const res = await deleteEngineeringData(row.id);
                if (res.success) {
                    Swal.fire("Berhasil!", "Engineering Data berhasil dihapus!", "success");
                    fetchEngineeringData();
                } else {
                    Swal.fire("Gagal!", "Terjadi kesalahan saat menghapus Engineering Data!", "error");
                }
            } catch (error) {
                console.error("Error deleting Engineering Data:", error);
                Swal.fire("Gagal!", "Terjadi kesalahan saat Engineering Data Contract!", "error");
            }
        }
    };

    const columns = [
        { 
            field: 'tag_number', 
            headerName: 'Tag Number',
            valueGetter: (params) => params ? params.tag_number : '-', 
            width: 200,  
            renderCell: (params) => <div className="py-4">{params.row.tag_number_id ? params.row.tag_number.tag_number : '-'}</div> 
        },
        {
            field: 'ga_drawing',
            headerName: 'GA Drawing',
            width: 100,
            renderCell: (params) => (
            <div className='py-4 pl-4'>
                <Link to={`/engineering_data/ga_drawing/${params.row.id}`}
                className=' text-lime-500'
                >
                    <Badge color="secondary" badgeContent={params.row.ga_drawings_count} >
                        <IconEye stroke={2} />
                    </Badge>
                </Link>
            </div>
            ),
        },
        {
            field: 'datasheet',
            headerName: 'Datasheet',
            width: 100,
            renderCell: (params) => (
            <div className='py-4 pl-4'>
                <Link to={`/engineering_data/datasheet/${params.row.id}`}
                className=' text-lime-500'
                >
                    <Badge color="secondary" badgeContent={params.row.datasheets_count} >
                        <IconEye stroke={2} />
                    </Badge>
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
                    <Link to={`/engineering_data/edit/${params.row.id}`}>
                        <button
                        className='px-2 py-1 bg-emerald-950 text-lime-300 text-sm rounded hover:scale-110 transition duration-100'
                        // onClick={() => handleEdit(params.row)}
                        >
                        <IconPencil stroke={2} />
                        </button>
                    </Link>
                    <button
                        className='px-2 py-1 bg-emerald-950 text-red-500 text-sm rounded hover:scale-110 transition duration-100'
                        onClick={() => handleDelete(params.row)}
                    >
                        <IconCircleMinus stroke={2} />
                    </button>
                </div>
            ),
        },
    ]
    

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
    <div className='flex flex-col md:flex-row w-full'>
        <Header />
        <div className='flex flex-col md:pl-64 w-full px-2 py-4 space-y-3'>
            <div className='w-full bg-white shadow-sm px-2 py-4 rounded-lg space-y-2'>
                <div className='flex flex-row justify-between'>
                    <h1 className='text-xl font-bold uppercase'>Engineering Data</h1>
                    <div className='flex flex-row justify-end items-center space-x-2'>
                        <button
                            className='flex space-x-1 items-center px-2 py-1 bg-emerald-950 text-lime-300 text-sm rounded hover:scale-110 transition duration-100'
                            onClick={fetchEngineeringData}
                        >
                            <IconRefresh className='hover:rotate-180 transition duration-500' />
                            <span>Refresh</span>
                        </button>
                        <Link
                            to='/engineering_data/tambah'
                            className='flex space-x-1 items-center px-2 py-1 bg-emerald-950 text-lime-300 text-sm rounded  hover:scale-110 transition duration-100'
                        >
                            <IconPlus className='hover:rotate-180 transition duration-500' />
                            <span>Tambah</span>
                        </Link>
                    </div>
                </div>
                <div>
                    {
                        loading ? 
                        <div className="flex flex-col items-center justify-center h-20">
                            <IconLoader2 stroke={2} className="animate-spin rounded-full h-10 w-10 " />
                        </div>
                        :
                        <DataGrid 
                            rows={EngineeringData}
                            columns={columns}
                            checkboxSelection
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
                            pageSizeOptions={[10, 25, 50, { value: -1, label: 'All' }]}
                        />
                            
                    }
                </div>
            </div>
        </div>
    </div>
  )
}

export default EngineeringData