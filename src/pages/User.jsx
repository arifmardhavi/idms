import Header from '../components/Header'
import { useState } from 'react'
import { useEffect } from 'react'
import { addUser, getUser, nonactiveUser, updateUser } from '../services/user.service'
import * as motion from 'motion/react-client';
import { DataGrid, GridToolbarQuickFilter, GridLogicOperator } from '@mui/x-data-grid';
import { IconPencil } from '@tabler/icons-react';
import { IconCircleMinus } from '@tabler/icons-react';
import Swal from 'sweetalert2';
import { IconRefresh } from '@tabler/icons-react';
import { IconPlus } from '@tabler/icons-react'
import { use } from 'react'
import { IconEye } from '@tabler/icons-react';
import { IconEyeClosed } from '@tabler/icons-react';

const User = () => {
    const [IsUser, setIsUser] = useState([])
    const [Loading, setLoading] = useState(false);
    const [addMode, setAddMode] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [validation, setValidation] = useState([]);
    const [editUser, setEditUser] = useState({});
    useEffect(() => {
      fetchUsers();
    }, [])

    const fetchUsers = async () => {
      try {
        setLoading(true);
        const data = await getUser();
        setIsUser(data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    const handleAddUser = async (e) => {
      e.preventDefault();
      setIsSubmitting(true);
      const formData = new FormData(e.target);
      const data = await addUser(formData);
      try {
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
    }

    // update User
    const handleUpdate = async (event) => {
      event.preventDefault();
      setIsSubmitting(true);
      const formData = new FormData(event.target);
      const data = Object.fromEntries(formData);
      try {
        await updateUser(editUser.id, data);
        Swal.fire('Berhasil!', 'user berhasil diperbarui!', 'success');
        fetchUsers();
        setEditMode(false);
        setEditUser(null);
        setValidation([]);
      } catch (error) {
        console.log(error.response.data.errors);
        setValidation(error.response?.data.errors || []);
        Swal.fire('Gagal!', 'Terjadi kesalahan saat memperbarui User!', 'error');
      }
      setIsSubmitting(false);
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
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-2 py-1 bg-emerald-950 text-lime-300 text-sm rounded"
                    onClick={() => {setEditMode(false); handleClickEdit(params.row);}}
                  >
                    <IconPencil stroke={2} />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-2 py-1 bg-emerald-950 text-red-500 text-sm rounded"
                    onClick={() => handleNonactive(params.row)}
                  >
                    <IconCircleMinus stroke={2} />
                  </motion.button>
                </div>
              ),
            },
    ];

   const CustomQuickFilter = () => (
        <GridToolbarQuickFilter
        placeholder="Cari data disini..."
        className="text-lime-300 px-4 py-4 border outline-none"
        />
    );

     


  return (
    <div className="flex flex-col md:flex-row w-full">
      <Header />
      <div className="flex flex-col md:pl-64 w-full px-2 py-4 space-y-3">
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
                    onClick={() => {setAddMode(true); setEditMode(false);}}
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
            {Loading ? <p>Loading...</p> : <DataGrid
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
                  paginationModel: { pageSize: 5, page: 0 },
                },
                filter: {
                  filterModel: {
                    items: [],
                    quickFilterExcludeHiddenColumns: false,
                    quickFilterLogicOperator: GridLogicOperator.Or,
                  },
                },
              }}
              pageSizeOptions={[5, 10, 25, { value: -1, label: 'All' }]}
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
                      >
                        <option value="2">Users</option>
                        <option value="1">Admin</option>
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
                    onClick={() => setAddMode(false)}
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
                      >
                        <option value="2">Users</option>
                        <option value="1">Admin</option>
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
                    onClick={() => {setEditMode(false); setEditUser({})}}
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