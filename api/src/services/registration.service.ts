import { prisma } from "../config/prisma";

export const registrationService = {
    async listar() {
        return await prisma.registration.findMany({
            include: {
                event: true,
                user: true,
                status: true,
            },
            orderBy: {
                registeredAt: "desc",
            },
        });
    },

    async obtenerPorUsuario(userName: string) {
        return await prisma.registration.findMany({
            where: {
                user: {
                    fullName: {
                        contains: userName,
                    },
                },
            },
            include: {
                event: true,
                user: true,
                status: true,
            },
            orderBy: {
                registeredAt: "desc",
            },
        });
    },

    async obtenerPorEvento(eventTitle: string) {
        return await prisma.registration.findMany({
            where: {
                event: {
                    title: {
                        contains: eventTitle,
                    },
                },
            },
            include: {
                event: true,
                user: true,
                status: true,
            },
            orderBy: {
                registeredAt: "desc",
            },
        });
    },

    async crear(data: {
        eventId: number;
        userId: number;
        statusId?: number;
    }) {
        return await prisma.registration.create({
            data: {
                eventId: data.eventId,
                userId: data.userId,
                statusId: data.statusId ?? 1,
            },
            include: {
                event: true,
                user: true,
                status: true,
            },
        });
    },

    async modificar(
        eventId: number,
        userId: number,
        data: {
            statusId: number;
        }
    ) {
        return await prisma.registration.update({
            where: {
                eventId_userId: {
                    eventId,
                    userId,
                },
            },
            data: {
                statusId: data.statusId,
            },
            include: {
                event: true,
                user: true,
                status: true,
            },
        });
    },

    async eliminar(eventId: number, userId: number) {
        return await prisma.registration.delete({
            where: {
                eventId_userId: {
                    eventId,
                    userId,
                },
            },
        });
    },
};