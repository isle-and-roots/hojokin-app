"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { AlertTriangle } from "lucide-react";

interface ConfirmOptions {
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "danger" | "default";
}

interface ConfirmContextValue {
  confirm: (options: ConfirmOptions) => Promise<boolean>;
}

const ConfirmContext = createContext<ConfirmContextValue | null>(null);

export function useConfirm(): ConfirmContextValue {
  const ctx = useContext(ConfirmContext);
  if (!ctx) throw new Error("useConfirm must be used within ConfirmProvider");
  return ctx;
}

export function ConfirmProvider({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const [state, setState] = useState<{
    options: ConfirmOptions;
    resolve: (v: boolean) => void;
  } | null>(null);

  useEffect(() => setMounted(true), []);

  const confirm = useCallback((options: ConfirmOptions): Promise<boolean> => {
    return new Promise<boolean>((resolve) => {
      setState({ options, resolve });
    });
  }, []);

  const handleConfirm = () => {
    state?.resolve(true);
    setState(null);
  };

  const handleCancel = () => {
    state?.resolve(false);
    setState(null);
  };

  return (
    <ConfirmContext.Provider value={{ confirm }}>
      {children}
      {mounted &&
        state &&
        createPortal(
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
              className="absolute inset-0 bg-black/40"
              onClick={handleCancel}
            />
            <div className="relative bg-card rounded-xl border border-border shadow-xl p-6 max-w-md w-full mx-4 animate-in fade-in zoom-in-95 duration-200">
              <div className="flex items-start gap-4">
                {state.options.variant === "danger" && (
                  <div className="shrink-0 flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                  </div>
                )}
                <div className="flex-1">
                  <h3 className="text-lg font-semibold">
                    {state.options.title}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {state.options.message}
                  </p>
                </div>
              </div>
              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 text-sm rounded-lg border border-border hover:bg-accent transition-colors"
                >
                  {state.options.cancelLabel ?? "キャンセル"}
                </button>
                <button
                  onClick={handleConfirm}
                  className={`px-4 py-2 text-sm rounded-lg font-medium transition-colors ${
                    state.options.variant === "danger"
                      ? "bg-red-600 text-white hover:bg-red-700"
                      : "bg-primary text-primary-foreground hover:bg-primary/90"
                  }`}
                >
                  {state.options.confirmLabel ?? "確認"}
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </ConfirmContext.Provider>
  );
}
