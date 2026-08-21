import PropTypes from "prop-types";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";

export function RegistrationForm({ events, users, statuses, defaultStatusId, loading, submitting, onSubmit, onCancel }) {
	const defaultStatus = statuses.find((status) => status.id === defaultStatusId);
	return (
		<form className="space-y-4" onSubmit={onSubmit}>
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
			{/*<label className="block space-y-1 text-sm font-medium">
				Estado
				<select name="statusId" className="h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm" required disabled={loading || statuses.length === 0} value={statusId} onChange={(event) => onStatusChange(event.target.value)}>
					{statuses.map((status) => <option key={status.id} value={status.id}>{status.name}</option>)}
				</select>
			</label>*/}
			<div className="space-y-1 text-sm font-medium">
                Estado
                <div className="flex h-9 w-full items-center rounded-md border border-input bg-muted px-3 text-sm text-muted-foreground">
                    {loading ? "Cargando..." : defaultStatus?.name ?? "Estado por defecto"}
                </div>
            </div>
            <input type="hidden" name="statusId" value={defaultStatusId} />
			<DialogFooter>
				<Button type="button" variant="outline" onClick={onCancel}>Cancelar</Button>
				<Button type="submit" disabled={loading || submitting || events.length === 0 || users.length === 0 || statuses.length === 0}>
					{submitting ? "Creando..." : "Crear"}
				</Button>
			</DialogFooter>
		</form>
	);
}

RegistrationForm.propTypes = {
	events: PropTypes.array.isRequired,
	users: PropTypes.array.isRequired,
	statuses: PropTypes.array.isRequired,
	defaultStatusId: PropTypes.number.isRequired,
	loading: PropTypes.bool.isRequired,
	submitting: PropTypes.bool.isRequired,
	onSubmit: PropTypes.func.isRequired,
	onCancel: PropTypes.func.isRequired,
};
