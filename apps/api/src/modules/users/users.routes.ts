import type { FastifyPluginAsync } from 'fastify';
import { createUserRequestSchema } from '@percepcoes/shared';
import { z } from 'zod';
import type { UsersService } from './users.service';

const idParamsSchema = z.object({ id: z.uuid() });

export const usersRoutes =
  (users: UsersService): FastifyPluginAsync =>
  async (app) => {
    app.addHook('preHandler', app.requireAdmin);

    app.get('/', async () => ({ users: users.list() }));

    app.post('/', async (request, reply) => {
      const input = createUserRequestSchema.parse(request.body);
      const user = await users.create(input);
      request.log.info({ userId: user.id }, 'user created');
      return reply.code(201).send({ user });
    });

    app.delete('/:id', async (request, reply) => {
      const { id } = idParamsSchema.parse(request.params);
      users.remove(id, request.user.sub);
      request.log.info({ userId: id }, 'user removed');
      return reply.code(204).send();
    });
  };
