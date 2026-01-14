"use client";

import { Toast } from "./toast";
import { useToastStore } from "@/stores";

export const ToastContainer = () => {
  const { toasts, hideToast } = useToastStore();

  return (
    <>
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          show={true}
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
          onClose={() => hideToast(toast.id)}
        />
      ))}
    </>
  );
};
