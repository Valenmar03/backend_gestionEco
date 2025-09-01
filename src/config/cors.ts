// src/config/cors.ts
import { CorsOptions } from "cors";

function parseList(v?: string) {
  return (v ?? "")
    .split(",")
    .map(s => s.trim())
    .filter(Boolean);
}

const exact = new Set<string>([
  "http://localhost:5173",
  ...parseList(process.env.ALLOWED_ORIGINS),
]);

const regexes = parseList(process.env.ALLOWED_ORIGIN_PATTERNS).map(p => new RegExp(p));

export const corsConfig: CorsOptions = {
  origin(origin, cb) {
    if (!origin) return cb(null, true); // curl/healthchecks

    if (exact.has(origin) || regexes.some(rx => rx.test(origin))) {
      return cb(null, true);
    }
    return cb(new Error(`CORS: origen no permitido -> ${origin}`));
  },
  credentials: true,
  methods: ["GET","POST","PUT","PATCH","DELETE","OPTIONS"],
  allowedHeaders: ["Content-Type","Authorization"],
};
