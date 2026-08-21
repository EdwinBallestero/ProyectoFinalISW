import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Eye, EyeOff, LockKeyhole, Mail, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { registerUser } from "@/services/loginService/usersService/userService";

export function UsersPage() {
	const navigate = useNavigate();
	const [showPassword, setShowPassword] = useState(false);
	const [submitting, setSubmitting] = useState(false);
	const [error, setError] = useState("");

	async function handleSubmit(event) {
		event.preventDefault();
		setError("");
		setSubmitting(true);
		const formData = Object.fromEntries(new FormData(event.currentTarget));

		if (formData.password !== formData.confirmPassword) {
			setError("Las contraseñas no coinciden.");
			setSubmitting(false);
			return;
		}

		try {
			await registerUser({ email: formData.email, password: formData.password, fullName: formData.fullName });
			navigate("/login", { replace: true, state: { registered: true } });
		} catch (requestError) {
			setError(requestError.message);
		} finally {
			setSubmitting(false);
		}
	}

	return (
		<main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-secondary/15 via-background to-primary/10 px-4 py-10">
			<section className="w-full max-w-lg rounded-3xl border border-border/70 bg-card p-6 shadow-xl sm:p-10">
				<Link to="/login" className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="h-4 w-4" /> Volver al inicio de sesión</Link>
				<div className="mb-8 flex items-start gap-4">
					<div><p className="mt-1 text-xl font-bold tracking-tight">Regístrate para acceder a TechEvents CR.</p></div>
				</div>
				<form className="space-y-5" onSubmit={handleSubmit}>
					<label className="block space-y-2 text-sm font-medium">Nombre completo<div className="relative"><UserRound className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><Input name="fullName" type="text" placeholder="Nombre Apellidos" className="h-11 pl-10" required minLength={3} autoComplete="name" /></div></label>
					<label className="block space-y-2 text-sm font-medium">Correo electrónico<div className="relative"><Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><Input name="email" type="email" placeholder="correo@gmail.com" className="h-11 pl-10" required autoComplete="email" /></div></label>
					<label className="block space-y-2 text-sm font-medium">Contraseña<div className="relative"><LockKeyhole className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><Input name="password" type={showPassword ? "text" : "password"} placeholder="Mínimo 6 caracteres" className="h-11 pl-10 pr-10" required minLength={6} autoComplete="new-password" /><button type="button" onClick={() => setShowPassword((visible) => !visible)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground" aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}>{showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button></div></label>
					<label className="block space-y-2 text-sm font-medium">Confirmar contraseña<div className="relative"><LockKeyhole className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><Input name="confirmPassword" type={showPassword ? "text" : "password"} placeholder="Ingresa nuevamente la contraseña" className="h-11 pl-10 pr-10" required minLength={6} autoComplete="new-password" /></div></label>
					{error && <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive" role="alert">{error}</p>}
					<Button type="submit" className="h-11 w-full" disabled={submitting}>{submitting ? "Creando cuenta..." : "Crear cuenta"}</Button>
				</form>
			</section>
		</main>
	);
}
