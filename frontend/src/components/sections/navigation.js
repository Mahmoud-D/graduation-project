import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";

const navLinks = [
  { name: "الرئيسية", href: "/" },
  { name: "المطاعم", href: "/restaurants" },
  { name: "العروض", href: "/offers" },
  { name: "من نحن", href: "/about" },
  { name: "اتصل بنا", href: "/contact" },
];

export default function Navigation() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-sm shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image
              src="/logo.png"
              alt="فود اكسبرس"
              width={40}
              height={40}
              className="mr-2"
              priority
            />
            <span className="text-xl font-bold text-dark-shade">فود اكسبرس</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-dark-shade/80 hover:text-dark-shade transition-colors px-3 py-2 rounded-md hover:bg-gray-100 cursor-pointer"
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-4">
            <Button variant="outline" size="sm" asChild className="hover:bg-gray-100 cursor-pointer">
              <Link href="/login">تسجيل الدخول</Link>
            </Button>
            <Button size="sm" asChild className="hover:bg-primary/90 cursor-pointer">
              <Link href="/register">إنشاء حساب</Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden hover:bg-gray-100 cursor-pointer"
            aria-label="Toggle menu"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="4" x2="20" y1="12" y2="12" />
              <line x1="4" x2="20" y1="6" y2="6" />
              <line x1="4" x2="20" y1="18" y2="18" />
            </svg>
          </Button>
        </div>
      </div>
    </nav>
  );
} 