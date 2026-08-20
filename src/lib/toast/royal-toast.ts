import toast from "react-hot-toast";

export const royalToast = {
  // Keep the API stable, but use react-hot-toast defaults (no custom classes/icons).
  success: (message: string) => toast.success(message),
  error: (message: string) => toast.error(message),
  info: (message: string) => toast(message),
  unauthorized: (message: string) =>
    toast.error(message, {
      id: "unauthorized-access",
    }),
};
