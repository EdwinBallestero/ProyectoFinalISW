import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
	createRegistration,
	getRegistrationEvents,
	getRegistrationStatuses,
	getRegistrationUsers,
} from "@/services/registrationsService";

export function CreateRegistration({ open, onOpenChange, onCreated }) {
	const [events, setEvents] = useState([]);
	const [users, setUsers] = useState([]);
	const [statuses, setStatuses] = useState([]);
	const [loading, setLoading] = useState(false);
	const [submitting, setSubmitting] = useState(false);
	const [loadError, setLoadError] = useState("");
	const [statusId, setStatusId] = useState("");

	useEffect(() => {
		if (!open) {
			return;
		}

		let active = true;
		async function loadFormData() {
			try {
				setLoading(true);
				setLoadError("");
				const [eventsResponse, usersResponse, statusesResponse] = await Promise.all([
					getRegistrationEvents(),
					getRegistrationUsers(),
					getRegistrationStatuses(),
				]);

				if (!active) {
					return;
				}

				setEvents(eventsResponse?.data ?? eventsResponse ?? []);
				setUsers(usersResponse?.data ?? usersResponse ?? []);
				const availableStatuses = statusesResponse?.data ?? statusesResponse ?? [];
				setStatuses(availableStatuses);
				setStatusId(String(availableStatuses.find((status) => status.id === 1)?.id ?? availableStatuses[0]?.id ?? ""));
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

		loadFormData();
		return () => {
			active = false;
		};
	}, [open]);

	async function handleSubmit(event) {
		event.preventDefault();
		if (submitting) {
			return;
		}

		const formData = Object.fromEntries(new FormData(event.currentTarget));
		const registration = {
			eventId: Number(formData.eventId),
			userId: Number(formData.userId),
			statusId: Number(formData.statusId),
		};

		try {
			setSubmitting(true);
			await createRegistration(registration);
			toast.success("Inscripción creada correctamente.");
			onOpenChange(false);
			onCreated();
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
					<DialogTitle>Crear inscripción</DialogTitle>
					<DialogDescription>Seleccione el evento, usuario y estado para la inscripción.</DialogDescription>
				</DialogHeader>
				{loadError ? (
					<p className="text-sm text-destructive">{loadError}</p>
				) : (
				<form className="space-y-4" onSubmit={handleSubmit}>
					<label className="block space-y-1 text-sm font-medium">
						Evento
						<select name="eventId" className="h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm" required disabled={loading || events.length === 0} defaultValue="">
							<option value="" disabled>{loading ? "Cargando eventos..." : "Seleccione un evento"}</option>
							{events.map((eventItem) => <option key={eventItem.id} value={eventItem.id}>{eventItem.title}</option>)}
						</select>
					</label>
					<label className="block space-y-1 text-sm font-medium">
						Usuario
						<select name="userId" className="h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm" required disabled={loading || users.length === 0} defaultValue="">
							<option value="" disabled>{loading ? "Cargando usuarios..." : "Seleccione un usuario"}</option>
							{users.map((user) => <option key={user.id} value={user.id}>{user.fullName} ({user.email})</option>)}
						</select>
					</label>
					<label className="block space-y-1 text-sm font-medium">
						Estado
						<select name="statusId" className="h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm" required disabled={loading || statuses.length === 0} value={statusId} onChange={(event) => setStatusId(event.target.value)}>
							{statuses.map((status) => <option key={status.id} value={status.id}>{status.name}</option>)}
						</select>
					</label>
					<DialogFooter>
						<Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
						<Button type="submit" disabled={loading || submitting || events.length === 0 || users.length === 0 || statuses.length === 0}>
							{submitting ? "Creando..." : "Crear"}
						</Button>
					</DialogFooter>
				</form>
				)}
			</DialogContent>
		</Dialog>
	);
}

CreateRegistration.propTypes = {
	open: PropTypes.bool.isRequired,
	onOpenChange: PropTypes.func.isRequired,
	onCreated: PropTypes.func.isRequired,
};
