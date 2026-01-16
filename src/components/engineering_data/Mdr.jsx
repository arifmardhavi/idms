import Header from '../Header'
import { useState } from 'react'
import { IconArticle, IconChevronRight, IconExchangeFilled } from '@tabler/icons-react'
import { Breadcrumbs, Typography } from '@mui/material'
import { Link } from 'react-router-dom'
import MdrFolder from './MdrFolder'
import MdrTable from './MdrTable'

const Mdr = () => {
  const [hide, setHide] = useState(false)
  const [mdrFolder, setMdrFolder] = useState(false);


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
        <div className='flex w-full justify-between items-center'>
          <Breadcrumbs
              aria-label='breadcrumb'
              className="uppercase"
              separator={
              <IconChevronRight className='text-emerald-950' stroke={2} />
              }
          >
            <Link className='hover:underline text-emerald-950' to='/'>
              Home
            </Link>
            <Link className='hover:underline text-emerald-950' to='/engineering_data'>
              Engineering Data
            </Link>
            <Typography className='text-lime-500'>MDR</Typography>
          </Breadcrumbs>
          <div className='flex flex-row justify-end items-center space-x-2'>
              <button
                  className='flex space-x-1 items-center px-2 py-1 border-2 border-emerald-950 text-emerald-950 hover:text-lime-400 hover:bg-emerald-950 text-sm rounded transition duration-100'
                  onClick={() => setMdrFolder(!mdrFolder)}
              >
                  <IconExchangeFilled className='hover:rotate-180 transition duration-500' />
                  <span className='font-semibold'>View {mdrFolder ? 'Table' : 'Folder'}</span>
              </button>
          </div>
        </div>
        {mdrFolder ? <MdrFolder /> : <MdrTable />}
      </div>
    </div>
  )
}

export default Mdr