import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';
import type { FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';
import packageJson from '../../package.json' with { type: 'json' };

const fastifySwaggerPlugin: FastifyPluginAsync = fp(async (server) => {
  server.register(fastifySwagger, {
    openapi: {
      info: {
        title: 'SibariFly dashboard API',
        description: 'API for SibariFly dashboard',
        version: packageJson.version
      },
      tags: [
        {
          name: 'Events'
        }
      ]
    }
  });

  server.register(fastifySwaggerUi, {
    routePrefix: '/docs'
    // logo: {
    //   type: 'image/png',
    //   content: Buffer.from(
    //     fs.readFileSync(join(__dirname, '..', 'logo.png')).toString('base64'),
    //     'base64'
    //   )
    // }
  });
});

export default fastifySwaggerPlugin;
