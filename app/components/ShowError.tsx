import type { ShowErrorProps } from "../types";

export default function ShowError({ message }: ShowErrorProps) {
  return (
    <div className="p-10 bg-white mt-10 m-x-auto text-center rounded-lg shadow-xl">
      <span className="text-2xl">{message}</span>
    </div>
  );
}
