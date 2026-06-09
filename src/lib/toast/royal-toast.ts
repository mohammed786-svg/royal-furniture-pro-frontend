import toast from "react-hot-toast";

const base = {
  className: "royal-toast",
};

export const royalToast = {
  success: (message: string) =>
    toast.success(message, {
      ...base,
      icon: "✓",
    }),
  error: (message: string) =>
    toast.error(message, {
      ...base,
      icon: "!",
    }),
  info: (message: string) =>
    toast(message, {
      ...base,
      icon: "ℹ",
    }),
  unauthorized: (message: string) =>
    toast.error(message, {
      ...base,
      icon: "!",
      id: "unauthorized-access",
    }),
};
