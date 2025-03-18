import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/user.service";
import Swal from "sweetalert2";
import { useState } from "react";

const Login = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [validation, setValidation] = useState([]);
    const navigate = useNavigate();
    const handleLogin = async (event) => {
        event.preventDefault();
        setIsSubmitting(true);
        const formData = new FormData(event.target);
        const data = Object.fromEntries(formData);
        try {
            const response = await loginUser(data);
            const token = response.data.token;
            localStorage.setItem('token', token);
            Swal.fire('Berhasil!', 'Login berhasil!', 'success');
            setValidation([]);
            navigate('/');
        } catch (error) {
            console.error(error.response?.data?.errors);
            setValidation(error.response?.data?.errors || []);
            Swal.fire('Gagal!', 'Terjadi kesalahan saat melakukan login!', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };
    return (
        <div className="bg-emerald-950 flex flex-col justify-center items-center min-w-screen min-h-screen">
            <div className="bg-lime-400 flex flex-col justify-center items-center text-emerald-950 w-[600px] h-96 rounded-lg rotate-6 " >
                <div className=" bg-emerald-950 flex flex-col p-2 text-lime-300 w-[600px] h-96 rounded-lg -rotate-6 border border-lime-300/20">
                    <div className="flex flex-col justify-center items-center my-2" >
                        <div className="flex flex-row justify-center items-center">
                            <img src='/images/kpi-putih.png' alt="Logo" width={150} className="border-r border-lime-300 mr-2" />
                            <h1 className="text-3xl">IDMS</h1>
                        </div>
                        <h1 className="text-2xl">Login</h1>
                    </div>
                    <div>
                        <form onSubmit={handleLogin} className="space-y-4 text-white flex flex-col justify-center items-center">
                            <div className="space-y-2">
                                <p>Masukkan Email</p>
                                <input name="email" type="email" placeholder="ex: youremail@gmail.com" className="border border-lime-300 rounded-md p-2 w-96 bg-transparent outline-none" required />
                                {validation.email && (
                                    validation.email.map((item, index) => (
                                        <div key={index}>
                                        <small className="text-red-600 text-sm">{item}</small>
                                        </div>
                                    ))
                                )}
                            </div>
                            <div className="flex flex-col justify-center items-center my-2">
                                <input name="password" type="password" placeholder="********" className="border border-lime-300 rounded-md p-2 w-96 bg-transparent outline-none" required />
                            </div>
                            <div className="flex flex-col justify-center items-center my-2">
                                <button type="submit" className="bg-lime-400 text-emerald-950 rounded-md p-2 w-96" disabled={isSubmitting}>Login</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
