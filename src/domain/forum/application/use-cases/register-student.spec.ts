import { FakeHasher } from "test/cryptograpy/fake-hasher";
import { InMemoryStudentsRepository } from "test/repositories/in-memory-students-repository";
import { RegisterStudentUseCase } from "./register-student";

let inMemoryStudentsRepository: InMemoryStudentsRepository;
let fakeHasher: FakeHasher;
let sut: RegisterStudentUseCase;

describe("Register Student", () => {
  beforeEach(() => {
    inMemoryStudentsRepository = new InMemoryStudentsRepository();
    fakeHasher = new FakeHasher();
    sut = new RegisterStudentUseCase(inMemoryStudentsRepository, fakeHasher);
  });

  it("should be able to register new student", async () => {
    const result = await sut.execute({
      name: "Fulano de tal",
      email: "fulano@gmail.com",
      password: "1234",
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      student: inMemoryStudentsRepository.items[0],
    });
  });

  it("should hash student password upon registration ", async () => {
    const result = await sut.execute({
      name: "Fulano de tal",
      email: "fulano@gmail.com",
      password: "1234",
    });

    const hashedPassword = await fakeHasher.hash("1234");

    expect(result.isRight()).toBe(true);
    expect(inMemoryStudentsRepository.items[0].password).toEqual(
      hashedPassword,
    );
  });
});
