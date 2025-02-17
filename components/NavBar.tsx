"use client";
import { Button } from "@/components/ui/button";
import CloseIcon from "@mui/icons-material/Close";
import MenuIcon from "@mui/icons-material/Menu";
import Link from "next/link";
import { useState } from "react";

import { usePathname } from 'next/navigation';

function Navbar() {
  const [isClick, setIsClick] = useState(false);
//   const router = useRouter(); // Hook to access the current route
  const pathname = usePathname()

  const toggleNavbar = () => {
    setIsClick(!isClick);
  };

  // List of navigation items for mapping
  const navItems = [
    { name: "Transactions", href: "/transactions" },
    { name: "Analytics", href: "/analytics" },
    { name: "Budget", href: "/budget" },
  ];

  return (
    <>
      <nav>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-lg">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Link
                  className="font-sans font-h bg-gradient-to-r from-[#4A72FF] via-[#5C53D1] to-[#712D99] bg-clip-text text-transparent"
                  href={"/"}
                >
                  MoneyScope 
                </Link>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="ml-4 flex items-center space-x-16">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`${
                      pathname === item.href
                        ? "underline decoration-2 underline-offset-8"
                        : ""
                    } hover:scale-110 transition-all`}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>

            <div className="md:hidden flex items-center">
              <Button
                onClick={toggleNavbar}
                variant={"secondary"}
                className="inline-flex items-center justify-center p-2 text-[#FFFFFF] hover:text-800 focus:outline-none bg-white  focus:ring-2 focus:ring-inset focus:ring-white"
              >
                {isClick ? (
                  <CloseIcon
                    color="warning"
                    fontSize="large"
                    className="text-4xl"
                  />
                ) : (
                  <MenuIcon
                    color="primary"
                    fontSize="large"
                    className="text-4xl"
                  />
                )}
              </Button>
            </div>
          </div>
        </div>
        {isClick && (
          <div className="md:hidden">
            <div className="px-2 pb-3 pt-1 space-y-3 flex flex-col items-center">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`${
                    pathname === item.href
                      ? "underline decoration-2 shadow-md "
                      : ""
                  } block hover:border hover:border-cyan-600 p-3 px-4 w-full text-center`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>
    </>
  );
}

export default Navbar;
