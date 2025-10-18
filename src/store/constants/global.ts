const origin = typeof window !== 'undefined' ? window.location.origin : '';

// const apiBaseUrl = `${process.env.VITE_APP_API_BASE_URL}` 
const apiBaseUrl = `https://fe-task-api.mainstack.io/`
const appBaseUrl = origin


const global = {apiBaseUrl, appBaseUrl};

export default global 