import React, { useState, useEffect } from 'react';
import Header from '../Header'
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Breadcrumbs, Typography } from '@mui/material';
import { IconChevronRight } from '@tabler/icons-react';
import Swal from 'sweetalert2';
import {
  getCoiById,
  updateCoi,
} from '../../services/coi.service';

import { getUnit } from '../../services/unit.service';
import { getCategoryByUnit } from '../../services/category.service';
import { getTypeByCategory } from '../../services/type.service';
import { getTagnumberByType, getTagnumberByTagnumber, getTagnumberByTagnumberId } from '../../services/tagnumber.service';
import * as motion from 'motion/react-client';
const EditCoi = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [IsRLA, setIsRLA] = useState(false);
  const [IsUnit, setIsUnit] = useState([]);
  const [selectedUnit, setSelectedUnit] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [selectedType, setSelectedType] = useState('');
  const [filteredTypes, setFilteredTypes] = useState([]);
  const [selectedTagNumber, setSelectedTagNumber] = useState('');
  const [Tagnumbers, setTagnumbers] = useState([]);
  const [coi, setCoi] = useState({});
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
  setIsLoading(true);
  getUnit((data) => {
    setIsUnit(data.data || []);
  })
  getCoiById(id, (data) => {
    setCoi(data.data || {});
    setIsRLA(!!data.data?.rla);
    setIsLoading(false);
  });
}, [id]);

useEffect(() => {
  if (coi?.tag_number_id) {
    setIsLoading(true);
    getTagnumberByTagnumberId(coi.tag_number_id, (data) => {
      if (data?.data) {
        handleUnitChange(data.data.unit_id, true);
        handleCategoryChange(data.data.category_id, true);
        handleTypeChange(data.data.type_id, true);
        setSelectedTagNumber(data.data.tag_number_id);
      }
      setIsLoading(false);
    });
  }
}, [coi?.tag_number_id]);

if (isLoading) {
  return <div>Loading...</div>;
}

