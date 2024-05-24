import axios from "axios";

// axios.defaults.url = "http://localhost:5254/api"

export function setToken(token: string) {
    axios.defaults.headers.Authorization = `Bearer ${token}`;
}

export function forgotToken() {
    axios.defaults.headers.Authorization = '';
}