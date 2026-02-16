import { useState, useEffect } from "react";
import axios from "axios";
import SaleCard from "../components/SaleCard";

const SalesHistory = () => {
    const [sales, setSales] = useState([]);

    useEffect(() => {
        axios
            .get("http://localhost:8000/sales")
            .then((response) => setSales(response.data.reverse())) // Show most recent sales first
            .catch((error) => console.error("Error fetching sales:", error));
    }, []);

    return (
        <div className="p-8 bg-gray-50 min-h-screen">
            <h1 className="text-3xl font-black mb-8">My Sales History</h1>
            <div className="mb-6">
                {sales.length === 0 ? (
                    <p className="text-gray-500">No sales recorded yet.</p>
                ) : (
                    <div className="grid gap-4">
                        {sales.map((sale) => (
                            <SaleCard key={sale.id} sale={sale} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SalesHistory;