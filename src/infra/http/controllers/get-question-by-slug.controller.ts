/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  BadRequestException,
  Controller,
  Get,
  Query,
  UseGuards,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { QuestionPresenter } from "../presenters/question-presenter";
import { GetQuestionBySlugUseCase } from "@/domain/forum/application/use-cases/get-question-by-slug";

@Controller("/questions/:slug")
@UseGuards(AuthGuard("jwt"))
export class GetQuestionBySlugController {
  constructor(private getQuestionBySlug: GetQuestionBySlugUseCase) {}

  @Get()
  async handle(@Query("slug") slug: string) {
    const result = await this.getQuestionBySlug.execute({
      slug,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }

    return { question: QuestionPresenter.toHTTP(result.value.question) };
  }
}
