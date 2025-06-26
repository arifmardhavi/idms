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
    const allPaths = [
      "/unit", "/category", "/type", "/tagnumber",
      "/user", "/features", "/plo", "/coi", "/skhp",
      "/historical_memorandum", "/engineering_data", "/user", "/features"
    ];
    const allowedPathsVendor = [
      "/",
      "/dashboard", 
      "/contract", 
      '/contract/dashboard/:id',
      '/contract/addspk/:id',
      '/contract/editspk/:id/:spk_id',
      '/contract/addamandemen/:id',
      '/contract/editamandemen/:id/:amandemen_id',
      '/contract/monitoring',
    ];

    if (levelUser === "2" && masterDataPaths.includes(location.pathname)) {
      Swal.fire({
        icon: 'error',
        title: 'Akses Ditolak!',
        text: 'Anda tidak memiliki izin untuk mengakses halaman ini.',
        confirmButtonText: 'OK'
      }).then(() => navigate('/'));
      return null;
    }

    // Perbaikan untuk levelUser 3: cek path dengan regex untuk path dinamis
    if (levelUser === "3") {
      const allowedPathsVendorRegex = allowedPathsVendor.map(path => {
        // Escape special regex chars except : for params
        const escaped = path.replace(/([.+?^=!:${}()|\[\]\/\\])/g, "\\$1");
        // Replace :param with regex to match any segment
        return new RegExp("^" + escaped.replace(/\\:([^\/]+)/g, "[^/]+") + "$");
      });
      const isAllowed = allowedPathsVendorRegex.some(regex => regex.test(location.pathname));
      if (!isAllowed) {
        Swal.fire({
          icon: 'error',
          title: 'Akses Ditolak!',
          text: 'Vendor hanya dapat mengakses fitur Contract.',
          confirmButtonText: 'OK'
        }).then(() => navigate('/contract'));
        return null;
      }
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
