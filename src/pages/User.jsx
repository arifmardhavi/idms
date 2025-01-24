import React from 'react'
import Header from '../components/Header'
import { useState } from 'react'
import { useEffect } from 'react'
import { getUser } from '../services/user.service'
import * as motion from 'motion/react-client';
import { DataGrid, GridToolbarQuickFilter, GridLogicOperator } from '@mui/x-data-grid';
import { IconPencil } from '@tabler/icons-react';
import { IconCircleMinus } from '@tabler/icons-react';
import Swal from 'sweetalert2';
import { IconRefresh } from '@tabler/icons-react';
import { IconPlus } from '@tabler/icons-react'

const User = () => {
    const [IsUser, setIsUser] = useState([])

    useEffect(() => {
        getUser((data) => {
            setIsUser(data.data)
        })
    }, [])

    

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
                    onClick={() => handleEdit(params.row)}
                  >
                    <IconPencil stroke={2} />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-2 py-1 bg-emerald-950 text-red-500 text-sm rounded"
                    onClick={() => handleDelete(params.row)}
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
            <DataGrid
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
            />
          </div>
        </div>
        {/* Get user */}
      </div>
    </div>
  )
}

export default User