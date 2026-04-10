declare const ORDER_STATUSES: readonly ["PENDING", "ACCEPTED", "PREPARING", "READY", "DELIVERED", "CANCELLED"];
export type OrderStatusDto = (typeof ORDER_STATUSES)[number];
export declare class UpdateOrderStatusDto {
    status: OrderStatusDto;
}
export {};
