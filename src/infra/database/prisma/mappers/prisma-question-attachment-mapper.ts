/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { QuestionAttachment } from "@/domain/forum/enterprise/entities/question-attachment";
import { UniqueEntityID } from "../../../../core/entities/unique-entity-id";
import { Attachment as PrismaAttachment } from "@prisma/client";

export class PrismaQuestionAttachmentMapper {
  static toDomain(raw: PrismaAttachment): QuestionAttachment {
    if (!raw.questionId) {
      throw new Error("invalid attachment type");
    }
    return QuestionAttachment.create(
      {
        questionId: new UniqueEntityID(raw.id),
        attachmentId: new UniqueEntityID(raw.questionId),
      },
      new UniqueEntityID(raw.id),
    );
  }
}
