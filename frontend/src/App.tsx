import { Routes, Route } from "react-router-dom";
import { LandingPageComponent } from "./components/landing-page";
import { IdeasPageComponent } from "./components/ideas-page";
import { CategoriesPageComponent } from "./components/categories-page";
import { SignInComponent } from "./components/sign-in";
import { SignUpComponent } from "./components/sign-up";
import { ForgotPasswordComponent } from "./components/forgot-password";
import { IdeaDetailComponent } from "./components/idea-detail";
import { AboutPageComponent } from "./components/about-page";
import { ContactPageComponent } from "./components/contact-page";
import { PrivacyPolicyComponent } from "./components/privacy-policy-page";
import { TermsOfServiceComponent } from "./components/terms-of-service-page";
import { UserProfileComponent } from "./components/user-profile";
import { AdminDashboardComponent } from "./components/admin-dashboard";
import { Error401Page } from "./components/Error401Page";
import { Error403Page } from "./components/Error403Page";
import { Error404Page } from "./components/Error404Page";
import { Error500Page } from "./components/Error500Page";
import { Error503Page } from "./components/Error503Page";
import { MaintenancePage } from "./components/MaintenancePage";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { useEffect, useState } from "react";
import { startTokenRefreshService } from "./tokenServiceWorker";
import { NotificationBar } from "./components/NotificationBar";

// Set this to true when you want to show the maintenance page
const isUnderMaintenance = false;

function App() {
	const [notifications, setNotifications] = useState<
		{ id: number; message: string; type: "success" | "error" | "info" }[]
	>([]);

	const showNotification = (
		message: string,
		type: "success" | "error" | "info"
	) => {
		const id = Date.now();
		setNotifications((prev) => [
			...prev.slice(-2), // Keep only the last two notifications
			{ id, message, type },
		]);
		setTimeout(() => removeNotification(id), 5000); // Auto-hide after 5 seconds
	};

	const removeNotification = (id: number) => {
		setNotifications((prev) => prev.filter((n) => n.id !== id));
	};

	useEffect(() => {
		startTokenRefreshService();
	}, []);

	if (isUnderMaintenance) {
		return <MaintenancePage />;
	}

	return (
		<div className="flex flex-col min-h-screen">
			<NotificationBar
				notifications={notifications}
				onClose={removeNotification}
			/>
			<Header />
			<main className="flex-grow w-full">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<Routes>
						<Route path="/" element={<LandingPageComponent />} />
						<Route path="/ideas" element={<IdeasPageComponent />} />
						<Route path="/ideas/:id" element={<IdeaDetailComponent />} />
						<Route path="/categories" element={<CategoriesPageComponent />} />
						<Route path="/about" element={<AboutPageComponent />} />
						<Route path="/contact" element={<ContactPageComponent />} />
						<Route path="/privacy" element={<PrivacyPolicyComponent />} />
						<Route path="/terms" element={<TermsOfServiceComponent />} />
						<Route
							path="/sign-in"
							element={<SignInComponent showNotification={showNotification} />}
						/>
						<Route
							path="/sign-up"
							element={<SignUpComponent showNotification={showNotification} />}
						/>
						<Route
							path="/forgot-password"
							element={<ForgotPasswordComponent />}
						/>
						<Route path="/profile" element={<UserProfileComponent />} />
						<Route path="/admin" element={<AdminDashboardComponent />} />
						<Route path="/401" element={<Error401Page />} />
						<Route path="/403" element={<Error403Page />} />
						<Route path="/500" element={<Error500Page />} />
						<Route path="/503" element={<Error503Page />} />
						<Route path="*" element={<Error404Page />} />
					</Routes>
				</div>
			</main>
			<Footer />
		</div>
	);
}

export default App;

/*
How to use the maintenance page:

1. Import the MaintenancePage component at the top of this file:
   import { MaintenancePage } from "./components/MaintenancePage";

2. Set the 'isUnderMaintenance' variable to true when you want to show the maintenance page:
   const isUnderMaintenance = true;

3. The App component will now check this variable and render the MaintenancePage
   instead of the normal application if it's set to true.

4. To return to normal operation, simply set 'isUnderMaintenance' back to false.

Note: This approach will show the maintenance page for all routes. If you need more
granular control, you can add the maintenance check to specific routes instead.
*/
