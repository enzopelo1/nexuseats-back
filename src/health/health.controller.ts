import { Controller, Get, VERSION_NEUTRAL } from '@nestjs/common';
import { SkipThrottle } from '@nestjs/throttler';
import * as net from 'net';
import { PrismaService } from '../prisma/prisma.service';

function parseAmqpHostPort(urlStr: string): { host: string; port: number } {
  try {
    const normalized = urlStr.replace(/^amqp\+?s?:\/\//i, 'http://');
    const u = new URL(normalized);
    return {
      host: u.hostname || 'localhost',
      port: u.port ? Number(u.port) : 5672,
    };
  } catch {
    return { host: 'localhost', port: 5672 };
  }
}

function tcpReachable(host: string, port: number, ms = 2000): Promise<boolean> {
  return new Promise((resolve) => {
    const socket = net.connect({ host, port });
    const done = (ok: boolean) => {
      socket.removeAllListeners();
      socket.destroy();
      resolve(ok);
    };
    socket.setTimeout(ms);
    socket.on('connect', () => done(true));
    socket.on('error', () => done(false));
    socket.on('timeout', () => done(false));
  });
}

@Controller({ path: 'health', version: VERSION_NEUTRAL })
export class HealthController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  @SkipThrottle()
  async check() {
    let database: 'up' | 'down' = 'down';
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      database = 'up';
    } catch {
      database = 'down';
    }

    const rabbitUrl =
      process.env.RABBITMQ_URL || 'amqp://nexuseats:secret@localhost:5672';
    const { host, port } = parseAmqpHostPort(rabbitUrl);
    const rabbitUp = await tcpReachable(host, port);

    const allUp = database === 'up' && rabbitUp;

    return {
      status: allUp ? 'ok' : 'degraded',
      services: {
        api: { status: 'up' as const },
        database: { status: database === 'up' ? ('up' as const) : ('down' as const) },
        rabbitmq: { status: rabbitUp ? ('up' as const) : ('down' as const) },
      },
    };
  }
}

