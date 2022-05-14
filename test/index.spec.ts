import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { fireEvent, screen } from "@testing-library/dom";

const bootstrapScriptUrl =
  "https://unpkg.com/@terminhtml/bootstrap@1.x/dist/@terminhtml-bootstrap.umd.js";

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

function createBootstrapScriptTag(): HTMLScriptElement {
  const script = document.createElement("script");
  script.src = bootstrapScriptUrl;
  script.onload = () => console.log("Bootstrap script loaded");
  document.head.appendChild(script);
  return script;
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
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should do the default bootstrap when imported via script tag", async () => {
    const pre = createTerminalHTMLBlock();
    createBootstrapScriptTag();
    const script = document.querySelector(
      "script[src='" + bootstrapScriptUrl + "']"
    );
    if (!script) {
      throw new Error("Bootstrap script tag not found");
    }
    // fireEvent.load(script);
    // await new Promise(resolve => setTimeout(resolve, 4000));
    await waitForAnimation();
    screen.debug();
    console.log(document.documentElement.outerHTML);
  });
});
