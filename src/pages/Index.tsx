import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ServiceCard } from "@/components/ServiceCard";
import { Star, Users, Shield, Clock, ArrowRight, Zap, Wrench, Home, Search, MapPin, Smartphone, AirVent, WashingMachine, Tv, User, MessageCircle, Monitor, Wifi, Camera, Globe, Video, Smartphone as PhoneIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const featuredServices = [
  {
    id: "computer-services",
    title: "Computer Services",
    description: "Diagnostics, repair & setup",
    icon: <Monitor className="w-6 h-6 text-primary" />,
    services: ["Computer Repair", "Laptop Repair", "Gaming PC Build", "Software Setup"]
  },
  {
    id: "network-services", 
    title: "Network Services",
    description: "WiFi setup & optimization",
    icon: <Wifi className="w-6 h-6 text-primary" />,
    services: ["Network Setup", "WiFi Optimization", "Server Setup"]
  },
  {
    id: "smart-home",
    title: "Smart Home",
    description: "Automation & IoT setup",
    icon: <Home className="w-6 h-6 text-primary" />,
    services: ["Smart Home Setup", "IoT Integration", "Smart Office"]
  },
  {
    id: "security-services",
    title: "Security Services",
    description: "Cameras & cybersecurity",
    icon: <Camera className="w-6 h-6 text-primary" />,
    services: ["Security Cameras", "Cybersecurity", "Access Control"]
  },
  {
    id: "web-digital",
    title: "Web & Digital",
    description: "Website & digital services",
    icon: <Globe className="w-6 h-6 text-primary" />,
    services: ["Website Development", "E-commerce Setup", "Digital Marketing"]
  },
  {
    id: "creative-services",
    title: "Creative Services",
    description: "Video, audio & media setup",
    icon: <Video className="w-6 h-6 text-primary" />,
    services: ["Video Editing", "Audio Recording", "Live Streaming"]
  }
];

export default function Index() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const handleServiceSelect = (serviceId: string) => {
    navigate(`/service/${serviceId}`);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-white border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-2xl flex items-center justify-center">
                <Wrench className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-primary">FixNow</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4" />
                <span>Current Location</span>
              </div>
              <Button variant="ghost" size="sm" onClick={() => navigate("/auth")}>
                Sign In
              </Button>
              <Button variant="outline" size="sm" onClick={() => navigate("/dashboard")}>
                Dashboard
              </Button>
              <Button variant="secondary" size="sm" onClick={() => navigate("/technician-registration")}>
                Join as Technician
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Search Section */}
      <section className="bg-white py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              What do you need help with?
            </h1>
            <p className="text-muted-foreground text-lg">
              Get expert technicians for repairs, installations & maintenance
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-lg mx-auto mb-8">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Input
                placeholder="Search for appliances, services..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-14 text-lg rounded-2xl border-2 border-input focus:border-primary shadow-sm"
              />
            </div>
          </div>

          {/* Quick Service Buttons */}
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            <Button 
              variant="outline" 
              className="rounded-full"
              onClick={() => navigate("/services?category=air-conditioning")}
            >
              <Zap className="w-4 h-4 mr-2" />
              AC Repair
            </Button>
            <Button 
              variant="outline" 
              className="rounded-full"
              onClick={() => navigate("/services?category=washing-machine")}
            >
              Washing Machine
            </Button>
            <Button 
              variant="outline" 
              className="rounded-full"
              onClick={() => navigate("/services?category=refrigerator")}
            >
              Refrigerator
            </Button>
            <Button 
              variant="outline" 
              className="rounded-full bg-accent text-accent-foreground hover:bg-accent/90"
            >
              Emergency
            </Button>
          </div>

          {/* Quick Book Button */}
          <div className="text-center">
            <Button 
              size="lg" 
              className="rounded-2xl px-8 py-6 text-lg font-semibold shadow-lg hover:scale-105 transition-transform"
              onClick={() => navigate("/services")}
            >
              <Smartphone className="w-5 h-5 mr-2" />
              Quick Book Service
            </Button>
          </div>
        </div>
      </section>

      {/* Live Technician Availability */}
      <section className="py-12 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-3xl p-8 shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-foreground">
                Available Technicians Near You
              </h2>
              <Badge variant="secondary" className="bg-accent text-accent-foreground">
                <div className="w-2 h-2 bg-accent-foreground rounded-full mr-2 animate-pulse"></div>
                12 Online
              </Badge>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { name: "John Smith", rating: 4.9, eta: "15 min", specialty: "Computer Repair" },
                { name: "Sarah Johnson", rating: 4.8, eta: "22 min", specialty: "Network Setup" },
                { name: "Mike Wilson", rating: 4.7, eta: "28 min", specialty: "Smart Home" }
              ].map((tech, index) => (
                <Card key={index} className="border-2 border-transparent hover:border-accent transition-colors cursor-pointer rounded-3xl">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="text-primary font-semibold">
                          {tech.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <p className="font-semibold">{tech.name}</p>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-warning text-warning" />
                          <span className="text-sm font-medium">{tech.rating}</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{tech.specialty}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-accent font-semibold">ETA: {tech.eta}</span>
                      <Button size="sm" variant="outline" className="rounded-full">
                        Book
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Service Categories */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Popular Services
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Choose from our comprehensive technical and home services
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredServices.map((service, index) => (
              <ServiceCard
                key={index}
                {...service}
                onClick={() => handleServiceSelect(service.id)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Trust Stats */}
      <section className="py-16 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="space-y-2">
              <div className="text-3xl font-bold text-primary">500+</div>
              <p className="text-sm text-muted-foreground">Verified Technicians</p>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-primary">15 min</div>
              <p className="text-sm text-muted-foreground">Avg Response Time</p>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-primary">4.9★</div>
              <p className="text-sm text-muted-foreground">Customer Rating</p>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-primary">24/7</div>
              <p className="text-sm text-muted-foreground">Emergency Service</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works - Uber Style */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Book in 3 Simple Steps
            </h2>
            <p className="text-xl text-muted-foreground">
              Just like ordering a ride, but for home services
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-white">1</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Request Service</h3>
                <p className="text-muted-foreground">
                  Search and select your appliance service
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-white">2</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Get Matched</h3>
                <p className="text-muted-foreground">
                  We find available technicians near you
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-white">3</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Track & Pay</h3>
                <p className="text-muted-foreground">
                  Live tracking and seamless payment
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Access Features */}
      <section className="py-16 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Powerful Features
            </h2>
            <p className="text-xl text-muted-foreground">
              Everything you need for seamless home service management
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="text-center hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate("/dashboard")}>
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Dashboard</h3>
                <p className="text-sm text-muted-foreground">
                  Track bookings, payments, and manage your account
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate("/chat")}>
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageCircle className="w-8 h-8 text-accent" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Live Chat</h3>
                <p className="text-sm text-muted-foreground">
                  Real-time communication with technicians and support
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate("/auth")}>
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-success" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Secure Login</h3>
                <p className="text-sm text-muted-foreground">
                  Bank-level security with OTP verification
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate("/services")}>
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-warning/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Wrench className="w-8 h-8 text-warning" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Book Service</h3>
                <p className="text-sm text-muted-foreground">
                  Quick booking with instant technician matching
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Emergency CTA */}
      <section className="py-16 bg-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            Need Emergency Service?
          </h2>
          <p className="text-xl mb-8 text-white/90">
            24/7 emergency repairs available with priority dispatch
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              variant="secondary" 
              size="xl"
              className="bg-accent text-accent-foreground hover:bg-accent/90"
            >
              Emergency Call
            </Button>
            <Button 
              variant="outline" 
              size="xl"
              className="border-white text-white hover:bg-white hover:text-primary"
              onClick={() => navigate("/services")}
            >
              Schedule Service
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}