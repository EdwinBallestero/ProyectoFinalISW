import PropTypes from "prop-types";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";

export function UpdateRegistrationForm({ statuses, statusId, onStatusChange, loading, submitting, onSubmit, onCancel }) {
	return (
		<form className="space-y-4" onSubmit={onSubmit}>
			<label className="block space-y-1 text-sm font-medium">
				Estado de inscripción
				<select
					className="h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm"
					value={statusId}
					onChange={(event) => onStatusChange(event.target.value)}
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
				<Button type="button" variant="outline" onClick={onCancel}>Cancelar</Button>
				<Button type="submit" disabled={loading || submitting || statuses.length === 0}>
					{submitting ? "Guardando..." : "Guardar cambios"}
				</Button>
			</DialogFooter>
		</form>
	);
}

UpdateRegistrationForm.propTypes = {
	statuses: PropTypes.array.isRequired,
	statusId: PropTypes.string.isRequired,
	onStatusChange: PropTypes.func.isRequired,
	loading: PropTypes.bool.isRequired,
	submitting: PropTypes.bool.isRequired,
	onSubmit: PropTypes.func.isRequired,
	onCancel: PropTypes.func.isRequired,
};
