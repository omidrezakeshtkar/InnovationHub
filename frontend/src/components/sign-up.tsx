import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios, { AxiosError } from "axios";
import { Eye, EyeOff } from "lucide-react";
import branding from "../branding.json";

export function SignUpComponent({
	showNotification,
}: {
	showNotification: (
		message: string,
		type: "success" | "error" | "info"
	) => void;
}) {
	const primaryColor = branding.primaryColor || "var(--primary)";
	const secondaryColor = branding.secondaryColor || "var(--secondary)";
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [role, setRole] = useState("user");
	const [department, setDepartment] = useState(
		"This section will be filled by the department head"
	);
	const [passwordStrength, setPasswordStrength] = useState(0);
	const [showPassword, setShowPassword] = useState(false);
	const navigate = useNavigate();

	useEffect(() => {
		// Check password strength
		const strength = calculatePasswordStrength(password);
		setPasswordStrength(strength);
	}, [password]);

	const calculatePasswordStrength = (password: string): number => {
		let strength = 0;
		if (password.length > 6) strength++;
		if (password.match(/[a-z]/) && password.match(/[A-Z]/)) strength++;
		if (password.match(/\d/)) strength++;
		if (password.match(/[^a-zA-Z\d]/)) strength++;
		return strength;
	};

	const getPasswordStrengthColor = () => {
		if (passwordStrength <= 1) return "bg-red-500";
		if (passwordStrength === 2) return "bg-yellow-500";
		if (passwordStrength === 3) return "bg-blue-500";
		return "bg-green-500";
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (password !== confirmPassword) {
			showNotification("Passwords do not match", "error");
			return;
		}

		try {
			const response = await axios.post(
				"http://localhost:3000/api/user/auth/register",
				{
					name,
					email,
					password,
					role,
					department,
				}
			);

			localStorage.setItem("accessToken", response.data.accessToken);
			localStorage.setItem("refreshToken", response.data.refreshToken);
			localStorage.setItem("user", JSON.stringify(response.data.user));
			navigate("/profile");
		} catch (err) {
			const errorMessage =
				(err as AxiosError).response?.data ||
				(err as AxiosError).message ||
				"Error creating account. Please try again.";
			showNotification(JSON.stringify(errorMessage, null, 2), "error");
		}
	};

	return (
		<div className="min-h-screen bg-gradient-to-b from-purple-50 to-white py-16 px-4 sm:px-6 lg:px-8">
			<div className="max-w-md mx-auto">
				<h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
					Sign Up for InnovationHub
				</h2>
				<form
					onSubmit={handleSubmit}
					className="bg-white shadow-md rounded-lg px-8 pt-6 pb-8 mb-4"
				>
					<div className="mb-4">
						<label
							className="block text-gray-700 text-sm font-bold mb-2"
							htmlFor="name"
						>
							Name
						</label>
						<input
							className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
							id="name"
							type="text"
							placeholder="Full Name"
							value={name}
							onChange={(e) => setName(e.target.value)}
							required
						/>
					</div>
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
					<div className="mb-4">
						<label
							className="block text-gray-700 text-sm font-bold mb-2"
							htmlFor="password"
						>
							Password
						</label>
						<div className="relative">
							<input
								className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
								id="password"
								type={showPassword ? "text" : "password"}
								placeholder="******************"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								required
							/>
							<button
								type="button"
								className="absolute inset-y-0 right-0 pr-3 flex items-center"
								onClick={() => setShowPassword(!showPassword)}
							>
								{showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
							</button>
						</div>
						<div className="mt-2 h-2 w-full bg-gray-200 rounded-full">
							<div
								className={`h-full rounded-full ${getPasswordStrengthColor()}`}
								style={{ width: `${(passwordStrength / 4) * 100}%` }}
							></div>
						</div>
						<p className="text-sm text-gray-600 mt-1">
							{passwordStrength <= 1 && "Weak"}
							{passwordStrength === 2 && "Fair"}
							{passwordStrength === 3 && "Good"}
							{passwordStrength === 4 && "Strong"}
						</p>
					</div>
					<div className="mb-4">
						<label
							className="block text-gray-700 text-sm font-bold mb-2"
							htmlFor="confirmPassword"
						>
							Confirm Password
						</label>
						<input
							className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
							id="confirmPassword"
							type="password"
							placeholder="******************"
							value={confirmPassword}
							onChange={(e) => setConfirmPassword(e.target.value)}
							required
						/>
					</div>
					<div className="mb-4">
						<label
							className="block text-gray-700 text-sm font-bold mb-2"
							htmlFor="role"
						>
							Role
						</label>
						<select
							className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
							id="role"
							value={role}
							onChange={(e) => setRole(e.target.value)}
							disabled={true}
						>
							<option value="user">User</option>
						</select>
					</div>
					<div className="mb-6">
						<label
							className="block text-gray-700 text-sm font-bold mb-2"
							htmlFor="department"
						>
							Department
						</label>
						<input
							className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
							id="department"
							type="text"
							placeholder="This section will be filled by the department head"
							value={"This section will be filled by the department head"}
							disabled={true}
						/>
					</div>
					<div className="flex items-center justify-between">
						<button
							className="text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
							style={{
								backgroundColor: primaryColor,
								":hover": { filter: "brightness(90%)" },
							}}
							type="submit"
						>
							Sign Up
						</button>
					</div>
				</form>
				<p className="text-center text-gray-600 text-sm">
					Already have an account?{" "}
					<Link
						to="/sign-in"
						className="font-bold"
						style={{ color: primaryColor, ":hover": { color: secondaryColor } }}
					>
						Sign In
					</Link>
				</p>
			</div>
		</div>
	);
}
