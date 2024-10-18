export interface TokenPayload {
	_id: string;
	email: string;
	role: "user" | "moderator" | "admin" | "department_head" | "owner";
	department: string;
	isAdmin: boolean;
	isOwner: boolean;
	isLoggedIn: boolean;
	iat: number;
	exp: number;
}
