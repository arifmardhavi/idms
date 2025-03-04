import axios from "axios";

export const getCategory = (callback) => {
    axios
        .get("http://127.0.0.1:8000/api/categories", {
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

export const getCategoryById = (id, callback) => {
    axios
        .get(`http://127.0.0.1:8000/api/categories/${id}`, {
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

export const getCategoryByUnit = (id, callback) => {
    axios
        .get(`http://127.0.0.1:8000/api/categories/unit/${id}`, {
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

export const addCategory = (data, callback) => {
    axios
        .post("http://127.0.0.1:8000/api/categories", data, {
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

export const updateCategory = (id, data, callback) => {
    axios
        .put(`http://127.0.0.1:8000/api/categories/${id}`, data, {
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

export const deleteCategory = (id, callback) => {
    axios
        .delete(`http://127.0.0.1:8000/api/categories/${id}`, {
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

export const nonactiveCategory = (id, callback) => {
    axios
        .put(`http://127.0.0.1:8000/api/categories/nonactive/${id}`, {
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