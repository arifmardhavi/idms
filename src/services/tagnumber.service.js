import axios from "axios";

export const getTagnumber = (callback) => {
    axios
        .get("http://192.168.1.152:8080/api/tagnumbers", {
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

export const getTagnumberById = (id, callback) => {
    axios
        .get(`http://192.168.1.152:8080/api/tagnumbers/${id}`, {
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

export const getTagnumberByType = (id, callback) => {
    axios
        .get(`http://192.168.1.152:8080/api/tagnumbers/type/${id}`, {
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

export const getTagnumberByTagnumberId = (id, callback) => {
    axios
        .get(`http://192.168.1.152:8080/api/tagnumbers/tag_number/${id}`, {
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

export const getTagnumberByTagnumber = (tagname, callback) => {
    axios
        .get(`http://192.168.1.152:8080/api/tagname`, {
            params: { tag_number: tagname },
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

}

export const getTagnumberByTypeUnit = (typeId, UnitId, callback) => {
    axios
        .get(`http://192.168.1.152:8080/api/tagnumbers/typeunit/${typeId}/${UnitId}`, {
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

}

export const addTagnumber = (data, callback) => {
    axios
        .post("http://192.168.1.152:8080/api/tagnumbers", data, {
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

export const updateTagnumber = (id, data, callback) => {
    axios
        .put(`http://192.168.1.152:8080/api/tagnumbers/${id}`, data, {
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

export const deleteTagnumber = (id, callback) => {
    axios
        .delete(`http://192.168.1.152:8080/api/tagnumbers/${id}`, {
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

export const nonactiveTagnumber = (id, callback) => {
    axios
        .put(`http://192.168.1.152:8080/api/tagnumbers/nonactive/${id}`, {
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