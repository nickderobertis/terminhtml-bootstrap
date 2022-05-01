import TerminHTML from 'terminhtml';

export type BootstrapOptions = {
  class: string;
};

export type BootstrapResult = {
  stopListener(): void;
  terminHTMLs: TerminHTML[];
};

const defaultClass = 'terminhtml';
const defaultOptions: BootstrapOptions = {
  class: defaultClass,
};

export function bootstrapTerminHTMLs(
  options?: Partial<BootstrapOptions>
): BootstrapResult {
  const opts: BootstrapOptions = { ...defaultOptions, ...options };
  const className = opts.class;
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

  window.addEventListener('scroll', loadVisibleTermynals);
  const stopListener = () =>
    window.removeEventListener('scroll', loadVisibleTermynals);
  loadVisibleTermynals();
  return { stopListener, terminHTMLs };
}
