import axios from "axios";

export const getPlo = (callback) => {
    axios
        .get("http://192.168.1.152:8080/api/plo")
        .then((res) => {
            callback(res.data);
        })
        .catch((err) => {
            console.log(err);
        });
};

export const getPloById = (id, callback) => {
    axios
        .get(`http://192.168.1.152:8080/api/plo/${id}`)
        .then((res) => {
            callback(res.data);
        })
        .catch((err) => {
            console.log(err);
        });
}

export const addPlo = (data, callback) => {
    axios
        .post("http://192.168.1.152:8080/api/plo", data)
        .then((res) => {
            callback(res.data);
        }) 
        .catch((err) => {
            console.log(err);
        }) 
}

export const updatePlo = (id, data, callback) => {
    axios
        .post(`http://192.168.1.152:8080/api/plo/${id}?_method=PUT`, data)
        .then((res) => {
            callback(res.data);
        }) 
        .catch((err) => {
            console.log(err);
        }) 
}

export const deletePlo = (id, callback) => {
    axios
        .delete(`http://192.168.1.152:8080/api/plo/${id}`)
        .then((res) => {
            callback(res.data);
        }) 
        .catch((err) => {
            console.log(err);
        }) 
}

export const nonactivePlo = (id, callback) => {
    axios
        .put(`http://192.168.1.152:8080/api/plo/nonactive/${id}`)
        .then((res) => {
            callback(res.data);
        }) 
        .catch((err) => {
            console.log(err);
        }) 
}

export const downloadSelectedPlo = (selectedIds) => {
    axios
      .post('http://192.168.1.152:8080/api/plo/download', { ids: selectedIds })
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