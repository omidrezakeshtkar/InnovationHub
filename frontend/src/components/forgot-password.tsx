import { useState } from "react";
import { Link } from "react-router-dom";

export function ForgotPasswordComponent() {
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
                            className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                            type="submit"
                        >
                            Reset Password
                        </button>
                        <Link to="/sign-in" className="inline-block align-baseline font-bold text-sm text-purple-600 hover:text-purple-800">
                            Back to Sign In
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}