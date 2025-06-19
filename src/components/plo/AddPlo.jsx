import Header from '../Header';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { Breadcrumbs, Typography } from '@mui/material';
import { IconChevronRight } from '@tabler/icons-react';
import { useState, useEffect } from 'react';
import { addPlo } from '../../services/plo.service';
import { ActiveUnit } from '../../services/unit.service';
import Swal from 'sweetalert2';
import { IconArrowLeft } from '@tabler/icons-react';
import { IconArrowRight } from '@tabler/icons-react';
import * as motion from 'motion/react-client';

const AddPlo = () => {
  const navigate = useNavigate();
  const [IsRLA, setIsRLA] = useState(false);
  const [IsUnit, setIsUnit] = useState([]);
  const [selectedUnit, setSelectedUnit] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validation, setValidation] = useState([]);
  const [hide, setHide] = useState(false);

  useEffect(() => {
    fetchUnits();
  }, []);

  const fetchUnits = async () => {
    try {
      const data = await ActiveUnit();
      setIsUnit(data.data);
    } catch (error) {
      console.error("Error fetching units:", error);
    }
  };

  const handleAddPlo = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('unit_id', e.target.unit_id.value);
      formData.append('no_certificate', e.target.no_certificate.value);
      formData.append('plo_certificate', e.target.plo_certificate.files[0]);
      formData.append('issue_date', e.target.issue_date.value);
      formData.append('overdue_date', e.target.overdue_date.value);
      formData.append('rla', e.target.rla.value);

      if (IsRLA) {
        formData.append('rla_issue', e.target.rla_issue.value);
        formData.append('rla_overdue', e.target.rla_overdue.value);
        formData.append('rla_certificate', e.target.rla_certificate.files[0]);
      }

      const res = await addPlo(formData);
      if (res.success) {
        Swal.fire("Berhasil!", "PLO berhasil ditambahkan!", "success");
        navigate('/plo');
      } else {
        console.log(res.response.data.errors);
        setValidation(res.response?.data.errors || []);
        Swal.fire("Gagal!", "PLO gagal ditambahkan!", "error");
      }
    } catch (error) {
      console.error("Error adding PLO:", error);
      console.log(error.response.data.errors);
      setValidation(error.response?.data.errors || []);
      Swal.fire("Error!", "Terjadi kesalahan saat menambahkan PLO!", "error");
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
            <Link
              className='hover:underline text-emerald-950'
              to='/'
              onClick={() => localStorage.setItem('active', 'Home')}
            >
              Home
            </Link>
            <Link className='hover:underline text-emerald-950' to='/plo'>
              PLO
            </Link>
            <Typography className='text-lime-500'>Tambah PLO</Typography>
          </Breadcrumbs>
          <div>
            <form
              method='post'
              encType='multipart/form-data'
              onSubmit={(e) => handleAddPlo(e)}
            >
              <div className='flex flex-col space-y-2'>
                <div className='flex flex-row space-x-2'>
                  <div className='w-full'>
                    <label htmlFor='unit' className='text-emerald-950'>
                      Unit <sup className='text-red-500'>*</sup>
                    </label>
                    <select
                      name='unit_id'
                      id='unit'
                      className='w-full px-1 py-2 border border-gray-300 rounded-md'
                      value={selectedUnit}
                      onChange={(e) => setSelectedUnit(e.target.value)} // Panggil fungsi saat unit berubah
                      required
                    >
                      <option value=''>Pilih Unit</option>
                      {IsUnit.map((unit) => (
                        <option key={unit.id} value={unit.id}>
                          {unit.unit_name}
                        </option>
                      ))}
                    </select>
                  </div>
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
                </div>
                <div className='flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2'>
                  <div className='flex flex-row space-x-2 w-full'>
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
                        Inspection Due Date <sup className='text-red-500'>*</sup>
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
                <div className='flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2'>
                  <div className='w-full'>
                    <label className='text-emerald-950'>
                      PLO Certificate <sup className='text-red-500'>*</sup>
                    </label>
                    <input
                      type='file'
                      name='plo_certificate'
                      id='plo_certificate'
                      className='w-full px-3 py-2 md:pt-2 md:pb-1 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-950'
                      required
                    />
                    {validation.plo_certificate && (
                      validation.plo_certificate.map((item, index) => (
                        <div key={index}>
                          <small className="text-red-600 text-sm">{item}</small>
                        </div>
                      ))
                    )}
                  </div>
                  <div className='w-full'>
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
                          RLA Issue Date
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
                          RLA Due Date
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
                      <label className='text-emerald-950'>
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
                    onClick={() => navigate('/plo')}
                  >
                    Batal
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddPlo;
