import axios from "axios";
const path = "http://ptmksmvmidmsru7.pertamina.com:4444/api/";
export const getPlo = (callback) => {
    axios
        .get(path + "plo", {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
        })
        .then((res) => {
            callback(res.data);
        })
        .catch((err) => {
            console.log(err);
        });
};

export const getPloById = (id, callback) => {
    axios
        .get(path + `plo/${id}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
        })
        .then((res) => {
            callback(res.data);
        })
        .catch((err) => {
            console.log(err);
        });
}

export const addPlo = (data, callback) => {
    axios
        .post(path + "plo", data, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
        })
        .then((res) => {
            callback(res.data);
        }) 
        .catch((err) => {
            console.log(err);
        }) 
}

export const updatePlo = (id, data, callback) => {
    axios
        .post(path + `plo/${id}?_method=PUT`, data, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
        })
        .then((res) => {
            callback(res.data);
        }) 
        .catch((err) => {
            console.log(err);
        }) 
}

export const deletePlo = (id, callback) => {
    axios
        .delete(path + `plo/${id}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
        })
        .then((res) => {
            callback(res.data);
        }) 
        .catch((err) => {
            console.log(err);
        }) 
}

export const nonactivePlo = (id, callback) => {
    axios
        .put(path + `plo/nonactive/${id}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
        })
        .then((res) => {
            callback(res.data);
        }) 
        .catch((err) => {
            console.log(err);
        }) 
}

export const downloadSelectedPlo = (selectedIds) => {
    axios
      .post(path + 'plo/download', { ids: selectedIds }, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      })
      .then((response) => {
        const url = response.data.url;  // URL dari response backend
        if (!url) {
          alert('Gagal mendapatkan URL untuk file ZIP.');
          return;
        }
        
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'plo_certificates.zip');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      })
      .catch((error) => {
        console.error(error);
        alert('Gagal mendownload file PLO.');
      });
}

export const deletePloFile = (id, data, callback) => {
    axios
        .put(path + `plo/deletefile/${id}`, data, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
        })
        .then((res) => {
            callback(res.data);
        }) 
        .catch((err) => {
            console.log(err);
        }) 
}

export const ploCountDueDays = (callback) => {
    axios
        .get(path + "plo_countduedays", {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
        })
        .then((res) => {
            callback(res.data);
        })
        .catch((err) => {
            console.log(err);
        });
};