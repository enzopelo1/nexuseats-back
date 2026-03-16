"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const restaurants_v2_service_1 = require("./restaurants-v2.service");
const prisma_service_1 = require("../../prisma/prisma.service");
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
describe('RestaurantsV2Service', () => {
    let service;
    let prisma;
    beforeEach(async () => {
        prisma = {
            restaurant: {
                findMany: jest.fn(),
                count: jest.fn(),
                findFirst: jest.fn(),
                create: jest.fn(),
                update: jest.fn(),
                findUnique: jest.fn(),
            },
        };
        const module = await testing_1.Test.createTestingModule({
            providers: [
                restaurants_v2_service_1.RestaurantsV2Service,
                { provide: prisma_service_1.PrismaService, useValue: prisma },
            ],
        }).compile();
        service = module.get(restaurants_v2_service_1.RestaurantsV2Service);
    });
    describe('findAll', () => {
        it('retourne la liste paginée des restaurants', async () => {
            prisma.restaurant.findMany.mockResolvedValue([{ id: '1', name: 'R1' }]);
            prisma.restaurant.count.mockResolvedValue(1);
            const result = await service.findAll(1, 10);
            expect(prisma.restaurant.findMany).toHaveBeenCalledTimes(1);
            expect(prisma.restaurant.count).toHaveBeenCalledTimes(1);
            expect(result.data).toHaveLength(1);
            expect(result.meta.total).toBe(1);
            expect(result.meta.page).toBe(1);
            expect(result.meta.limit).toBe(10);
        });
    });
    describe('findOne', () => {
        it('retourne un restaurant existant', async () => {
            const restaurant = { id: '1', name: 'R1' };
            prisma.restaurant.findFirst.mockResolvedValue(restaurant);
            const result = await service.findOne('1');
            expect(prisma.restaurant.findFirst).toHaveBeenCalledWith({
                where: { id: '1', deletedAt: null },
                include: expect.any(Object),
            });
            expect(result).toBe(restaurant);
        });
        it('lève NotFoundException si restaurant inexistant', async () => {
            prisma.restaurant.findFirst.mockResolvedValue(null);
            await expect(service.findOne('unknown-id')).rejects.toBeInstanceOf(common_1.NotFoundException);
        });
    });
    describe('create', () => {
        const baseDto = {
            name: 'Chez Test',
            address: {
                street: '10 Rue Test',
                city: 'Paris',
                zipCode: '75001',
                country: 'FR',
            },
            countryCode: '+33',
            localNumber: '612345678',
            cuisineType: client_1.CuisineType.ITALIAN,
            averagePrice: 25,
            deliveryTime: 30,
            phone: '+33612345678',
            email: 'test@example.com',
        };
        it('crée un restaurant quand il est unique', async () => {
            prisma.restaurant.findFirst.mockResolvedValue(null);
            prisma.restaurant.create.mockResolvedValue({ id: '1', ...baseDto });
            const result = await service.create(baseDto, 42);
            expect(prisma.restaurant.findFirst).toHaveBeenCalledTimes(1);
            expect(prisma.restaurant.create).toHaveBeenCalledTimes(1);
            expect(result.id).toBe('1');
        });
        it('lève ConflictException si nom + adresse déjà utilisés', async () => {
            prisma.restaurant.findFirst.mockResolvedValue({ id: 'existing-id' });
            await expect(service.create(baseDto, 42)).rejects.toBeInstanceOf(common_1.ConflictException);
            expect(prisma.restaurant.create).not.toHaveBeenCalled();
        });
    });
    describe('update', () => {
        const id = 'resto-id';
        it('met à jour un restaurant existant', async () => {
            prisma.restaurant.findFirst
                .mockResolvedValueOnce({
                id,
                name: 'Old',
                address: 'Old address',
                deletedAt: null,
            })
                .mockResolvedValueOnce(null);
            prisma.restaurant.update.mockResolvedValue({ id, name: 'New name' });
            const result = await service.update(id, { name: 'New name' });
            expect(prisma.restaurant.update).toHaveBeenCalledTimes(1);
            expect(result.name).toBe('New name');
        });
        it('lève NotFoundException si restaurant inexistant', async () => {
            prisma.restaurant.findFirst.mockResolvedValue(null);
            await expect(service.update('unknown-id', { name: 'New' })).rejects.toBeInstanceOf(common_1.NotFoundException);
            expect(prisma.restaurant.update).not.toHaveBeenCalled();
        });
        it('lève ConflictException si doublon de nom + adresse', async () => {
            prisma.restaurant.findFirst
                .mockResolvedValueOnce({
                id,
                name: 'Old',
                address: 'Old address',
                deletedAt: null,
            })
                .mockResolvedValueOnce({ id: 'other-id' });
            await expect(service.update(id, {
                name: 'New',
                address: {
                    street: '10 Rue Test',
                    city: 'Paris',
                    zipCode: '75001',
                    country: 'FR',
                },
            })).rejects.toBeInstanceOf(common_1.ConflictException);
            expect(prisma.restaurant.update).not.toHaveBeenCalled();
        });
    });
    describe('remove', () => {
        const id = 'resto-id';
        it('soft-delete un restaurant existant', async () => {
            prisma.restaurant.findFirst.mockResolvedValue({ id, deletedAt: null });
            prisma.restaurant.update.mockResolvedValue({ id, deletedAt: new Date() });
            await service.remove(id);
            expect(prisma.restaurant.findFirst).toHaveBeenCalledTimes(1);
            expect(prisma.restaurant.update).toHaveBeenCalledTimes(1);
        });
        it('lève NotFoundException si restaurant inexistant', async () => {
            prisma.restaurant.findFirst.mockResolvedValue(null);
            await expect(service.remove('unknown-id')).rejects.toBeInstanceOf(common_1.NotFoundException);
            expect(prisma.restaurant.update).not.toHaveBeenCalled();
        });
    });
});
//# sourceMappingURL=restaurants-v2.service.spec.js.map