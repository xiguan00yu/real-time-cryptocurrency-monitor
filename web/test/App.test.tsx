import "@testing-library/jest-dom";
import React from "react";
import { SWRConfig } from "swr";
import { render, screen, act } from "@testing-library/react";
import { mockResizeObserver } from "jsdom-testing-mocks";
import fetchMock from "jest-fetch-mock";
import App from "../src/Components/App";

fetchMock.enableMocks();

const renderApp = () => {
  return render(
    <SWRConfig value={{ provider: () => new Map() }}>
      <App />
    </SWRConfig>
  );
};

const updateRendering = async () => {
  await act(async () => {
    await Promise.resolve(1);
  });
};

test("Renders App Component: loading status", async () => {
  // @ts-ignore
  fetch.mockResponseOnce(JSON.stringify({ data: [] }));
  renderApp();
  // loading status
  expect(screen.getByText("loading...")).toBeInTheDocument();
  // effect after
  await updateRendering();
});

test("Renders App Component: error status", async () => {
  // @ts-ignore
  fetch.mockReject(new Error("Server 500"));
  renderApp();
  // effect after
  await updateRendering();
  // failed status
  expect(screen.getByText("failed to load")).toBeInTheDocument();
});

const resizeObserver = mockResizeObserver();

test("Renders App Component: success status", async () => {
  const mockData = [
    { name: "xx1", asset_id: "xx1", volume_1mth_usd: 3 },
    { name: "xx2", asset_id: "xx2", volume_1day_usd: 2 },
    { name: "xx3", asset_id: "xx3", volume_1hrs_usd: 1 },
  ];
  // mock fetch response
  // @ts-ignore
  fetch.mockResponseOnce(
    JSON.stringify({
      data: mockData,
    })
  );
  const { container } = renderApp();

  // effect after
  await updateRendering();

  const divEle = screen.getByTestId("content");

  // mock div offsetHeight/offsetWidth
  Object.defineProperty(HTMLElement.prototype, "offsetHeight", {
    value: 300,
    writable: true,
    configurable: true,
  });
  Object.defineProperty(HTMLElement.prototype, "offsetWidth", {
    value: 300,
    writable: true,
    configurable: true,
  });

  resizeObserver.mockElementSize(divEle, {
    contentBoxSize: { inlineSize: 300, blockSize: 300 },
  });

  act(() => {
    // on the first run you don't have to pass the element,
    // it will be included in the list of entries automatically
    // because of the call to .observe
    resizeObserver.resize();
  });

  // loading status
  const cards = container.getElementsByClassName("card");
  expect(cards.length).toBe(mockData.length);
});
