import { AnimatePresence } from 'motion/react';
import * as motion from 'motion/react-client';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import {
  IconHome, IconBrandUnity, IconCategory, IconAlignBoxLeftMiddle, IconTag,
  IconStack2, IconRectangularPrism, IconArticle, IconX, IconUser,
  IconDatabaseCog, IconFiles, IconFileAnalytics
} from '@tabler/icons-react';
import { jwtDecode } from 'jwt-decode';
import { IconLogout } from '@tabler/icons-react';
import { apiLogout } from '../services/config';
import Swal from 'sweetalert2';
import { IconContract } from '@tabler/icons-react';

const SidesMenu = [
  { name: 'Home', icon: <IconHome />, path: '/' },
  { name: 'Unit', icon: <IconBrandUnity />, path: '/unit', tab: 'masterdata' },
  { name: 'Kategori Peralatan', icon: <IconCategory />, path: '/category', tab: 'masterdata' },
  { name: 'Tipe Peralatan', icon: <IconAlignBoxLeftMiddle />, path: '/type', tab: 'masterdata' },
  { name: 'Tag Number', icon: <IconTag />, path: '/tagnumber', tab: 'masterdata' },
  { name: 'User', icon: <IconUser />, path: '/user', tab: 'masterdata' },
  { name: 'PLO', icon: <IconStack2 />, path: '/plo', tab: 'regulatorycompliance' },
  { name: 'COI', icon: <IconRectangularPrism />, path: '/coi', tab: 'regulatorycompliance' },
  { name: 'SKHP', icon: <IconFileAnalytics />, path: '/skhp', tab: 'regulatorycompliance' },
  { name: 'Contract', icon: <IconContract />, path: '/skhp', tab: 'regulatorycompliance' },
];

const Header = () => {
  const [openTab, setOpenTab] = useState('');
  const [openMobile, setOpenMobile] = useState(false);
  const token = localStorage.getItem('token');
  let userLevel = '';

  const handleLogout = async (event) => {
    event.preventDefault();
    try {
      await apiLogout('/logout');
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      localStorage.clear();
      Swal.fire('Berhasil!', 'Logout berhasil!', 'success').then(() => {
        window.location.href = '/login';
      });
    }
  };

  try {
    userLevel = String(jwtDecode(token).level_user);
  } catch (error) {
    console.error('Invalid token:', error);
    localStorage.removeItem('token');
  }

  const handleTabClick = (tabName) => setOpenTab(openTab === tabName ? '' : tabName);
  const activeMenu = (menu) => localStorage.getItem('active') === menu ? 'text-lime-300 border-lime-300 border-l-4' : '';

  const renderMenu = (tab) => (
    <AnimatePresence>
      {openTab === tab && (
        <motion.div
          key={tab}
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className='pl-4'
        >
          {SidesMenu.filter(menu => menu.tab === tab).map((menu, index) => (
            <motion.div
              key={menu.path || menu.name || index}
              whileTap={{ scale: 0.9 }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, scale: { type: 'spring', bounce: 0.4 } }}
              className={`hover:text-lime-300 hover:border-lime-300 hover:border-l-4 rounded-md ${activeMenu(menu.name)}`}
            >
              <Link to={menu.path} className='flex items-center space-x-3 p-2 cursor-pointer' onClick={() => localStorage.setItem('active', menu.name)}>
                {menu.icon}
                <span className='text-white'>{menu.name}</span>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );

  const renderTab = (tab, icon, label) => (
    <motion.div whileTap={{ scale: 0.9 }} initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, scale: { type: 'spring', bounce: 0.4 } }}
      className={`flex items-center space-x-2 p-2 cursor-pointer hover:text-lime-300 hover:border-lime-300 hover:border-l-4 rounded-md ${openTab === tab ? 'text-lime-300 border-lime-300 border-l-4' : ''}`}
      onClick={() => handleTabClick(tab)}>
      {icon}
      <span className='text-sm'>{label}</span>
    </motion.div>
  );

  return (
    <>
      {/* Desktop */}
      <div className={`fixed w-60 min-h-screen space-y-2 bg-emerald-950 text-white shadow-lg px-2 py-4 z-50 ${openMobile ? 'block' : 'hidden md:flex flex-col'}`}>
        <div className='flex justify-center items-center space-x-2'>
          <img className='w-24 xl:w-32 border-r-2 border-slate-300' src='/images/kpi-putih.png' alt='Logo Pertamina' />
          <span className='text-md xl:text-xl font-bold'>IDMS</span>
        </div>
        {userLevel !== '2' && (
          <>
            {renderTab('masterdata', <IconDatabaseCog />, 'Master Data')}
            {renderMenu('masterdata')}
          </>
        )}
        {renderTab('regulatorycompliance', <IconFiles />, 'Regulatory Compliance')}
        {renderMenu('regulatorycompliance')}
        <div onClick={handleLogout} className='cursor-pointer'>{renderTab('logout', <IconLogout />, 'Logout')}</div>
      </div>

      {/* Mobile */}
      <div className='md:hidden flex justify-between items-center px-2 text-white bg-emerald-950'>
        <div className='flex justify-center items-center w-[calc(100%-3rem)] space-x-2'>
          <img className='w-28 border-slate-300' src='/images/kpi-putih.png' alt='Logo Pertamina' />
          <span className='text-xl font-bold'>IDMS</span>
        </div>
        <motion.div whileTap={{ scale: 0.8 }}>
          {openMobile ? <IconX className='cursor-pointer w-10 h-10 text-lime-300' onClick={() => setOpenMobile(false)} />
            : <IconArticle className='cursor-pointer w-10 h-10' onClick={() => setOpenMobile(true)} />}
        </motion.div>
      </div>
    </>
  );
};

export default Header;