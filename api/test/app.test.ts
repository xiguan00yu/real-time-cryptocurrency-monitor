import Koa from "koa";
import Router from "@koa/router";
import request from "supertest";
import fetch from "node-fetch";
import app from "../src/app";

jest.mock("node-fetch");
jest.mock(
  "ioredis",
  jest
    .fn()
    .mockImplementationOnce(() => require("ioredis-mock"))
    .mockImplementationOnce(() => jest.requireActual("ioredis"))
);

beforeEach(() => {
  jest.resetModules();
});

test("Call root path will jump index.html", async () => {
  const response = await request(app.callback()).get("/");
  expect(response.status).toBe(302);
  expect(response.headers.location).toMatch(/index.html/);
});

test("Call coin/assets will return data and Double calls to the api will be cache", async () => {
  // mock fetch
  const mockCoinAssets = jest.fn(() => Promise.resolve([-1]));
  // @ts-ignore fetch is a mock for testing purposes
  fetch.mockResolvedValue(Promise.resolve({ json: mockCoinAssets }));
  // call coin/assets api
  const appSupertest = request(app.callback());
  const response = await appSupertest.get("/coin/assets");
  expect(response.status).toBe(200);
  // mock function success
  expect(mockCoinAssets).toHaveBeenCalled();

  // double call coin/assets api
  expect((await appSupertest.get("/coin/assets")).status).toBe(200);
  expect(mockCoinAssets).toHaveBeenCalledTimes(1);
});

test("Cache-Middleware with memory cache", async () => {
  process.env.REDISURL = "redis://error_url:8888";

  const cache = require("../src/middleware/cache").default;

  const mockFn = jest.fn();
  jest.mock("lru-cache", () =>
    jest.fn().mockImplementation(() => ({
      set: mockFn,
      get: mockFn,
    }))
  );

  const mockApp = new Koa();
  const mockRouter = new Router();
  mockRouter.get("/", cache, async (ctx) => {
    if (await ctx.cashed()) return;
    ctx.body = "Ok";
  });
  mockApp.use(mockRouter.routes());
  mockApp.use(mockRouter.allowedMethods());

  const appSupertest = request(mockApp.callback());
  // mock double calls
  await appSupertest.get("/");
  await appSupertest.get("/");

  expect(mockFn).toHaveBeenCalled();
}, 3000);
