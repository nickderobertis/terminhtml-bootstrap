import { vi, expect } from "vitest";
import { findByText, queryByText } from "@testing-library/dom";

export function createTerminHTMLBlock(): HTMLElement {
  const pre = document.createElement("pre");
  pre.classList.add("terminhtml");
  pre.textContent = "$ echo woo\nwoo";
  document.body.appendChild(pre);
  return pre;
}

export async function expectTerminHTMLToInitialize(element: HTMLElement) {
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
