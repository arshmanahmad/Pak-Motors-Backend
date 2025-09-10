"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getHealth = void 0;
const getHealth = (req, res) => {
    res.status(200).json({ status: "ok", uptime: process.uptime() });
};
exports.getHealth = getHealth;
