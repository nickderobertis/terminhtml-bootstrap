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

export function bootstrapTerminHTMLsOnWindowLoad(
  options?: Partial<BootstrapOptions>
): void {
  const { className, importFromUrl } = getOptions(options);
  // Kick off loading of JS/CSS async
  const TerminHTMLPromise = loadTerminHTML(importFromUrl);
  // Immediately add the event listener, but don't fire bootstrap until JS/CSS is loaded
  console.log("adding event listener");
  window.addEventListener("load", () => {
    console.log("called on load");
    TerminHTMLPromise.then(TerminHTML => {
      console.log("doing bootstrap");
      createTerminHTMLs(className, TerminHTML);
    }).catch(console.error);
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
  console.log("import from url", importFromUrl);
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
    console.log("creating terminhtml for element", element.outerHTML);
    const terminHTML: TerminHTML = new TerminHTML(element);
    terminHTMLs.push(terminHTML);
  }
  let unloadedTerms = [...terminHTMLs];

  function loadVisibleTermynals() {
    console.log("trying to load terminals");
    unloadedTerms = unloadedTerms.filter(term => {
      if (term.container.getBoundingClientRect().top - innerHeight <= 0) {
        console.log("init terminal");
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
