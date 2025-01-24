import React from 'react'
import { Navigate } from 'react-router-dom'

const ProtectedRoute = ({ children }) => {
  const authToken = localStorage.getItem('authToken')

  if (!authToken) {
    // Redirect ke halaman login jika tidak ada token
    // return <Navigate to="/login" />
    return children
  }

  // Jika token ada, render halaman yang dilindungi
  return children
}

export default ProtectedRoute
