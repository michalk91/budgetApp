import { usePathname } from "next/navigation";

export const useIDfromPathname = () => {
  const pathname = usePathname();

  const regExp = /[^\/]+$/;
  return pathname.match(regExp)![0];
};
