import { IconRefresh } from "@tabler/icons-react"
import Header from "../components/Header"
import { Link } from "react-router-dom"
import { IconPlus } from "@tabler/icons-react"
import { useState, useEffect } from "react"
import { deleteHistoricalMemorandum, getHistoricalMemorandum } from "../services/historical_memorandum.service"
import { api_public } from '../services/config';
import { DataGrid, GridToolbarQuickFilter, GridLogicOperator } from "@mui/x-data-grid"
import { IconLoader2 } from "@tabler/icons-react"
import { IconCloudDownload } from "@tabler/icons-react"
import { IconPencil } from "@tabler/icons-react"
import { IconCircleMinus } from "@tabler/icons-react"
import Swal from "sweetalert2"

const HistoricalMemorandum = () => {
    const [historicalMemorandum, setHistoricalMemorandum] = useState([])
    const [loading, setLoading] = useState(true)
    const base_public_url = api_public;

    useEffect(() => {
        fetchHistoricalMemorandum()
    }, [])
    const fetchHistoricalMemorandum = async () => {
        try {
            setLoading(true);
            const data = await getHistoricalMemorandum();
            setHistoricalMemorandum(data.data);
            console.log(data.data);
        } catch (error) {
            console.error("Error fetching contract:", error);
        } finally {
            setLoading(false);
        }
    }
    const handleDelete = async (row) => {
        const result = await Swal.fire({
          title: "Apakah Anda yakin?",
          text: "Data Historical Memorandum akan dihapus secara permanen!",
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Ya, hapus!",
          cancelButtonText: "Batal",
        });
    
        if (result.isConfirmed) {
            try {
                const res = await deleteHistoricalMemorandum(row.id);
                if (res.success) {
                    Swal.fire("Berhasil!", "Historical Memorandum berhasil dihapus!", "success");
                    fetchHistoricalMemorandum();
                } else {
                    Swal.fire("Gagal!", "Terjadi kesalahan saat menghapus Historical Memorandum!", "error");
                }
            } catch (error) {
                console.error("Error deleting Historical Memorandum:", error);
                Swal.fire("Gagal!", "Terjadi kesalahan saat Historical Memorandum Contract!", "error");
            }
        }
    };
    const columns = [
        { field: 'tag_number', 
            headerName: 'Tag Number',
            valueGetter: (params) => params ? params.tag_number : '-', 
            width: 200,  
            renderCell: (params) => <div className="py-4">{params.row.tag_number_id ? params.row.tag_number.tag_number : '-'}</div> },
        { field: 'judul_memorandum', headerName: 'Judul Memorandum', width: 200,  renderCell: (params) => <div className="py-4">{params.value}</div> },
        { 
            field: 'jenis_memorandum', 
            headerName: 'Jenis Memorandum',
            width: 160,
            valueGetter: (params) => params == 1 ? 'Laporan Pekerjaan' : 'Rekomendasi',
            renderCell: (params) => (
              <div className={`${params.row.jenis_memorandum == '1' ? 'bg-lime-300 text-emerald-950' : 'text-lime-300 bg-emerald-950'} my-2 p-2 rounded flex flex-col justify-center items-center`}>
                {params.row.jenis_memorandum == '1' ? 'Laporan Pekerjaan' : 'Rekomendasi'}
              </div>
            )
        },
        { 
            field: 'jenis_pekerjaan',
            headerName: 'Jenis Pekerjaan', 
            width: 160,
            valueGetter: (params) => params == 0 ? 'ta' : params == 1 ? 'rutin' : params == 2 ? 'non rutin' : 'overhaul',
            renderCell: (params) => (
              <div className={`${params.row.jenis_pekerjaan == '0' ? 'bg-indigo-500 text-white' : params.row.jenis_pekerjaan == '1' ? 'text-white bg-blue-500' : params.row.jenis_pekerjaan == '2' ? 'bg-green-500 text-white' : 'text-emerald-950 bg-yellow-500'} my-2 p-2 rounded flex flex-col justify-center items-center`}>
                {params.row.jenis_pekerjaan == '0' ? 'TA' : params.row.jenis_pekerjaan == '1' ? 'Rutin' : params.row.jenis_pekerjaan == '2' ? 'Non Rutin' : 'Overhaul'}
              </div>
            )
        },
        {
          field: 'memorandum_file',
          headerName: 'Memo File',
          width: 100,
          renderCell: (params) => (
            <div className='py-4 flex flex-row justify-center items-center'>
              <Link
                to={`${base_public_url}historical_memorandum/${params.row.memorandum_file}`}
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
                  <Link to={`/historical_memorandum/edit/${params.row.id}`}>
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
    <div className='flex flex-col md:flex-row w-full'>
        <Header />
        <div className='flex flex-col md:pl-64 w-full px-2 py-4 space-y-3'>
            <div className='w-full bg-white shadow-sm px-2 py-4 rounded-lg space-y-2'>
                <div className='flex flex-row justify-between'>
                    <h1 className='text-xl font-bold uppercase'>Historical Memorandum</h1>
                    <div className='flex flex-row justify-end items-center space-x-2'>
                        <button
                            className='flex space-x-1 items-center px-2 py-1 bg-emerald-950 text-lime-300 text-sm rounded hover:scale-110 transition duration-100'
                            onClick={fetchHistoricalMemorandum}
                        >
                            <IconRefresh className='hover:rotate-180 transition duration-500' />
                            <span>Refresh</span>
                        </button>
                        <Link
                            to='/historical_memorandum/tambah'
                            className='flex space-x-1 items-center px-2 py-1 bg-emerald-950 text-lime-300 text-sm rounded  hover:scale-110 transition duration-100'
                        >
                            <IconPlus className='hover:rotate-180 transition duration-500' />
                            <span>Tambah</span>
                        </Link>
                    </div>
                </div>
                <div>
                    {loading ? (
                        <div className="flex flex-col items-center justify-center h-20">
                            <IconLoader2 stroke={2} className="animate-spin rounded-full h-10 w-10 " />
                        </div>
                    ) : <DataGrid
                        rows={historicalMemorandum}
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
                    />}
                </div>
            </div>
        </div>
    </div>
  )
}

export default HistoricalMemorandum