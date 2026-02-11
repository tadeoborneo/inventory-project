from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime, func
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

    sales = relationship("DBSale", back_populates="product", cascade= "all, delete-orphan")

class DBSale(Base):
    __tablename__ = "sales"

    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("products.id"))
    quantity = Column(Integer)
    date = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    unit_price = Column(Float)

    product = relationship("DBProduct", back_populates="sales")