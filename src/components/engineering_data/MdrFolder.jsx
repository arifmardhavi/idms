import { useState } from 'react'
import { IconFolder, IconPlus, IconRefresh } from '@tabler/icons-react'
import { useEffect } from 'react'
import { jwtDecode } from 'jwt-decode'
import ComingSoon from '../announcement/ComingSoon'

const MdrFolder = () => {
  const [userLevel, setUserLevel] = useState('');
  const [openFolder, setOpenFolder] = useState(false);

  useEffect(() => {
      const token = localStorage.getItem('token');
      let level = '';
      try {
          level = String(jwtDecode(token).level_user);
      } catch (error) {
          console.error('Invalid token:', error);
      }
      setUserLevel(level);
  }, []);


  return (
    <ComingSoon feature="MDR Tampilan Folder" />
    // <div className='w-full bg-white shadow-sm px-2 py-4 rounded-lg space-y-2'>
    //   <div className='flex flex-row justify-end items-center space-x-2'>
    //       <button
    //           className='flex space-x-1 items-center px-2 py-1 bg-emerald-950 text-lime-300 text-sm rounded hover:scale-110 transition duration-100'
    //           // onClick={fetchDatasheet}
    //       >
    //           <IconRefresh className='hover:rotate-180 transition duration-500' />
    //           <span>Refresh</span>
    //       </button>
    //       { userLevel !== '4' && userLevel !== '5' && <button
    //           // onClick={() => setOpenMultiple(true)}
    //           className='flex space-x-1 items-center px-2 py-1 bg-emerald-950 text-lime-300 text-sm rounded  hover:scale-110 transition duration-100'
    //       >
    //           <IconPlus className='hover:rotate-180 transition duration-500' />
    //           <span>Tambah Folder</span>
    //       </button>}
    //   </div>
    //   <div className='w-full flex flex-col'>
    //     <div className={`px-1 py-3 border-b border-gray-100 cursor-pointer ${openFolder ? '' : 'hover:bg-gray-100'}`} >
    //       <div className={`flex space-x-1 ${openFolder ? 'font-bold' : ''}`} onClick={ () => setOpenFolder(!openFolder) }>
    //         <IconFolder /> 
    //         <span>MDR 2025</span>
    //       </div>
    //       {openFolder && <div>
    //         <div className='cursor-pointer hover:underline px-3 py-2 border-b border-gray-100 hover:bg-gray-200'>
    //           File Name MDR 1.pdf
    //         </div>
    //         <div className='cursor-pointer hover:underline px-3 py-2 border-b border-gray-100 hover:bg-gray-200'>
    //           File Name MDR 2.pdf
    //         </div>
    //         <div className='cursor-pointer hover:underline px-3 py-2 border-b border-gray-100 hover:bg-gray-200'>
    //           File Name MDR 3.pdf
    //         </div>
    //         <div className='cursor-pointer mt-2 bg-gray-300 px-3 py-2 flex items-center space-x-1 w-fit hover:bg-gray-400 rounded'>
    //           <IconPlus /> Add New File
    //         </div>
    //       </div>}
    //     </div>
    //     <div className='px-1 py-3 border-b border-gray-100 cursor-pointer hover:bg-gray-100'>
    //       <div className='flex space-x-1'>
    //         <IconFolder /> 
    //         <span>MDR folder</span>
    //       </div>
    //     </div>
    //     <div className='px-1 py-3 border-b border-gray-100 cursor-pointer hover:bg-gray-100'>
    //       <div className='flex space-x-1'>
    //         <IconFolder /> 
    //         <span>MDR folder</span>
    //       </div>
    //     </div>
    //     <div className='px-1 py-3 border-b border-gray-100 cursor-pointer hover:bg-gray-100'>
    //       <div className='flex space-x-1'>
    //         <IconFolder /> 
    //         <span>MDR folder</span>
    //       </div>
    //     </div>
    //     <div className='px-1 py-3 border-b border-gray-100 cursor-pointer hover:bg-gray-100'>
    //       <div className='flex space-x-1'>
    //         <IconFolder /> 
    //         <span>MDR folder</span>
    //       </div>
    //     </div>
    //   </div>
    // </div>
  )
}

export default MdrFolder