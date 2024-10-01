import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export function SignUpComponent() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [passwordStrength, setPasswordStrength] = useState(0);
    const [passwordMessage, setPasswordMessage] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // اینجا می‌توانید منطق ثبت‌نام را پیاده‌سازی کنید
        console.log("Sign up attempt", { name, email, password, confirmPassword });
    };

    useEffect(() => {
        const checkPasswordStrength = (pass: string) => {
            let strength = 0;
            if (pass.length >= 8) strength += 1;
            if (pass.match(/[a-z]/) && pass.match(/[A-Z]/)) strength += 1;
            if (pass.match(/\d/)) strength += 1;
            if (pass.match(/[^a-zA-Z\d]/)) strength += 1;

            setPasswordStrength(strength);

            switch (strength) {
                case 0:
                    setPasswordMessage("Very weak");
                    break;
                case 1:
                    setPasswordMessage("Weak");
                    break;
                case 2:
                    setPasswordMessage("Fair");
                    break;
                case 3:
                    setPasswordMessage("Good");
                    break;
                case 4:
                    setPasswordMessage("Strong");
                    break;
                default:
                    setPasswordMessage("");
            }
        };

        checkPasswordStrength(password);
    }, [password]);

    return (
        <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white py-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md mx-auto">
                <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Sign Up for IdeaExchange</h2>
                <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg px-8 pt-6 pb-8 mb-4">
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
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
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
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
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                            Password
                        </label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="password"
                            type="password"
                            placeholder="******************"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <div className="mt-2">
                            <div className="flex justify-between mb-1">
                                <span className="text-sm text-gray-500">Password strength:</span>
                                <span className={`text-sm font-medium ${
                                    passwordStrength === 4 ? 'text-green-500' :
                                    passwordStrength >= 2 ? 'text-yellow-500' : 'text-red-500'
                                }`}>{passwordMessage}</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                                <div 
                                    className={`h-2.5 rounded-full ${
                                        passwordStrength === 4 ? 'bg-green-500' :
                                        passwordStrength === 3 ? 'bg-yellow-500' :
                                        passwordStrength === 2 ? 'bg-orange-500' : 'bg-red-500'
                                    }`}
                                    style={{width: `${passwordStrength * 25}%`}}
                                ></div>
                            </div>
                        </div>
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="confirm-password">
                            Confirm Password
                        </label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="confirm-password"
                            type="password"
                            placeholder="******************"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className="flex items-center justify-between">
                        <button
                            className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                            type="submit"
                        >
                            Sign Up
                        </button>
                    </div>
                </form>
                <p className="text-center text-gray-600 text-sm">
                    Already have an account?{" "}
                    <Link to="/sign-in" className="text-purple-600 hover:text-purple-800 font-bold">
                        Sign In
                    </Link>
                </p>
            </div>
        </div>
    );
}