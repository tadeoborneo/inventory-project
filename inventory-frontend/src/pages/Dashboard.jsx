import { useEffect, useState } from 'react';
import axios from 'axios';
import InventorySummary from '../components/InventorySummary';
import StockChart from '../components/StockChart';

const Dashboard = () => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:8000/products').then(res => setProducts(res.data));
    }, []);

    return (
        <div className="p-8">
            <h1 className="text-3xl font-black mb-8 text-gray-800">Torre de Control</h1>
            <InventorySummary 
                totalProducts={products.length} 
                lowStockCount={products.filter(p => p.stock <= p.lead_time_days).length} 
            />
            <div className="mt-8 bg-white p-6 rounded-xl shadow-sm">
                <h2 className="text-xl font-bold mb-4">Stock anomalies</h2>
                <StockChart data={products} />
            </div>
        </div>
    );
};

export default Dashboard;