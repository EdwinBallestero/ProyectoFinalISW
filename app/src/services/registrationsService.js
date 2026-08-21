const API_URL = import.meta.env.VITE_API_URL;

async function request(path, options) {
    const response = await fetch(`${API_URL}${path}`, options);
    const isJson = response.headers.get("content-type")?.includes("application/json");
    const payload = isJson ? await response.json() : null;

    if (!response.ok) {
        const validationMessage = payload?.validationErrors
            ?.map(({ message }) => message)
            .join(" ");
        throw new Error(
            validationMessage || payload?.message || "No se pudo completar la operación de inscripción."
        );
    }

    return response.status === 204 ? null : payload;
}

export function getRegistrations() {
    return request("/registrations");
}

export function getRegistrationsByUser(userName) {
    return request(`/registrations/user/${encodeURIComponent(userName)}`);
}

export function getRegistrationsByEvent(eventTitle) {
    return request(`/registrations/event/${encodeURIComponent(eventTitle)}`);
}

export function getRegistrationEvents() {
    return request("/events");
}

export function getRegistrationUsers() {
    return request("/users");
}

export function getRegistrationStatuses() {
    return request("/registration-statuses");
}

export function createRegistration(registration) {
    return request("/registrations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(registration),
    });
}

export function updateRegistration(eventId, userId, registration) {
    return request(`/registrations/${eventId}/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(registration),
    });
}

export function deleteRegistration(eventId, userId) {
    return request(`/registrations/${eventId}/${userId}`, { method: "DELETE" });
}