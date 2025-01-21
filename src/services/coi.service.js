import axios from "axios";

export const getCoi = (callback) => {
    axios
        .get("http://192.168.1.152:8080/api/coi")
        .then((res) => {
            callback(res.data);
        })
        .catch((err) => {
            console.log(err);
        });
};

export const getCoiById = (id, callback) => {
    axios
        .get(`http://192.168.1.152:8080/api/coi/${id}`)
        .then((res) => {
            callback(res.data);
        })
        .catch((err) => {
            console.log(err);
        });
}

export const addCoi = (data, callback) => {
    axios
        .post("http://192.168.1.152:8080/api/coi", data)
        .then((res) => {
            callback(res.data);
        }) 
        .catch((err) => {
            console.log(err);
        }) 
}

export const updateCoi = (id, data, callback) => {
    axios
        .post(`http://192.168.1.152:8080/api/coi/${id}?_method=PUT`, data)
        .then((res) => {
            callback(res.data);
        }) 
        .catch((err) => {
            console.log(err);
        }) 
}

export const deleteCoi = (id, callback) => {
    axios
        .delete(`http://192.168.1.152:8080/api/coi/${id}`)
        .then((res) => {
            callback(res.data);
        }) 
        .catch((err) => {
            console.log(err);
        }) 
}

export const downloadSelectedCoi = (selectedIds) => {
    axios
      .post('http://192.168.1.152:8080/api/coi/download', { ids: selectedIds })
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
  

