import request from "supertest";
import app from "../../src/app";
import * as Helper from "../helper";

const postDeleteGoal = async (id, jwt, status) =>
  request(app)
    .post(`/delete-goal/${id}`)
    .set("Accept", "application/json")
    .set("Authorization", `Bearer ${jwt}`)
    .expect("Content-Type", /json/)
    .expect(status);
describe("Test /delete-goal", () => {
  beforeAll(async () => {
    return Helper.cleanDB();
  });

  it("It should return jwt error", async () => {
    const response = await postDeleteGoal("invalidId", "invalid-jwt", 400);
    expect(response.body.code).toBe("INVALID_JWT");
  });

  it("It should delete goal", async () => {
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
    const response = await postDeleteGoal(dbGoals[3].id, jwt, 200);
    expect(response.body.data).toBe(dbGoals[3].id);

    const updatedGoals = await Helper.getGoal(user.id);
    expect(
      updatedGoals.every((goal) => goal.id !== dbGoals[3].id)
    ).toBeTruthy();
  });

  it("It should not delete goal if it doesn't belong to the user", async () => {
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
    ];
    const dbGoals = await Promise.all(
      goals.map((goal) => Helper.insertGoal({ ...goal, userId: user.id }))
    );
    const response = await postDeleteGoal(dbGoals[1].id, jwt, 400);
    expect(response.body.code).toBe("INSUFFICIENT_PERMISSION");
  });
});
