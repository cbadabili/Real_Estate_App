import express from "express";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const dirname = path.dirname(fileURLToPath(import.meta.url));
const generateId = () => Math.random().toString(36).substring(2, 15);
export function log(message, source = "express") {
    const formattedTime = new Date().toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
    });
    console.log(`${formattedTime} [${source}] ${message}`);
}
export async function setupVite(app, server) {
    const isProduction = (process.env.NODE_ENV ?? "development") === "production";
    if (isProduction) {
        log("Skipping Vite middleware in production mode", "vite");
        return;
    }
    let viteModule;
    try {
        viteModule = await import("vite");
    }
    catch (error) {
        const reason = error instanceof Error ? error.message : String(error);
        throw new Error(`Vite development server requested but the 'vite' package is unavailable. Install dev dependencies before running in development.\n${reason}`);
    }
    const { createServer: createViteServer, createLogger, loadConfigFromFile } = viteModule;
    const viteLogger = createLogger();
    let viteConfig;
    try {
        if (!loadConfigFromFile) {
            throw new Error("Vite loadConfigFromFile helper is unavailable");
        }
        const configEnv = { command: "serve", mode: process.env.NODE_ENV ?? "development" };
        const loaded = (await loadConfigFromFile(configEnv).catch(async () => loadConfigFromFile(configEnv, path.resolve(dirname, "..", "vite.config.js")))) ?? undefined;
        const rawConfig = (loaded === null || loaded === void 0 ? void 0 : loaded.config) ?? {};
        viteConfig = typeof rawConfig === "function" ? await rawConfig(configEnv) : rawConfig;
    }
    catch (error) {
        const reason = error instanceof Error ? error.message : String(error);
        throw new Error(`Failed to load Vite configuration. Ensure vite.config.(ts|js) is present and its dependencies are installed.\n${reason}`);
    }
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
            error: (msg, options) => {
                viteLogger.error(msg, options);
            },
        },
        server: serverOptions,
        appType: "custom",
    });
    app.use(vite.middlewares);
    app.use("*", async (req, res, next) => {
        const url = req.originalUrl;
        try {
            const clientTemplate = path.resolve(dirname, "..", "client", "index.html");
            // always reload the index.html file from disk in case it changes
            let template = await fs.readFile(clientTemplate, "utf-8");
            template = template.replace(`src="/src/main.tsx"`, `src="/src/main.tsx?v=${generateId()}"`);
            const page = await vite.transformIndexHtml(url, template);
            res.status(200).set({ "Content-Type": "text/html" }).end(page);
        }
        catch (e) {
            if (e instanceof Error) {
                vite.ssrFixStacktrace(e);
                next(e);
            }
        }
    });
}
export async function serveStatic(app) {
    const distPath = path.resolve(dirname, "..", "dist", "public");
    app.use(express.static(distPath));
    const indexPath = path.resolve(distPath, "index.html");
    try {
        await fs.access(indexPath);
        app.use("*", (_req, res) => {
            res.sendFile(indexPath);
        });
    }
    catch (_a) {
        log("Static build not found; skipping SPA fallback", "static");
    }
}
