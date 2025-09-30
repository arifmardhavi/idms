import { useState, useEffect } from "react";
import Header from "../components/Header";
import { IconColumnInsertLeft, IconColumnRemove, IconSettings, IconRefresh, IconTrash } from "@tabler/icons-react";
import { DataGrid, GridToolbarQuickFilter } from "@mui/x-data-grid";
import {  getLogActivitiesByAllUsers } from "../services/log_activities.service";
import { Tooltip } from "@mui/material";
import { Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { deleteOpenFileActivity, getOpenFileActivity } from "../services/open_file_activity.service";
import Swal from "sweetalert2";
import { getUser } from "../services/user.service";

const LogActivities = () => {
  const [hide, setHide] = useState(false);
  const [loading, setLoading] = useState(false);
  const [logsAllUsers, setLogsAllUsers] = useState([]);
  const [logsOpenFile, setLogsOpenFile] = useState([]);
  const [users, setUsers] = useState([]);
  const token = localStorage.getItem('token');
  let userLevel = '';
  let userEmail = '';
  try {
    userLevel = String(jwtDecode(token).level_user);
    userEmail = String(jwtDecode(token).email);
    // console.log(userLevel);
    console.log(userEmail);

  } catch (error) {
    console.error('Invalid token:', error);
    localStorage.removeItem('token');
  }

  useEffect(() => {
    fetchLogsAllUsers();
    fetchOpenFileActivities();
    fetchUsers();
  }, [])
  const fetchLogsAllUsers = async () => {
    try {
      setLoading(true);
      const data = await getLogActivitiesByAllUsers();
      setLogsAllUsers(data.data);
      console.log("all user :" , data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchOpenFileActivities = async () => {
    try {
      setLoading(true);
      const data = await getOpenFileActivity();
      setLogsOpenFile(data.data);
      console.log("open file activity :" , data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await getUser();
      setUsers(data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const columnsUsers = [
    { field: 'fullname', headerName: 'Nama', width: 300, renderCell: (params) => <div className="">{params.value}</div> },
    {field: 'total_activities', headerName: 'contribution', renderCell: (params) => <div className="">{params.value}</div>},
    {field: 'total_file_open', headerName: 'active', renderCell: (params) => <div className="">{params.value}</div>},
    // { 
    //   field: 'level_user', 
    //   headerName: 'Level User',
    //   width: 120,
    //   valueGetter: (params) => params == 1 ? 'Admin' : params == 2 ? 'Inputer' : params == 3 ? 'Vendor' : params == 4 ? 'Viewer All' : params == 5 ? 'Viewer' : 'Super Admin',
    //   renderCell: (params) => (
    //     <div className={`${params.row.level_user == '1' ? 'bg-lime-300 text-emerald-950' : 'text-lime-300 bg-emerald-950'} flex flex-col justify-center items-center`}>
    //       {params.row.level_user == '1' ? 'Admin' : params.row.level_user == '2' ? 'Inputer' : params.row.level_user == '3' ? 'Vendor' : params.row.level_user == '4' ? 'Viewer All' : params.row.level_user == '5' ? 'Viewer' : 'Super Admin'}
    //     </div>
    //   )
    // },
    // { 
    //   field: 'status', 
    //   headerName: 'Status',
    //   valueGetter: (params) => params == 1 ? 'Aktif' : 'Nonaktif',
    //   renderCell: (params) => (
    //     <div className={`${params.row.status == '1' ? 'bg-lime-300 text-emerald-950' : 'text-lime-300 bg-emerald-950'} flex flex-col justify-center items-center`}>
    //       {params.row.status == '1' ? 'Aktif' : 'Nonaktif'}
    //     </div>
    //   )
    // },
  ];

  const columnsOpenFile = [
    { field: 'user',
      headerName: 'User',
      valueGetter: (params) => params.fullname ?? null, 
      width: 150,
      renderCell: (params) => (
        <div className="flex flex-row justify-center items-center space-x-2">
          {params.row.user.fullname}
        </div>
      ),
    },
    { field: 'features', headerName: 'Features', width: 150 },
    { field: 'file_name', headerName: 'File Name', width: 300 },
    { field: 'timestamp', headerName: 'Timestamp', width: 250, },
    ...(userLevel == 99 ? [{
      field: 'actions',
      headerName: 'Aksi',
      width: 150,
      renderCell: (params) => (
        <div className="flex flex-row justify-center py-2 items-center space-x-2">
          <button
            onClick={() => handleDelete(params.row)}
            className='bg-emerald-950 text-red-500 text-sm rounded-full px-2 py-1 hover:scale-110 transition duration-100 flex items-center space-x-1'
          >
            <IconTrash />
          </button>
        </div>
      ),
    }] : []),
  ];

  const columnsActivity = [
    { field: 'user', headerName: 'User', width: 150},
    { field: 'module', headerName: 'Features', width: 200 },
    { field: 'create', headerName: 'Create', width: 80 },
    { field: 'update', headerName: 'Update', width: 80 },
    { field: 'delete', headerName: 'Delete', width: 80 },
    { field: 'ip_address', headerName: 'IP Address', width: 150 },
    // { field: 'user_agent', headerName: 'User Agent', width: 200 },
    { field: 'time', headerName: 'Time', width: 130, },
    { field: 'timestamp', headerName: 'Timestamp', width: 200, },
    {
      field: 'actions',
      headerName: 'Aksi',
      width: 150,
      renderCell: (params) => (
        <div className="flex flex-row justify-center py-2 items-center space-x-2">
          <Tooltip title="Details" placement="left">
          <Link
            to={`/log_activity/user/${params.row.user_id}`}
            className="px-2 py-1 bg-emerald-950 text-lime-400 text-sm rounded"
          >
            <IconSettings stroke={2} />
          </Link>
          </Tooltip>
        </div>
      ),
    },
  ];


  const handleDelete = async (row) => {
    const result = await Swal.fire({
      title: "Apakah Anda yakin?",
      text: "Data File Open Activity akan dihapus secara permanen!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
    });

    if (result.isConfirmed) {
      try {
        const res = await deleteOpenFileActivity(row.id);
        if (res.success) {
          Swal.fire("Berhasil!", "File Open Activity berhasil dihapus!", "success");
          fetchOpenFileActivities();
        } else {
          Swal.fire("Gagal!", "Terjadi kesalahan saat menghapus File Open Activity!", "error");
        }
      } catch (error) {
        console.log(error);
        Swal.fire("Gagal!", "Terjadi kesalahan saat menghapus File Open Activity!", "error");
      }
    }
  };

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
                <IconColumnRemove />
              </div>
            </div>
            <div className={` ${hide ? 'block' : 'hidden'}  w-fit bg-emerald-950 text-lime-300 p-2 cursor-pointer rounded-md`} onClick={() => setHide(false)}>
              <IconColumnInsertLeft />
            </div>
            { (userLevel == 1 && userEmail == 'faza.ahmad@pertamina.com') || userLevel == 99 ? 
            <>
              {/* rank by user */}
              <div className="flex flex-col space-y-4 bg-white p-2 rounded-md shadow-md">
                <div className="flex justify-between items-center mb-4">
                  <p className="text-2xl text-gray-900">Log Users</p>
    
                  <button
                    onClick={fetchOpenFileActivities}
                    className="bg-emerald-950 text-lime-300 p-2 cursor-pointer rounded-md flex hover:bg-emerald-800"
                  >
                    <IconRefresh /> Refresh
                  </button>
                </div>
                { loading ? <p>Loading...</p> : <DataGrid
                  rows={users}
                  columns={columnsUsers}
                  slots={{ toolbar: CustomQuickFilter }}
                  initialState={{
                    pagination: {
                      paginationModel: { page: 0, pageSize: 10 },
                    },
                  }}
                  pageSizeOptions={[10, 25, 50, 100, { value: -1, label: 'All' }]}
                  // checkboxSelection
                />}

              </div>
              {/* active users */}
              { 1 == 0 && <div className="flex flex-col space-y-4 bg-white p-2 rounded-md shadow-md">
                <div className="flex justify-between items-center mb-4">
                  <p className="text-2xl text-gray-900">Log Active Users</p>
    
                  <button
                    onClick={fetchOpenFileActivities}
                    className="bg-emerald-950 text-lime-300 p-2 cursor-pointer rounded-md flex hover:bg-emerald-800"
                  >
                    <IconRefresh /> Refresh
                  </button>
                </div>
                { loading ? <p>Loading...</p> : <DataGrid
                  rows={logsOpenFile}
                  columns={columnsOpenFile}
                  slots={{ toolbar: CustomQuickFilter }}
                  initialState={{
                    pagination: {
                      paginationModel: { page: 0, pageSize: 10 },
                    },
                  }}
                  pageSizeOptions={[10, 25, 50, 100, { value: -1, label: 'All' }]}
                  // checkboxSelection
                />}

              </div>}
              {/* log activity */}
              <div className="flex flex-col space-y-4 bg-white p-2 rounded-md shadow-md">
                <div className="flex justify-between items-center mb-4">
                  <p className="text-2xl text-gray-900">Log Activities</p>
    
                  <button
                    onClick={fetchLogsAllUsers}
                    className="bg-emerald-950 text-lime-300 p-2 cursor-pointer rounded-md flex hover:bg-emerald-800"
                  >
                    <IconRefresh /> Refresh
                  </button>
                </div>
                { loading ? <p>Loading...</p> : <DataGrid
                  rows={logsAllUsers}
                  columns={columnsActivity}
                  slots={{ toolbar: CustomQuickFilter }}
                  initialState={{
                    pagination: {
                      paginationModel: { page: 0, pageSize: 20 },
                    },
                  }}
                  pageSizeOptions={[20, 50, 100, 200, { value: -1, label: 'All' }]}
                  // checkboxSelection
                />}

              </div> 
            </>
            : <p>HAK AKSES DITOLAK</p>}
          </div>
    </div>
  )
}

export default LogActivities