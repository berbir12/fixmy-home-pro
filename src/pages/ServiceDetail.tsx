import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Clock, CheckCircle } from "lucide-react";

const serviceTypes = {
  // Computer & Tech Services
  "computer-services": {
    title: "Computer Services",
    services: [
      { name: "Computer Diagnostics & Repair", price: "$89.99", duration: "60 minutes", description: "Comprehensive computer diagnostics and repair services for all major brands" },
      { name: "Laptop Repair & Maintenance", price: "$119.99", duration: "75 minutes", description: "Professional laptop repair and maintenance services for all brands" },
      { name: "Gaming PC Build & Setup", price: "$199.99", duration: "150 minutes", description: "Custom gaming PC assembly and optimization services" },
      { name: "Software Installation & Training", price: "$79.99", duration: "60 minutes", description: "Professional software installation and user training services" }
    ]
  },
  "network-services": {
    title: "Network Services",
    services: [
      { name: "Network Installation & Setup", price: "$149.99", duration: "90 minutes", description: "Professional network installation and configuration for homes and small businesses" },
      { name: "WiFi Network Optimization", price: "$89.99", duration: "60 minutes", description: "Professional WiFi network optimization and troubleshooting" },
      { name: "Server Setup & Maintenance", price: "$299.99", duration: "180 minutes", description: "Professional server installation, configuration, and maintenance services" }
    ]
  },
  "smart-home": {
    title: "Smart Home Services",
    services: [
      { name: "Smart Home Setup", price: "$199.99", duration: "120 minutes", description: "Complete smart home installation and configuration services" },
      { name: "IoT Device Integration", price: "$159.99", duration: "90 minutes", description: "Professional IoT device integration and automation services" },
      { name: "Smart Office Setup", price: "$399.99", duration: "240 minutes", description: "Complete smart office automation and configuration" }
    ]
  },
  "security-services": {
    title: "Security Services",
    services: [
      { name: "Security Camera Installation", price: "$249.99", duration: "120 minutes", description: "Complete security camera system installation and setup" },
      { name: "Cybersecurity Assessment", price: "$299.99", duration: "180 minutes", description: "Professional cybersecurity assessment and protection setup" }
    ]
  },
  "web-digital": {
    title: "Web & Digital Services",
    services: [
      { name: "Website Development & Hosting", price: "$399.99", duration: "240 minutes", description: "Professional website development and hosting services" },
      { name: "E-commerce Platform Setup", price: "$299.99", duration: "180 minutes", description: "Professional e-commerce website setup and configuration" },
      { name: "Digital Marketing Setup", price: "$149.99", duration: "90 minutes", description: "Professional digital marketing platform setup and optimization" }
    ]
  },
  "creative-services": {
    title: "Creative Services",
    services: [
      { name: "Video Editing Setup", price: "$159.99", duration: "120 minutes", description: "Professional video editing workstation setup and training" },
      { name: "Audio Recording Setup", price: "$129.99", duration: "90 minutes", description: "Professional audio recording equipment setup and configuration" },
      { name: "Podcast Studio Setup", price: "$199.99", duration: "120 minutes", description: "Professional podcast recording studio setup and configuration" },
      { name: "Live Streaming Setup", price: "$179.99", duration: "90 minutes", description: "Professional live streaming equipment setup and configuration" },
      { name: "Photography Workstation", price: "$189.99", duration: "120 minutes", description: "Professional photography editing workstation setup" },
      { name: "Digital Art Setup", price: "$139.99", duration: "90 minutes", description: "Professional digital art workstation setup and training" }
    ]
  },
  "entertainment": {
    title: "Entertainment Services",
    services: [
      { name: "Home Theater Setup", price: "$179.99", duration: "90 minutes", description: "Professional home theater system installation and calibration" },
      { name: "Virtual Reality Setup", price: "$199.99", duration: "120 minutes", description: "Professional VR system installation and configuration" }
    ]
  },
  "mobile-services": {
    title: "Mobile Services",
    services: [
      { name: "Mobile Device Repair", price: "$99.99", duration: "45 minutes", description: "Professional smartphone and tablet repair services" }
    ]
  },
  "data-services": {
    title: "Data Services",
    services: [
      { name: "Data Backup & Recovery", price: "$129.99", duration: "90 minutes", description: "Secure data backup solutions and data recovery services" },
      { name: "Cloud Storage Setup", price: "$69.99", duration: "45 minutes", description: "Professional cloud storage configuration and migration services" }
    ]
  },
  "office-equipment": {
    title: "Office Equipment",
    services: [
      { name: "Printer Setup & Troubleshooting", price: "$69.99", duration: "45 minutes", description: "Professional printer installation, configuration, and troubleshooting" }
    ]
  },
  "engineering": {
    title: "Engineering Services",
    services: [
      { name: "CAD Workstation Setup", price: "$249.99", duration: "150 minutes", description: "Professional CAD workstation setup and optimization" }
    ]
  },
  "communication": {
    title: "Communication Services",
    services: [
      { name: "Video Conferencing Setup", price: "$129.99", duration: "60 minutes", description: "Professional video conferencing system setup and optimization" }
    ]
  },
  "specialized-services": {
    title: "Specialized Services",
    services: [
      { name: "Drone Setup & Training", price: "$249.99", duration: "150 minutes", description: "Professional drone setup, configuration, and pilot training" },
      { name: "3D Printing Setup", price: "$179.99", duration: "120 minutes", description: "Professional 3D printer setup and configuration services" },
      { name: "Smart Retail Setup", price: "$499.99", duration: "300 minutes", description: "Complete smart retail system setup and configuration" },
      { name: "Fitness Tech Setup", price: "$159.99", duration: "90 minutes", description: "Professional fitness technology setup and configuration" },
      { name: "Educational Tech Setup", price: "$199.99", duration: "120 minutes", description: "Professional educational technology setup and training" }
    ]
  },
  // Traditional Home Services
  "ac": {
    title: "Air Conditioning Services",
    services: [
      { name: "AC Installation", price: "$150 - $300", duration: "2-4 hours", description: "Complete AC unit installation with warranty" },
      { name: "AC Repair", price: "$80 - $200", duration: "1-2 hours", description: "Diagnose and fix AC issues" },
      { name: "AC Cleaning", price: "$60 - $120", duration: "1 hour", description: "Deep cleaning of AC unit and filters" },
      { name: "Gas Refill", price: "$100 - $150", duration: "30-45 mins", description: "Refrigerant gas refill and leak check" },
      { name: "AC Maintenance", price: "$50 - $100", duration: "45 mins", description: "Regular maintenance and check-up" }
    ]
  },
  "washing-machine": {
    title: "Washing Machine Services",
    services: [
      { name: "Installation", price: "$80 - $150", duration: "1-2 hours", description: "Complete installation and setup" },
      { name: "Repair", price: "$70 - $180", duration: "1-3 hours", description: "Fix all washing machine issues" },
      { name: "Drum Cleaning", price: "$40 - $80", duration: "30 mins", description: "Deep cleaning of drum and pipes" },
      { name: "Motor Repair", price: "$120 - $250", duration: "2-3 hours", description: "Motor replacement or repair" }
    ]
  },
  "tv": {
    title: "Television Services",
    services: [
      { name: "Wall Mounting", price: "$80 - $150", duration: "1-2 hours", description: "Professional TV wall mounting" },
      { name: "Screen Repair", price: "$150 - $300", duration: "2-3 hours", description: "TV screen replacement and repair" },
      { name: "Sound Issues", price: "$60 - $120", duration: "1 hour", description: "Audio system troubleshooting" },
      { name: "Smart TV Setup", price: "$40 - $80", duration: "30 mins", description: "Smart TV configuration and setup" }
    ]
  },
  "refrigerator": {
    title: "Refrigerator Services",
    services: [
      { name: "Cooling Issues", price: "$100 - $200", duration: "1-2 hours", description: "Diagnose and fix cooling problems" },
      { name: "Door Seal", price: "$80 - $150", duration: "1 hour", description: "Refrigerator door seal replacement" },
      { name: "Compressor", price: "$200 - $400", duration: "2-3 hours", description: "Compressor repair or replacement" },
      { name: "Ice Maker", price: "$60 - $120", duration: "1 hour", description: "Ice maker repair and maintenance" },
      { name: "Cleaning", price: "$50 - $100", duration: "45 mins", description: "Deep cleaning and sanitization" }
    ]
  },
  "microwave": {
    title: "Microwave Services",
    services: [
      { name: "Not Heating", price: "$80 - $150", duration: "1 hour", description: "Diagnose and fix heating issues" },
      { name: "Door Repair", price: "$60 - $120", duration: "45 mins", description: "Microwave door repair" },
      { name: "Installation", price: "$50 - $100", duration: "30 mins", description: "Microwave installation" },
      { name: "Turntable Issues", price: "$40 - $80", duration: "30 mins", description: "Turntable repair and replacement" }
    ]
  },
  "dishwasher": {
    title: "Dishwasher Services",
    services: [
      { name: "Installation", price: "$100 - $200", duration: "1-2 hours", description: "Complete dishwasher installation" },
      { name: "Not Draining", price: "$80 - $150", duration: "1 hour", description: "Fix drainage issues" },
      { name: "Not Cleaning", price: "$100 - $180", duration: "1-2 hours", description: "Clean cycle troubleshooting" },
      { name: "Leak Repair", price: "$120 - $200", duration: "1-2 hours", description: "Leak detection and repair" }
    ]
  }
};

