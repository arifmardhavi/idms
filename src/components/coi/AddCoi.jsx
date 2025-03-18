import Header from '../Header';
import { Autocomplete, Breadcrumbs, TextField, Typography } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { IconChevronRight } from '@tabler/icons-react';
import { useState, useEffect } from 'react';
import { addCoi } from '../../services/coi.service';
import { getPlo } from '../../services/plo.service';
import { getCategory } from '../../services/category.service';
import { getTypeByCategory } from '../../services/type.service';
import { getTagnumberByTypeUnit } from '../../services/tagnumber.service';
import Swal from 'sweetalert2';
import * as motion from 'motion/react-client';

const AddCoi = () => {
  const navigate = useNavigate();
  const [IsRLA, setIsRLA] = useState(false);
  const [unitId, setUnitId] = useState('');
  const [ploList, setPloList] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [selectedPlo, setSelectedPlo] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [filteredTypes, setFilteredTypes] = useState([]);
  const [selectedType, setSelectedType] = useState('');
  const [TagNumbers, setTagNumbers] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validation, setValidation] = useState([]);
  const [tagnumberId, setTagnumberId] = useState([]);

  useEffect(() => {
    fetchPlo();
    fetchCategories();
  }, []);

  const fetchPlo = async () => {
    try {
      const data = await getPlo();
      setPloList(data.data);
    } catch (error) {
      console.error("Error fetching PLO:", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await getCategory();
      setCategoryList(data.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleCategoryChange = async (categoryId) => {
    setSelectedCategory(categoryId);
    setSelectedType('');
    setTagNumbers([]);
    
    if (categoryId) {
      try {
        const data = await getTypeByCategory(categoryId);
        setFilteredTypes(data?.data || []);
      } catch (error) {
        console.error("Error fetching types:", error);
        setFilteredTypes([]);
      }
    } else {
      setFilteredTypes([]);
    }
  };

  const handleTypeChange = async (typeId) => {
    setSelectedType(typeId);
    
    if (typeId && unitId) {
      try {
        const data = await getTagnumberByTypeUnit(typeId, unitId);
        setTagNumbers(data?.data || []);
      } catch (error) {
        console.error("Error fetching tag numbers:", error);
        setTagNumbers([]);
      }
    } else {
      setTagNumbers([]);
    }
  };

  const handleAddCoi = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('plo_id', e.target.plo_id.value);
      formData.append('tag_number_id', tagnumberId ?? 0);
      formData.append('no_certificate', e.target.no_certificate.value);
      formData.append('coi_certificate', e.target.coi_certificate.files[0]);
      formData.append('issue_date', e.target.issue_date.value);
      formData.append('overdue_date', e.target.overdue_date.value);
      formData.append('rla', e.target.rla.value);

      if (IsRLA) {
        formData.append('rla_issue', e.target.rla_issue.value);
        formData.append('rla_overdue', e.target.rla_overdue.value);
        formData.append('rla_certificate', e.target.rla_certificate.files[0]);
      }

      const res = await addCoi(formData);
      if (res.success) {
        Swal.fire("Berhasil!", "COI berhasil ditambahkan!", "success");
        navigate('/coi');
      } else {
        setValidation(res.response?.data.errors || []);
        Swal.fire("Gagal!", "COI gagal ditambahkan!", "error");
      }
    } catch (error) {
      console.error("Error adding COI:", error);
      setValidation(error.response?.data.errors || []);
      Swal.fire("Error!", "Terjadi kesalahan saat menambahkan COI!", "error");
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <div className='flex flex-col md:flex-row w-full'>
      <Header />
      <div className='flex flex-col md:pl-64 w-full px-2 py-4 space-y-3'>
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
            <Link className='hover:underline text-emerald-950' to='/coi'>
              COI
            </Link>
            <Typography className='text-lime-500'>Tambah COI</Typography>
          </Breadcrumbs>
          <div>
            <form
              method='post'
              encType='multipart/form-data'
              onSubmit={(e) => handleAddCoi(e)}
            >
              <div className='flex flex-col space-y-2'>
                <div className='flex flex-row space-x-2'>
                  <div className='w-full'>
                    <label htmlFor='plo' className='text-emerald-950'>
                      Plo <sup className='text-red-500'>*</sup>
                    </label>
                    <select
                      name='plo_id'
                      id='plo'
                      className='w-full px-1 py-2 border border-gray-300 rounded-md'
                      value={selectedPlo}
                      onChange={(e) => {
                        setSelectedPlo(e.target.value);
                        setSelectedType('');
                        setTagNumbers([]);
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
                      Kategori <sup className='text-red-500'>*</sup>
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
                </div>
                <div className='flex flex-row space-x-2'>
                  <div className='w-full'>
                    <label htmlFor='type' className='text-emerald-950'>
                      Tipe <sup className='text-red-500'>*</sup>
                    </label>
                    <Autocomplete
                      id="type"
                      value={filteredTypes.find((type) => type.id === selectedType) || null}
                      onChange={(event, newValue) => handleTypeChange(newValue ? newValue.id : '')}
                      options={selectedPlo === '' ? [] : filteredTypes}
                      getOptionLabel={(option) => option.type_name || ''}
                      isOptionEqualToValue={(option, value) => option.id === value.id}
                      noOptionsText={selectedPlo === '' ? 'Pilih Plo terlebih dahulu' : 'Tidak ada Tipe'}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          name="type_id" // Tambahkan name di sini
                          placeholder={selectedPlo === '' ? 'Pilih Plo terlebih dahulu' : 'Pilih Tipe'}
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
                  </div>
                  <div className='w-full'>
                    <label htmlFor='tag_number' className='text-emerald-950'>
                      Tag Number <sup className='text-red-500'>*</sup>
                    </label>
                    <Autocomplete 
                      id="tag_number"
                      options={TagNumbers}
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

                    {/* <select
                      name='tag_number_id'
                      id='tag_number'
                      className='w-full px-1 py-2 border border-gray-300 rounded-md'
                    >
                      <option value=''>Pilih Tag Number</option>
                      {TagNumbers.length > 0 ? (
                        TagNumbers.map((tagnumber) => (
                          <option key={tagnumber.id} value={tagnumber.id}>
                            {tagnumber.tag_number}
                          </option>
                        ))
                      ) : (
                        <option value='' disabled>
                          Tidak ada Tag Number
                        </option>
                      )}
                    </select>
                    {validation.tag_number_id && (
                      validation.tag_number_id.map((item, index) => (
                        <div key={index}>
                          <small className="text-red-600 text-sm">{item}</small>
                        </div>
                      ))
                    )} */}
                  </div>
                </div>
                <div className='flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2'>
                  <div className='w-full'>
                    <label className='text-emerald-950'>
                      No Certificate <sup className='text-red-500'>*</sup>{' '}
                    </label>
                    <input
                      type='text'
                      name='no_certificate'
                      id='no_certificate'
                      placeholder='No Certificate'
                      className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-950'
                      required
                    />
                    {validation.no_certificate && (
                      validation.no_certificate.map((item, index) => (
                        <div key={index}>
                          <small className="text-red-600 text-sm">{item}</small>
                        </div>
                      ))
                    )}
                  </div>
                  <div className='w-full'>
                    <label
                      className='text-emerald-950'
                      htmlFor='coi_certificate'
                    >
                      COI Certificate <sup className='text-red-500'>*</sup>
                    </label>
                    <input
                      type='file'
                      name='coi_certificate'
                      id='coi_certificate'
                      className='w-full px-3 py-2 md:pt-2 md:pb-1 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-950'
                      required
                    />
                    {validation.coi_certificate && (
                      validation.coi_certificate.map((item, index) => (
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
                  <div className='w-full md:w-1/3'>
                    <label className='text-emerald-950' htmlFor='rla'>
                      RLA
                    </label>
                    <select
                      name='rla'
                      id='rla'
                      className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-950'
                      onChange={(e) =>
                        e.target.value == 1 ? setIsRLA(true) : setIsRLA(false)
                      }
                    >
                      <option value='0'>N/A</option>
                      <option value='1'>Available</option>
                    </select>
                    {validation.rla && (
                      validation.rla.map((item, index) => (
                        <div key={index}>
                          <small className="text-red-600 text-sm">{item}</small>
                        </div>
                      ))
                    )}
                  </div>
                </div>
                {IsRLA && (
                  <div className='space-y-2'>
                    <div className='flex flex-row space-x-2'>
                      <div className='w-full'>
                        <label htmlFor='rla_issue' className='text-emerald-950'>
                          RLA Issue
                        </label>
                        <input
                          type='date'
                          name='rla_issue'
                          id='rla_issue'
                          className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-950'
                        />
                        {validation.rla_issue && (
                          validation.rla_issue.map((item, index) => (
                            <div key={index}>
                              <small className="text-red-600 text-sm">{item}</small>
                            </div>
                          ))
                        )}
                      </div>
                      <div className='w-full'>
                        <label htmlFor='rla_due' className='text-emerald-950'>
                          RLA Due
                        </label>
                        <input
                          type='date'
                          name='rla_overdue'
                          id='rla_due'
                          className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-950'
                        />
                        {validation.rla_overdue && (
                          validation.rla_overdue.map((item, index) => (
                            <div key={index}>
                              <small className="text-red-600 text-sm">{item}</small>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                    <div className='w-full'>
                      <label
                        className='text-emerald-950'
                        htmlFor='rla_certificate'
                      >
                        RLA Certificate
                      </label>
                      <input
                        type='file'
                        name='rla_certificate'
                        id='rla_certificate'
                        className='w-full px-3 py-2 md:pt-2 md:pb-1 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-950'
                      />
                      {validation.rla_certificate && (
                        validation.rla_certificate.map((item, index) => (
                          <div key={index}>
                            <small className="text-red-600 text-sm">{item}</small>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
              <div className='w-full flex flex-row space-x-2 py-2'>
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  whileHover={{ scale: 0.99 }}
                  type='submit'
                  className={`w-full px-4 py-2 rounded-lg ${
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
                  onClick={() => navigate('/coi')}
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

export default AddCoi;
