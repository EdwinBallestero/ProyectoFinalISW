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

    async obtenerPorUsuario(userId: number) {
        return await prisma.registration.findMany({
            where: { userId },
            include: {
                event: true,
                status: true,
            },
            orderBy: {
                registeredAt: "desc",
            },
        });
    },

    async obtenerPorEvento(eventId: number) {
        return await prisma.registration.findMany({
            where: { eventId },
            include: {
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