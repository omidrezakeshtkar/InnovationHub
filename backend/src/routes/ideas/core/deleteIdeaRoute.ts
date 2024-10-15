import { Router } from 'express';
import { deleteIdea } from '../../../handlers/ideaHandlers';
import { auth } from '../../../middleware/auth';
import { authorize } from '../../../middleware/authorize';
import { PERMISSIONS } from '../../../config/permissions';
import { registry } from "../../../config/swagger";
import { z } from 'zod';
import { GlobalErrorSchema } from '../../../schemas';

const router = Router();

registry.registerPath({
  method: 'delete',
  path: '/ideas/{id}',
  summary: 'Delete an idea by its ID',
  tags: ['Ideas'],
  security: [{ bearerAuth: [] }],
  request: {
    params: z.object({
      id: z.string().describe('The ID of the idea to delete'),
    }),
  },
  responses: {
    200: {
      description: 'The idea with the specified ID has been deleted',
    },
    404: {
      description: 'The idea with the specified ID was not found',
      content: {
        "application/json": {
          schema: GlobalErrorSchema,
        },
      },
    },
  },
});

router.delete('/:id', auth, authorize(PERMISSIONS.DELETE_IDEA), deleteIdea);

export default router;