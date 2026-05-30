import { Response } from "express";

export function setCookie(res: Response, name: string, token: string): void {
  const maxAge = 7 * 24 * 60 * 60 * 1000;

  res.cookie(name, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge,
    sameSite: "lax",
  });
  return;
}

export function clearCookie(res: Response, name: string): void {
  res.clearCookie(name);
  return;
}
