import axios from "axios";

export const getType = (callback) => {
    axios
        .get("http://192.168.1.152:8080/api/types")
        .then((res) => {
            callback(res.data);
        })
        .catch((err) => {
            console.log(err);
        });
};

export const getTypeByCategory = (id, callback) => {
    axios
        .get(`http://192.168.1.152:8080/api/types/category/${id}`)
        .then((res) => {
            callback(res.data);
        })
        .catch((err) => {
            callback(null);
            // console.log(err);
        });
};

export const addType = (data, callback) => {
    axios
        .post("http://192.168.1.152:8080/api/types", data)
        .then((res) => {
            callback(res.data);
        }) 
        .catch((err) => {
            console.log(err);
        }) 
}

export const updateType = (id, data, callback) => {
    axios
        .put(`http://192.168.1.152:8080/api/types/${id}`, data)
        .then((res) => {
            callback(res.data);
        }) 
        .catch((err) => {
            console.log(err);
        }) 
}

export const deleteType = (id, callback) => {
    axios
        .delete(`http://192.168.1.152:8080/api/types/${id}`)
        .then((res) => {
            callback(res.data);
        }) 
        .catch((err) => {
            console.log(err);
        }) 
}