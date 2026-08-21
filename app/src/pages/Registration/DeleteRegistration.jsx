import { useState } from "react";
import PropTypes from "prop-types";
import toast from "react-hot-toast";
import { AlertTriangle, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { deleteRegistration } from "@/services/registrationsService";

export function DeleteRegistration({ registration, open, onOpenChange, onDeleted }) {
	const [deleting, setDeleting] = useState(false);

	async function handleDelete() {
		if (!registration || deleting) {
			return;
		}

		try {
			setDeleting(true);
			await deleteRegistration(registration.eventId, registration.userId);
			toast.success("Inscripción eliminada correctamente.");
			onOpenChange(false);
			await onDeleted();
		} catch (error) {
			toast.error(error.message);
		} finally {
			setDeleting(false);
		}
	}

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<div className="flex items-center gap-3">
						<span className="grid size-10 place-items-center rounded-full bg-destructive/10 text-destructive">
							<AlertTriangle className="size-5" />
						</span>
						<div>
							<DialogTitle>Eliminar inscripción</DialogTitle>
							<DialogDescription>Esta acción no se puede deshacer.</DialogDescription>
						</div>
					</div>
				</DialogHeader>

				<div className="grid gap-1 rounded-lg border bg-muted/30 p-3 text-sm">
					<p><span className="text-muted-foreground">Evento:</span> {registration?.event?.title ?? `Evento #${registration?.eventId}`}</p>
					<p><span className="text-muted-foreground">Participante:</span> {registration?.user?.fullName ?? `Usuario #${registration?.userId}`}</p>
					<p><span className="text-muted-foreground">Estado actual:</span> {registration?.status?.name ?? `Estado #${registration?.statusId}`}</p>
				</div>

				<DialogFooter>
					<Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={deleting}>Cancelar</Button>
					<Button type="button" variant="destructive" onClick={handleDelete} disabled={deleting}>
						<Trash2 /> {deleting ? "Eliminando..." : "Eliminar inscripción"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

DeleteRegistration.propTypes = {
	registration: PropTypes.shape({
		eventId: PropTypes.number,
		userId: PropTypes.number,
		statusId: PropTypes.number,
		event: PropTypes.shape({
			title: PropTypes.string,
		}),
		user: PropTypes.shape({
			fullName: PropTypes.string,
		}),
		status: PropTypes.shape({
			name: PropTypes.string,
		}),
	}),
	open: PropTypes.bool.isRequired,
	onOpenChange: PropTypes.func.isRequired,
	onDeleted: PropTypes.func.isRequired,
};
