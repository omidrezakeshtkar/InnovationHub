import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export function SignInComponent() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(false);
    const [loginCount, setLoginCount] = useState(0);

    useEffect(() => {
        // Check if there are stored credentials
        const storedEmail = localStorage.getItem("rememberedEmail");
        const storedPassword = localStorage.getItem("rememberedPassword");
        const storedLoginCount = localStorage.getItem("loginCount");

        if (storedEmail && storedPassword) {
            setEmail(storedEmail);
            setPassword(storedPassword);
            setRememberMe(true);
        }

        if (storedLoginCount) {
            setLoginCount(parseInt(storedLoginCount, 10));
        }
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Here you would typically handle the sign-in logic

        if (rememberMe) {
            // Store credentials in local storage with expiration
            const expirationDate = new Date();
            expirationDate.setDate(expirationDate.getDate() + 30);
            localStorage.setItem("rememberedEmail", email);
            localStorage.setItem("rememberedPassword", password);
            localStorage.setItem("credentialsExpiration", expirationDate.toISOString());
        } else {
            // Clear stored credentials if "Remember me" is not checked
            localStorage.removeItem("rememberedEmail");
            localStorage.removeItem("rememberedPassword");
            localStorage.removeItem("credentialsExpiration");
        }

        // Increment and store login count
        const newLoginCount = loginCount + 1;
        setLoginCount(newLoginCount);
        localStorage.setItem("loginCount", newLoginCount.toString());

        console.log("Sign in attempt", { email, password, rememberMe });
    };

    const handleRememberMeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setRememberMe(e.target.checked);
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white py-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md mx-auto">
                <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Sign In to IdeaExchange</h2>
                <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg px-8 pt-6 pb-8 mb-4">
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
                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
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
                                onChange={handleRememberMeChange}
                            />
                            <span className="ml-2 text-sm text-gray-700">Remember me for 30 days</span>
                        </label>
                    </div>
                    <div className="flex items-center justify-between">
                        <button
                            className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                            type="submit"
                        >
                            Sign In
                        </button>
                        <Link to="/forgot-password" className="inline-block align-baseline font-bold text-sm text-purple-600 hover:text-purple-800">
                            Forgot Password?
                        </Link>
                    </div>
                </form>
                <p className="text-center text-gray-600 text-sm">
                    Don't have an account?{" "}
                    <Link to="/sign-up" className="text-purple-600 hover:text-purple-800 font-bold">
                        Sign Up
                    </Link>
                </p>
                {loginCount > 0 && (
                    <p className="text-center text-gray-500 text-xs mt-4">
                        You've logged in {loginCount} time{loginCount !== 1 ? 's' : ''}. 
                        Frequent logins increase your engagement score!
                    </p>
                )}
            </div>
        </div>
    );
}