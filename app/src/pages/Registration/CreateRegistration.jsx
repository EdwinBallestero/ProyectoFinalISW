import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import toast from "react-hot-toast";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { RegistrationForm } from "@/components/Registrations/RegistrationForm";
import {
	createRegistration,
	getRegistrationEvents,
	getRegistrationStatuses,
	getRegistrationUsers,
} from "@/services/registrationsService";

const DEFAULT_STATUS_ID = 3;

export function CreateRegistration({ open, onOpenChange, onCreated }) {
	const [events, setEvents] = useState([]);
	const [users, setUsers] = useState([]);
	const [statuses, setStatuses] = useState([]);
	const [loading, setLoading] = useState(false);
	const [submitting, setSubmitting] = useState(false);
	const [loadError, setLoadError] = useState("");


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
				setStatuses(statusesResponse?.data ?? statusesResponse ?? []);
				
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
			statusId: DEFAULT_STATUS_ID,
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
					<RegistrationForm
						events={events}
						users={users}
						statuses={statuses}
						defaultStatusId={DEFAULT_STATUS_ID}
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

CreateRegistration.propTypes = {
	open: PropTypes.bool.isRequired,
	onOpenChange: PropTypes.func.isRequired,
	onCreated: PropTypes.func.isRequired,
};
