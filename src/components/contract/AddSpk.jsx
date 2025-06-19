import { Breadcrumbs, Typography } from "@mui/material"
import Header from "../Header"
import { IconChevronRight } from "@tabler/icons-react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { useState } from "react"
import { addSpk } from "../../services/spk.service"
import Swal from "sweetalert2"
import * as motion from 'motion/react-client';
import { IconArrowLeft } from "@tabler/icons-react"
import { IconArrowRight } from "@tabler/icons-react"

const AddSpk = () => {
    const { id } = useParams();
    const [validation, setValidation] = useState([]);
    const [IsInvoice, setIsInvoice] = useState(false);
    const [SpkPrice, setSpkPrice] = useState('');
    const [InvoicePrice, setInvoicePrice] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();
    const [hide, setHide] = useState(false);

    const formatNumber = (value) => {
        const numeric = value.replace(/[^\d]/g, ''); // hapus non-digit
        return numeric.replace(/\B(?=(\d{3})+(?!\d))/g, ','); // tambah koma ribuan
    };
    
    const handleInputChange = (e) => {
        const value = e.target.value;
        const formatted = formatNumber(value);
        setSpkPrice(formatted);
    };
    const handleInvoiceChange = (e) => {
        const value = e.target.value;
        const formatted = formatNumber(value);
        setInvoicePrice(formatted);
    };
    
    const handleAddSpk = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
    
        try {
            const rawSpkPrice = SpkPrice.replace(/,/g, '');
            const rawInvoice = InvoicePrice.replace(/,/g, '');
            const formData = new FormData(e.target);
            formData.append('spk_price', rawSpkPrice);
            formData.append('invoice_value', rawInvoice);
            formData.append('contract_id', id);
        
            const res = await addSpk(formData);
            if (res.success) {
                Swal.fire("Berhasil!", "success add spk!", "success");
                navigate('/contract/dashboard/' + id);
            } else {
                setValidation(res.response?.data.errors || []);
                Swal.fire("Error!", "failed add spk!", "error");
            }
        } catch (error) {
          console.error("Error adding spk:", error);
          setValidation(error.response?.data.errors || []);
          Swal.fire("Error!", "something went wrong add spk!", "error");
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
            <Breadcrumbs
                aria-label='breadcrumb'
                className="uppercase"
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
                <Typography className='text-lime-500'>Tambah SPK</Typography>
            </Breadcrumbs>
            <div className='w-full space-y-2 bg-white shadow-sm px-2 py-4 rounded-lg'>
                <form 
                    method="post"
                    encType='multipart/form-data'
                    className="space-y-2"
                    onSubmit={(e) => handleAddSpk(e)}
                >
                    <div className='flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2'>
                        <div className='w-full space-y-1'>
                            <label className='text-emerald-950'>
                                No SPK <sup className='text-red-500'>*</sup>{' '}
                            </label>
                            <input
                            type='text'
                            name='no_spk'
                            id='no_spk'
                            placeholder='No SPK'
                            className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-950'
                            required
                            />
                                {validation.no_spk && (
                                    validation.no_spk.map((item, index) => (
                                        <div key={index}>
                                        <small className="text-red-600 text-sm">{item}</small>
                                        </div>
                                    ))
                                )}
                        </div>
                        <div className='w-full space-y-1'>
                            <label className='text-emerald-950'>
                                Judul SPK <sup className='text-red-500'>*</sup>{' '}
                            </label>
                            <input
                            type='text'
                            name='spk_name'
                            id='spk_name'
                            placeholder='Judul SPK'
                            className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-950'
                            required
                            />
                                {validation.spk_name && (
                                    validation.spk_name.map((item, index) => (
                                        <div key={index}>
                                        <small className="text-red-600 text-sm">{item}</small>
                                        </div>
                                    ))
                                )}
                        </div>
                    </div>
                    <div className='flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2'>
                        <div className='w-full space-y-1'>
                            <label className='text-emerald-950'>
                                Tanggal Mulai SPK <sup className='text-red-500'>*</sup>{' '}
                            </label>
                            <input
                            type='date'
                            name='spk_start_date'
                            id='spk_start_date'
                            placeholder='Tanggal Mulai SPK'
                            className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-950'
                            required
                            />
                                {validation.spk_start_date && (
                                    validation.spk_start_date.map((item, index) => (
                                        <div key={index}>
                                        <small className="text-red-600 text-sm">{item}</small>
                                        </div>
                                    ))
                                )}
                        </div>
                        <div className='w-full space-y-1'>
                            <label className='text-emerald-950'>
                                Tanggal Berakhir SPK <sup className='text-red-500'>*</sup>{' '}
                            </label>
                            <input
                            type='date'
                            name='spk_end_date'
                            id='spk_end_date'
                            placeholder='Tanggal Berakhir SPK'
                            className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-950'
                            required
                            />
                                {validation.spk_end_date && (
                                    validation.spk_end_date.map((item, index) => (
                                        <div key={index}>
                                        <small className="text-red-600 text-sm">{item}</small>
                                        </div>
                                    ))
                                )}
                        </div>
                    </div>
                    <div className='flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2'>
                        <div className='w-full space-y-1'>
                            <label className='text-emerald-950'>
                                Nilai SPK <sup className='text-red-500'>*</sup>{' '}
                            </label>
                            <input
                            type='text'
                            name='spk_price'
                            id='spk_price'
                            placeholder='Nilai SPK'
                            value={SpkPrice}
                            onChange={handleInputChange}
                            className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-950'
                            required
                            />
                                {validation.spk_price && (
                                    validation.spk_price.map((item, index) => (
                                        <div key={index}>
                                        <small className="text-red-600 text-sm">{item}</small>
                                        </div>
                                    ))
                                )}
                        </div>
                        <div className='w-full space-y-1'>
                            <label className='text-emerald-950'>
                                Dokumen SPK <sup className='text-red-500'>*</sup>{' '}
                            </label>
                            <input
                            type='file'
                            name='spk_file'
                            id='spk_file'
                            placeholder='Dokumen SPK'
                            className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-950'
                            required
                            />
                                {validation.spk_file && (
                                    validation.spk_file.map((item, index) => (
                                        <div key={index}>
                                        <small className="text-red-600 text-sm">{item}</small>
                                        </div>
                                    ))
                                )}
                        </div>
                    </div>
                    <div className='flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2'>
                        <div className='w-full space-y-1'>
                            <label className='text-emerald-950'>
                                Status SPK <sup className='text-red-500'>*</sup>{' '}
                            </label>
                            <select
                                className="w-full px-1 py-2 border border-gray-300 rounded-md"
                                name="spk_status"
                                id="spk_status"
                            >
                                <option value="1">Berjalan</option>
                                <option value="0">Selesai</option>
                            </select>
                                {validation.spk_status && (
                                    validation.spk_status.map((item, index) => (
                                        <div key={index}>
                                        <small className="text-red-600 text-sm">{item}</small>
                                        </div>
                                    ))
                                )}
                        </div>
                        <div className='w-full space-y-1'>
                            <label className='text-emerald-950'>
                                Status Penagihan <sup className='text-red-500'>*</sup>{' '}
                            </label>
                            <select
                                className="w-full px-1 py-2 border border-gray-300 rounded-md"
                                name="invoice"
                                id="invoice"
                                onChange={(e) =>
                                    e.target.value == 1 ? setIsInvoice(true) : setIsInvoice(false)
                                  }
                            >
                                <option value="0">Belum Ada</option>
                                <option value="1">Ada</option>
                            </select>
                                {validation.invoice && (
                                    validation.invoice.map((item, index) => (
                                        <div key={index}>
                                        <small className="text-red-600 text-sm">{item}</small>
                                        </div>
                                    ))
                                )}
                        </div>
                    </div>
                    {IsInvoice && <div className='flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2'>
                        <div className='w-full space-y-1'>
                            <label className='text-emerald-950'>
                                Nilai Penagihan <sup className='text-red-500'>*</sup>{' '}
                            </label>
                            <input
                            type='text'
                            name='invoice_value'
                            id='invoice_value'
                            placeholder='Nilai Penagihan'
                            value={InvoicePrice}
                            onChange={handleInvoiceChange}
                            className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-950'
                            required
                            />
                                {validation.invoice_value && (
                                    validation.invoice_value.map((item, index) => (
                                        <div key={index}>
                                        <small className="text-red-600 text-sm">{item}</small>
                                        </div>
                                    ))
                                )}
                        </div>
                        <div className='w-full space-y-1'>
                            <label className='text-emerald-950'>
                                Bukti Pembayaran <sup className='text-red-500'>*</sup>{' '}
                            </label>
                            <input
                            type='file'
                            name='invoice_file'
                            id='invoice_file'
                            className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-950'
                            required
                            />
                                {validation.invoice_file && (
                                    validation.invoice_file.map((item, index) => (
                                        <div key={index}>
                                        <small className="text-red-600 text-sm">{item}</small>
                                        </div>
                                    ))
                                )}
                        </div>
                    </div>}
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
                </form>
            </div>
        </div>
    </div>
  )
}

export default AddSpk