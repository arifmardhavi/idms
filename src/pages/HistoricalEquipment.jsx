import { IconAlignLeft, IconArticle, IconCalendar, IconFileFilled } from '@tabler/icons-react'
import Header from '../components/Header'
import { useState } from 'react'
import { getHistoricalEquipment } from '../services/historical_equipment.service'
import { useEffect } from 'react'
import { handleAddActivity } from '../utils/handleAddActivity'
import { Link } from 'react-router-dom'
import { api_public } from '../services/config'
import ComingSoon from '../components/announcement/ComingSoon'

const HistoricalEquipment = () => {
  const [hide, setHide] = useState(false)
  const base_public_url = api_public;
  const [historicalEquipment, setHistoricalEquipment] = useState([]);

  useEffect(() => {
    fetchHistoricalEquipment();
  }, []);

  const fetchHistoricalEquipment = async () => {
    try {
      const data = await getHistoricalEquipment();
      setHistoricalEquipment(data.data);
      console.log(data.data);
    } catch (error) {
      console.error("Error fetching Preventive data:", error);
    }
  }

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
        <div className='w-full bg-white shadow-sm px-2 py-4 rounded-lg space-y-2'>
          <ComingSoon feature="Historical Equipment" />
        </div>
      </div>
    </div>
  )
}

export default HistoricalEquipment