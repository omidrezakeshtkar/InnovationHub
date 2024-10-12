import { useState, useEffect } from "react";
import { Menu, X, User, LogOut } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import branding from "../branding.json";
import axios from "axios";

export function Header() {
	const primaryColor = branding.primaryColor || "var(--primary)";
	const secondaryColor = branding.secondaryColor || "var(--secondary)";
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const navigate = useNavigate();
	const location = useLocation();

	useEffect(() => {
		const checkLoginStatus = () => {
			const accessToken = localStorage.getItem("accessToken");
			const refreshToken = localStorage.getItem("refreshToken");
			setIsLoggedIn(!!accessToken && !!refreshToken);
		};

		checkLoginStatus();
		// Add event listener for storage changes
		window.addEventListener("storage", checkLoginStatus);

		// Clean up the event listener
		return () => {
			window.removeEventListener("storage", checkLoginStatus);
		};
	}, []);

	useEffect(() => {
		// Check login status when location changes
		const accessToken = localStorage.getItem("accessToken");
		const refreshToken = localStorage.getItem("refreshToken");
		setIsLoggedIn(!!accessToken && !!refreshToken);
	}, [location]);

	const toggleMenu = () => {
		setIsMenuOpen(!isMenuOpen);
	};

	const handleLogout = async () => {
		try {
			const accessToken = localStorage.getItem("accessToken");
			await axios.post("http://localhost:3000/api/user/auth/logout", null, {
				headers: { Authorization: `Bearer ${accessToken}` },
			});
			localStorage.removeItem("accessToken");
			localStorage.removeItem("refreshToken");
			localStorage.removeItem("user");
			setIsLoggedIn(false);
			navigate("/");
		} catch (error) {
			console.error("Error logging out:", error);
			localStorage.removeItem("accessToken");
			localStorage.removeItem("refreshToken");
			localStorage.removeItem("user");
			setIsLoggedIn(false);
			navigate("/");
		}
	};

	return (
		<header className="bg-white shadow-sm w-full">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex justify-between items-center py-4">
					<div className="flex items-center">
						<img
							src={branding.logoUrl}
							alt={`${branding.projectName} Logo`}
							className="h-10 w-10 mr-2"
						/>
						<span
							className="text-2xl font-bold"
							style={{ color: primaryColor }}
						>
							{branding.projectName}
						</span>
					</div>
					<nav className="hidden md:flex space-x-8">
						<Link to="/" className="text-gray-600 hover:text-primary">
							Home
						</Link>
						<Link to="/ideas" className="text-gray-600 hover:text-primary">
							Ideas
						</Link>
						<Link to="/categories" className="text-gray-600 hover:text-primary">
							Categories
						</Link>
						<Link to="/about" className="text-gray-600 hover:text-primary">
							About
						</Link>
					</nav>
					<div className="hidden md:flex items-center space-x-4">
						{isLoggedIn ? (
							<>
								<Link
									to="/profile"
									className="text-gray-600 hover:text-primary"
								>
									<User size={24} />
								</Link>
								<button
									onClick={handleLogout}
									className="text-gray-600 hover:text-primary"
								>
									<LogOut size={24} />
								</button>
							</>
						) : (
							<>
								<Link
									to="/sign-in"
									className="text-gray-600 hover:text-primary"
								>
									Sign In
								</Link>
								<Link
									to="/sign-up"
									className="text-white px-4 py-2 rounded-md transition duration-300"
									style={{
										backgroundColor: primaryColor,
										":hover": { filter: "brightness(90%)" },
									}}
								>
									Sign Up
								</Link>
							</>
						)}
					</div>
					<div className="md:hidden">
						<button
							onClick={toggleMenu}
							className="text-gray-600 hover:text-primary"
						>
							{isMenuOpen ? <X size={24} /> : <Menu size={24} />}
						</button>
					</div>
				</div>
			</div>
			{isMenuOpen && (
				<div className="md:hidden bg-white py-2">
					<div className="max-w-7xl mx-auto px-4">
						<nav className="flex flex-col space-y-2">
							<Link to="/" className="text-gray-600 hover:text-primary">
								Home
							</Link>
							<Link to="/ideas" className="text-gray-600 hover:text-primary">
								Ideas
							</Link>
							<Link
								to="/categories"
								className="text-gray-600 hover:text-primary"
							>
								Categories
							</Link>
							<Link to="/about" className="text-gray-600 hover:text-primary">
								About
							</Link>
							{isLoggedIn ? (
								<>
									<Link
										to="/profile"
										className="text-gray-600 hover:text-primary"
									>
										Profile
									</Link>
									<button
										onClick={handleLogout}
										className="text-gray-600 hover:text-primary text-left"
									>
										Logout
									</button>
								</>
							) : (
								<>
									<Link
										to="/sign-in"
										className="text-gray-600 hover:text-primary"
									>
										Sign In
									</Link>
									<Link
										to="/sign-up"
										className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition duration-300 text-left"
									>
										Sign Up
									</Link>
								</>
							)}
						</nav>
					</div>
				</div>
			)}
		</header>
	);
}
