from sqlalchemy import CheckConstraint, Column, Integer, String, Float, ForeignKey, DateTime, func
from sqlalchemy.orm import relationship
from .database import Base 
from datetime import datetime, timezone


#Database models
class DBProduct(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique= True, index=True)
    stock = Column(Integer, default=0)
    price = Column(Float)
    lead_time_days = Column(Integer, default=5)
    cost = Column(Float)

    sales = relationship("DBSale", back_populates="product", cascade= "all, delete-orphan")
    
    __table_args__ = ( #Constraints to ensure data integrity
        CheckConstraint('stock >= 0', name='check_stock_non_negative'),
        CheckConstraint('price > 0', name='check_price_positive'),
        CheckConstraint('lead_time_days >= 0', name='check_lead_time_non_negative')
    )

class DBSale(Base):
    __tablename__ = "sales"

    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("products.id"))
    quantity = Column(Integer)
    date = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    unit_price = Column(Float)
    unit_cost = Column(Float)

    product = relationship("DBProduct", back_populates="sales")
    
    __table_args__ = (
        CheckConstraint('quantity > 0', name='check_quantity_positive'),
        CheckConstraint('unit_price > 0', name='check_unit_price_positive')
    )
    
    