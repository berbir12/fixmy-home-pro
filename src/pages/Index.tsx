import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ServiceCard } from "@/components/ServiceCard";
import { Search, MapPin, Star, Clock, Shield, AirVent, WashingMachine, Tv, Wrench } from "lucide-react";
import heroImage from "@/assets/service-hero.jpg";

const featuredServices = [
  {
    id: "ac",
    title: "Air Conditioning",
    description: "Installation, repair & maintenance",
    icon: <AirVent className="w-6 h-6 text-primary" />,
    services: ["Installation", "Repair", "Cleaning"]
  },
  {
    id: "washing-machine", 
    title: "Washing Machine",
    description: "All washing machine services",
    icon: <WashingMachine className="w-6 h-6 text-primary" />,
    services: ["Installation", "Repair", "Cleaning"]
  },
  {
    id: "tv",
    title: "Television",
    description: "TV mounting, repair & setup", 
    icon: <Tv className="w-6 h-6 text-primary" />,
    services: ["Wall Mounting", "Screen Repair", "Setup"]
  }
];

const Index = () => {
  const navigate = useNavigate();

  const handleServiceSelect = (serviceId: string) => {
    navigate(`/service/${serviceId}`);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative bg-hero-gradient text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative container mx-auto px-4 py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 animate-fade-in">
              <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                Trusted Home Appliance Services
              </h1>
              <p className="text-xl lg:text-2xl text-white/90">
                Connect with verified technicians for repairs, installations, and maintenance
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  variant="hero" 
                  size="xl"
                  onClick={() => navigate("/services")}
                  className="bg-white text-primary hover:bg-white/90"
                >
                  <Search className="w-5 h-5 mr-2" />
                  Book a Service
                </Button>
                <Button 
                  variant="outline" 
                  size="xl"
                  className="border-white text-white hover:bg-white hover:text-primary"
                >
                  Emergency Service
                </Button>
              </div>
            </div>
            <div className="relative animate-slide-up">
              <img 
                src={heroImage} 
                alt="Home appliance services" 
                className="rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-16 bg-card">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div className="space-y-2">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold">Verified Technicians</h3>
              <p className="text-sm text-muted-foreground">Background checked & certified</p>
            </div>
            <div className="space-y-2">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <Clock className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold">Same Day Service</h3>
              <p className="text-sm text-muted-foreground">Quick response & booking</p>
            </div>
            <div className="space-y-2">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <Star className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold">Rated 4.8/5</h3>
              <p className="text-sm text-muted-foreground">10,000+ satisfied customers</p>
            </div>
            <div className="space-y-2">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <MapPin className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold">Local Experts</h3>
              <p className="text-sm text-muted-foreground">Technicians in your area</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Services */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Popular Services
            </h2>
            <p className="text-xl text-muted-foreground">
              Get expert help for your home appliances
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {featuredServices.map((service) => (
              <ServiceCard
                key={service.id}
                icon={service.icon}
                title={service.title}
                description={service.description}
                services={service.services}
                onClick={() => handleServiceSelect(service.id)}
              />
            ))}
          </div>

          <div className="text-center">
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => navigate("/services")}
            >
              <Wrench className="w-4 h-4 mr-2" />
              View All Services
            </Button>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              How It Works
            </h2>
            <p className="text-xl text-muted-foreground">
              Book your service in 3 simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center group hover:shadow-soft transition-all duration-300">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                  <span className="text-2xl font-bold text-primary">1</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Choose Service</h3>
                <p className="text-muted-foreground">
                  Select your appliance and type of service needed
                </p>
              </CardContent>
            </Card>

            <Card className="text-center group hover:shadow-soft transition-all duration-300">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                  <span className="text-2xl font-bold text-primary">2</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Pick Technician</h3>
                <p className="text-muted-foreground">
                  Browse profiles and choose your preferred expert
                </p>
              </CardContent>
            </Card>

            <Card className="text-center group hover:shadow-soft transition-all duration-300">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                  <span className="text-2xl font-bold text-primary">3</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Get It Fixed</h3>
                <p className="text-muted-foreground">
                  Schedule appointment and get your appliance working
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-accent-gradient text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            Need Emergency Service?
          </h2>
          <p className="text-xl mb-8 text-white/90">
            24/7 emergency repairs available for urgent issues
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              variant="hero" 
              size="xl"
              className="bg-white text-accent hover:bg-white/90"
            >
              Call Emergency Line
            </Button>
            <Button 
              variant="outline" 
              size="xl"
              className="border-white text-white hover:bg-white hover:text-accent"
              onClick={() => navigate("/services")}
            >
              Book Regular Service
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