export default function ServiceDetail() {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const [selectedService, setSelectedService] = useState<string | null>(null);

  const serviceData = serviceTypes[serviceId as keyof typeof serviceTypes];

  if (!serviceData) {
    return <div>Service not found</div>;
  }

  const handleServiceSelect = (serviceName: string) => {
    setSelectedService(serviceName);
  };

  const handleFindTechnicians = () => {
    navigate(`/technicians/${serviceId}?service=${encodeURIComponent(selectedService || '')}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 bg-background/95 backdrop-blur-sm border-b border-border z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => navigate("/services")}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-2xl font-bold text-foreground">{serviceData.title}</h1>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-foreground mb-2">Select a Service</h2>
          <p className="text-muted-foreground">Choose the type of service you need</p>
        </div>

        <div className="grid gap-4 mb-8">
          {serviceData.services.map((service, index) => (
            <Card 
              key={index}
              className={`cursor-pointer transition-all duration-200 hover:shadow-soft ${
                selectedService === service.name ? 'ring-2 ring-primary bg-primary/5' : ''
              }`}
              onClick={() => handleServiceSelect(service.name)}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-foreground">{service.name}</h3>
                      {selectedService === service.name && (
                        <CheckCircle className="w-5 h-5 text-primary" />
                      )}
                    </div>
                    <p className="text-muted-foreground text-sm mb-3">{service.description}</p>
                    <div className="flex items-center gap-4">
                      <Badge variant="secondary" className="gap-1">
                        <Clock className="w-3 h-3" />
                        {service.duration}
                      </Badge>
                      <span className="font-semibold text-primary">{service.price}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {selectedService && (
          <div className="sticky bottom-4">
            <div className="bg-card border border-border rounded-lg p-4 shadow-soft">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Selected service:</p>
                  <p className="font-semibold text-foreground">{selectedService}</p>
                </div>
                <Button 
                  size="lg"
                  onClick={handleFindTechnicians}
                  className="animate-scale-in"
                >
                  Find Technicians
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}