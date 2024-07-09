import { describe, test, expect, beforeAll, afterAll } from "vitest";
import request from "supertest";
import { app, server } from "../../index";
import { disconnectFromMongoDB } from "../../dbconnection/mongodb";
import jwt from "jsonwebtoken";

const login = async () => {
  // login and get the token
  const loginResponse = await request(app).post("/signin").send({ email: "testuser8@example.com", password: "123" }).expect("Content-Type", /json/).expect(200);
  expect(loginResponse.body).toHaveProperty("token");
  const token = loginResponse.body.token;
  const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
  const userId = decodedToken.id;
  return userId;
};

describe("Backend Integration Tests", () => {
  afterAll(async () => {
    await disconnectFromMongoDB();
    server.close();
  });

  test("User registration", async () => {
    const response = await request(app).post("/signup").send({ email: "testuser8@example.com", password: "123", role: "student" }).expect("Content-Type", /json/).expect(201);
    expect(response.body).toHaveProperty("message", "User created successfully");
  });

  test("User login", async () => {
    await login();
  });

  test("Fetch user profile", async () => {
    // login and get the token
    const userId = await login();
    // fetch the profile
    const profileResponse = await request(app).get(`/profile/${userId}`).expect("Content-Type", /json/).expect(200);
    expect(profileResponse.body).toHaveProperty("user");
  });

  test("Fetch forum topics", async () => {
    // login and get the token
    const userId = await login();
    // fetch the forum topics
    const response = await request(app).get("/topics/home").query({ userId }).expect("Content-Type", /json/).expect(200);
    expect(response.body).toBeInstanceOf(Array);
  });

  test("fetch forum topic by id", async () => {
    // login and get the token
    const userId = await login();
    // fetch the forum topics
    const getTopicsResponse = await request(app).get("/topics/home").query({ userId }).expect("Content-Type", /json/).expect(200);
    expect(getTopicsResponse.body).toBeInstanceOf(Array);
    // get the first topic's id
    const topic = getTopicsResponse.body[0];
    expect(topic).toHaveProperty("_id");
    const topicId = topic._id;
    // fetch the topic by id
    const response = await request(app).get(`/topics/general/${topicId}`).query({ userId }).expect("Content-Type", /json/).expect(200);
    expect(response.body).toBeInstanceOf(Object);
  });

  test("Create a new forum topic", async () => {
    // login and get the token
    const userId = await login();
    // create a new topic
    const topicResponse = await request(app).post("/createTopic").send({ userId, title: "New Test Topic", message: "This is a new topic content", category: "general" }).expect("Content-Type", /json/).expect(201);
    expect(topicResponse.body).toHaveProperty("_id");
  });

  test("Create a new forum reply", async () => {
    // login and get the token
    const userId = await login();
    // fetch the forum topics
    const getTopicsResponse = await request(app).get("/topics/home").query({ userId }).expect("Content-Type", /json/).expect(200);
    expect(getTopicsResponse.body).toBeInstanceOf(Array);
    // get the first topic's id
    const topic = getTopicsResponse.body[0];
    expect(topic).toHaveProperty("_id");
    const topicId = topic._id;

    // 1 - create a new reply on a topic
    const replyToTopicResponse = await request(app)
      .post(`/${topicId}/reply`)
      .send({
        userId,
        message: "1This is a new reply content",
        parentTopicId: topicId,
        parentMessageId: topicId,
        parentMessageCreator: topic.creator,
        parentMessage: topic.message,
      })
      .expect("Content-Type", /json/)
      .expect(200);
    expect(replyToTopicResponse.body).toHaveProperty("_id");

    // 2 - create a new reply on a reply
    const reply = replyToTopicResponse.body;
    const replyId = reply._id;
    const replyToReplyResponse = await request(app)
      .post(`/${topicId}/reply`)
      .send({
        userId,
        message: "This is a reply to a reply",
        parentTopicId: topicId,
        parentMessageId: replyId,
        parentMessageCreator: reply.creator,
        parentMessage: reply.message,
      })
      .expect("Content-Type", /json/)
      .expect(200);
    expect(replyToReplyResponse.body).toHaveProperty("_id");
  });
});
