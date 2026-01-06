import { useState, useEffect } from 'react';
import Header from '../Header';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Breadcrumbs, Typography } from '@mui/material';
import { IconArticle, IconChevronRight } from '@tabler/icons-react';
import Swal from 'sweetalert2';
import {
  getIzinDisnakerById,
  updateIzinDisnaker,
  deleteIzinDisnakerFile,
} from '../../services/izin_disnaker.service';
import { ActiveUnit } from '../../services/unit.service';
import * as motion from 'motion/react-client';
import { IconX } from '@tabler/icons-react';
import { api_public } from "../../services/config";
import { handleAddActivity } from '../../utils/handleAddActivity';

const EditIzinDisnaker = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [IsRLA, setIsRLA] = useState(false);
  const [IsUnit, setIsUnit] = useState([]);
  const [selectedUnit, setSelectedUnit] = useState('');
  const [izinDisnaker, setIzinDisnaker] = useState({});
  const [validation, setValidation] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const base_public_url = api_public;
  const [hide, setHide] = useState(false);

  useEffect(() => {
    fetchUnits();
    fetchIzinDisnakerDetails();
  }, [id]);

  const fetchUnits = async () => {
    try {
      const data = await ActiveUnit();
      setIsUnit(data.data);
    } catch (error) {
      console.error("Error fetching units:", error);
    }
  };

  const fetchIzinDisnakerDetails = async () => {
    try {
      const data = await getIzinDisnakerById(id);
      setIzinDisnaker(data.data);
      setIsRLA(!!data.data.rla);
      setSelectedUnit(data.data.unit_id);
    } catch (error) {
      console.error("Error fetching Izin Disnaker details:", error);
    }
  };

  const handleUpdateIzinDisnaker = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData(e.target);
      
      if (!e.target.izin_disnaker_certificate.files[0]) {
        formData.delete("izin_disnaker_certificate");
      }
      
      if (IsRLA && !e.target.rla_certificate.files[0]) {
        formData.delete("rla_certificate");
      }
      
      const res = await updateIzinDisnaker(id, formData);
      if (res.success) {
        Swal.fire("Berhasil!", "Izin Disnaker berhasil diperbarui!", "success");
        navigate('/izin_disnaker');
      } else {
        Swal.fire("Gagal!", "Izin Disnaker gagal diperbarui!", "error");
      }
    } catch (error) {
      console.error("Error updating Izin Disnaker:", error);
      console.log(error.response.data.errors);
      setValidation(error.response?.data.errors || []);
      Swal.fire("Error!", "Terjadi kesalahan saat memperbarui Izin Disnaker!", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handledeleteFile = (file) => {
    Swal.fire({
      title: "Konfirmasi Hapus",
      text: "Apakah Anda yakin ingin menghapus file Izin Disnaker ini?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Ya, Hapus",
      cancelButtonText: "Batal",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await deleteIzinDisnakerFile(id, file);
          if (res.success) {
            Swal.fire("Berhasil!", "File berhasil dihapus!", "success");
            fetchIzinDisnakerDetails();
          } else {
            Swal.fire("Gagal!", "File gagal dihapus!", "error");
          }
        } catch (error) {
          console.error("Error deleting file:", error);
          Swal.fire("Error!", "Terjadi kesalahan saat menghapus file!", "error");
        }
      }
    });
  };


  return (
    <div className='flex flex-col md:flex-row w-full'>
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
        <div className='w-full bg-white shadow-sm px-2 py-4 rounded-lg space-y-2'>
          <Breadcrumbs
            aria-label='breadcrumb'
            separator={
              <IconChevronRight className='text-emerald-950' stroke={2} />
            }
          >
            <Link
              className='hover:underline text-emerald-950'
              to='/'
              onClick={() => localStorage.setItem('active', 'Home')}
            >
              Home
            </Link>
            <Link className='hover:underline text-emerald-950' to='/izin_disnaker'>
              Izin Disnaker
            </Link>
            <Typography className='text-lime-500'>Edit Izin Disnaker</Typography>
          </Breadcrumbs>
          <div>
            <form
              encType='multipart/form-data'
              onSubmit={(e) => handleUpdateIzinDisnaker(e)}
            >
              <div className='flex flex-col space-y-2'>
                <div className='flex flex-row space-x-2'>
                  <div className='w-full'>
                    <label htmlFor='unit' className='text-emerald-950'>
                      Unit <sup className='text-red-500'>*</sup>
                    </label>
                    <select
                      name='unit_id'
                      id='unit'
                      className='w-full px-1 py-2 border border-gray-300 rounded-md'
                      value={selectedUnit}
                      onChange={(e) => setSelectedUnit(e.target.value)}
                      required
                    >
                      <option value=''>Pilih Unit</option>
                      {IsUnit.map((unit) => (
                        <option key={unit.id} value={unit.id}>
                          {unit.unit_name}
                        </option>
                      ))}
                    </select>
                    {validation.unit_id && (
                        validation.unit_id.map((item, index) => (
                          <div key={index}>
                            <small className="text-red-600 text-sm">{item}</small>
                          </div>
                        ))
                      )}
                  </div>
                </div>
                <div className='w-full'>
                  <label className='text-emerald-950'>
                    No Certificate <sup className='text-red-500'>*</sup>
                  </label>
                  <input
                    type='text'
                    name='no_certificate'
                    id='no_certificate'
                    placeholder='No Certificate'
                    className='w-full px-3 py-2 border border-gray-300 rounded-lg'
                    defaultValue={izinDisnaker.no_certificate}
                    required
                  />
                  {validation.no_certificate && (
                    validation.no_certificate.map((item, index) => (
                      <div key={index}>
                        <small className="text-red-600 text-sm">{item}</small>
                      </div>
                    ))
                  )}
                </div>
                <div className='flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2'>
                  <div className='w-full'>
                    <div className='mb-2'>
                      <label className='text-emerald-950'>
                        Izin Disnaker Certificate
                      </label>
                      <input
                        type='file'
                        name='izin_disnaker_certificate'
                        id='izin_disnaker_certificate'
                        className='w-full px-3 py-2 border border-gray-300 rounded-lg'
                      />
                    </div>
                    <div className='flex flex-row justify-between items-center w-full border bg-lime-400 rounded p-1'>
                      {izinDisnaker.izin_disnaker_certificate ? (
                        <>
                          <Link
                            to={`${base_public_url}izin_disnaker/certificates/${izinDisnaker.izin_disnaker_certificate}`}
                            target='_blank'
                            className='text-emerald-950 hover:underline cursor-pointer'
                            onClick={() => handleAddActivity(izinDisnaker.izin_disnaker_certificate, "IzinDisnaker")}
                          >
                            {izinDisnaker.izin_disnaker_certificate}
                          </Link>
                          <IconX
                            onClick={() =>
                              handledeleteFile({
                                izin_disnaker_certificate: izinDisnaker.izin_disnaker_certificate,
                              })
                            }
                            className='text-red-500 cursor-pointer hover:rotate-90 transition duration-500 '
                          />
                        </>
                      ) : (
                        <span>-</span>
                      )}
                    </div>
                  </div>
                  <div className='w-full'>
                    <div className='mb-2'>
                      <label className='text-emerald-950'>
                        Izin Disnaker Old Certificate
                      </label>
                      {/* <input
                        type='file'
                        name='izin_disnaker_old_certificate'
                        id='izin_disnaker_old_certificate'
                        className='w-full px-3 py-2 border border-gray-300 rounded-lg'
                      /> */}
                    </div>
                    <div className='flex flex-row justify-between items-center w-full border bg-lime-400 rounded p-1'>
                      {izinDisnaker.izin_disnaker_old_certificate ? (
                        <>
                          <Link
                            to={`${base_public_url}izin_disnaker/certificates/${izinDisnaker.izin_disnaker_old_certificate}`}
                            target='_blank'
                            className='text-emerald-950 hover:underline cursor-pointer'
                            onClick={() => handleAddActivity(izinDisnaker.izin_disnaker_old_certificate, "IzinDisnaker")}
                          >
                            {izinDisnaker.izin_disnaker_old_certificate}
                          </Link>
                          <IconX
                            onClick={() =>
                              handledeleteFile({
                                izin_disnaker_old_certificate: izinDisnaker.izin_disnaker_old_certificate,
                              })
                            }
                            className='text-red-500 cursor-pointer hover:rotate-90 transition duration-500 '
                          />
                        </>
                      ) : (
                        <span>-</span>
                      )}
                    </div>
                  </div>
                </div>
                <div className='flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2'>
                  <div className='w-full flex flex-row space-x-2'>
                    <div className='w-full'>
                      <label className='text-emerald-950'>
                        Issue Date <sup className='text-red-500'>*</sup>
                      </label>
                      <input
                        type='date'
                        name='issue_date'
                        id='issue_date'
                        className='w-full px-3 py-2 border border-gray-300 rounded-lg'
                        defaultValue={izinDisnaker.issue_date}
                        required
                      />
                      {validation.issue_date && (
                        validation.issue_date.map((item, index) => (
                          <div key={index}>
                            <small className="text-red-600 text-sm">{item}</small>
                          </div>
                        ))
                      )}
                    </div>
                    <div className='w-full'>
                      <label className='text-emerald-950'>
                        Inspection Due Date <sup className='text-red-500'>*</sup>
                      </label>
                      <input
                        type='date'
                        name='overdue_date'
                        id='overdue_date'
                        className='w-full px-3 py-2 border border-gray-300 rounded-lg'
                        defaultValue={izinDisnaker.overdue_date}
                        required
                      />
                      {validation.overdue_date && (
                        validation.overdue_date.map((item, index) => (
                          <div key={index}>
                            <small className="text-red-600 text-sm">{item}</small>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                  <div className='w-full md:w-1/3'>
                    <label htmlFor='rla' className='text-emerald-950'>
                      RLA
                    </label>
                    <select
                      name='rla'
                      id='rla'
                      className='w-full px-1 py-2 border border-gray-300 rounded-md'
                      value={IsRLA ? 1 : 0}
                      onChange={(e) => setIsRLA(e.target.value === '1')}
                    >
                      <option value=''>Pilih RLA</option>
                      <option value='1'>Available</option>
                      <option value='0'>N/A</option>
                    </select>
                    {validation.rla && (
                        validation.rla.map((item, index) => (
                          <div key={index}>
                            <small className="text-red-600 text-sm">{item}</small>
                          </div>
                        ))
                      )}
                  </div>
                </div>
                {IsRLA && (
                  <div className='space-y-2'>
                    <div className='flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2'>
                      <div className='w-full'>
                        <label className='text-emerald-950'>
                          RLA Issue Date
                        </label>
                        <input
                          type='date'
                          name='rla_issue'
                          id='rla_issue'
                          className='w-full px-3 py-2 border border-gray-300 rounded-lg'
                          defaultValue={izinDisnaker.rla_issue}
                        />
                        {validation.rla_issue && (
                          validation.rla_issue.map((item, index) => (
                            <div key={index}>
                              <small className="text-red-600 text-sm">{item}</small>
                            </div>
                          ))
                        )}
                      </div>
                      <div className='w-full'>
                        <label className='text-emerald-950'>
                          RLA Due Date
                        </label>
                        <input
                          type='date'
                          name='rla_overdue'
                          id='rla_overdue'
                          className='w-full px-3 py-2 border border-gray-300 rounded-lg'
                          defaultValue={izinDisnaker.rla_overdue}
                        />
                        {validation.rla_overdue && (
                          validation.rla_overdue.map((item, index) => (
                            <div key={index}>
                              <small className="text-red-600 text-sm">{item}</small>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                    <div className='flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2'>
                      <div className='w-full'>
                        <div className='mb-2'>
                          <label className='text-emerald-950'>
                            RLA Certificate
                          </label>
                          <input
                            type='file'
                            name='rla_certificate'
                            id='rla_certificate'
                            className='w-full px-3 py-2 border border-gray-300 rounded-lg'
                          />
                          {validation.rla_certificate && (
                            validation.rla_certificate.map((item, index) => (
                              <div key={index}>
                                <small className="text-red-600 text-sm">{item}</small>
                              </div>
                            ))
                          )}
                        </div>
                        <div className='flex flex-row justify-between items-center w-full border bg-lime-400 rounded p-1'>
                          {izinDisnaker.rla_certificate ? (
                            <>
                              <Link
                                to={`${base_public_url}izin_disnaker/rla/${izinDisnaker.rla_certificate}`}
                                target='_blank'
                                className='text-emerald-950 hover:underline cursor-pointer'
                                onClick={() => handleAddActivity(izinDisnaker.rla_certificate, "IzinDisnaker")}
                              >
                                {izinDisnaker.rla_certificate}
                              </Link>
                              <IconX
                                onClick={() =>
                                  handledeleteFile({
                                    rla_certificate: izinDisnaker.rla_certificate,
                                  })
                                }
                                className='text-red-500 cursor-pointer hover:rotate-90 transition duration-500 '
                              />
                            </>
                          ) : (
                            <span>-</span>
                          )}
                        </div>
                      </div>
                      <div className='w-full'>
                        <div className='mb-2'>
                          <label className='text-emerald-950'>
                            RLA Old Certificate
                          </label>
                          {/* <input
                            type='file'
                            name='rla_old_certificate'
                            id='rla_old_certificate'
                            className='w-full px-3 py-2 border border-gray-300 rounded-lg'
                          /> */}
                        </div>
                        <div className='flex flex-row justify-between items-center w-full border bg-lime-400 rounded p-1'>
                          {izinDisnaker.rla_old_certificate ? (
                            <>
                              <Link
                                to={`${base_public_url}izin_disnaker/rla/${izinDisnaker.rla_old_certificate}`}
                                target='_blank'
                                className='text-emerald-950 hover:underline cursor-pointer'
                                onClick={() => handleAddActivity(izinDisnaker.rla_old_certificate, "IzinDisnaker")}
                              >
                                {izinDisnaker.rla_old_certificate}
                              </Link>
                              <IconX
                                onClick={() =>
                                  handledeleteFile({
                                    rla_old_certificate:
                                      izinDisnaker.rla_old_certificate,
                                  })
                                }
                                className='text-red-500 cursor-pointer hover:rotate-90 transition duration-500 '
                              />
                            </>
                          ) : (
                            <span>-</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div className='w-full flex flex-row space-x-2 py-2'>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  whileHover={{ scale: 0.98 }}
                  type='submit'
                  className={`w-full bg-emerald-950 text-white py-2 rounded-md uppercase ${
                    isSubmitting
                      ? 'bg-gray-500 cursor-not-allowed'
                      : 'bg-emerald-950 text-white'
                  }`}
                  disabled={isSubmitting} // Disable tombol jika sedang submit
                >
                  {isSubmitting ? 'Processing...' : 'Submit'}
                </motion.button>
                <button
                  type='button'
                  className='w-1/3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 mr-2'
                  onClick={() => navigate('/izin_disnaker')}
                >
                  Batal
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditIzinDisnaker;
