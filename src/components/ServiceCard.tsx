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
      className="group cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-[1.02] bg-card border-0 shadow-sm rounded-3xl"
      onClick={onClick}
    >
      <CardContent className="p-6">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">
            {icon}
          </div>
          <div>
            <h3 className="font-semibold text-lg text-foreground mb-2 group-hover:text-primary transition-colors">{title}</h3>
            <p className="text-muted-foreground text-sm mb-3">{description}</p>
            <div className="flex flex-wrap gap-1 justify-center">
              {services.slice(0, 3).map((service, index) => (
                <Badge key={index} variant="secondary" className="text-xs rounded-full">
                  {service}
                </Badge>
              ))}
              {services.length > 3 && (
                <Badge variant="secondary" className="text-xs rounded-full">
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