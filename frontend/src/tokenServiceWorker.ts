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

export function startTokenRefreshService() {
	console.log("Token refresh service started");

	setInterval(async () => {
		const refreshToken = localStorage.getItem("refreshToken");
		const accessToken = localStorage.getItem("accessToken");

		if (!refreshToken || !accessToken) {
			console.log("No tokens found, skipping refresh");
			return;
		}

		if (isTokenExpired(accessToken)) {
			try {
				const config = {
					method: "post",
					maxBodyLength: Infinity,
					url: refreshTokenEndpoint,
					headers: {
						"Content-Type": "application/json",
					},
					data: JSON.stringify({ refreshToken }),
				};

				const response = await axios.request(config);
				const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
					response.data;

				localStorage.setItem("accessToken", newAccessToken);
				localStorage.setItem("refreshToken", newRefreshToken);
				console.log("Tokens refreshed successfully");
			} catch (error) {
				console.error("Error refreshing token:", error);
				// Consider implementing a redirect to login or error handling here
			}
		} else {
			console.log("Access token is still valid");
		}
	}, 10 * 60 * 1000); // 10 minutes
}

// Uncomment and implement this function if you want to redirect to login
// function redirectToLogin() {
// 	localStorage.removeItem("accessToken");
// 	localStorage.removeItem("refreshToken");
// 	window.location.href = "/sign-in";
// }
