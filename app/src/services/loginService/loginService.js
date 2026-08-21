const API_URL = import.meta.env.VITE_API_URL;
const TOKEN_KEY = "eventutn_token";

async function request(path, options = {}) {
	let response;

	try {
		response = await fetch(`${API_URL}${path}`, {
			headers: {
				"Content-Type": "application/json",
				...options.headers,
			},
			...options,
		});
	} catch {
		throw new Error("No se pudo conectar con el servidor.");
	}

	const payload = await response.json().catch(() => ({}));

	if (!response.ok) {
		const validationMessage = payload.validationErrors?.[0]?.message;
		throw new Error(validationMessage || payload.message || "No se pudo iniciar sesión.");
	}

	return payload;
}

export async function loginUser(credentials) {
	const response = await request("/users/login", {
		method: "POST",
		body: JSON.stringify(credentials),
	});

	sessionStorage.setItem(TOKEN_KEY, response.data.token);
	return response.data;
}

export function getAuthToken() {
	return sessionStorage.getItem(TOKEN_KEY);
}

export function isAuthenticated() {
	return Boolean(getAuthToken());
}

export function logoutUser() {
	sessionStorage.removeItem(TOKEN_KEY);
}
