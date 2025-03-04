import axios from "axios";

export const getType = (callback) => {
    axios
        .get("http://127.0.0.1:8000/api/types", {
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

export const getTypeById = (id, callback) => {
    axios
        .get(`http://127.0.0.1:8000/api/types/${id}`, {
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

export const getTypeByCategory = (id, callback) => {
    axios
        .get(`http://127.0.0.1:8000/api/types/category/${id}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
        })
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
        .post("http://127.0.0.1:8000/api/types", data, {
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

export const updateType = (id, data, callback) => {
    axios
        .put(`http://127.0.0.1:8000/api/types/${id}`, data, {
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

export const deleteType = (id, callback) => {
    axios
        .delete(`http://127.0.0.1:8000/api/types/${id}`, {
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

export const nonactiveType = (id, callback) => {
    axios
        .put(`http://127.0.0.1:8000/api/types/nonactive/${id}`, {
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