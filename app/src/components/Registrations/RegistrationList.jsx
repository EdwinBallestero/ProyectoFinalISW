import PropTypes from "prop-types";
import { ClipboardList, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RegistrationCard } from "@/components/Registrations/RegistrationCard";
import { Button } from "@/components/ui/button";

export function RegistrationList({
    registrations,
    loading,
    onView,
    onUpdate,
    onDelete,
    onCreate,
    createLabel,
}) {
return (
    <Card>
        <CardHeader>
        <div className="py-3">
            <CardTitle className="flex items-center gap-2 text-xl">
                <ClipboardList className="h-6 w-6" /> Listado de inscripciones
            </CardTitle>
            {onCreate && (
				<div className="flex justify-end -mt-8 h-2">
                    <Button size="lg" onClick={onCreate}>
                        <Plus /> {createLabel}
                    </Button>
                </div>
            )}
        </div>
        </CardHeader>
        <CardContent className="space-y-3 p-10">
        {!loading && registrations.length === 0 && (
            <p className="text-sm text-muted-foreground">
            No hay inscripciones para mostrar.
            </p>
        )}
        {registrations.map((registration, index) => (
            <RegistrationCard
                key={`${registration.eventId}-${registration.userId}`}
                registration={registration}
                index={index}
                onView={onView}
                onUpdate={onUpdate}
                onDelete={onDelete}
            />
        ))}
        </CardContent>
    </Card>
);
}

RegistrationList.propTypes = {
    registrations: PropTypes.array.isRequired,
    loading: PropTypes.bool.isRequired,
    onView: PropTypes.func.isRequired,
    onUpdate: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
    onCreate: PropTypes.func,
    createLabel: PropTypes.string,
};
