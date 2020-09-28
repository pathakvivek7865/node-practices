"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
const port = process.env.PORT || 8000;
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    await app.listen(port);
    common_1.Logger.log(`Server running on http://localhost:${port}`, 'BootStrap');
}
bootstrap();
//# sourceMappingURL=main.js.map