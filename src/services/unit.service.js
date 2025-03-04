import axios from "axios";

export const getUnit = (callback) => {
    axios
        .get("http://127.0.0.1:8000/api/units", {
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

export const getUnitById = (id, callback) => {
    axios
        .get(`http://127.0.0.1:8000/api/units/${id}`, {
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

export const addUnit = (data, callback) => {
    axios
        .post("http://127.0.0.1:8000/api/units", data, {
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

export const updateUnit = (id, data, callback) => {
    axios
        .put(`http://127.0.0.1:8000/api/units/${id}`, data, {
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

export const deleteUnit = (id, callback) => {
    axios
        .delete(`http://127.0.0.1:8000/api/units/${id}`, {
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

export const nonactiveUnit = (id, callback) => {
    axios
        .put(`http://127.0.0.1:8000/api/units/nonactive/${id}`, {
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