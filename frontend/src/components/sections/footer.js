import Link from "next/link";
import { Button } from "@/components/ui/button";

const footerLinks = {
  company: [
    { name: "من نحن", href: "/about" },
    { name: "اتصل بنا", href: "/contact" },
    { name: "الوظائف", href: "/careers" },
    { name: "القائمة", href: "/menu" },
  ],
  legal: [
    { name: "الشروط والأحكام", href: "/terms" },
    { name: "سياسة الخصوصية", href: "/privacy" },
    { name: "سياسة الاسترجاع", href: "/refund" },
  ],
  help: [
    { name: "الأسئلة الشائعة", href: "/faq" },
    { name: "الدعم الفني", href: "/support" },
    { name: "دليل الاستخدام", href: "/guide" },
  ],
};

const socialLinks = [
  { name: "تويتر", href: "#", icon: "𝕏" },
  { name: "فيسبوك", href: "#", icon: "f" },
  { name: "انستغرام", href: "#", icon: "📸" },
  { name: "يوتيوب", href: "#", icon: "▶️" },
];

export default function Footer() {
  return (
    <footer className="bg-primary text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Company Info */}
          <div>
            <h3 className="text-2xl font-bold mb-6">مطعمنا</h3>
            <p className="text-white/90 mb-4">
              خدمة توصيل الطعام الأسرع والأفضل في مدينتك
            </p>
            <div className="flex gap-4">
              {socialLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                >
                  {link.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="font-semibold mb-4 text-white">الشركة</h4>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-white/90 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h4 className="font-semibold mb-4 text-white">معلومات قانونية</h4>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-white/90 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help Links */}
          <div>
            <h4 className="font-semibold mb-4 text-white">المساعدة</h4>
            <ul className="space-y-2">
              {footerLinks.help.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-white/90 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="text-center text-white/80 text-sm mt-8">
          © {new Date().getFullYear()} مطعمنا. جميع الحقوق محفوظة
        </div>
      </div>
    </footer>
  );
} 