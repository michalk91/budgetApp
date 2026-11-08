"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import NavItem from "./NavItem";
import { cn } from "../utils/cn";

type NavLinkProps = {
  href: string;
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "default" | "danger";
  className?: string;
};

export default function NavLink({
  href,
  children,
  onClick,
  variant = "default",
  className,
}: NavLinkProps) {
  const pathname = usePathname();

  const colorClass =
    variant === "danger"
      ? "text-link-danger hover:text-link-danger-active"
      : `${
          pathname === href ? "text-link-active" : "text-link"
        } hover:text-link-active`;

  return (
    <NavItem>
      <Link
        href={href}
        onClick={onClick}
        className={cn(colorClass, "text-2xl max-md:text-xl", className)}
      >
        {children}
      </Link>
    </NavItem>
  );
}
