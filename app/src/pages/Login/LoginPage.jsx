import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ArrowRight, Eye, EyeOff, LockKeyhole, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { loginUser } from "@/services/loginService/loginService";
import logo from "@/assets/techevents_logo.png";

export function LoginPage() {
	const navigate = useNavigate();
	const location = useLocation();
	const [showPassword, setShowPassword] = useState(false);
	const [submitting, setSubmitting] = useState(false);
	const [error, setError] = useState("");

	async function handleSubmit(event) {
		event.preventDefault();
		setError("");
		setSubmitting(true);

		const formData = Object.fromEntries(new FormData(event.currentTarget));

		try {
			await loginUser({ email: formData.email, password: formData.password });
			navigate(location.state?.from?.pathname || "/", { replace: true });
		} catch (requestError) {
			setError(requestError.message);
		} finally {
			setSubmitting(false);
		}
	}

	return (
		<main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary/10 via-background to-secondary/15 px-4 py-10">
			<section className="grid w-full max-w-4xl overflow-hidden rounded-3xl border border-border/70 bg-card shadow-xl md:grid-cols-[0.9fr_1.1fr]">
				<div className="hidden flex-col justify-start bg-primary p-10 text-primary-foreground md:flex">
					<div className="-mx-9">
						<img src={logo} alt="TechEvents CR Logo" className="w-full h-auto object-cover" />
					</div>
					<div className="mt-3">
						<h1 className="text-xl font-bold leading-tight">Tus eventos, en un solo lugar.</h1>
						<p className="mt-4 text-sm leading-tight">Ingresa para descubrir diferentes actividades e inscribirte a tus eventos favoritos.</p>
					</div>
				</div>

				<div className="p-6 sm:p-10">
					<div className="mb-8 space-y-2">
						<h2 className="text-3xl font-bold tracking-tight">Bienvenido</h2>
						<p className="text-muted-foreground">Ingresa con tu cuenta para continuar.</p>
					</div>

					<form className="space-y-5" onSubmit={handleSubmit}>
						<label className="block space-y-2 text-sm font-medium">
							Correo electrónico
							<div className="relative">
								<Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
								<Input name="email" type="email" placeholder="tu@correo.com" className="h-11 pl-10" required autoComplete="email" />
							</div>
						</label>
						<label className="block space-y-2 text-sm font-medium">
							Contraseña
							<div className="relative">
								<LockKeyhole className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
								<Input name="password" type={showPassword ? "text" : "password"} placeholder="Mínimo 6 caracteres" className="h-11 pl-10 pr-10" required minLength={6} autoComplete="current-password" />
								<button type="button" onClick={() => setShowPassword((visible) => !visible)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground" aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}>
									{showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
								</button>
							</div>
						</label>
						{error && <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive" role="alert">{error}</p>}
						<Button type="submit" className="h-11 w-full" disabled={submitting}>
							{submitting ? "Ingresando..." : "Ingresar"}
							{!submitting && <ArrowRight className="ml-2 h-4 w-4" />}
						</Button>
					</form>

					<p className="mt-8 text-center text-sm text-muted-foreground">
						¿Todavía no tienes una cuenta? <Link to="/registro" className="font-semibold text-primary hover:underline">Registrate</Link>
					</p>
				</div>
			</section>
		</main>
	);
}
