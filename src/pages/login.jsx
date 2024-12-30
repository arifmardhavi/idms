import React, { useState, useEffect } from "react";
import { Link } from "react-router";
import { useSelector } from "react-redux";
import { IconUser, IconLockPassword, IconEye, IconEyeClosed } from "@tabler/icons-react";
import { useDispatch } from "react-redux";
import { toggleDarkMode } from "../redux/themeSlice";
import { IconSun, IconMoon } from "@tabler/icons-react";

export default function Login() {
    const [passwordVisible, setPasswordVisible] = useState(false);
    const dispatch = useDispatch();
    const isDarkMode = useSelector((state) => state.theme.isDarkMode); // Ambil status dark mode

    useEffect(() => {
        // Sesuaikan kelas `dark` pada <body> saat status berubah
        document.body.classList.toggle("dark", isDarkMode);
    }, [isDarkMode]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const username = e.target.username.value;
        const password = e.target.password.value;
        console.log("Username:", username);
        console.log("Password:", password);
        alert( "Selamat datang " + username + " di Inspection Data Management System, Silahkan klik ok untuk melanjutkan");
        window.location.href = "/";
    };

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
        document.getElementById("password").type = passwordVisible ? "password" : "text";
    };

    return (
        <div className="flex flex-row max-w-full h-screen">
            <div className={`hidden md:flex w-1/2 ${isDarkMode ? "bg-[url('/images/background1.jpg')]" : "bg-[url('/images/background3.jpg')]"} bg-cover`}></div>
            <div className="w-full lg:w-1/2 px-4 py-4 flex flex-col justify-center items-center h-[calc(100vh-100px)] max-h-screen dark:bg-slate-900">
                <div className="flex flex-col justify-center items-center gap-2 w-full">
                    <div className="flex flex-row justify-center items-center gap-3 px-2 py-4">
                        <img
                            src={isDarkMode ? "/images/kpi-putih.png" : "/images/kpi.png"}
                            width={150}
                            alt="Pertamina Logo"
                            className="border-r-2 border-slate-300"
                        />
                        <h1 className="text-xs dark:text-white">
                            Inspection Data
                            <br />
                            Management System
                        </h1>
                    </div>
                    <div className="flex flex-col w-full md:w-2/3 gap-6">
                        <h1 className="text-2xl text-center mt-4 font-bold dark:text-white">LOGIN</h1>
                        <form onSubmit={(e) => handleSubmit(e)} method="post" className="flex flex-col gap-6">
                            <div className="flex flex-col gap-2 w-full">
                                <label htmlFor="username" className="dark:text-white">
                                    Username
                                </label>
                                <div className="flex flex-row items-center gap-2 bg-slate-200 dark:bg-slate-800 rounded-md px-2">
                                    <IconUser stroke={2} />
                                    <input
                                        type="text"
                                        name="username"
                                        id="username"
                                        placeholder="Username"
                                        className="py-2 w-full border-none bg-transparent focus:outline-none"
                                    />
                                </div>
                            </div>
                            <div className="flex flex-col gap-2">
                                <label htmlFor="password" className="dark:text-white">
                                    Password
                                </label>
                                <div className="flex flex-row items-center gap-2 bg-slate-200 dark:bg-slate-800 rounded-md px-2">
                                    <IconLockPassword stroke={2} />
                                    <input
                                        type="password"
                                        name="password"
                                        id="password"
                                        placeholder="Password"
                                        className="py-2 w-full border-none bg-transparent focus:outline-none"
                                    />
                                    {passwordVisible ? (
                                        <IconEye stroke={2} className="cursor-pointer" onClick={togglePasswordVisibility} />
                                    ) : (
                                        <IconEyeClosed stroke={2} className="cursor-pointer" onClick={togglePasswordVisibility} />
                                    )}
                                </div>
                            </div>
                            <div className="flex flex-row gap-2">
                                <input type="checkbox" name="remember" id="remember" className="focus:outline-none" />
                                <label htmlFor="remember" className="dark:text-white">
                                    Remember me
                                </label>
                            </div>
                            <button type="submit" className="px-4 py-2 bg-blue-500 dark:bg-blue-900 text-white rounded-md hover:bg-blue-800">
                                Login
                            </button>
                        </form>
                        <div className="flex flex-row justify-center items-center gap-2">
                            <span className="dark:text-white">Butuh Bantuan?</span>
                            <Link
                                to="https://wa.me/62895325111100"
                                className="text-blue-500 dark:text-blue-800 dark:hover:text-blue-700 underline"
                            >
                                Hubungi Admin
                            </Link>
                        </div>
                    </div>
                    <button className="mt-2 bg-slate-300 dark:text-yellow-500 p-3 rounded-full dark:bg-slate-700" onClick={() => dispatch(toggleDarkMode())}>
                    {isDarkMode ? (
                        <IconSun className="text-yellow-500" />
                        ) : (
                        <IconMoon className="text-blue-500" />
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
