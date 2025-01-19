import axios from "axios";

export const getUnit = (callback) => {
    axios
        .get("http://192.168.1.152:8080/api/units")
        .then((res) => {
            callback(res.data);
        })
        .catch((err) => {
            console.log(err);
        });
};

export const getUnitById = (id, callback) => {
    axios
        .get(`http://192.168.1.152:8080/api/units/${id}`)
        .then((res) => {
            callback(res.data);
        })
        .catch((err) => {
            console.log(err);
        });
};

export const addUnit = (data, callback) => {
    axios
        .post("http://192.168.1.152:8080/api/units", data)
        .then((res) => {
            callback(res.data);
        }) 
        .catch((err) => {
            console.log(err);
        }) 
}

export const updateUnit = (id, data, callback) => {
    axios
        .put(`http://192.168.1.152:8080/api/units/${id}`, data)
        .then((res) => {
            callback(res.data);
        }) 
        .catch((err) => {
            console.log(err);
        }) 
}

export const deleteUnit = (id, callback) => {
    axios
        .delete(`http://192.168.1.152:8080/api/units/${id}`)
        .then((res) => {
            callback(res.data);
        }) 
        .catch((err) => {
            console.log(err);
        }) 
}

export const nonactiveUnit = (id, callback) => {
    axios
        .put(`http://192.168.1.152:8080/api/units/nonactive/${id}`)
        .then((res) => {
            callback(res.data);
        }) 
        .catch((err) => {
            console.log(err);
        }) 
}