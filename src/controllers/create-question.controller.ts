/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Body, Controller, Post, UnauthorizedException } from "@nestjs/common";

@Controller("/questions")
export class CreateQuestionController {
  constructor() {}

  @Post()
  async handle() {
    return console.log("aaai mlk doido");
  }
}
