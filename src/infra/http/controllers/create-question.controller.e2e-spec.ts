import { AppModule } from "@/infra/app.module";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { hash } from "bcryptjs";

describe("Create Question (e2e)", () => {
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

  test("[POST] /questions", async () => {
    const user = await prisma.user.create({
      data: {
        name: "jhon shadow",
        email: "jhonShadow@gmail.com",
        password: await hash("222222", 8),
      },
    });

    const acessToken = jwt.sign({ sub: user.id });

    const response = await request(app.getHttpServer())
      .post("/questions")
      .set("Authorization", `Bearer ${acessToken}`)
      .send({
        title: "new question",
        content: "Question content",
      });
    expect(response.statusCode).toBe(201);

    const questionOnDatabase = await prisma.question.findFirst({
      where: {
        title: "new question",
      },
    });

    expect(questionOnDatabase).toBeTruthy();
  });
});
