import { Wrench } from "lucide-react";
import branding from '../branding.json';

export function MaintenancePage() {
	const primaryColor = branding.primaryColor || 'var(--primary)';
	const secondaryColor = branding.secondaryColor || 'var(--secondary)';

	return (
		<div className="min-h-screen bg-gradient-to-b from-purple-50 to-white flex items-center justify-center px-4 sm:px-6 lg:px-8">
				<div className="max-w-md w-full space-y-8 text-center">
					<Wrench className="mx-auto h-12 w-12" style={{color: primaryColor}} />
					<h2 className="mt-6 text-3xl font-extrabold text-gray-900">
						We're under maintenance
					</h2>
					<p className="mt-2 text-sm text-gray-600">
						We're working on making IdeaExchange even better. We'll be back soon!
					</p>
					<div className="mt-5">
						<p className="text-sm text-gray-500">Expected downtime: 2 hours</p>
						<p className="text-sm text-gray-500">
							We apologize for any inconvenience.
						</p>
					</div>
				</div>
		</div>
	);
}
