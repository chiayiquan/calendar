import request from "supertest";
import app from "../../src/app";
import * as Helper from "../helper";

const postUpdateGoal = async (data, jwt, status) =>
  request(app)
    .post("/update-goal")
    .set("Accept", "application/json")
    .set("Authorization", `Bearer ${jwt}`)
    .send(data)
    .expect("Content-Type", /json/)
    .expect(status);
describe("Test /update-goal", () => {
  beforeAll(async () => {
    return Helper.cleanDB();
  });

  it("It should return jwt error", async () => {
    const response = await postUpdateGoal({}, "invalid-jwt", 400);
    expect(response.body.code).toBe("INVALID_JWT");
  });

  it("It should update goal", async () => {
    const { jwt, user } = await Helper.createUser({});
    const goals = [
      {
        name: "running",
        date: "2021-08-10",
        isCompleted: false,
        color: "#FFFFFF",
      },
      {
        name: "walking",
        date: "2021-08-20",
        isCompleted: false,
        color: "#FFFFFF",
      },
      {
        name: "running",
        date: "2021-08-30",
        isCompleted: false,
        color: "#FFFFFF",
      },
      {
        name: "running",
        date: "2021-08-1",
        isCompleted: false,
        color: "#FFFFFF",
      },
    ];
    const dbGoals = await Promise.all(
      goals.map((goal) => Helper.insertGoal({ ...goal, userId: user.id }))
    );
    const updatedGoals = {
      ...dbGoals[3],
      name: "Updated Goal",
      date: "2021-09-12",
      isCompleted: true,
      color: "#AABBCC",
    };
    const response = await postUpdateGoal(updatedGoals, jwt, 200);
    expect(response.body.data).toMatchObject(updatedGoals);
  });

  it("It should not update goal if does not belong to the user", async () => {
    const { user } = await Helper.createUser({});
    const { jwt } = await Helper.createUser({});
    const goals = [
      {
        name: "running",
        date: "2021-08-10",
        isCompleted: false,
        color: "#FFFFFF",
      },
      {
        name: "walking",
        date: "2021-08-20",
        isCompleted: false,
        color: "#FFFFFF",
      },
      {
        name: "running",
        date: "2021-08-30",
        isCompleted: false,
        color: "#FFFFFF",
      },
      {
        name: "running",
        date: "2021-08-1",
        isCompleted: false,
        color: "#FFFFFF",
      },
    ];
    const dbGoals = await Promise.all(
      goals.map((goal) => Helper.insertGoal({ ...goal, userId: user.id }))
    );
    const updatedGoals = {
      ...dbGoals[3],
      name: "Updated Goal",
      date: "2021-09-12",
      isCompleted: true,
      color: "#AABBCC",
    };
    const response = await postUpdateGoal(updatedGoals, jwt, 400);
    expect(response.body.code).toBe("INSUFFICIENT_PERMISSION");
  });

  it("It should return error for missing name", async () => {
    const { jwt } = await Helper.createUser({});
    const goal = {
      date: "2021-08-10",
      isCompleted: false,
      color: "#FFFFFF",
      id: "random-id",
    };
    const response = await postUpdateGoal(goal, jwt, 400);
    expect(response.body.code).toBe("INVALID_NAME");
  });

  it("It should return error for missing date", async () => {
    const { jwt } = await Helper.createUser({});
    const goal = {
      name: "running",
      isCompleted: false,
      color: "#FFFFFF",
      id: "random-id",
    };
    const response = await postUpdateGoal(goal, jwt, 400);
    expect(response.body.code).toBe("INVALID_DATE");
  });

  it("It should return error for missing isCompleted", async () => {
    const { jwt } = await Helper.createUser({});
    const goal = {
      name: "running",
      date: "2021-08-10",
      color: "#FFFFFF",
      id: "random-id",
    };
    const response = await postUpdateGoal(goal, jwt, 400);
    expect(response.body.code).toBe("INVALID_STATUS");
  });

  it("It should return error for missing color", async () => {
    const { jwt } = await Helper.createUser({});
    const goal = {
      name: "running",
      date: "2021-08-10",
      isCompleted: false,
      id: "random-id",
    };
    const response = await postUpdateGoal(goal, jwt, 400);
    expect(response.body.code).toBe("INVALID_COLOR");
  });

  it("It should return error for invalid date format", async () => {
    const { jwt } = await Helper.createUser({});
    const goal = {
      name: "running",
      date: "10-08-2021",
      isCompleted: false,
      color: "#FFFFFF",
      id: "random-id",
    };
    const response = await postUpdateGoal(goal, jwt, 400);
    expect(response.body.code).toBe("INVALID_DATE");
  });

  it("It should return error for invalid color code", async () => {
    const { jwt } = await Helper.createUser({});
    const goal = {
      name: "running",
      date: "2021-08-10",
      isCompleted: false,
      color: "#GGGGGG",
      id: "random-id",
    };
    const response = await postUpdateGoal(goal, jwt, 400);
    expect(response.body.code).toBe("INVALID_COLOR");
  });

  it("It should return error for invalid color code", async () => {
    const { jwt } = await Helper.createUser({});
    const goal = {
      name: "running",
      date: "2021-08-10",
      isCompleted: false,
      color: "#A123BCDE",
      id: "random-id",
    };
    const response = await postUpdateGoal(goal, jwt, 400);
    expect(response.body.code).toBe("INVALID_COLOR");
  });

  it("It should return error for missing id", async () => {
    const { jwt } = await Helper.createUser({});
    const goal = {
      name: "running",
      date: "2021-08-10",
      isCompleted: false,
      color: "#FFFFFF",
    };
    const response = await postUpdateGoal(goal, jwt, 400);
    expect(response.body.code).toBe("INVALID_ID");
  });
});
