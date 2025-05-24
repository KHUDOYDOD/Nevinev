import React from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckIcon } from "lucide-react";
import { cn, formatCurrency } from "@/lib/utils";
import { TariffCardProps } from "@/types";
import { Badge } from "@/components/ui/badge";

export function TariffCard({ plan, isPopular = false, onSelect }: TariffCardProps) {
  const { t } = useTranslation();
  
  const features = [
    t("tariffs.dailyPayments"),
    t("tariffs.withdrawAnytime"),
    t("tariffs.refProgram"),
  ];
  
  // Add premium and elite specific features
  if (plan.name === t("tariffs.premium") || plan.name === t("tariffs.elite")) {
    features.push(t("tariffs.prioritySupport"));
  }
  
  if (plan.name === t("tariffs.elite")) {
    features.push(t("tariffs.enhancedRefBonus"));
    features.push(t("tariffs.personalManager"));
  }

  return (
    <Card 
      className={cn(
        "scale-hover overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-2",
        isPopular && "border-primary shadow-lg relative transform scale-105 z-10 -translate-y-4"
      )}
    >
      {isPopular && (
        <div className="absolute top-0 inset-x-0">
          <Badge variant="default" className="absolute top-0 right-0 m-2">
            {t("tariffs.popular")}
          </Badge>
        </div>
      )}
      
      <CardHeader className={cn(
        "p-6 bg-gray-50 border-b border-gray-100",
        isPopular && "bg-primary/5 border-primary/10 pt-8"
      )}>
        <div className="text-lg text-primary font-medium mb-1">{plan.name}</div>
        <div className="flex items-baseline">
          <span className="text-4xl font-bold mr-2">{plan.dailyInterestRate}%</span>
          <span className="text-gray-500">{t("tariffs.perDay")}</span>
        </div>
      </CardHeader>
      
      <CardContent className="p-6">
        <ul className="space-y-3 mb-8">
          <li className="flex items-center">
            <CheckIcon className="text-green-500 mr-3 h-5 w-5" />
            <span>
              {t("tariffs.minInvestment")}: <strong>{formatCurrency(plan.minAmount)}</strong>
            </span>
          </li>
          {features.map((feature, index) => (
            <li key={index} className="flex items-center">
              <CheckIcon className="text-green-500 mr-3 h-5 w-5" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
        
        <Button
          onClick={() => onSelect(plan)}
          variant={isPopular ? "default" : "outline"}
          className={cn(
            "w-full py-3 font-medium rounded-lg",
            isPopular && "shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30"
          )}
        >
          {t("tariffs.selectTariff")}
        </Button>
      </CardContent>
    </Card>
  );
}

export default function TariffCards({ plans, onSelectPlan }: { 
  plans: Array<any>,
  onSelectPlan: (plan: any) => void
}) {
  const { t } = useTranslation();
  
  // Customize plan names
  const localizedPlans = plans.map(plan => {
    let name = plan.name;
    if (plan.name === "Basic") name = t("tariffs.basic");
    if (plan.name === "Premium") name = t("tariffs.premium");
    if (plan.name === "Elite") name = t("tariffs.elite");
    return { ...plan, name };
  });

  return (
    <div className="grid md:grid-cols-3 gap-8">
      {localizedPlans.map((plan, index) => (
        <TariffCard 
          key={plan.id} 
          plan={plan} 
          isPopular={index === 1} // Premium plan is popular
          onSelect={onSelectPlan}
        />
      ))}
    </div>
  );
}
