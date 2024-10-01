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
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";

function App() {
	return (
		<div className="flex flex-col min-h-screen">
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
						<Route path="/sign-in" element={<SignInComponent />} />
						<Route path="/sign-up" element={<SignUpComponent />} />
						<Route path="/forgot-password" element={<ForgotPasswordComponent />} />
						<Route path="/profile" element={<UserProfileComponent />} />
						<Route path="/admin" element={<AdminDashboardComponent />} />
					</Routes>
				</div>
			</main>
			<Footer />
		</div>
	);
}

export default App;