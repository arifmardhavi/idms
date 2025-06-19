import Header from '../Header';
import { Breadcrumbs, Typography } from '@mui/material';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { IconChevronRight } from '@tabler/icons-react';
import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import * as motion from 'motion/react-client';
import { updateContract, getContractById } from '../../services/contract.service';
import { api_public } from "../../services/config";

const EditContract = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [contract, setContract] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validation, setValidation] = useState([]);
  const [contractPrice, setContractPrice] = useState('');
  const [isLoading, setLoading] = useState(true);
  const base_public_url = api_public;
  const [IsKOM, setIsKOM] = useState(false);
  const [kom, setKom] = useState(true);

  useEffect(() => {
    fetchContract();
  }, [id]);
  
  const fetchContract = async () => {
    try {
      setLoading(true);
      const data = await getContractById(id);
      setContract(data.data);
      setIsKOM(data.data.kom == 1 ? true : false);
      setKom(data.data.contract_type != 3);
  
      const formattedPrice = formatNumber(data.data.initial_contract_price);
      setContractPrice(formattedPrice);
  
    //   console.log(formattedPrice);
    } catch (error) {
      console.error("Error fetching contract:", error);
    } finally {
      setLoading(false);
    }
  };
  
  const formatNumber = (value) => {
    const numeric = String(value).replace(/[^\d]/g, ''); // pastikan string
    return numeric.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };
  
  const handleInputChange = (e) => {
    const value = e.target.value;
    const formatted = formatNumber(value);
    setContractPrice(formatted);
  };
  

  const handleupdateContract = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
    const rawContractPrice = contractPrice.replace(/,/g, '');
    const formData = new FormData(e.target);
    formData.append('initial_contract_price', rawContractPrice);
    if(!kom) {
      formData.append('contract_price', rawContractPrice);
    }

    if (kom) {
        formData.append('contract_date', e.target.contract_date.value);
        formData.append('kom', e.target.kom.value);
      }
      if (IsKOM || !kom) {
        formData.append('contract_start_date', e.target.contract_start_date.value);
        formData.append('contract_end_date', e.target.contract_end_date.value);
      }
      if (IsKOM && e.target.meeting_notes.files[0] != null ) {
        formData.append('meeting_notes', e.target.meeting_notes.files[0]);
      }

    console.log(formData);

      const res = await updateContract(id, formData);
      if (res.success) {
        Swal.fire("Berhasil!", "success update contract!", "success");
        navigate('/contract');
      } else {
        setValidation(res.response?.data.errors || []);
        Swal.fire("Error!", "failed update contract!", "error");
      }
    } catch (error) {
      console.error("Error updating Contract:", error);
      setValidation(error.response?.data.errors || []);
      Swal.fire("Error!", "something went wrong update contract!", "error");
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
            <Link className='hover:underline text-emerald-950' to='/contract'>
              Contract
            </Link>
            <Typography className='text-lime-500'>update Contract</Typography>
          </Breadcrumbs>
          <div>
          {isLoading ? <div>Loading...</div> : (<form
              method='post'
              encType='multipart/form-data'
              onSubmit={(e) => handleupdateContract(e)}
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
                      defaultValue={contract.no_vendor}
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
                      defaultValue={contract.vendor_name}
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
                      No Contract <sup className='text-red-500'>*</sup>{' '}
                    </label>
                    <input
                      type='text'
                      name='no_contract'
                      id='no_contract'
                      placeholder='No Contract'
                      className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-950'
                      defaultValue={contract.no_contract}
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
                      Contract Name <sup className='text-red-500'>*</sup>{' '}
                    </label>
                    <input
                      type='text'
                      name='contract_name'
                      id='contract_name'
                      placeholder='Contract Name'
                      className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-950'
                      defaultValue={contract.contract_name}
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
                          defaultValue={contract.pengawas}
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
                          defaultValue={contract.contract_type}
                          onChange={(e) => {
                            const selectedValue = e.target.value;
                            setKom(selectedValue !== '3');
                            setIsKOM(false);
                          }}
                      >
                          <option value="1">Lumpsum</option>
                          <option value="2">Unit Price</option>
                          <option value="3">PO Material</option>
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
                      defaultValue={contract.contract_date}
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
                        name='initial_contract_price'
                        id='initial_contract_price'
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
                        Kontrak Mulai
                      </label>
                      <input
                        type='date'
                        name='contract_start_date'
                        id='contract_start_date'
                        defaultValue={contract.contract_start_date}
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
                        defaultValue={contract.contract_end_date}
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
                      
                    />
                    {validation.contract_file && (
                      validation.contract_file.map((item, index) => (
                        <div key={index}>
                          <small className="text-red-600 text-sm">{item}</small>
                        </div>
                      ))
                    )}

                    <div className='flex flex-row justify-between items-center w-full border bg-lime-400 rounded p-1'>
                        {contract.contract_file ? (
                        <>
                            <Link
                            to={`${base_public_url}contract/${contract.contract_file}`}
                            target='_blank'
                            className='text-emerald-950 hover:underline cursor-pointer'
                            >
                            {contract.contract_file}
                            </Link>
                        </>
                        ) : (
                        <span>-</span>
                        )}
                    </div>
                  </div>
                  
                  <div className='w-full'>
                      <label htmlFor="contract_status">Contract Status<sup className='text-red-500'>*</sup></label>
                      <select
                          className="w-full px-1 py-2 border border-gray-300 rounded-md"
                          name="contract_status"
                          id="contract_status"
                          defaultValue={contract.contract_status}
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
                  
                  {kom && <div className='w-full'>
                      <label htmlFor="kom">KOM<sup className='text-red-500'>*</sup></label>
                      <select
                          className="w-full px-1 py-2 border border-gray-300 rounded-md"
                          name="kom"
                          id="kom"
                          defaultValue={contract.kom}
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
                  </div>}
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
                            defaultValue={contract.contract_start_date}
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
                            defaultValue={contract.contract_end_date}
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
                        <div className='flex flex-row justify-between items-center w-full border bg-lime-400 rounded p-1'>
                          {contract.meeting_notes ? (
                          <>
                              <Link
                              to={`${base_public_url}contract/meeting_notes/${contract.meeting_notes}`}
                              target='_blank'
                              className='text-emerald-950 hover:underline cursor-pointer'
                              >
                              {contract.meeting_notes}
                              </Link>
                          </>
                          ) : (
                          <span>-</span>
                          )}
                      </div>
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
            </form> )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditContract;
