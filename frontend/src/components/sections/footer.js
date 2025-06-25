import Link from "next/link";

const footerLinks = {
  company: [
    { name: "من نحن", href: "/about" },
    { name: "اتصل بنا", href: "/contact" },
    { name: "القائمة", href: "/menu" },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-primary text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div>
            <h3 className="text-2xl font-bold mb-6">مطعمنا</h3>
            <p className="text-white/90 mb-4">
              خدمة توصيل الطعام الأسرع والأفضل في مدينتك
            </p>
          </div>
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
        </div>

        <div className="text-center text-white/80 text-sm mt-8">
          © {new Date().getFullYear()} مطعمنا. جميع الحقوق محفوظة
        </div>
      </div>
    </footer>
  );
}
