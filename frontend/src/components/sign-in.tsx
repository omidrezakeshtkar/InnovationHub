import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import branding from "../branding.json";

export function SignInComponent({
	showNotification,
}: {
	showNotification: (
		message: string,
		type: "success" | "error" | "info"
	) => void;
}) {
	const primaryColor = branding.primaryColor || "var(--primary)";
	const secondaryColor = branding.secondaryColor || "var(--secondary)";
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [rememberMe, setRememberMe] = useState(false);
	const navigate = useNavigate();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		try {
			const response = await axios.post(
				"http://localhost:3000/api/user/auth/login",
				{
					email,
					password,
					rememberMe,
				}
			);

			localStorage.setItem("accessToken", response.data.accessToken);
			localStorage.setItem("refreshToken", response.data.refreshToken);

			if (rememberMe) {
				localStorage.setItem("rememberMe", "true");
			} else {
				localStorage.removeItem("rememberMe");
			}

			// Navigate to profile page
			navigate("/profile");
		} catch (err) {
			if (axios.isAxiosError(err) && err.response) {
				showNotification(
					err.response.data.message || "An error occurred during sign in",
					"error"
				);
			} else {
				showNotification("An unexpected error occurred", "error");
			}
		}
	};

	return (
		<div className="min-h-screen bg-gradient-to-b from-purple-50 to-white py-16 px-4 sm:px-6 lg:px-8">
			<div className="max-w-md mx-auto">
				<h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
					Sign In to IdeaExchange
				</h2>
				<form
					onSubmit={handleSubmit}
					className="bg-white shadow-md rounded-lg px-8 pt-6 pb-8 mb-4"
				>
					<div className="mb-4">
						<label
							className="block text-gray-700 text-sm font-bold mb-2"
							htmlFor="email"
						>
							Email
						</label>
						<input
							className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
							id="email"
							type="email"
							placeholder="Email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							required
						/>
					</div>
					<div className="mb-6">
						<label
							className="block text-gray-700 text-sm font-bold mb-2"
							htmlFor="password"
						>
							Password
						</label>
						<input
							className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
							id="password"
							type="password"
							placeholder="******************"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							required
						/>
					</div>
					<div className="mb-6">
						<label className="flex items-center">
							<input
								type="checkbox"
								className="form-checkbox"
								checked={rememberMe}
								onChange={(e) => setRememberMe(e.target.checked)}
							/>
							<span className="ml-2 text-sm text-gray-700">Remember me</span>
						</label>
					</div>
					<div className="flex items-center justify-between">
						<button
							className="text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline hover:brightness-90"
							style={{ backgroundColor: primaryColor }}
							type="submit"
						>
							Sign In
						</button>
						<Link
							to="/forgot-password"
							className="inline-block align-baseline font-bold text-sm hover:text-opacity-80"
							style={{ color: primaryColor }}
						>
							Forgot Password?
						</Link>
					</div>
				</form>
				<p className="text-center text-gray-600 text-sm">
					Don't have an account?{" "}
					<Link
						to="/sign-up"
						className="font-bold hover:text-opacity-80"
						style={{ color: primaryColor }}
					>
						Sign Up
					</Link>
				</p>
			</div>
		</div>
	);
}
