import { toast } from "react-toastify";

type ThunkResult = {
  meta: { requestStatus: "fulfilled" | "rejected" };
  payload?: unknown;
};

// Some thunks return undefined (e.g. missing permissions) without rejecting,
// so only a fulfilled result with a payload counts as a success.
export const isFulfilledWithPayload = (result: ThunkResult) =>
  result.meta.requestStatus === "fulfilled" && result.payload != null;

// Shows a toast for a finished thunk and tells whether it succeeded.
export const reportThunkResult = (
  result: ThunkResult,
  messages: { success: string; error: string }
) => {
  const succeeded = isFulfilledWithPayload(result);

  if (succeeded) toast.success(messages.success);
  else toast.error(messages.error);

  return succeeded;
};
