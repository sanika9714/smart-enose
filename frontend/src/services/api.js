import axios from "axios"

const BASE_URL = "http://127.0.0.1:5000"

export const predictFreshness = async (sensorData) => {
    const response = await axios.post(`${BASE_URL}/predict`, sensorData)
    return response.data
}

export const getHistory = async () => {
    const response = await axios.get(`${BASE_URL}/history`)
    return response.data
}

export const getAnalytics = async () => {
    const response = await axios.get(`${BASE_URL}/analytics`)
    return response.data
}