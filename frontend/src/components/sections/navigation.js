"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useEffect, useState } from "react";

const navLinks = [
	{ name: "الرئيسية", href: "/" },
	{ name: "القائمة", href: "/menu" },
	{ name: "العروض", href: "/offers" },
	{ name: "من نحن", href: "/about" },
	{ name: "اتصل بنا", href: "/contact" },
];

export default function Navigation() {
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

	useEffect(() => {
		// Check for token in localStorage
		const token = localStorage.getItem("token");
		setIsLoggedIn(!!token);
	}, []);

	const handleLogout = () => {
		localStorage.removeItem("token");
		setIsLoggedIn(false);
		setIsMobileMenuOpen(false);
	};

	const toggleMobileMenu = () => {
		setIsMobileMenuOpen(!isMobileMenuOpen);
	};

	return (
		<nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-sm shadow-sm">
			<div className="container mx-auto px-4">
				<div className="flex items-center justify-between h-16">
					{/* Right Side: Logo */}
					<div className="flex items-center">
						<Link href="/" className="flex items-center">
							<Image
								src="/logo.webp"
								alt="مطعمنا"
								width={50}
								height={50}
								className="hover:opacity-80 transition-opacity"
								priority
							/>
						</Link>
					</div>

					{/* Center: Desktop Navigation Links - Hidden on mobile */}
					<div className="hidden md:flex items-center gap-6">
						{navLinks.map((link) => (
							<Link
								key={link.name}
								href={link.href}
								className="text-dark-shade/80 hover:text-dark-shade transition-colors px-3 py-2 rounded-md hover:bg-gray-100"
							>
								{link.name}
							</Link>
						))}
					</div>

					{/* Mobile: Center Hamburger Menu Button - Visible on mobile only */}
					<div className="md:hidden absolute left-1/2 transform -translate-x-1/2">
						<Button
							variant="ghost"
							size="icon"
							className="hover:bg-gray-100"
							onClick={toggleMobileMenu}
							aria-label="Toggle navigation menu"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="32"
								height="32"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
							>
								{isMobileMenuOpen ? (
									<>
										<line x1="18" y1="6" x2="6" y2="18" />
										<line x1="6" y1="6" x2="18" y2="18" />
									</>
								) : (
									<>
										<line x1="4" x2="20" y1="12" y2="12" />
										<line x1="4" x2="20" y1="6" y2="6" />
										<line x1="4" x2="20" y1="18" y2="18" />
									</>
								)}
							</svg>
						</Button>
					</div>

					{/* Left Side: Desktop Auth Buttons - Adjust position */}
					<div className="hidden md:flex items-center gap-4 mr-[40px]">
						{!isLoggedIn ? (
							<>
								<Button variant="outline" size="sm" asChild>
									<Link href="/login">تسجيل الدخول</Link>
								</Button>
								<Button size="sm" asChild>
									<Link href="/register">إنشاء حساب</Link>
								</Button>
							</>
						) : (
							<Button
								variant="ghost"
								size="sm"
								className="hover:bg-red-100 text-red-600"
								onClick={handleLogout}
							>
								تسجيل الخروج
							</Button>
						)}
					</div>

					{/* Empty div for consistent spacing - Now visible on all screens */}
					<div className="w-[40px]"></div>
				</div>

				{/* Mobile Menu Drawer */}
				<div
					className={`md:hidden ${
						isMobileMenuOpen ? "block" : "hidden"
					} pt-2 pb-4 border-t bg-white/95 backdrop-blur-sm`}
				>
					<div className="flex flex-col space-y-2">
						{navLinks.map((link) => (
							<Link
								key={link.name}
								href={link.href}
								className="text-dark-shade/80 hover:text-dark-shade px-4 py-3 rounded-md hover:bg-gray-100 transition-colors"
								onClick={() => setIsMobileMenuOpen(false)}
							>
								{link.name}
							</Link>
						))}

						{/* Mobile Auth Section */}
						<div className="px-4 pt-4 border-t border-gray-200">
							{!isLoggedIn ? (
								<div className="flex flex-col gap-3">
									<Button
										variant="outline"
										size="sm"
										asChild
										className="w-full"
									>
										<Link
											href="/login"
											onClick={() => setIsMobileMenuOpen(false)}
										>
											تسجيل الدخول
										</Link>
									</Button>
									<Button size="sm" asChild className="w-full">
										<Link
											href="/register"
											onClick={() => setIsMobileMenuOpen(false)}
										>
											إنشاء حساب
										</Link>
									</Button>
								</div>
							) : (
								<Button
									variant="ghost"
									size="sm"
									className="w-full hover:bg-red-100 text-red-600"
									onClick={handleLogout}
								>
									تسجيل الخروج
								</Button>
							)}
						</div>
					</div>
				</div>
			</div>
		</nav>
	);
}
