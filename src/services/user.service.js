import axios from "axios";

export const getUser = (callback) => {
    axios
        .get("http://127.0.0.1:8000/api/users", {
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

export const getUserById = (id, callback) => {
    axios
        .get(`http://127.0.0.1:8000/api/users/${id}`, {
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

export const addUser = (data, callback) => {
    axios
        .post("http://127.0.0.1:8000/api/users", data, {
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

export const updateUser = (id, data, callback) => {
    axios
        .put(`http://127.0.0.1:8000/api/users/${id}`, data, {
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

export const deleteUser = (id, callback) => {
    axios
        .delete(`http://127.0.0.1:8000/api/users/${id}`, {
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

export const nonactiveUser = (id, callback) => {
    axios
        .put(`http://127.0.0.1:8000/api/users/nonactive/${id}`, {
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