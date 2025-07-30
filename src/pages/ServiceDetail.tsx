import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Clock, CheckCircle } from "lucide-react";

const serviceTypes = {
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