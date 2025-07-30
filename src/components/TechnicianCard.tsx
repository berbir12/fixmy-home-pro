import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, MapPin, Clock, CheckCircle } from "lucide-react";

interface TechnicianCardProps {
  id: string;
  name: string;
  avatar?: string;
  rating: number;
  reviewCount: number;
  distance: string;
  responseTime: string;
  specialties: string[];
  isVerified: boolean;
  price: string;
  onBook: () => void;
  onViewProfile: () => void;
}

export function TechnicianCard({ 
  name, 
  avatar, 
  rating, 
  reviewCount, 
  distance, 
  responseTime, 
  specialties, 
  isVerified, 
  price,
  onBook,
  onViewProfile 
}: TechnicianCardProps) {
  return (
    <Card className="hover:shadow-soft transition-all duration-200">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <Avatar className="w-16 h-16">
            <AvatarImage src={avatar} alt={name} />
            <AvatarFallback className="bg-primary/10 text-primary font-semibold">
              {name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-foreground">{name}</h3>
              {isVerified && (
                <CheckCircle className="w-4 h-4 text-accent" />
              )}
            </div>
            
            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-warning text-warning" />
                <span className="font-medium">{rating}</span>
                <span>({reviewCount} reviews)</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                <span>{distance}</span>
              </div>
            </div>
            
            <div className="flex items-center gap-1 text-sm text-muted-foreground mb-3">
              <Clock className="w-4 h-4" />
              <span>Responds in {responseTime}</span>
            </div>
            
            <div className="flex flex-wrap gap-1 mb-4">
              {specialties.slice(0, 3).map((specialty, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {specialty}
                </Badge>
              ))}
            </div>
            
            <div className="flex items-center justify-between">
              <div className="text-lg font-semibold text-foreground">
                {price}
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={onViewProfile}>
                  View Profile
                </Button>
                <Button size="sm" onClick={onBook}>
                  Book Now
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}