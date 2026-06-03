/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Body, Controller, Post, UnauthorizedException } from "@nestjs/common";
import z from "zod";
import { AuthenticateStudentUseCase } from "@/domain/forum/application/use-cases/authenticate-student";

const authenticatetBodySchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

type AuthenticateBodySchema = z.infer<typeof authenticatetBodySchema>;

@Controller("/sessions")
export class AuthenticateController {
  constructor(private authenticateStudent: AuthenticateStudentUseCase) {}

  @Post()
  async handle(@Body() body: AuthenticateBodySchema) {
    const { email, password } = body;
    const result = await this.authenticateStudent.execute({
      email,
      password,
    });
    if (result.isLeft()) {
      throw new Error();
    }

    const { accessToken } = result.value;

    return { access_token: accessToken };
  }
}
