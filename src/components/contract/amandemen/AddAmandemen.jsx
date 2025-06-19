import { Link, useNavigate, useParams } from "react-router-dom";
import Header from "../../Header";
import { Breadcrumbs, Typography } from "@mui/material";
import { IconChevronRight } from "@tabler/icons-react";
import { useState } from "react";
import * as motion from 'motion/react-client';
import { getContractById } from "../../../services/contract.service";
import { useEffect } from "react";
import Swal from "sweetalert2";
import { IconLoader2 } from "@tabler/icons-react";
import { addAmandemen } from "../../../services/amandemen.service";
import { IconArrowRight } from "@tabler/icons-react";
import { IconArrowLeft } from "@tabler/icons-react";

const AddAmandemen = () => {
    const { id } = useParams();
    const [openNilai, setOpenNilai] = useState(false);
    const [openWaktu, setOpenWaktu] = useState(false);
    const [openDenda, setOpenDenda] = useState(false);
    const [openDokumen, setOpenDokumen] = useState(false);
    const [validation, setValidation] = useState({})
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [loading, setLoading] = useState(false);
    const [contract, setContract] = useState({});
    const navigate = useNavigate();
    const [hide, setHide] = useState(false);

    useEffect(() => {
        fetchContract();
    }, [id]);

    const fetchContract = async () => {
        try {
          setLoading(true);
          const data = await getContractById(id);
          setContract(data.data);
        } catch (error) {
          console.error("Error fetching contract:", error);
        } finally {
          setLoading(false);
        }
    };

    const handleAddAmandemen = async (e) => {
      e.preventDefault();
      setIsSubmitting(true);
      const formData = new FormData(e.target);
      formData.append('contract_id', id);
      try {
        const res = await addAmandemen(formData);
        if (res.success) {
          Swal.fire("Berhasil!", "sukses menambahkan amandemen!", "success");
          navigate(`/contract/dashboard/${id}`);
        } else {
          setValidation(res.response?.data.errors || []);
          Swal.fire("Error!", "failed add amandemen!", "error");
        }
      } catch (error) {
        console.error("Error adding amandemen:", error);
        setValidation(error.response?.data.errors || []);
      } finally {
        setIsSubmitting(false);
      }
    }

    const handleDokumen = (value) => {
      const price = contract.contract_price;
      const inputValue = parseFloat(value);

      // Kalau input belum valid, sembunyikan input file
      if (isNaN(inputValue)) {
        setOpenDokumen(false);
        return;
      }

      const kelebihan = inputValue - price;

      if (kelebihan >= price * 0.1) {
        setOpenDokumen(true);
      } else {
        setOpenDokumen(false);
      }
    }









    
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
            <Breadcrumbs
                aria-label='breadcrumb'
                className="uppercase text-xs"
                separator={
                <IconChevronRight className='text-emerald-950' stroke={2} />
                }
            >
                <Link className='hover:underline text-emerald-950' to='/contract'>
                Contract
                </Link>
                <Link className='hover:underline text-emerald-950' to={`/contract/dashboard/${id}`}>
                Dashboard Contract
                </Link>
                <Typography className='text-lime-500'>tambah Amandemen</Typography>
            </Breadcrumbs>
            <div className='w-full space-y-2 bg-white shadow-sm px-2 py-4 rounded-lg'>
              { loading ? (
                <div className="flex flex-col items-center justify-center h-20">
                    <IconLoader2 stroke={2} className="animate-spin rounded-full h-10 w-10 " />
                </div>
              ) : <form 
                  method="post"
                  encType='multipart/form-data'
                  className="space-y-2"
                  onSubmit={(e) => handleAddAmandemen(e)}
              >
                <div className='flex flex-col lg:flex-row space-y-2 lg:space-y-0 lg:space-x-2'>
                    <div className='w-full space-y-1'>
                        <label className='text-emerald-950'>
                            Berita Acara Kesepakatan <sup className='text-red-500'>*</sup>{' '}
                        </label>
                        <input
                        type='file'
                        name='ba_agreement_file'
                        id='ba_agreement_file'
                        className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-950'
                        required
                        />
                            {validation.ba_agreement_file && (
                                validation.ba_agreement_file.map((item, index) => (
                                    <div key={index}>
                                    <small className="text-red-600 text-sm">{item}</small>
                                    </div>
                                ))
                            )}
                    </div>
                    <div className='w-full space-y-1'>
                        <label className='text-emerald-950'>
                            Dokumen Hasil Amandemen <sup className='text-red-500'>*</sup>{' '}
                        </label>
                        <input
                        type='file'
                        name='result_amandemen_file'
                        id='result_amandemen_file'
                        className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-950'
                        required
                        />
                            {validation.result_amandemen_file && (
                                validation.result_amandemen_file.map((item, index) => (
                                    <div key={index}>
                                    <small className="text-red-600 text-sm">{item}</small>
                                    </div>
                                ))
                            )}
                    </div>
                    <div className='w-full space-y-1'>
                      <div className='w-full space-y-1'>
                          <label className='text-emerald-950'>
                              Perubahan Nilai
                          </label>
                          <select
                              className="w-full px-1 py-2 border border-gray-300 rounded-md"
                              name="amandemen_group"
                              id="amandemen_group"
                              onChange={(e) => setOpenNilai(e.target.value === '1' ? true : false)}
                          >
                              <option value="0">N/A</option>
                              <option value="1">Ada</option>
                          </select>
                              {validation.amandemen_group && (
                                  validation.amandemen_group.map((item, index) => (
                                      <div key={index}>
                                      <small className="text-red-600 text-sm">{item}</small>
                                      </div>
                                  ))
                              )}
                      </div>
                    </div>
                </div>
                <div className='flex flex-col lg:flex-row space-y-2 lg:space-y-0 lg:space-x-2'>
                  <div className='w-full space-y-1'>
                    {openNilai && (
                      <div className="flex flex-col lg:flex-row lg:space-x-2">
                        {/* Input Nilai Amandemen */}
                        <div className='w-full space-y-1'>
                          <label className='text-emerald-950'>
                            Nilai Kontrak <sup className='text-red-500'>*</sup>{' '}
                          </label>
                          <input
                            type='number'
                            name='amandemen_price'
                            id='amandemen_price'
                            placeholder={`ex: ${contract.contract_price + 1}`} 
                            onChange={(e) => handleDokumen(e.target.value)}
                            className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-950'
                            required
                          />
                          <p>
                            <small className="text-red-600 text-sm">
                              min: {new Intl.NumberFormat('id-ID', {
                                style: 'currency',
                                currency: 'IDR',
                                minimumFractionDigits: 0,
                              }).format(contract.contract_price + 1)}
                            </small>
                          </p>

                          {/* Validasi Error untuk Nilai */}
                          {validation.amandemen_price &&
                            validation.amandemen_price.map((item, index) => (
                              <div key={index}>
                                <small className="text-red-600 text-sm">{item}</small>
                              </div>
                            ))}
                        </div>

                        {/* Input File Dokumen muncul hanya jika openDokumen = true */}
                        {openDokumen && (
                          <div className='w-full space-y-1'>
                            <label className='text-emerald-950'>
                              Dokumen Ijin Prinsip <sup className='text-red-500'>*</sup>{' '}
                            </label>
                            <input
                              type='file'
                              name='principle_permit_file'
                              id='principle_permit_file'
                              className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-950'
                              required
                            />
                            {/* Validasi Error untuk File */}
                            {validation.principle_permit_file &&
                              validation.principle_permit_file.map((item, index) => (
                                <div key={index}>
                                  <small className="text-red-600 text-sm">{item}</small>
                                </div>
                              ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                </div>
                <div className='flex flex-col lg:flex-row space-y-2 lg:space-y-0 lg:space-x-2'>
                    <div className='w-full space-y-1'>
                        <div className='w-full space-y-1'>
                          <label className='text-emerald-950'>
                              Perubahan Waktu
                          </label>
                          <select
                              className="w-full px-1 py-2 border border-gray-300 rounded-md"
                              name="amandemen_group"
                              id="amandemen_group"
                              onChange={(e) => setOpenWaktu(e.target.value === '1' ? true : false)}
                          >
                              <option value="0">N/A</option>
                              <option value="1">Ada</option>
                          </select>
                              {validation.amandemen_group && (
                                  validation.amandemen_group.map((item, index) => (
                                      <div key={index}>
                                      <small className="text-red-600 text-sm">{item}</small>
                                      </div>
                                  ))
                              )}
                      </div>
                      { openWaktu && <div className='w-full space-y-1'>
                          <label className='text-emerald-950'>
                              Tanggal Kontrak Berakhir <sup className='text-red-500'>*</sup>{' '}
                          </label>
                          <input
                          type='date'
                          name='amandemen_end_date'
                          id='amandemen_end_date'
                          placeholder='ex: 1000'
                          className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-950'
                          required
                          />
                          <p>
                            <small className="text-red-600 text-sm">
                              min: {
                                      new Intl.DateTimeFormat('id-ID', {
                                        day: '2-digit',
                                        month: 'long',
                                        year: 'numeric',
                                      }).format(
                                        new Date(
                                          new Date(contract.contract_end_date).setDate(
                                            new Date(contract.contract_end_date).getDate() + 1
                                          )
                                        )
                                      )
                                    }

                            </small>
                          </p>
                              {validation.amandemen_end_date && (
                                  validation.amandemen_end_date.map((item, index) => (
                                      <div key={index}>
                                      <small className="text-red-600 text-sm">{item}</small>
                                      </div>
                                  ))
                              )}
                      </div>}
                    </div>
                    <div className="w-full space-y-1" >
                      <div className='w-full space-y-1'>
                          <label className='text-emerald-950'>
                              Perubahan dikenakan Denda
                          </label>
                          <select
                              className="w-full px-1 py-2 border border-gray-300 rounded-md"
                              name="amandemen_group"
                              id="amandemen_group"
                              onChange={(e) => setOpenDenda(e.target.value === '1' ? true : false)}
                          >
                              <option value="0">N/A</option>
                              <option value="1">Ada</option>
                          </select>
                              {validation.amandemen_group && (
                                  validation.amandemen_group.map((item, index) => (
                                      <div key={index}>
                                      <small className="text-red-600 text-sm">{item}</small>
                                      </div>
                                  ))
                              )}
                      </div>
                      { openDenda && <div className='w-full space-y-1'>
                          <label className='text-emerald-950'>
                              Denda <sup className='text-red-500'>*</sup>{' '}
                          </label>
                          <input
                          type='number'
                          name='amandemen_penalty'
                          id='amandemen_penalty'
                          min={1}
                          max={100}
                          placeholder='ex: 10'
                          className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-950'
                          required
                          />
                          <p><small className="text-red-600 text-sm">min: {contract.contract_penalty + 1}%</small></p>
                              {validation.amandemen_penalty && (
                                  validation.amandemen_penalty.map((item, index) => (
                                      <div key={index}>
                                      <small className="text-red-600 text-sm">{item}</small>
                                      </div>
                                  ))
                              )}
                      </div>}
                    </div>
                    {/* <div className='w-full space-y-1'>
                        <label className='text-emerald-950'>
                            Dokumen Hasil Amandemen <sup className='text-red-500'>*</sup>{' '}
                        </label>
                        <input
                        type='file'
                        name='result_amandemen_file'
                        id='result_amandemen_file'
                        className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-950'
                        required
                        />
                            {validation.result_amandemen_file && (
                                validation.result_amandemen_file.map((item, index) => (
                                    <div key={index}>
                                    <small className="text-red-600 text-sm">{item}</small>
                                    </div>
                                ))
                            )}
                    </div> */}
                </div>
                <div>
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
                </div>
              </form>}
            </div>
        </div>
    </div>
  )
}

export default AddAmandemen