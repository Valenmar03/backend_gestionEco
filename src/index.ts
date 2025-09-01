import "dotenv/config";
import colors from "colors";
import http from "http";
import app from "./server";
import { connectDB } from "./config/db";

const port = Number(process.env.PORT) || 3000;

async function bootstrap() {
  try {
    await connectDB();

    const server = http.createServer(app);

    server.listen(port, () => {
      console.log(colors.cyan.bold(`Server is running on http://localhost:${port}`));
    });

    const shutdown = (signal: string) => {
      console.log(`\nRecibido ${signal}. Cerrando servidor...`);
      server.close(() => {
        console.log("Servidor cerrado.");
        process.exit(0);
      });
      setTimeout(() => process.exit(1), 10_000).unref();
    };

    process.on("SIGTERM", () => shutdown("SIGTERM"));
    process.on("SIGINT", () => shutdown("SIGINT"));
  } catch (err) {
    console.error("Fallo al iniciar la API:", err);
    process.exit(1);
  }
}

bootstrap();
