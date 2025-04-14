import { Card, CardContent } from "@/components/ui/card";

const features = [
  {
    icon: "🚀",
    title: "توصيل سريع",
    description: "نضمن وصول طلبك في أسرع وقت ممكن مع تتبع مباشر للسائق",
  },
  {
    icon: "🍽️",
    title: "تنوع المطاعم",
    description: "اختر من بين مئات المطاعم المتنوعة في مدينتك",
  },
  {
    icon: "💳",
    title: "دفع آمن",
    description: "ادفع بسهولة وأمان باستخدام طرق الدفع المتعددة",
  },
  {
    icon: "🎁",
    title: "مكافآت وخصومات",
    description: "احصل على نقاط وخصومات حصرية مع كل طلب",
  },
  {
    icon: "📱",
    title: "تطبيق سهل",
    description: "واجهة سهلة الاستخدام تمكنك من الطلب بضغطة زر",
  },
  {
    icon: "⭐",
    title: "تقييم وتعليقات",
    description: "شارك تجربتك وتعرف على آراء العملاء الآخرين",
  },
];

export default function AppFeatures() {
  return (
    <section className="py-20 bg-dark-shade text-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">مميزات التطبيق</h2>
          <p className="text-lg text-white/70">
            كل ما تحتاجه في تطبيق واحد
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="bg-white/10 border-0 backdrop-blur-sm hover:bg-white/20 transition-colors"
            >
              <CardContent className="p-6 text-center">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-white/70">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Download App Section */}
        <div className="mt-16 text-center">
          <h3 className="text-2xl font-bold mb-6">
            حمل التطبيق الآن
          </h3>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-dark-shade px-8 py-3 rounded-lg hover:bg-white/90 transition-colors flex items-center justify-center gap-2">
              <span className="text-2xl">📱</span>
              App Store
            </button>
            <button className="bg-white text-dark-shade px-8 py-3 rounded-lg hover:bg-white/90 transition-colors flex items-center justify-center gap-2">
              <span className="text-2xl">🤖</span>
              Google Play
            </button>
          </div>
        </div>
      </div>
    </section>
  );
} 