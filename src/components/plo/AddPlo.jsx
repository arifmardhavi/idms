import React from 'react'
import Header from '../Header'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom';
import { Breadcrumbs, Typography } from '@mui/material'
import { IconChevronRight } from '@tabler/icons-react'
import { useState, useEffect } from 'react'
import { addPlo } from '../../services/plo.service'
import { getUnit } from '../../services/unit.service'
import { getCategoryByUnit } from '../../services/category.service';
import { getTypeByCategory } from '../../services/type.service';
import { getTagnumberByType } from '../../services/tagnumber.service'
import Swal from 'sweetalert2';

const AddPlo = () => {
    const navigate = useNavigate();
    const [IsRLA, setIsRLA] = useState(false)
    const [IsUnit, setIsUnit] = useState([]);
    const [selectedUnit, setSelectedUnit] = useState('');
    const [filteredCategories, setFilteredCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [filteredTypes, setFilteredTypes] = useState([]);
    const [selectedType, setSelectedType] = useState('');
    const [Tagnumbers, setTagnumbers] = useState([]);

    useEffect(() => {
        getUnit((data) => {
            setIsUnit(data.data);
        });
    }, []);

    // handle onChange input category by unit
    const handleUnitChange = (unitId) => {
        setSelectedUnit(unitId); // Simpan unit yang dipilih
        setFilteredTypes([]); // Kosongkan jika ada unit yang baru dipilih
        setTagnumbers([]); // Kosongkan jika ada unit yang baru dipilih
        if (unitId) {
        // Memanggil API untuk mendapatkan kategori berdasarkan unit
        getCategoryByUnit(unitId, (data) => {
            console.log(data);
            if (data === null) {
            setFilteredCategories([]);
            }else{
            setFilteredCategories(data.data);
            }
        });
        } else {
        setFilteredCategories([]); // Kosongkan jika tidak ada unit dipilih
        }
    };
    // handle onChange input category by unit
    const handleCategoryChange = (categoryId) => {
        setSelectedCategory(categoryId); // Simpan kategori yang dipilih
        setTagnumbers([]); // Kosongkan jika ada kategori yang baru dipilih
        if (categoryId) {
        // Memanggil API untuk mendapatkan tipe berdasarkan kategori
        getTypeByCategory(categoryId, (data) => {
            console.log(data);
            if (data === null) {
            setFilteredTypes([]);
            }else{
            setFilteredTypes(data.data);
            }
        });
        } else {
        setFilteredTypes([]); // Kosongkan jika tidak ada unit dipilih
        }
    };

    // handle onChange input type by category
    const handleTypeChange = (typeId) => {
        setSelectedType(typeId); // Simpan tipe yang dipilih
        if (typeId) {
        // Memanggil API untuk mendapatkan tagnumber berdasarkan tipe
        getTagnumberByType(typeId, (data) => {
            console.log(data);
            if (data === null) {
            setTagnumbers([]);
            }else{
            setTagnumbers(data.data);
            }
        });
        } else {
        setTagnumbers([]); // Kosongkan jika tidak ada unit dipilih
        }
    }

    const handleAddPlo = (e) => {
        e.preventDefault();
        let tagval = '';
        if(e.target.tag_number.value == '' || e.target.tag_number.value == null){
            IsUnit.map((unit) => {
                if(unit.id == e.target.unit_id.value){
                    tagval = unit.unit_name;
                }
            })
        }else{
            tagval = e.target.tag_number.value
        }

        const formData = new FormData(); // Buat instance FormData
        formData.append('tag_number', tagval);
        formData.append('no_certificate', e.target.no_certificate.value);
        formData.append('plo_certificate', e.target.plo_certificate.files[0]);
        formData.append('issue_date', e.target.issue_date.value);
        formData.append('overdue_date', e.target.overdue_date.value);
        formData.append('rla', e.target.rla.value);

        if (IsRLA) {
            formData.append('rla_issue', e.target.rla_issue.value);
            formData.append('rla_overdue', e.target.rla_overdue.value);
            formData.append('file_rla', e.target.file_rla.files[0]);
        }
         
        addPlo(formData, (res) => {
            if (res.success) {
                Swal.fire({
                    title: 'Berhasil!',
                    text: 'PLO berhasil ditambahkan!',
                    icon: 'success',
                });
                // Redirect to PLO page
                navigate('/plo');
            } else {
                Swal.fire({
                    title: 'Gagal!',
                    text: 'PLO gagal ditambahkan!',
                    icon: 'error',
                });
            }
        });
    }

  return (
    <div className="flex flex-col md:flex-row w-full">
        <Header />
        <div className="flex flex-col md:pl-64 w-full px-2 py-4 space-y-3">
            <div className="w-full bg-white shadow-sm px-2 py-4 rounded-lg space-y-2"> 
                <Breadcrumbs aria-label="breadcrumb" separator={<IconChevronRight className='text-emerald-950' stroke={2} />}>
                    <Link className='hover:underline text-emerald-950' to="/">
                    Home
                    </Link>
                    <Link
                    className='hover:underline text-emerald-950'
                    to="/plo"
                    >
                    PLO
                    </Link>
                    <Typography className='text-lime-500'>Tambah PLO</Typography>
                </Breadcrumbs>
                <div>
                    <form method="post" encType='multipart/form-data' onSubmit={(e) => handleAddPlo(e)}>
                        <div className="flex flex-col space-y-2">
                            <div className='flex flex-row space-x-2'>
                                <div className='w-full' >
                                    <label htmlFor="unit" className="text-emerald-950">Unit <sup className='text-red-500'>*</sup></label>
                                    <select
                                        name="unit_id"
                                        id="unit"
                                        className="w-full px-1 py-2 border border-gray-300 rounded-md"
                                        value={selectedUnit}
                                        onChange={(e) => handleUnitChange(e.target.value)} // Panggil fungsi saat unit berubah
                                        required
                                        >
                                        <option value="">Pilih Unit</option>
                                        {IsUnit.map((unit) => (
                                            <option key={unit.id} value={unit.id}>
                                            {unit.unit_name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className='w-full' >
                                    <label htmlFor="category" className="text-emerald-950">Kategori</label>
                                    <select
                                        name="category_id"
                                        id="category"
                                        className="w-full px-1 py-2 border border-gray-300 rounded-md"
                                        value={selectedCategory}
                                        onChange={(e) => handleCategoryChange(e.target.value)}
                                        
                                    >
                                        <option value="">Pilih Kategori</option>
                                        {
                                        filteredCategories.length > 0 
                                            ? filteredCategories.map((category) => (
                                                <option key={category.id} value={category.id}>
                                                {category.category_name}
                                                </option>
                                            ))
                                            : <option value="" disabled>Tidak ada kategori</option>
                                        }
                                    </select>
                                </div>
                            </div>
                            <div className='flex flex-row space-x-2'>
                                <div className='w-full' >
                                    <label htmlFor="type" className="text-emerald-950">Tipe</label>
                                    <select
                                        name="type_id"
                                        id="type"
                                        className="w-full px-1 py-2 border border-gray-300 rounded-md"
                                        value={selectedType}
                                        onChange={(e) => handleTypeChange(e.target.value)}
                                        
                                    >
                                        <option value="">Pilih Tipe</option>
                                        {
                                        filteredTypes.length > 0 
                                            ? filteredTypes.map((type) => (
                                                <option key={type.id} value={type.id}>
                                                {type.type_name}
                                                </option>
                                            ))
                                            : <option value="" disabled>Tidak ada Tipe</option>
                                        }
                                    </select>
                                </div>
                                <div className='w-full' >
                                    <label htmlFor="tag_number" className="text-emerald-950">Tag Number</label>
                                    <select
                                        name="tag_number"
                                        id="tag_number"
                                        className="w-full px-1 py-2 border border-gray-300 rounded-md"
                                        
                                    >
                                        <option value="">Pilih Tag Number</option>
                                        {
                                        Tagnumbers.length > 0 
                                            ? Tagnumbers.map((tagnumber) => (
                                                <option key={tagnumber.id} value={tagnumber.tag_number}>
                                                {tagnumber.tag_number}
                                                </option>
                                            ))
                                            : <option value="" disabled>Tidak ada Tag Number</option>
                                        }
                                    </select>
                                </div>
                            </div>
                            <div className='flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2'>
                                <div className='w-full'>
                                    <label className='text-emerald-950'>No Certificate <sup className='text-red-500'>*</sup> </label>
                                    <input
                                        type="text"
                                        name="no_certificate"
                                        id="no_certificate"
                                        placeholder="No Certificate"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-950"
                                        required
                                    />
                                </div>
                                <div className='w-full' >
                                    <label className='text-emerald-950'>PLO Certificate <sup className='text-red-500'>*</sup></label>
                                    <input
                                        type="file"
                                        name="plo_certificate"
                                        id="plo_certificate"
                                        className="w-full px-3 py-2 md:pt-2 md:pb-1 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-950"
                                        required
                                    />
                                </div>
                            </div>
                            <div className='flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2'>
                                <div className='flex flex-row space-x-2 w-full md:w-2/3'>
                                    <div className='w-full'>
                                        <label className='text-emerald-950'>Issue Date  <sup className='text-red-500'>*</sup></label>
                                        <input
                                            type="date"
                                            name="issue_date"
                                            id="issue_date"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-950"
                                            required
                                        />
                                    </div>
                                    <div className='w-full'>
                                        <label className='text-emerald-950'>Due Date  <sup className='text-red-500'>*</sup></label>
                                        <input
                                            type="date"
                                            name="overdue_date"
                                            id="due_date"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-950"
                                            required
                                        />
                                    </div>
                                </div>
                                <div className='w-full md:w-1/3' >
                                    <label className='text-emerald-950' htmlFor='rla'>RLA</label>
                                    <select
                                        name="rla"
                                        id="rla"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-950"
                                        onChange={(e) => e.target.value == 1 ? setIsRLA(true) : setIsRLA(false)}
                                    >
                                        <option value="0">No</option>
                                        <option value="1">Yes</option>
                                    </select>
                                </div>
                            </div>
                            {
                                IsRLA &&
                                <div className='space-y-2'>
                                    <div className='flex flex-row space-x-2'>
                                        <div className='w-full'>
                                            <label htmlFor="rla_issue" className='text-emerald-950'>RLA Issue</label>
                                            <input
                                                type="date"
                                                name="rla_issue"
                                                id="rla_issue"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-950"
                                            />
                                        </div>
                                        <div className='w-full'>
                                            <label htmlFor="rla_due" className='text-emerald-950'>RLA Due</label>
                                            <input
                                                type="date"
                                                name="rla_overdue"
                                                id="rla_due"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-950"
                                            />
                                        </div>
                                    </div>
                                    <div className='w-full'>
                                        <label className='text-emerald-950'>RLA Certificate</label>
                                        <input
                                            type="file"
                                            name="file_rla"
                                            id="rla_certificate"
                                            className="w-full px-3 py-2 md:pt-2 md:pb-1 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-950"
                                        />
                                    </div>
                                </div>
                                
                            }
                            <button type="submit" className="w-full bg-emerald-950 text-white px-4 py-2 rounded-lg">
                                Save
                            </button>
                        </div>
                    </form>
                </div>
                  
            </div>

        </div>
    </div>
  )
}

export default AddPlo