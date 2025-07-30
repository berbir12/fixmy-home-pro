import { useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { TechnicianCard } from "@/components/TechnicianCard";
import { ArrowLeft, Filter } from "lucide-react";

const technicianData = [
  {
    id: "1",
    name: "John Smith",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=john",
    rating: 4.8,
    reviewCount: 127,
    distance: "1.2 km away",
    responseTime: "15 mins",
    specialties: ["AC Installation", "AC Repair", "Maintenance"],
    isVerified: true,
    price: "From $80"
  },
  {
    id: "2",
    name: "Mike Johnson",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=mike",
    rating: 4.9,
    reviewCount: 89,
    distance: "2.1 km away",
    responseTime: "20 mins",
    specialties: ["AC Cleaning", "Gas Refill", "Repair"],
    isVerified: true,
    price: "From $70"
  },
  {
    id: "3",
    name: "Sarah Wilson",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah",
    rating: 4.7,
    reviewCount: 156,
    distance: "3.5 km away",
    responseTime: "25 mins",
    specialties: ["Installation", "Repair", "Troubleshooting"],
    isVerified: true,
    price: "From $90"
  },
  {
    id: "4",
    name: "David Brown",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=david",
    rating: 4.6,
    reviewCount: 203,
    distance: "4.2 km away",
    responseTime: "30 mins",
    specialties: ["AC Maintenance", "Emergency Repair"],
    isVerified: false,
    price: "From $75"
  }
];

export default function Technicians() {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const selectedService = searchParams.get('service');

  const handleBookTechnician = (technicianId: string) => {
    navigate(`/booking/${technicianId}?service=${encodeURIComponent(selectedService || '')}`);
  };

  const handleViewProfile = (technicianId: string) => {
    navigate(`/technician/${technicianId}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 bg-background/95 backdrop-blur-sm border-b border-border z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => navigate(-1)}
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Available Technicians</h1>
                {selectedService && (
                  <p className="text-sm text-muted-foreground">For {selectedService}</p>
                )}
              </div>
            </div>
            <Button variant="outline" size="sm" className="gap-2">
              <Filter className="w-4 h-4" />
              Filters
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-foreground mb-2">
            {technicianData.length} technicians near you
          </h2>
          <p className="text-muted-foreground">Sorted by distance and rating</p>
        </div>

        <div className="space-y-4">
          {technicianData.map((technician) => (
            <TechnicianCard
              key={technician.id}
              {...technician}
              onBook={() => handleBookTechnician(technician.id)}
              onViewProfile={() => handleViewProfile(technician.id)}
            />
          ))}
        </div>

        <div className="mt-8 text-center">
          <p className="text-muted-foreground text-sm mb-4">
            Can't find the right technician? We'll help you find one.
          </p>
          <Button variant="outline">
            Request Custom Quote
          </Button>
        </div>
      </div>
    </div>
  );
}