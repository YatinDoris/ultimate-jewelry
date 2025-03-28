import { toast } from "react-toastify";

const toastOptions = {
  position: "top-right",
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: "light",
};

// convenience methods
function success(message) {
  toast.success(message, toastOptions);
}

function error(message) {
  toast.error(message, toastOptions);
}

function info(message) {
  toast.info(message, toastOptions);
}

function warn(message) {
  toast.warn(message, toastOptions);
}
function custom(message, option = {}) {
  toast(message, option);
}

export const toasterService = {
  success,
  error,
  info,
  warn,
  custom,
};
