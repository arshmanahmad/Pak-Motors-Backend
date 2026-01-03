"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApp = void 0;
const express_1 = __importDefault(require("express"));
const health_route_1 = __importDefault(require("./routes/health.route"));
const auth_route_1 = require("./routes/auth.route");
const purchase_route_1 = require("./routes/purchase.route");
const company_route_1 = require("./routes/company.route");
const car_model_route_1 = require("./routes/car-model.route");
const person_route_1 = require("./routes/person.route");
const sale_route_1 = require("./routes/sale.route");
const env_1 = require("./config/env");
const cors_1 = __importDefault(require("cors"));
const createApp = () => {
    const app = (0, express_1.default)();
    app.use(express_1.default.json());
    // Parse CORS_ORIGIN - handle semicolon-separated origins or single origin
    // In development, allow all origins for easier testing
    const corsOptions = env_1.env.NODE_ENV === "development"
        ? { origin: true, credentials: true } // Allow all origins in development
        : {
            origin: env_1.env.CORS_ORIGIN.includes(";")
                ? env_1.env.CORS_ORIGIN.split(";").map((origin) => origin.trim())
                : env_1.env.CORS_ORIGIN,
            credentials: true,
        };
    app.use((0, cors_1.default)(corsOptions));
    app.use("/api", health_route_1.default);
    app.use("/api/auth", auth_route_1.authRouter);
    app.use("/api/purchases", purchase_route_1.purchaseRouter);
    app.use("/api/companies", company_route_1.companyRouter);
    app.use("/api/models", car_model_route_1.carModelRouter);
    app.use("/api/persons", person_route_1.personRouter);
    app.use("/api/sales", sale_route_1.saleRouter);
    app.get("/", (_req, res) => {
        res.json({ name: "Pak Motors API" });
    });
    return app;
};
exports.createApp = createApp;
