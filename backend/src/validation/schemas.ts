import Joi from 'joi';

export const authSchemas = {
  register: Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    role: Joi.string().valid('user', 'moderator', 'admin', 'department_head').required(),
    department: Joi.string().required(),
  }),

  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
};

export const ideaSchemas = {
  create: Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    categoryId: Joi.string().required(),
    department: Joi.string().required(),
    tags: Joi.array().items(Joi.string()),
  }),

  update: Joi.object({
    title: Joi.string(),
    description: Joi.string(),
    categoryId: Joi.string(),
    department: Joi.string(),
    tags: Joi.array().items(Joi.string()),
  }),

  comment: Joi.object({
    content: Joi.string().required(),
  }),
};

export const userSchemas = {
  updateProfile: Joi.object({
    name: Joi.string(),
    email: Joi.string().email(),
  }),
};

export const categorySchemas = {
  create: Joi.object({
    name: Joi.string().required(),
    description: Joi.string(),
  }),

  update: Joi.object({
    name: Joi.string(),
    description: Joi.string(),
  }),
};

export const badgeSchemas = {
  create: Joi.object({
    name: Joi.string().required(),
    description: Joi.string().required(),
    criteria: Joi.string().required(),
  }),

  update: Joi.object({
    name: Joi.string(),
    description: Joi.string(),
    criteria: Joi.string(),
  }),
};

export const departmentSchemas = {
  create: Joi.object({
    name: Joi.string().required(),
    description: Joi.string().optional()
  }),
  update: Joi.object({
    name: Joi.string().optional(),
    description: Joi.string().optional()
  })
};