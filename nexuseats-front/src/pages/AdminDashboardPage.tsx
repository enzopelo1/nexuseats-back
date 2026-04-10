import { useEffect, useState } from 'react';
import api from '@/services/api';
import { orderService } from '@/services/order.service';
import { Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

const STATUS_LABELS: Record<string, string> = {
  PENDING: 'En attente',
  ACCEPTED: 'Acceptee',
  CONFIRMED: 'Confirmee',
  PREPARING: 'En preparation',
  READY: 'Prete',
  PICKED_UP: 'Recuperee',
  DELIVERING: 'En livraison',
  DELIVERED: 'Livree',
  CANCELLED: 'Annulee',
};

/** Enchainement standard cote API (orders-service / UpdateOrderStatusDto). */
const ORDER_STATUS_FLOW = [
  'PENDING',
  'ACCEPTED',
  'PREPARING',
  'READY',
  'DELIVERED',
] as const;

function getNextOrderStatus(status: string): string | null {
  if (status === 'CANCELLED') return null;
  const i = ORDER_STATUS_FLOW.indexOf(status as (typeof ORDER_STATUS_FLOW)[number]);
  if (i < 0 || i >= ORDER_STATUS_FLOW.length - 1) return null;
  return ORDER_STATUS_FLOW[i + 1];
}

function canCancelOrderStatus(status: string): boolean {
  return status !== 'CANCELLED' && status !== 'DELIVERED';
}

const chartOptionsBar = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
  },
  scales: {
    y: { beginAtZero: true },
    x: { grid: { display: false } },
  },
} as const;

const chartOptionsDoughnut = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { position: 'bottom' as const, labels: { boxWidth: 12 } },
  },
} as const;

export interface DashboardStatsPayload {
  totalOrders: number;
  totalRevenue: number;
  totalRestaurants: number;
  totalUsers: number;
  ordersByStatus: { status: string; count: number }[];
  revenueByDay: { date: string; revenue: number }[];
  recentOrders: {
    id: string;
    restaurant: { name: string };
    totalAmount: number;
    status: string;
    createdAt: string;
  }[];
}

export function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStatsPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const load = async (background = false) => {
      if (!background) {
        setLoading(true);
        setError(null);
      }
      try {
        const { data } = await api.get<DashboardStatsPayload>('/v1/admin/stats/dashboard');
        if (!cancelled) setStats(data);
      } catch (e: unknown) {
        const status = (e as { response?: { status?: number } })?.response?.status;
        const msg =
          status === 403
            ? 'Acces refuse (compte admin requis).'
            : 'Impossible de charger le tableau de bord.';
        if (!cancelled && !background) setError(msg);
      } finally {
        if (!cancelled && !background) setLoading(false);
      }
    };
    load();
    const t = setInterval(() => load(true), 30_000);
    return () => {
      cancelled = true;
      clearInterval(t);
    };
  }, []);

  const advanceOrder = async (orderId: string, status: string) => {
    setActionMessage(null);
    setUpdatingOrderId(orderId);
    try {
      await orderService.updateStatus(orderId, status);
      const { data } = await api.get<DashboardStatsPayload>('/v1/admin/stats/dashboard');
      setStats(data);
      setActionMessage('Statut mis a jour.');
    } catch {
      setActionMessage('Impossible de mettre a jour la commande (droits ou service indisponible).');
    } finally {
      setUpdatingOrderId(null);
    }
  };

  if (loading) return <div className="loading">Chargement du dashboard...</div>;
  if (error) return <div className="error-banner">{error}</div>;
  if (!stats) return <div className="empty-state">Pas de donnees</div>;

  const revenueByDay = Array.isArray(stats.revenueByDay) ? stats.revenueByDay : [];
  const ordersByStatus = Array.isArray(stats.ordersByStatus) ? stats.ordersByStatus : [];

  const revenueChartData = {
    labels: revenueByDay.map((d) =>
      new Date(d.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }),
    ),
    datasets: [
      {
        label: 'Revenus (EUR)',
        data: revenueByDay.map((d) => Number(d.revenue) || 0),
        backgroundColor: '#ff6b35',
        borderRadius: 4,
      },
    ],
  };

  const statusChartData = {
    labels: ordersByStatus.map((s) => STATUS_LABELS[s.status] || s.status),
    datasets: [
      {
        data: ordersByStatus.map((s) => Number(s.count) || 0),
        backgroundColor: [
          '#ffd93d',
          '#6bcb77',
          '#4d96ff',
          '#ff6b6b',
          '#a66cff',
          '#ff9f43',
          '#2ed573',
          '#e84393',
        ],
      },
    ],
  };

  return (
    <div className="page">
      <h1>Dashboard Admin</h1>
      {actionMessage ? (
        <p className={actionMessage.startsWith('Impossible') ? 'error-banner' : 'empty-state'}>
          {actionMessage}
        </p>
      ) : null}

      <div className="stats-cards">
        <div className="stat-card">
          <span className="stat-value">{stats.totalOrders}</span>
          <span className="stat-label">Commandes</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">{stats.totalRevenue.toFixed(0)} EUR</span>
          <span className="stat-label">Revenus (commandes)</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">{stats.totalRestaurants}</span>
          <span className="stat-label">Restaurants</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">{stats.totalUsers}</span>
          <span className="stat-label">Utilisateurs</span>
        </div>
      </div>

      <div className="charts-grid">
        <div className="chart-container">
          <h2>Revenus par jour (7 jours)</h2>
          <div className="chart-canvas-wrap">
            <Bar data={revenueChartData} options={chartOptionsBar} />
          </div>
        </div>
        <div className="chart-container">
          <h2>Commandes par statut</h2>
          {ordersByStatus.length > 0 ? (
            <div className="chart-canvas-wrap">
              <Doughnut data={statusChartData} options={chartOptionsDoughnut} />
            </div>
          ) : (
            <p className="empty-state">Aucune commande en memoire (microservice Orders).</p>
          )}
        </div>
      </div>

      <div className="recent-orders">
        <h2>Commandes recentes</h2>
        {stats.recentOrders.length === 0 ? (
          <p className="empty-state">Aucune commande recente.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Restaurant</th>
                <th>Montant</th>
                <th>Statut</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentOrders.map((order) => {
                const next = getNextOrderStatus(order.status);
                const busy = updatingOrderId === order.id;
                return (
                  <tr key={order.id}>
                    <td>{order.id}</td>
                    <td>{order.restaurant.name}</td>
                    <td>{order.totalAmount.toFixed(2)} EUR</td>
                    <td>
                      <span className={`order-status status-${order.status.toLowerCase()}`}>
                        {STATUS_LABELS[order.status] || order.status}
                      </span>
                    </td>
                    <td>
                      {new Date(order.createdAt).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                        {next ? (
                          <button
                            type="button"
                            className="btn-primary"
                            disabled={busy}
                            onClick={() => advanceOrder(order.id, next)}
                          >
                            {busy ? '...' : `Vers: ${STATUS_LABELS[next] || next}`}
                          </button>
                        ) : null}
                        {canCancelOrderStatus(order.status) ? (
                          <button
                            type="button"
                            className="btn-danger"
                            disabled={busy}
                            onClick={() => {
                              if (window.confirm('Annuler cette commande ?')) {
                                advanceOrder(order.id, 'CANCELLED');
                              }
                            }}
                          >
                            Annuler
                          </button>
                        ) : null}
                        {!next && !canCancelOrderStatus(order.status) ? (
                          <span className="empty-state">—</span>
                        ) : null}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
