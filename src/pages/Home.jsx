import React from 'react'
import Header from '../components/Header'

const Home = () => {
  return (
    <div className='flex flex-col md:flex-row'>
        <Header />
        <div className='flex flex-row w-full px-2 py-4 ' >
          DASHBOARD
        </div>
    </div>
  )
}

export default Home