if (!coi || Object.keys(coi).length === 0) {
  return <div>Data COI tidak ditemukan.</div>;
}


  const handleUnitChange = (unitId, force = false) => {
    setSelectedUnit(unitId);
    setFilteredTypes([]);
    setTagnumbers([]);
    if(!force) {
        setSelectedCategory('');
        setSelectedType('');
        setSelectedTagNumber('');
    }
    setSelectedCategory(coi.category_id || '');
    if (unitId) {
        getCategoryByUnit(unitId, (data) => {
            setFilteredCategories(data?.data || []);
        });
    } else {
        setFilteredCategories([]);
    }
  };

  const handleCategoryChange = (categoryId, force = false) => {
      setSelectedCategory(categoryId);
      setSelectedType(coi.type_id || '');
      setTagnumbers([]);
      if(!force) {
          setSelectedType('');
          setSelectedTagNumber('');
      }
      if (categoryId) {
          getTypeByCategory(categoryId, (data) => {
              setFilteredTypes(data?.data || []);
              
          });
      } else {
          setFilteredTypes([]);
      }
  };

  const handleTypeChange = (typeId, tagname='') => {
      setSelectedType(typeId);
      setSelectedTagNumber(tagname);
      if (typeId) {
          getTagnumberByType(typeId, (data) => {
              setTagnumbers(data?.data || []);
              
          });
      } else {
          setTagnumbers([]);
      }
  };

  const handleUpdateCoi = (e) => {
    e.preventDefault();

    const formData = new FormData();
    if(e.target.coi_certificate.files[0]){
      formData.append('coi_certificate', e.target.coi_certificate.files[0] || null);
    }
    formData.append('tag_number_id', e.target.tag_number.value);
    formData.append('no_certificate', e.target.no_certificate.value);
    formData.append('issue_date', e.target.issue_date.value);
    formData.append('overdue_date', e.target.overdue_date.value);
    formData.append('rla', e.target.rla.value);

    if (IsRLA) {
        formData.append('rla_issue', e.target.rla_issue.value);
        formData.append('rla_overdue', e.target.rla_overdue.value);
        if(e.target.file_rla.files[0]){
            formData.append('file_rla', e.target.file_rla.files[0] || null);
        }
    }
    
    
    updateCoi(id, formData, (res) => {
        if (res.success) {
            Swal.fire({
                title: 'Berhasil!',
                text: 'COI berhasil diperbarui!',
                icon: 'success',
            });
            navigate('/coi');
        } else {
            Swal.fire({
                title: 'Gagal!',
                text: 'COI gagal diperbarui!',
                icon: 'error',
            });
        }
    });
  };
  
  return (
    <div className="flex flex-col md:flex-row w-full">
        <Header />
        <div className="flex flex-col md:pl-64 w-full px-2 py-4 space-y-3">
          <div className="w-full bg-white shadow-sm px-2 py-4 rounded-lg space-y-2">
            <Breadcrumbs aria-label="breadcrumb" separator={<IconChevronRight className='text-emerald-950' stroke={2} />}>
                <Link className='hover:underline text-emerald-950' to="/">
                    Home
                </Link>
                <Link className='hover:underline text-emerald-950' to="/coi">
                    COI
                </Link>
                <Typography className='text-lime-500'>Edit COI</Typography>
            </Breadcrumbs>
            <div>
              <form encType='multipart/form-data' onSubmit={(e) => handleUpdateCoi(e)}>
                <div className="flex flex-col space-y-2">
                    <div className='flex flex-row space-x-2'>
                        <div className='w-full'>
                            <label htmlFor="unit" className="text-emerald-950">Unit <sup className='text-red-500'>*</sup></label>
                            <select
                                name="unit_id"
                                id="unit"
                                className="w-full px-1 py-2 border border-gray-300 rounded-md"
                                value={selectedUnit}
                                onChange={(e) => handleUnitChange(e.target.value)}
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
                        <div className='w-full'>
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
                                    : <option value="" disabled>Kategori tidak ditemukan</option>
                                }
                            </select>
                        </div>
                    </div>
                    <div className='flex flex-row space-x-2'>
                        <div className='w-full'>
                            <label htmlFor="type" className="text-emerald-950">Tipe</label>
                            <select
                                name="type_id"
                                id="type"
                                className="w-full px-1 py-2 border border-gray-300 rounded-md"
                                value={selectedType}
                                onChange={(e) => handleTypeChange(e.target.value)}
                            >
                                <option value="">Pilih Tipe</option>
                                {filteredTypes.length > 0
                                    ? filteredTypes.map((type) => (
                                        <option key={type.id} value={type.id}>
                                            {type.type_name}
                                        </option>
                                    ))
                                    : <option value="" disabled>Tipe tidak ditemukan</option>}
                            </select>
                        </div>
                        <div className='w-full'>
                            <label htmlFor="tag_number" className="text-emerald-950">Tag Number</label>
                            <select
                                name="tag_number"
                                id="tag_number"
                                className="w-full px-1 py-2 border border-gray-300 rounded-md"
                                value={selectedTagNumber}
                                onChange={(e) => setSelectedTagNumber(e.target.value)}
                            >
                                <option value="">Pilih Tag Number</option>
                                {Tagnumbers.length > 0
                                    ? Tagnumbers.map((tagnumber) => (
                                        <option key={tagnumber.id} value={tagnumber.id}>
                                            {tagnumber.tag_number}
                                        </option>
                                    ))
                                    : <option value="" disabled>Tag Number tidak ditemukan</option>}
                            </select>
                        </div>
                    </div>
                    <div className='flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2'>
                        <div className='w-full'>
                            <label className='text-emerald-950'>No Certificate <sup className='text-red-500'>*</sup></label>
                            <input
                                type="text"
                                name="no_certificate"
                                id="no_certificate"
                                placeholder="No Certificate"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                defaultValue={coi.no_certificate}
                                required
                            />
                        </div>
                        <div className='w-full'>
                            <label className='text-emerald-950'>COI Certificate</label>
                            <input
                                type="file"
                                name="coi_certificate"
                                id="coi_certificate"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                            />
                        </div>
                    </div>
                        <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2">
                            <div className="w-full">
                                <label className="text-emerald-950">Issue Date <sup className="text-red-500">*</sup></label>
                                <input
                                    type="date"
                                    name="issue_date"
                                    id="issue_date"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                    defaultValue={coi.issue_date}
                                    required
                                />
                            </div>
                            <div className="w-full">
                                <label className="text-emerald-950">Overdue Date <sup className="text-red-500">*</sup></label>
                                <input
                                    type="date"
                                    name="overdue_date"
                                    id="overdue_date"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                    defaultValue={coi.overdue_date}
                                    required
                                />
                            </div>
                        </div>
                        <div className="w-full">
                            <label htmlFor="rla" className="text-emerald-950">RLA</label>
                            <select
                                name="rla"
                                id="rla"
                                className="w-full px-1 py-2 border border-gray-300 rounded-md"
                                value={IsRLA ? 1 : 0}
                                onChange={(e) => setIsRLA(e.target.value === '1')}
                            >
                                <option value="">Pilih RLA</option>
                                <option value="1">Yes</option>
                                <option value="0">No</option>
                            </select>
                        </div>
                        {IsRLA && (
                            <div className="space-y-2">
                                <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2">
                                    <div className="w-full">
                                        <label className="text-emerald-950">RLA Issue Date</label>
                                        <input
                                            type="date"
                                            name="rla_issue"
                                            id="rla_issue"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                            defaultValue={coi.rla_issue}
                                        />
                                    </div>
                                    <div className="w-full">
                                        <label className="text-emerald-950">RLA Overdue Date</label>
                                        <input
                                            type="date"
                                            name="rla_overdue"
                                            id="rla_overdue"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                            defaultValue={coi.rla_overdue}
                                        />
                                    </div>
                                </div>
                                <div className="w-full">
                                    <label className="text-emerald-950">RLA File</label>
                                    <input
                                        type="file"
                                        name="file_rla"
                                        id="file_rla"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                    />
                                </div>
                            </div>
                        )}
                </div>
                <div className="w-full flex flex-row space-x-2 py-2">
                    <motion.button
                    whileTap={{ scale: 0.9 }}
                    whileHover={{ scale: 0.98 }}
                    className="w-full bg-emerald-950 text-white py-2 rounded-md uppercase"
                    type="submit"
                    >
                    Submit
                    </motion.button>
                    <button
                        type="button"
                        className="w-1/3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 mr-2"
                        onClick={() => navigate('/coi')}
                    >
                        Batal
                    </button>
                </div>
            </form>
            </div>
          </div>
        </div>
    </div>
  )
}

export default EditCoi