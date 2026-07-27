import { Request } from "express";

export const getClientInfo = (req: Request) => {
    const userAgent = (req.headers["user-agent"] as string) || "Unknown Device";

    const forwardedFor = req.headers["x-forwarded-for"];

    console.log("forward", forwardedFor)
    console.log("ip", req.ip)

    let ip = "";
    if (typeof forwardedFor === "string" && forwardedFor.trim()) {
        ip = forwardedFor.split(",")[0].trim();
    }
    if (!ip) {
        ip = (req.headers["x-real-ip"] as string) || req.ip || req.socket.remoteAddress || "127.0.0.1";
    }

    if (ip === "::1" || ip === "::ffff:127.0.0.1") {
        ip = "127.0.0.1";
    }

    return { userAgent, ip };
};