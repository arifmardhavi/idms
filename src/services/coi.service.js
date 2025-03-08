import axios from "axios";
const path = "http://ptmksmvmidmsru7.pertamina.com:4444/api/";
export const getCoi = (callback) => {
    axios
        .get(path + "coi", {
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

export const getCoiById = (id, callback) => {
    axios   
        .get(path + `coi/${id}`, {
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

export const addCoi = (data, callback) => {
    axios
        .post(path + "coi", data, {
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

export const updateCoi = (id, data, callback) => {
    axios
        .post(path + `coi/${id}?_method=PUT`, data, {
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

export const deleteCoi = (id, callback) => {
    axios
        .delete(path + `coi/${id}`, {
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

export const downloadSelectedCoi = (selectedIds) => {
    axios
      .post(path + 'coi/download', { ids: selectedIds }, {
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
        link.setAttribute('download', 'coi_certificates.zip');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      })
      .catch((error) => {
        console.error(error);
        alert('Gagal mendownload file COI.');
      });
}

export const deleteCoiFile = (id, data, callback) => {
    axios
        .put(path + `coi/deletefile/${id}`, data, {
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

export const coiCountDueDays = (callback) => {
    axios
        .get(path + "coi_countduedays", {
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

