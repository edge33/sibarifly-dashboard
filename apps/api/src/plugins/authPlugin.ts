import type { FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';

declare module 'fastify' {
  interface FastifyInstance {
    verifyJWT: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
  }
}

const authPlugin: FastifyPluginAsync = fp(async (server) => {
  server.decorate('verifyJWT', async (request, reply) => {
    try {
      await request.authJwtVerify();
    } catch (_err) {
      // server.log.error(err);
      reply.status(401).send('Unauthorized');
    }
  });
});

export default authPlugin;
