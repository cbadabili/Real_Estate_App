import { Router } from 'express';
import swaggerUi from 'swagger-ui-express';
import spec from '../openapi.json';
export const docsRouter = Router();
docsRouter.use('/', swaggerUi.serve, swaggerUi.setup(spec, {
    customSiteTitle: 'BeeDab API Documentation',
    customCss: '.swagger-ui .topbar { display: none }',
    swaggerOptions: {
        docExpansion: 'tag',
        filter: true,
        showRequestHeaders: true
    }
}));
