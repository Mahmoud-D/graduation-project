import { Card, CardContent } from "@/components/ui/card";

const steps = [
  {
    icon: "🔍",
    title: "اختر مطعمك",
    description: "تصفح مجموعة متنوعة من المطاعم واختر ما يناسبك",
  },
  {
    icon: "🍽️",
    title: "حدد طلبك",
    description: "اختر وجباتك المفضلة وأضفها إلى السلة",
  },
  {
    icon: "💳",
    title: "أتمم الدفع",
    description: "ادفع بسهولة باستخدام طريقة الدفع المفضلة لديك",
  },
  {
    icon: "🚀",
    title: "استلم طلبك",
    description: "استمتع بوجبتك الشهية في أسرع وقت",
  },
];

export default function HowItWorks() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-dark-shade mb-4">
            كيف يعمل التطبيق؟
          </h2>
          <p className="text-lg text-dark-shade/70">
            اطلب طعامك المفضل في 4 خطوات بسيطة
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <Card key={index} className="border-2 border-neutral hover:border-primary transition-colors">
              <CardContent className="pt-6 text-center">
                <div className="text-4xl mb-4">{step.icon}</div>
                <h3 className="text-xl font-semibold text-dark-shade mb-2">
                  {step.title}
                </h3>
                <p className="text-dark-shade/70">{step.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
} 