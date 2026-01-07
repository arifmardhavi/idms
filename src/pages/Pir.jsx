import { useState } from 'react'
import Header from '../components/Header'
import { IconArticle } from '@tabler/icons-react'
import ComingSoon from '../components/announcement/ComingSoon'

const Pir = () => {
  const [hide, setHide] = useState(false)
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
        <ComingSoon feature="Post Implementation Report (PIR)" />
      </div>
    </div>
  )
}

export default Pir