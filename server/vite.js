import express from "express";
import fs from "fs/promises";
import path from "path";
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
    let viteConfig;
    try {
        const configModule = await import("../vite.config.ts");
        viteConfig = configModule.default;
    }
    catch (error) {
        const reason = error instanceof Error ? error.message : String(error);
        throw new Error(`Failed to load Vite configuration. Ensure vite.config.ts is present and its dependencies are installed.\n${reason}`);
    }
    const { createServer: createViteServer, createLogger } = viteModule;
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
            error: (msg, options) => {
                viteLogger.error(msg, options);
                process.exit(1);
            },
        },
        server: serverOptions,
        appType: "custom",
    });
    app.use(vite.middlewares);
    app.use("*", async (req, res, next) => {
        const url = req.originalUrl;
        try {
            const clientTemplate = path.resolve(import.meta.dirname, "..", "client", "index.html");
            // always reload the index.html file from disk incase it changes
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
export function serveStatic(app) {
    const distPath = path.resolve(import.meta.dirname, "..", "dist", "public");
    app.use(express.static(distPath));
    // fall through to index.html if the file doesn't exist
    app.use("*", (_req, res) => {
        res.sendFile(path.resolve(distPath, "index.html"));
    });
}
