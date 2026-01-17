import { useState, useEffect } from 'react';
import Header from '../Header';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Autocomplete, Breadcrumbs, TextField, Typography } from '@mui/material';
import { IconArticle, IconChevronRight, IconX } from '@tabler/icons-react';
import Swal from 'sweetalert2';
import {
  getSertifikatKalibrasiById,
  updateSertifikatKalibrasi,
  deleteSertifikatKalibrasiFile,
} from '../../services/sertifikat_kalibrasi.service';

// import { getPlo } from '../../services/plo.service';
// import { getCategory } from '../../services/category.service';
// import { getTypeByCategory } from '../../services/type.service';
import {
  getTagnumber,
  // getTagnumberById,
  // getTagnumberByTypeUnit,
} from '../../services/tagnumber.service';
import * as motion from 'motion/react-client';
import { api_public } from "../../services/config";
import { IconLoader2 } from '@tabler/icons-react';
import { handleAddActivity } from '../../utils/handleAddActivity';

const EditSertifikatKalibrasi = () => {
  const navigate = useNavigate();
const { id } = useParams();

const [isLoading, setIsLoading] = useState(true);
// const [unitId, setUnitId] = useState('');
// const [ploList, setPloList] = useState([]);
// const [categoryList, setCategoryList] = useState([]);
// const [selectedPlo, setSelectedPlo] = useState('');
// const [selectedCategory, setSelectedCategory] = useState('');
// const [selectedType, setSelectedType] = useState('');
// const [filteredTypes, setFilteredTypes] = useState([]);
// const [selectedTagNumber, setSelectedTagNumber] = useState('');
const [Tagnumbers, setTagnumbers] = useState([]);
const [SertifikatKalibrasi, setSertifikatKalibrasi] = useState({});
const [validation, setValidation] = useState([]);
const [isSubmitting, setIsSubmitting] = useState(false);
const [tagnumberId, setTagnumberId] = useState([]);
const base_public_url = api_public;
const [hide, setHide] = useState(false);

useEffect(() => {
  // fetchPlo();
  fetchTagnumber();
  // fetchCategories();
}, []);

useEffect(() => {
  fetchSertifikatKalibrasiById();
}, [id]);

// useEffect(() => {
//   if (selectedTagNumber) fetchTagNumberById();
// }, [selectedTagNumber]);

const fetchTagnumber = async () => {
  try {
    const data = await getTagnumber();
    setTagnumbers(data?.data || []);
  } catch (error) {
    console.error("Error fetching Tag Number:", error);
  }
};

// const fetchPlo = async () => {
//   try {
//     const data = await getPlo();
//     setPloList(data?.data || []);
//   } catch (error) {
//     console.error("Error fetching PLO:", error);
//   }
// };

// const fetchCategories = async () => {
//   try {
//     const data = await getCategory();
//     setCategoryList(data?.data || []);
//   } catch (error) {
//     console.error("Error fetching categories:", error);
//   }
// };

const fetchSertifikatKalibrasiById = async () => {
  setIsLoading(true);
  try {
    const data = await getSertifikatKalibrasiById(id);
    const SertifikatKalibrasiData = data?.data || {};
    setSertifikatKalibrasi(SertifikatKalibrasiData);
    setTagnumberId(SertifikatKalibrasiData?.tag_number_id || '');
    // setSelectedTagNumber(SertifikatKalibrasiData?.tag_number_id || '');
    // setUnitId(SertifikatKalibrasiData?.plo?.unit_id || '');
    // setSelectedPlo(SertifikatKalibrasiData?.plo?.id || '');
  } catch (error) {
    console.error("Error fetching Sertifikat Kalibrasi:", error);
  } finally {
    setIsLoading(false);
  }
};

// const fetchTagNumberById = async () => {
//   setIsLoading(true);
//   try {
//     const data = await getTagnumberById(selectedTagNumber);
//     handleCategoryChange(data?.data?.type?.category_id, true);
//     handleTypeChange(data?.data?.type_id, true);
//   } catch (error) {
//     console.error("Error fetching tag number:", error);
//   } finally {
//     setIsLoading(false);
//   }
// };

// const handleCategoryChange = async (categoryId, force = false) => {
//   setSelectedCategory(categoryId);
//   setTagnumbers([]);
//   if (!force) {
//     setSelectedType('');
//     setSelectedTagNumber('');
//   }
//   try {
//     const data = await getTypeByCategory(categoryId);
//     setFilteredTypes(data?.data || []);
//   } catch (error) {
//     console.error("Error fetching types:", error);
//     setFilteredTypes([]);
//   }
// };

// const handleTypeChange = async (typeId, force = false) => {
//   setSelectedType(typeId);
//   if (typeId && unitId) {
//     try {
//       const data = await getTagnumberByTypeUnit(typeId, unitId);
//       if (!force) setSelectedTagNumber('');
//       setTagnumbers(data?.data || []);
//     } catch (error) {
//       console.error("Error fetching tag numbers:", error);
//       setTagnumbers([]);
//     }
//   }
// };

const handleUpdateSertifikatKalibrasi = async (e) => {
  e.preventDefault();
  setIsSubmitting(true);
  const formData = new FormData(e.target);
  formData.append('tag_number_id', tagnumberId);
  try {
    const res = await updateSertifikatKalibrasi(id, formData);
    if (res.success) {
      Swal.fire("Berhasil!", "Sertifikat Kalibrasi berhasil diperbarui!", "success");
      setValidation([]);
      navigate('/sertifikat_kalibrasi');
    } else {
      Swal.fire("Gagal!", "Sertifikat Kalibrasi gagal diperbarui!", "error");
    }
  } catch (error) {
    console.error("Error updating Sertifikat Kalibrasi:", error);
    setValidation(error.response?.data.errors || []);
    Swal.fire("Error!", "Terjadi kesalahan saat memperbarui Sertifikat Kalibrasi!", "error");
  } finally {
    setIsSubmitting(false);
  }
};

const handledeleteFile = async (file) => {
  const result = await Swal.fire({
    title: 'Konfirmasi Hapus',
    text: 'Apakah Anda yakin ingin menghapus file Sertifikat Kalibrasi ini?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Ya, Hapus',
    cancelButtonText: 'Batal',
  });
  
  if (result.isConfirmed) {
    try {
      const res = await deleteSertifikatKalibrasiFile(id, file);
      if (res.success) {
        Swal.fire("Berhasil!", "File berhasil dihapus!", "success");
        setValidation([]);
        fetchSertifikatKalibrasiById();
      } else {
        Swal.fire("Gagal!", "File gagal dihapus!", "error");
      }
    } catch (error) {
      console.error("Error deleting file:", error);
      setValidation(error.response?.data.errors || []);
      Swal.fire("Error!", "Terjadi kesalahan saat menghapus file!", "error");
    }
  }
};


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
          <Breadcrumbs
            aria-label='breadcrumb'
            separator={
              <IconChevronRight className='text-emerald-950' stroke={2} />
            }
          >
            <Link className='hover:underline text-emerald-950' to='/'>
              Home
            </Link>
            <Link className='hover:underline text-emerald-950' to='/sertifikat_kalibrasi'>
              Sertifikat Kalibrasi
            </Link>
            <Typography className='text-lime-500'>Edit Sertifikat Kalibrasi</Typography>
          </Breadcrumbs>
          <div>
          {isLoading ? 
              <div className="flex flex-col items-center justify-center h-20">
                  <IconLoader2 stroke={2} className="animate-spin rounded-full h-10 w-10 " />
              </div> 
          : (
            <form
              encType='multipart/form-data'
              onSubmit={(e) => handleUpdateSertifikatKalibrasi(e)}
            >
              <div className='flex flex-col space-y-2'>
                {/* <div className='flex flex-row space-x-2'>
                  <div className='w-full'>
                    <label htmlFor='unit' className='text-emerald-950'>
                      Unit <sup className='text-red-500'>*</sup>
                    </label>
                    <select
                      name='plo_id'
                      id='plo'
                      className='w-full px-1 py-2 border border-gray-300 rounded-md'
                      value={selectedPlo}
                      onChange={(e) => {
                        setSelectedPlo(e.target.value);
                        setUnitId(
                          e.target.options[e.target.selectedIndex].getAttribute(
                            'unit'
                          )
                        );
                      }} // Panggil fungsi saat unit berubah
                      required
                    >
                      <option value=''>Pilih Plo</option>
                      {ploList.map((plo) => (
                        <option key={plo.id} value={plo.id} unit={plo.unit_id}>
                          {plo.unit.unit_name}
                        </option>
                      ))}
                    </select>
                    {validation.plo_id && (
                      validation.plo_id.map((item, index) => (
                        <div key={index}>
                          <small className="text-red-600 text-sm">{item}</small>
                        </div>
                      ))
                    )}
                  </div>
                  <div className='w-full'>
                    <label htmlFor='category' className='text-emerald-950'>
                      Kategori
                    </label>
                    <select
                      name='category_id'
                      id='category'
                      className='w-full px-1 py-2 border border-gray-300 rounded-md'
                      value={selectedCategory}
                      onChange={(e) => handleCategoryChange(e.target.value)}
                    >
                      <option value=''>Pilih Kategori</option>
                      {categoryList.length > 0 ? (
                        categoryList.map((category) => (
                          <option key={category.id} value={category.id}>
                            {category.category_name}
                          </option>
                        ))
                      ) : (
                        <option value='' disabled>
                          Tidak ada kategori
                        </option>
                      )}
                    </select>
                    {validation.category_id && (
                      validation.category_id.map((item, index) => (
                        <div key={index}>
                          <small className="text-red-600 text-sm">{item}</small>
                        </div>
                      ))
                    )}
                  </div>
                </div> */}
                <div className='flex flex-row space-x-2'>
                  {/* <div className='w-full'>
                    <label htmlFor='type' className='text-emerald-950'>
                      Tipe
                    </label>
                    <Autocomplete
                      id="type"
                      options={filteredTypes}
                      getOptionLabel={(option) => option.type_name}  // Yang ditampilkan di dropdown
                      onChange={(event, newValue) => {
                        const selectedId = newValue ? newValue.id : '';
                        handleTypeChange(selectedId);  // Kirim ID ke state
                      }}
                      value={filteredTypes.find((type) => type.id === selectedType) || null}
                      isOptionEqualToValue={(option, value) => option.id === value}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          name="type_id"
                          placeholder="Pilih Tipe"
                          variant="outlined"
                          error={!!validation.type_id}
                          helperText={
                            validation.type_id &&
                            validation.type_id.map((item, index) => (
                              <span key={index} className="text-red-600 text-sm">
                                {item}
                              </span>
                            ))
                          }
                        />
                      )}
                      noOptionsText="Tipe tidak ditemukan"
                    />

                  </div> */}
                  <div className='w-full'>
                    <label htmlFor='tag_number' className='text-emerald-950'>
                      Tag Number
                    </label>
                    <Autocomplete
                      id="tag_number"
                      options={Tagnumbers}
                      getOptionLabel={(option) => option.tag_number}  // Menampilkan tag_number di dropdown
                      onChange={(event, newValue) => {
                        const selectedId = newValue ? newValue.id : '';
                        setTagnumberId(selectedId);  // Simpan ID ke state
                      }}
                      value={Tagnumbers.find((tag) => tag.id === tagnumberId) || null}
                      isOptionEqualToValue={(option, value) => option.id === value}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          name="tag_number_id"
                          placeholder="Pilih Tag Number"
                          variant="outlined"
                          error={!!validation.tag_number_id}
                          helperText={
                            validation.tag_number_id &&
                            validation.tag_number_id.map((item, index) => (
                              <span key={index} className="text-red-600 text-sm">
                                {item}
                              </span>
                            ))
                          }
                        />
                      )}
                      noOptionsText="Tag Number tidak ditemukan"
                    />

                  </div>
                </div>
                <div className='flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2'>
                  <div className='w-full'>
                    <label className='text-emerald-950'>
                      No Sertifikat Kalibrasi <sup className='text-red-500'>*</sup>
                    </label>
                    <input
                      type='text'
                      name='no_sertifikat_kalibrasi'
                      id='no_sertifikat_kalibrasi'
                      placeholder='No Sertifikat Kalibrasi'
                      className='w-full px-3 py-2 border border-gray-300 rounded-lg'
                      defaultValue={SertifikatKalibrasi.no_sertifikat_kalibrasi}
                      required
                    />
                    {validation.no_sertifikat_kalibrasi && (
                      validation.no_sertifikat_kalibrasi.map((item, index) => (
                        <div key={index}>
                          <small className="text-red-600 text-sm">{item}</small>
                        </div>
                      ))
                    )}
                  </div>
                </div>
                <div className='flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2'>
                  <div className='w-full'>
                    <div className='mb-2'>
                      <label className='text-emerald-950'>
                        Dokumen Sertifikat Kalibrasi
                      </label>
                      <input
                        type='file'
                        name='file_sertifikat_kalibrasi'
                        id='file_sertifikat_kalibrasi'
                        className='w-full px-3 py-2 border border-gray-300 rounded-lg'
                      />
                      {validation.file_sertifikat_kalibrasi && (
                        validation.file_sertifikat_kalibrasi.map((item, index) => (
                          <div key={index}>
                            <small className="text-red-600 text-sm">{item}</small>
                          </div>
                        ))
                      )}
                    </div>
                    <div className='flex flex-row justify-between items-center w-full border bg-lime-400 rounded p-1'>
                      {SertifikatKalibrasi.file_sertifikat_kalibrasi ? (
                        <>
                          <Link
                            to={`${base_public_url}sertifikat_kalibrasi/${SertifikatKalibrasi.file_sertifikat_kalibrasi}`}
                            target='_blank'
                            className='text-emerald-950 hover:underline cursor-pointer'
                            onClick={() => handleAddActivity(SertifikatKalibrasi.file_sertifikat_kalibrasi, "Sertifikat Kalibrasi")}
                          >
                            {SertifikatKalibrasi.file_sertifikat_kalibrasi}
                          </Link>
                          <IconX
                            onClick={() =>
                              handledeleteFile({
                                file_sertifikat_kalibrasi: SertifikatKalibrasi.file_sertifikat_kalibrasi,
                              })
                            }
                            className='text-red-500 cursor-pointer hover:rotate-90 transition duration-500 '
                          />
                        </>
                      ) : (
                        <span>-</span>
                      )}
                    </div>
                  </div>
                  <div className='w-full'>
                    <div className='mb-2'>
                      <label className='text-emerald-950'>
                        Dokumen Sertifikat Kalibrasi Lama
                      </label>
                      {/* <input
                        type='file'
                        name='file_old_sertifikat_kalibrasi'
                        id='file_old_sertifikat_kalibrasi'
                        className='w-full px-3 py-2 border border-gray-300 rounded-lg'
                      /> */}
                    </div>
                    <div className='flex flex-row justify-between items-center w-full border bg-lime-400 rounded p-1'>
                      {SertifikatKalibrasi.file_old_sertifikat_kalibrasi ? (
                        <>
                          <Link
                            to={`${base_public_url}sertifikat_kalibrasi/${SertifikatKalibrasi.file_old_sertifikat_kalibrasi}`}
                            target='_blank'
                            className='text-emerald-950 hover:underline cursor-pointer'
                            onClick={() => handleAddActivity(SertifikatKalibrasi.file_old_sertifikat_kalibrasi, "Sertifikat Kalibrasi")}
                          >
                            {SertifikatKalibrasi.file_old_sertifikat_kalibrasi}
                          </Link>
                          <IconX
                            onClick={() =>
                              handledeleteFile({
                                file_old_sertifikat_kalibrasi: SertifikatKalibrasi.file_old_sertifikat_kalibrasi,
                              })
                            }
                            className='text-red-500 cursor-pointer hover:rotate-90 transition duration-500 '
                          />
                        </>
                      ) : (
                        <span>-</span>
                      )}
                    </div>
                  </div>
                </div>
                <div className='flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2'>
                  <div className='w-full flex flex-row space-x-2'>
                    <div className='w-full'>
                      <label className='text-emerald-950'>
                        Issue Date <sup className='text-red-500'>*</sup>
                      </label>
                      <input
                        type='date'
                        name='issue_date'
                        id='issue_date'
                        className='w-full px-3 py-2 border border-gray-300 rounded-lg'
                        defaultValue={SertifikatKalibrasi.issue_date}
                        required
                      />
                      {validation.issue_date && (
                        validation.issue_date.map((item, index) => (
                          <div key={index}>
                            <small className="text-red-600 text-sm">{item}</small>
                          </div>
                        ))
                      )}
                    </div>
                    <div className='w-full'>
                      <label className='text-emerald-950'>
                        Overdue Date <sup className='text-red-500'>*</sup>
                      </label>
                      <input
                        type='date'
                        name='overdue_date'
                        id='overdue_date'
                        className='w-full px-3 py-2 border border-gray-300 rounded-lg'
                        defaultValue={SertifikatKalibrasi.overdue_date}
                        required
                      />
                      {validation.overdue_date && (
                        validation.overdue_date.map((item, index) => (
                          <div key={index}>
                            <small className="text-red-600 text-sm">{item}</small>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className='w-full flex flex-row space-x-2 py-2'>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  whileHover={{ scale: 0.98 }}
                  type='submit'
                  className={`w-full bg-emerald-950 text-white py-2 rounded-md uppercase ${
                    isSubmitting
                      ? 'bg-gray-500 cursor-not-allowed'
                      : 'bg-emerald-950 text-white'
                  }`}
                  disabled={isSubmitting} // Disable tombol jika sedang submit
                >
                  {isSubmitting ? 'Processing...' : 'Save'}
                </motion.button>
                <button
                  type='button'
                  className='w-1/3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 mr-2'
                  onClick={() => navigate('/sertifikat_kalibrasi')}
                >
                  Batal
                </button>
              </div>
            </form>
          )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditSertifikatKalibrasi;
