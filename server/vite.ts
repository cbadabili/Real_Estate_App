import express, {
  type Express,
  type NextFunction,
  type Request,
  type Response,
} from "express";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { type Server } from "http";
import type { InlineConfig } from "vite";

const dirname = path.dirname(fileURLToPath(import.meta.url));

const generateId = () => Math.random().toString(36).substring(2, 15);

export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  console.log(`${formattedTime} [${source}] ${message}`);
}

export async function setupVite(app: Express, server: Server) {
  const isProduction = (process.env.NODE_ENV ?? "development") === "production";

  if (isProduction) {
    log("Skipping Vite middleware in production mode", "vite");
    return;
  }

  let createViteServer: typeof import("vite")['createServer'] | undefined;
  let createLogger: typeof import("vite")['createLogger'] | undefined;
  let loadConfigFromFile: typeof import("vite")['loadConfigFromFile'] | undefined;
  let viteConfig: InlineConfig | undefined;

  try {
    const viteModule = await import("vite");
    createViteServer = viteModule.createServer;
    createLogger = viteModule.createLogger;
    loadConfigFromFile = viteModule.loadConfigFromFile;
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error);
    throw new Error(
      `Vite development server requested but the 'vite' package is unavailable. Install dev dependencies before running in development.\n${reason}`,
    );
  }

  try {
    const configEnv = {
      command: "serve" as const,
      mode: process.env.NODE_ENV ?? "development",
    };

    if (!loadConfigFromFile) {
      throw new Error("Vite loadConfigFromFile helper is unavailable");
    }

    const loader = loadConfigFromFile!;
    const projectRoot = path.resolve(dirname, "..");
    const configCandidates = [
      undefined,
      path.resolve(projectRoot, "vite.config.ts"),
      path.resolve(projectRoot, "vite.config.js"),
    ];

    let loaded: Awaited<ReturnType<typeof loadConfigFromFile>> | undefined;
    let lastError: unknown;
    for (const candidate of configCandidates) {
      try {
        loaded = await loader(configEnv, candidate, projectRoot);
        if (loaded) {
          break;
        }
      } catch (error) {
        lastError = error;
      }
    }

    if (!loaded) {
      throw lastError instanceof Error ? lastError : new Error(String(lastError ?? 'Unable to load Vite configuration'));
    }

    const rawConfig = loaded.config ?? {};
    viteConfig =
      typeof rawConfig === "function"
        ? await rawConfig(configEnv)
        : (rawConfig as InlineConfig);
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error);
    throw new Error(
      `Failed to load Vite configuration. Ensure vite.config.(ts|js) is present and its dependencies are installed.\n${reason}`,
    );
  }

  if (!createViteServer || !createLogger || !viteConfig) {
    throw new Error("Vite tooling was not fully initialised. Aborting development server start.");
  }

  const viteLogger = createLogger();
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true,
  };

  const vite = await createViteServer({
    ...viteConfig,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (...args: Parameters<typeof viteLogger.error>) => {
        viteLogger.error(...args);
      },
    },
    server: serverOptions,
    appType: "custom",
  });

  app.use(vite.middlewares);
  app.use("*", async (req: Request, res: Response, next: NextFunction) => {
    const url = req.originalUrl;

    try {
      const clientTemplate = path.resolve(dirname, "..", "client", "index.html");

      // always reload the index.html file from disk in case it changes
      let template = await fs.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${generateId()}"`,
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      if (e instanceof Error) {
        vite.ssrFixStacktrace(e);
        next(e);
      }
    }
  });
}

export async function serveStatic(app: Express) {
  const distPath = path.resolve(dirname, "..", "dist", "public");

  app.use(express.static(distPath));

  const indexPath = path.resolve(distPath, "index.html");

  try {
    await fs.access(indexPath);
    app.use("*", (_req: Request, res: Response) => {
      res.sendFile(indexPath);
    });
  } catch {
    log("Static build not found; skipping SPA fallback", "static");
  }
}
