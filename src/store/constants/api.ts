import global from "./global";
import axios from "axios";
import toast from "react-hot-toast";


const apiBaseUrl = global.apiBaseUrl;

const axios_instance = axios.create({
	baseURL: apiBaseUrl,
	timeout: 60000,
	// headers: { Authorization: "Bearer " + accessT },
});

// export const authorizationRedirect = () => {
//  	Cookies.remove('cactcu');
// 	window.location.assign(global.appBaseUrl);
// };

export const serverCodes = [
	500, 501, 502, 503, 504, 505, 506, 507, 508, 509, 510, 511,
];

export const errorHandler = (error: unknown, routeType: string) => {
	if (axios.isAxiosError(error)) {
		let errorMessage = "";

		if (error.code === "ERR_NETWORK") {
			errorMessage = "Please check your network connection";
		} else if (
			error.code === "ECONNABORTED" &&
			error.message === "timeout of 60000ms exceeded"
		) {
			errorMessage = "Took too long to get a response";
		} else if (error.code === "ERR_BAD_REQUEST" && error.status === 401) {
			if(routeType === "protected"){
				errorMessage = "Authorization error. Logging out.";
				// authorizationRedirect();
			}
			if(routeType === "unprotected"){
				errorMessage = "Authorization error.";
			}
		} else if (!error?.status || serverCodes?.includes(error?.status)) {
			errorMessage = "Something went wrong. This is most likely not your fault please try again";
		} else {
			errorMessage =
				error.response?.data?.message || // Standard error message from backend
				error.response?.data?.data?.message || // Standard error message from backend
				error.response?.data?.error || // Alternative key for error messages
				"Something went wrong. Please try again."; // Fallback message
		}
		toast.error(errorMessage);
	} else {
		toast.error("An unexpected error occurred.");
	}
}

axios_instance.interceptors.response.use(
	(response) => {
		return response;
	},
	(error) => {
		errorHandler(error, "protected");
	}
);

export default axios_instance;
