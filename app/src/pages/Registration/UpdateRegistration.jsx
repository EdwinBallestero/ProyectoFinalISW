import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
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
					<form className="space-y-4" onSubmit={handleSubmit}>
						<label className="block space-y-1 text-sm font-medium">
							Estado de inscripción
							<select
								className="h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm"
								value={statusId}
								onChange={(event) => setStatusId(event.target.value)}
								disabled={loading || submitting || statuses.length === 0}
								required
							>
								{loading ? (
									<option>Cargando estados...</option>
								) : (
									statuses.map((status) => (
										<option key={status.id} value={status.id}>{status.name}</option>
									))
								)}
							</select>
						</label>
						<DialogFooter>
							<Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
							<Button type="submit" disabled={loading || submitting || statuses.length === 0}>
								{submitting ? "Guardando..." : "Guardar cambios"}
							</Button>
						</DialogFooter>
					</form>
				)}
			</DialogContent>
		</Dialog>
	);
}
