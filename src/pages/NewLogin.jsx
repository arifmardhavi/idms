import { IconEye, IconEyeClosed } from "@tabler/icons-react"
import { useState } from "react";

const NewLogin = () => {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <div className="bg-slate-100 flex flex-col justify-center items-center min-w-screen min-h-screen p-4">
      <div className="bg-white flex flex-col justify-center items-center w-full max-w-lg p-6 rounded-lg shadow-lg">
        <div className="flex flex-row justify-center items-center mb-6">
          <img src='/images/kpi.png' alt="Logo" className="border-r border-black w-32 mr-2" />
          <h1 className="text-xs md:text-lg">Inspection Data <br /> Management System </h1>
        </div>
        <h1 className="text-2xl mb-4">LOGIN</h1>
        <div className="flex flex-col justify-center items-center w-full">
          <form className="space-y-4 w-full text-sm" action="/login" method="POST">
            <div className="space-y-2">
              <label htmlFor="username" className="text-sm text-slate-500">Username</label>
              <input name="username" type="text" placeholder="Masukkan Username" className="border border-slate-200 rounded-md p-2 w-full bg-transparent outline-none" required />
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm text-slate-500">Password</label>
              <div className="flex flex-row justify-between items-center space-x-2">
                <input name="password" type={showPassword ? 'text' : 'password'} placeholder="Masukkan Password" className="border border-slate-200 rounded-md p-2 w-full bg-transparent outline-none" required />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="bg-transparent border border-slate-200 rounded-md p-2">
                  {showPassword ? <IconEye /> : <IconEyeClosed />}
                </button>
              </div>
              <button type="submit" className="bg-blue-500 text-white text-sm rounded p-2 w-full">Login</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default NewLogin