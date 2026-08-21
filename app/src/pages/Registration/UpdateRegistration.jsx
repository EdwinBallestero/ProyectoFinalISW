import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import toast from "react-hot-toast";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { UpdateRegistrationForm } from "@/components/Registrations/UpdateRegistrationForm";
import { getRegistrationStatuses, updateRegistration } from "@/services/registrationsService";

export function UpdateRegistration({ registration, open, onOpenChange, onUpdated }) {
	const [statuses, setStatuses] = useState([]);
	const [statusId, setStatusId] = useState("");
	const [loading, setLoading] = useState(false);
	const [submitting, setSubmitting] = useState(false);
	const [loadError, setLoadError] = useState("");

	useEffect(() => {
		if (!open || !registration) {
			return;
		}

		let active = true;
		async function loadStatuses() {
			try {
				setLoading(true);
				setLoadError("");
				setStatusId(String(registration.statusId));
				const response = await getRegistrationStatuses();

				if (active) {
					setStatuses(response?.data ?? response ?? []);
				}
			} catch (error) {
				if (active) {
					setLoadError(error.message);
				}
			} finally {
				if (active) {
					setLoading(false);
				}
			}
		}

		loadStatuses();
		return () => {
			active = false;
		};
	}, [open, registration]);

	async function handleSubmit(event) {
		event.preventDefault();
		if (!registration || submitting) {
			return;
		}

		try {
			setSubmitting(true);
			await updateRegistration(registration.eventId, registration.userId, {
				statusId: Number(statusId),
			});
			toast.success("Inscripción actualizada correctamente.");
			onOpenChange(false);
			await onUpdated();
		} catch (error) {
			toast.error(error.message);
		} finally {
			setSubmitting(false);
		}
	}

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Actualizar inscripción</DialogTitle>
					<DialogDescription>Seleccione el nuevo estado para esta inscripción.</DialogDescription>
				</DialogHeader>

				<div className="grid gap-1 rounded-lg border bg-muted/30 p-3 text-sm">
					<p><span className="text-muted-foreground">Evento:</span> {registration?.event?.title ?? `Evento #${registration?.eventId}`}</p>
					<p><span className="text-muted-foreground">Participante:</span> {registration?.user?.fullName ?? `Usuario #${registration?.userId}`}</p>
				</div>

				{loadError ? (
					<p className="text-sm text-destructive">{loadError}</p>
				) : (
					<UpdateRegistrationForm
						statuses={statuses}
						statusId={statusId}
						onStatusChange={setStatusId}
						loading={loading}
						submitting={submitting}
						onSubmit={handleSubmit}
						onCancel={() => onOpenChange(false)}
					/>
				)}
			</DialogContent>
		</Dialog>
	);
}

UpdateRegistration.propTypes = {
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
	}),
	open: PropTypes.bool.isRequired,
	onOpenChange: PropTypes.func.isRequired,
	onUpdated: PropTypes.func.isRequired,
};
