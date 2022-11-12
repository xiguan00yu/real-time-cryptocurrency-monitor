import request from "supertest";
import fetch from "node-fetch";
import app from "../src/app";

jest.mock("node-fetch");

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
