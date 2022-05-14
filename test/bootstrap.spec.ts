import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { fireEvent, screen } from "@testing-library/dom";
import { bootstrapTerminHTMLs } from "../src/bootstrap";

function createTerminalHTMLBlock(): HTMLPreElement {
  const pre = document.createElement("pre");
  pre.classList.add("terminhtml");
  const inputSpan = document.createElement("span");
  inputSpan.textContent = "$ echo woo";
  const outputSpan = document.createElement("span");
  outputSpan.textContent = "woo";
  pre.appendChild(inputSpan);
  // Create a text node to force a line break
  pre.appendChild(document.createTextNode("\n"));
  pre.appendChild(outputSpan);
  document.body.appendChild(pre);
  return pre;
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

describe("index", () => {
  // beforeEach(() => {
  //   vi.useFakeTimers();
  // });

  // afterEach(() => {
  //   vi.useRealTimers();
  // });

  it("should bootstrap blocks with terminhtml class", async () => {
    const pre = createTerminalHTMLBlock();
    await bootstrapTerminHTMLs();
    await new Promise(resolve => setTimeout(resolve, 4000));
    // await waitForAnimation();
    screen.debug();
    console.log(document.documentElement.outerHTML);
  });
});
