import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import AddProductForm from '../components/AddProductForm';
import ProductCard from '../components/ProductCard';

const Inventory = () => {
    const [products, setProducts] = useState([]);
    const [selectedPrediction, setSelectedPrediction] = useState(null);
    const [quantities, setQuantities] = useState({});
    const [searchTerm, setSearchTerm] = useState('');
    const [editingProduct, setEditingProduct] = useState(null);
    const [newProduct, setNewProduct] = useState({
        name: '',
        stock: 0,
        price: 0,
        lead_time_days: 5
    });

    const filteredProducts = products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));

    useEffect(() => {
        axios.get('http://localhost:8000/products')
            .then(response => setProducts(response.data))
            .catch(error => console.error("Error fetching products:", error));
    }, []);

    const handleEditClick = (product) => {
        setEditingProduct(product.id);
        setNewProduct({
            name: product.name,
            stock: product.stock, 
            price: product.price,
            lead_time_days: product.lead_time_days
        });
        window.scrollTo({ top: 0, behavior: 'smooth'})
    }

    const handleSaveProduct = async (e) => {
        e.preventDefault();
        const productData = {
            ...newProduct,
            stock: Number(newProduct.stock),
            price: Number(newProduct.price),
            lead_time_days: Number(newProduct.lead_time_days)
        };

        try {
            if (editingProduct) {
                
                const response = await axios.put(`http://localhost:8000/products/${editingProduct}`, productData);
                setProducts(products.map(p => p.id === editingProduct ? response.data : p));
                toast.success("Product updated successfully");
            } else {
                
                const response = await axios.post('http://localhost:8000/products', productData);
                setProducts([...products, response.data]);
                toast.success("Product added!");
            }
           
            setNewProduct({ name: '', stock: 0, price: 0, lead_time_days: 5 });
            setEditingProduct(null);
        } catch (error) {
            toast.error("Error updating product");
        }
    };

    const handleDeleteProduct = async (productId) => {
        const confirmDelete  = window.confirm("Are you sure you want to delete this product? This action will delete all associated sales records and cannot be undone.");

        if (!confirmDelete) return;

        try {
            await axios.delete(`http://localhost:8000/products/${productId}`);
            setProducts(products.filter(p => p.id !== productId))
            toast.success("Product and sale history deleted succesfully")
        } catch (error) {
            toast.error("Error deleting product: ");
        }
    }

    const handleAddProduct = async (e) => {
        e.preventDefault();

        const productData = {
            ...newProduct,
            stock: Number(newProduct.stock),
            price: Number(newProduct.price),
            lead_time_days: Number(newProduct.lead_time_days)
        }

        try {
            const response = await axios.post('http://localhost:8000/products', productData);
            setProducts([...products, response.data]);

            setNewProduct({ name: '', stock: 0, price: 0, lead_time_days: 5 });
            toast.success("Product added successfully!");
        } catch (error) {
            let msg = "Error connecting to the server.";
            if (error.response?.status === 422) {
                const detail = error.response.data.detail;
                msg = Array.isArray(detail) ? `${detail[0].loc[1]} : ${detail[0].msg}` : detail;
            } else if (error.response?.data?.detail) {
                msg = error.response.data.detail;
            }
            toast.error(msg);
        }

    }

    const handleSellProduct = async (productId, quantity) => {
        if (quantity <= 0) {
            toast.error("Please enter a valid quantity.");
            return;
        }

        try {
            const response = await axios.post('http://localhost:8000/sales', {
                product_id: productId,
                quantity: Number(quantity),
                unit_price: products.find(p => p.id === productId).price
            });

            setProducts(prevProducts =>
                prevProducts.map(p =>
                    p.id === productId
                        ? { ...p, stock: p.stock - response.data.quantity }
                        : p
                )
            )
            toast.success("Product sold successfully!");
        } catch (error) {
            console.error("Error selling product:", error);
            toast.error(error.response?.data?.detail || "Error connecting to the server.");
        }
    }

    const handleGetPrediction = async (productId) => {
        try {
            const response = await axios.get(`http://localhost:8000/predict/${productId}`)
            setSelectedPrediction(response.data);
        } catch (error) {
            console.error("Error fetching prediction:", error);
            toast.error(error.response?.data?.detail || "Insufficient data for prediction.");
        }
    }

    return (
        <div className="p-8 bg-gray-50 min-h-screen">
            <h1 className="text-3xl font-black mb-8">My Smart Inventory</h1>
            <div className="mb-6">
                <h2 className="text-sm font-bold uppercase text-gray-500 mb-2">
                    {editingProduct ? "📝 Modifying product" : "🚀 Add new product"}
                </h2>
                <AddProductForm
                    newProduct={newProduct}
                    setNewProduct={setNewProduct}
                    onSubmit={handleSaveProduct}
                    isEditing={!!editingProduct}
                />
                {editingProduct && (
                    <button onClick={() => {setEditingProduct(null); setNewProduct({name:'', stock:0, price:0, lead_time_days:5})}} className="text-xs text-red-500 font-bold underline">
                        Cancel Edition
                    </button>
                )}
            </div>

            {selectedPrediction && (
                <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-xl mb-8 shadow-sm">
                    <div className="flex justify-between items-start">
                        <h3 className="text-xl font-bold text-blue-800">Smart analisis</h3>
                        <button onClick={() => setSelectedPrediction(null)} className="text-blue-500 font-bold">X</button>
                    </div>
                    <p className="mt-2 text-blue-700">
                        {selectedPrediction.status_message}
                    </p>
                    <div className="grid grid-cols-2 gap-4 mt-4">
                        <div className="bg-white p-3 rounded-lg shadow-inner">
                            <p className="text-xs text-gray-500 font-bold uppercase">Day Average Sales</p>
                            <p className="text-lg font-black">{selectedPrediction.avg_daily_sales}</p>
                        </div>
                        <div className="bg-white p-3 rounded-lg shadow-inner">
                            <p className="text-xs text-gray-500 font-bold uppercase">Days left until stockout</p>
                            <p className="text-lg font-black">{selectedPrediction.days_until_stockout === 9223372036854775807 ? '∞' : selectedPrediction.days_until_stockout}</p>
                        </div>
                    </div>
                </div>
            )}

            <div className="mb-8">
                <input
                    type="text"
                    placeholder="Search products by name..."
                    className="w-full p-4 rounded-xl border-none shadow-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {filteredProducts.map(product => (
                    <ProductCard
                        key={product.id}
                        product={product}
                        quantity={quantities[product.id]}
                        setQuantity={(val) => setQuantities({ ...quantities, [product.id]: val })}
                        onSell={() => handleSellProduct(product.id, quantities[product.id])}
                        onAnalyze={() => handleGetPrediction(product.id)}
                        onDelete={()=> handleDeleteProduct(product.id)}
                        onEdit={() => handleEditClick(product)}
                    />
                ))}
            </div>
        </div>
    );
};

export default Inventory;