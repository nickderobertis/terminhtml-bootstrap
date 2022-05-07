const terminHTMLMajorVersion = 1;
const terminHTMLUrl = `https://unpkg.com/terminhtml@${terminHTMLMajorVersion}.x/dist/`;
const terminHTMLJSUrl = `${terminHTMLUrl}terminhtml.es.js`;
const termynalCSSUrl = `${terminHTMLUrl}src/termynal.css`;

import type { TerminHTML } from "terminhtml";

export type BootstrapOptions = {
  class: string;
};

export type BootstrapResult = {
  stopListener(): void;
  terminHTMLs: TerminHTML[];
};

const defaultClass = "terminhtml";
const defaultOptions: BootstrapOptions = {
  class: defaultClass,
};

export function bootstrapTerminHTMLsOnWindowLoad(
  options?: Partial<BootstrapOptions>
): void {
  window.addEventListener("load", () => {
    bootstrapTerminHTMLs(options).catch(console.error);
  });
}

export async function bootstrapTerminHTMLs(
  options?: Partial<BootstrapOptions>
): Promise<BootstrapResult> {
  loadTerminHTMLCSS();

  const opts: BootstrapOptions = { ...defaultOptions, ...options };
  const className = opts.class;
  return await createTerminHTMLs(className);
}

async function createTerminHTMLs(className: string): Promise<BootstrapResult> {
  // Dynamically load the latest major version of terminhtml-js, so that we can
  // update end users by only updating terminhtml-js.
  const TerminHTML = await import(
    /* @vite-ignore */
    terminHTMLJSUrl
  );
  const elements = document.querySelectorAll<HTMLElement>(`.${className}`);
  const terminHTMLs: TerminHTML[] = [];
  for (const element of elements) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    const terminHTML: TerminHTML = new TerminHTML.TerminHTML(element);
    terminHTMLs.push(terminHTML);
  }
  let unloadedTerms = [...terminHTMLs];

  function loadVisibleTermynals() {
    unloadedTerms = unloadedTerms.filter(term => {
      if (term.container.getBoundingClientRect().top - innerHeight <= 0) {
        term.init();
        return false;
      }
      return true;
    });
  }

  window.addEventListener("scroll", loadVisibleTermynals);
  const stopListener = () =>
    window.removeEventListener("scroll", loadVisibleTermynals);
  setTimeout(loadVisibleTermynals, 50);
  return { stopListener, terminHTMLs };
}

const cssId = "terminhtml-styles";

function loadTerminHTMLCSS() {
  if (!document.getElementById(cssId)) {
    const head = document.getElementsByTagName("head")[0];
    const link = document.createElement("link");
    link.id = cssId;
    link.rel = "stylesheet";
    link.type = "text/css";
    link.href = termynalCSSUrl;
    link.media = "all";
    head.appendChild(link);
  }
}
