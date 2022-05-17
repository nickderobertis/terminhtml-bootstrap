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
  window.addEventListener("load", () => {
    bootstrapTerminHTMLs(options).catch(console.error);
  });
}

export async function bootstrapTerminHTMLs(
  options?: Partial<BootstrapOptions>
): Promise<BootstrapResult> {
  loadTerminHTMLCSS();

  const opts: BootstrapOptions = { ...defaultOptions, ...options };
  const { className, importFromUrl } = opts;
  return await createTerminHTMLs(className, importFromUrl);
}

/**
 * Get the TerminHTML class constructor. If importFromUrl is true, then
 * dynamically load from the latest major version of terminhtml-js via URL.
 * If importFromUrl is false, then use the local version in node_modules.
 */
function getTerminHTMLClass(importFromUrl = true): Promise<TerminHTMLClass> {
  if (importFromUrl) {
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

async function createTerminHTMLs(
  className: string,
  importFromUrl: boolean
): Promise<BootstrapResult> {
  // Dynamically load the latest major version of terminhtml-js, so that we can
  // update end users by only updating terminhtml-js.
  const TerminHTML = await getTerminHTMLClass(importFromUrl);
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
