import request from "supertest";
import app from "../../src/app";
import * as Helper from "../helper";

const postRegister = async (data, status) =>
  request(app)
    .post("/register")
    .set("Accept", "application/json")
    .send(data)
    .expect("Content-Type", /json/)
    .expect(status);
describe("Test /register", () => {
  beforeAll(async () => {
    return Helper.cleanDB();
  });
  it("It should insert new account", async () => {
    const response = await postRegister(
      {
        email: "test@example.com",
        password: "abc123",
      },
      200
    );
    expect(response.body).toMatchObject({
      data: "Account created successfully.",
    });
  });

  it("It should return error for duplicate email", async () => {
    const response = await postRegister(
      {
        email: "test@example.com",
        password: "abc123",
      },
      400
    );
    expect(response.body.code).toBe("EMAIL_EXIST");
  });

  it("Password should be encrypted", async () => {
    const response = await postRegister(
      {
        email: "test1@example.com",
        password: "abc123",
      },
      200
    );
    const user = await Helper.getUserByEmail("test1@example.com");
    expect(user.password).not.toBe("abc123");
  });

  it("Uppercase email should be stored lowercase", async () => {
    const response = await postRegister(
      {
        email: "TEST2@example.com",
        password: "abc123",
      },
      200
    );
    const user = await Helper.getUserByEmail("test2@example.com");
    expect(user).not.toBeUndefined();
  });

  it("It should return error when email is not provided", async () => {
    const response = await postRegister(
      {
        password: "abc123",
      },
      400
    );
    expect(response.body.code).toBe("INVALID_EMAIL");
  });

  it("It should return error when password is not provided", async () => {
    const response = await postRegister(
      {
        email: "test3@example.com",
      },
      400
    );
    expect(response.body.code).toBe("INVALID_PASSWORD");
  });

  it("It should return error for invalid email provided", async () => {
    const response = await postRegister(
      {
        email: "test3@example",
        password: "abc123",
      },
      400
    );
    expect(response.body.code).toBe("INVALID_EMAIL");
  });
});
