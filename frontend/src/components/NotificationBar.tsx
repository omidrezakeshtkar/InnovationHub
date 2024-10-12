import React, { useEffect } from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Notification {
	id: number;
	message: string;
	type: "success" | "error" | "info";
}

interface NotificationBarProps {
	notifications: Notification[];
	onClose: (id: number) => void;
}

export function NotificationBar({
	notifications,
	onClose,
}: NotificationBarProps) {
	const getColor = (type: string) => {
		switch (type) {
			case "success":
				return "bg-green-500";
			case "error":
				return "bg-red-500";
			case "info":
				return "bg-blue-500";
			default:
				return "bg-gray-500";
		}
	};

	return (
		<div className="fixed bottom-4 left-4 space-y-2">
			<AnimatePresence>
				{notifications.map((notification) => (
					<motion.div
						key={notification.id}
						initial={{ x: "-100%", opacity: 0 }}
						animate={{ x: 0, opacity: 1 }}
						exit={{ x: "-100%", opacity: 0 }}
						transition={{ duration: 0.5 }}
						className={`p-4 ${getColor(
							notification.type
						)} text-white shadow-md flex justify-between items-center rounded-md`}
					>
						<span>{notification.message}</span>
						<button
							onClick={() => onClose(notification.id)}
							className="ml-4 text-white hover:text-gray-200"
						>
							<X size={20} />
						</button>
					</motion.div>
				))}
			</AnimatePresence>
		</div>
	);
}
