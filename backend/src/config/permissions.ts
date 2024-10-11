export const PERMISSIONS = {
	CREATE_IDEA: "create:idea",
	EDIT_IDEA: "edit:idea",
	DELETE_IDEA: "delete:idea",
	APPROVE_IDEA: "approve:idea",
	VIEW_ALL_IDEAS: "view:all_ideas",
	MANAGE_USERS: "manage:users",
	MANAGE_CATEGORIES: "manage:categories",
	MANAGE_BADGES: "manage:badges",
	VIEW_ANALYTICS: "view_analytics",
	MANAGE_DEPARTMENTS: "manage:departments",
	VIEW_DEPARTMENT: "view:department",
	DELETE_USER: "delete:user",
};

export const ROLE_PERMISSIONS = {
	user: [
		PERMISSIONS.CREATE_IDEA,
		PERMISSIONS.VIEW_DEPARTMENT,
		PERMISSIONS.DELETE_USER,
	], // Users can delete themselves
	moderator: [
		PERMISSIONS.CREATE_IDEA,
		PERMISSIONS.EDIT_IDEA,
		PERMISSIONS.VIEW_ALL_IDEAS,
		PERMISSIONS.VIEW_DEPARTMENT,
	],
	department_head: [
		PERMISSIONS.CREATE_IDEA,
		PERMISSIONS.EDIT_IDEA,
		PERMISSIONS.APPROVE_IDEA,
		PERMISSIONS.VIEW_ALL_IDEAS,
		PERMISSIONS.VIEW_ANALYTICS,
		PERMISSIONS.MANAGE_DEPARTMENTS,
		PERMISSIONS.VIEW_DEPARTMENT,
	],
	admin: Object.values(PERMISSIONS),
	owner: Object.values(PERMISSIONS),
};
