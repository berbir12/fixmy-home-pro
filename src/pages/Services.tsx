import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ServiceCard } from "@/components/ServiceCard";
import { ArrowLeft, AirVent, WashingMachine, Tv, Refrigerator, Microwave, Utensils } from "lucide-react";

const serviceCategories = [
  {
    id: "ac",
    title: "Air Conditioning",
    description: "AC installation, repair & maintenance",
    icon: <AirVent className="w-8 h-8 text-primary" />,
    services: ["Installation", "Repair", "Cleaning", "Gas Refill", "Maintenance"]
  },
  {
    id: "washing-machine",
    title: "Washing Machine",
    description: "All washing machine services",
    icon: <WashingMachine className="w-8 h-8 text-primary" />,
    services: ["Installation", "Repair", "Cleaning", "Drum Replacement", "Motor Repair"]
  },
  {
    id: "tv",
    title: "Television",
    description: "TV mounting, repair & setup",
    icon: <Tv className="w-8 h-8 text-primary" />,
    services: ["Wall Mounting", "Screen Repair", "Sound Issues", "Smart TV Setup"]
  },
  {
    id: "refrigerator",
    title: "Refrigerator",
    description: "Fridge repair & maintenance",
    icon: <Refrigerator className="w-8 h-8 text-primary" />,
    services: ["Cooling Issues", "Door Seal", "Compressor", "Ice Maker", "Cleaning"]
  },
  {
    id: "microwave",
    title: "Microwave",
    description: "Microwave repair & installation",
    icon: <Microwave className="w-8 h-8 text-primary" />,
    services: ["Not Heating", "Door Repair", "Installation", "Turntable Issues"]
  },
  {
    id: "dishwasher",
    title: "Dishwasher",
    description: "Dishwasher installation & repair",
    icon: <Utensils className="w-8 h-8 text-primary" />,
    services: ["Installation", "Not Draining", "Not Cleaning", "Leak Repair"]
  }
];

export default function Services() {
  const navigate = useNavigate();

  const handleServiceSelect = (serviceId: string) => {
    navigate(`/service/${serviceId}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 bg-background/95 backdrop-blur-sm border-b border-border z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => navigate("/")}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-2xl font-bold text-foreground">Choose Your Service</h1>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {serviceCategories.map((category) => (
            <ServiceCard
              key={category.id}
              icon={category.icon}
              title={category.title}
              description={category.description}
              services={category.services}
              onClick={() => handleServiceSelect(category.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}