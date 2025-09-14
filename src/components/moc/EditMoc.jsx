import { Autocomplete, Breadcrumbs, TextField, Typography } from "@mui/material"
import Header from "../Header"
import { IconChevronRight } from "@tabler/icons-react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { useState } from "react"
import { getTagnumber } from "../../services/tagnumber.service"
import { useEffect } from "react"
import { IconLoader2 } from "@tabler/icons-react"
import {getMocById, updateMoc } from "../../services/moc.service"
import Swal from "sweetalert2"
import { api_public } from "../../services/config";
import { ActiveUnit } from "../../services/unit.service"
import { ActiveCategory } from "../../services/category.service"
import { IconArrowLeft } from "@tabler/icons-react"
import { IconArrowRight } from "@tabler/icons-react"

const EditMoc = () => {
    const {id} = useParams();
    const [validation, setValidation] = useState([])
    const [loading, setLoading] = useState(true)
    const [tag_number, setTagNumber] = useState([])
    const [moc, setMoc] = useState([])
    const [unit, setUnit] = useState([])
    const [category, setCategory] = useState([])
    const [selectedTagNumber, setSelectedTagNumber] = useState([])
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const base_public_url = api_public;
    const [hide, setHide] = useState(false);

    useEffect(() => {
        fetchAll();
    }, [id])

    const fetchAll = async () => {
        try {
            setLoading(true);
            await fetchUnit();
            await fetchCategory();
            await fetchMoc();
            await fetchTagnumber();
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    }

    const fetchMoc = async () => {
        try {
            setLoading(true);
            const data = await getMocById(id);
            setMoc(data.data);
            setSelectedTagNumber(
                data.data.tag_number_id
                ? data.data.tag_number_id.split(',').map(id => parseInt(id.trim()))
                : []
            );

            console.log(data.data);
        } catch (error) {
            console.error("Error fetching moc:", error);
        } finally {
            setLoading(false);
        }
    }

    const fetchUnit = async () => {
            try {
                setLoading(true);
                const data = await ActiveUnit();
                setUnit(data.data);
                console.log(data.data);
            } catch (error) {
                console.error("Error fetching tag number:", error);
            } finally {
                setLoading(false);
            }
        }
        const fetchCategory = async () => {
            try {
                setLoading(true);
                const data = await ActiveCategory();
                setCategory(data.data);
                console.log(data.data);
            } catch (error) {
                console.error("Error fetching tag number:", error);
            } finally {
                setLoading(false);
            }
        }

        const fetchTagnumber = async () => {
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
    

    const handleEditmoc = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        selectedTagNumber.length > 0 ? formData.append('tag_number_id', selectedTagNumber) : '';

        try {
            setIsSubmitting(true);
            const res = await updateMoc(id, formData);
            if (res.success) {
                Swal.fire("Berhasil!", "success update moc!", "success");
                navigate('/moc');
            } else {
                setValidation(res.response?.data.errors || []);
                Swal.fire("Error!", "failed update moc!", "error");
            }
        } catch (error) {
            console.error("Error updating moc:", error);
            setValidation(error.response?.data.errors || []);
            Swal.fire("Error!", "something went wrong update moc!", "error");
        } finally {
            setIsSubmitting(false);
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
                className="uppercase"
                separator={
                <IconChevronRight className='text-emerald-950' stroke={2} />
                }
            >
                <Link className='hover:underline text-emerald-950' to='/moc'>
                moc
                </Link>
                <Typography className='text-lime-500'>Edit Moc</Typography>
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
                    onSubmit={(e) => handleEditmoc(e)}
                >
                    <div className='flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2'>
                        <div className='w-full space-y-1'>
                            <label className='text-emerald-950' htmlFor='unit_id'>
                                Area <sup className='text-red-500'>*</sup>
                            </label>
                            <select 
                                name="unit_id" 
                                id="unit_id" 
                                className="w-full px-1 py-2 border border-gray-300 rounded-md"
                                defaultValue={moc.unit_id}
                            >
                                <option value="">Pilih Unit</option>
                                <option value="0">All Area</option>
                                {
                                    unit.length > 0 ?
                                    unit.map((item) => (
                                        <option key={item.id} value={item.id}>
                                            {item.unit_name}
                                        </option>
                                    ))
                                    : <option value="">Tidak ada unit tersedia</option>
                                }
                            </select>
                                {validation.unit_id && (
                                    validation.unit_id.map((item, index) => (
                                        <div key={index}>
                                        <small className="text-red-600 text-sm">{item}</small>
                                        </div>
                                    ))
                                )}
                        </div>
                        <div className='w-full space-y-1'>
                            <label className='text-emerald-950' htmlFor='category_id'>
                                Kategori Peralatan <sup className='text-red-500'>*</sup>
                            </label>
                            <select 
                                name="category_id" 
                                id="category_id" 
                                className="w-full px-1 py-2 border border-gray-300 rounded-md"
                                defaultValue={moc.category_id}
                            >
                                <option value="">Pilih Kategori Peralatan</option>
                                {
                                    category.length > 0 ?
                                    category.map((item) => (
                                        <option key={item.id} value={item.id}>
                                            {item.category_name}
                                        </option>
                                    ))
                                    : <option value="">Tidak ada Kategori Peralatan</option>
                                }
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
                    <div className='flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2'>
                        <div className='w-full space-y-1'>
                            <input type="hidden" name="tag_number_id" value={selectedTagNumber || ''} />
                            <label className='text-emerald-950'>
                                Tag Number
                            </label>
                            <Autocomplete
                                multiple
                                id="tag_number_id"
                                options={Array.isArray(tag_number) ? tag_number : []}
                                getOptionLabel={(option) => option.tag_number || ''}
                                isOptionEqualToValue={(option, value) => option.id === value.id}
                                value={tag_number.filter((item) => selectedTagNumber.includes(item.id))}
                                onChange={(e, value) => {
                                    setSelectedTagNumber(value.map((item) => item.id));
                                }}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        name="tag_number_id"
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
                                No Dokumen <sup className='text-red-500'>*</sup>{' '}
                            </label>
                            <input
                            type='text'
                            name='no_dokumen'
                            id='no_dokumen'
                            placeholder='Nomor Dokumen'
                            className='w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-950'
                            defaultValue={moc.no_dokumen}
                            required
                            />
                                {validation.no_dokumen && (
                                    validation.no_dokumen.map((item, index) => (
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
                                Perihal <sup className='text-red-500'>*</sup>{' '}
                            </label>
                            <input
                            type='text'
                            name='perihal'
                            id='perihal'
                            placeholder='perihal'
                            defaultValue={moc.perihal}
                            className='w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-950'
                            required
                            />
                                {validation.perihal && (
                                    validation.perihal.map((item, index) => (
                                        <div key={index}>
                                        <small className="text-red-600 text-sm">{item}</small>
                                        </div>
                                    ))
                                )}
                        </div>
                        <div className='w-full space-y-1'>
                            <label className='text-emerald-950'>
                                Tipe Moc <sup className='text-red-500'>*</sup>{' '}
                            </label>
                            <select
                                className="w-full px-1 py-2 border border-gray-300 rounded-md"
                                name="tipe_moc"
                                id="tipe_moc"
                                defaultValue={moc.tipe_moc}
                            >
                                <option value="0">Rekomendasi Rutin</option>
                                <option value="1">Rekomendasi TA</option>
                                <option value="2">Rekomendasi Overhaul</option>
                                <option value="3">Dokumen Kajian/Evaluasi</option>
                                <option value="4">Permintaan Tools</option>
                                <option value="5">Dokumen Kantor Pusat</option>
                            </select>
                                {validation.tipe_moc && (
                                    validation.tipe_moc.map((item, index) => (
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
                                Tanggal Terbit <sup className='text-red-500'>*</sup>{' '}
                            </label>
                            <input
                            type='date'
                            name='tanggal_terbit'
                            id='tanggal_terbit'
                            defaultValue={moc.tanggal_terbit}
                            className='w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-950'
                            required
                            />
                                {validation.tanggal_terbit && (
                                    validation.tanggal_terbit.map((item, index) => (
                                        <div key={index}>
                                        <small className="text-red-600 text-sm">{item}</small>
                                        </div>
                                    ))
                                )}
                        </div>
                        <div className='w-full space-y-1'>
                            <label className='text-emerald-950'>
                                Dokumen moc
                            </label>
                            <input
                            type='file'
                            name='moc_file'
                            id='moc_file'
                            className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-950'
                            
                            />
                            <div className='flex flex-row justify-between items-center w-full border bg-lime-400 rounded p-1'>
                                {moc.moc_file ? (
                                <>
                                    <Link
                                    to={`${base_public_url}moc/${moc.moc_file}`}
                                    target='_blank'
                                    className='text-emerald-950 hover:underline cursor-pointer'
                                    >
                                    {moc.moc_file}
                                    </Link>
                                </>
                                ) : (
                                <span>-</span>
                                )}
                            </div>
                                {validation.moc_file && (
                                    validation.moc_file.map((item, index) => (
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
                            onClick={() => navigate('/moc')}
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

export default EditMoc