import axios from "axios";

const API_URL = "http://localhost:3000/api-docs.json";

export const fetchApiDocs = async () => {
	try {
		const response = await axios.get(API_URL);
		return response.data; // Assuming the response is in JSON format
	} catch (error) {
		console.error("Error fetching API documentation:", error);
		throw error;
	}
};
