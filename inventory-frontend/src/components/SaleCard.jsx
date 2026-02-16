import React from "react";

const SaleCard = ({ sale }) => {
    const { product_name, product_id, quantity, total_price, unit_price, sold_at, date } = sale || {};
    const soldDate = date || sold_at;
    const dateStr = soldDate ? new Date(soldDate).toLocaleString() : null;

    const computedTotal = typeof total_price !== 'undefined'
        ? total_price
        : (typeof unit_price === 'number' && typeof quantity === 'number')
            ? unit_price * quantity
            : undefined;

    const totalFormatted = typeof computedTotal === 'number' ? computedTotal.toFixed(2) : computedTotal;

    return (
        <div className="bg-white p-4 rounded-lg shadow-sm flex justify-between items-start">
            <div>
                <p className="font-bold text-lg text-gray-800">{product_name ?? (product_id ? `Product #${product_id}` : 'Sale')}</p>
                <p className="text-sm text-gray-600">Quantity: {quantity}</p>
                <p className="text-sm text-gray-600">Total: ${totalFormatted ?? '—'}</p>
                {dateStr && <p className="text-xs text-gray-400 mt-1">{dateStr}</p>}
            </div>
        </div>
    );
};

export default SaleCard;
