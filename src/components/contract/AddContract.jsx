import Header from '../Header';
import { Breadcrumbs, Typography } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { IconArticle, IconChevronRight } from '@tabler/icons-react';
import { useState } from 'react';
import Swal from 'sweetalert2';
import * as motion from 'motion/react-client';
import { addContract } from '../../services/contract.service';
import { useEffect } from 'react';
import { useLocation } from "react-router-dom";

const AddContract = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validation, setValidation] = useState([]);
  const [contractPrice, setContractPrice] = useState('');
  const [IsKOM, setIsKOM] = useState(false);
  const [kom, setKom] = useState(true);
  const [hide, setHide] = useState(false);

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const typeParams = searchParams.get('type');
  console.log('params :',typeParams);

  useEffect(() => {
    typeParams === '3' ? setKom(false) : setKom(true);
  }, []);
  

  useEffect(() => {
    console.log("kom berubah jadi:", kom);
  }, [kom]);


  const formatNumber = (value) => {
    const numeric = value.replace(/[^\d]/g, ''); // hapus non-digit
    return numeric.replace(/\B(?=(\d{3})+(?!\d))/g, ','); // tambah koma ribuan
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    const formatted = formatNumber(value);
    setContractPrice(formatted);
  };

  const handleAddContract = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
    const rawContractPrice = contractPrice.replace(/,/g, '');
      const formData = new FormData();
      formData.append('no_vendor', e.target.no_vendor.value);
      formData.append('vendor_name', e.target.vendor_name.value);
      formData.append('no_contract', e.target.no_contract.value);
      formData.append('contract_name', e.target.contract_name.value);
      formData.append('contract_type', e.target.contract_type.value);
      formData.append('contract_price', rawContractPrice);
      formData.append('contract_file', e.target.contract_file.files[0]);
      if (kom) {
        formData.append('contract_date', e.target.contract_date.value);
        formData.append('kom', e.target.kom.value);
      }
      if (IsKOM || !kom) {
        formData.append('contract_start_date', e.target.contract_start_date.value);
        formData.append('contract_end_date', e.target.contract_end_date.value);
      }
      if (IsKOM) {
        formData.append('meeting_notes', e.target.meeting_notes.files[0]);
      }
      formData.append('pengawas', e.target.pengawas.value);
      formData.append('contract_status', e.target.contract_status.value);

      const res = await addContract(formData);
      if (res.success) {
        Swal.fire("Berhasil!", "success add contract!", "success");
        navigate('/contract');
      } else {
        setValidation(res.response?.data.errors || []);
        Swal.fire("Error!", "failed add contract!", "error");
      }
    } catch (error) {
      console.error("Error adding Contract:", error);
      setValidation(error.response?.data.errors || []);
      Swal.fire("Error!", "something went wrong add contract!", "error");
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
            <Link className='hover:underline text-emerald-950' to='/contract'>
              Contract
            </Link>
            <Typography className='text-lime-500'>Add Contract</Typography>
          </Breadcrumbs>
          <div>
            <form
              method='post'
              encType='multipart/form-data'
              onSubmit={(e) => handleAddContract(e)}
            >
              <div className='flex flex-col space-y-2'>
                <div className='flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2'>
                  <div className='w-full'>
                    <label className='text-emerald-950'>
                      No Vendor <sup className='text-red-500'>*</sup>{' '}
                    </label>
                    <input
                      type='text'
                      name='no_vendor'
                      id='no_vendor'
                      placeholder='No Vendor'
                      className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-950'
                      required
                    />
                    {validation.no_vendor && (
                      validation.no_vendor.map((item, index) => (
                        <div key={index}>
                          <small className="text-red-600 text-sm">{item}</small>
                        </div>
                      ))
                    )}
                  </div>
                  <div className='w-full'>
                    <label className='text-emerald-950'>
                      Vendor Name <sup className='text-red-500'>*</sup>{' '}
                    </label>
                    <input
                      type='text'
                      name='vendor_name'
                      id='vendor_name'
                      placeholder='Vendor Name'
                      className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-950'
                      required
                    />
                    {validation.vendor_name && (
                      validation.vendor_name.map((item, index) => (
                        <div key={index}>
                          <small className="text-red-600 text-sm">{item}</small>
                        </div>
                      ))
                    )}
                  </div>
                </div>
                <div className='flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2'>
                  <div className='w-full'>
                    <label className='text-emerald-950'>
                      No Contract/PO <sup className='text-red-500'>*</sup>{' '}
                    </label>
                    <input
                      type='text'
                      name='no_contract'
                      id='no_contract'
                      placeholder='No Contract'
                      className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-950'
                      required
                    />
                    {validation.no_contract && (
                      validation.no_contract.map((item, index) => (
                        <div key={index}>
                          <small className="text-red-600 text-sm">{item}</small>
                        </div>
                      ))
                    )}
                  </div>
                  <div className='w-full'>
                    <label className='text-emerald-950'>
                      Contract/PO Name <sup className='text-red-500'>*</sup>{' '}
                    </label>
                    <input
                      type='text'
                      name='contract_name'
                      id='contract_name'
                      placeholder='Contract Name'
                      className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-950'
                      required
                    />
                    {validation.contract_name && (
                      validation.contract_name.map((item, index) => (
                        <div key={index}>
                          <small className="text-red-600 text-sm">{item}</small>
                        </div>
                      ))
                    )}
                  </div>
                </div>
                <div className='flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2'>
                  <div className='w-full'>
                      <label htmlFor="pengawas">Pengawas<sup className='text-red-500'>*</sup></label>
                      <select
                          className="w-full px-1 py-2 border border-gray-300 rounded-md"
                          name="pengawas"
                          id="pengawas"
                          
                      >
                          <option value="0">Inspection</option>
                          <option value="1">Maintenance Execution</option>
                          <option value="2">Procurement</option>
                      </select>
                      {validation.pengawas && (
                          validation.pengawas.map((item, index) => (
                          <div key={index}>
                              <small className="text-red-600 text-sm">{item}</small>
                          </div>
                          ))
                      )}
                  </div>
                  <div className='w-full'>
                      <label htmlFor="contract_type">Contract Type<sup className='text-red-500'>*</sup></label>
                      <select
                          className="w-full px-1 py-2 border border-gray-300 rounded-md"
                          name="contract_type"
                          id="contract_type"
                          onChange={(e) => {
                            const selectedValue = e.target.value;
                            setKom(selectedValue !== '3');
                            setIsKOM(false);
                          }}
                      >
                          <option value="1" selected={typeParams === '1'}>Lumpsum</option>
                          <option value="2" selected={typeParams === '2'}>Unit Price</option>
                          <option value="3" selected={typeParams === '3'}>PO Material</option>

                      </select>
                      {validation.contract_type && (
                          validation.contract_type.map((item, index) => (
                          <div key={index}>
                              <small className="text-red-600 text-sm">{item}</small>
                          </div>
                          ))
                      )}
                  </div>
                </div>
                <div className='flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2'>
                  {kom && <div className='w-full'>
                    <label className='text-emerald-950'>
                      Contract Date <sup className='text-red-500'>*</sup>
                    </label>
                    <input
                      type='date'
                      name='contract_date'
                      id='contract_date'
                      className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-950'
                      required
                    />
                    {validation.contract_date && (
                      validation.contract_date.map((item, index) => (
                        <div key={index}>
                          <small className="text-red-600 text-sm">{item}</small>
                        </div>
                      ))
                    )}
                  </div>}
                  <div className='w-full'>
                    <label className='text-emerald-950'>
                      Contract Price <sup className='text-red-500'>*</sup>{' '}
                    </label>
                    <input
                        type='text'
                        name='contract_price'
                        id='contract_price'
                        placeholder='Contract Price'
                        className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-950'
                        value={contractPrice}
                        onChange={handleInputChange}
                        required
                    />
                    {validation.contract_price && (
                      validation.contract_price.map((item, index) => (
                        <div key={index}>
                          <small className="text-red-600 text-sm">{item}</small>
                        </div>
                      ))
                    )}
                  </div>
                </div>
                {!kom && <div className='flex flex-row space-x-2'>
                  <div className='w-full'>
                    <label htmlFor='contract_start_date' className='text-emerald-950'>
                      Kontrak Mulai <sup className='text-red-500'>*</sup>
                    </label>
                    <input
                      type='date'
                      name='contract_start_date'
                      id='contract_start_date'
                      className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-950'
                    />
                    {validation.contract_start_date && (
                      validation.contract_start_date.map((item, index) => (
                        <div key={index}>
                          <small className="text-red-600 text-sm">{item}</small>
                        </div>
                      ))
                    )}
                  </div>
                  <div className='w-full'>
                    <label htmlFor='contract_end_date' className='text-emerald-950'>
                      Kontrak Berakhir <sup className='text-red-500'>*</sup>
                    </label>
                    <input
                      type='date'
                      name='contract_end_date'
                      id='contract_end_date'
                      className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-950'
                    />
                    {validation.contract_end_date && (
                      validation.contract_end_date.map((item, index) => (
                        <div key={index}>
                          <small className="text-red-600 text-sm">{item}</small>
                        </div>
                      ))
                    )}
                  </div>
                </div>}
                <div className='flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2'>
                  <div className='w-full'>
                    <label className='text-emerald-950'>
                      Contract File <sup className='text-red-500'>*</sup>{' '}
                    </label>
                    <input
                      type='file'
                      name='contract_file'
                      id='contract_file'
                      placeholder='Contract File'
                      className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-950'
                      required
                    />
                    {validation.contract_file && (
                      validation.contract_file.map((item, index) => (
                        <div key={index}>
                          <small className="text-red-600 text-sm">{item}</small>
                        </div>
                      ))
                    )}
                  </div>
                  <div className='w-full'>
                      <label htmlFor="contract_status">Contract Status<sup className='text-red-500'>*</sup></label>
                      <select
                          className="w-full px-1 py-2 border border-gray-300 rounded-md"
                          name="contract_status"
                          id="contract_status"
                      >
                          <option value="1">Aktif</option>
                          <option value="0">Selesai</option>
                      </select>
                      {validation.contract_status && (
                          validation.contract_status.map((item, index) => (
                          <div key={index}>
                              <small className="text-red-600 text-sm">{item}</small>
                          </div>
                          ))
                      )}
                  </div>
                  {kom && (<div className='w-full'>
                      <label htmlFor="kom">KOM<sup className='text-red-500'>*</sup></label>
                      <select
                          className="w-full px-1 py-2 border border-gray-300 rounded-md"
                          name="kom"
                          id="kom"
                          onChange={(e) =>
                            e.target.value == 1 ? setIsKOM(true) : setIsKOM(false)
                          }
                      >
                          <option value="0">N/A</option>
                          <option value="1">Available</option>
                      </select>
                      {validation.kom && (
                          validation.kom.map((item, index) => (
                          <div key={index}>
                              <small className="text-red-600 text-sm">{item}</small>
                          </div>
                          ))
                      )}
                  </div>)}
                </div>
                
                <div>
                {IsKOM && (
                    <div className='space-y-2'>
                      <div className='flex flex-row space-x-2'>
                        <div className='w-full'>
                          <label htmlFor='contract_start_date' className='text-emerald-950'>
                            Kontrak Mulai
                          </label>
                          <input
                            type='date'
                            name='contract_start_date'
                            id='contract_start_date'
                            className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-950'
                          />
                          {validation.contract_start_date && (
                            validation.contract_start_date.map((item, index) => (
                              <div key={index}>
                                <small className="text-red-600 text-sm">{item}</small>
                              </div>
                            ))
                          )}
                        </div>
                        <div className='w-full'>
                          <label htmlFor='contract_end_date' className='text-emerald-950'>
                            Kontrak Berakhir
                          </label>
                          <input
                            type='date'
                            name='contract_end_date'
                            id='contract_end_date'
                            className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-950'
                          />
                          {validation.contract_end_date && (
                            validation.contract_end_date.map((item, index) => (
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
                          htmlFor='meeting_notes'
                        >
                          Notulensi KOM
                        </label>
                        <input
                          type='file'
                          name='meeting_notes'
                          id='meeting_notes'
                          className='w-full px-3 py-2 md:pt-2 md:pb-1 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-950'
                        />
                        {validation.meeting_notes && (
                          validation.meeting_notes.map((item, index) => (
                            <div key={index}>
                              <small className="text-red-600 text-sm">{item}</small>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
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
                  onClick={() => navigate('/contract')}
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

export default AddContract;
