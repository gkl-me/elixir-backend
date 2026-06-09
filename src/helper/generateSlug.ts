import crypto from "crypto";

export function generateSlug(text: string): string {
    const slug = text
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-");

    const hash = crypto
        .createHash("sha256")
        .update(text)
        .digest("hex")
        .slice(0, 6);

    return `${slug}-${hash}`;
}