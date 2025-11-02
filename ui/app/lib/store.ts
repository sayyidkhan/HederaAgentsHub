import { create } from 'zustand';
import { Order, ProcessStep, HcsEvent, Invoice } from './types';

interface OrderStore {
  ordersById: Record<string, Order>;
  stepperByOrderId: Record<string, ProcessStep[]>;
  timelinesByOrderId: Record<string, HcsEvent[]>;
  invoicesByOrderId: Record<string, Invoice>;
  
  // Actions
  createOrder: (order: Order) => void;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  setSteps: (orderId: string, steps: ProcessStep[]) => void;
  setTimeline: (orderId: string, events: HcsEvent[]) => void;
  setInvoice: (orderId: string, invoice: Invoice) => void;
  updateInvoiceStatus: (orderId: string, status: Invoice['status'], txId?: string) => void;
  markPaid: (orderId: string, txId: string) => void;
}

export const useOrderStore = create<OrderStore>((set) => ({
  ordersById: {},
  stepperByOrderId: {},
  timelinesByOrderId: {},
  invoicesByOrderId: {},
  
  createOrder: (order) =>
    set((state) => ({
      ordersById: { ...state.ordersById, [order.id]: order },
    })),
  
  updateOrderStatus: (orderId, status) =>
    set((state) => ({
      ordersById: {
        ...state.ordersById,
        [orderId]: {
          ...state.ordersById[orderId],
          status,
          updatedAt: new Date(),
        },
      },
    })),
  
  setSteps: (orderId, steps) =>
    set((state) => ({
      stepperByOrderId: { ...state.stepperByOrderId, [orderId]: steps },
    })),
  
  setTimeline: (orderId, events) =>
    set((state) => ({
      timelinesByOrderId: { ...state.timelinesByOrderId, [orderId]: events },
    })),
  
  setInvoice: (orderId, invoice) =>
    set((state) => ({
      invoicesByOrderId: { ...state.invoicesByOrderId, [orderId]: invoice },
    })),
  
  updateInvoiceStatus: (orderId, status, txId) =>
    set((state) => ({
      invoicesByOrderId: {
        ...state.invoicesByOrderId,
        [orderId]: {
          ...state.invoicesByOrderId[orderId],
          status,
          ...(txId && { txId }),
        },
      },
    })),
  
  markPaid: (orderId, txId) =>
    set((state) => ({
      invoicesByOrderId: {
        ...state.invoicesByOrderId,
        [orderId]: {
          ...state.invoicesByOrderId[orderId],
          status: 'paid',
          txId,
          hashscanUrl: `https://hashscan.io/testnet/transaction/${txId}`,
        },
      },
    })),
}));

