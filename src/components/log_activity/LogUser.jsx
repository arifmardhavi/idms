import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Header from "../Header";
import { IconChevronRight, IconColumnInsertLeft, IconColumnRemove, IconRefresh } from "@tabler/icons-react";
import { getLogActivitiesByUserId } from "../../services/log_activities.service";
import { Breadcrumbs, Chip, Typography } from "@mui/material";

const LogUser = () => {
  const { id } = useParams();
  const [hide, setHide] = useState(false);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState(""); // 🔍 state untuk search

  useEffect(() => {
    console.log("LogUser component mounted with id:", id);
    FetchLogUser();
  }, []);

  const FetchLogUser = async () => {
    try {
      setLoading(true);
      const data = await getLogActivitiesByUserId(id);
      setLogs(data.data);
      console.log(data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // 🔍 Filter logs berdasarkan searchTerm
  const filteredLogs = logs.filter((log) => {
    const term = searchTerm.toLowerCase();
    return (
      log.module?.toLowerCase().includes(term) ||
      log.action?.toLowerCase().includes(term) ||
      log.ip_address?.toLowerCase().includes(term) ||
      log.time?.toLowerCase().includes(term) ||
      Object.entries(log.changes || {}).some(([field, values]) =>
        field.toLowerCase().includes(term) ||
        values.before?.toString().toLowerCase().includes(term) ||
        values.after?.toString().toLowerCase().includes(term)
      )
    );
  });

  return (
    <div className="flex flex-col md:flex-row w-full">
      {!hide && <Header />}
      <div className={`flex flex-col ${hide ? "" : "md:pl-64"} w-full px-2 py-4 space-y-3`}>
        {/* Toggle Sidebar */}
        <div className="md:flex hidden">
          <div
            className={`${hide ? "hidden" : "block"} w-fit bg-emerald-950 text-lime-300 p-2 cursor-pointer rounded-xl`}
            onClick={() => setHide(true)}
          >
            <IconColumnRemove />
          </div>
        </div>
        <div
          className={`${hide ? "block" : "hidden"} w-fit bg-emerald-950 text-lime-300 p-2 cursor-pointer rounded-xl`}
          onClick={() => setHide(false)}
        >
          <IconColumnInsertLeft />
        </div>
        <Breadcrumbs
          aria-label='breadcrumb'
          separator={
            <IconChevronRight className='text-emerald-950' stroke={2} />
          }
        >
          <Link className='hover:underline text-emerald-950' to='/'>
            Home
          </Link>
          <Link className='hover:underline text-emerald-950' to='/log_activity'>
            Log Activities
          </Link>
          <Typography className='text-lime-500'>Details</Typography>
        </Breadcrumbs>

        {/* Search Box */}
        <input
          type="text"
          placeholder="Cari log..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border p-2 rounded-xl w-full mb-3"
        />

        <div className="flex flex-col space-y-4 bg-white p-2 rounded-xl shadow-md">
          <div className="flex justify-between items-center mb-4">
            {loading ? (
              <p className="text-2xl text-gray-900">Log User</p>
            ) : (
              <div className="w-fit">
                <h1 className="text-2xl text-gray-900">Log User {logs.length > 0 ? logs[0].user : ""}</h1>
                <Chip
                  label={`Total Logs: ${logs.length}`}
                  color="primary"
                  size="small"
                />
              </div>
            )}
            <button
              onClick={FetchLogUser}
              className="bg-emerald-950 text-lime-300 p-2 cursor-pointer rounded-xl flex hover:bg-emerald-800"
            >
              <IconRefresh /> Refresh
            </button>
          </div>

          {loading ? (
            <p>Loading...</p>
          ) : (
            <div className="flex flex-col space-y-4 h-[600px] overflow-y-auto">
              {filteredLogs.length > 0 ? (
                filteredLogs.map((log, index) => (
                  <div className="bg-slate-100 p-2 rounded-xl" key={index}>
                    <h1>{log.module}</h1>
                    <div className="p-2 flex flex-col justify-between">
                      <div className="flex w-full py-2 space-x-1">
                        <Chip
                          label={log.action}
                          color={
                            log.action === "create"
                              ? "success"
                              : log.action === "update"
                              ? "warning"
                              : log.action === "delete"
                              ? "error"
                              : "primary"
                          }
                          size="small"
                        />
                        <Chip label={log.ip_address} color={"primary"} size="small" />
                      </div>

                      <div className="flex flex-col w-full rounded-xl  bg-slate-200">
                        {log.changes ? (
                          Object.entries(log.changes).map(([field, values], idx) => (
                            <div key={idx} className="p-2">
                              <p className="text-gray-800">
                                {field}: {values.before ?? ''} 
                                {values.before != null && values.after != null && values.before !== '' && values.after !== '' ? ' → ' : ''} 
                                {values.after ?? ''}
                              </p>
                            </div>
                          ))
                        ) : (
                          <div className="bg-slate-200 rounded-xl p-2 text-gray-600">No Changes</div>
                        )}
                      </div>

                      <div className="flex flex-col w-full p-2">
                        <p className="text-gray-600">{log.time}</p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">Tidak ada hasil ditemukan</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LogUser;
