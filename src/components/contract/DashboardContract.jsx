import { Link, useParams } from "react-router-dom"
import Header from "../Header";
import { useState, useEffect } from "react";
import { getContractById } from "../../services/contract.service";
import { api_public } from "../../services/config";
import { Breadcrumbs, Typography } from "@mui/material";
import { IconChevronRight } from "@tabler/icons-react";
import Termin from "./Termin";
import Billing from "./Billing";
import Spk from "./Spk";
import SpkProgress from "./SpkProgress";
import LumpsumProgress from "./LumpsumProgress";
import Amandemen from "./amandemen/Amandemen";
import { IconArrowRight } from "@tabler/icons-react";
import { IconArrowLeft } from "@tabler/icons-react";
import { IconLoader2 } from "@tabler/icons-react";
const DashboardContract = () => {
    const {id} = useParams();
    const [contract, setContract] = useState([]);
    const [isLoading, setLoading] = useState(true);
    const base_public_url = api_public;
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
                <Link className='hover:underline text-emerald-950' to='/'>
                Home
                </Link>
                <Link className='hover:underline text-emerald-950' to='/contract'>
                Contract
                </Link>
                <Typography className='text-lime-500'>Dashboard Contract</Typography>
            </Breadcrumbs>
            { isLoading ? <div className="flex flex-col items-center justify-center h-20">
                  <IconLoader2 stroke={2} className="animate-spin rounded-full h-10 w-10 " />
              </div> : <div className='w-full space-y-2 bg-white shadow-sm px-2 py-4 rounded-lg'>
                <h1 className="text-xl uppercase font-bold" >Detail Contract</h1>
                {/* <div className="w-full flex flex-row justify-center">
                    <button className="text-lime-400 bg-emerald-950 w-fit text-center py-2 px-4 rounded cursor-pointer transform hover:scale-95 duration-75">Dashboard {contract.contract_name}</button>
                </div> */}
                {contract.contract_type !=3 && <div className="flex flex-col lg:flex-row space-y-2 lg:space-x-2 lg:space-y-0" >
                    <div className="w-full lg:w-[50%] bg-lime-400 shadow-sm px-2 py-4 rounded-lg">
                        <table className="w-full" >
                            <tr>
                                <td>Judul Kontrak</td>
                                <td>:</td>
                                <td className="w-[70%]">{contract.contract_name}</td>
                            </tr>
                            <tr>
                                <td>No Kontrak</td>
                                <td>:</td>
                                <td>{contract.no_contract}</td>
                            </tr>
                            <tr>
                                <td>Nama Vendor</td>
                                <td>:</td>
                                <td>{contract.vendor_name}</td>
                            </tr>
                            <tr>
                                <td>Nomor Vendor</td>
                                <td>:</td>
                                <td>{contract.no_vendor}</td>
                            </tr>
                            <tr>
                                <td>Tipe Kontrak</td>
                                <td>:</td>
                                <td>{contract.contract_type == '1' ? 'Lumpsum' : 'Unit Price'}</td>
                            </tr>
                            <tr>
                                <td>Nilai Kontrak</td>
                                <td>:</td>
                                <td>
                                {new Intl.NumberFormat('id-ID', {
                                style: 'currency',
                                currency: 'IDR',
                                minimumFractionDigits: 0,
                                }).format(contract.contract_price)}
                                </td>
                            </tr>
                            <tr>
                                <td>Tanggal Kontrak</td>
                                <td>:</td>
                                <td>
                                {new Intl.DateTimeFormat('id-ID', {
                                    day: '2-digit',
                                    month: 'long',
                                    year: 'numeric',
                                }).format(new Date(contract.contract_date))}
                                </td>
                            </tr>
                            <tr>
                                <td>Dokumen Kontrak</td>
                                <td>:</td>
                                <td>
                                    <Link
                                        to={`${base_public_url}contract/${contract.contract_file}`}
                                        target='_blank'
                                        className='bg-emerald-950 text-lime-400 underline px-2 rounded-md hover:underline cursor-pointer'
                                    >
                                        Preview
                                    </Link>
                                </td>
                            </tr>
                        </table>
                    </div>
                    <div className="w-full lg:w-[50%] bg-lime-400 shadow-sm px-2 py-4 rounded-lg">
                        <table className="w-full" >
                            {
                                contract.contract_type == '1' ? (
                                    <>
                                        <tr>
                                            <td>Jumlah Termin</td>
                                            <td>:</td>
                                            <td>{contract.termin_count}</td>
                                        </tr>
                                        <tr>
                                            <td>Jumlah Penagihan</td>
                                            <td>:</td>
                                            <td>{contract.billing_count}</td>
                                        </tr>
                                    </>
                                ) : (
                                    <>
                                        <tr>
                                            <td>Jumlah SPK</td>
                                            <td>:</td>
                                            <td>{contract.spk_count}</td>
                                        </tr>
                                    </>
                                )
                            }
                            <tr>
                                <td>Amandemen</td>
                                <td>:</td>
                                <td>{contract.amandemen_count}</td>
                            </tr>
                            <tr>
                                <td>Mulai Kontrak</td>
                                <td>:</td>
                                <td>
                                    {
                                        contract.contract_start_date ? new Intl.DateTimeFormat('id-ID', {
                                            day: '2-digit',
                                            month: 'long',
                                            year: 'numeric',
                                        }).format(new Date(contract.contract_start_date))
                                        : '-'
                                    }
                                </td>
                            </tr>
                            <tr>
                                <td>Akhir Kontrak</td>
                                <td>:</td>
                                <td>
                                    {
                                        contract.contract_end_date ? new Intl.DateTimeFormat('id-ID', {
                                            day: '2-digit',
                                            month: 'long',
                                            year: 'numeric',
                                        }).format(new Date(contract.contract_end_date))
                                        : '-'
                                    }
                                </td>
                            </tr>
                            <tr>
                                <td>Dokumen Notulensi KOM</td>
                                <td>:</td>
                                <td>
                                    {
                                        contract.meeting_notes ? 
                                            <Link
                                                to={`${base_public_url}contract/meeting_notes/${contract.meeting_notes}`}
                                                target='_blank'
                                                className='underline px-2 text-sm rounded-md hover:underline cursor-pointer'
                                            >
                                                {contract.meeting_notes}
                                            </Link>
                                        : '-'
                                    }
                                </td>
                            </tr>
                            <tr>
                                <td>Status Kontrak</td>
                                <td>:</td>
                                <td>
                                    <span className="bg-emerald-950 text-lime-400 px-2 rounded-md">
                                        {contract.contract_status == '1' ? 'Berjalan' : 'Selesai'}
                                    </span>
                                </td>
                            </tr>
                        </table>
                    </div>
                </div>}
                {contract.contract_type == 3 && <div className="flex flex-col lg:flex-row space-y-2 lg:space-x-2 lg:space-y-0" >
                    <div className="w-full bg-lime-400 shadow-sm px-2 py-4 rounded-lg">
                        <table className="w-full" >
                            <tr>
                                <td>Judul PO</td>
                                <td>:</td>
                                <td className="w-[70%]">{contract.contract_name}</td>
                            </tr>
                            <tr>
                                <td>No PO</td>
                                <td>:</td>
                                <td>{contract.no_contract}</td>
                            </tr>
                            <tr>
                                <td>Nama Vendor</td>
                                <td>:</td>
                                <td>{contract.vendor_name}</td>
                            </tr>
                            <tr>
                                <td>Nomor Vendor</td>
                                <td>:</td>
                                <td>{contract.no_vendor}</td>
                            </tr>
                            <tr>
                                <td>Pengawas</td>
                                <td>:</td>
                                <td>{contract.pengawas}</td>
                            </tr>
                            <tr>
                                <td>Tipe Kontrak</td>
                                <td>:</td>
                                <td>{contract.contract_type == '1' ? 'Lumpsum' : contract.contract_type == '2' ? 'Unit Price' : 'PO Material'}</td>
                            </tr>
                            <tr>
                                <td>Nilai Kontrak</td>
                                <td>:</td>
                                <td>
                                {new Intl.NumberFormat('id-ID', {
                                style: 'currency',
                                currency: 'IDR',
                                minimumFractionDigits: 0,
                                }).format(contract.contract_price)}
                                </td>
                            </tr>
                            <tr>
                                <td>Tanggal Mulai</td>
                                <td>:</td>
                                <td>
                                {new Intl.DateTimeFormat('id-ID', {
                                    day: '2-digit',
                                    month: 'long',
                                    year: 'numeric',
                                }).format(new Date(contract.contract_start_date))}
                                </td>
                            </tr>
                            <tr>
                                <td>Tanggal Berakhir</td>
                                <td>:</td>
                                <td>
                                {new Intl.DateTimeFormat('id-ID', {
                                    day: '2-digit',
                                    month: 'long',
                                    year: 'numeric',
                                }).format(new Date(contract.contract_end_date))}
                                </td>
                            </tr>
                            <tr>
                                <td>Dokumen Kontrak</td>
                                <td>:</td>
                                <td>
                                    <Link
                                        to={`${base_public_url}contract/${contract.contract_file}`}
                                        target='_blank'
                                        className='bg-emerald-950 text-lime-400 underline px-2 rounded-md hover:underline cursor-pointer'
                                    >
                                        {contract.contract_file}
                                    </Link>
                                </td>
                            </tr>
                            <tr>
                                <td>Status Kontrak</td>
                                <td>:</td>
                                <td>
                                    <span className="bg-emerald-950 text-lime-400 px-2 rounded-md">
                                        {contract.contract_status == '1' ? 'Berjalan' : 'Selesai'}
                                    </span>
                                </td>
                            </tr>
                        </table>
                    </div>
                </div>}
                <div className="w-full p-2 flex flex-row justify-center">
                    <Link to={`/contract/edit/${id}`} className="text-lime-400 bg-emerald-950 w-full md:w-64 text-center py-2 px-4 rounded">
                            Update
                    </Link>
                </div>
            </div>}

            { contract.contract_type == '2' && 
            <>
                <div className='w-full bg-white shadow-sm px-2 py-4 rounded-lg space-y-2'>
                    <Spk />
                </div>
                <div className='w-full bg-white shadow-sm px-2 py-4 rounded-lg space-y-2'>
                    <SpkProgress  />
                </div>
            </>
            }
            { contract.contract_type == '1' &&
                <>
                    <div className='w-full bg-white shadow-sm px-2 py-4 rounded-lg space-y-2'>
                        <Termin onAddedTermin={fetchContract} />
                    </div>
                    <div className='w-full bg-white shadow-sm px-2 py-4 rounded-lg space-y-2'>
                        {isLoading ? <div>Loading...</div> : <Billing onAddedBilling={fetchContract} /> }
                    </div>
                    <div className='w-full bg-white shadow-sm px-2 py-4 rounded-lg space-y-2'>
                        <LumpsumProgress />
                    </div>
                </>
            }
            {contract.contract_type == 3 &&<div className='w-full bg-white shadow-sm px-2 py-4 rounded-lg space-y-2'>
                <LumpsumProgress />
            </div>}
            {contract.contract_type != 3 && <div className='w-full bg-white shadow-sm px-2 py-4 rounded-lg space-y-2'>
                <Amandemen />
            </div>}
        </div>
    </div>
  )
}

export default DashboardContract