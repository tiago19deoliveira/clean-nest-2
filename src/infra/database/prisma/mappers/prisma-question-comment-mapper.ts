/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { QuestionComment } from "@/domain/forum/enterprise/entities/question-comment";
import { UniqueEntityID } from "../../../../core/entities/unique-entity-id";
import { Comment as PrismaComment, Prisma } from "@prisma/client";

export class PrismaQuestionCommentMapper {
  static toDomain(raw: PrismaComment): QuestionComment {
    if (!raw.questionId) {
      throw new Error("invalid comment type");
    }

    return QuestionComment.create(
      {
        content: raw.content,
        authorId: new UniqueEntityID(raw.authorId),
        questionId: new UniqueEntityID(raw.authorId),
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityID(raw.id),
    );
  }

  static toPrisma(
    QuestionComment: QuestionComment,
  ): Prisma.CommentUncheckedCreateInput {
    return {
      id: QuestionComment.id.toString(),
      authorId: QuestionComment.authorId.toString(),
      content: QuestionComment.content,
      createdAt: QuestionComment.createdAt,
      updatedAt: QuestionComment.updatedAt,
    };
  }
}
