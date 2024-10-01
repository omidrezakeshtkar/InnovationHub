import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Link } from "react-router-dom";

export function Header() {
	const [isMenuOpen, setIsMenuOpen] = useState(false);

	const toggleMenu = () => {
		setIsMenuOpen(!isMenuOpen);
	};

	return (
		<header className="bg-white shadow-sm w-full">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex justify-between items-center py-4">
					<div className="flex items-center">
						<img
							src="/placeholder.svg?height=40&width=40"
							alt="IdeaExchange Logo"
							className="h-10 w-10 mr-2"
						/>
						<span className="text-2xl font-bold text-purple-600">
							IdeaExchange
						</span>
					</div>
					<nav className="hidden md:flex space-x-8">
						<Link to="/" className="text-gray-600 hover:text-purple-600">
							Home
						</Link>
						<Link to="/ideas" className="text-gray-600 hover:text-purple-600">
							Ideas
						</Link>
						<Link
							to="/categories"
							className="text-gray-600 hover:text-purple-600"
						>
							Categories
						</Link>
						<Link to="/about" className="text-gray-600 hover:text-purple-600">
							About
						</Link>
					</nav>
					<div className="hidden md:block">
						<Link
							to="/sign-in"
							className="text-gray-600 hover:text-purple-600 mr-4"
						>
							Sign In
						</Link>
						<Link
							to="/sign-up"
							className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition duration-300"
						>
							Sign Up
						</Link>
					</div>
					<div className="md:hidden">
						<button
							onClick={toggleMenu}
							className="text-gray-600 hover:text-purple-600"
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
							<Link to="/" className="text-gray-600 hover:text-purple-600">
								Home
							</Link>
							<Link to="/ideas" className="text-gray-600 hover:text-purple-600">
								Ideas
							</Link>
							<Link
								to="/categories"
								className="text-gray-600 hover:text-purple-600"
							>
								Categories
							</Link>
							<Link to="/about" className="text-gray-600 hover:text-purple-600">
								About
							</Link>
							<button className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition duration-300 text-left">
								Sign In / Sign Up
							</button>
						</nav>
					</div>
				</div>
			)}
		</header>
	);
}
