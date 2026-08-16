const API_URL = import.meta.env.VITE_API_URL;

export async function registerUser(userData) {
	let response;

	try {
		response = await fetch(`${API_URL}/users/register`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(userData),
		});
	} catch {
		throw new Error("No se pudo conectar con el servidor.");
	}

	const payload = await response.json().catch(() => ({}));

	if (!response.ok) {
		const validationMessage = payload.validationErrors?.[0]?.message;
		throw new Error(validationMessage || payload.message || "No se pudo registrar el usuario.");
	}

	return payload.data;
}
