import { ValidationArguments, ValidationOptions, ValidatorConstraintInterface } from 'class-validator';
import { PrismaService } from '../../prisma/prisma.service';
export declare class IsUniqueRestaurantNameConstraint implements ValidatorConstraintInterface {
    private readonly prisma;
    constructor(prisma: PrismaService);
    validate(value: any): Promise<boolean>;
    defaultMessage(args?: ValidationArguments): string;
}
export declare function IsUniqueRestaurantName(validationOptions?: ValidationOptions): PropertyDecorator;
