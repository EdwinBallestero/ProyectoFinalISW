import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import { CalendarDays, Clock3, Info, Mail, MapPin, Ticket, UserRound } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
//import { ListToolbar } from "@/components/ListToolbar";
import { CreateRegistration } from "./CreateRegistration";
import { DeleteRegistration } from "./DeleteRegistration";
import { RegistrationList } from "@/components/Registrations/RegistrationList";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { UpdateRegistration } from "./UpdateRegistration";
import { getRegistrations } from "@/services/registrationsService";
import { SearchBar } from "@/components/SearchBar";

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
    const location = useLocation();
    const [registrations, setRegistrations] = useState([]);
    const [selectedRegistration, setSelectedRegistration] = useState(null);
    const [dialog, setDialog] = useState(null);
    const [createOpen, setCreateOpen] = useState(false);
    const [registrationSearch, setRegistrationSearch] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    
    async function loadRegistrations() {
        try {
            setLoading(true);
            const response = await getRegistrations();
                setRegistrations(response?.data ?? response ?? []);
        } catch (error) {
            toast.error(error.message);
            setError(error);
        } finally {
            setLoading(false);
        }
    }
    useEffect(() => {    
        loadRegistrations();
    }, []);

    useEffect(() => {
        if (location.state?.openCreate) {
            setCreateOpen(true);
            window.history.replaceState({}, "");
        }
    }, [location.state]);

    const filteredRegistrations = registrations.filter((registration) =>
        (registration.event?.title ?? "").toLowerCase().includes(registrationSearch.toLowerCase()) ||
        (registration.user?.fullName ?? "").toLowerCase().includes(registrationSearch.toLowerCase())
    );
    if (loading) {
        return (
            <p className="text-center text-muted-foreground">
                Cargando inscripciones...
            </p>
        );
    }
    if (error) {
        return (
            <Alert variant="destructive">
                <AlertDescription>{error?.message ?? "Ocurrió un error."}</AlertDescription>
            </Alert>
        );
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
                description={filteredRegistrations.length}
                isBadge={true}
            />

            <SearchBar
                value={registrationSearch}
                onChange={setRegistrationSearch}
                placeholder="Buscar por evento o usuario"
            />

            <RegistrationList
                registrations={filteredRegistrations}
                loading={loading}
                onView={openDetails}
                onUpdate={openUpdate}
                createLabel="Nueva inscripción"
                onCreate={() => setCreateOpen(true)}
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
                        {/* <Button type="button" onClick={() => openUpdate(selectedRegistration)}><Pencil /> Actualizar estado</Button> */}
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