import { AppModule } from "@/infra/app.module";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { hash } from "bcryptjs";

describe("Authenticate (E2E)", () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();

    prisma = moduleRef.get(PrismaService);

    await app.init();
    // ensure clean database state for e2e
    await prisma.answer.deleteMany();
    await prisma.question.deleteMany();
    await prisma.user.deleteMany();
  });

  test("[POST] /sessions", async () => {
    await prisma.user.create({
      data: {
        name: "jhon shadow",
        email: "jhonShadow@gmail.com",
        password: await hash("123456", 8),
      },
    });

    const response = await request(app.getHttpServer()).post("/sessions").send({
      email: "jhonShadow@gmail.com",
      password: "123456",
    });

    expect(response.statusCode).toBe(201);

    const userOnDatabase = await prisma.user.findUnique({
      where: {
        email: "jhonShadow@gmail.com",
      },
    });

    expect(userOnDatabase).toBeTruthy();
  });
});
