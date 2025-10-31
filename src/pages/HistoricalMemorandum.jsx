import { IconArticle, IconRefresh } from "@tabler/icons-react"
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
import { IconEye } from "@tabler/icons-react"
import { jwtDecode } from "jwt-decode"
import { handleAddActivity } from "../utils/handleAddActivity"

const HistoricalMemorandum = () => {
    const [historicalMemorandum, setHistoricalMemorandum] = useState([])
    const [loading, setLoading] = useState(true)
    const base_public_url = api_public;
    const [hide, setHide] = useState(false)
    const [userLevel, setUserLevel] = useState('')

    useEffect(() => {
        const token = localStorage.getItem('token');
            let level = '';
            try {
                level = String(jwtDecode(token).level_user);
            } catch (error) {
                console.error('Invalid token:', error);
            }
            setUserLevel(level);
        fetchHistoricalMemorandum()
    }, [])
    const fetchHistoricalMemorandum = async () => {
        try {
            setLoading(true);
            const data = await getHistoricalMemorandum();
            setHistoricalMemorandum(data.data);
            console.log(data.data);
        } catch (error) {
            console.error("Error fetching historical memorandum:", error);
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
        { field: 'unit', 
            headerName: 'Area',
            valueGetter: (params) => params ? params.unit_name : 'All Area', 
            width: 150,  
            renderCell: (params) => <div className="py-4">{params.row.unit_id != '0' ? (params.row.unit.unit_name ? params.row.unit.unit_name : 'All Area') : 'All Area'}</div> },
        { field: 'category', 
            headerName: 'Kategori Peralatan',
            valueGetter: (params) => params ? params.category_name : '-', 
            width: 200,  
            renderCell: (params) => <div className="py-4">{params.row.category.category_name ? params.row.category.category_name : '-'}</div> },
        { field: 'tag_numbers', 
            headerName: 'Tag Number',
            valueGetter: (params) => params ? params.tag_number_id : '-', 
            width: 150,  
            renderCell: (params) => {
                const tagNumbers = params.row.tag_numbers;
                if (Array.isArray(tagNumbers) && tagNumbers.length > 0) {
                    return (
                        <div className="py-4 flex flex-col flex-center items-center">
                            {tagNumbers.map((tag, index) => (
                                <div className="m-1 p-1 bg-slate-300 rounded-full text-center w-fit" key={index}>{tag}</div>
                            ))}
                        </div>
                    );
                } else {
                    return <div className="py-4">-</div>;
                }
            } },
        { field: 'no_dokumen', headerName: 'No Dokumen', width: 200,  renderCell: (params) => <div className="py-4"><Link className="underline font-semibold text-lime-800" to={`${base_public_url}historical_memorandum/${params.row.memorandum_file}`} onClick={() => handleAddActivity(params.row.memorandum_file, "HISTORICAL MEMORANDUM")} target="_blank">{params.value}</Link></div> },
        { field: 'perihal', headerName: 'Perihal', width: 200,  renderCell: (params) => <div className="py-4">{params.value}</div> },
        { 
            field: 'tipe_memorandum', 
            headerName: 'Tipe Memo',
            width: 200,
            valueGetter: (params) => params == 0 ? 'Rekomendasi Rutin' : params == 1 ? 'Rekomendasi TA' : params == 2 ? 'Rekomendasi Overhaul' : params == 3 ? 'Dokumen Kajian/Evaluasi' : params == 4 ? 'Permintaan Tools' : 'Dokumen Kantor Pusat',
            renderCell: (params) => (
              <div className={`bg-lime-300 text-emerald-950 my-2 p-2 rounded flex flex-col justify-center items-center`}>
                {params.row.tipe_memorandum == '0' ? 'Rekomendasi Rutin' : params.row.tipe_memorandum == '1' ? 'Rekomendasi TA' : params.row.tipe_memorandum == '2' ? 'Rekomendasi Overhaul' : params.row.tipe_memorandum == '3' ? 'Dokumen Kajian/Evaluasi' : params.row.tipe_memorandum == '4' ? 'Permintaan Tools' : 'Dokumen Kantor Pusat'}
              </div>
            )
        },
        {
          field: 'tanggal_terbit',
          headerName: 'Tanggal Terbit',
          width: 150,
          renderCell: (params) => (
            <div className='py-4'>
              {new Intl.DateTimeFormat('id-ID', {
                day: '2-digit',
                month: 'long',
                year: 'numeric',
              }).format(new Date(params.value))}
            </div>
          ),
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
                onClick={() => handleAddActivity(params.row.memorandum_file, "HISTORICAL MEMORANDUM")}
              >
                <IconCloudDownload stroke={2} />
              </Link>
            </div>
          ),
        },
        {
            field: 'lampiran_memo',
            headerName: 'Lampiran',
            width: 100,
            renderCell: (params) => (
            <div className='py-4 pl-4'>
                <Link to={`/historical_memorandum/lampiran/${params.row.id}`}
                className=' text-lime-500'
                >
                <IconEye stroke={2} />
                </Link>
            </div>
            ),
        },
        ...(userLevel !== '4' && userLevel !== '5' ? [{
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
    <div className='flex flex-col md:flex-row w-full'>
        { !hide && <Header />}
        <div className={`flex flex-col ${hide ? '' : 'md:pl-64'} w-full px-2 py-4 space-y-3`}>
            <div className='md:flex hidden'>
                <div className={`${hide ? 'hidden' : 'block'} w-fit bg-emerald-950 text-lime-300 p-2 cursor-pointer rounded-md`} onClick={() => setHide(true)}>
                    <IconArticle />
                </div>
            </div>
            <div className={` ${hide ? 'block' : 'hidden'}  w-fit bg-emerald-950 text-lime-300 p-2 cursor-pointer rounded-md`} onClick={() => setHide(false)}>
                <IconArticle />
            </div>
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
                        { userLevel !== '4' && userLevel !== '5' && <Link
                            to='/historical_memorandum/tambah'
                            className='flex space-x-1 items-center px-2 py-1 bg-emerald-950 text-lime-300 text-sm rounded  hover:scale-110 transition duration-100'
                        >
                            <IconPlus className='hover:rotate-180 transition duration-500' />
                            <span>Tambah</span>
                        </Link>}
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