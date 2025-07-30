import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ServiceCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  services: string[];
  onClick: () => void;
}

export function ServiceCard({ icon, title, description, services, onClick }: ServiceCardProps) {
  return (
    <Card 
      className="group cursor-pointer hover:shadow-soft transition-all duration-300 hover:-translate-y-1 bg-card border-border"
      onClick={onClick}
    >
      <CardContent className="p-6">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
            {icon}
          </div>
          <div>
            <h3 className="font-semibold text-lg text-foreground mb-2">{title}</h3>
            <p className="text-muted-foreground text-sm mb-3">{description}</p>
            <div className="flex flex-wrap gap-1 justify-center">
              {services.slice(0, 3).map((service, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {service}
                </Badge>
              ))}
              {services.length > 3 && (
                <Badge variant="secondary" className="text-xs">
                  +{services.length - 3} more
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}