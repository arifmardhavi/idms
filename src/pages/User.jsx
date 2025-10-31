import Header from '../components/Header'
import { useState } from 'react'
import { useEffect } from 'react'
import { addUser, deleteUser, getUser, nonactiveUser, updateUser } from '../services/user.service'
import * as motion from 'motion/react-client';
import { DataGrid, GridToolbarQuickFilter, GridLogicOperator } from '@mui/x-data-grid';
import { IconArticle, IconPencil, IconTrash } from '@tabler/icons-react';
import { IconCircleMinus } from '@tabler/icons-react';
import Swal from 'sweetalert2';
import { IconRefresh } from '@tabler/icons-react';
import { IconPlus } from '@tabler/icons-react'
import { IconEye } from '@tabler/icons-react';
import { IconEyeClosed } from '@tabler/icons-react';
import { IconLoader2 } from '@tabler/icons-react';
import { Autocomplete, TextField, Tooltip } from '@mui/material';
import { getContract } from '../services/contract.service';
import { jwtDecode } from 'jwt-decode';

const User = () => {
    const [IsUser, setIsUser] = useState([])
    const [Loading, setLoading] = useState(false);
    const [addMode, setAddMode] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [validation, setValidation] = useState([]);
    const [editUser, setEditUser] = useState({});
    const [hide, setHide] = useState(false);
    const [isLevel, setIsLevel] = useState(false);
    const [contract, setContract] = useState(false);
    const [selectedContract, setSelectedContract] = useState([]);
    const token = localStorage.getItem('token');
    let userLevel = '';
    try {
        userLevel = String(jwtDecode(token).level_user);
      } catch (error) {
        console.error('Invalid token:', error);
        localStorage.removeItem('token');
      }
    useEffect(() => {
      fetchUsers();
      fetchContract();
    }, [])

    const fetchContract = async() => {
      try {
        setLoading(true);
        const data = await getContract();
        setContract(data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    const fetchUsers = async () => {
      try {
        setLoading(true);
        const data = await getUser();
        userLevel == 99 ? setIsUser(data.data) : setIsUser(data.data.filter((item) => item.level_user != 99));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    const handleAddUser = async (e) => {
      e.preventDefault();
      try {
      setIsSubmitting(true);
      const formData = new FormData(e.target);
      formData.delete('contract_id[]');
      selectedContract.forEach((id) => {
        formData.append('contract_id[]', id);
      });
      console.log(formData);

        const data = await addUser(formData);
        if (data.success) {
          fetchUsers();
          setIsSubmitting(false);
          setAddMode(false);
          setValidation([]);
          Swal.fire('Berhasil!', 'User berhasil ditambahkan!', 'success');
        } else {
          console.log(data.response.data.errors);
          setValidation(data.response?.data?.errors || []);
          Swal.fire('Gagal!', 'Terjadi kesalahan saat menambahkan user!', 'error');
        }
      } catch (err) {
        console.error(err);
        setValidation(err.response?.data?.errors || []);
        Swal.fire('Gagal!', 'Terjadi kesalahan saat menambahkan user!', 'error');
      } finally {
        setIsSubmitting(false);
      }
    };

    const handleClickEdit = (row) => {
      setAddMode(false);
      setEditMode(true);
      setEditUser(row);
      // Initialize isLevel and selectedContract based on user being edited
      setIsLevel(row.level_user === 3);
      if (row.contracts && Array.isArray(row.contracts)) {
        setSelectedContract(row.contracts);
      } else {
        setSelectedContract([]);
      }
    }

    // update User
    const handleUpdate = async (event) => {
      event.preventDefault();
      try {
        setIsSubmitting(true);

        const form = event.target;
        const formData = new FormData(form);
        console.log(selectedContract);

        // Ambil level_user dengan pasti
        const levelUser = form.level_user.value;
        formData.set('level_user', levelUser); // pastikan dikirim, walau tidak berubah

        // Hapus semua kemungkinan duplikat field kontrak
        formData.delete('contract_id');
        formData.delete('contract_id[]');
        formData.append('contract_id', selectedContract);

        console.log(formData);

        // // Jika vendor, kirim semua kontrak
        // if (levelUser === '3' || parseInt(levelUser) === 3) {
        //   selectedContract.forEach((id) => {
        //     formData.append('contract_id[]', id);
        //   });
        // }

        // // DEBUG: lihat semua yang dikirim
        // // for (let [key, val] of formData.entries()) {
        // //   console.log(`${key}: ${val}`);
        // // }

        const data = await updateUser(editUser.id, formData);

        if (data.success) {
          console.log(data);
          console.log(formData);
          Swal.fire('Berhasil!', 'User berhasil diperbarui!', 'success');
          fetchUsers();
          setEditMode(false);
          setEditUser({});
          setValidation([]);
          setSelectedContract([]);
          setIsLevel(false);
        } else {
          setValidation(data.response?.data?.errors || []);
          Swal.fire('Gagal!', 'Terjadi kesalahan saat memperbarui User!', 'error');
        }
      } catch (error) {
        console.error(error);
        setValidation(error.response?.data?.errors || []);
        Swal.fire('Gagal!', 'Terjadi kesalahan saat memperbarui User!', 'error');
      } finally {
        setIsSubmitting(false);
      }
    };


    
    // Nonaktifkan User
    const handleDelete = async (user) => {
      const confirm = await Swal.fire({
        title: 'Apakah Anda yakin?',
        text: 'Data user akan dihapus permanent!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Ya, Hapus!',
        cancelButtonText: 'Batal',
      });
    
      if (confirm.isConfirmed) {
        try {
          await deleteUser(user.id);
          Swal.fire('Berhasil!', 'User berhasil dihapus!', 'success');
          fetchUsers();
        } catch (error) {
          console.error(error);
          Swal.fire('Gagal!', 'Terjadi kesalahan saat hapus user!', 'error');
        }
      }
    };

    // Nonaktifkan User
    const handleNonactive = async (user) => {
      const confirm = await Swal.fire({
        title: 'Apakah Anda yakin?',
        text: 'Data user akan dinonaktifkan!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Ya, Nonaktifkan!',
        cancelButtonText: 'Batal',
      });
    
      if (confirm.isConfirmed) {
        try {
          await nonactiveUser(user.id);
          Swal.fire('Berhasil!', 'User berhasil dinonaktifkan!', 'success');
          fetchUsers();
        } catch (error) {
          console.error(error);
          Swal.fire('Gagal!', 'Terjadi kesalahan saat menonaktifkan user!', 'error');
        }
      }
    };
    

    const columns = [
        { field: 'fullname', headerName: 'Nama', width: 200, renderCell: (params) => <div className="py-4">{params.value}</div> },
        { field: 'email', headerName: 'Email', width: 300, renderCell: (params) => <div className="py-4">{params.value}</div> },
        { 
          field: 'level_user', 
          headerName: 'Level User',
          width: 120,
          valueGetter: (params) => params == 1 ? 'Admin' : params == 2 ? 'Inputer' : params == 3 ? 'Vendor' : params == 4 ? 'Viewer All' : params == 5 ? 'Viewer' : 'Super Admin',
          renderCell: (params) => (
            <div className={`${params.row.level_user == '1' ? 'bg-lime-300 text-emerald-950' : 'text-lime-300 bg-emerald-950'} my-2 p-2 rounded flex flex-col justify-center items-center`}>
              {params.row.level_user == '1' ? 'Admin' : params.row.level_user == '2' ? 'Inputer' : params.row.level_user == '3' ? 'Vendor' : params.row.level_user == '4' ? 'Viewer All' : params.row.level_user == '5' ? 'Viewer' : 'Super Admin'}
            </div>
          )
        },
        { 
          field: 'status', 
          headerName: 'Status',
          valueGetter: (params) => params == 1 ? 'Aktif' : 'Nonaktif',
          renderCell: (params) => (
            <div className={`${params.row.status == '1' ? 'bg-lime-300 text-emerald-950' : 'text-lime-300 bg-emerald-950'} my-2 p-2 rounded flex flex-col justify-center items-center`}>
              {params.row.status == '1' ? 'Aktif' : 'Nonaktif'}
            </div>
          )
        },
        {
          field: 'actions',
          headerName: 'Aksi',
          width: 150,
          renderCell: (params) => (
            <div className="flex flex-row justify-center py-2 items-center space-x-2">
              <Tooltip title="Edit" placement="left">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="px-2 py-1 bg-emerald-950 text-lime-300 text-sm rounded"
                onClick={() => {setEditMode(false); handleClickEdit(params.row);}}
              >
                <IconPencil stroke={2} />
              </motion.button>
              </Tooltip>
              {userLevel == 99 && <Tooltip title="Hapus" placement="right">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-2 py-1 bg-emerald-950 text-red-500 text-sm rounded"
                  onClick={() => handleDelete(params.row)}
                >
                  <IconTrash stroke={2} />
                </motion.button>
              </Tooltip>}
              <Tooltip title="Nonaktifkan" placement="right">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="px-2 py-1 bg-emerald-950 text-red-500 text-sm rounded"
                onClick={() => handleNonactive(params.row)}
              >
                <IconCircleMinus stroke={2} />
              </motion.button>
              </Tooltip>
            </div>
          ),
        },
    ];

  const CustomQuickFilter = () => (
    <GridToolbarQuickFilter
      placeholder='cari data disini dan gunakan ; untuk filter lebih spesifik dengan 2 kata kunci'
      className='text-lime-300 px-4 py-4 border outline-none'
      quickFilterParser={(searchInput) =>
        searchInput
          .split(';')
          .map((value) => value.trim())
          .filter((value) => value !== '')
      }
    />
  );

     


  return (
    <div className="flex flex-col md:flex-row w-full">
      { !hide && <Header />}
      <div className={`flex flex-col ${hide ? '' : 'md:pl-64'} w-full px-2 py-4 space-y-3`}>
        <div className='md:flex hidden'>
          <div className={`${hide ? 'hidden' : 'block'} w-fit bg-emerald-950 text-lime-300 p-2 cursor-pointer rounded-md`} onClick={() => setHide(true)}>
            <IconArticle />
          </div>
        </div>
        <div className={` ${hide ? 'block' : 'hidden'}  w-fit bg-emerald-950 text-lime-300 p-2 cursor-pointer rounded-md`} onClick={() => setHide(false)}>
          <IconArticle />
        </div>
        {/* Get user */}
        <div className="w-full bg-white shadow-sm px-2 py-4 rounded-lg space-y-2">
          <div className="flex flex-row justify-between">
            <h1 className="text-xl font-bold uppercase">User</h1>
            <div className='flex flex-row justify-end items-center space-x-2'>
                <motion.a
                    href='/user'
                    whileTap={{ scale: 0.9 }}
                    whileHover={{ scale: 1.1 }}
                    className="flex space-x-1 items-center px-2 py-1 bg-emerald-950 text-lime-300 text-sm rounded"
                >
                    <IconRefresh className='hover:rotate-180 transition duration-500' />
                    <span>Refresh</span>
                </motion.a>
                <motion.button
                    onClick={() => {setAddMode(true); setEditMode(false); setValidation([]); setSelectedContract([]); setIsLevel(false); setIsSubmitting(false);}}
                    whileTap={{ scale: 0.9 }}
                    whileHover={{ scale: 1.1 }}
                    className="flex space-x-1 items-center px-2 py-1 bg-emerald-950 text-lime-300 text-sm rounded"
                >
                    <IconPlus />
                    <span>Tambah</span>
                </motion.button>
            </div>
          </div>
          <div>
            {Loading ? 
              <div className="flex flex-col items-center justify-center h-20">
                  <IconLoader2 stroke={2} className="animate-spin rounded-full h-10 w-10 " />
              </div> 
            : <DataGrid
              rows={IsUser}
              columns={columns}
              disableColumnFilter
              disableColumnSelector
              disableDensitySelector
              pagination
              getRowHeight={() => 'auto'}
              slots={{ toolbar: CustomQuickFilter }}
              slotProps={{
                toolbar: {
                  showQuickFilter: true,
                  printOptions: { disableToolbarButton: true },
                  csvOptions: { disableToolbarButton: true },
                },
              }}
              initialState={{
                pagination: {
                  paginationModel: { pageSize: 10, page: 0 },
                },
                filter: {
                  filterModel: {
                    items: [],
                    quickFilterExcludeHiddenColumns: false,
                    quickFilterLogicOperator: GridLogicOperator.And,
                  },
                },
              }}
              pageSizeOptions={[10, 25, 50, { value: -1, label: 'All' }]}
            /> }
          </div>
        </div>
        {/* Get user */}

        {/* Add Users */}
        {addMode && (
          <div className="w-full h-fit bg-white shadow-sm px-2 py-4 rounded-lg space-y-2">
            <h1 className="text-xl font-bold uppercase">Tambah User</h1>
            <form method="POST" onSubmit={(event) => handleAddUser(event)}>
              <div className="flex flex-col space-y-4">
                <div className='flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2'>
                  <div className='w-full'>
                    <label className="text-sm uppercase" htmlFor="fullname">
                      Nama Lengkap<sup className='text-red-500'>*</sup>
                    </label>
                    <input
                      className="w-full px-1 py-2 border border-gray-300 rounded-md"
                      type="text"
                      name="fullname"
                      id="fullname"
                      placeholder="Masukkan Nama Lengkap..."
                      required
                    />
                    {validation.fullname && (
                      validation.fullname.map((item, index) => (
                        <div key={index}>
                          <small className="text-red-600 text-sm">{item}</small>
                        </div>
                      ))
                    )}
                  </div>
                  <div className='w-full'>
                    <label className="text-sm uppercase" htmlFor="email">
                      Email<sup className='text-red-500'>*</sup>
                    </label>
                    <input
                      className="w-full px-1 py-2 border border-gray-300 rounded-md"
                      type="email"
                      name="email"
                      id="email"
                      placeholder="Masukkan email..."
                      required
                    />
                    {validation.email && (
                      validation.email.map((item, index) => (
                        <div key={index}>
                          <small className="text-red-600 text-sm">{item}</small>
                        </div>
                      ))
                    )}
                  </div>
                </div>
                <div className='flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-2'>
                <div className='w-full'>
                    <label className="text-sm uppercase" htmlFor="username">
                      Username<sup className='text-red-500'>*</sup>
                    </label>
                    <input
                      className="w-full px-1 py-2 border border-gray-300 rounded-md"
                      type="text"
                      name="username"
                      id="username"
                      placeholder="Masukkan Username..."
                      required
                    />
                    {validation.username && (
                      validation.username.map((item, index) => (
                        <div key={index}>
                          <small className="text-red-600 text-sm">{item}</small>
                        </div>
                      ))
                    )}
                  </div>
                  <div className='w-full'>
                    <label className="text-sm uppercase" htmlFor="password">
                      Password<sup className='text-red-500'>*</sup>
                    </label>
                    <div className='flex flex-row items-center space-x-1'>
                      <input
                        className="w-full px-1 py-2 border border-gray-300 rounded-md"
                        type={showPassword ? "text" : "password"}
                        name="password"
                        id="password"
                        placeholder="Masukkan Password..."
                        required
                      />
                      <button className='px-2 py-2 border rounded' type="button" onClick={() => setShowPassword(!showPassword)} >{showPassword ? <IconEye /> : <IconEyeClosed />}</button>
                    </div>
                    {validation.username && (
                      validation.username.map((item, index) => (
                        <div key={index}>
                          <small className="text-red-600 text-sm">{item}</small>
                        </div>
                      ))
                    )}
                  </div>
                </div>
                <div className='flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2'>
                  <div className='w-full flex flex-row space-x-2'>
                    <div className='w-full'>
                      <label htmlFor="level_user">Level User<sup className='text-red-500'>*</sup></label>
                      <select
                        className="w-full px-1 py-2 border border-gray-300 rounded-md"
                        name="level_user"
                        id="level_user"
                        onChange={(e) => {e.target.value == 3 ? setIsLevel(true) : setIsLevel(false)}}
                      >
                        <option value="2">Inputer</option>
                        <option value="1">Admin</option>
                        <option value="3">Vendor</option>
                        <option value="4">Viewer All</option>
                        <option value="5">Viewer</option>
                      </select>
                      {validation.level_user && (
                        validation.level_user.map((item, index) => (
                          <div key={index}>
                            <small className="text-red-600 text-sm">{item}</small>
                          </div>
                        ))
                      )}
                    </div>
                    
                    <div className='w-full'>
                      <label htmlFor="status">Status<sup className='text-red-500'>*</sup></label>
                      <select
                        className="w-full px-1 py-2 border border-gray-300 rounded-md"
                        name="status"
                        id="status"
                      >
                        <option value="1">Aktif</option>
                        <option value="0">Nonaktif</option>
                      </select>
                      {validation.status && (
                        validation.status.map((item, index) => (
                          <div key={index}>
                            <small className="text-red-600 text-sm">{item}</small>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
                <div className='flex flex-row space-x-1'>
                  { isLevel && 
                    <div className='w-full'>
                      <label htmlFor="status">Pilih Kontrak<sup className='text-red-500'>*</sup></label>
                      <Autocomplete
                        multiple
                        id="contract_id"
                        options={Array.isArray(contract) ? contract : []}
                        getOptionLabel={(option) => option.contract_name || ''}
                        isOptionEqualToValue={(option, value) => option.id === value.id}
                        value={contract.filter((item) => selectedContract.includes(item.id))}
                        onChange={(e, value) => {
                            setSelectedContract(value.map((item) => item.id));
                        }}
                        renderInput={(params) => (
                        <TextField
                            {...params}
                            name="contract_id" // Bisa disesuaikan ke "contract_id[]" jika backend butuh array
                            placeholder={'N/A'}
                            variant="outlined"
                            error={!!validation.contract_id}
                            helperText={
                            validation.contract_id &&
                            validation.contract_id.map((item, index) => (
                                <span key={index} className="text-red-600 text-sm">
                                {item}
                                </span>
                            ))
                            }
                        />
                        )}
                    />
                      
                    </div>
                  }
                </div>
                <div className='flex flex-row space-x-1'>
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    whileHover={{ scale: 0.98 }}
                    className={`w-2/3 bg-emerald-950 text-white py-2 rounded-md uppercase ${
                      isSubmitting
                        ? 'bg-gray-500 cursor-not-allowed'
                        : 'bg-emerald-950 text-white'
                    }`}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Processing...' : 'Save'}
                  </motion.button>
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    whileHover={{ scale: 0.98 }}
                    className="w-1/3 bg-slate-400 text-white py-2 rounded-md uppercase"
                    onClick={() => {setAddMode(false); setValidation([]); setSelectedContract([]); setIsLevel(false); setIsSubmitting(false);}}
                  >
                    Cancel
                  </motion.button>
                </div>
              </div>
            </form>
          </div>
        )}
        {/* Add Users */}

        {/* Edit Users */}
        {editMode  && (
          <div className="w-full h-fit bg-white shadow-sm px-2 py-4 rounded-lg space-y-2">
            <h1 className="text-xl font-bold uppercase">Edit User</h1>
            <form method="POST" onSubmit={handleUpdate} key={editUser.id}>
              <div className="flex flex-col space-y-4">
                <div className='flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2'>
                  <div className='w-full'>
                    <label className="text-sm uppercase" htmlFor="fullname">
                      Nama Lengkap<sup className='text-red-500'>*</sup>
                    </label>
                    <input
                      className="w-full px-1 py-2 border border-gray-300 rounded-md"
                      type="text"
                      name="fullname"
                      id="fullname"
                      placeholder="Masukkan Nama Lengkap..."
                      defaultValue={editUser.fullname}
                      required
                    />
                    {validation.fullname && (
                      validation.fullname.map((item, index) => (
                        <div key={index}>
                          <small className="text-red-600 text-sm">{item}</small>
                        </div>
                      ))
                    )}
                  </div>
                  <div className='w-full'>
                    <label className="text-sm uppercase" htmlFor="email">
                      Email<sup className='text-red-500'>*</sup>
                    </label>
                    <input
                      className="w-full px-1 py-2 border border-gray-300 rounded-md"
                      type="email"
                      name="email"
                      id="email"
                      placeholder="Masukkan email..."
                      defaultValue={editUser.email}
                      required
                    />
                    {validation.email && (
                      validation.email.map((item, index) => (
                        <div key={index}>
                          <small className="text-red-600 text-sm">{item}</small>
                        </div>
                      ))
                    )}
                  </div>
                </div>
                <div className='flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-2'>
                  <div className='w-full'>
                    <label className="text-sm uppercase" htmlFor="username">
                      Username<sup className='text-red-500'>*</sup>
                    </label>
                    <input
                      className="w-full px-1 py-2 border border-gray-300 rounded-md"
                      type="text"
                      name="username"
                      id="username"
                      placeholder="Masukkan Username..."
                      defaultValue={editUser.username}
                      required
                    />
                    {validation.username && (
                      validation.username.map((item, index) => (
                        <div key={index}>
                          <small className="text-red-600 text-sm">{item}</small>
                        </div>
                      ))
                    )}
                  </div>
                  <div className='w-full'>
                    <label className="text-sm uppercase" htmlFor="password">
                      Password
                    </label>
                    <div className='flex flex-row items-center space-x-1'>
                      <input
                        className="w-full px-1 py-2 border border-gray-300 rounded-md"
                        type={showPassword ? "text" : "password"}
                        name="password"
                        id="password"
                        placeholder="Masukkan Password (optional)"
                      />
                      <button className='px-2 py-2 border rounded' type="button" onClick={() => setShowPassword(!showPassword)} >{showPassword ? <IconEye /> : <IconEyeClosed />}</button>
                    </div>
                    {validation.password && (
                      validation.password.map((item, index) => (
                        <div key={index}>
                          <small className="text-red-600 text-sm">{item}</small>
                        </div>
                      ))
                    )}
                  </div>
                </div>
                <div className='flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2'>
                  <div className='w-full flex flex-row space-x-2'>
                    <div className='w-full'>
                      <label htmlFor="level_user">Level User<sup className='text-red-500'>*</sup></label>
                      <select
                        className="w-full px-1 py-2 border border-gray-300 rounded-md"
                        name="level_user"
                        id="level_user"
                        defaultValue={editUser.level_user}
                        onChange={(e) => {e.target.value == 3 ? setIsLevel(true) : setIsLevel(false)}}
                      >
                        <option value="2">Inputer</option>
                        <option value="1">Admin</option>
                        <option value="3">Vendor</option>
                        <option value="4">Viewer All</option>
                        <option value="5">Viewer</option>
                      </select>
                      {validation.level_user && (
                        validation.level_user.map((item, index) => (
                          <div key={index}>
                            <small className="text-red-600 text-sm">{item}</small>
                          </div>
                        ))
                      )}
                    </div>
                    <div className='w-full'>
                      <label htmlFor="status">Status<sup className='text-red-500'>*</sup></label>
                      <select
                        className="w-full px-1 py-2 border border-gray-300 rounded-md"
                        name="status"
                        id="status"
                        defaultValue={editUser.status}
                      >
                        <option value="1">Aktif</option>
                        <option value="0">Nonaktif</option>
                      </select>
                      {validation.status && (
                        validation.status.map((item, index) => (
                          <div key={index}>
                            <small className="text-red-600 text-sm">{item}</small>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
                { isLevel && 
                  <div className='flex flex-row space-x-1'>
                    <div className='w-full'>
                      <label htmlFor="status">Pilih Kontrak<sup className='text-red-500'>*</sup></label>
                      <Autocomplete
                        multiple
                        id="contract_id"
                        options={Array.isArray(contract) ? contract : []}
                        getOptionLabel={(option) => option.contract_name || ''}
                        isOptionEqualToValue={(option, value) => option.id === value.id}
                        value={contract.filter((item) => selectedContract.includes(item.id))}
                        onChange={(e, value) => {
                            setSelectedContract(value.map((item) => item.id));
                        }}
                        renderInput={(params) => (
                        <TextField
                            {...params}
                            name="contract_id" // Bisa disesuaikan ke "contract_id[]" jika backend butuh array
                            placeholder={'N/A'}
                            variant="outlined"
                            error={!!validation.contract_id}
                            helperText={
                            validation.contract_id &&
                            validation.contract_id.map((item, index) => (
                                <span key={index} className="text-red-600 text-sm">
                                {item}
                                </span>
                            ))
                            }
                        />
                        )}
                    />
                      
                    </div>
                  </div>
                }
                <div className='flex flex-row space-x-1'>
                  <motion.button
                    type='submit'
                    whileTap={{ scale: 0.9 }}
                    whileHover={{ scale: 0.98 }}
                    className={`w-2/3 bg-emerald-950 text-emerald-950 py-2 rounded-md uppercase ${
                      isSubmitting
                        ? 'bg-gray-500 cursor-not-allowed'
                        : 'bg-lime-400'
                    }`}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Processing...' : 'Update'}
                  </motion.button>
                  <motion.button
                    type="button"
                    whileTap={{ scale: 0.9 }}
                    whileHover={{ scale: 0.98 }}
                    className="w-1/3 bg-slate-400 text-white py-2 rounded-md uppercase"
                    onClick={() => {setIsSubmitting(false); setEditMode(false); setEditUser({})}}
                  >
                    Cancel
                  </motion.button>
                </div>
              </div>
            </form>
          </div>
        )}
        {/* Edit Users */}
      </div>
    </div>
  )
}

export default User