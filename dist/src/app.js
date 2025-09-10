"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApp = void 0;
const express_1 = __importDefault(require("express"));
const health_route_1 = __importDefault(require("./routes/health.route"));
const createApp = () => {
    const app = (0, express_1.default)();
    app.use(express_1.default.json());
    app.use("/api", health_route_1.default);
    app.get("/", (_req, res) => {
        res.json({ name: "Pak Motors API" });
    });
    return app;
};
exports.createApp = createApp;
