import { UseCaseError } from "@/core/errors/use-case-error";

export class StudentAlreadyExistError extends Error implements UseCaseError {
  constructor(identifier: string) {
    super(`student "${identifier}" with same e-mail address`);
  }
}
