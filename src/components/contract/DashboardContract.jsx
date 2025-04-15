import { Link, useParams } from "react-router-dom"
import Header from "../Header";
import { useState, useEffect } from "react";
import { getContractById } from "../../services/contract.service";
import { api_public } from "../../services/config";
import { Breadcrumbs, Typography } from "@mui/material";
import { IconChevronRight } from "@tabler/icons-react";
import Termin from "./Termin";
import Billing from "./Billing";
const DashboardContract = () => {
    const {id} = useParams();
    const [contractPrice, setContractPrice] = useState('');
    const [contract, setContract] = useState([]);
    const [isLoading, setLoading] = useState(true);
    const base_public_url = api_public;

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 360,
        bgcolor: 'background.paper',
        boxShadow: 30,
        p: 4,
        borderRadius: 2
    };

    useEffect(() => {
        fetchContract();
    }, [id]);
    
    const fetchContract = async () => {
        try {
          setLoading(true);
          const data = await getContractById(id);
          setContract(data.data);
    
          const formattedPrice = formatNumber(data.data.contract_price.toString());
          setContractPrice(formattedPrice);
        } catch (error) {
          console.error("Error fetching contract:", error);
        } finally {
          setLoading(false);
        }
    };
    
    const formatNumber = (value) => {
        const numeric = value.replace(/[^\d]/g, ''); // Hapus semua non-digit
        if (!numeric) return '';
        return numeric.replace(/\B(?=(\d{3})+(?!\d))/g, ','); // Tambah koma sebagai pemisah ribuan
    };
    
    const handleInputChange = (e) => {
        const value = e.target.value;
        const formatted = formatNumber(value);
        setContractPrice(formatted);
    };
  return (
    <div className='flex flex-col md:flex-row w-full'>
        <Header />
        <div className='flex flex-col md:pl-64 w-full px-2 py-4 space-y-3'>
            <Breadcrumbs
                aria-label='breadcrumb'
                className="uppercase"
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
                <Typography className='text-lime-500'>Dashboard Contract</Typography>
            </Breadcrumbs>
            {isLoading ? <div>Loading...</div> : <div className='w-full bg-white shadow-sm px-2 py-4 rounded-lg space-y-2'>
                <div className="flex flex-col uppercase font-bold">
                    <span>{contract.contract_name}</span> 
                </div>
                <div>
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
                                    value={contract.no_vendor}
                                    className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-950'
                                    disabled
                                />
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
                                    value={contract.vendor_name}
                                    className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-950'
                                    disabled
                                />
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
                                    value={contract.no_contract}
                                    className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-950'
                                    disabled
                                />
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
                                    value={contract.contract_name}
                                    className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-950'
                                    disabled
                                />
                            </div>
                        </div>
                        <div className='flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2'>
                            <div className='flex flex-row space-x-2 w-full'>
                                <div className='w-full'>
                                    <label htmlFor="contract_type">Contract Type<sup className='text-red-500'>*</sup></label>
                                    <select
                                        className="w-full px-1 py-2 border border-gray-300 rounded-md"
                                        name="contract_type"
                                        id="contract_type"
                                        value={contract.contract_type}
                                        disabled
                                    >
                                        <option value="1">Lumpsum</option>
                                        <option value="2">Unit Price</option>
                                    </select>
                                </div>
                                <div className='w-full'>
                                    <label className='text-emerald-950'>
                                    Contract Date <sup className='text-red-500'>*</sup>
                                    </label>
                                    <input
                                    type='date'
                                    name='contract_date'
                                    id='contract_date'
                                    value={contract.contract_date}
                                    className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-950'
                                    disabled
                                    />
                                </div>
                            </div>
                            <div className='w-full md:w-2/3'>
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
                                    disabled
                                />
                            </div>
                        </div>
                        <div className='flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2'>
                            <div className='w-full'>
                                <label className='text-emerald-950'>
                                    Contract File <sup className='text-red-500'>*</sup>{' '}
                                </label>
                                <div className='flex flex-row justify-between items-center w-full border bg-lime-400 rounded p-2'>
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
                                    disabled
                                >
                                    <option value="1">Aktif</option>
                                    <option value="0">Selesai</option>
                                </select>
                            </div>
                        </div>
                        <div className="flex flex-row justify-end space-x-2">
                            <Link to={`/contract/edit/${id}`} className="text-lime-400 bg-emerald-950 w-full text-center py-2 px-4 rounded">
                                    Edit
                            </Link>
                        </div>
                    </div>
                </div>
            </div> }
            <div className='w-full bg-white shadow-sm px-2 py-4 rounded-lg space-y-2'>
                <Termin />
            </div>
            <div className='w-full bg-white shadow-sm px-2 py-4 rounded-lg space-y-2'>
                <Billing />
            </div>
        </div>
    </div>
  )
}

export default DashboardContract