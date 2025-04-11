import Header from "../components/Header"
import { Link } from "react-router-dom"
import { 
    IconPlus,
    IconRefresh,
} from "@tabler/icons-react"
import * as motion from 'motion/react-client';
import { DataGrid, GridLogicOperator, GridToolbarQuickFilter } from "@mui/x-data-grid";
import { api_public } from '../services/config';
import { useEffect, useState } from "react";
import { deleteContract, getContract } from "../services/contract.service";
import { IconCloudDownload } from "@tabler/icons-react";
import { IconPencil } from "@tabler/icons-react";
import { IconCircleMinus } from "@tabler/icons-react";
import Swal from "sweetalert2";
import { IconSettings } from "@tabler/icons-react";
const Contract = () => {
    const [contract, setContract] = useState([]);
    // const [selectedRows, setSelectedRows] = useState([]);
    const [loading, setLoading] = useState(false);
    const base_public_url = api_public;

    useEffect(() => {
        fetchContract();
    }, []);

    const fetchContract = async () => {
        try {
            setLoading(true);
            const data = await getContract();
            setContract(data.data);
            console.log(data.data);
        } catch (error) {
            console.error("Error fetching contract:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (row) => {
        const result = await Swal.fire({
          title: "Apakah Anda yakin?",
          text: "Data Contract akan dihapus secara permanen!",
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Ya, hapus!",
          cancelButtonText: "Batal",
        });
    
        if (result.isConfirmed) {
            try {
                const res = await deleteContract(row.id);
                if (res.success) {
                    Swal.fire("Berhasil!", "Contract berhasil dihapus!", "success");
                    fetchContract();
                } else {
                    Swal.fire("Gagal!", "Terjadi kesalahan saat menghapus Contract!", "error");
                }
            } catch (error) {
                console.error("Error deleting Contract:", error);
                Swal.fire("Gagal!", "Terjadi kesalahan saat menghapus Contract!", "error");
            }
        }
    };

    const columns = [
        { field: 'no_vendor', headerName: 'No Vendor',  renderCell: (params) => <div className="py-4">{params.value}</div> },
        { field: 'vendor_name', headerName: 'Nama Vendor', width: 200,  renderCell: (params) => <div className="py-4">{params.value}</div> },
        {
          field: 'no_contract',
          headerName: 'No Contract',
          width: 150,
          renderCell: (params) => <div className='py-4'>{params.value}</div>,
        },
        {
          field: 'contract_name',
          headerName: 'Nama Contract',
          width: 250,
          renderCell: (params) => <div className='py-4'>{params.value}</div>,
        },
        { 
            field: 'contract_type', 
            headerName: 'Tipe',
            valueGetter: (params) => params == 1 ? 'Lumpsum' : 'Unit Price',
            renderCell: (params) => (
              <div className={`${params.row.contract_type == '1' ? 'bg-lime-300 text-emerald-950' : 'text-lime-300 bg-emerald-950'} my-2 p-2 rounded flex flex-col justify-center items-center`}>
                {params.row.contract_type == '1' ? 'Lumpsum' : 'Unit Price'}
              </div>
            )
        },
        {
          field: 'contract_price',
          headerName: 'Price',
          width: 150,
          renderCell: (params) => (
            <div className='py-4'>
              {new Intl.NumberFormat('id-ID', {
                style: 'currency',
                currency: 'IDR',
                minimumFractionDigits: 0,
              }).format(params.value)}
            </div>
          ),
        },        
        {
          field: 'contract_date',
          headerName: 'Contract Date',
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
          field: 'contract_file',
          headerName: 'Contract File',
          width: 100,
          renderCell: (params) => (
            <div className='py-4'>
              <Link
                to={`${base_public_url}contract/${params.row.contract_file}`}
                target='_blank'
                className='item-center text-lime-500'
              >
                <IconCloudDownload stroke={2} />
              </Link>
            </div>
          ),
        },
        { 
            field: 'contract_status', 
            headerName: 'Status',
            valueGetter: (params) => params == 1 ? 'Aktif' : 'Selesai',
            renderCell: (params) => (
              <div className={`${params.row.contract_status == '1' ? 'bg-lime-300 text-emerald-950' : 'text-lime-300 bg-emerald-950'} my-2 p-2 rounded flex flex-col justify-center items-center`}>
                {params.row.contract_status == '1' ? 'Aktif' : 'Selesai'}
              </div>
            )
          },
        {
            field: 'actions',
            headerName: 'Aksi',
            width: 150,
            renderCell: (params) => (
                <div className='flex flex-row justify-center py-2 items-center space-x-2'>
                  <Link to={`/contract/edit/${params.row.id}`}>
                      <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className='px-2 py-1 bg-emerald-950 text-lime-300 text-sm rounded'
                      // onClick={() => handleEdit(params.row)}
                      >
                      <IconSettings stroke={2} />
                      </motion.button>
                  </Link>
                  <Link to={`/contract/edit/${params.row.id}`}>
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
    <div className='flex flex-col md:flex-row w-full'>
        <Header />
        <div className='flex flex-col md:pl-64 w-full px-2 py-4 space-y-3'>
            <div className='w-full bg-white shadow-sm px-2 py-4 rounded-lg space-y-2'>
                <div className='flex flex-row justify-between'>
                    <h1 className='text-xl font-bold uppercase'>Contract</h1>
                    <div className='flex flex-row justify-end items-center space-x-2'>
                        <motion.a
                            href='/contract'
                            whileTap={{ scale: 0.9 }}
                            whileHover={{ scale: 1.1 }}
                            className='flex space-x-1 items-center px-2 py-1 bg-emerald-950 text-lime-300 text-sm rounded'
                        >
                            <IconRefresh className='hover:rotate-180 transition duration-500' />
                            <span>Refresh</span>
                        </motion.a>
                        <Link
                            to='/contract/tambah'
                            className='flex space-x-1 items-center px-2 py-1 bg-emerald-950 text-lime-300 text-sm rounded  hover:scale-110 transition duration-100'
                        >
                            <IconPlus className='hover:rotate-180 transition duration-500' />
                            <span>Tambah</span>
                        </Link>
                    </div>
                </div>
                <div>
                {loading ? <p>Loading...</p> : <DataGrid
                    rows={contract}
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
                                quickFilterLogicOperator: GridLogicOperator.Or,
                            },
                        },
                    }}
                    pageSizeOptions={[10, 25, 50, { value: -1, label: 'All' }]}
                    // onRowSelectionModelChange={(newSelectionModel) => {
                    //     setSelectedRows(newSelectionModel); // Update state dengan ID yang dipilih
                    // }}
                />}
                </div>
            </div>
        </div>
    </div>
  )
}

export default Contract