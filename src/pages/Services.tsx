import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ServiceCard } from "@/components/ServiceCard";
import { 
  ArrowLeft, 
  AirVent, 
  WashingMachine, 
  Tv, 
  Refrigerator, 
  Microwave, 
  Utensils,
  Monitor,
  Laptop,
  Gamepad2,
  Download,
  Wifi,
  Signal,
  Server,
  Home,
  Zap,
  Building,
  Camera,
  Shield,
  Globe,
  ShoppingCart,
  TrendingUp,
  Video,
  Mic,
  Radio,
  Broadcast,
  Palette,
  Glasses,
  Smartphone,
  Database,
  Cloud,
  Printer,
  Ruler,
  Phone,
  Drone,
  Cube,
  Store,
  Activity,
  GraduationCap
} from "lucide-react";

const serviceCategories = [
  // Computer & Tech Services
  {
    id: "computer-services",
    title: "Computer Services",
    description: "Comprehensive computer diagnostics, repair & setup",
    icon: <Monitor className="w-8 h-8 text-primary" />,
    services: ["Computer Diagnostics & Repair", "Laptop Repair & Maintenance", "Gaming PC Build & Setup", "Software Installation & Training"]
  },
  {
    id: "network-services",
    title: "Network Services",
    description: "Professional network installation & optimization",
    icon: <Wifi className="w-8 h-8 text-primary" />,
    services: ["Network Installation & Setup", "WiFi Network Optimization", "Server Setup & Maintenance"]
  },
  {
    id: "smart-home",
    title: "Smart Home",
    description: "Complete smart home & office automation",
    icon: <Home className="w-8 h-8 text-primary" />,
    services: ["Smart Home Setup", "IoT Device Integration", "Smart Office Setup"]
  },
  {
    id: "security-services",
    title: "Security Services",
    description: "Professional security & cybersecurity solutions",
    icon: <Shield className="w-8 h-8 text-primary" />,
    services: ["Security Camera Installation", "Cybersecurity Assessment"]
  },
  {
    id: "web-digital",
    title: "Web & Digital",
    description: "Professional web development & digital services",
    icon: <Globe className="w-8 h-8 text-primary" />,
    services: ["Website Development & Hosting", "E-commerce Platform Setup", "Digital Marketing Setup"]
  },
  {
    id: "creative-services",
    title: "Creative Services",
    description: "Professional creative & media setup",
    icon: <Video className="w-8 h-8 text-primary" />,
    services: ["Video Editing Setup", "Audio Recording Setup", "Podcast Studio Setup", "Live Streaming Setup", "Photography Workstation", "Digital Art Setup"]
  },
  {
    id: "entertainment",
    title: "Entertainment",
    description: "Home theater & entertainment systems",
    icon: <Tv className="w-8 h-8 text-primary" />,
    services: ["Home Theater Setup", "Virtual Reality Setup"]
  },
  {
    id: "mobile-services",
    title: "Mobile Services",
    description: "Smartphone & tablet repair services",
    icon: <Smartphone className="w-8 h-8 text-primary" />,
    services: ["Mobile Device Repair"]
  },
  {
    id: "data-services",
    title: "Data Services",
    description: "Data backup, recovery & cloud solutions",
    icon: <Database className="w-8 h-8 text-primary" />,
    services: ["Data Backup & Recovery", "Cloud Storage Setup"]
  },
  {
    id: "office-equipment",
    title: "Office Equipment",
    description: "Professional office equipment setup",
    icon: <Printer className="w-8 h-8 text-primary" />,
    services: ["Printer Setup & Troubleshooting"]
  },
  {
    id: "engineering",
    title: "Engineering",
    description: "Professional engineering workstation setup",
    icon: <Ruler className="w-8 h-8 text-primary" />,
    services: ["CAD Workstation Setup"]
  },
  {
    id: "communication",
    title: "Communication",
    description: "Professional communication systems",
    icon: <Phone className="w-8 h-8 text-primary" />,
    services: ["Video Conferencing Setup"]
  },
  {
    id: "specialized-services",
    title: "Specialized Services",
    description: "Advanced & specialized technical services",
    icon: <Drone className="w-8 h-8 text-primary" />,
    services: ["Drone Setup & Training", "3D Printing Setup", "Smart Retail Setup", "Fitness Tech Setup", "Educational Tech Setup"]
  },
  // Traditional Home Services
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