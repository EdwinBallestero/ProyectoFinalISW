import PropTypes from 'prop-types';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarDays, MapPin, ArrowRight } from "lucide-react";
import { Link } from 'react-router-dom';

export function EventCard({ event }) {
    const URL = import.meta.env.VITE_IMAGE_URL
    return (
        <Card className="relative group overflow-hidden border-border bg-card text-card-foreground hover:border-primary/50 hover:shadow-xl transition-all duration-300">
            <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative h-48 w-full overflow-hidden bg-muted">
                <img
                    src={`${URL}/${event.imageUrl}?width=300&height=200&resize=contain`}
                    alt={event.title}
                    className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
                />
            </div>
            <CardHeader className="pb-3">
                <CardTitle className="text-xl font-bold tracking-tight group-hover:text-primary transition-colors">
                    {event.title}
                </CardTitle>
            </CardHeader>

            <CardContent className="grid gap-2.5">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CalendarDays className="h-4 w-4 text-primary/70" />
                    <span>{event.date}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4 text-primary/70" />
                    <span className="line-clamp-1">{event.location}</span>
                </div>
            </CardContent>

            <CardFooter className="pt-3">
                <Button
                    variant="ghost"
                    className="w-full group/btn bg-secondary/50 hover:bg-accent hover:text-accent-foreground transition-all duration-300"
                >
                    <Link to={`/events/${event.id}`} className="flex items-center justify-between w-full">
                        <span className="font-semibold">Ver detalles</span>
                        <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-1.5" />
                    </Link>

                </Button>
            </CardFooter>
        </Card>
    );
}

EventCard.propTypes = {
    event: PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
        title: PropTypes.string.isRequired,
        date: PropTypes.string.isRequired,
        location: PropTypes.string.isRequired,
        imageUrl: PropTypes.string,
    }).isRequired,
};

