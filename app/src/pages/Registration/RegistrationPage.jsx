import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { CalendarDays, Clock3, Eye, Info, Mail, MapPin, Pencil, Plus, Ticket, Trash2, UserRound } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { CreateRegistration } from "./CreateRegistration";
import { DeleteRegistration } from "./DeleteRegistration";
import { GetAllRegistration } from "./GetAllRegistration";
import { UpdateRegistration } from "./UpdateRegistration";
import {
    getRegistrationsByEvent,
    getRegistrationsByUser,
    getRegistrations,
} from "@/services/registrationsService";

function formatDate(value) {
    if (!value) {
        return "No disponible";
    }

    const date = new Date(value);
    return Number.isNaN(date.getTime())
        ? "No disponible"
        : new Intl.DateTimeFormat("es-AR", { dateStyle: "long", timeStyle: "short" }).format(date);
}

export function RegistrationPage() {
    const [registrations, setRegistrations] = useState([]);
    const [selectedRegistration, setSelectedRegistration] = useState(null);
    const [dialog, setDialog] = useState(null);
    const [createOpen, setCreateOpen] = useState(false);
    const [registrationId, setRegistrationId] = useState("");
    const [loading, setLoading] = useState(false);

    async function loadRegistrations() {
        try {
            setLoading(true);
            const response = await getRegistrations();
            setRegistrations(response?.data ?? response ?? []);
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadRegistrations();
    }, []);

    async function handleGetById(type) {
        if (!registrationId.trim()) {
            toast.error(`Ingrese el ID del ${type === "event" ? "evento" : "usuario"}.`);
            return;
        }
        try {
            const response = type === "event"
                ? await getRegistrationsByEvent(registrationId)
                : await getRegistrationsByUser(registrationId);
            const data = response?.data ?? response ?? [];
            const registrationsFound = Array.isArray(data) ? data : [data];
            if (registrationsFound.length === 0) {
                toast.error("No se encontraron inscripciones.");
                return;
            }
            setRegistrations(registrationsFound);
            setSelectedRegistration(registrationsFound[0]);
        } catch (error) {
            toast.error(error.message);
        }
    }

    function openUpdate(registration) {
        setSelectedRegistration(registration);
        setDialog("update");
    }

    function openDetails(registration) {
        setSelectedRegistration(registration);
        setDialog("details");
    }

    return (
        <section className="space-y-6">
            <PageHeader
                title="Inscripciones"
                description="Administre las inscripciones a los eventos desde un solo lugar."
            />

            <Card>
                <CardHeader>
                    <CardTitle>Acciones de mantenimiento</CardTitle>
                    <CardDescription>Consulte, cree, actualice o elimine inscripciones.</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-3 sm:flex-row sm:items-center">
                    <div className="flex flex-1 gap-2">
                        <Input
                            value={registrationId}
                            onChange={(event) => setRegistrationId(event.target.value)}
                            type="number"
                            min="1"
                            placeholder="ID de evento o usuario"
                            aria-label="ID de evento o usuario"
                        />
                        <Button variant="outline" onClick={() => handleGetById("event")}>
                            <Eye /> Por evento
                        </Button>
                        <Button variant="outline" onClick={() => handleGetById("user")}>
                            <Eye /> Por usuario
                        </Button>
                    </div>
                    <Button onClick={() => setCreateOpen(true)}>
                        <Plus /> Crear registro
                    </Button>
                </CardContent>
            </Card>

            <GetAllRegistration
                registrations={registrations}
                loading={loading}
                onRefresh={loadRegistrations}
                onView={openDetails}
                onUpdate={openUpdate}
                onDelete={(registration) => {
                    setSelectedRegistration(registration);
                    setDialog("delete");
                }}
            />

            <CreateRegistration
                open={createOpen}
                onOpenChange={setCreateOpen}
                onCreated={loadRegistrations}
            />

            <Dialog open={dialog === "details"} onOpenChange={(open) => !open && setDialog(null)}>
                <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
                    <DialogHeader>
                        <div className="flex items-start justify-between gap-4 pr-8">
                            <div>
                                <DialogTitle>Detalle de inscripción</DialogTitle>
                                <DialogDescription>
                                    Registro del {formatDate(selectedRegistration?.registeredAt)}
                                </DialogDescription>
                            </div>
                            <Badge variant="secondary">
                                <Ticket /> {selectedRegistration?.status?.name ?? `Estado ${selectedRegistration?.statusId}`}
                            </Badge>
                        </div>
                    </DialogHeader>

                    <div className="grid gap-4">
                        <section className="grid gap-3 rounded-lg border bg-muted/30 p-4">
                            <div className="flex items-center gap-2 font-medium"><CalendarDays className="size-4 text-primary" /> Evento</div>
                            <div className="grid gap-2 text-sm sm:grid-cols-2">
                                <p className="sm:col-span-2 font-medium">{selectedRegistration?.event?.title ?? `Evento #${selectedRegistration?.eventId}`}</p>
                                <p className="flex items-center gap-2 text-muted-foreground"><Clock3 className="size-4" /> {formatDate(selectedRegistration?.event?.date)}</p>
                                <p className="flex items-center gap-2 text-muted-foreground"><MapPin className="size-4" /> {selectedRegistration?.event?.location ?? "Ubicación no disponible"}</p>
                                {selectedRegistration?.event?.modality && <p className="text-muted-foreground">Modalidad: {selectedRegistration.event.modality}</p>}
                                {selectedRegistration?.event?.totalCapacity != null && <p className="text-muted-foreground">Cupo: {selectedRegistration.event.totalCapacity}</p>}
                                {selectedRegistration?.event?.description && <p className="sm:col-span-2 text-muted-foreground">{selectedRegistration.event.description}</p>}
                            </div>
                        </section>

                        <section className="grid gap-3 rounded-lg border p-4">
                            <div className="flex items-center gap-2 font-medium"><UserRound className="size-4 text-primary" /> Participante</div>
                            <div className="grid gap-2 text-sm sm:grid-cols-2">
                                <p className="font-medium">{selectedRegistration?.user?.fullName ?? `Usuario #${selectedRegistration?.userId}`}</p>
                                <p className="flex items-center gap-2 text-muted-foreground"><Mail className="size-4" /> {selectedRegistration?.user?.email ?? "Correo no disponible"}</p>
                            </div>
                        </section>

                        <div className="flex items-center gap-2 text-xs text-muted-foreground"><Info className="size-4" /> Evento #{selectedRegistration?.eventId} · Usuario #{selectedRegistration?.userId}</div>
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setDialog(null)}>Cerrar</Button>
                        <Button type="button" onClick={() => openUpdate(selectedRegistration)}><Pencil /> Actualizar estado</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <UpdateRegistration
                registration={selectedRegistration}
                open={dialog === "update"}
                onOpenChange={(open) => !open && setDialog(null)}
                onUpdated={loadRegistrations}
            />

            <DeleteRegistration
                registration={selectedRegistration}
                open={dialog === "delete"}
                onOpenChange={(open) => !open && setDialog(null)}
                onDeleted={async () => {
                    setSelectedRegistration(null);
                    await loadRegistrations();
                }}
            />
        </section>
    );
}