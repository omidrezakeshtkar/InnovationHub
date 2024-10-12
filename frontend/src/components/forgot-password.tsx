import { useState } from "react";
import { Link } from "react-router-dom";
import branding from '../branding.json';

export function ForgotPasswordComponent() {
	const primaryColor = branding.primaryColor || 'var(--primary)';
	const secondaryColor = branding.secondaryColor || 'var(--secondary)';
	const [email, setEmail] = useState("");

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		// اینجا می‌توانید منطق بازیابی رمز عبور را پیاده‌سازی کنید
		console.log("Password reset attempt for email:", email);
	};

	return (
		<div className="min-h-screen bg-gradient-to-b from-purple-50 to-white py-16 px-4 sm:px-6 lg:px-8">
			<div className="max-w-md mx-auto">
				<h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Forgot Password</h2>
				<form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg px-8 pt-6 pb-8 mb-4">
					<div className="mb-4">
						<label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
							Email
						</label>
						<input
							className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
							id="email"
							type="email"
							placeholder="Enter your email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							required
						/>
					</div>
					<div className="flex items-center justify-between">
						<button
							className="text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
							style={{backgroundColor: primaryColor, ':hover': {filter: 'brightness(90%)'}}}
							type="submit"
						>
							Reset Password
						</button>
						<Link to="/sign-in" className="inline-block align-baseline font-bold text-sm" style={{color: primaryColor, ':hover': {color: secondaryColor}}}>
							Back to Sign In
						</Link>
					</div>
				</form>
			</div>
		</div>
	);
}