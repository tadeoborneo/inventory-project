import sys
from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from . import schemas
from app.core import get_average_daily_sales, calculate_days_until_stockout, needs_restocking
from .database import engine, Base, get_db
from . import models
import logging
# Set up Logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Create database tables
Base.metadata.create_all(bind=engine)
# Initialize FastAPI app
app = FastAPI(
    title = "Smart Inventory API",
    description = "API for stock prediction based on sales history.",
    version = "1.0.0"
)
# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



@app.get("/predict/{product_id}", response_model = schemas.InventoryResponse, status_code=status.HTTP_200_OK)
def predict_stockout(product_id: int, db: Session = Depends(get_db)):
    """
    Returns inventory predictions based on current stock and sales history.
    """ 
    product = db.query(models.DBProduct).filter(models.DBProduct.id == product_id).first()
    if not product:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found.")
    
    
    sales_data = db.query(models.DBSale).filter(models.DBSale.product_id == product_id).all()

    avg_sales = get_average_daily_sales(sales_data)

    days_left = calculate_days_until_stockout(product.stock, avg_sales)
    if days_left == sys.maxsize:
        logger.info(f"Prediction for product ID {product_id}. Insufficient sales data to predict stockout.")
        raise HTTPException(status_code=status.HTTP_200_OK, detail= "No sales data available to predict stockout.")    

    is_urgent = needs_restocking(days_left, product.lead_time_days)

    message = "Restock needed soon." if is_urgent else "Stock levels are sufficient."

    return schemas.InventoryResponse(
        avg_daily_sales = round(avg_sales, 2),
        days_until_stockout=days_left,
        restock_needed=is_urgent,
        status_message=message

    )

@app.get("/products", response_model=list[schemas.Product], status_code=status.HTTP_200_OK)
def get_products(db: Session = Depends(get_db)):
    """
    Retrieve all products in the inventory.
    """
    products = db.query(models.DBProduct).all()
    return products

@app.post("/products", response_model=schemas.Product, status_code=status.HTTP_201_CREATED)
def create_product(product: schemas.ProductCreate, db: Session = Depends(get_db)):
    """
    Create a new product in the inventory.
    """
    existing_product = db.query(models.DBProduct).filter(models.DBProduct.name == product.name).first()
    if existing_product:
        raise HTTPException(status_code=400, detail=f"Product with the name {product.name} already exists.")

    db_product = models.DBProduct(**product.model_dump()) #Unpacking the product dict
    db.add(db_product)
    db.commit()
    db.refresh(db_product)

    logger.info(f"New product created: {db_product.name} with initial stock {db_product.stock}")
     
    return db_product

@app.post("/sales", response_model=schemas.SaleItem, status_code=status.HTTP_201_CREATED)
def create_sale(sale: schemas.SaleCreate, db: Session = Depends(get_db)):
    """
    Record a new sale for a product.
    """
    # Verify that the product exists
    product = db.query(models.DBProduct).filter(models.DBProduct.id == sale.product_id).first()
    # If not, raise an error
    if not product:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found.")

    # Verify sufficient stock
    if product.stock < sale.quantity:
        logger.warning(f"Attempted sale failed: Product ID {sale.product_id} has insufficient stock. Requested: {sale.quantity}, Available: {product.stock}")
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                            detail=f"Insufficient stock for the sale. Available stock: {product.stock}, Requested: {sale.quantity}")

    #Deduct stock and record sale
    product.stock -= sale.quantity
    db_sale = models.DBSale(
        product_id=sale.product_id,
        quantity=sale.quantity,
        unit_price=product.price
    )
    db.add(db_sale)
    db.commit()
    db.refresh(db_sale)

    return db_sale

@app.delete("/products/{product_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_product(product_id: int, db: Session = Depends(get_db)):
    """
    Delete a product from the inventory.
    """
    db_product = db.query(models.DBProduct).filter(models.DBProduct.id == product_id).first()
    if not db_product:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found.")
    
    db.delete(db_product)
    db.commit()
    logger.info(f"Product deleted: {db_product.name} (ID: {product_id})")
    
    return None

@app.put("/products/{product_id}", response_model=schemas.Product)
def update_product(product_id: int, product_update: schemas.ProductCreate, db: Session = Depends(get_db)):
    """
    Update an existing product's details.
    """
    db_product = db.query(models.DBProduct).filter(models.DBProduct.id == product_id).first()
    if not db_product:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found.")
    
    for key, value in product_update.model_dump().items():
        setattr(db_product, key, value)
        
    db.commit()
    db.refresh(db_product)
    logger.info(f"Product updated: {db_product.name} (ID: {product_id}) with new details.")
    return db_product