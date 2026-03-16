import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import * as dotenv from 'dotenv';

// Charger les variables d'environnement
dotenv.config();

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    const pool = new Pool({ 
      connectionString: process.env.DATABASE_URL || 'postgresql://nexuseats:nexuseats_dev@localhost:5432/nexuseats'
    });
    const adapter = new PrismaPg(pool);
    
    super({
      adapter,
      log: ['query', 'info', 'warn', 'error'],
    });
  }

  async onModuleInit() {
    await this.$connect();
    console.log('✅ Prisma connecté à PostgreSQL');
  }

  async onModuleDestroy() {
    await this.$disconnect();
    console.log('❌ Prisma déconnecté de PostgreSQL');
  }

  async cleanDatabase() {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('Cannot clean database in production');
    }

    const models = Reflect.ownKeys(this).filter(
      (key) => key[0] !== '_' && key !== 'constructor',
    );

    return Promise.all(
      models.map((modelKey) => {
        const model = this[modelKey as keyof this];
        if (typeof model === 'object' && model !== null && 'deleteMany' in model) {
          return (model as any).deleteMany();
        }
      }),
    );
  }
}
