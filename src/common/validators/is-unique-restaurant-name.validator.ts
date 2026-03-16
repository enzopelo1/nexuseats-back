import { Injectable } from '@nestjs/common';
import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
@ValidatorConstraint({ async: true })
export class IsUniqueRestaurantNameConstraint
  implements ValidatorConstraintInterface
{
  constructor(private readonly prisma: PrismaService) {}

  async validate(value: any): Promise<boolean> {
    if (typeof value !== 'string' || !value.trim()) {
      return false;
    }

    const existing = await this.prisma.restaurant.findFirst({
      where: {
        name: {
          equals: value,
          mode: 'insensitive',
        },
        deletedAt: null,
      },
      select: { id: true },
    });

    return !existing;
  }

  defaultMessage(args?: ValidationArguments): string {
    return `Un restaurant avec le nom "${args?.value}" existe déjà`;
  }
}

export function IsUniqueRestaurantName(
  validationOptions?: ValidationOptions,
): PropertyDecorator {
  return (object: Object, propertyName: string | symbol) => {
    registerDecorator({
      name: 'IsUniqueRestaurantName',
      target: object.constructor,
      propertyName: propertyName as string,
      options: validationOptions,
      validator: IsUniqueRestaurantNameConstraint,
    });
  };
}

