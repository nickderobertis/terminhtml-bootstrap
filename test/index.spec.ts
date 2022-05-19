import { fireEvent, screen } from "@testing-library/dom";
import { it, vi, describe, beforeEach, afterEach, expect } from "vitest";
import { BootstrapOptions } from "../src/bootstrap";
import {
  createTerminHTMLBlock,
  expectTerminHTMLToInitialize,
} from "./utils/terminhtml";

type BootstrapFn = (options?: Partial<BootstrapOptions>) => Promise<void>;
type BootstrapModule = {
  bootstrapTerminHTMLsOnWindowLoad: BootstrapFn;
};

vi.mock("../src");

// vi.mock("../src", async () => {
//   const actuals = await vi.importActual<BootstrapModule>("../src/bootstrap");
//   const origBootstrap = actuals.bootstrapTerminHTMLsOnWindowLoad;
//   const bootstrapTerminHTMLsOnWindowLoad: BootstrapFn = options => {
//     console.log("calling mocked bootstrap");
//     const opts: Partial<BootstrapOptions> = {
//       ...options,
//       importFromUrl: false,
//     };
//     return origBootstrap(opts);
//   };
//   console.log("mocking ../src");
//   return {
//     ...actuals,
//     bootstrapTerminHTMLsOnWindowLoad,
//   };
// });

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
    // vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("initializes the terminal with text", async () => {
    const element = createTerminHTMLBlock();
    // Ensure it is not bootstrapped on import, only when called
    // vi.runAllTimers();
    await new Promise(resolve => setTimeout(resolve, 2000));
    const beforeBootstrapText = "$ echo woo\nwoo";
    expect(element.textContent).toEqual(beforeBootstrapText);

    // Now do bootstrap, and verify the terminal is loaded
    await bootstrap();
    // vi.useRealTimers();
    await new Promise(resolve => setTimeout(resolve, 2000));
    screen.debug();
    // vi.useFakeTimers();
    expect(element.textContent).not.toEqual(beforeBootstrapText);
    // await expectTerminHTMLToInitialize(element);
  });
});
