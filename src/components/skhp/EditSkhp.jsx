import { useState, useEffect } from 'react';
import Header from '../Header';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Breadcrumbs, Typography } from '@mui/material';
import { IconChevronRight, IconX } from '@tabler/icons-react';
import Swal from 'sweetalert2';
import {
  getSkhpById,
  updateSkhp,
  deleteSkhpFile,
} from '../../services/skhp.service';

import { getPlo } from '../../services/plo.service';
import { getCategory } from '../../services/category.service';
import { getTypeByCategory } from '../../services/type.service';
import {
  getTagnumberById,
  getTagnumberByTypeUnit,
} from '../../services/tagnumber.service';
import * as motion from 'motion/react-client';
const EditSkhp = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [UnitId, setUnitId] = useState('');
  const [IsPlo, setIsPlo] = useState([]);
  const [IsCategory, setIsCategory] = useState([]);
  const [selectedPlo, setSelectedPlo] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [filteredTypes, setFilteredTypes] = useState([]);
  const [selectedTagNumber, setSelectedTagNumber] = useState('');
  const [Tagnumbers, setTagnumbers] = useState([]);
  const [skhp, setSkhp] = useState({});
  const { id } = useParams();
  const navigate = useNavigate();

  // Fetch PLO and Category on mount
  useEffect(() => {
    getPlo((data) => setIsPlo(data?.data || []));
    getCategory((data) => setIsCategory(data?.data || []));
  }, []);

  // Fetch Skhp by ID
  useEffect(() => {
    setIsLoading(true);
    getSkhpById(id, (data) => {
      const skhpData = data?.data || {};
      setSkhp(skhpData);
      setSelectedTagNumber(skhpData?.tag_number_id || '');
      setUnitId(skhpData?.plo?.unit_id || '');
      setSelectedPlo(skhpData?.plo?.id || '');
      setIsLoading(false);
    });
  }, [id]);

  // Fetch Tag Number by selectedTagNumber
  useEffect(() => {
    if (!selectedTagNumber) return;

    setIsLoading(true);
    getTagnumberById(selectedTagNumber, (data) => {
      handleCategoryChange(data?.data?.type?.category_id, true);
      handleTypeChange(data?.data?.type_id, true);
      setIsLoading(false);
    });
  }, [selectedTagNumber]);

  // Handle Category Change
  const handleCategoryChange = (categoryId, force = false) => {
    setSelectedCategory(categoryId);
    setTagnumbers([]);
    if (!force) {
      setSelectedType('');
      setSelectedTagNumber('');
    }

    if (categoryId) {
      getTypeByCategory(categoryId, (data) => {
        setFilteredTypes(data?.data || []);
      });
    } else {
      setFilteredTypes([]);
    }
  };

  // Handle Type Change
  const handleTypeChange = (typeId, force = false) => {
    setSelectedType(typeId);
    if (typeId && UnitId) {
      getTagnumberByTypeUnit(typeId, UnitId, (data) => {
        if (!force) {
          setSelectedTagNumber('');
        }
        setTagnumbers(data?.data || []);
      });
    } else {
      setTagnumbers([]);
    }
  };

  // Loading and Error Handling
  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!skhp || Object.keys(skhp).length === 0) {
    return <div>Data skhp tidak ditemukan.</div>;
  }

  const handleUpdateSkhp = (e) => {
    e.preventDefault();

    const formData = new FormData();
    if (e.target.file_skhp.files[0]) {
      formData.append(
        'file_skhp',
        e.target.file_skhp.files[0] || null
      );
    }
    formData.append('plo_id', e.target.plo_id.value);
    formData.append('tag_number_id', e.target.tag_number.value);
    formData.append('no_skhp', e.target.no_skhp.value);
    formData.append('issue_date', e.target.issue_date.value);
    formData.append('overdue_date', e.target.overdue_date.value);

    updateSkhp(id, formData, (res) => {
      if (res.success) {
        Swal.fire({
          title: 'Berhasil!',
          text: 'Skhp berhasil diperbarui!',
          icon: 'success',
        });
        navigate('/skhp');
      } else {
        Swal.fire({
          title: 'Gagal!',
          text: 'skhp gagal diperbarui!',
          icon: 'error',
        });
      }
    });
  };

  const handledeleteFile = (file) => {
    Swal.fire({
      title: 'Konfirmasi Hapus',
      text: 'Apakah Anda yakin ingin menghapus file Skhp ini?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Ya, Hapus',
      cancelButtonText: 'Batal',
    }).then((result) => {
      if (result.isConfirmed) {
        // Jika pengguna mengonfirmasi
        console.log(file);
        console.log(id);
        deleteSkhpFile(id, file, (res) => {
          if (res.success) {
            Swal.fire({
              title: 'Berhasil!',
              text: 'File berhasil dihapus!',
              icon: 'success',
            });
            getSkhpById(id, (data) => {
              setSkhp(data.data);
            });
          } else {
            Swal.fire({
              title: 'Gagal!',
              text: 'File gagal dihapus!',
              icon: 'error',
            });
          }
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
            <Link className='hover:underline text-emerald-950' to='/skhp'>
              SKHP
            </Link>
            <Typography className='text-lime-500'>Edit SKHP</Typography>
          </Breadcrumbs>
          <div>
            <form
              encType='multipart/form-data'
              onSubmit={(e) => handleUpdateSkhp(e)}
            >
              <div className='flex flex-col space-y-2'>
                <div className='flex flex-row space-x-2'>
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
                      {IsPlo.map((plo) => (
                        <option key={plo.id} value={plo.id} unit={plo.unit_id}>
                          {plo.unit.unit_name}
                        </option>
                      ))}
                    </select>
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
                      Tipe
                    </label>
                    <select
                      name='type_id'
                      id='type'
                      className='w-full px-1 py-2 border border-gray-300 rounded-md'
                      value={selectedType}
                      onChange={(e) => handleTypeChange(e.target.value)}
                    >
                      <option value=''>Pilih Tipe</option>
                      {filteredTypes.length > 0 ? (
                        filteredTypes.map((type) => (
                          <option key={type.id} value={type.id}>
                            {type.type_name}
                          </option>
                        ))
                      ) : (
                        <option value='' disabled>
                          Tipe tidak ditemukan
                        </option>
                      )}
                    </select>
                  </div>
                  <div className='w-full'>
                    <label htmlFor='tag_number' className='text-emerald-950'>
                      Tag Number
                    </label>
                    <select
                      name='tag_number'
                      id='tag_number'
                      className='w-full px-1 py-2 border border-gray-300 rounded-md'
                      value={selectedTagNumber}
                      onChange={(e) => setSelectedTagNumber(e.target.value)}
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
                          Tag Number tidak ditemukan
                        </option>
                      )}
                    </select>
                  </div>
                </div>
                <div className='flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2'>
                  <div className='w-full'>
                    <label className='text-emerald-950'>
                      No Skhp <sup className='text-red-500'>*</sup>
                    </label>
                    <input
                      type='text'
                      name='no_skhp'
                      id='no_skhp'
                      placeholder='No Skhp'
                      className='w-full px-3 py-2 border border-gray-300 rounded-lg'
                      defaultValue={skhp.no_skhp}
                      required
                    />
                  </div>
                </div>
                <div className='flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2'>
                  <div className='w-full'>
                    <div className='mb-2'>
                      <label className='text-emerald-950'>
                        Dokumen Skhp
                      </label>
                      <input
                        type='file'
                        name='file_skhp'
                        id='file_skhp'
                        className='w-full px-3 py-2 border border-gray-300 rounded-lg'
                      />
                    </div>
                    <div className='flex flex-row justify-between items-center w-full border bg-lime-400 rounded p-1'>
                      {skhp.file_skhp ? (
                        <>
                          <Link
                            to={`http://ptmksmvmidmsru7.pertamina.com:4444/skhp/${skhp.file_skhp}`}
                            target='_blank'
                            className='text-emerald-950 hover:underline cursor-pointer'
                          >
                            {skhp.file_skhp}
                          </Link>
                          <IconX
                            onClick={() =>
                              handledeleteFile({
                                file_skhp: skhp.file_skhp,
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
                        Dokumen Skhp Lama
                      </label>
                      {/* <input
                        type='file'
                        name='file_old_skhp'
                        id='file_old_skhp'
                        className='w-full px-3 py-2 border border-gray-300 rounded-lg'
                      /> */}
                    </div>
                    <div className='flex flex-row justify-between items-center w-full border bg-lime-400 rounded p-1'>
                      {skhp.file_old_skhp ? (
                        <>
                          <Link
                            to={`http://ptmksmvmidmsru7.pertamina.com:4444/skhp/${skhp.file_old_skhp}`}
                            target='_blank'
                            className='text-emerald-950 hover:underline cursor-pointer'
                          >
                            {skhp.file_old_skhp}
                          </Link>
                          <IconX
                            onClick={() =>
                              handledeleteFile({
                                file_old_skhp: skhp.file_old_skhp,
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
                        defaultValue={skhp.issue_date}
                        required
                      />
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
                        defaultValue={skhp.overdue_date}
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className='w-full flex flex-row space-x-2 py-2'>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  whileHover={{ scale: 0.98 }}
                  className='w-full bg-emerald-950 text-white py-2 rounded-md uppercase'
                  type='submit'
                >
                  Submit
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

export default EditSkhp;
