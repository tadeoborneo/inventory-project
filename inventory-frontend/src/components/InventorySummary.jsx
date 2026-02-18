const InventorySummary = ({ totalProducts, lowStockCount, totalRevenue, totalProfit }) => {
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

            <div>
                <div className="bg-white p-6 rounded-xl shadow-md border-b-4 border-green-500 w-64">
                    <p className="text-gray-500 text-sm font-bold uppercase">Total Revenue</p>
                    <p className="text-3xl font-black">${totalRevenue.toFixed(2)}</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-md border-b-4 border-purple-500 w-64 mt-4">
                    <p className="text-gray-500 text-sm font-bold uppercase">Total Profit</p>
                    <p className="text-3xl font-black">${totalProfit.toFixed(2)}</p>
                </div>
            </div>
        </div>
    );
};

export default InventorySummary;