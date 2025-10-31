import { useEffect, useState } from 'react';
import Header from '../components/Header';
import * as motion from 'motion/react-client';
import { DataGrid, GridToolbarQuickFilter, GridLogicOperator } from '@mui/x-data-grid';
import { getTagnumber, addTagnumber, updateTagnumber, nonactiveTagnumber, deleteTagnumber } from '../services/tagnumber.service';
import { ActiveUnit } from '../services/unit.service';
import { ActiveCategory } from '../services/category.service';
import { getTypeByCategory } from '../services/type.service';
import { IconArticle, IconCloudDownload, IconFileImport, IconPencil } from '@tabler/icons-react';
import { IconCircleMinus } from '@tabler/icons-react';
import Swal from 'sweetalert2';
import { IconRefresh } from '@tabler/icons-react';
import { IconTrash } from '@tabler/icons-react';
import { jwtDecode } from 'jwt-decode';
import { IconLoader2 } from '@tabler/icons-react';
import ImportTagNumber from '../components/imports/ImportTagnumber';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { getWITDateLong } from '../utils/dateHelpers';

const Tagnumber = () => {
  const [tagnumber, setTagnumber] = useState([]);
const [IsUnit, setIsUnit] = useState([]);
const [IsCategory, setIsCategory] = useState([]);
const [editTagnumber, setEditTagnumber] = useState({});
const [editMode, setEditMode] = useState(false);
const [selectedUnit, setSelectedUnit] = useState("");
const [selectedCategory, setSelectedCategory] = useState("");
const [filteredTypes, setFilteredTypes] = useState([]);
const [loading, setLoading] = useState(false);
const [validation, setValidation] = useState([]);
const [isSubmitting, setIsSubmitting] = useState(false);
const [hide, setHide] = useState(false);
const token = localStorage.getItem('token');
const userLevel = String(jwtDecode(token).level_user);
const [importMode, setImportMode] = useState(false);

useEffect(() => {
  fetchTagnumber();
  fetchUnits();
  fetchCategories();
}, []);

const fetchTagnumber = async () => {
  try {
    setLoading(true);
    const data = await getTagnumber();
    setTagnumber(data.data);
    console.log(data.data);
    localStorage.setItem("tagnumber", JSON.stringify(data.data));
  } catch (error) {
    console.log(error);
  } finally {
    setLoading(false);
  }
};

const fetchUnits = async () => {
  try {
    setLoading(true);
    const data = await ActiveUnit();
    setIsUnit(data.data);
  } catch (error) {
    console.log(error);
  } finally {
    setLoading(false);
  }
};

const fetchCategories = async () => {
  try {
    setLoading(true);
    const data = await ActiveCategory();
    setIsCategory(data.data);
  } catch (error) {
    console.log(error);
  } finally {
    setLoading(false);
  }
};

const handleCategoryChange = async (categoryId) => {
  setSelectedCategory(categoryId);
  if (!categoryId) return setFilteredTypes([]);

  try {
    const data = await getTypeByCategory(categoryId);
    setFilteredTypes(data ? data.data : []);
  } catch (error) {
    console.log(error);
    setFilteredTypes([]);
  }
};

const handleAddTagnumber = async (event) => {
  event.preventDefault();
  setIsSubmitting(true);

  const formData = new FormData(event.target);
  const data = Object.fromEntries(formData);

  try {
    await addTagnumber(data);
    Swal.fire("Berhasil!", "Tag Number berhasil ditambahkan!", "success");
    fetchTagnumber();
    event.target.reset();
    setFilteredTypes([]);
    setSelectedUnit("");
    setSelectedCategory("");
    setValidation([]);
  } catch (error) {
    console.log(error.response.data.errors);
    setValidation(error.response?.data.errors || []);
    Swal.fire("Gagal!", "Terjadi kesalahan saat menambahkan Tag Number!", "error");
  }

  setIsSubmitting(false);
};

const handleEdit = (row) => {
  setEditMode(true);
  setEditTagnumber(row);
  setSelectedUnit(row.unit_id);
  handleCategoryChange(row.type.category_id);
};

const handleUpdateTagnumber = async (event) => {
  event.preventDefault();
  setIsSubmitting(true);

  const formData = new FormData(event.target);
  const data = Object.fromEntries(formData);

  try {
    await updateTagnumber(editTagnumber.id, data);
    Swal.fire("Berhasil!", "Tag Number berhasil diperbarui!", "success");
    fetchTagnumber();
    setEditMode(false);
    setEditTagnumber({});
    setFilteredTypes([]);
    setSelectedUnit("");
    setSelectedCategory("");
    event.target.reset();
    setValidation([]);
  } catch (error) {
    console.log(error.response.data.errors);
    setValidation(error.response?.data.errors || []);
    Swal.fire("Gagal!", "Terjadi kesalahan saat memperbarui Tag Number!", "error");
  }

  setIsSubmitting(false);
};

const handleNonactive = async (row) => {
  const confirm = await Swal.fire({
    title: "Apakah Anda yakin?",
    text: "Data tag number akan dinonaktifkan!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Ya, Nonaktifkan!",
    cancelButtonText: "Batal",
  });

  if (confirm.isConfirmed) {
    try {
      await nonactiveTagnumber(row.id);
      Swal.fire("Berhasil!", "Tag Number berhasil dinonaktifkan!", "success");
      fetchTagnumber();
    } catch (error) {
      console.log(error);
      Swal.fire("Gagal!", "Terjadi kesalahan saat menonaktifkan Tag Number!", "error");
    }
  }
};

const handleDelete = async (id) => {
  const confirm = await Swal.fire({
    title: "Apakah Anda yakin?",
    text: "Data tag number akan dihapus secara permanen!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Ya, Hapus!",
    cancelButtonText: "Batal",
  });

  if (confirm.isConfirmed) {
    try {
      await deleteTagnumber(id);
      Swal.fire("Berhasil!", "Tag Number berhasil dihapus!", "success");
      fetchTagnumber();
    } catch (error) {
      console.log(error);
      Swal.fire("Gagal!", "Terjadi kesalahan saat menghapus Tag Number!", "error");
    }
  }
};


  // get tag number
  const columns = [
    { field: 'tag_number', headerName: 'Tag Number', width: 200, renderCell: (params) => <div className="py-4">{params.value}</div> },
    { field: 'unit', valueGetter: (params) => params.unit_name, headerName: 'Unit', width: 130, renderCell: (params) => <div className="py-4">{params.value}</div> },
    { field: 'type', valueGetter: (params) => params.type_name, headerName: 'Tipe', width: 130, renderCell: (params) => <div className="py-4">{params.value}</div> },
    { field: 'description', headerName: 'Deskripsi', width: 300, renderCell: (params) => <div className="py-4">{params.value}</div> },
    {
      field: 'status',
      headerName: 'Status',
      valueGetter: (params) => params == 1 ? 'Aktif' : 'Nonaktif',
      renderCell: (params) => (
        <div className={`${params.row.status == '1' ? 'bg-lime-300 text-emerald-950' : 'text-lime-300 bg-emerald-950'} my-2 p-2 rounded flex flex-col justify-center items-center`}>
          {params.row.status == '1' ? 'Aktif' : 'Nonaktif'}
        </div>
      )
    },
    {
      field: 'actions',
      headerName: 'Aksi',
      width: 150,
      renderCell: (params) => (
        <div className="flex flex-row justify-center py-2 items-center space-x-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="px-2 py-1 bg-emerald-950 text-lime-300 text-sm rounded"
            onClick={() => handleEdit(params.row)}
          >
            <IconPencil stroke={2} />
          </motion.button>
          {params.row.status == 1 ? 
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className='px-2 py-1 bg-emerald-950 text-red-500 text-sm rounded'
              onClick={() => handleNonactive(params.row)}
            >
              <IconCircleMinus stroke={2} />
            </motion.button>
            : ''
          }
          {userLevel == 99 && 
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className='px-2 py-1 bg-emerald-950 text-red-500 text-sm rounded'
              onClick={() => handleDelete(params.row.id)}
            >
              <IconTrash stroke={2} />
            </motion.button>
          }
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

  const handleImport = () => {
    setImportMode(true);
  }

  const handleImportClose = () => {
    setImportMode(false);
  }

  const handleExportToExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Tag Number Data');
    worksheet.columns = [
      { header: 'Unit', key: 'unit', width: 15 },
      { header: 'Kategori', key: 'category', width: 12 },
      { header: 'Tipe', key: 'type', width: 20 },
      { header: 'Tag Number', key: 'tag_number', width: 20 },
      { header: 'Deskripsi', key: 'description', width: 35 },
    ];
    tagnumber.forEach((item) => {
      worksheet.addRow({
        unit: item.unit?.unit_name || '',
        category: item.type?.category?.category_name || '',
        type: item.type?.type_name || '',
        tag_number: item.tag_number || '',
        description: item.description || '',
      });
    });

    // Style header
    worksheet.getRow(1).eachCell((cell) => {
      cell.font = { bold: true };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'ffd4d4d4' }, // warna hijau muda
      };
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };
    });

    worksheet.eachRow({ includeEmpty: true }, (row) => {
      // Dapatkan jumlah kolom dari worksheet (agar semua cell dilintasi, termasuk yang kosong)
      const totalColumns = worksheet.columnCount;

      for (let col = 1; col <= totalColumns; col++) {
        const cell = row.getCell(col);

        // Paksa set isi kosong jika memang kosong (agar cell terbuat dan bisa diborder)
        if (cell.value === undefined || cell.value === null) {
          cell.value = ''; // Supaya cell eksis
        }

        // Tambahkan border
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        };
      }
    });

    // Save
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(blob, `tagnumber-export-${getWITDateLong()}.xlsx`);
  }
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
        <div className='w-full flex' >
        { importMode && <ImportTagNumber onImportRefresh={fetchTagnumber} />}
        </div>
          {/* Get Tag Number */}
          <div className="w-full bg-white shadow-sm px-2 py-4 rounded-lg space-y-2">
            <div className="flex flex-row justify-between">
              <h1 className="text-xl font-bold uppercase">Tag Number</h1>
              <div className='flex flex-row justify-end items-center space-x-2'>
                {/* { !importMode ? <button
                  className="flex space-x-1 items-center px-2 py-1 bg-emerald-950 text-lime-300 text-sm rounded"
                  onClick={() => handleImport()}
                >
                  <IconFileImport stroke={2} />
                  <span>Import Data</span>
                </button>
                :
                <button
                  className="flex space-x-1 items-center px-2 py-1 bg-emerald-950 text-lime-300 text-sm rounded"
                  onClick={() => handleImportClose()}
                >
                  <span>Cancel Import Data</span>
                </button> 
                }
                <motion.button
                  onClick={handleExportToExcel}
                  whileTap={{ scale: 0.9 }}
                  whileHover={{ scale: 1.1 }}
                  className='flex space-x-1 items-center px-2 py-1 bg-emerald-950 text-lime-300 text-sm rounded'
                >
                  <IconCloudDownload />
                  <span>Export Excel</span>
                </motion.button> */}
                <motion.div
                  onClick={() => fetchTagnumber()}
                  whileTap={{ scale: 0.9 }}
                  whileHover={{ scale: 1.1 }}
                  className="flex space-x-1 items-center px-2 py-1 bg-emerald-950 text-lime-300 text-sm rounded"
                >
                  <IconRefresh className='hover:rotate-180 transition duration-500' />
                  <span>Refresh</span>
                </motion.div>
              </div>
            </div>
            <div>
            {loading ? 
              <div className="flex flex-col items-center justify-center h-20">
                  <IconLoader2 stroke={2} className="animate-spin rounded-full h-10 w-10 " />
              </div> 
            : <DataGrid
                rows={tagnumber}
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
                pageSizeOptions={[5, 10, 25, { value: -1, label: 'All' }]}
              />}
            </div>
          </div>
          {/* Get Tag Number */}

          {/* Add Tagnumber */}
          {editMode === false && (
            <div className="w-full h-fit bg-white shadow-sm px-2 py-4 rounded-lg space-y-2">
              <h1 className="text-xl font-bold uppercase">Tambah Tag Number</h1>
              <form method="POST" onSubmit={(event) => handleAddTagnumber(event)}>
                <div className="flex flex-col space-y-4">
                  <div className='w-full'>
                    <label className="text-sm uppercase" htmlFor="tag_number">
                      Tag Number<sup className='text-red-500'>*</sup>
                    </label>
                    <input
                      className="w-full px-1 py-2 border border-gray-300 rounded-md"
                      type="text"
                      name="tag_number"
                      id="tag_number"
                      placeholder="Masukkan Tag Number..."
                      required
                    />
                    {validation.tag_number && (
                    validation.tag_number.map((item, index) => (
                      <div key={index}>
                        <small className="text-red-600 text-sm">{item}</small>
                      </div>
                    ))
                  )}
                  </div>
                  <div className='flex flex-row space-x-2'>
                    <div className='w-full'>
                      <label className="text-sm uppercase" htmlFor="unit">
                        Unit<sup className='text-red-500'>*</sup>
                      </label>
                      <select
                        name="unit_id"
                        id="unit"
                        className="w-full px-1 py-2 border border-gray-300 rounded-md"
                        value={selectedUnit}
                        onChange={(e) => setSelectedUnit(e.target.value)} // Panggil fungsi saat unit berubah
                        required
                      >
                        <option value="">Pilih Unit</option>
                        {IsUnit.map((unit) => (
                          <option key={unit.id} value={unit.id}>
                            {unit.unit_name}
                          </option>
                        ))}
                      </select>
                      {validation.unit_id && (
                        validation.unit_id.map((item, index) => (
                          <div key={index}>
                            <small className="text-red-600 text-sm">{item}</small>
                          </div>
                        ))
                      )}
                    </div>
                    <div className='w-full'>
                      <label className="text-sm uppercase" htmlFor="category">
                        Kategori<sup className='text-red-500'>*</sup>
                      </label>
                      <select
                        name="category_id"
                        id="category"
                        className="w-full px-1 py-2 border border-gray-300 rounded-md"
                        value={selectedCategory}
                        onChange={(e) => handleCategoryChange(e.target.value)}
                        required
                      >
                        <option value="">Pilih Kategori</option>
                        {
                          IsCategory.length > 0 
                            ? IsCategory.map((category) => (
                                <option key={category.id} value={category.id}>
                                  {category.category_name}
                                </option>
                              ))
                            : <option value="" disabled>Tidak ada kategori</option>
                        }
                      </select>
                      {validation.category_id && (
                        validation.category_id.map((item, index) => (
                          <div key={index}>
                            <small className="text-red-600 text-sm">{item}</small>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                  <div className='flex flex-row space-x-2'>
                    <div className='w-full'>
                      <label className="text-sm uppercase" htmlFor="type">
                        Tipe<sup className='text-red-500'>*</sup>
                      </label>
                      <select
                        name="type_id"
                        id="type"
                        className="w-full px-1 py-2 border border-gray-300 rounded-md"
                        required
                      >
                        <option value="">Pilih Tipe</option>
                        {
                          filteredTypes.length > 0 
                            ? filteredTypes.map((type) => (
                                <option key={type.id} value={type.id}>
                                  {type.type_name}
                                </option>
                              ))
                            : <option value="" disabled>Tidak ada Tipe</option>
                        }
                      </select>
                      {validation.type_id && (
                        validation.type_id.map((item, index) => (
                          <div key={index}>
                            <small className="text-red-600 text-sm">{item}</small>
                          </div>
                        ))
                      )}
                    </div>
                    <div className='w-full'>
                      <label htmlFor="status">Status<sup className='text-red-500'>*</sup></label>
                      <select
                        className="w-full px-1 py-2 border border-gray-300 rounded-md"
                        name="status"
                        id="status"
                      >
                        <option value="1">Aktif</option>
                        <option value="0">Nonaktif</option>
                      </select>
                      {validation.status && (
                        validation.status.map((item, index) => (
                          <div key={index}>
                            <small className="text-red-600 text-sm">{item}</small>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm uppercase" htmlFor="description">
                      Deskripsi Tag Number
                    </label>
                    <textarea
                      className="w-full p-1 border border-gray-300 rounded-md"
                      name="description"
                      id="description"
                      rows={4}
                    ></textarea>
                    {validation.description && (
                        validation.description.map((item, index) => (
                          <div key={index}>
                            <small className="text-red-600 text-sm">{item}</small>
                          </div>
                        ))
                      )}
                  </div>
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    whileHover={{ scale: 0.98 }}
                    className={`w-full bg-emerald-950 text-white py-2 rounded-md uppercase ${
                      isSubmitting
                        ? 'bg-gray-500 cursor-not-allowed'
                        : 'bg-emerald-950 text-white'
                    }`}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Processing...' : 'Save'}
                  </motion.button>
                </div>
              </form>
            </div>
          )}
          {/* Add Type */}

          {/* Edit Type */}
          {editMode && (
            <div className="w-full h-fit bg-white shadow-sm px-2 py-4 rounded-lg space-y-2">
              <h1 className="text-xl font-bold uppercase">Edit Tag Number</h1>
              <form method="POST" onSubmit={(event) => handleUpdateTagnumber(event)}>
                <div className="flex flex-col space-y-4">
                  <div className='w-full'>
                    <label className="text-sm uppercase" htmlFor="type_name">
                      Tag Number<sup className='text-red-500'>*</sup>
                    </label>
                    <input
                      className="w-full px-1 py-2 border border-gray-300 rounded-md"
                      type="text"
                      name="tag_number"
                      id="tag_number"
                      placeholder="Masukkan Tag Number..."
                      value={editTagnumber.tag_number || ''}
                      onChange={(e) => setEditTagnumber({ ...editTagnumber, tag_number: e.target.value })}
                      required
                    />
                    {validation.tag_number && (
                      validation.tag_number.map((item, index) => (
                        <div key={index}>
                          <small className="text-red-600 text-sm">{item}</small>
                        </div>
                      ))
                    )}
                  </div>
                  <div className='flex flex-row space-x-2'>
                    <div className='w-full'>
                      <label className="text-sm uppercase" htmlFor="unit">
                        Unit<sup className='text-red-500'>*</sup>
                      </label>
                      <select
                        name="unit_id"
                        id="unit"
                        className="w-full px-1 py-2 border border-gray-300 rounded-md"
                        value={selectedUnit}
                        onChange={(e) => {
                          setSelectedUnit(e.target.value);
                        }}
                        required
                      >
                        <option value="">Pilih Unit</option>
                        {IsUnit.map((unit) => (
                          <option key={unit.id} value={unit.id}>
                            {unit.unit_name}
                          </option>
                        ))}
                      </select>
                      {validation.unit_id && (
                        validation.unit_id.map((item, index) => (
                          <div key={index}>
                            <small className="text-red-600 text-sm">{item}</small>
                          </div>
                        ))
                      )}
                    </div>
                    <div className='w-full'>
                      <label className="text-sm uppercase" htmlFor="category">
                        Kategori<sup className='text-red-500'>*</sup>
                      </label>
                      <select
                        name="category_id"
                        id="category"
                        className="w-full px-1 py-2 border border-gray-300 rounded-md"
                        required
                        value={selectedCategory}
                        onChange={(e) => handleCategoryChange(e.target.value)}
                      >
                        <option value="">Pilih Kategori</option>
                        {
                          IsCategory.length > 0 
                            ? IsCategory.map((category) => (
                                <option key={category.id} value={category.id}>
                                  {category.category_name}
                                </option>
                              ))
                            : <option value="" disabled>Tidak ada kategori</option>
                        }
                      </select>
                      {validation.category_id && (
                        validation.category_id.map((item, index) => (
                          <div key={index}>
                            <small className="text-red-600 text-sm">{item}</small>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                  <div className='flex flex-row space-x-2'>
                    <div className='w-full'>
                      <label className="text-sm uppercase" htmlFor="type">
                        Tipe<sup className='text-red-500'>*</sup>
                      </label>
                      <select
                        name="type_id"
                        id="type"
                        className="w-full px-1 py-2 border border-gray-300 rounded-md"
                        value={editTagnumber.type_id || ''}
                        onChange={(e) => setEditTagnumber({ ...editTagnumber, type_id: e.target.value })}
                        required
                      >
                        <option value="">Pilih Tipe</option>
                        {
                          filteredTypes.length > 0 
                            ? filteredTypes.map((type) => (
                                <option key={type.id} value={type.id}>
                                  {type.type_name}
                                </option>
                              ))
                            : <option value="" disabled>Tidak ada Tipe</option>
                        }
                      </select>
                      {validation.type_id && (
                        validation.type_id.map((item, index) => (
                          <div key={index}>
                            <small className="text-red-600 text-sm">{item}</small>
                          </div>
                        ))
                      )}
                    </div>
                    <div className='w-full'>
                      <label htmlFor="status">Status<sup className='text-red-500'>*</sup></label>
                      <select
                        className="w-full px-1 py-2 border border-gray-300 rounded-md"
                        name="status"
                        id="status"
                        value={editTagnumber.status || '0'}
                        onChange={(e) => setEditTagnumber({ ...editTagnumber, status: e.target.value })}
                      >
                        <option value="1">Aktif</option>
                        <option value="0">Nonaktif</option>
                      </select>
                      {validation.status && (
                        validation.status.map((item, index) => (
                          <div key={index}>
                            <small className="text-red-600 text-sm">{item}</small>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm uppercase" htmlFor="description">
                      Deskripsi Tag Number
                    </label>
                    <textarea
                      className="w-full p-1 border border-gray-300 rounded-md"
                      name="description"
                      id="description"
                      rows={4}
                      value={editTagnumber.description || ''}
                      onChange={(e) => setEditTagnumber({ ...editTagnumber, description: e.target.value })}
                    ></textarea>
                    {validation.description && (
                        validation.description.map((item, index) => (
                          <div key={index}>
                            <small className="text-red-600 text-sm">{item}</small>
                          </div>
                        ))
                      )}
                  </div>
                  <div className='flex flex-row space-x-2' >
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      whileHover={{ scale: 0.98 }}
                      type='submit'
                      className={`w-4/5 bg-lime-400 text-emerald-950 py-2 rounded-md uppercase ${
                        isSubmitting
                          ? 'bg-gray-500 cursor-not-allowed'
                          : 'bg-emerald-950 text-white'
                      }`}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Processing...' : 'Update'}
                    </motion.button>
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      whileHover={{ scale: 0.98 }}
                      className="w-1/5 bg-emerald-950 text-lime-300 py-2 rounded-md uppercase"
                      onClick={() => {setSelectedUnit(''); setEditMode(false); setValidation([]) ;setEditTagnumber({})}}
                    >
                      batal
                    </motion.button>
                  </div>
                </div>
              </form>
            </div>
          )}
          {/* Edit Type */}

      </div>
    </div>
  )
}

export default Tagnumber