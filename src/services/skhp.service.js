import axios from "axios";
const path = "http://ptmksmvmidmsru7.pertamina.com:4444/api/";
export const getSkhp = (callback) => {
    axios
        .get(path + "skhp", {
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

export const getSkhpById = (id, callback) => {
    axios   
        .get(path + `skhp/${id}`, {
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

export const addSkhp = (data, callback) => {
    axios
        .post(path + "skhp", data, {
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

export const updateSkhp = (id, data, callback) => {
    axios
        .post(path + `skhp/${id}?_method=PUT`, data, {
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

export const deleteSkhp = (id, callback) => {
    axios
        .delete(path + `skhp/${id}`, {
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

export const downloadSelectedSkhp = (selectedIds) => {
    axios
      .post(path + 'skhp/download', { ids: selectedIds }, {
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
        link.setAttribute('download', 'file_skhp.zip');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      })
      .catch((error) => {
        console.error(error);
        alert('Gagal mendownload file skhp.');
      });
}

export const deleteSkhpFile = (id, data, callback) => {
    axios
        .put(path + `skhp/deletefile/${id}`, data, {
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

export const skhpCountDueDays = (callback) => {
    axios
        .get(path + "skhp_countduedays", {
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

