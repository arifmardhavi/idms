import { AnimatePresence } from 'motion/react';
import * as motion from 'motion/react-client';
import { Link } from 'react-router-dom';
import { useState } from 'react';

// icons
import {
  IconHome,
  IconBookUpload,
  IconBrandUnity,
  IconCategory,
  IconAlignBoxLeftMiddle,
  IconTag,
  IconStack2,
  IconRectangularPrism,
  IconArticle,
} from '@tabler/icons-react';
import { Icon } from '@mui/material';
import { IconX } from '@tabler/icons-react';
import { IconUser } from '@tabler/icons-react';
import { IconDatabaseCog } from '@tabler/icons-react';
import { IconFiles } from '@tabler/icons-react';
import { IconFileAnalytics } from '@tabler/icons-react';
const Header = () => {
  const [open, setOpen] = useState(false);
  const [openMobile, setOpenMobile] = useState(false);
  const [activeTab, setActiveTab] = useState('');

  const handleClick = (tabName) => {
    if (activeTab === tabName) {
      setOpen(!open);
    } else {
      setOpen(true);
      setActiveTab(tabName);
    }
  };

  const SidesMenu = [
    {
      name: 'Home',
      icon: <IconHome stroke={2} />,
      tab: 'home',
      path: '/',
    },
    {
      name: 'Unit',
      icon: <IconBrandUnity stroke={2} />,
      tab: 'masterdata',
      path: '/unit',
    },
    {
      name: 'Kategori Peralatan ',
      icon: <IconCategory stroke={2} />,
      tab: 'masterdata',
      path: '/category',
    },
    {
      name: 'Tipe Peralatan',
      icon: <IconAlignBoxLeftMiddle stroke={2} />,
      tab: 'masterdata',
      path: '/type',
    },
    {
      name: 'Tag Number',
      icon: <IconTag stroke={2} />,
      tab: 'masterdata',
      path: '/tagnumber',
    },
    {
      name: 'PLO',
      icon: <IconStack2 stroke={2} />,
      tab: 'regulatorycompliance',
      path: '/plo',
    },
    {
      name: 'COI',
      icon: <IconRectangularPrism stroke={2} />,
      tab: 'regulatorycompliance',
      path: '/coi',
    },
    {
      name: 'SKHP',
      icon: <IconFileAnalytics stroke={2} />,
      tab: 'regulatorycompliance',
      path: '/skhp',
    },
    {
      name: 'User',
      icon: <IconUser stroke={2} />,
      tab: 'regulatorycompliance',
      path: '/user',
    },
  ];
  return (
    <>
      {/* dekstop */}
      <div
        className={`${
          openMobile ? 'block' : 'hidden md:flex flex-col'
        } fixed w-60 min-h-screen h-full space-y-2 bg-emerald-950 text-white shadow-lg px-2 py-4 z-50`}
      >
        <div className='flex flex-row justify-center items-center space-x-2'>
          <img
            className='w-24 xl:w-32 border-r-2 border-slate-300'
            src='/images/kpi-putih.png'
            alt='Logo Pertamina'
          />
          <span className='text-md xl:text-xl font-bold'>IDMS</span>
        </div>
        <div className='flex flex-col space-y-2'>
          <AnimatePresence className='text-xs'>
            <motion.div
              key={1}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className='flex flex-col space-y-2'
            >
              <motion.div
                key={2}
                // whileHover={{ scale: 0.95 }}
                whileTap={{ scale: 0.9 }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                className={` flex flex-row space-x-2 p-2 cursor-pointer ${
                  activeTab === 'masterdata' && open
                    ? 'text-lime-300 border-lime-300 border-l-4'
                    : ''
                } hover:text-lime-300 hover:border-lime-300 hover:border-l-4 rounded-md`}
                transition={{
                  duration: 0.4,
                  scale: {
                    type: 'spring',
                    bounce: 0.4,
                  },
                }}
                onClick={() => {
                  handleClick('masterdata');
                }}
              >
                <IconDatabaseCog />
                <span className='text-sm'>Master Data</span>
              </motion.div>
              {activeTab === 'masterdata' && open && (
                <div className='pl-4'>
                  {SidesMenu.map(
                    (menu, index) =>
                      menu.tab == 'masterdata' && (
                        <AnimatePresence key={index}>
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className='flex flex-col space-y-2'
                          >
                            <motion.div
                              // whileHover={{ scale: 0.95 }}
                              whileTap={{ scale: 0.9 }}
                              initial={{ opacity: 0, scale: 0 }}
                              animate={{ opacity: 1, scale: 1 }}
                              className={` ${
                                localStorage.getItem('active') === menu.name
                                  ? 'text-lime-300 border-lime-300 border-l-4'
                                  : ''
                              } hover:text-lime-300 hover:border-lime-300 hover:border-l-4 rounded-md`}
                              transition={{
                                duration: 0.4,
                                scale: {
                                  type: 'spring',
                                  visualDuration: index / 10,
                                  bounce: 0.4,
                                },
                              }}
                            >
                              <Link
                                to={menu.path}
                                className='flex flex-row items-center space-x-3 cursor-pointer p-2'
                                onClick={() =>
                                  localStorage.setItem('active', menu.name)
                                }
                              >
                                {menu.icon}
                                <span className='text-white'>{menu.name}</span>
                              </Link>
                            </motion.div>
                          </motion.div>
                        </AnimatePresence>
                      )
                  )}
                </div>
              )}
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className='flex flex-col space-y-2'
            >
              <motion.div
                // whileHover={{ scale: 0.95 }}
                whileTap={{ scale: 0.9 }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                className={` flex flex-row space-x-2 p-2 cursor-pointer ${
                  activeTab === 'regulatorycompliance' && open
                    ? 'text-lime-300 border-lime-300 border-l-4'
                    : ''
                } hover:text-lime-300 hover:border-lime-300 hover:border-l-4 rounded-md`}
                transition={{
                  duration: 0.4,
                  scale: {
                    type: 'spring',
                    bounce: 0.4,
                  },
                }}
                onClick={() => {
                  handleClick('regulatorycompliance');
                }}
              >
                <IconFiles />
                <span className='text-sm'>Regulatory Compliance</span>
              </motion.div>
              {activeTab === 'regulatorycompliance' && open && (
                <div className='pl-4'>
                  {SidesMenu.map(
                    (menu, index) =>
                      menu.tab == 'regulatorycompliance' && (
                        <AnimatePresence key={index}>
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className='flex flex-col space-y-2'
                          >
                            <motion.div
                              // whileHover={{ scale: 0.95 }}
                              whileTap={{ scale: 0.9 }}
                              initial={{ opacity: 0, scale: 0 }}
                              animate={{ opacity: 1, scale: 1 }}
                              className={` ${
                                localStorage.getItem('active') === menu.name
                                  ? 'text-lime-300 border-lime-300 border-l-4'
                                  : ''
                              } hover:text-lime-300 hover:border-lime-300 hover:border-l-4 rounded-md`}
                              transition={{
                                duration: 0.4,
                                scale: {
                                  type: 'spring',
                                  visualDuration: index / 10,
                                  bounce: 0.4,
                                },
                              }}
                            >
                              <Link
                                to={menu.path}
                                className='flex flex-row items-center space-x-3 cursor-pointer p-2'
                                onClick={() =>
                                  localStorage.setItem('active', menu.name)
                                }
                              >
                                {menu.icon}
                                <span className='text-white'>{menu.name}</span>
                              </Link>
                            </motion.div>
                          </motion.div>
                        </AnimatePresence>
                      )
                  )}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
          {/* {SidesMenu.map(
            (menu, index) =>
              menu.tab == 'masterdata' && (
                <AnimatePresence key={index}>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className='flex flex-col space-y-2'
                  >
                    <motion.div
                      // whileHover={{ scale: 0.95 }}
                      whileTap={{ scale: 0.9 }}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className={` ${
                        localStorage.getItem('active') === menu.name
                          ? 'text-lime-300 border-lime-300 border-l-4'
                          : ''
                      } hover:text-lime-300 hover:border-lime-300 hover:border-l-4 rounded-md`}
                      transition={{
                        duration: 0.4,
                        scale: {
                          type: 'spring',
                          visualDuration: index / 10,
                          bounce: 0.4,
                        },
                      }}
                    >
                      <Link
                        to={menu.path}
                        className='flex flex-row items-center space-x-3 cursor-pointer p-2'
                        onClick={() =>
                          localStorage.setItem('active', menu.name)
                        }
                      >
                        {menu.icon}
                        <span className='text-white'>{menu.name}</span>
                      </Link>
                    </motion.div>
                  </motion.div>
                </AnimatePresence>
              )
          )} */}
        </div>
      </div>

      {/* mobile */}
      <div className='md:hidden flex flex-row justify-between items-center px-2 text-white bg-emerald-950'>
        <div className='flex flex-row justify-center items-center w-[calc(100%-3rem)] space-x-2'>
          <img
            className='w-28 border-slate-300'
            src='/images/kpi-putih.png'
            alt='Logo Pertamina'
          />
          <span className='text-xl font-bold'>IDMS</span>
        </div>
        <motion.div whileTap={{ scale: 0.8 }}>
          {openMobile ? (
            <IconX
              className={`cursor-pointer w-10 h-10 text-lime-300`}
              stroke={1}
              onClick={() => setOpenMobile(false)}
            />
          ) : (
            <IconArticle
              className={`cursor-pointer w-10 h-10 text-white`}
              stroke={1}
              onClick={() => setOpenMobile(true)}
            />
          )}
        </motion.div>
      </div>
    </>
  );
};

export default Header;
