import { Autocomplete, Breadcrumbs, TextField, Typography } from "@mui/material"
import Header from "../Header"
import { IconChevronRight } from "@tabler/icons-react"
import { Link, useNavigate } from "react-router-dom"
import { useState } from "react"
import { getTagnumber } from "../../services/tagnumber.service"
import { useEffect } from "react"
import { IconLoader2 } from "@tabler/icons-react"
import { addMoc } from "../../services/moc.service"
import Swal from "sweetalert2"
import { ActiveUnit } from "../../services/unit.service"
import { ActiveCategory } from "../../services/category.service"
import { IconArrowLeft } from "@tabler/icons-react"
import { IconArrowRight } from "@tabler/icons-react"

const AddMoc = () => {
    const [validation, setValidation] = useState([])
    const [loading, setLoading] = useState(true)
    const [tag_number, setTagNumber] = useState([])
    const [unit, setUnit] = useState([])
    const [category, setCategory] = useState([])
    const [selectedTagNumber, setSelectedTagNumber] = useState([])
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [hide, setHide] = useState(false);

    useEffect(() => {
        fetchUnit()
        fetchCategory()
        fetchTagnumber()
    }, [])

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
            console.error("Error fetching category:", error);
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

    

    const handleAddMoc = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        selectedTagNumber ? formData.append('tag_number_id', selectedTagNumber) : '';

        try {
            setIsSubmitting(true);
            const res = await addMoc(formData);
            if (res.success) {
                Swal.fire("Berhasil!", "success add Moc!", "success");
                navigate('/moc');
            } else {
                setValidation(res.response?.data.errors || []);
                Swal.fire("Error!", "failed add Moc!", "error");
            }
        } catch (error) {
            console.error("Error adding Moc:", error);
            setValidation(error.response?.data.errors || []);
            Swal.fire("Error!", "something went wrong add Moc!", "error");
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
                Moc
                </Link>
                <Typography className='text-lime-500'>Tambah Moc</Typography>
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
                    onSubmit={(e) => handleAddMoc(e)}
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
                            <label className='text-emerald-950'>
                                Tag Number
                            </label>
                            <Autocomplete
                                multiple
                                id="tag_number_id"
                                options={Array.isArray(tag_number) ? tag_number : []}
                                getOptionLabel={(option) => option.tag_number || ''}
                                isOptionEqualToValue={(option, value) => option.id === value.id}
                                // value={tag_number.find((item) => item.id === selectedTagNumber) || null}
                                value={tag_number.filter((item) => selectedTagNumber.includes(item.id))}

                                onChange={(e, value) => {
                                    setSelectedTagNumber(value.map((item) => item.id));
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
                                No Dokumen <sup className='text-red-500'>*</sup>{' '}
                            </label>
                            <input
                            type='text'
                            name='no_dokumen'
                            id='no_dokumen'
                            placeholder='Nomor Dokumen'
                            className='w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-950'
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
                                Tipe Memo <sup className='text-red-500'>*</sup>{' '}
                            </label>
                            <select
                                className="w-full px-1 py-2 border border-gray-300 rounded-md"
                                name="tipe_moc"
                                id="tipe_moc"
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
                                Dokumen moc <sup className='text-red-500'>*</sup>{' '}
                            </label>
                            <input
                            type='file'
                            name='moc_file'
                            id='moc_file'
                            className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-950'
                            required
                            />
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

export default AddMoc