import { Compass, Home, ArrowLeft, MapPin } from "lucide-react";

export default function NotFoundPage() {
    return (
        <div className="min-h-screen w-full bg-stone-100 dark:bg-stone-950 flex items-center justify-center px-4 py-16 transition-colors">
            <div className="relative w-full max-w-2xl">
                <div className="flex justify-center mb-8">
                    <div className="flex items-center gap-2 rounded-full bg-white dark:bg-stone-900 px-4 py-1.5 shadow-sm ring-1 ring-black/5 dark:ring-white/10">
                        <Compass className="w-4 h-4 text-primary dark:text-primary" />
                        <span className="text-[11px] font-semibold tracking-[0.15em] text-primary-700 dark:text-primary uppercase">
                            Ruta no encontrada
                        </span>
                    </div>
                </div>
                <div className="relative bg-white dark:bg-stone-900 rounded-[28px] shadow-xl shadow-black/6 dark:shadow-black/30 ring-1 ring-black/5 dark:ring-white/10 px-8 py-14 md:px-16 md:py-16 overflow-hidden transition-colors">
                    <svg
                        viewBox="0 0 400 140"
                        className="absolute left-1/2 top-8 -translate-x-1/2 w-[85%] max-w-sm h-auto text-stone-300 dark:text-stone-700"
                        fill="none"
                    >
                        <path
                            d="M 20 20 C 100 10, 140 60, 200 55 S 300 40, 340 90"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeDasharray="1 10"
                            strokeLinecap="round"
                        />
                        <circle
                            cx="20"
                            cy="20"
                            r="5"
                            className="fill-emerald-700 dark:fill-emerald-400"
                        />
                    </svg>

                    <div className="relative pt-20 md:pt-24 flex flex-col items-center text-center">
                        <div className="relative mb-6">
                            <MapPin
                                className="w-11 h-11 text-orange-600 dark:text-orange-400"
                                strokeWidth={1.75}
                            />
                            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 text-[9px] font-bold">
                                !
                            </span>
                        </div>

                        <h1 className="text-[64px] md:text-8xl font-black text-stone-900 dark:text-stone-50 leading-none tracking-tight">
                            404
                        </h1>
                        <p className="mt-4 text-lg md:text-xl font-semibold text-stone-900 dark:text-stone-50">
                            Nos perdimos en el camino
                        </p>
                        <p className="mt-3 text-sm md:text-base text-stone-500 dark:text-stone-400 max-w-sm leading-relaxed">
                            No encontramos esta dirección. Puede que el enlace esté roto o
                            que la página se haya movido de lugar.
                        </p>
                        <div className="mt-10 flex flex-wrap justify-center gap-3">
                            <a
                                href="/"
                                className="inline-flex items-center gap-2 rounded-full bg-stone-900 dark:bg-stone-100 px-6 py-2.5 text-sm font-semibold text-white dark:text-stone-900 transition-colors hover:bg-stone-700 dark:hover:bg-white"
                            >
                                <Home className="w-4 h-4" />
                                Ir al inicio
                            </a>
                            <a
                                href="/events"
                                className="inline-flex items-center gap-2 rounded-full border border-stone-900/15 dark:border-white/15 px-6 py-2.5 text-sm font-semibold text-stone-900 dark:text-stone-100 transition-colors hover:bg-stone-900/5 dark:hover:bg-white/10"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                Ver eventos
                            </a>
                        </div>
                    </div>
                </div>

                <p className="mt-8 text-center text-xs text-stone-400 dark:text-stone-600 tracking-wide">
                    Código de error: 404 · Recurso inexistente
                </p>
            </div>
        </div>
    );
}
