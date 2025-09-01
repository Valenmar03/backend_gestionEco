import { CorsOptions } from "cors";

export const corsConfig: CorsOptions = {
  origin(origin, callback) {
    // lista de orígenes permitidos
    const whitelist = [
      process.env.FRONTEND_URL, 
      "http://localhost:5173",  
    ].filter(Boolean); 

    if (!origin) {
      return callback(null, true);
    }

    if (whitelist.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS: origen no permitido -> ${origin}`));
    }
  },
  credentials: true,
};
