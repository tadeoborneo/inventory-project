const InventorySummary = ({ totalProducts, lowStockCount, totalRevenue, totalProfit, topProducts }) => {
    return (
        <div className="flex gap-4 mb-8">
            <div className="bg-white p-6 rounded-xl shadow-md border-b-4 border-blue-500 w-64">
                <p className="text-gray-500 text-sm font-bold uppercase">Total Products</p>
                <p className="text-3xl font-black">{totalProducts}</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md border-b-4 border-red-500 w-64">
                <p className="text-gray-500 text-sm font-bold uppercase">Stock Alerts</p>
                <p className="text-3xl font-black text-red-600">{lowStockCount}</p>
            </div>

            {topProducts && topProducts.length > 0 && (
                <div className="bg-white p-6 rounded-xl shadow-md border-b-4 border-yellow-500 flex-1">
                    <table className="w-full text-left">
                        <thead>
                            <tr>
                                <th className="text-gray-500 text-sm font-bold uppercase pb-2">Top Products</th>
                                <th className="text-gray-500 text-sm font-bold uppercase pb-2">Profit</th>
                            </tr>
                        </thead>
                        <tbody>
                            {topProducts.slice(0,5).map(({ name, profit }) => (
                                <tr key={name} className="border-t">
                                    <td className="py-1 truncate">{name}</td>
                                    <td className="py-1 font-semibold">${(profit || 0).toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <div className="flex flex-col gap-4">
                <div className="bg-white p-6 rounded-xl shadow-md border-b-4 border-green-500 w-64">
                    <p className="text-gray-500 text-sm font-bold uppercase">Total Revenue</p>
                    <p className="text-3xl font-black">${totalRevenue.toFixed(2)}</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-md border-b-4 border-purple-500 w-64">
                    <p className="text-gray-500 text-sm font-bold uppercase">Total Profit</p>
                    <p className="text-3xl font-black">${totalProfit.toFixed(2)}</p>
                </div>
            </div>
        </div>
    );
};

export default InventorySummary;