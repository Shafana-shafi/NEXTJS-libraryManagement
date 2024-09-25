// global.d.ts
interface Window {
  Calendly: {
    initInlineWidget: (options: {
      url: string;
      parentElement: HTMLElement;
      prefill?: { name?: string; email?: string };
    }) => void;
  };
}
