from app.core import get_average_daily_sales, calculate_days_until_stockout, needs_restocking
import sys

def test_get_average_daily_sales():
    sales_history = [
        {"date": "2025-01-01", "quantity": 10},
        {"date": "2025-01-02", "quantity": 20},
        {"date": "2025-01-03", "quantity": 30},
    ]
    assert get_average_daily_sales(sales_history) == 20.0

def test_get_average_zero_sales():
    sales_history = [
        {"date": "2025-01-01", "quantity": 0},
        {"date": "2025-01-02", "quantity": 0},
    ]
    assert get_average_daily_sales(sales_history) == 0.0
    assert get_average_daily_sales([]) == 0.0

def test_calculate_days_until_stockout():
    assert calculate_days_until_stockout(100, 10.0) == 10
    assert calculate_days_until_stockout(10, 3.0) == 3
    assert calculate_days_until_stockout(0, 10.0) == 0
    assert calculate_days_until_stockout(100, 0.0) == sys.maxsize  # Infinite days if no sales

def test_needs_restocking():
    assert needs_restocking(3) == True
    assert needs_restocking(5) == True
    assert needs_restocking(10) == False 
    assert needs_restocking(3, lead_time=2) == False
    

