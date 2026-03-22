import type { DocumentReference } from 'firebase/firestore';
import type { CartItem } from '../../domains/cart/types/cart.types';

export interface HistoryOrder {
  id?: string;
  uid: string;
  items: CartItem[];
  totalPrice: number;
  orderDate: number;
  ref?: DocumentReference;
  _path?: string;
  status: 'cooking' | 'ready' | 'in_delivery' | 'delivered';
}
