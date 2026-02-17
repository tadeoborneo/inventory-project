from datetime import datetime, timezone
from typing import List
from pydantic import BaseModel, ConfigDict, Field, field_validator

#Sale model
class SaleItem(BaseModel):
    id: int
    product_id: int
    quantity: int
    unit_price: float
    unit_cost: float
    
    date: datetime
    @field_validator('date', mode='after')
    @classmethod
    def ensure_utc(cls, v: datetime)-> datetime:
        if v.tzinfo is None:
            return v.replace(tzinfo=timezone.utc)
        return v.astimezone(timezone.utc)
    
    model_config = ConfigDict(from_attributes=True)
    
class SaleCreate(BaseModel):
    product_id: int
    quantity: int = Field(..., gt = 0, description = "Quantity sold must be greater than zero")
    
class InventoryResponse(BaseModel):
    avg_daily_sales : float
    days_until_stockout : int
    restock_needed : bool
    status_message : str

class Product(BaseModel):
    id : int
    name : str
    stock : int 
    price : float
    cost : float
    lead_time_days : int

    model_config = ConfigDict(from_attributes=True)

class ProductCreate(BaseModel):
    name : str
    stock : int = Field(..., ge=0, description="Initial stock must be non-negative")
    price : float = Field(..., gt=0, description="Price must be greater than zero")
    cost : float = Field(..., gt=0, description="Cost must be greater than zero")
    lead_time_days : int = Field(..., gt=0, description="Lead time in days must be non-negative")