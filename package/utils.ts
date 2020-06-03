declare const uni: any;
export const error = (message: any) => {
  console.error("ztwx-http error:", message.toString());
};

export const warn = (message: string) => {
  console.warn("ztwx-http warn:", message);
};

export const isUni = (): boolean => !!uni;
