import { useEffect, useState } from 'react';
import axios from 'axios';
import InventorySummary from '../components/InventorySummary';
import StockChart from '../components/StockChart';

const Dashboard = () => {
    const [products, setProducts] = useState([]);
    const [sales, setSales] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:8000/products').then(res => setProducts(res.data));
        axios.get('http://localhost:8000/sales').then(res => setSales(res.data));
    }, []);

    const totalRevenue = sales.reduce((acc, sale) => acc + (sale.quantity * sale.unit_price), 0)
    const totalProfit = sales.reduce((acc, sale) => acc + (sale.quantity * (sale.unit_price - sale.unit_cost)),0)

    return (
        <div className="p-8">
            <h1 className="text-3xl font-black mb-8 text-gray-800">Control Tower</h1>
            <InventorySummary 
                totalProducts={products.length} 
                lowStockCount={products.filter(p => p.stock <= p.lead_time_days).length} 
                totalRevenue={totalRevenue}
                totalProfit={totalProfit}
            />
            <div className="mt-8 bg-white p-6 rounded-xl shadow-sm">
                <h2 className="text-xl font-bold mb-4">Stock anomalies</h2>
                <StockChart data={products} />
            </div>
        </div>
    );
};

export default Dashboard;