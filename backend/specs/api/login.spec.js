import request from "supertest";
import app from "../../src/app";
import * as Helper from "../helper";

const postLogin = async (data, status) =>
  request(app)
    .post("/login")
    .set("Accept", "application/json")
    .send(data)
    .expect("Content-Type", /json/)
    .expect(status);
describe("Test /login", () => {
  beforeAll(async () => {
    return Helper.cleanDB();
  });
  it("It should login the account", async () => {
    const user = await Helper.createUser({});
    const response = await postLogin(
      {
        email: user.email,
        password: "random-password",
      },
      200
    );
    expect(response.body.jwt).not.toBeNull();
    expect(response.body.id).not.toBeNull();
    expect(response.body.email).not.toBeNull();
    expect(response.body.password).toBeUndefined();
  });

  it("It should return error for missing email", async () => {
    const response = await postLogin(
      {
        password: "random-password",
      },
      400
    );
    expect(response.body.code).toBe("INVALID_ACCOUNT");
  });

  it("It should return error for missing password", async () => {
    const response = await postLogin(
      {
        email: "test@example.com",
      },
      400
    );
    expect(response.body.code).toBe("INVALID_ACCOUNT");
  });

  it("It should return error for invalid email", async () => {
    const response = await postLogin(
      {
        email: "invalid",
        password: "random-password",
      },
      400
    );
    expect(response.body.code).toBe("INVALID_ACCOUNT");
  });

  it("It should return error for incorrect email", async () => {
    const response = await postLogin(
      {
        email: "invalidUser@example.com",
        password: "random-password",
      },
      400
    );
    expect(response.body.code).toBe("INVALID_ACCOUNT");
  });

  it("It should return error for incorrect password", async () => {
    const user = await Helper.createUser({
      email: "validUser@example.com",
      password: "simple-password",
    });
    const response = await postLogin(
      {
        email: "invalidUser@example.com",
        password: "random-password",
      },
      400
    );
    expect(response.body.code).toBe("INVALID_ACCOUNT");
  });
});
