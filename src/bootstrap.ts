import TerminHTML from "terminhtml";

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
  window.addEventListener("load", () => bootstrapTerminHTMLs(options));
}

export function bootstrapTerminHTMLs(
  options?: Partial<BootstrapOptions>
): BootstrapResult {
  loadTerminHTMLCSS();

  const opts: BootstrapOptions = { ...defaultOptions, ...options };
  const className = opts.class;
  return createTerminHTMLs(className);
}

function createTerminHTMLs(className: string): BootstrapResult {
  const elements = document.querySelectorAll<HTMLElement>(`.${className}`);
  const terminHTMLs: TerminHTML[] = [];
  for (const element of elements) {
    const terminHTML = new TerminHTML(element);
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
  loadVisibleTermynals();
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
    // TODO: update url to be main terminhtml once it is out of alpha
    link.href =
      "https://unpkg.com/terminhtml@1.0.0-alpha.14/dist/src/termynal.css";
    link.media = "all";
    head.appendChild(link);
  }
}
