import React from 'react'
import Header from '../components/Header'

const Home = () => {
  return (
    <div className="flex flex-col md:flex-row w-full">
        <Header />
        <div className="flex flex-col md:pl-64 w-full px-2 py-4 space-y-3">
          DASHBOARD
        </div>
    </div>
  )
}

export default Home