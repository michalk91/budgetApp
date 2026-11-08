"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import Button from "./Button";

type ConfirmOptions = {
  title: string;
  message?: string;
  confirmLabel?: string;
};

type Confirm = (options: ConfirmOptions) => Promise<boolean>;

const ConfirmContext = createContext<Confirm | null>(null);

// Resolves to true only when the user explicitly confirms;
// Cancel, Esc and clicking the backdrop all resolve to false.
export function ConfirmProvider({ children }: { children: React.ReactNode }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const resolveRef = useRef<((confirmed: boolean) => void) | null>(null);
  const [options, setOptions] = useState<ConfirmOptions | null>(null);

  const confirm = useCallback<Confirm>((nextOptions) => {
    resolveRef.current?.(false);
    setOptions(nextOptions);

    return new Promise((resolve) => {
      resolveRef.current = resolve;
    });
  }, []);

  useEffect(() => {
    if (options && !dialogRef.current?.open) dialogRef.current?.showModal();
  }, [options]);

  const settle = (confirmed: boolean) => {
    resolveRef.current?.(confirmed);
    resolveRef.current = null;
    dialogRef.current?.close();
  };

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}
      <dialog
        ref={dialogRef}
        aria-labelledby="confirm-dialog-title"
        onClose={() => {
          settle(false);
          setOptions(null);
        }}
        onClick={(e) => {
          if (e.target === e.currentTarget) settle(false);
        }}
        className="m-auto w-[calc(100%-2rem)] max-w-md rounded-lg bg-surface text-fg text-center shadow-xl backdrop:bg-black/50"
      >
        {/* Padding lives here so a click on the dialog element itself means a backdrop click. */}
        {options && (
          <div className="p-8">
            <h2 id="confirm-dialog-title" className="text-xl font-bold">
              {options.title}
            </h2>
            {options.message && (
              <p className="mt-3 text-fg-muted">{options.message}</p>
            )}
            <div className="mt-6 flex flex-wrap justify-center">
              <Button
                type="button"
                handleClick={() => settle(false)}
                additionalStyles="bg-blue-500 hover:bg-blue-700"
              >
                Cancel
              </Button>
              <Button
                type="button"
                handleClick={() => settle(true)}
                additionalStyles="bg-red-600 hover:bg-red-800"
              >
                {options.confirmLabel ?? "Delete"}
              </Button>
            </div>
          </div>
        )}
      </dialog>
    </ConfirmContext.Provider>
  );
}

export const useConfirm = () => {
  const confirm = useContext(ConfirmContext);

  if (!confirm) throw Error("useConfirm must be used within ConfirmProvider");

  return confirm;
};
