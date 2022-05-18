import { it, vi, describe, beforeEach, afterEach, expect } from "vitest";
import { BootstrapOptions, bootstrapTerminHTMLs } from "../src/bootstrap";
import {
  createTerminHTMLBlock,
  expectTerminHTMLToInitialize,
} from "./utils/terminhtml";

async function bootstrap(options?: Partial<BootstrapOptions>): Promise<void> {
  const opts: BootstrapOptions = {
    importFromUrl: false,
    className: "terminhtml",
    ...options,
  };
  await bootstrapTerminHTMLs(opts);
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
    vi.runAllTimers();
    expect(element.textContent).not.toEqual(beforeBootstrapText);
    await expectTerminHTMLToInitialize(element);
  });
});
