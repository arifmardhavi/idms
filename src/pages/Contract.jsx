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
import { deleteContract, getContract, getContractByUser } from "../services/contract.service";
import { IconCloudDownload } from "@tabler/icons-react";
import { IconPencil } from "@tabler/icons-react";
import { IconCircleMinus } from "@tabler/icons-react";
import Swal from "sweetalert2";
import { IconSettings } from "@tabler/icons-react";
import { IconLoader2 } from "@tabler/icons-react";
import { Tooltip } from "@mui/material";
import { IconArrowLeft } from "@tabler/icons-react";
import { IconArrowRight } from "@tabler/icons-react";
import { jwtDecode } from "jwt-decode";
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { getWITDateLong } from '../utils/dateHelpers';
import { getExcelColor, getExcelTextColor } from "../utils/excelColor";

const Contract = () => {
    const [contract, setContract] = useState([]);
    // const [selectedRows, setSelectedRows] = useState([]);
    const [loading, setLoading] = useState(false);
    const base_public_url = api_public;
    const [hide, setHide] = useState(false)
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
        fetchContract(level);
    }, []);

    const fetchContract = async (level) => {
        try {
            setLoading(true);
            let data;
            if (level == '3') {
                data = await getContractByUser();
            } else {
                data = await getContract();
            }
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
                    fetchContract(userLevel);
                } else {
                    Swal.fire("Gagal!", "Terjadi kesalahan saat menghapus Contract!", "error");
                }
            } catch (error) {
                console.error("Error deleting Contract:", error);
                Swal.fire("Gagal!", "Terjadi kesalahan saat menghapus Contract!", "error");
            }
        }
    };

    const handleExportToExcel = async () => {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Contract Data');

      worksheet.columns = [
        { header: 'No Vendor', key: 'no_vendor', width: 18 },
        { header: 'Nama Vendor', key: 'vendor_name', width: 35 },
        { header: 'No Contract', key: 'no_contract', width: 32 },
        { header: 'Nama Contract', key: 'contract_name', width: 35 },
        { header: 'Tipe', key: 'contract_type', width: 11 },
        { header: 'Pengawas', key: 'pengawas', width: 20 },
        { header: 'Price', key: 'contract_price', width: 16, style: { numFmt: '#,##0' } },
        { header: 'Contract Date', key: 'contract_date', width: 13 },
        { header: 'Sisa MPP', key: 'durasi_mpp', width: 9 },
        // { header: 'Progress Aktual', key: 'actual_progress', width: 15 },
        { header: 'Deviasi Progress', key: 'monitoring_progress', width: 14 },
        { header: 'Sisa Nilai Kontrak', key: 'sisa_nilai', width: 16, style: { numFmt: '#,##0' } },
        { header: 'Status', key: 'contract_status', width: 7 },
      ];

      contract.forEach((item) => {
        worksheet.addRow({
          no_vendor: item.no_vendor || '',
          vendor_name: item.vendor_name || '',
          no_contract: item.no_contract || '',
          contract_name: item.contract_name || '',
          contract_type: item.contract_type == 1 ? 'Lumpsum' : item.contract_type == 2 ? 'Unit Price' : 'PO Material',
          pengawas: item.pengawas === 0 ? 'Inspection' : item.pengawas === 1 ? 'Maintenance Execution' : item.pengawas === 2 ? 'Procurement' : '-',
          contract_price: item.contract_price,
          contract_date: item.contract_date,
          durasi_mpp: item.durasi_mpp?.sisa,
          // actual_progress: `${item.actual_progress}%`,
          monitoring_progress: item.monitoring_progress?.deviation,
          sisa_nilai: item.sisa_nilai?.sisa,
          contract_status: item.contract_status == 1 ? 'Aktif' : 'Selesai',
        });

        const lastRow = worksheet.lastRow;
        const no_contract = lastRow.getCell('no_contract');

        // Tambahkan hyperlink + style biru underline
        if (item.no_contract && item.contract_file) {
          no_contract.value = {
            text: item.no_contract,
            hyperlink: `${api_public}contract/${item.contract_file}`,
          };
          no_contract.font = {
            color: { argb: getExcelColor('blue') },
            underline: true,
          };
        }
      });

      // Style Header
      worksheet.getRow(1).eachCell((cell) => {
        cell.font = { bold: true };
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'A7F3D0' },
        };
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        };
      });

      // Set border & isi cell kosong
      worksheet.eachRow({ includeEmpty: true }, (row) => {
        const totalColumns = worksheet.columnCount;
        for (let col = 1; col <= totalColumns; col++) {
          const cell = row.getCell(col);
          if (cell.value === undefined || cell.value === null) {
            cell.value = '';
          }
          cell.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' },
          };
        }
      });

      // Pewarnaan berdasarkan data.color
      worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
        if (rowNumber === 1) return;

        const itemIndex = rowNumber - 2;
        const item = contract[itemIndex];

        const durasi_mppCell = row.getCell('durasi_mpp');
        const deviationCell = row.getCell('monitoring_progress');
        const sisa_nilaiCell = row.getCell('sisa_nilai');

        const formatColoredCell = (cell, colorName) => {
          const raw = cell.value;
          if (raw === null || raw === undefined || raw === '') {
            cell.fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: { argb: getExcelColor('gray') },
            };
            cell.font = { color: { argb: 'FF000000' } };
            return;
          }

          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: getExcelColor(colorName) },
          };
          cell.font = { color: { argb: getExcelTextColor(colorName) } };
        };

        formatColoredCell(durasi_mppCell, item.durasi_mpp?.color, );
        formatColoredCell(deviationCell, item.monitoring_progress?.color);
        formatColoredCell(sisa_nilaiCell, item.sisa_nilai?.color);
      });

      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      saveAs(blob, `contract-export-${getWITDateLong()}.xlsx`);
    };


    const columns = [
        { field: 'no_vendor', headerName: 'No Vendor', width: 200, renderCell: (params) => <div className="py-4">{params.value}</div> },
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
            valueGetter: (params) => params == 1 ? 'Lumpsum' : params == 2 ? 'Unit Price' : 'PO Material',
            width: 120,
            renderCell: (params) => (
              <div className={`${params.row.contract_type == '1' ? 'bg-lime-300 text-emerald-950' : 'text-lime-300 bg-emerald-950'} my-2 p-2 rounded flex flex-col justify-center text-xs text-center items-center`}>
                {params.row.contract_type == '1' ? 'Lumpsum' : params.row.contract_type == '2' ? 'Unit Price' : 'PO Material'}
              </div>
            )
        },
        { 
            field: 'pengawas', 
            headerName: 'Pengawas',
            valueGetter: (params) => params == 1 ? 'Maintenance Execution' : params == 0 ? 'Inspection' : params == 2 ? 'Procurement' : '-',
            renderCell: (params) => (
              <div className={`${params.row.pengawas == '1' ? 'bg-lime-300 text-emerald-950' : params.row.pengawas == '0' ? 'text-lime-300 bg-emerald-950' : 'text-white bg-red-500'} my-2 p-2 text-xs text-center rounded flex flex-col justify-center items-center`}>
                {params.row.pengawas == '1' ? 'Maintenance Execution' : params.row.pengawas == '0' ? 'Inspection' : params.row.pengawas == '2' ? 'Procurement' : '-'}
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
          width: 130,
          renderCell: (params) => (
            <div className='py-4'>
              {params.value ? new Intl.DateTimeFormat('id-ID', {
                day: '2-digit',
                month: 'long',
                year: 'numeric',
              }).format(new Date(params.value)) : '-'}
            </div>
          ),
        },
        {
          field: 'durasi_mpp',
          headerName: 'Sisa MPP',
          valueGetter : (params) => params.sisa,
          width: 100,
          renderCell: (params) => 
          <div className='py-4 flex flex-row justify-center items-center'>
            <p className={`${params.row.durasi_mpp.color == 'red' ? 'bg-red-500' : params.row.durasi_mpp.color == 'green' ? 'bg-green-500' : params.row.durasi_mpp.color == 'yellow' ? 'bg-yellow-500' : params.row.durasi_mpp.color == 'blue' ? 'bg-blue-500' : 'bg-emerald-950'} text-white rounded-full w-fit p-2 font-bold`}>
              {params.value}
            </p>
          </div>,
        },
        {
          field: 'actual_progress',
          headerName: 'Aktual Progress',
          valueGetter: (params) => `${params}%`,
          width: 150,
          renderCell: (params) => 
          <div className='py-4 flex flex-row justify-center items-center'>
            <p >
              {params.value}
            </p>
          </div>,
        },
        {
          field: 'monitoring_progress',
          headerName: 'Deviasi Progress',
          valueGetter: (params) => params.deviation,
          width: 150,
          renderCell: (params) => 
          <div className='py-4 flex flex-row justify-center items-center'>
            <p className={`${params.row.monitoring_progress.color == 'red' ? 'bg-red-500' : params.row.monitoring_progress.color == 'green' ? 'bg-green-500' : params.row.monitoring_progress.color == 'yellow' ? 'bg-yellow-500' : params.row.monitoring_progress.color == 'blue' ? 'bg-blue-500' : 'bg-emerald-950'} text-white rounded-full w-fit p-2 font-bold`}>
              {params.row.monitoring_progress.deviation}
            </p>
          </div>,
        },
        { 
            field: 'sisa_nilai', 
            headerName: 'Sisa Nilai Kontrak',
            width: 180,
            valueGetter: (params) => params.sisa,
            renderCell: (params) => (
              <div className={`${params.row.sisa_nilai.color == 'green' ? 'text-white bg-green-500' : params.row.sisa_nilai.color == 'yellow' ? 'bg-yellow-300 text-emerald-950' : params.row.sisa_nilai.color == 'red' ? 'text-white bg-red-600' : 'text-white bg-blue-600'} p-2 rounded flex flex-row justify-center items-center my-2`}>
                {new Intl.NumberFormat('id-ID', {
                style: 'currency',
                currency: 'IDR',
                minimumFractionDigits: 0,
              }).format(new Date(params.row.sisa_nilai.sisa))}
              </div>
            )
        },
        {
          field: 'contract_file',
          headerName: 'Contract File',
          width: 100,
          renderCell: (params) => (
            <div className='py-4 flex flex-row justify-center items-center'>
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
                  <Tooltip title="Details" placement="left">
                    <Link to={`/contract/dashboard/${params.row.id}`}>
                        <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        className='px-2 py-1 bg-emerald-950 text-lime-300 text-sm rounded'
                        >
                        <IconSettings stroke={2} />
                        </motion.button>
                    </Link>
                  </Tooltip>
                  {userLevel !== '3' && userLevel !== '4' && (
                    <>
                      <Tooltip title="Edit" placement="top">
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
                      </Tooltip>
                      <Tooltip title="Delete" placement="top">
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            className='px-2 py-1 bg-emerald-950 text-red-500 text-sm rounded'
                            onClick={() => handleDelete(params.row)}
                        >
                            <IconCircleMinus stroke={2} />
                        </motion.button>
                      </Tooltip>
                    </>
                  )}
                </div>
            ),
        },
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
                    <IconArrowLeft />
                </div>
            </div>
            <div className={` ${hide ? 'block' : 'hidden'}  w-fit bg-emerald-950 text-lime-300 p-2 cursor-pointer rounded-md`} onClick={() => setHide(false)}>
                <IconArrowRight />
            </div>
            <div className='w-full bg-white shadow-sm px-2 py-4 rounded-lg space-y-2'>
                <div className='flex flex-row justify-between'>
                    <h1 className='text-xl font-bold uppercase'>Contract</h1>
                    <div className='flex flex-row justify-end items-center space-x-2'>
                        {/* <Link
                            to='/contract/monitoring'
                            className='flex space-x-1 items-center px-2 py-1 bg-emerald-950 text-lime-300 text-sm rounded hover:scale-110 transition duration-100'
                        >
                            <IconChartPie className='hover:rotate-180 transition duration-500' />
                            <span>Dashboard</span>
                        </Link> */}
                        <motion.button
                          onClick={handleExportToExcel}
                          whileTap={{ scale: 0.9 }}
                          whileHover={{ scale: 1.1 }}
                          className='flex space-x-1 items-center px-2 py-1 bg-emerald-950 text-lime-300 text-sm rounded'
                        >
                          <IconCloudDownload />
                          <span>Export Excel</span>
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            className='flex space-x-1 items-center px-2 py-1 bg-emerald-950 text-lime-300 text-sm rounded hover:scale-110 transition duration-100'
                            onClick={() => fetchContract(userLevel)}
                        >
                            <IconRefresh className='hover:rotate-180 transition duration-500' />
                            <span>Refresh</span>
                        </motion.button>
                        { userLevel !== '3' && userLevel !== '4' && <Link
                            to='/contract/tambah'
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
                                quickFilterLogicOperator: GridLogicOperator.And,
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