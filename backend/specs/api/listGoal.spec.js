import request from "supertest";
import app from "../../src/app";
import * as Helper from "../helper";

const getListGoal = async (jwt, status) =>
  request(app)
    .get("/list-goal")
    .set("Accept", "application/json")
    .set("Authorization", `Bearer ${jwt}`)
    .expect("Content-Type", /json/)
    .expect(status);

const compareResponseData = (responseData, goals) =>
  responseData.forEach((data) => {
    expect(
      goals.some(
        (goal) =>
          JSON.stringify(goal) ===
          JSON.stringify({
            name: data.name,
            date: data.date,
            isCompleted: data.isCompleted,
            color: data.color,
          })
      )
    ).toBeTruthy();
  });
describe("Test /list-goal", () => {
  beforeAll(async () => {
    return Helper.cleanDB();
  });

  it("It should return jwt error", async () => {
    const response = await getListGoal("invalid-jwt", 400);
    expect(response.body.code).toBe("INVALID_JWT");
  });

  it("It should list of goals", async () => {
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
    await Promise.all(
      goals.map((goal) => Helper.insertGoal({ ...goal, userId: user.id }))
    );
    const response = await getListGoal(jwt, 200);
    compareResponseData(response.body.data, goals);
  });

  it("It should list of goals should return only belonging to the user", async () => {
    const { jwt, user } = await Helper.createUser({
      email: "user1@example.com",
    });
    const { user: user2 } = await Helper.createUser({
      email: "user2@example.com",
    });
    const user1Goals = [
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
    const user2Goals = [
      {
        name: "jogging",
        date: "2021-08-10",
        isCompleted: false,
        color: "#FFFFFF",
      },
      {
        name: "shopping",
        date: "2021-08-20",
        isCompleted: false,
        color: "#FFFFFF",
      },
      {
        name: "workout",
        date: "2021-08-30",
        isCompleted: false,
        color: "#FFFFFF",
      },
    ];
    await Promise.all([
      user1Goals.map((goal) => Helper.insertGoal({ ...goal, userId: user.id })),
      user2Goals.map((goal) =>
        Helper.insertGoal({ ...goal, userId: user2.id })
      ),
    ]);
    const response = await getListGoal(jwt, 200);
    compareResponseData(response.body.data, user1Goals);
  });

  it("It should return empty array if no goals found", async () => {
    const { jwt } = await Helper.createUser({
      email: "user1@example.com",
    });
    const response = await getListGoal(jwt, 200);
    expect(response.body.data).toMatchObject([]);
  });
});
