/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { FakeHasher } from "test/cryptograpy/fake-hasher";
import { InMemoryStudentsRepository } from "test/repositories/in-memory-students-repository";
import { FakeEncrypter } from "test/cryptograpy/fake-encrypter";
import { AuthenticateStudentUseCase } from "./authenticate-student";
import { makeStudent } from "test/factories/make-student";

let inMemoryStudentsRepository: InMemoryStudentsRepository;
let fakeHasher: FakeHasher;
let fakeEncrypter: FakeEncrypter;

let sut: AuthenticateStudentUseCase;

describe("Register Student", () => {
  beforeEach(() => {
    inMemoryStudentsRepository = new InMemoryStudentsRepository();
    fakeHasher = new FakeHasher();
    fakeEncrypter = new FakeEncrypter();
    sut = new AuthenticateStudentUseCase(
      inMemoryStudentsRepository,
      fakeHasher,
      fakeEncrypter,
    );
  });

  it("should be able to authenticate a student", async () => {
    const student = makeStudent({
      email: "fulano@gmail.com",
      password: await fakeHasher.hash("1234"),
    });

    inMemoryStudentsRepository.items.push(student);

    const result = await sut.execute({
      email: "fulano@gmail.com",
      password: "1234",
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      accessToken: expect.any(String),
    });
  });
});
