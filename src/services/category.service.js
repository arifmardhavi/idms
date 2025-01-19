import axios from "axios";

export const getCategory = (callback) => {
    axios
        .get("http://192.168.1.152:8080/api/categories")
        .then((res) => {
            callback(res.data);
        })
        .catch((err) => {
            console.log(err);
        });
};

export const getCategoryById = (id, callback) => {
    axios
        .get(`http://192.168.1.152:8080/api/categories/${id}`)
        .then((res) => {
            callback(res.data);
        })
        .catch((err) => {
            console.log(err);
        });
};

export const getCategoryByUnit = (id, callback) => {
    axios
        .get(`http://192.168.1.152:8080/api/categories/unit/${id}`)
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
        .post("http://192.168.1.152:8080/api/categories", data)
        .then((res) => {
            callback(res.data);
        }) 
        .catch((err) => {
            console.log(err);
        }) 
}

export const updateCategory = (id, data, callback) => {
    axios
        .put(`http://192.168.1.152:8080/api/categories/${id}`, data)
        .then((res) => {
            callback(res.data);
        }) 
        .catch((err) => {
            console.log(err);
        }) 
}

export const deleteCategory = (id, callback) => {
    axios
        .delete(`http://192.168.1.152:8080/api/categories/${id}`)
        .then((res) => {
            callback(res.data);
        }) 
        .catch((err) => {
            console.log(err);
        }) 
}

export const nonactiveCategory = (id, callback) => {
    axios
        .put(`http://192.168.1.152:8080/api/categories/nonactive/${id}`)
        .then((res) => {
            callback(res.data);
        }) 
        .catch((err) => {
            console.log(err);
        }) 
}