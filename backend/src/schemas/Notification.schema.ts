import { z } from "zod";

export const NotificationSchema = z.object({
	id: z.string(),
	recipient: z.string().min(3, "Recipient is required"), // Assuming this is the ObjectId as a string
	content: z.string().min(3, "Content is required"),
	type: z.enum(["idea_approved", "new_comment", "idea_status_change"]),
	relatedIdea: z.string().optional(), // Assuming this is the ObjectId as a string
	read: z.boolean(),
	createdAt: z.date(),
	updatedAt: z.date(),
});

export const NotificationCreateSchema = NotificationSchema.omit({
	id: true,
	read: true,
	createdAt: true,
	updatedAt: true,
});

export type Notification = z.infer<typeof NotificationSchema>;
export type NotificationCreate = z.infer<typeof NotificationCreateSchema>;
