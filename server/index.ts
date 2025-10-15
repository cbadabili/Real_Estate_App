import { createApp } from "./app";

async function boot() {
  const nodeEnv = process.env.NODE_ENV ?? "development";
  const isE2E = process.env.E2E === "true";

  if (!process.env.NODE_ENV) {
    process.env.NODE_ENV = nodeEnv;
  }

  const bootRunMigrations = (process.env.BOOT_RUN_MIGRATIONS ?? "").toLowerCase() !== "false";
  const shouldForceMigrations = process.env.FORCE_DB_MIGRATIONS === "true";
  const shouldRunMigrations = bootRunMigrations && (!isE2E || shouldForceMigrations);

  let skipMigrationsMessage: string | undefined;
  if (!shouldRunMigrations) {
    if (!bootRunMigrations) {
      skipMigrationsMessage = "⏭️  Skipping migrations because BOOT_RUN_MIGRATIONS=false";
    } else if (isE2E && !shouldForceMigrations) {
      skipMigrationsMessage = "⏭️  Skipping migrations in E2E mode";
    }
  }

  const shouldSeedDatabase =
    !isE2E && (nodeEnv === "development" || process.env.FORCE_DB_SEED === "true");

  const enableViteDevServer = !isE2E && nodeEnv !== "production";
  const serveStaticAssets = nodeEnv === "production";

  const appOptions: Parameters<typeof createApp>[0] = {
    nodeEnv,
    isE2E,
    runMigrations: shouldRunMigrations,
    seedDatabase: shouldSeedDatabase,
    enableViteDevServer,
    serveStaticAssets,
    markReadyOnReturn: false,
  };

  if (skipMigrationsMessage) {
    appOptions.skipMigrationsMessage = skipMigrationsMessage;
  }

  const app = await createApp(appOptions);

  const PORT = Number(process.env.PORT ?? 5000);
  const HOST = process.env.HOST ?? "0.0.0.0";

  await new Promise<void>((resolve) => {
    app.listen(PORT, HOST, () => {
      app.locals.isReady = true;
      console.log(`🚀 API listening on http://${HOST}:${PORT}`);
      resolve();
    });
  });
}

boot().catch((error) => {
  console.error("Failed to start server", error);
  process.exit(1);
});
