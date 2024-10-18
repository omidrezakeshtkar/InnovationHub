import axios from "axios";
import { jwtDecode } from "jwt-decode";

const refreshTokenEndpoint =
	"http://localhost:3000/api/user/auth/refresh-token";

interface TokenPayload {
	exp: number;
}

function isTokenExpired(token: string): boolean {
	const { exp } = jwtDecode<TokenPayload>(token);
	return Date.now() >= exp * 1000;
}

let isCheckingTokens = false;

export async function checkAndRefreshToken(
	showNotification: (
		message: string,
		type: "success" | "error" | "info"
	) => void
) {
	if (isCheckingTokens) return;
	isCheckingTokens = true;

	const refreshToken = localStorage.getItem("refreshToken");
	const accessToken = localStorage.getItem("accessToken");

	if (!refreshToken && !accessToken) {
		console.log("No tokens found.");
		isCheckingTokens = false;
		return;
	}

	if (accessToken && !isTokenExpired(accessToken)) {
		console.log("Access token is valid.");
		isCheckingTokens = false;
		return;
	}

	if (refreshToken && !isTokenExpired(refreshToken)) {
		console.log("Access token expired or not present, attempting to refresh.");
		try {
			const response = await axios.post(refreshTokenEndpoint, { refreshToken });
			const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
				response.data;

			localStorage.setItem("accessToken", newAccessToken);
			localStorage.setItem("refreshToken", newRefreshToken);
			console.log("Tokens refreshed successfully.");
			window.location.reload(); // Reload the page after refreshing tokens
		} catch (error) {
			console.error("Error refreshing token:", error);
			redirectToLogin(showNotification);
		}
	} else if (refreshToken && isTokenExpired(refreshToken)) {
		localStorage.removeItem("accessToken");
		localStorage.removeItem("refreshToken");
		redirectToLogin(showNotification);
	}

	isCheckingTokens = false;
}

function redirectToLogin(
	showNotification: (
		message: string,
		type: "success" | "error" | "info"
	) => void
) {
	localStorage.removeItem("accessToken");
	localStorage.removeItem("refreshToken");
	showNotification("Your session has expired. Please log in again.", "error");
	window.location.href = "/sign-in";
}

export const checkAuthorization = async (): Promise<boolean> => {
	try {
		const accessToken = localStorage.getItem("accessToken");
		if (!accessToken) {
			return false;
		}
		const response = await axios.get("http://localhost:3000/api/user/profile", {
			headers: { Authorization: `Bearer ${accessToken}` },
		});
		const user = response.data;
		if (user.role === "admin" || user.role === "owner") {
			return true;
		} else {
			return false;
		}
	} catch (error) {
		return false;
	}
};

export function decodeAccessToken(accessToken: string): TokenPayload | null {
	try {
		const base64Url = accessToken.split(".")[1];
		const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
		const jsonPayload = decodeURIComponent(
			atob(base64)
				.split("")
				.map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
				.join("")
		);

		return JSON.parse(jsonPayload) as TokenPayload;
	} catch (error) {
		console.error("Error decoding access token:", error);
		return null;
	}
}
