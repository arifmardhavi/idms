import { Navigate, Outlet, useLocation, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import Swal from "sweetalert2";

const ProtectedRoute = () => {
  const token = localStorage.getItem("token");
  const now = new Date();
 
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
    // const exp = Date(decoded.exp);
    const nowsecond = Math.floor(now.getTime() / 1000);

    if (nowsecond > decoded.exp) {
      localStorage.removeItem("token");
      Swal.fire({
        icon: 'error',
        title: 'Akses Ditolak!',
        text: 'Login Terlebih Dahulu.',
        confirmButtonText: 'OK'
      }).then(() => navigate('/login'));
      return null;
    }

    
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
