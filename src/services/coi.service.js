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
