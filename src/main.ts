import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module.js";
import { ConfigService } from "@nestjs/config";
import { performanceTimestampProvider } from "rxjs/internal/scheduler/performanceTimestampProvider";
import { Env } from "./env.js";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService: ConfigService<Env, true> = app.get(ConfigService);
  const port = configService.get("PORT", { infer: true });
  await app.listen(port ?? 3000);
}
bootstrap();
