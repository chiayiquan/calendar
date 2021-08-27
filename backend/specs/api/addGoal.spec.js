import request from "supertest";
import app from "../../src/app";
import * as Helper from "../helper";

const postAddGoal = async (data, jwt, status) =>
  request(app)
    .post("/add-goal")
    .set("Accept", "application/json")
    .set("Authorization", `Bearer ${jwt}`)
    .send(data)
    .expect("Content-Type", /json/)
    .expect(status);
describe("Test /add-goal", () => {
  beforeAll(async () => {
    return Helper.cleanDB();
  });

  it("It should return jwt error", async () => {
    const goal = {
      name: "running",
      date: "2021-08-10",
      isCompleted: false,
      color: "#FFFFFF",
    };
    const response = await postAddGoal(goal, "invalid", 400);
    expect(response.body.code).toBe("INVALID_JWT");
  });

  it("It should add new goal", async () => {
    const { jwt } = await Helper.createUser({});
    const goal = {
      name: "running",
      date: "2021-08-10",
      isCompleted: false,
      color: "#FFFFFF",
    };
    const response = await postAddGoal(goal, jwt, 200);
    expect(response.body.data.name).toBe(goal.name);
    expect(response.body.data.date).toBe(goal.date);
    expect(response.body.data.isCompleted).toBe(goal.isCompleted);
    expect(response.body.data.color).toBe(goal.color);
    expect(response.body.data.id).not.toBeNull();
  });

  it("It should return error for missing name", async () => {
    const { jwt } = await Helper.createUser({});
    const goal = {
      date: "2021-08-10",
      isCompleted: false,
      color: "#FFFFFF",
    };
    const response = await postAddGoal(goal, jwt, 400);
    expect(response.body.code).toBe("INVALID_NAME");
  });

  it("It should return error for missing date", async () => {
    const { jwt } = await Helper.createUser({});
    const goal = {
      name: "running",
      isCompleted: false,
      color: "#FFFFFF",
    };
    const response = await postAddGoal(goal, jwt, 400);
    expect(response.body.code).toBe("INVALID_DATE");
  });

  it("It should return error for missing isCompleted", async () => {
    const { jwt } = await Helper.createUser({});
    const goal = {
      name: "running",
      date: "2021-08-10",
      color: "#FFFFFF",
    };
    const response = await postAddGoal(goal, jwt, 400);
    expect(response.body.code).toBe("INVALID_STATUS");
  });

  it("It should return error for missing color", async () => {
    const { jwt } = await Helper.createUser({});
    const goal = {
      name: "running",
      date: "2021-08-10",
      isCompleted: false,
    };
    const response = await postAddGoal(goal, jwt, 400);
    expect(response.body.code).toBe("INVALID_COLOR");
  });

  it("It should return error for invalid date format", async () => {
    const { jwt } = await Helper.createUser({});
    const goal = {
      name: "running",
      date: "10-08-2021",
      isCompleted: false,
      color: "#FFFFFF",
    };
    const response = await postAddGoal(goal, jwt, 400);
    expect(response.body.code).toBe("INVALID_DATE");
  });

  it("It should return error for invalid color code", async () => {
    const { jwt } = await Helper.createUser({});
    const goal = {
      name: "running",
      date: "2021-08-10",
      isCompleted: false,
      color: "#GGGGGG",
    };
    const response = await postAddGoal(goal, jwt, 400);
    expect(response.body.code).toBe("INVALID_COLOR");
  });

  it("It should return error for invalid color code", async () => {
    const { jwt } = await Helper.createUser({});
    const goal = {
      name: "running",
      date: "2021-08-10",
      isCompleted: false,
      color: "#A123BCDE",
    };
    const response = await postAddGoal(goal, jwt, 400);
    expect(response.body.code).toBe("INVALID_COLOR");
  });
});
