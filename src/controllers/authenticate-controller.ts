/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Body, Controller, Post, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import z from "zod";
import { PrismaService } from "src/prisma/prisma.service";
import { compare } from "bcryptjs";

const authenticatetBodySchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

type AuthenticateBodySchema = z.infer<typeof authenticatetBodySchema>;

@Controller("/sessions")
export class AuthenticateController {
  constructor(
    private jwt: JwtService,
    private prisma: PrismaService,
  ) {}

  @Post()
  async handle(@Body() body: AuthenticateBodySchema) {
    const { email, password } = body;
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      throw new UnauthorizedException("usuário sem permiss~çao");
    }

    const isPasswordVlid = await compare(password, user.password);
    if (!isPasswordVlid) {
      throw new UnauthorizedException("usuário sem permiss~çao");
    }

    const accessToken = this.jwt.sign({ sub: user.id });

    return { access_token: accessToken };
  }
}
