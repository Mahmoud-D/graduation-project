import {
  IconTrendingDown,
  IconTrendingUp,
  IconUsers,
  IconUserShield,
  type Icon,
} from "@tabler/icons-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// Props interface with custom card data
interface SectionCardsProps {
  adminCount?: number;
  userCount?: number;
  customCards?: CardData[];
}

// Define the data structure for a card
interface CardData {
  title: string;
  value: string | number;
  description: string;
  icon: Icon;
  trend?: {
    direction: "up" | "down";
    value: string;
  };
  footer: {
    title: string;
    description: string;
  };
}

export function SectionCards({
  adminCount = 0,
  userCount = 0,
  customCards = [],
}: SectionCardsProps) {
  // Default cards with dynamic count values
  const defaultCards: CardData[] = [
    {
      title: "عدد المسؤولين",
      value: adminCount,
      description: "المسؤولين",
      icon: IconUserShield,
      footer: {
        title: "مسؤولي النظام",
        description: "المستخدمون الذين لديهم إمكانية الوصول الكامل إلى النظام",
      },
    },
    {
      title: "المستخدمين المسجلين",
      value: userCount,
      description: "المستخدمين",
      icon: IconUsers,
      footer: {
        title: "حسابات العملاء النشطة",
        description: "مستخدمو المنصة المسجلون",
      },
    },
    // You can add more default cards here if needed
  ];

  // Combine default cards with any custom cards passed as props
  const allCards = [...defaultCards, ...customCards];

  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      {allCards.map((card, index) => (
        <Card key={index} className="@container/card">
          <CardHeader>
            <CardDescription>{card.title}</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {card.value}
            </CardTitle>
            <CardAction>
              <Badge variant="outline">
                <card.icon className="mr-1 h-3.5 w-3.5" />
                {card.description}
              </Badge>
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="flex gap-2 font-medium line-clamp-1">
              {card.footer.title} <card.icon className="size-4" />
            </div>
            <div className="text-muted-foreground">
              {card.footer.description}
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
