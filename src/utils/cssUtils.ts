export const css = (p: Partial<HTMLElement['style']>) => {
  return p as unknown as { [key: string]: string | undefined };
};
