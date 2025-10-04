"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const envalid_1 = require("envalid");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const nodeEnvironment = process.env.NODE_ENV || 'development';
const envPath = nodeEnvironment !== 'production' ? path_1.default.resolve(process.cwd(), `.env.${nodeEnvironment}`) : null;
if (envPath && fs_1.default.existsSync(envPath)) {
    dotenv_1.default.config({ path: envPath });
}
else {
    if (nodeEnvironment !== 'production') {
        console.error(`Environment file .env.${process.env.NODE_ENV} not found`);
    }
}
exports.env = (0, envalid_1.cleanEnv)(process.env, {
    NODE_ENV: (0, envalid_1.str)({ devDefault: (0, envalid_1.testOnly)('test'), choices: ['development', 'production', 'production.local', 'test'] }),
    HOST: (0, envalid_1.host)({ devDefault: (0, envalid_1.testOnly)('localhost') }),
    PORT: (0, envalid_1.port)({ devDefault: (0, envalid_1.testOnly)(3000) }),
    CORS_ORIGIN: (0, envalid_1.str)({ devDefault: (0, envalid_1.testOnly)('http://localhost:3001;http://localhost:3000') }),
    COMMON_RATE_LIMIT_MAX_REQUESTS: (0, envalid_1.num)({ devDefault: (0, envalid_1.testOnly)(1000) }),
    COMMON_RATE_LIMIT_WINDOW_MS: (0, envalid_1.num)({ devDefault: (0, envalid_1.testOnly)(1000) }),
    MONGO_URL: (0, envalid_1.url)({ devDefault: (0, envalid_1.testOnly)('mongodb://localhost:27017/wrytify-db') }),
    JWT_SECRET_KEY: (0, envalid_1.str)({ devDefault: (0, envalid_1.testOnly)('mySecret') }),
    JWT_EXPIRES_IN: (0, envalid_1.str)({ devDefault: (0, envalid_1.testOnly)('1d') }),
    BCRYPT_SALT_ROUNDS: (0, envalid_1.num)({ devDefault: (0, envalid_1.testOnly)(10) }),
    EMAIL_USER: (0, envalid_1.str)({ devDefault: (0, envalid_1.testOnly)('arshman@gmail.com') }),
    EMAIL_PASSWORD: (0, envalid_1.str)({ devDefault: (0, envalid_1.testOnly)('124345$arsh') }),
});
