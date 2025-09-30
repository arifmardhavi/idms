import { useState, useEffect } from 'react';
import Header from '../Header';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Autocomplete, Breadcrumbs, TextField, Typography } from '@mui/material';
import { IconChevronRight, IconX } from '@tabler/icons-react';
import Swal from 'sweetalert2';
import {
  getCoiById,
  updateCoi,
  deleteCoiFile,
} from '../../services/coi.service';

import { getPlo } from '../../services/plo.service';
import { getCategory } from '../../services/category.service';
import { getTypeByCategory } from '../../services/type.service';
import {
  getTagnumberById,
  getTagnumberByTypeUnit,
} from '../../services/tagnumber.service';
import * as motion from 'motion/react-client';
import { api_public } from '../../services/config';
import { IconArrowLeft } from '@tabler/icons-react';
import { IconArrowRight } from '@tabler/icons-react';
import { IconLoader2 } from '@tabler/icons-react';
import { handleAddActivity } from '../../utils/handleAddActivity';
const EditCoi = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [IsRLA, setIsRLA] = useState(false);
  const [IsReEng, setIsReEng] = useState(false);
  const [unitId, setUnitId] = useState('');
  const [ploList, setPloList] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [selectedPlo, setSelectedPlo] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [filteredTypes, setFilteredTypes] = useState([]);
  const [selectedTagNumber, setSelectedTagNumber] = useState('');
  const [Tagnumbers, setTagNumbers] = useState([]);
  const [coi, setCoi] = useState({});
  const [validation, setValidation] = useState([]);
  const [tagnumberId, setTagnumberId] = useState([]);
  const base_public_url = api_public;
  const [hide, setHide] = useState(false);
  
  useEffect(() => {
    fetchPlo();
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchCoiById();
  }, [id]);

  useEffect(() => {
    if (selectedTagNumber) fetchTagNumberById();
  }, [selectedTagNumber]);

  const fetchPlo = async () => {
    try {
      const data = await getPlo();
      setPloList(data?.data || []);
    } catch (error) {
      console.error("Error fetching PLO:", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await getCategory();
      setCategoryList(data?.data || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchCoiById = async () => {
    setIsLoading(true);
    try {
      const data = await getCoiById(id);
      const coiData = data?.data || {};
      setCoi(coiData);
      setIsRLA(!!coiData.rla);
      setIsReEng(!!coiData.re_engineer);
      setSelectedTagNumber(coiData?.tag_number_id || '');
      setTagnumberId(coiData?.tag_number_id || '');
      setUnitId(coiData?.plo?.unit_id || '');
      setSelectedPlo(coiData?.plo?.id || '');
    } catch (error) {
      console.error("Error fetching COI:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTagNumberById = async () => {
    setIsLoading(true);
    try {
      const data = await getTagnumberById(selectedTagNumber);
      handleCategoryChange(data?.data?.type?.category_id, true);
      handleTypeChange(data?.data?.type_id, true);
    } catch (error) {
      console.error("Error fetching tag number:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCategoryChange = async (categoryId, force = false) => {
    setSelectedCategory(categoryId);
    setTagNumbers([]);
    if (!force) {
      setSelectedType('');
      setSelectedTagNumber('');
    }
    try {
      const data = await getTypeByCategory(categoryId);
      setFilteredTypes(data?.data || []);
    } catch (error) {
      console.error("Error fetching types:", error);
      setFilteredTypes([]);
    }
  };

  const handleTypeChange = async (typeId, force = false) => {
    setSelectedType(typeId);
    if (typeId && unitId) {
      try {
        const data = await getTagnumberByTypeUnit(typeId, unitId);
        if (!force) setSelectedTagNumber('');
        setTagNumbers(data?.data || []);
      } catch (error) {
        console.error("Error fetching tag numbers:", error);
        setTagNumbers([]);
      }
    }
  };

  const handleUpdateCoi = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const formData = new FormData(e.target);
      formData.append('tag_number_id', tagnumberId ?? 0);
      const res = await updateCoi(id, formData);
      
      if (res.success) {
        Swal.fire("Berhasil!", "COI berhasil diperbarui!", "success");
        setValidation([]);
        navigate('/coi');
      } else {
        Swal.fire("Gagal!", "COI gagal diperbarui!", "error");
      }
    } catch (error) {
      console.error("Error updating COI:", error);
      setValidation(error.response?.data.errors || []);
      Swal.fire("Error!", "Terjadi kesalahan saat memperbarui COI!", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handledeleteFile = async (file) => {
    const result = await Swal.fire({
      title: 'Konfirmasi Hapus',
      text: 'Apakah Anda yakin ingin menghapus file COI ini?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Ya, Hapus',
      cancelButtonText: 'Batal',
    });
    
    if (result.isConfirmed) {
      try {
        const res = await deleteCoiFile(id, file);
        if (res.success) {
          Swal.fire("Berhasil!", "File berhasil dihapus!", "success");
          setValidation([]);
          fetchCoiById();
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
              <IconArrowLeft />
            </div>
          </div>
          <div className={` ${hide ? 'block' : 'hidden'}  w-fit bg-emerald-950 text-lime-300 p-2 cursor-pointer rounded-md`} onClick={() => setHide(false)}>
            <IconArrowRight />
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
            <Link className='hover:underline text-emerald-950' to='/coi'>
              COI
            </Link>
            <Typography className='text-lime-500'>Edit COI</Typography>
          </Breadcrumbs>
          {isLoading ?
              <div className="flex flex-col items-center justify-center h-20">
                  <IconLoader2 stroke={2} className="animate-spin rounded-full h-10 w-10 " />
              </div> 
            :(
            <div>
              <form
                encType='multipart/form-data'
                onSubmit={(e) => handleUpdateCoi(e)}
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
                  </div>
                  <div className='flex flex-row space-x-2'>
                    <div className='w-full'>
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

                    </div>
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
                        value={Tagnumbers.find((tag) => tag.id === selectedTagNumber) || null}
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
                        No Certificate <sup className='text-red-500'>*</sup>
                      </label>
                      <input
                        type='text'
                        name='no_certificate'
                        id='no_certificate'
                        placeholder='No Certificate'
                        className='w-full px-3 py-2 border border-gray-300 rounded-lg'
                        defaultValue={coi.no_certificate}
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
                  </div>
                  <div className='flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2'>
                    <div className='w-full'>
                      <div className='mb-2'>
                        <label className='text-emerald-950'>
                          COI Certificate
                        </label>
                        <input
                          type='file'
                          name='coi_certificate'
                          id='coi_certificate'
                          className='w-full px-3 py-2 border border-gray-300 rounded-lg'
                        />
                        {validation.coi_certificate && (
                          validation.coi_certificate.map((item, index) => (
                            <div key={index}>
                              <small className="text-red-600 text-sm">{item}</small>
                            </div>
                          ))
                        )}
                      </div>
                      <div className='flex flex-row justify-between items-center w-full border bg-lime-400 rounded p-1'>
                        {coi.coi_certificate ? (
                          <>
                            <Link
                              to={`${base_public_url}coi/certificates/${coi.coi_certificate}`}
                              target='_blank'
                              className='text-emerald-950 hover:underline cursor-pointer'
                              onClick={() => handleAddActivity(coi.coi_certificate, "COI")}
                            >
                              {coi.coi_certificate}
                            </Link>
                            <IconX
                              onClick={() =>
                                handledeleteFile({
                                  coi_certificate: coi.coi_certificate,
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
                          COI Old Certificate
                        </label>
                        {/* <input
                          type='file'
                          name='coi_old_certificate'
                          id='coi_old_certificate'
                          className='w-full px-3 py-2 border border-gray-300 rounded-lg'
                        /> */}
                      </div>
                      <div className='flex flex-row justify-between items-center w-full border bg-lime-400 rounded p-1'>
                        {coi.coi_old_certificate ? (
                          <>
                            <Link
                              to={`${base_public_url}coi/certificates/${coi.coi_old_certificate}`}
                              target='_blank'
                              className='text-emerald-950 hover:underline cursor-pointer'
                              onClick={() => handleAddActivity(coi.coi_old_certificate, "COI")}
                            >
                              {coi.coi_old_certificate}
                            </Link>
                            <IconX
                              onClick={() =>
                                handledeleteFile({
                                  coi_old_certificate: coi.coi_old_certificate,
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
                  <div className='flex flex-col space-y-2'>
                    <div className='flex flex-row space-x-2 w-full'>
                      <div className='w-full'>
                        <label className='text-emerald-950'>
                          Issue Date <sup className='text-red-500'>*</sup>
                        </label>
                        <input
                          type='date'
                          name='issue_date'
                          id='issue_date'
                          defaultValue={coi.issue_date}
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
                          Inspection Due Date <sup className='text-red-500'>*</sup>
                        </label>
                        <input
                          type='date'
                          name='overdue_date'
                          id='due_date'
                          defaultValue={coi.overdue_date}
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
                    <div className='flex flex-row space-x-2 w-full'>
                      <div className='w-full'>
                        <label className='text-emerald-950' htmlFor='rla'>
                          RLA
                        </label>
                        <select
                          name='rla'
                          id='rla'
                          className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-950'
                          value={IsRLA ? 1 : 0}
                          onChange={(e) => setIsRLA(e.target.value === '1')}
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
                      <div className='w-full'>
                        <label className='text-emerald-950' htmlFor='rla'>
                          Re-Engineer
                        </label>
                        <select
                          name='re_engineer'
                          id='re_engineer'
                          className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-950'
                          value={IsReEng ? 1 : 0}
                          onChange={(e) => setIsReEng(e.target.value === '1')}
                        >
                          <option value='0'>N/A</option>
                          <option value='1'>Available</option>
                        </select>
                        {validation.re_engineer && (
                          validation.re_engineer.map((item, index) => (
                            <div key={index}>
                              <small className="text-red-600 text-sm">{item}</small>
                            </div>
                          ))
                        )}
                      </div>
                      {IsReEng && (
                        <div className='w-full'>
                          <label
                            className='text-emerald-950'
                            htmlFor='re_engineer_certificate'
                          >
                            Re-Engineer Certificate <sup className='text-red-500'>*</sup>
                          </label>
                          <input
                            type='file'
                            name='re_engineer_certificate'
                            id='re_engineer_certificate'
                            className='w-full px-3 py-2 md:pt-2 md:pb-1 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-950'
                          />
                          {validation.re_engineer_certificate && (
                            validation.re_engineer_certificate.map((item, index) => (
                              <div key={index}>
                                <small className="text-red-600 text-sm">{item}</small>
                              </div>
                            ))
                          )}
                          <div className='flex flex-row justify-between items-center w-full border bg-lime-400 rounded p-1'>
                            {coi.re_engineer_certificate ? (
                              <>
                                <Link
                                  to={`${base_public_url}coi/re_engineer/${coi.re_engineer_certificate}`}
                                  target='_blank'
                                  className='text-emerald-950 hover:underline cursor-pointer'
                                  onClick={() => handleAddActivity(coi.re_engineer_certificate, "COI")}
                                >
                                  {coi.re_engineer_certificate}
                                </Link>
                                <IconX
                                  onClick={() =>
                                    handledeleteFile({
                                      re_engineer_certificate: coi.rla_certificate,
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
                      )}
                    </div>
                  </div>
                  {IsRLA && (
                    <div className='space-y-2'>
                      <div className='flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2'>
                        <div className='w-full'>
                          <label className='text-emerald-950'>
                            RLA Issue Date
                          </label>
                          <input
                            type='date'
                            name='rla_issue'
                            id='rla_issue'
                            className='w-full px-3 py-2 border border-gray-300 rounded-lg'
                            defaultValue={coi.rla_issue}
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
                          <label className='text-emerald-950'>
                            RLA Due Date
                          </label>
                          <input
                            type='date'
                            name='rla_overdue'
                            id='rla_overdue'
                            className='w-full px-3 py-2 border border-gray-300 rounded-lg'
                            defaultValue={coi.rla_overdue}
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
                      <div className='flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2'>
                        <div className='w-full'>
                          <div className='mb-2'>
                            <label className='text-emerald-950'>
                              RLA Certificate
                            </label>
                            <input
                              type='file'
                              name='rla_certificate'
                              id='rla_certificate'
                              className='w-full px-3 py-2 border border-gray-300 rounded-lg'
                            />
                            {validation.rla_certificate && (
                              validation.rla_certificate.map((item, index) => (
                                <div key={index}>
                                  <small className="text-red-600 text-sm">{item}</small>
                                </div>
                              ))
                            )}
                          </div>
                          <div className='flex flex-row justify-between items-center w-full border bg-lime-400 rounded p-1'>
                            {coi.rla_certificate ? (
                              <>
                                <Link
                                  to={`${base_public_url}coi/rla/${coi.rla_certificate}`}
                                  target='_blank'
                                  className='text-emerald-950 hover:underline cursor-pointer'
                                  onClick={() => handleAddActivity(coi.rla_certificate, "COI")}
                                >
                                  {coi.rla_certificate}
                                </Link>
                                <IconX
                                  onClick={() =>
                                    handledeleteFile({
                                      rla_certificate: coi.rla_certificate,
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
                              RLA Old Certificate
                            </label>
                            {/* <input
                              type='file'
                              name='rla_old_certificate'
                              id='rla_old_certificate'
                              className='w-full px-3 py-2 border border-gray-300 rounded-lg'
                            /> */}
                          </div>
                          <div className='flex flex-row justify-between items-center w-full border bg-lime-400 rounded p-1'>
                            {coi.rla_old_certificate ? (
                              <>
                                <Link
                                  to={`${base_public_url}coi/rla/${coi.rla_old_certificate}`}
                                  target='_blank'
                                  className='text-emerald-950 hover:underline cursor-pointer'
                                  onClick={() => handleAddActivity(coi.rla_old_certificate, "COI")}
                                >
                                  {coi.rla_old_certificate}
                                </Link>
                                <IconX
                                  onClick={() =>
                                    handledeleteFile({
                                      rla_old_certificate:
                                        coi.rla_old_certificate,
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
                    </div>
                  )}
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
                    onClick={() => navigate('/coi')}
                  >
                    Batal
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditCoi;
