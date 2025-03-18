import { Navigate, Outlet, useLocation, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import Swal from "sweetalert2";

const ProtectedRoute = () => {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const location = useLocation();

  if (!token) {
    Swal.fire({
      icon: 'error',
      title: 'Akses Ditolak!',
      text: 'Login Terlebih Dahulu.',
      confirmButtonText: 'OK'
    }).then(() => navigate('/login'));
    return null;
  }

  try {
    const decoded = jwtDecode(token);
    const levelUser = String(decoded.level_user); // Pastikan string

    // Blokir akses ke semua path di tab 'masterdata' jika level_user = 2
    const masterDataPaths = ["/unit", "/category", "/type", "/tagnumber"];

    if (levelUser === "2" && masterDataPaths.includes(location.pathname)) {
      Swal.fire({
        icon: 'error',
        title: 'Akses Ditolak!',
        text: 'Anda tidak memiliki izin untuk mengakses halaman ini.',
        confirmButtonText: 'OK'
      }).then(() => navigate('/'));
      return null;
    }

    return <Outlet />;
  } catch (error) {
    console.error("Invalid token:", error);
    localStorage.removeItem("token");
    Swal.fire({
      icon: 'error',
      title: 'Akses Ditolak!',
      text: 'Login Terlebih Dahulu.',
      confirmButtonText: 'OK'
    }).then(() => navigate('/login'));
    return null;
  }
};

export default ProtectedRoute;
