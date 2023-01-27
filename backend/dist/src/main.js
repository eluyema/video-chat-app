"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const cookieParser = require("cookie-parser");
const websockets_1 = require("@nestjs/websockets");
const config_1 = require("@nestjs/config");
const session_gateway_1 = require("./modules/session/session.gateway");
function decorateGateway(class_, config) {
    (0, websockets_1.WebSocketGateway)({
        cors: {
            origin: config.get('WEBSOCKET_CORS_ORIGIN'),
            credentials: true,
        },
    })(class_);
}
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const config = app.get(config_1.ConfigService);
    decorateGateway(session_gateway_1.SessionGateway, config);
    app.useGlobalPipes(new common_1.ValidationPipe({
        transform: true,
    }));
    app.enableCors({
        origin: [process.env.FRONTEND_URL],
        credentials: true,
    });
    app.use(cookieParser());
    await app.listen(4000);
}
bootstrap();
//# sourceMappingURL=main.js.map