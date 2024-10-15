import React from "react";
import {
	Home,
	Lightbulb,
	GitPullRequest,
	MessageSquare,
	Bell,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import branding from "../../branding.json";

const LeftSidebar = () => {
	const primaryColor = branding.primaryColor || "var(--primary)";
	const navigate = useNavigate();
	const location = useLocation();

	const isActive = (path: string) => location.pathname === path;

	return (
		<div className="w-full md:w-64 mb-8 md:mb-0 md:mr-8">
			<nav className="bg-white shadow-md rounded-lg p-4">
				<ul className="space-y-2">
					<li>
						<button
							className={`flex items-center space-x-2 w-full text-left ${
								isActive("/admin")
									? "text-primary"
									: "text-gray-700 hover:text-primary"
							}`}
							style={{ color: isActive("/admin") ? primaryColor : undefined }}
							onClick={() => navigate("/admin")}
						>
							<Home size={20} />
							<span>Home</span>
						</button>
					</li>
					<li>
						<button
							className={`flex items-center space-x-2 w-full text-left ${
								isActive("/admin/ideas")
									? "text-primary"
									: "text-gray-700 hover:text-primary"
							}`}
							style={{
								color: isActive("/admin/ideas") ? primaryColor : undefined,
							}}
							onClick={() => navigate("/admin/ideas")}
						>
							<Lightbulb size={20} />
							<span>Ideas</span>
						</button>
					</li>
					<li>
						<button
							className={`flex items-center space-x-2 w-full text-left ${
								isActive("/admin/roadmap")
									? "text-primary"
									: "text-gray-700 hover:text-primary"
							}`}
							style={{
								color: isActive("/admin/roadmap") ? primaryColor : undefined,
							}}
							onClick={() => navigate("/admin/roadmap")}
						>
							<GitPullRequest size={20} />
							<span>Roadmap</span>
						</button>
					</li>
					<li>
						<button
							className={`flex items-center space-x-2 w-full text-left ${
								isActive("/admin/feedback")
									? "text-primary"
									: "text-gray-700 hover:text-primary"
							}`}
							style={{
								color: isActive("/admin/feedback") ? primaryColor : undefined,
							}}
							onClick={() => navigate("/admin/feedback")}
						>
							<MessageSquare size={20} />
							<span>Feedback</span>
						</button>
					</li>
					<li>
						<button
							className={`flex items-center space-x-2 w-full text-left ${
								isActive("/admin/announcements")
									? "text-primary"
									: "text-gray-700 hover:text-primary"
							}`}
							style={{
								color: isActive("/admin/announcements")
									? primaryColor
									: undefined,
							}}
							onClick={() => navigate("/admin/announcements")}
						>
							<Bell size={20} />
							<span>Announcements</span>
						</button>
					</li>
				</ul>
			</nav>
		</div>
	);
};

export default LeftSidebar;
