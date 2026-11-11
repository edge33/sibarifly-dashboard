import buildApp from './server.ts';

const app = await buildApp();

app.listen({ port: Number(process.env.PORT) || 8000, host: '0.0.0.0' }, (err) => {
  if (err) {
    app.log.error(err);
    process.exit(1);
  }
});
