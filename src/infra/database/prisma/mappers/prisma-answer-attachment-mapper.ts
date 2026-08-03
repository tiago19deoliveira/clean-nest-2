/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { AnswerAttachment } from "@/domain/forum/enterprise/entities/answer-attachment";
import { UniqueEntityID } from "../../../../core/entities/unique-entity-id";
import { Attachment as PrismaAttachment } from "@prisma/client";

export class PrismaAnswerAttachmentMapper {
  static toDomain(raw: PrismaAttachment): AnswerAttachment {
    if (!raw.answerId) {
      throw new Error("invalid attachment type");
    }
    return AnswerAttachment.create(
      {
        answerId: new UniqueEntityID(raw.id),
        attachmentId: new UniqueEntityID(raw.answerId),
      },
      new UniqueEntityID(raw.id),
    );
  }
}
