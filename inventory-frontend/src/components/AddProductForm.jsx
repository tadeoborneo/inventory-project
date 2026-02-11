const AddProductForm = ({ newProduct, setNewProduct, onSubmit, isEditing }) => {
    const isInvalid = !newProduct.name || newProduct.stock < 0 || newProduct.price <= 0 || newProduct.lead_time_days <= 0
    || isNaN(newProduct.stock) || isNaN(newProduct.price) || isNaN(newProduct.lead_time_days);

    return (
        <form onSubmit={onSubmit} className="bg-white p-6 rounded-xl shadow-md mb-8 grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Name</label>
                <input
                    type="text"
                    className="w-full border rounded-lg p-2"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                    required
                />
            </div>

            <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Initial Stock</label>
                <input
                    type="number"
                    className="w-full border rounded-lg p-2"
                    value={newProduct.stock}
                    onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                    required
                />
            </div>

            <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Price</label>
                <input
                    type="number"
                    className="w-full border rounded-lg p-2"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                    required
                />
            </div>

            <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Lead time</label>
                <input
                    type="number"
                    className="w-full border rounded-lg p-2"
                    value={newProduct.lead_time_days}
                    onChange={(e) => setNewProduct({ ...newProduct, lead_time_days: e.target.value })}
                    required
                />
            </div>

            <button 
                type="submit" 
                disabled={isInvalid} 
                className={`font-bold py-2 px-4 rounded-lg transition-colors ${
                    isEditing 
                    ? 'bg-amber-500 hover:bg-amber-600 text-white' 
                    : (isInvalid ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700')
                }`}
            >
                {isEditing ? 'Update Product' : '+ Add Product'}
            </button>
        </form>
    );
};

export default AddProductForm;