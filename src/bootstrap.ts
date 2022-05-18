const terminHTMLMajorVersion = 1;
const terminHTMLUrl = `https://unpkg.com/terminhtml@${terminHTMLMajorVersion}.x/dist/`;
const terminHTMLJSUrl = `${terminHTMLUrl}terminhtml.es.js`;
const termynalCSSUrl = `${terminHTMLUrl}src/termynal.css`;

import type { TerminHTML } from "terminhtml";

type TerminHTMLClass = typeof TerminHTML;
type TerminHTMLModule = { TerminHTML: TerminHTMLClass };

export type BootstrapOptions = {
  className: string;
  importFromUrl: boolean;
};

export type BootstrapResult = {
  stopListener(): void;
  terminHTMLs: TerminHTML[];
};

const defaultClass = "terminhtml";
const defaultOptions: BootstrapOptions = {
  className: defaultClass,
  importFromUrl: true,
};

export async function bootstrapTerminHTMLsOnWindowLoad(
  options?: Partial<BootstrapOptions>
): Promise<void> {
  const { className, importFromUrl } = getOptions(options);
  const TerminHTML = await loadTerminHTML(importFromUrl);
  window.addEventListener("load", () => {
    createTerminHTMLs(className, TerminHTML);
  });
}

export async function bootstrapTerminHTMLs(
  options?: Partial<BootstrapOptions>
): Promise<BootstrapResult> {
  const { className, importFromUrl } = getOptions(options);
  const TerminHTML = await loadTerminHTML(importFromUrl);

  return createTerminHTMLs(className, TerminHTML);
}

function getOptions(options?: Partial<BootstrapOptions>): BootstrapOptions {
  return { ...defaultOptions, ...options };
}

/**
 * Get the TerminHTML class constructor. If importFromUrl is true, then
 * dynamically load from the latest major version of terminhtml-js via URL.
 * If importFromUrl is false, then use the local version in node_modules.
 */
function getTerminHTMLClass(importFromUrl = true): Promise<TerminHTMLClass> {
  if (importFromUrl) {
    // Dynamically load the latest major version of terminhtml-js, so that we can
    // update end users by only updating terminhtml-js.
    return import(
      /* @vite-ignore */
      terminHTMLJSUrl
    )
      .then(({ TerminHTML }: TerminHTMLModule) => TerminHTML)
      .catch(console.error) as Promise<TerminHTMLClass>;
  } else {
    return import(
      /* @vite-ignore */
      "terminhtml"
    )
      .then(({ TerminHTML }: TerminHTMLModule) => TerminHTML)
      .catch(console.error) as Promise<TerminHTMLClass>;
  }
}

async function loadTerminHTML(importFromUrl = true): Promise<TerminHTMLClass> {
  // Kick off loading of JS async
  const TerminHTMLPromise = getTerminHTMLClass(importFromUrl);
  // Kick off loading of CSS async
  loadTerminHTMLCSS();
  // Wait for JS to finish
  const TerminHTML = await TerminHTMLPromise;
  return TerminHTML;
}

function createTerminHTMLs(
  className: string,
  TerminHTML: TerminHTMLClass
): BootstrapResult {
  const elements = document.querySelectorAll<HTMLElement>(`.${className}`);
  const terminHTMLs: TerminHTML[] = [];
  for (const element of elements) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    const terminHTML: TerminHTML = new TerminHTML(element);
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
