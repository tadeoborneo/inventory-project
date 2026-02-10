from datetime import datetime
import sys
from typing import List
from app.models import DBSale


def main():
    pass

def get_average_daily_sales(sales_history: List[DBSale]) -> float:
    if not sales_history:
        return 0.0
    total_sales = sum(sale.quantity for sale in sales_history)
    
    dates=[sale.date for sale in sales_history]
    
    min_date = min(dates)
    max_date = max(dates)
        
    days_range = (max_date - min_date).days + 1
    return float(total_sales / max(days_range, 1))

def calculate_days_until_stockout(current_stock: int, avg_daily_sales: float) -> int:
    if avg_daily_sales <= 1:
        return sys.maxsize  # Infinite days if no sales
    return int(current_stock / avg_daily_sales)

def needs_restocking(days_left: int, lead_time: int) -> bool:
    if days_left <= lead_time:
        return True 
    return False

if __name__ == "__main__":
    main()