import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useFramework } from "@/hooks/useLocalizedConstants";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Check,
  Lightbulb,
  Users,
  TrendingUp,
  Shield,
  Star,
} from "lucide-react";
import { Service } from "@/types/types";

const iconMap: Record<string, React.ReactNode> = {
  "check-circle": <Check className="h-8 w-8 text-orange-500" />,
  lightbulb: <Lightbulb className="h-8 w-8 text-orange-500" />,
  "users-2": <Users className="h-8 w-8 text-orange-500" />,
  "trending-up": <TrendingUp className="h-8 w-8 text-orange-500" />,
  shield: <Shield className="h-8 w-8 text-orange-500" />,
  star: <Star className="h-8 w-8 text-orange-500" />,
};

export const FrameworkSection: React.FC = () => {
  const { t } = useLanguage();
  const framework = useFramework();

  return (
    <section className="py-12 bg-slate-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-2">
            How We Do It - Competitive Edge
          </h2>
          <div className="w-24 h-1 bg-orange-500 mx-auto mb-4"></div>
          <p className="text-xl text-gray-600">Our Framework</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {framework.map((item: Service) => (
            <Card
              key={item.id}
              className="border-t-4 border-t-orange-500 hover:shadow-lg transition-shadow duration-300"
            >
              <CardHeader>
                <div className="flex items-center mb-2">
                  {iconMap[item.icon] || (
                    <div className="h-8 w-8 bg-orange-500 rounded-full"></div>
                  )}
                </div>
                <CardTitle className="text-xl font-bold text-orange-600">
                  {item.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-700 text-base">
                  {item.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FrameworkSection;
