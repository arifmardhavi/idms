import Header from '../Header';
import { Autocomplete, Breadcrumbs, TextField, Typography } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { IconArticle, IconChevronRight } from '@tabler/icons-react';
import { useState, useEffect } from 'react';
import { addSkhp } from '../../services/skhp.service';
// import { getCategory } from '../../services/category.service';
// import { getTypeByCategory } from '../../services/type.service';
import { getTagnumber } from '../../services/tagnumber.service';
import Swal from 'sweetalert2';
import * as motion from 'motion/react-client';
// import { getUnit } from '../../services/unit.service';

const AddSkhp = () => {
  const navigate = useNavigate();
  // const [unitId, setUnitId] = useState('');
  // const [unitList, setUnitList] = useState([]);
  // const [categoryList, setCategoryList] = useState([]);
  // const [selectedUnit, setSelectedUnit] = useState('');
  // const [selectedCategory, setSelectedCategory] = useState('');
  // const [filteredTypes, setFilteredTypes] = useState([]);
  // const [selectedType, setSelectedType] = useState('');
  const [Tagnumbers, setTagnumbers] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validation, setValidation] = useState([]);
  const [tagnumberId, setTagnumberId] = useState([]);
  const [hide, setHide] = useState(false);

  useEffect(() => {
    // fetchUnit();
    // fetchCategories();
    fetchTagNumber();
  }, []);

  // const fetchUnit = async () => {
  //   try {
  //     const data = await getUnit();
  //     setUnitList(data.data);
  //   } catch (error) {
  //     console.error("Error fetching unit:", error);
  //   }
  // };
  const fetchTagNumber = async () => {
    try {
      const data = await getTagnumber();
      setTagnumbers(data.data);
    } catch (error) {
      console.error("Error fetching tag number:", error);
    }
  }

  // const fetchCategories = async () => {
  //   try {
  //     const data = await getCategory();
  //     setCategoryList(data.data);
  //   } catch (error) {
  //     console.error("Error fetching categories:", error);
  //   }
  // };

  // const handleCategoryChange = async (categoryId) => {
  //   setSelectedCategory(categoryId);
  //   setSelectedType('');
  //   setTagnumbers([]);
    
  //   if (categoryId) {
  //     try {
  //       const data = await getTypeByCategory(categoryId);
  //       setFilteredTypes(data?.data || []);
  //     } catch (error) {
  //       console.error("Error fetching types:", error);
  //       setFilteredTypes([]);
  //     }
  //   } else {
  //     setFilteredTypes([]);
  //   }
  // };

  // const handleTypeChange = async (typeId) => {
  //   setSelectedType(typeId);
    
  //   if (typeId) {
  //     try {
  //       const data = await getTagnumberByTypeUnit(typeId, unitId);
  //       setTagnumbers(data?.data || []);
  //     } catch (error) {
  //       console.error("Error fetching tag numbers:", error);
  //       setTagnumbers([]);
  //     }
  //   } else {
  //     const tagData = await getTagnumber();
  //     setTagnumbers(tagData?.data || []);
  //   }
  // };

  const handleAddSkhp = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('tag_number_id', tagnumberId);
      formData.append('no_skhp', e.target.no_skhp.value);
      formData.append('file_skhp', e.target.file_skhp.files[0]);
      formData.append('issue_date', e.target.issue_date.value);
      formData.append('overdue_date', e.target.overdue_date.value);

      const res = await addSkhp(formData);
      if (res.success) {
        Swal.fire("Berhasil!", "SKHP berhasil ditambahkan!", "success");
        navigate('/skhp');
      } else {
        setValidation(res.response?.data.errors || []);
        Swal.fire("Gagal!", "SKHP gagal ditambahkan!", "error");
      }
    } catch (error) {
      console.error("Error adding SKHP:", error);
      setValidation(error.response?.data.errors || []);
      Swal.fire("Error!", "Terjadi kesalahan saat menambahkan SKHP!", "error");
    } finally {
      setIsSubmitting(false);
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
            <Link className='hover:underline text-emerald-950' to='/skhp'>
              SKHP
            </Link>
            <Typography className='text-lime-500'>Tambah SKHP</Typography>
          </Breadcrumbs>
          <div>
            <form
              method='post'
              encType='multipart/form-data'
              onSubmit={(e) => handleAddSkhp(e)}
            >
              <div className='flex flex-col space-y-2'>
                {/* <div className='flex flex-row space-x-2'>
                  <div className='w-full'>
                    <label htmlFor='unit' className='text-emerald-950'>
                      Unit
                    </label>
                    <select
                      name='unit_id'
                      id='unit'
                      className='w-full px-1 py-2 border border-gray-300 rounded-md'
                      value={selectedUnit}
                      onChange={(e) => {
                        setSelectedUnit(e.target.value);
                        setSelectedType('');
                        setTagnumbers([]);
                        setUnitId(
                          e.target.options[e.target.selectedIndex].getAttribute(
                            'unit'
                          )
                        );
                      }} // Panggil fungsi saat unit berubah
                      
                    >
                      <option value=''>Pilih Unit</option>
                      {unitList.map((unit) => (
                        <option key={unit.id} value={unit.id} unit={unit.unit_id}>
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
                  </div>
                </div> */}
                <div className='flex flex-row space-x-2'>
                  {/* <div className='w-full'>
                    <label htmlFor='type' className='text-emerald-950'>
                      Tipe
                    </label>
                    <Autocomplete
                      id="type"
                      value={filteredTypes.find((type) => type.id === selectedType) || null}
                      onChange={(event, newValue) => handleTypeChange(newValue ? newValue.id : '')}
                      options={filteredTypes}
                      getOptionLabel={(option) => option.type_name || ''}
                      isOptionEqualToValue={(option, value) => option.id === value.id}
                      noOptionsText={'Tidak ada Tipe'}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          name="type_id" // Tambahkan name di sini
                          placeholder={'Pilih Tipe'}
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
                    />
                  </div> */}
                  <div className='w-full'>
                    <label htmlFor='tag_number' className='text-emerald-950'>
                      Tag Number <sup className='text-red-500'>*</sup>
                    </label>
                    <Autocomplete 
                      id="tag_number"
                      options={Tagnumbers}
                      getOptionLabel={(option) => option.tag_number} // Tampilkan tag_number
                      isOptionEqualToValue={(option, value) => option.id === value} // Bandingkan ID langsung
                      onChange={(event, newValue) => {
                        const selectedId = newValue ? newValue.id : '';
                        setTagnumberId(selectedId);
                      }}
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
                    />
                  </div>
                </div>
                <div className='flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2'>
                  <div className='w-full'>
                    <label className='text-emerald-950'>
                      No Skhp <sup className='text-red-500'>*</sup>{' '}
                    </label>
                    <input
                      type='text'
                      name='no_skhp'
                      id='no_skhp'
                      placeholder='No Skhp'
                      className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-950'
                      required
                    />
                    {validation.no_skhp && (
                      validation.no_skhp.map((item, index) => (
                        <div key={index}>
                          <small className="text-red-600 text-sm">{item}</small>
                        </div>
                      ))
                    )}
                  </div>
                  <div className='w-full'>
                    <label
                      className='text-emerald-950'
                      htmlFor='file_skhp'
                    >
                      Dokumen SKHP <sup className='text-red-500'>*</sup>
                    </label>
                    <input
                      type='file'
                      name='file_skhp'
                      id='file_skhp'
                      className='w-full px-3 py-2 md:pt-2 md:pb-1 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-950'
                      required
                    />
                    {validation.file_skhp && (
                      validation.file_skhp.map((item, index) => (
                        <div key={index}>
                          <small className="text-red-600 text-sm">{item}</small>
                        </div>
                      ))
                    )}
                  </div>
                </div>
                <div className='flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2'>
                  <div className='flex flex-row space-x-2 w-full md:w-2/3'>
                    <div className='w-full'>
                      <label className='text-emerald-950'>
                        Issue Date <sup className='text-red-500'>*</sup>
                      </label>
                      <input
                        type='date'
                        name='issue_date'
                        id='issue_date'
                        className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-950'
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
                        Due Date <sup className='text-red-500'>*</sup>
                      </label>
                      <input
                        type='date'
                        name='overdue_date'
                        id='due_date'
                        className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-950'
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
                  whileTap={{ scale: 0.97 }}
                  whileHover={{ scale: 0.99 }}
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
                  onClick={() => navigate('/skhp')}
                >
                  Batal
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddSkhp;
