import { ClipboardList, Eye, Pencil, RefreshCw, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function GetAllRegistration({
	registrations,
	loading,
	onRefresh,
	onView,
	onUpdate,
	onDelete,
}) {
	return (
		<Card>
			<CardHeader>
				<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
					<div>
						<CardTitle className="flex items-center gap-2"><ClipboardList /> Listado de inscripciones</CardTitle>
						<CardDescription>
							{loading ? "Cargando..." : `${registrations.length} inscripción(es) encontrada(s).`}
						</CardDescription>
					</div>
					<Button variant="outline" onClick={onRefresh} disabled={loading}>
						<RefreshCw className={loading ? "animate-spin" : ""} /> Actualizar
					</Button>
				</div>
			</CardHeader>
			<CardContent className="space-y-2">
				{!loading && registrations.length === 0 && (
					<p className="text-sm text-muted-foreground">No hay inscripciones para mostrar.</p>
				)}
				{registrations.map((registration, index) => (
					<div
						key={`${registration.eventId}-${registration.userId}`}
						className="flex flex-col gap-3 border-b border-border pb-3 last:border-0 sm:flex-row sm:items-center sm:justify-between"
					>
						<div>
							<p className="font-medium">Inscripción #{index + 1}</p>
							<p className="text-sm text-muted-foreground">{registration.event?.title ?? `Evento #${registration.eventId}`}</p>
						</div>
						<div className="flex gap-2">
							<Button size="sm" variant="outline" onClick={() => onView(registration)}><Eye /> Ver</Button>
							<Button size="sm" variant="outline" onClick={() => onUpdate(registration)}><Pencil /> Actualizar</Button>
							<Button size="sm" variant="destructive" onClick={() => onDelete(registration)}><Trash2 /> Eliminar</Button>
						</div>
					</div>
				))}
			</CardContent>
		</Card>
	);
}
