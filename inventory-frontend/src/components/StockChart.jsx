import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';

const StockChart = ({ data }) => {
    const chartData = data.map(p => ({
        name: p.name,
        stock: p.stock,
        threshold: p.lead_time_days  
    }));
    const criticalData = [...data].sort((a,b) => a.stock - b.stock).slice(0,10)


    return (
        <div className="bg-white p-6 rounded-xl shadow-md mb-8 h-80">
            <h3 className="text-lg font-bold mb-4 text-gray-700">Inventory State by Product</h3>
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={criticalData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="stock" fill="#3b82f6" name="Stock" />
                    <Bar dataKey="threshold" fill="#ef4444" name="Reorder Threshold" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default StockChart;