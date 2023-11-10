import {
  AUTH_USER_QUERY,
  LOGIN_MUTATION,
  SIGNUP_MUTATION,
} from "./auth.api.test.gql";
import { testUser } from "../../config/environment";
import { afterAll, beforeAll, describe, expect, test } from "@jest/globals";
import User from "../../db/models/User";
import graphqlServer from "../../graphql";
import connectDB, { dropTestDatabase } from "../../db";

describe("Test auth api", () => {
  beforeAll(async () => {
    await connectDB();
  });

  afterAll((done) => {
    // Closing the DB connection allows Jest to exit successfully.
    dropTestDatabase().finally(done);
  });

  test("Test login mutation fail", async () => {
    const response = await graphqlServer.executeOperation({
      query: LOGIN_MUTATION,
      variables: {
        email: "user@gmail.com",
        password: "wrong_password",
      },
    });
    const data = response.body.singleResult.data;
    expect(data.login?.token).not.toBeTruthy();
    expect(data.login?.user).not.toBeTruthy();
  });

  test("Test login mutation success", async () => {
    const response = await graphqlServer.executeOperation({
      query: LOGIN_MUTATION,
      variables: {
        email: testUser.email,
        password: testUser.password,
      },
    });
    const data = response.body.singleResult.data;
    expect(data.login?.user).toBeTruthy();
    expect(data.login?.token).toBeTruthy();
    expect(data.login?.user.email).toBe(testUser.email);
  });

  test("Test signup mutation fail, email exists", async () => {
    const response = await graphqlServer.executeOperation({
      query: SIGNUP_MUTATION,
      variables: {
        name: `Test ${Date.now()} User`,
        email: testUser.email,
        password: "Test12345_",
      },
    });
    const data = response.body.singleResult.data;
    expect(data.signUp).not.toBeTruthy();
  });

  test("Test signup mutation success", async () => {
    const response = await graphqlServer.executeOperation({
      query: SIGNUP_MUTATION,
      variables: {
        name: `Test ${Date.now()} User`,
        email: `user_${Date.now()}@gmail.com`,
        password: "Test12345_",
      },
    });
    const data = response.body.singleResult.data;
    expect(data.signUp).toBeTruthy();
    expect(data.signUp?.token).toBeTruthy();
    expect(data.signUp?.user).toBeTruthy();
  });

  test("Test authUser query not authorized", async () => {
    const response = await graphqlServer.executeOperation({
      query: AUTH_USER_QUERY,
    });
    const result = response.body.singleResult;
    expect(result.data).not.toBeTruthy();
    expect(result.errors.length).toBeTruthy();
    expect(result.errors[0].extensions.code).toBe("UNAUTHENTICATED");
  });

  test("Test authUser query authorized", async () => {
    const contextUser = await User.findOne({
      email: testUser.email,
    });

    const response = await graphqlServer.executeOperation(
      {
        query: AUTH_USER_QUERY,
      },
      {
        contextValue: { user: { userId: contextUser._id } },
      },
    );
    const data = response.body.singleResult.data;

    expect(data?.getCurrentUser).toBeTruthy();
    expect(data?.getCurrentUser?.id).toBe("" + contextUser.id);
    expect(data?.getCurrentUser?.email).toBe(contextUser.email);
  });
});
