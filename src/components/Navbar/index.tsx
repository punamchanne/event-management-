"use client";

import { IconMenu3 } from "@tabler/icons-react";
import Link from "next/link";
import ThemeToggler from "./ThemeToggler";
import { usePathname } from "next/navigation";

export default function () {
  // getting the current path
  const currentPath = usePathname();
  const links = [
    { name: "About", href: "/#about" },
    { name: "Features", href: "/#features" },
    { name: "Contact Us", href: "/#contact" },
  ];
  return (
    <div
      className={`navbar bg-background/80 backdrop-blur-lg border-b border-border Orbitron lg:px-10 text-base-content ${
        currentPath === "/" ? "fixed top-0 left-0 right-0 z-50" : ""
      }`}
    >
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
            <IconMenu3 size={24} />
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
          >
            {links.map((link) => (
              <li key={link.name}>
                <Link href={link.href}>{link.name}</Link>
              </li>
            ))}
          </ul>
        </div>
        <Link href="/" className="space-x-3 flex items-center">
          <div className="flex flex-col items-start gap-1">
            <div className="flex items-center gap-[2px]">
              <img
                className="w-8 h-8 mr-2"
                src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/logo.svg"
                alt="logo"
              />
              <span className="font-bold text-lg lg:text-2xl">Opportune</span>
              <span className="text-sm text-base-content/70 italic hidden lg:block">
                v1.0
              </span>
            </div>
            <hr className="w-full border border-base-content hidden lg:block" />
            <span className="text-sm text-base-content/70 italic hidden lg:block">
              Your Gateway to Opportunities
            </span>
          </div>
        </Link>
      </div>
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">
          {links.map((link) => (
            <li key={link.name}>
              <Link href={link.href} className="text-base font-semibold">
                {link.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <div className="navbar-end gap-2">
        <ThemeToggler />
        <Link href="/register" className="btn btn-secondary btn-outline">
          Sign Up
        </Link>
        <Link href="/login" className="btn btn-accent">
          Login
        </Link>
      </div>
    </div>
  );
}
