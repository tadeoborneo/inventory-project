import { 
    BarChart, Bar, XAxis, YAxis, CartesianGrid, 
    Tooltip, Legend, ResponsiveContainer, Cell 
} from 'recharts';

const StockChart = ({ data }) => {

    const formattedData = data.map(p => ({
        name: p.name,
        stock: p.stock,
        threshold: p.lead_time_days  
    })).sort((a, b) => (a.stock / a.threshold) - (b.stock / b.threshold));

   
    const chartHeight = Math.max(300, formattedData.length * 40);

    return (
        <div className="bg-white p-6 rounded-xl shadow-md mb-8">
            <h3 className="text-lg font-bold mb-4 text-gray-700">Detailed Inventory Status</h3>
            
            
            <div style={{ height: '450px', overflowY: 'auto' }} className="pr-2">
                <div style={{ height: `${chartHeight}px`, width: '100%' }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart 
                            data={formattedData} 
                            layout="vertical" 
                            margin={{ left: 50, right: 30 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                            
                            
                            <XAxis type="number" hide /> 
                            
                            
                            <YAxis 
                                dataKey="name" 
                                type="category" 
                                width={120} 
                                tick={{ fontSize: 12, fontWeight: 'bold' }}
                            />
                            
                            <Tooltip cursor={{ fill: '#f3f4f6' }} />
                            <Legend verticalAlign="top" align="right" height={36}/>
                            
                            <Bar dataKey="stock" name="Current Stock" barSize={20}>
                                {formattedData.map((entry, index) => (
                                    <Cell 
                                        key={`cell-${index}`} 
                                        fill={entry.stock <= entry.threshold ? '#ef4444' : '#3b82f6'} 
                                    />
                                ))}
                            </Bar>
                            
                            <Bar dataKey="threshold" fill="#cbd5e1" name="Reorder Point" barSize={10} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
            <p className="text-xs text-gray-400 mt-4 italic">
                * Red bars indicate stock below reorder threshold.
            </p>
        </div>
    );
};

export default StockChart;