import axios from "axios";
const path = "http://ptmksmvmidmsru7.pertamina.com:4444/api/";
export const getTagnumber = (callback) => {
    axios
        .get(path + "tagnumbers", {
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
        .get(path + `tagnumbers/${id}`, {
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
        .get(path + `tagnumbers/type/${id}`, {
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
        .get(path + `tagnumbers/tag_number/${id}`, {
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
        .get(path + `tagname`, {
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
        .get(path + `tagnumbers/typeunit/${typeId}/${UnitId}`, {
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
        .post(path + "tagnumbers", data, {
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
        .put(path + `tagnumbers/${id}`, data, {
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
        .delete(path + `tagnumbers/${id}`, {
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
        .put(path + `tagnumbers/nonactive/${id}`, {
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