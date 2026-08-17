/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { AppModule } from "@/infra/app.module";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { hash } from "bcryptjs";

describe("Get questions by slug (e2e)", () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let jwt: JwtService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();

    prisma = moduleRef.get(PrismaService);

    jwt = moduleRef.get(JwtService);

    await app.init();
    // ensure clean database state for e2e
    await prisma.answer.deleteMany();
    await prisma.question.deleteMany();
    await prisma.user.deleteMany();
  });

  test("[GET] /questions/:slug", async () => {
    const user = await prisma.user.create({
      data: {
        name: "jhon shadow",
        email: "jhonShadow@gmail.com",
        password: await hash("222222", 8),
      },
    });

    const acessToken = jwt.sign({ sub: user.id });

    await prisma.question.create({
      data: {
        title: "Question 01",
        slug: "question-01",
        content: "Question content",
        authorId: user.id,
      },
    });
    const response = await request(app.getHttpServer())
      .get("/questions/question-01")
      .set("Authorization", `Bearer ${acessToken}`)
      .query({ page: 1 });

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      question: expect.objectContaining({ title: "Question 01" }),
    });
  });
});
