import { IconPlus } from "@tabler/icons-react"

const LumpsumProgress = () => {
  return (
    <div>
        <div className='flex flex-row justify-between py-2'>
            <h1 className='text-xl font-bold uppercase'>Progress Pekerjaan</h1>
            <div className='flex flex-row justify-end items-center space-x-2'>
                <button
                    // onClick={() => setOpen(true)}
                    className='flex space-x-1 items-center px-2 py-1 bg-emerald-950 text-lime-300 text-sm rounded  hover:scale-110 transition duration-100'
                >
                    <IconPlus className='hover:rotate-180 transition duration-500' />
                    <span>Tambah</span>
                </button>
            </div>
        </div>
    </div>
  )
}

export default LumpsumProgress