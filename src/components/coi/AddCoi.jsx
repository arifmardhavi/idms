import React from 'react';
import Header from '../Header';
import { Breadcrumbs, Typography } from '@mui/material';
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
  const [UnitId, setUnitId] = useState('');
  const [IsPlo, setIsPlo] = useState([]);
  const [IsCategory, setIsCategory] = useState([]);
  const [selectedPlo, setSelectedPlo] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [filteredTypes, setFilteredTypes] = useState([]);
  const [selectedType, setSelectedType] = useState('');
  const [Tagnumbers, setTagnumbers] = useState([]);

  useEffect(() => {
    getPlo((data) => {
      setIsPlo(data.data);
    });

    getCategory((data) => {
      setIsCategory(data.data);
    });
  }, []);

  // handle onChange input category by unit
  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId); // Simpan kategori yang dipilih
    setSelectedType('');
    setTagnumbers([]); // Kosongkan jika ada kategori yang baru dipilih
    if (categoryId) {
      // Memanggil API untuk mendapatkan tipe berdasarkan kategori
      getTypeByCategory(categoryId, (data) => {
        if (data === null) {
          setFilteredTypes([]);
        } else {
          setFilteredTypes(data.data);
        }
      });
    } else {
      setFilteredTypes([]); // Kosongkan jika tidak ada unit dipilih
    }
  };

  // handle onChange input type by category
  const handleTypeChange = (typeId) => {
    setSelectedType(typeId); // Simpan tipe yang dipilih
    if (typeId && UnitId != '') {
      // Memanggil API untuk mendapatkan tagnumber berdasarkan tipe
      getTagnumberByTypeUnit(typeId, UnitId, (data) => {
        if (data === null) {
          setTagnumbers([]);
        } else {
          setTagnumbers(data.data);
        }
      });
    } else {
      setTagnumbers([]); // Kosongkan jika tidak ada unit dipilih
    }
  };

  const handleAddCoi = (e) => {
    e.preventDefault();

    const formData = new FormData(); // Buat instance FormData
    formData.append('plo_id', e.target.plo_id.value);
    formData.append('tag_number_id', e.target.tag_number_id.value);
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

    addCoi(formData, (res) => {
      if (res.success) {
        Swal.fire({
          title: 'Berhasil!',
          text: 'COI berhasil ditambahkan!',
          icon: 'success',
        });
        // Redirect to COI page
        navigate('/coi');
      } else {
        Swal.fire({
          title: 'Gagal!',
          text: 'COI gagal ditambahkan!',
          icon: 'error',
        });
      }
    });
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
                        setTagnumbers([]);
                        setUnitId(
                          e.target.options[e.target.selectedIndex].getAttribute(
                            'unit'
                          )
                        );
                      }} // Panggil fungsi saat unit berubah
                      required
                    >
                      <option value=''>Pilih Plo</option>
                      {IsPlo.map((plo) => (
                        <option key={plo.id} value={plo.id} unit={plo.unit_id}>
                          {plo.unit.unit_name}
                        </option>
                      ))}
                    </select>
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
                      {IsCategory.length > 0 ? (
                        IsCategory.map((category) => (
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
                </div>
                <div className='flex flex-row space-x-2'>
                  <div className='w-full'>
                    <label htmlFor='type' className='text-emerald-950'>
                      Tipe <sup className='text-red-500'>*</sup>
                    </label>
                    <select
                      name='type_id'
                      id='type'
                      className='w-full px-1 py-2 border border-gray-300 rounded-md'
                      value={selectedType}
                      onChange={(e) => handleTypeChange(e.target.value)}
                    >
                      {selectedPlo == '' ? (
                        <option value='' disabled selected>
                          Pilih Plo terlebih dahulu
                        </option>
                      ) : (
                        <option value=''>Pilih Tipe</option>
                      )}
                      {selectedPlo == '' ? (
                        ''
                      ) : filteredTypes.length > 0 ? (
                        filteredTypes.map((type) => (
                          <option key={type.id} value={type.id}>
                            {type.type_name}
                          </option>
                        ))
                      ) : (
                        <option value='' disabled>
                          Tidak ada Tipe
                        </option>
                      )}
                    </select>
                  </div>
                  <div className='w-full'>
                    <label htmlFor='tag_number' className='text-emerald-950'>
                      Tag Number <sup className='text-red-500'>*</sup>
                    </label>
                    <select
                      name='tag_number_id'
                      id='tag_number'
                      className='w-full px-1 py-2 border border-gray-300 rounded-md'
                    >
                      <option value=''>Pilih Tag Number</option>
                      {Tagnumbers.length > 0 ? (
                        Tagnumbers.map((tagnumber) => (
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
                    </div>
                  </div>
                )}
              </div>
              <div className='w-full flex flex-row space-x-2 py-2'>
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  whileHover={{ scale: 0.99 }}
                  className='w-full bg-emerald-950 text-white py-2 rounded-md uppercase'
                  type='submit'
                >
                  Submit
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
