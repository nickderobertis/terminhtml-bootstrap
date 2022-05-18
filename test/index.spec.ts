import { fireEvent } from "@testing-library/dom";
import { it, vi, describe, beforeEach, afterEach, expect } from "vitest";
import {
  createTerminHTMLBlock,
  expectTerminHTMLToInitialize,
} from "./utils/terminhtml";

async function bootstrap(): Promise<void> {
  await import("../src");
  document.addEventListener("DOMContentLoaded", () => {
    console.log("DOMContentLoaded");
  });
  document.addEventListener("load", () => {
    console.log("load");
  });
  console.log("firing load event");
  fireEvent.load(window);
  console.log("load event fired");
}

describe("bootstrap", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("initializes the terminal with text", async () => {
    const element = createTerminHTMLBlock();
    // Ensure it is not bootstrapped on import, only when called
    vi.runAllTimers();
    const beforeBootstrapText = "$ echo woo\nwoo";
    expect(element.textContent).toEqual(beforeBootstrapText);

    // Now do bootstrap, and verify the terminal is loaded
    await bootstrap();
    vi.useRealTimers();
    await new Promise(resolve => setTimeout(resolve, 3000));
    vi.useFakeTimers();
    expect(element.textContent).not.toEqual(beforeBootstrapText);
    await expectTerminHTMLToInitialize(element);
  });
});
