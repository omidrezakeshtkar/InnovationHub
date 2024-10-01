import { z } from 'zod';

const authSchemas = {
  register: z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
    role: z.enum(['user', 'moderator', 'admin', 'department_head']),
    department: z.string(),
  }),

  login: z.object({
    email: z.string().email(),
    password: z.string(),
  }),
};

const ideaSchemas = {
  create: z.object({
    title: z.string(),
    description: z.string(),
    categoryId: z.string(),
    department: z.string(),
    tags: z.array(z.string()).optional(),
  }),

  update: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    categoryId: z.string().optional(),
    department: z.string().optional(),
    tags: z.array(z.string()).optional(),
  }),

  comment: z.object({
    content: z.string(),
  }),

  getById: z.object({
    id: z.string(),
  }),

  delete: z.object({
    id: z.string(),
  }),

  approve: z.object({
    id: z.string(),
  }),

  vote: z.object({
    id: z.string(),
  }),

  getVersions: z.object({
    id: z.string(),
  }),
};

const userSchemas = {
  register: authSchemas.register,
  login: authSchemas.login,
  updateProfile: z.object({
    name: z.string().optional(),
    email: z.string().email().optional(),
  }),
  refreshToken: z.object({
    refreshToken: z.string(),
  }),
};

const categorySchemas = {
  create: z.object({
    name: z.string(),
    description: z.string().optional(),
  }),

  update: z.object({
    name: z.string().optional(),
    description: z.string().optional(),
  }),

  getById: z.object({
    id: z.string(),
  }),

  delete: z.object({
    id: z.string(),
  }),
};

const badgeSchemas = {
  create: z.object({
    name: z.string(),
    description: z.string(),
    criteria: z.string(),
  }),

  update: z.object({
    name: z.string().optional(),
    description: z.string().optional(),
    criteria: z.string().optional(),
  }),

  getById: z.object({
    id: z.string(),
  }),

  delete: z.object({
    id: z.string(),
  }),
};

const departmentSchemas = {
  create: z.object({
    name: z.string(),
    description: z.string().optional(),
  }),
  update: z.object({
    name: z.string().optional(),
    description: z.string().optional(),
  }),
  getById: z.object({
    id: z.string(),
  }),
  delete: z.object({
    id: z.string(),
  }),
};

const analyticsSchemas = {
  getAnalytics: z.object({}),
  getCategoryAnalytics: z.object({}),
  getIdeaTrendsAnalytics: z.object({}),
  getOverallAnalytics: z.object({}),
  getUserEngagementAnalytics: z.object({}),
};

export const schemas = {
  user: userSchemas,
  idea: ideaSchemas,
  badge: badgeSchemas,
  category: categorySchemas,
  department: departmentSchemas,
  analytics: analyticsSchemas,
};