import { it, vi, describe, beforeEach, afterEach, expect } from "vitest";
import { findByText, queryByText } from "@testing-library/dom";
import { BootstrapOptions, bootstrapTerminHTMLs } from "../src/bootstrap";

async function bootstrap(options?: Partial<BootstrapOptions>): Promise<void> {
  const opts: BootstrapOptions = {
    importFromUrl: false,
    className: "terminhtml",
    ...options,
  };
  await bootstrapTerminHTMLs(opts);
}

function createTerminHTMLBlock(): HTMLElement {
  const pre = document.createElement("pre");
  pre.classList.add("terminhtml");
  pre.textContent = "$ echo woo\nwoo";
  document.body.appendChild(pre);
  return pre;
}

async function expectTerminHTMLToInitialize(element: HTMLElement) {
  // Check for speed control
  await findByText(element, "1x");
  // Check for branding
  await findByText(element, "Created with");
  // Animation has not run, so input and output do not exist yet
  expect(queryByText(element, "echo woo")).toBeNull();
  expect(queryByText(element, "woo")).toBeNull();

  await waitForAnimation();

  // Check for input displayed
  const inputTextElem = await findByText(element, "echo woo");
  const inputElem = inputTextElem.parentElement?.parentElement as HTMLElement;
  expect(inputElem.getAttribute("data-ty")).toEqual("input");
  // Check for output displayed
  const outputElem = await findByText(element, "woo");
  expect(outputElem.getAttribute("data-ty")).toBeFalsy();
}

async function waitForAnimation() {
  vi.runAllTimers();
  for (let i = 0; i < 100; i++) {
    await new Promise(resolve => {
      setTimeout(resolve, 5);
      vi.runAllTimers();
    });
  }
}

describe("TerminHTML", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("initializes the terminal with text", async () => {
    const element = createTerminHTMLBlock();
    await bootstrap();
    vi.runAllTimers();
    await expectTerminHTMLToInitialize(element);
  });
});
