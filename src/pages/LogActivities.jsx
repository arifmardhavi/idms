import { useState, useEffect } from "react";
import Header from "../components/Header";
import { IconColumnInsertLeft, IconColumnRemove, IconSettings, IconRefresh } from "@tabler/icons-react";
import { DataGrid, GridToolbarQuickFilter } from "@mui/x-data-grid";
import {  getLogActivitiesByAllUsers } from "../services/log_activities.service";
import { Tooltip } from "@mui/material";
import { Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const LogActivities = () => {
  const [hide, setHide] = useState(false);
  const [loading, setLoading] = useState(false);
  const [logsAllUsers, setLogsAllUsers] = useState([]);
  const token = localStorage.getItem('token');
  let userLevel = '';
  let userEmail = '';
  try {
    userLevel = String(jwtDecode(token).level_user);
    userEmail = String(jwtDecode(token).email);
    // console.log(userLevel);
    // console.log(userEmail);

  } catch (error) {
    console.error('Invalid token:', error);
    localStorage.removeItem('token');
  }

  useEffect(() => {
    fetchLogsAllUsers();
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
  const columns = [
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
            { (userLevel == 1 && userEmail == 'faza.ahmad@pertamina.com') || userLevel == 99 ? <div className="flex flex-col space-y-4 bg-white p-2 rounded-md shadow-md">
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
                columns={columns}
                slots={{ toolbar: CustomQuickFilter }}
                initialState={{
                  pagination: {
                    paginationModel: { page: 0, pageSize: 20 },
                  },
                }}
                pageSizeOptions={[20, 50, 100, 200, { value: -1, label: 'All' }]}
                // checkboxSelection
              />}

            </div> : <p>HAK AKSES DITOLAK</p>}
          </div>
    </div>
  )
}

export default LogActivities