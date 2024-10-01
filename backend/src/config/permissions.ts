export const PERMISSIONS = {
  CREATE_IDEA: 'create:idea',
  EDIT_IDEA: 'edit:idea',
  DELETE_IDEA: 'delete:idea',
  APPROVE_IDEA: 'approve:idea',
  VIEW_ALL_IDEAS: 'view:all_ideas',
  MANAGE_USERS: 'manage:users',
  MANAGE_CATEGORIES: 'manage:categories',
  MANAGE_BADGES: 'manage:badges',
  VIEW_ANALYTICS: 'view_analytics',
  MANAGE_DEPARTMENTS: 'manage:departments', // Added permission for managing departments
  VIEW_DEPARTMENT: 'view:department', // Added permission for viewing departments
};

export const ROLE_PERMISSIONS = {
  user: [PERMISSIONS.CREATE_IDEA, PERMISSIONS.VIEW_DEPARTMENT], // Added VIEW_DEPARTMENT to user
  moderator: [PERMISSIONS.CREATE_IDEA, PERMISSIONS.EDIT_IDEA, PERMISSIONS.VIEW_ALL_IDEAS, PERMISSIONS.VIEW_DEPARTMENT], // Added VIEW_DEPARTMENT to moderator
  department_head: [PERMISSIONS.CREATE_IDEA, PERMISSIONS.EDIT_IDEA, PERMISSIONS.APPROVE_IDEA, PERMISSIONS.VIEW_ALL_IDEAS, PERMISSIONS.VIEW_ANALYTICS, PERMISSIONS.MANAGE_DEPARTMENTS, PERMISSIONS.VIEW_DEPARTMENT], // Added VIEW_DEPARTMENT to department_head
  admin: Object.values(PERMISSIONS),
};