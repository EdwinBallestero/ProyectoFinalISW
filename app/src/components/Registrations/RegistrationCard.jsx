import PropTypes from "prop-types";
import { Pencil, Trash2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function RegistrationCard({ registration, onView, onUpdate, onDelete }) {
	return (
		<div className="flex flex-col gap-4 rounded-lg border border-border bg-card p-8 sm:flex-row sm:items-center sm:justify-between">
			<div className="space-y-1">
				<p className="text-base text-muted-foreground"><strong className="text-lg text-foreground">Evento:</strong> <br></br>{registration.event?.title ?? `Evento #${registration.eventId}`}</p>
				<p className="text-base text-muted-foreground"><strong className="text-lg text-foreground">Participante:</strong> <br></br>{registration.user?.fullName ?? `Usuario #${registration.userId}`}</p>
			</div>
			<div className="flex flex-wrap gap-2">
				<Button size="default" variant="outline" onClick={() => onView(registration)}> Ver detalles <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-1.5" /></Button>
				<Button size="default" variant="outline" onClick={() => onUpdate(registration)}><Pencil /> Actualizar</Button>
				<Button size="default" variant="destructive" onClick={() => onDelete(registration)}><Trash2 /> Eliminar</Button>
			</div>
		</div>
	);
}

RegistrationCard.propTypes = {
	registration: PropTypes.shape({
		eventId: PropTypes.number.isRequired,
		userId: PropTypes.number.isRequired,
		event: PropTypes.shape({
			title: PropTypes.string,
		}),
		user: PropTypes.shape({
			fullName: PropTypes.string,
		}),
	}).isRequired,
	onView: PropTypes.func.isRequired,
	onUpdate: PropTypes.func.isRequired,
	onDelete: PropTypes.func.isRequired,
};
