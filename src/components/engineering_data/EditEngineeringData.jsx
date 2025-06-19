import { Autocomplete, Breadcrumbs, TextField, Typography } from "@mui/material"
import Header from "../Header"
import { IconChevronRight } from "@tabler/icons-react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { useState } from "react"
import { IconLoader2 } from "@tabler/icons-react"
import { useEffect } from "react"
import { getTagnumber } from "../../services/tagnumber.service"
import { getEngineeringDataById, updateEngineeringData } from "../../services/engineering_data.service"
import Swal from "sweetalert2"
import { IconArrowLeft } from "@tabler/icons-react"
import { IconArrowRight } from "@tabler/icons-react"

const EditEngineeringData = () => {
  const [loading, setLoading] = useState(false)
  const [tag_number, setTagNumber] = useState([])
  const [selectedTagNumber, setSelectedTagNumber] = useState(null)
  const [validation, setValidation] = useState([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const navigate = useNavigate()
  const { id } = useParams()
  const [hide, setHide] = useState(false)

  useEffect(() => {
    fetchTagNumbers()
    fetchEngineeringData()
  }, [id])
  const fetchTagNumbers = async () => {
    try {
      setLoading(true)
      const data = await getTagnumber()
      setTagNumber(data.data)
    } catch (error) {
      console.error('Error fetching tag numbers:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchEngineeringData = async () => {
    try {
      setLoading(true)
      const data = await getEngineeringDataById(id);
      setSelectedTagNumber(data.data.tag_number_id);
    } catch (error) {
      console.error('Error fetching engineering data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleEditEngineeringData = async (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    formData.append('tag_number_id', selectedTagNumber)
    formData.append('engineering_data_id', id)
    try {
      setIsSubmitting(true)
      const res = await updateEngineeringData(id, formData);
      if (res.success) {
          Swal.fire("Berhasil!", "success Update Engineering Data!", "success");
          navigate('/engineering_data');
      } else {
          setValidation(res.response?.data.errors || []);
          Swal.fire("Error!", "failed Update Engineering Data!", "error");
      }
    } catch (error) {
      console.error("Error Updateing engineering data:", error);
      setValidation(error.response?.data.errors || []);
      Swal.fire("Error!", "something went wrong Update engineering data!", "error");
    } finally {
      setIsSubmitting(false)
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
              <Link className='hover:underline text-emerald-950' to='/engineering_data'>
              Engineering Data
              </Link>
              <Typography className='text-lime-500'>Update Engineering Data</Typography>
          </Breadcrumbs>
          <div className='w-full space-y-2 bg-white shadow-sm px-2 py-4 rounded-lg'>
            {loading ?
              <div className="flex flex-col items-center justify-center h-20">
                  <IconLoader2 stroke={2} className="animate-spin rounded-full h-10 w-10 " />
              </div> 
            :
              <form 
                    method="post"
                    encType='multipart/form-data'
                    className="space-y-2"
                    onSubmit={(e) => handleEditEngineeringData(e)}
              >
                  <div className='flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2'>
                      <div className='w-full space-y-1'>
                          <label className='text-emerald-950'>
                              Tag Number <sup className='text-red-500'>*</sup>
                          </label>
                          <Autocomplete
                              id="tag_number_id"
                              options={Array.isArray(tag_number) ? tag_number : []}
                              getOptionLabel={(option) => option.tag_number || ''}
                              isOptionEqualToValue={(option, value) => option.id === value.id}
                              value={tag_number.find((item) => item.id === selectedTagNumber) || null}
                              onChange={(e, value) => {
                                  setSelectedTagNumber(value?.id || null);
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
                        onClick={() => navigate('/engineering_data')}
                        className='w-full lg:w-1/2 bg-slate-600 text-white py-2 rounded-md uppercase hover:scale-95 transition duration-300'
                    >
                        Cancel
                    </button>
                  </div>
              </form>
            }
          </div>
        </div>
    </div>
  )
}

export default EditEngineeringData