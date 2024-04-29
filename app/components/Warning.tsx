import { useRouter } from "next/navigation";
import type { WarningProps } from "../types";

export default function Warning({ setDecision }: WarningProps) {
  const router = useRouter();

  return (
    <>
      <span className="font-bold text-xl mx-auto">Warning</span>
      <div className="rounded-md pt-8 px-8 pb-4 max-w-full text-center border-solid border-2 border-blue-400 shadow-xl">
        <div>
          <p className="pb-5">
            Are you sure you want to remove all of your current expenses by
            setting a new budget?
          </p>
          <div className="flex justify-center">
            <button
              onClick={() => setDecision(true)}
              className=" bg-green-500 hover:bg-green-700 text-white font-bold py-2  m-1 px-6 rounded-full "
              type="submit"
            >
              Confirm
            </button>
            <button
              onClick={() => {
                setDecision(false);
                router.back();
              }}
              className=" bg-red-500 hover:bg-red-700 text-white font-bold py-2 m-1 px-6 rounded-full "
              type="button"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
