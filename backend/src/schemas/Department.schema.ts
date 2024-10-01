import { z } from 'zod';

export const DepartmentSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
});

export const DepartmentCreateSchema = DepartmentSchema.omit({ id: true });

export type Department = z.infer<typeof DepartmentSchema>;
export type DepartmentCreate = z.infer<typeof DepartmentCreateSchema>;