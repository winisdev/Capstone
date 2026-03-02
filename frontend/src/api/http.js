import axios from 'axios'

const configuredBaseUrl = (
  import.meta.env.VITE_API_URL ??
  import.meta.env.VITE_API_BASE_URL ??
  '/api'
).replace(/\/$/, '')

const api = axios.create({
  baseURL: configuredBaseUrl,
  headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
  withCredentials: true,
})

api.interceptors.response.use(
  (res) => res,
  (err) => Promise.reject(err),
)

export default api
