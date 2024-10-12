import { ChevronRight, Star, Users, Lightbulb, ArrowUp } from "lucide-react";
import { Link } from "react-router-dom";
import branding from '../branding.json';

export function LandingPageComponent() {
	const primaryColor = branding.primaryColor || 'var(--primary)';
	const secondaryColor = branding.secondaryColor || 'var(--secondary)';

	return (
		<div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
			<main>
				{/* Hero Section */}
				<section className="py-20 text-center">
					<h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-4">
						Share, Collaborate, Innovate
					</h1>
					<p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
						Join our community of innovators and bring your ideas to life.
						IdeaExchange is the platform where great minds connect and create
						the future.
					</p>
					<button className="btn text-white px-8 py-3 text-lg font-semibold transition duration-300" style={{backgroundColor: primaryColor, ':hover': {filter: 'brightness(90%)'}}}>
						Get Started
					</button>
				</section>

				{/* Trending Ideas Section */}
				<section className="py-16 bg-white">
					<h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
						Trending Ideas
					</h2>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
						{[
							{
								title: "AI-Powered Personal Assistant",
								description:
									"An AI assistant that learns and adapts to your personal needs.",
								upvotes: 1280,
							},
							{
								title: "Sustainable Urban Farming",
								description:
									"Vertical farming solution for urban areas to promote local food production.",
								upvotes: 958,
							},
							{
								title: "Decentralized Education Platform",
								description:
									"Blockchain-based platform for global, accessible education.",
								upvotes: 742,
							},
						].map((idea, index) => (
							<div
								key={index}
								className="card bg-gray-50 p-6 shadow-md hover:shadow-lg transition duration-300"
								>
								<h3 className="text-xl font-semibold text-gray-800 mb-2">
									{idea.title}
								</h3>
								<p className="text-gray-600 mb-4">{idea.description}</p>
								<div className="flex items-center" style={{color: primaryColor}}>
									<ArrowUp size={20} />
									<span className="ml-1 font-semibold">{idea.upvotes}</span>
								</div>
							</div>
						))}
					</div>
				</section>

				{/* Categories Section */}
				<section className="py-16 bg-purple-50">
					<h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
						Popular Categories
					</h2>
					<div className="flex flex-wrap justify-center gap-4">
						{[
							"Technology",
							"Business",
							"Environment",
							"Health",
							"Education",
							"Social Impact",
						].map((category, index) => (
							<button
								key={index}
								className="btn bg-white px-6 py-3 shadow-md hover:shadow-lg transition duration-300"
								style={{color: primaryColor, ':hover': {color: secondaryColor}}}
							>
								{category}
							</button>
						))}
					</div>
				</section>

				{/* Statistics Section */}
				<section className="py-16 bg-white">
					<div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
						{[
							{
								icon: Lightbulb,
								label: "Total Ideas Shared",
								value: "50,000+",
							},
							{ icon: Users, label: "Active Users", value: "100,000+" },
							{ icon: Star, label: "Ideas Implemented", value: "5,000+" },
						].map((stat, index) => (
							<div key={index} className="flex flex-col items-center">
								<stat.icon size={48} style={{color: primaryColor}} className="mb-4" />
								<span className="text-4xl font-bold text-gray-800 mb-2">
									{stat.value}
								</span>
								<span className="text-xl text-gray-600">{stat.label}</span>
							</div>
						))}
					</div>
				</section>

				{/* Testimonials Section */}
				<section className="py-16 bg-purple-50">
					<h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
						What Our Users Say
					</h2>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
						{[
							{
								quote:
									"IdeaExchange has been instrumental in bringing my startup idea to life. The community feedback was invaluable!",
								author: "Sarah K., Entrepreneur",
							},
							{
								quote:
									"As an investor, I've found some of the most innovative projects on this platform. It's a goldmine of creativity!",
								author: "Michael R., Angel Investor",
							},
						].map((testimonial, index) => (
							<div key={index} className="card bg-white p-6 shadow-md">
								<p className="text-gray-600 italic mb-4">
									"{testimonial.quote}"
								</p>
								<p className="text-gray-800 font-semibold">
									- {testimonial.author}
								</p>
							</div>
						))}
					</div>
				</section>
			</main>
		</div>
	);
}