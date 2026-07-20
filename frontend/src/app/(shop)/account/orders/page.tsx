import { Suspense } from 'react';
import MyOrdersScreen from './components/my-orders-screen';

export default function MyOrdersPage() {
  return (
    <Suspense>
      <MyOrdersScreen />
    </Suspense>
  );
}
