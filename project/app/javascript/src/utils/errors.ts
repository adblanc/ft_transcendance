import { displayToast } from "./toast";

export const mapServerErrors = (errors: Record<string, string[]>) => {
  return Object.keys(errors).map((key) => `${key} ${errors[key].join(",")}`);
};

export const displayError = (error: string) => {
  displayToast({ text: error }, "error");
};

export const displayErrors = (error: string[]) => {
  error.forEach((err) => displayError(err));
};
