declare const uni: any;
export const error = (message: any) => {
  console.error("ztwx-http error:", message);
};

export const warn = (message: string) => {
  console.warn("ztwx-http warn:", message);
};

export const isUni = (): boolean => {
  try {
    return !!uni;
  } catch (e) {
    return false;
  }
};
