import { Link, useParams } from "react-router-dom";
import Header from "../../Header";
import { Breadcrumbs, Checkbox, Typography } from "@mui/material";
import { IconChevronRight } from "@tabler/icons-react";
import { useState } from "react";

const AddAmandement = () => {
    const { id } = useParams();
    const [openNilai, setOpenNilai] = useState(false);
    const [openWaktu, setOpenWaktu] = useState(false);
    const [openDenda, setOpenDenda] = useState(false);
  return (
    <div className='flex flex-col md:flex-row w-full'>
        <Header />
        <div className='flex flex-col md:pl-64 w-full px-2 py-4 space-y-3'>
            <Breadcrumbs
                aria-label='breadcrumb'
                className="uppercase text-xs"
                separator={
                <IconChevronRight className='text-emerald-950' stroke={2} />
                }
            >
                <Link className='hover:underline text-emerald-950' to='/contract'>
                Contract
                </Link>
                <Link className='hover:underline text-emerald-950' to={`/contract/dashboard/${id}`}>
                Dashboard Contract
                </Link>
                <Typography className='text-lime-500'>tambah Amandemen</Typography>
            </Breadcrumbs>
            <div className='w-full space-y-2 bg-white shadow-sm px-2 py-4 rounded-lg'>
              <form 
                  method="post"
                  encType='multipart/form-data'
                  className="space-y-2"
                  // onSubmit={(e) => handleAddSpk(e)}
              >
                <div className='flex flex-col space-y-2 md:space-x-2'>
                  {/* <div className="flex flex-col w-full md:flex-row px-2 space-y-2 md:space-y-0 md:space-x-2">
                    <div className="space-y-1 flex flex-col">
                      <label htmlFor="" className="font-bold">Berita Acara Kesepakatan</label>
                      <input type="file" className="md:w-fit border rounded-md px-1 py-1.5 md:p-1" />
                    </div>
                    <div className="space-y-1 flex flex-col">
                      <label htmlFor="" className="font-bold">Dokumen Kontrak Hasil Amandemen</label>
                      <input type="file" className="md:w-fit border rounded-md px-1 py-1.5 md:p-1" />
                    </div>
                  </div>
                  <hr /> */}
                  <div className="w-full space-y-2 md:space-y-0">
                      <div className="flex flex-col md:flex-row md:items-center md:space-y-1">
                          <div className="flex flex-row justify-between w-fit font-bold md:w-64 md:h-16 items-center space-x-2">
                            Perubahan Nilai  <Checkbox onChange={(e) => setOpenNilai(e.target.checked)} />
                          </div>
                          { openNilai && <div className="flex flex-col w-full md:flex-row px-2 space-y-2 md:space-y-0 md:space-x-2">
                            <div className="space-y-1 flex flex-col md:w-1/3">
                              <label htmlFor="">Nilai Kontrak</label>
                              <input type="number" className="w-full border rounded-md px-1 py-1.5" placeholder="ex: 1000" />
                              <p className="text-red-600 text-xs">minimal: Rp. 200.001</p>
                            </div>
                            <div className="space-y-1 flex flex-col">
                              <label htmlFor="">Dokumen Ijin Prinsip</label>
                              <input type="file" className="md:w-fit border rounded-md px-1 py-1.5 md:p-1" />
                            </div>
                          </div>}
                      </div>
                      <div className="flex flex-col md:flex-row md:items-center md:space-y-1">
                          <div className="flex flex-row justify-between w-fit font-bold md:w-64 md:h-16 items-center space-x-2">
                            Perubahan Waktu  <Checkbox onChange={(e) => setOpenWaktu(e.target.checked)} />
                          </div>
                          { openWaktu && <div className="flex flex-col w-full md:flex-row px-2 space-y-2 md:space-y-0 md:space-x-2">
                            <div className="space-y-1 flex flex-col md:w-1/3">
                              <label htmlFor="">Kontrak Berakhir</label>
                              <input type="date" className="w-full border rounded-md px-1 py-1.5" />
                              <p className="text-red-600 text-xs">minimal: 1 Januari 2023</p>
                            </div>
                          </div>}
                      </div>
                      <div className="flex flex-col md:flex-row md:items-center md:space-y-1">
                          <div className="flex flex-row justify-between w-fit font-bold md:w-64 md:h-16 items-center space-x-2">
                            Perubahan denda  <Checkbox onChange={(e) => setOpenDenda(e.target.checked)} />
                          </div>
                          { openDenda && <div className="flex flex-col w-full md:flex-row px-2 space-y-2 md:space-y-0 md:space-x-2">
                            <div className="space-y-1 flex flex-col md:w-1/3">
                              <label htmlFor="">Persentase Denda</label>
                              <input type="number" className="w-full border rounded-md px-1 py-1.5" placeholder="ex: 10" />
                              <p className="text-red-600 text-xs">minimal: 1%</p>
                            </div>
                          </div>}
                      </div>
                  </div>
                </div>
              </form>
            </div>
        </div>
    </div>
  )
}

export default AddAmandement