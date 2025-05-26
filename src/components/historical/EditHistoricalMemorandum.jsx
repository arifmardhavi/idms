import { Autocomplete, Breadcrumbs, TextField, Typography } from "@mui/material"
import Header from "../Header"
import { IconChevronRight } from "@tabler/icons-react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { useState } from "react"
import { getTagnumber } from "../../services/tagnumber.service"
import { useEffect } from "react"
import { IconLoader2 } from "@tabler/icons-react"
import { updateHistoricalMemorandum, getHistoricalMemorandumById } from "../../services/historical_memorandum.service"
import Swal from "sweetalert2"
import { api_public } from "../../services/config";

const EditHistoricalMemorandum = () => {
    const {id} = useParams();
    const [validation, setValidation] = useState([])
    const [loading, setLoading] = useState(true)
    const [tag_number, setTagNumber] = useState([])
    const [historicalMemorandum, setHistoricalMemorandum] = useState([])
    const [selectedTagNumber, setSelectedTagNumber] = useState(null)
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const base_public_url = api_public;

    useEffect(() => {
        fetchHistoricalMemorandum();
        fetchTagNumber();
    }, [id])

    const fetchHistoricalMemorandum = async () => {
        try {
            setLoading(true);
            const data = await getHistoricalMemorandumById(id);
            setHistoricalMemorandum(data.data);
            setSelectedTagNumber(data.data.tag_number_id);
            console.log(data.data);
        } catch (error) {
            console.error("Error fetching historical memorandum:", error);
        } finally {
            setLoading(false);
        }
    }

    const fetchTagNumber = async () => {
        try {
            setLoading(true);
            const data = await getTagnumber();
            setTagNumber(data.data);
            console.log(data.data);
        } catch (error) {
            console.error("Error fetching tag number:", error);
        } finally {
            setLoading(false);
        }
    }

    const handleEditHistoricalMemorandum = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        selectedTagNumber ? formData.append('tag_number_id', selectedTagNumber) : '';

        try {
            setIsSubmitting(true);
            const res = await updateHistoricalMemorandum(id, formData);
            if (res.success) {
                Swal.fire("Berhasil!", "success add historical memorandum!", "success");
                navigate('/historical_memorandum');
            } else {
                setValidation(res.response?.data.errors || []);
                Swal.fire("Error!", "failed add historical memorandum!", "error");
            }
        } catch (error) {
            console.error("Error adding historical memorandum:", error);
            setValidation(error.response?.data.errors || []);
            Swal.fire("Error!", "something went wrong add historical memorandum!", "error");
        } finally {
            setIsSubmitting(false);
        }
    }
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
                <Link className='hover:underline text-emerald-950' to='/historical_memorandum'>
                Historical Memorandum
                </Link>
                <Typography className='text-lime-500'>Edit Historical Memorandum</Typography>
            </Breadcrumbs>
            <div className='w-full space-y-2 bg-white shadow-sm px-2 py-4 rounded-lg'>
                {loading ? 
                    <div className="flex flex-col items-center justify-center h-20">
                        <IconLoader2 stroke={2} className="animate-spin rounded-full h-10 w-10 " />
                    </div> 
                : <form 
                    method="post"
                    encType='multipart/form-data'
                    className="space-y-2"
                    onSubmit={(e) => handleEditHistoricalMemorandum(e)}
                >
                    <div className='flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2'>
                        <div className='w-full space-y-1'>
                            <label className='text-emerald-950'>
                                Tag Number
                            </label>
                            <Autocomplete
                                id="tag_number_id"
                                options={Array.isArray(tag_number) ? tag_number : []}
                                getOptionLabel={(option) => option.tag_number || ''}
                                isOptionEqualToValue={(option, value) => option.id === value.id}
                                value={tag_number.find((item) => item.id === selectedTagNumber) || null}
                                onChange={(e, value) => {
                                    setSelectedTagNumber(value?.id || null);
                                }}
                                renderInput={(params) => (
                                <TextField
                                    {...params}
                                    name="tag_number_id" // Tambahkan name di sini
                                    placeholder={'N/A'}
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
                            />
                        </div>
                        <div className='w-full space-y-1'>
                            <label className='text-emerald-950'>
                                Judul Memorandum <sup className='text-red-500'>*</sup>{' '}
                            </label>
                            <input
                            type='text'
                            name='judul_memorandum'
                            id='judul_memorandum'
                            placeholder='Judul Memorandum'
                            defaultValue={historicalMemorandum.judul_memorandum}
                            className='w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-950'
                            required
                            />
                                {validation.judul_memorandum && (
                                    validation.judul_memorandum.map((item, index) => (
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
                                Jenis Memorandum <sup className='text-red-500'>*</sup>{' '}
                            </label>
                            <select
                                className="w-full px-1 py-2 border border-gray-300 rounded-md"
                                name="jenis_memorandum"
                                id="jenis_memorandum"
                                defaultValue={historicalMemorandum.jenis_memorandum}
                            >
                                <option value="0">Rekomendasi</option>
                                <option value="1">Laporan Pekerjaan</option>
                            </select>
                                {validation.jenis_memorandum && (
                                    validation.jenis_memorandum.map((item, index) => (
                                        <div key={index}>
                                        <small className="text-red-600 text-sm">{item}</small>
                                        </div>
                                    ))
                                )}
                        </div>
                        <div className='w-full space-y-1'>
                            <label className='text-emerald-950'>
                                Jenis Pekerjaan <sup className='text-red-500'>*</sup>{' '}
                            </label>
                            <select
                                className="w-full px-1 py-2 border border-gray-300 rounded-md"
                                name="jenis_pekerjaan"
                                id="jenis_pekerjaan"
                                defaultValue={historicalMemorandum.jenis_pekerjaan}
                            >
                                <option value="0">TA</option>
                                <option value="1">Rutin</option>
                                <option value="2">Non Rutin</option>
                                <option value="3">Overhaul</option>
                            </select>
                                {validation.jenis_pekerjaan && (
                                    validation.jenis_pekerjaan.map((item, index) => (
                                        <div key={index}>
                                        <small className="text-red-600 text-sm">{item}</small>
                                        </div>
                                    ))
                                )}
                        </div>
                        <div className='w-full space-y-1'>
                            <label className='text-emerald-950'>
                                Dokumen Memorandum <sup className='text-red-500'>*</sup>{' '}
                            </label>
                            <input
                            type='file'
                            name='memorandum_file'
                            id='memorandum_file'
                            className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-950'
                            
                            />
                            <div className='flex flex-row justify-between items-center w-full border bg-lime-400 rounded p-1'>
                                {historicalMemorandum.memorandum_file ? (
                                <>
                                    <Link
                                    to={`${base_public_url}historical_memorandum/${historicalMemorandum.memorandum_file}`}
                                    target='_blank'
                                    className='text-emerald-950 hover:underline cursor-pointer'
                                    >
                                    {historicalMemorandum.memorandum_file}
                                    </Link>
                                </>
                                ) : (
                                <span>-</span>
                                )}
                            </div>
                                {validation.memorandum_file && (
                                    validation.memorandum_file.map((item, index) => (
                                        <div key={index}>
                                        <small className="text-red-600 text-sm">{item}</small>
                                        </div>
                                    ))
                                )}
                        </div>
                    </div>
                    <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2">
                        <button
                            type='submit'
                            className={`w-full bg-emerald-950 text-white py-2 rounded-md uppercase ${
                            isSubmitting
                                ? 'bg-gray-500 cursor-not-allowed'
                                : 'bg-emerald-950 text-white'
                            } hover:scale-95 transition duration-300`}
                            disabled={isSubmitting} // Disable tombol jika sedang submit
                        >
                            {isSubmitting ? 'Processing...' : 'Save'}
                        </button>
                        <button
                            type='button'
                            onClick={() => navigate('/historical_memorandum')}
                            className='w-full lg:w-1/2 bg-slate-600 text-white py-2 rounded-md uppercase hover:scale-95 transition duration-300'
                        >
                            Cancel
                        </button>
                    </div>
                </form>}
            </div>
        </div>
    </div>
  )
}

export default EditHistoricalMemorandum