import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { CheckCircle, Calendar, Clock, MapPin, Phone, User } from "lucide-react";

export default function BookingSuccess() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6 animate-fade-in">
        <div className="text-center">
          <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-12 h-12 text-accent" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">Booking Confirmed!</h1>
          <p className="text-muted-foreground">Your service request has been successfully booked.</p>
        </div>

        <Card>
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center gap-3">
              <User className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Technician</p>
                <p className="font-semibold">John Smith</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Date</p>
                <p className="font-semibold">Tomorrow, March 15</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Time</p>
                <p className="font-semibold">10:00 AM - 12:00 PM</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Service</p>
                <p className="font-semibold">AC Installation</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Phone className="w-5 h-5 text-primary mt-0.5" />
              <div>
                <p className="font-semibold text-primary">What's Next?</p>
                <p className="text-sm text-muted-foreground mt-1">
                  John will call you 30 minutes before arrival. You'll receive SMS updates about the service status.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-3">
          <Button 
            onClick={() => navigate("/")} 
            className="w-full"
            size="lg"
          >
            Book Another Service
          </Button>
          <Button 
            onClick={() => navigate("/bookings")} 
            variant="outline" 
            className="w-full"
            size="lg"
          >
            View My Bookings
          </Button>
        </div>
      </div>
    </div>
  );
}