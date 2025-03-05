import { useState, useEffect } from "react";
import { getPlo, ploCountDueDays } from "../../services/plo.service";

const usePlo = () => {
    const [plo, setPlo] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [countplo, setcountPlo] = useState([]);

    useEffect(() => {
        getPlo((data) => {
            if (data && data.data) {
                setPlo(data.data);
            } else {
                setPlo([]); // Jika data kosong, tetap set ke array agar tidak undefined
                setError("Gagal mengambil data PLO");
            }
            // setLoading(false);
        });

        ploCountDueDays((data) => {
            if (data && data.data) {
                setcountPlo(data.data);
                console.log('data : ', data.data);
            } else {
                setcountPlo([]); // Jika data kosong, tetap set ke array agar tidak undefined
                setError("Gagal mengambil data PLO");
            }
            setLoading(false);
        })
    }, []);

    return { plo, countplo, loading, error };
}

export default usePlo