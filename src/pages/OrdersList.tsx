import Layout from '../components/Layout';
import OrdersTable from '../components/OrdersTable';

export default function OrdersList() {
  return (
    <Layout>
      <div className="container-telco py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Órdenes de Trabajo</h1>
        <p className="text-gray-600 mb-6">
          Gestiona y visualiza todas las órdenes de trabajo
        </p>

        <OrdersTable />
      </div>
    </Layout>
  );
}
