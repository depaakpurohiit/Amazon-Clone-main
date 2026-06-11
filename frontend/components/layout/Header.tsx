"use client";

import { useCart } from "@/context/CartContext";
import { isPrivilegedRole, normalizeRole } from "@/lib/role";
import { ChevronDown, Menu, Search, ShoppingCart, X } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState, type FormEvent } from "react";
import { Button } from "../ui/button";
import ConfirmDialog from "../ui/ConfirmDialog";
import LogoutLoader from "../ui/LogoutLoader";

export default function Header() {
  const { cart, authUser, isAuthenticated, logout } = useCart();
  const role = normalizeRole(authUser?.role);
  const isRoleAccount = isPrivilegedRole(authUser?.role);
  const roleProfilePath = role === "SELLER" ? "/seller/profile" : role === "ADMIN" ? "/admin/dashboard" : "/profile";
  const cartCount =
    cart?.reduce((total, item) => total + item.quantity, 0) || 0;
  const [mounted, setMounted] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    setSearchQuery(searchParams.get("q") ?? "");
  }, [searchParams]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  const toggleMobileMenu = useCallback(() => {
    setIsMobileOpen((prev) => !prev);
  }, []);

  const closeMobileMenu = useCallback(() => {
    setIsMobileOpen(false);
  }, []);

  const isActivePath = (path: string) => pathname === path;

  const navItems = isRoleAccount ? [] : [{ href: "/contact", label: "Contact" }];

  const handleSearchSubmit = (e: FormEvent) => {
    e.preventDefault();
    const q = searchQuery.trim();
    router.push(q ? `/?q=${encodeURIComponent(q)}` : "/");
    setIsSearchOpen(false);
  };

  const handleLogout = () => {
    setShowConfirm(true);
  };

  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const confirmLogout = async () => {
    setShowConfirm(false);
    setIsLoggingOut(true);
    try {
      await logout();
    } finally {
      setIsLoggingOut(false);
      router.replace("/login");
    }
  };

  return (
    <>
      <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/95 backdrop-blur-xl border-b border-gray-200 shadow-lg"
          : "bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm"
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-8 lg:space-x-12">
            <Link
              className="text-2xl tracking-tight text-gray-900 hover:text-gray-700 transition-colors"
              href={isRoleAccount ? roleProfilePath : "/"}
              aria-label={isRoleAccount ? "Go to profile" : "Go to home page"}
            >
              Trade <span className="text-primary">Hive</span>
            </Link>

            <nav
              className="hidden md:flex items-center space-x-1"
              role="navigation"
              aria-label="Main navigation"
            >
              {navItems.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className={`relative py-2 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActivePath(href)
                      ? "bg-orange-100 shadow-md"
                      : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                  aria-current={isActivePath(href) ? "page" : undefined}
                >
                  {label}
                </Link>
              ))}
            </nav>
          </div>

          {!isRoleAccount && (
            <div className="hidden lg:flex flex-1 max-w-md mx-8">
              <form className="relative w-full" onSubmit={handleSearchSubmit}>
                <input
                  type="search"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
                  aria-label="Search products"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              </form>
            </div>
          )}

          <div className="flex items-center space-x-2 sm:space-x-4">
            {!isRoleAccount && (
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="lg:hidden p-2 rounded-full hover:bg-gray-100 transition-colors"
                aria-label="Search"
              >
                <Search className="h-5 w-5 text-gray-700" />
              </button>
            )}

            {!isRoleAccount && (
              <button
                onClick={toggleMobileMenu}
                className="md:hidden p-2 rounded-full hover:bg-gray-100 transition-colors"
                aria-label="Toggle navigation menu"
                aria-expanded={isMobileOpen ? "true" : "false"}
              >
                {isMobileOpen ? (
                  <X className="h-6 w-6 text-gray-700" />
                ) : (
                  <Menu className="h-6 w-6 text-gray-700" />
                )}
              </button>
            )}

            {!isRoleAccount && (
              <Link
                href="/cart"
                className="relative p-2 rounded-full hover:bg-gray-100 transition-all duration-200 group"
                aria-label={`Shopping cart with ${cartCount} items`}
              >
                <ShoppingCart className="h-6 w-6 text-gray-700 group-hover:text-gray-900 transition-colors" />
                {cartCount > 0 && (
                  <span
                    className="absolute -top-1 -right-1 bg-primary text-white text-xs font-bold rounded-full min-w-[20px] h-5 flex items-center justify-center px-1"
                    aria-label={`${cartCount} items in cart`}
                  >
                    {cartCount > 99 ? "99+" : cartCount}
                  </span>
                )}
              </Link>
            )}

            <div className="hidden sm:flex items-center space-x-2">
              {mounted && isAuthenticated ? (
                isRoleAccount ? (
                  <>
                    <Button variant="ghost" size="sm" className="text-sm" asChild>
                      <Link href={roleProfilePath}>Profile</Link>
                    </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-sm"
                        onClick={handleLogout}
                      >
                        Logout
                      </Button>
                  </>
                ) : (
                <>
                  {authUser?.role === "ADMIN" && (
                    <Button variant="ghost" size="sm" className="text-sm" asChild>
                      <Link href="/admin/dashboard">Admin</Link>
                    </Button>
                  )}
                  {authUser?.role === "SELLER" && (
                    <Button variant="ghost" size="sm" className="text-sm" asChild>
                      <Link href="/seller/dashboard">Seller</Link>
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-sm"
                    asChild
                  >
                    <Link href="/profile">Hi, {authUser?.name}</Link>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-sm"
                    onClick={handleLogout}
                  >
                    Logout
                  </Button>
                </>
                )
              ) : (
                <>
                  <Button variant="ghost" size="sm" className="text-sm" asChild>
                    <Link href="/login">Sign In</Link>
                  </Button>
                  <details className="relative hidden sm:block">
                    <summary className="list-none flex cursor-pointer items-center gap-1 rounded-md bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground shadow-sm transition hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/60">
                      Sign Up
                      <ChevronDown className="h-4 w-4" />
                    </summary>
                    <div className="absolute right-0 z-50 mt-2 w-48 rounded-xl border border-gray-200 bg-white p-2 shadow-xl">
                      <Link
                        href="/signup"
                        className="block rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                      >
                        Customer account
                      </Link>
                      <Link
                        href="/signup?accountType=seller"
                        className="block rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                      >
                        Seller account
                      </Link>
                    </div>
                  </details>
                </>
              )}
            </div>
          </div>
        </div>

        {!isRoleAccount && isSearchOpen && (
          <div className="lg:hidden mt-4 animate-in slide-in-from-top duration-200">
            <form className="relative" onSubmit={handleSearchSubmit}>
              <input
                type="search"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                aria-label="Search products"
                autoFocus
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            </form>
          </div>
        )}

        {!isRoleAccount && isMobileOpen && (
          <nav
            className="md:hidden mt-4 animate-in slide-in-from-top duration-200"
            role="navigation"
            aria-label="Mobile navigation"
          >
            <div className="flex flex-col space-y-3 pb-4 border-b border-gray-200">
              {navItems.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={closeMobileMenu}
                  className={`text-sm font-medium py-2 px-3 rounded-lg transition-all ${
                    isActivePath(href)
                      ? "bg-orange-100"
                      : "text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                  aria-current={isActivePath(href) ? "page" : undefined}
                >
                  {label}
                </Link>
              ))}
            </div>

            <div className="flex flex-col space-y-3 pt-4 sm:hidden">
              {mounted && isAuthenticated ? (
                isRoleAccount ? (
                  <>
                    <Button className="w-full text-sm" variant="ghost" asChild>
                      <Link href={roleProfilePath} onClick={closeMobileMenu}>Profile</Link>
                    </Button>
                      <Button
                        className="w-full text-sm"
                        variant="outline"
                        onClick={() => {
                          setShowConfirm(true);
                          closeMobileMenu();
                        }}
                    >
                      Logout
                    </Button>
                  </>
                ) : (
                <>
                  {authUser?.role === "ADMIN" && (
                    <Button className="w-full text-sm" variant="ghost" asChild>
                      <Link href="/admin/dashboard" onClick={closeMobileMenu}>Admin Dashboard</Link>
                    </Button>
                  )}
                  {authUser?.role === "SELLER" && (
                    <Button className="w-full text-sm" variant="ghost" asChild>
                      <Link href="/seller/dashboard" onClick={closeMobileMenu}>Seller Dashboard</Link>
                    </Button>
                  )}
                    <Button
                      className="w-full text-sm"
                      variant="outline"
                      onClick={() => {
                        setShowConfirm(true);
                        closeMobileMenu();
                      }}
                  >
                    Logout
                  </Button>
                </>
                )
              ) : (
                <>
                  <Button variant="outline" className="w-full text-sm" asChild>
                    <Link href="/login" onClick={closeMobileMenu}>
                      Sign In
                    </Link>
                  </Button>
                  <Button className="w-full text-sm" variant="default" asChild>
                    <Link href="/signup" onClick={closeMobileMenu}>
                      Customer Sign Up
                    </Link>
                  </Button>
                  <Button className="w-full text-sm" variant="outline" asChild>
                    <Link href="/signup?accountType=seller" onClick={closeMobileMenu}>
                      Seller Sign Up
                    </Link>
                  </Button>
                </>
              )}
            </div>
          </nav>
        )}
      </div>
    </header>
      <ConfirmDialog
        open={showConfirm}
        title="Are you sure you want to log out?"
        description="You will be signed out of your account."
        confirmLabel="Log out"
        cancelLabel="Cancel"
        onConfirm={confirmLogout}
        onCancel={() => setShowConfirm(false)}
      />
      {isLoggingOut && <LogoutLoader message="Logging out…" />}
    </>
  );
}
