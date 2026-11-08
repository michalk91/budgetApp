import { cn } from "../utils/cn";

type NavItemProps = {
  children: React.ReactNode;
  className?: string;
};

export default function NavItem({ children, className }: NavItemProps) {
  return (
    <li className={cn("mr-6 max-lg:p-6 max-md:mr-0", className)}>{children}</li>
  );
}
