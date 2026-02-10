const ProductCard = ({ product, onSell, onAnalyze, quantity, setQuantity, onDelete }) => {

    const isInvalid = !quantity || quantity <= 0 || quantity > product.stock;

    return (

        <div className="relative bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <button
                    onClick={onDelete}
                    className="absolute top-2 right-2 text-gray-400 hover:text-red-500 transition-colors"
                >
                    ✕
                </button>
            <h2 className="font-bold text-xl text-gray-700">{product.name}</h2>
            <div className="mt-2 flex justify-between items-center text-sm">
                <span className="text-gray-500">Stock: {product.stock} un.</span>
                <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-bold">${product.price}</span>
            </div>

            <div className="mt-4 flex gap-2 border-t pt-4">
                <input
                    type="number"
                    className="w-16 border rounded-lg p-1 text-sm text-center"
                    placeholder="Qty"
                    value={quantity || ''}
                    onChange={(e) => setQuantity(e.target.value)}
                />
                <button onClick={onSell} disabled={isInvalid} className={`text-xs font-bold py-2 px-2 rounded-lg flex-1 transition-all ${isInvalid
                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        : 'bg-green-600 text-white hover:bg-green-700 active:scale-95'
                    }`}>Sell</button>
                <button onClick={onAnalyze} className="bg-blue-500 text-white text-xs font-bold py-2 px-2 rounded-lg flex-1">Analyze</button>
                

            </div>
        </div>
    );
};

export default ProductCard;