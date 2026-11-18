import os
from dotenv import load_dotenv

load_dotenv()

from fastapi import FastAPI, Depends, HTTPException

from fastapi.middleware.cors import CORSMiddleware

from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

from pydantic import BaseModel

from sqlalchemy import create_engine, text

from sqlalchemy.engine import URL

from passlib.context import CryptContext

from jose import jwt

from datetime import datetime, timedelta

# =========================================================

# PASSWORD SECURITY

# =========================================================

pwd_context = CryptContext(

    schemes=["bcrypt"],

    deprecated="auto"

)

# =========================================================

# JWT SECURITY

# =========================================================

SECRET_KEY = os.getenv("SECRET_KEY", "smart-inventory-sru-secret-2026")

ALGORITHM = "HS256"

ACCESS_TOKEN_EXPIRE_MINUTES = 60

# =========================================================

# JWT TOKEN VERIFICATION

# =========================================================

security = HTTPBearer()

def get_current_user(

    credentials: HTTPAuthorizationCredentials = Depends(security)

):

    token = credentials.credentials

    try:

        payload = jwt.decode(

            token,

            SECRET_KEY,

            algorithms=[ALGORITHM]

        )

        user_id = payload.get("user_id")

        role = payload.get("role")

        if user_id is None or role is None:

            return None

        return {

            "user_id": user_id,

            "role": role

        }

    except Exception:

        return None

def require_admin(current_user: dict):

    if current_user is None:

        raise HTTPException(status_code=401, detail="Unauthorized")

    if current_user["role"] != "admin":

        raise HTTPException(status_code=403, detail="Admin access required")

# =========================================================

# DATABASE CONNECTION

# =========================================================
DATABASE_URL = os.getenv("DATABASE_URL", "").strip()

if DATABASE_URL:
    # SQLAlchemy requires 'mysql+pymysql://' for PyMySQL driver
    if DATABASE_URL.startswith("mysql://"):
        DATABASE_URL = DATABASE_URL.replace("mysql://", "mysql+pymysql://", 1)

    connect_args = {}
    if "tidbcloud" in DATABASE_URL.lower():
        ca_cert_path = "/etc/ssl/certs/ca-certificates.crt"
        if os.path.exists(ca_cert_path):
            connect_args = {"ssl": {"ca": ca_cert_path}}
        else:
            connect_args = {"ssl_verify_cert": True}

    engine = create_engine(
        DATABASE_URL,
        connect_args=connect_args,
        pool_pre_ping=True,
        pool_recycle=300
    )
else:
    db_host = os.getenv("DB_HOST", "127.0.0.1")
    db_port = int(os.getenv("DB_PORT", "3306"))
    db_user = os.getenv("DB_USER", "root")
    db_password = os.getenv("DB_PASSWORD", "gayathreyini@123")
    db_name = os.getenv("DB_NAME", "smart_inventory")

    connection_url = URL.create(
        drivername="mysql+pymysql",
        username=db_user,
        password=db_password,
        host=db_host,
        port=db_port,
        database=db_name
    )
    engine = create_engine(
        connection_url,
        pool_pre_ping=True,
        pool_recycle=300
    )

# =========================================================

# FASTAPI APPLICATION

# =========================================================

app = FastAPI(

    title="Smart Inventory Management System",

    description="College Room and Asset Management System",

    version="1.0"

)

# =========================================================

# CORS

# =========================================================

frontend_url = os.getenv("FRONTEND_URL", "").strip()

allowed_origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:5174",
    "http://127.0.0.1:5174",
    "https://sru-inventory-system-vinay-2026-delta.vercel.app"
]

if frontend_url:
    for url in frontend_url.split(","):
        cleaned = url.strip().rstrip("/")
        if cleaned:
            allowed_origins.append(cleaned)

app.add_middleware(
    CORSMiddleware,
    allow_origins=list(dict.fromkeys(allowed_origins)),
    allow_origin_regex=r"https://.*\.vercel\.app",
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"]
)

# =========================================================

# DATA MODELS

# =========================================================

class LoginUser(BaseModel):

    email: str

    password: str

class RegisterUser(BaseModel):

    name: str

    email: str

    password: str

class FeedbackCreate(BaseModel):
    message: str

# =========================================================

# HOME

# =========================================================

# =========================================================

# CREATE ACCESS TOKEN

# =========================================================

def create_access_token(user_id: int, role: str):

    expire = datetime.utcnow() + timedelta(

        minutes=ACCESS_TOKEN_EXPIRE_MINUTES

    )

    payload = {

        "user_id": user_id,

        "role": role,

        "exp": expire

    }

    return jwt.encode(

        payload,

        SECRET_KEY,

        algorithm=ALGORITHM

    )

@app.get("/")

def home():

    return {

        "message": "Smart Inventory API is running"

    }

# =========================================================

def init_db():
    schema_path = os.path.join(os.path.dirname(__file__), "schema.sql")
    if os.path.exists(schema_path):
        try:
            with open(schema_path, "r", encoding="utf-8") as f:
                raw_sql = f.read()
            statements = [stmt.strip() for stmt in raw_sql.split(";") if stmt.strip()]
            with engine.begin() as conn:
                for stmt in statements:
                    conn.execute(text(stmt))
            print("Database schema verified / initialized from schema.sql")
        except Exception as exc:
            print(f"Database schema auto-init warning: {exc}")

@app.on_event("startup")
def on_startup():
    init_db()

# DATABASE TEST

# =========================================================

@app.get("/database-test")

def database_test():
    try:
        with engine.connect() as connection:
            connection.execute(text("SELECT 1"))
        return {
            "status": "connected",
            "message": "MySQL / TiDB database connected successfully"
        }
    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail=f"Database connection failed: {str(exc)}"
        )


# =========================================================

# LOGIN

# =========================================================

# =========================================================

# LOGIN

# =========================================================

@app.post("/login")

def login(user: LoginUser):

    with engine.connect() as connection:

        result = connection.execute(

            text("""

                SELECT id, name, email, password, role

                FROM users

                WHERE email = :email

            """),

            {

                "email": user.email

            }

        )

        row = result.fetchone()

        if row:

            try:

                password_correct = pwd_context.verify(

                    user.password,

                    row.password

                )

            except Exception:

                password_correct = False

            if password_correct:

                access_token = create_access_token(

                    row.id,

                    row.role

                )

                return {

                    "message": "Login successful",

                    "user_id": row.id,

                    "name": row.name,

                    "email": row.email,

                    "role": row.role,

                    "access_token": access_token

                }

    return {

        "message": "Invalid email or password"

    }

# =========================================================

# REGISTER

# =========================================================

@app.post("/register")

def register(user: RegisterUser):

    if not user.name:

        return {

            "message": "Name is required"

        }

    if not user.email:

        return {

            "message": "Email is required"

        }

    if not user.password:

        return {

            "message": "Password is required"

        }

    if "@" not in user.email:

        return {

            "message": "Please enter a valid email"

        }

    if len(user.password) < 5:

        return {

            "message": "Password must be at least 5 characters"

        }

    with engine.connect() as connection:

        result = connection.execute(

            text("""

                SELECT id

                FROM users

                WHERE email = :email

            """),

            {

                "email": user.email

            }

        )

        existing_user = result.fetchone()

        if existing_user:

            return {

                "message": "Email already registered"

            }

        hashed_password = pwd_context.hash(

            user.password

        )

        connection.execute(

            text("""

                INSERT INTO users

(name, email, password, role)

VALUES

(:name, :email, :password, 'viewer')

            """),

            {

                "name": user.name,

                "email": user.email,

                "password": hashed_password

            }

        )

        connection.commit()

    return {

        "message": "Registration successful"

    }

# =========================================================


# =========================================================
# STUDENT FEEDBACK
# =========================================================

@app.post("/feedback")
def submit_feedback(
    feedback: FeedbackCreate,
    current_user: dict = Depends(get_current_user)
):
    if current_user is None:
        raise HTTPException(status_code=401, detail="Unauthorized")

    if current_user["role"] != "viewer":
        raise HTTPException(status_code=403, detail="Only students can submit feedback")

    message = feedback.message.strip()
    if not message:
        raise HTTPException(status_code=400, detail="Feedback cannot be empty")

    with engine.begin() as connection:
        student = connection.execute(
            text("SELECT name FROM users WHERE id = :user_id"),
            {"user_id": current_user["user_id"]}
        ).fetchone()

        if student is None:
            raise HTTPException(status_code=404, detail="Student account not found")

        connection.execute(
            text("""
                INSERT INTO feedback (student_id, student_name, message)
                VALUES (:student_id, :student_name, :message)
            """),
            {
                "student_id": current_user["user_id"],
                "student_name": student.name,
                "message": message
            }
        )

    return {"message": "Feedback submitted successfully"}


@app.get("/feedback")
def get_all_feedback(
    current_user: dict = Depends(get_current_user)
):
    if current_user is None:
        raise HTTPException(status_code=401, detail="Unauthorized")

    if current_user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Administrator access required")

    with engine.connect() as connection:
        rows = connection.execute(
            text("""
                SELECT id, student_id, student_name, message, created_at
                FROM feedback
                ORDER BY created_at DESC
            """)
        ).mappings().all()

    return [dict(row) for row in rows]


@app.get("/my-feedback")
def get_my_feedback(
    current_user: dict = Depends(get_current_user)
):
    if current_user is None:
        raise HTTPException(status_code=401, detail="Unauthorized")

    if current_user["role"] != "viewer":
        raise HTTPException(status_code=403, detail="Student access required")

    with engine.connect() as connection:
        rows = connection.execute(
            text("""
                SELECT id, student_name, message, created_at
                FROM feedback
                WHERE student_id = :student_id
                ORDER BY created_at DESC
            """),
            {"student_id": current_user["user_id"]}
        ).mappings().all()

    return [dict(row) for row in rows]


# INVENTORY - GET

# =========================================================

@app.get("/inventory")

def get_inventory():

    with engine.connect() as connection:

        result = connection.execute(

            text("""

                SELECT *

                FROM inventory

                ORDER BY id

            """)

        )

        inventory = []

        for row in result:

            inventory.append({

                "id": row.id,

                "product_name": row.product_name,

                "quantity": row.quantity,

                "status": row.status

            })

        return inventory

# =========================================================

# INVENTORY - ADD

# =========================================================

@app.post("/inventory")

def add_inventory(

    item: dict,

    current_user: dict = Depends(get_current_user)

):

    if current_user is None:

        return {

            "message": "Unauthorized"

        }

    if current_user["role"] != "admin":

        return {

            "message": "Admin access required"

        }

    if not item.get("product_name"):

        return {

            "message": "Product name is required"

        }

    if "quantity" not in item:

        return {

            "message": "Quantity is required"

        }

    if item["quantity"] < 0:

        return {

            "message": "Quantity cannot be negative"

        }

    if not item.get("status"):

        return {

            "message": "Status is required"

        }

    with engine.connect() as connection:

        connection.execute(

            text("""

                INSERT INTO inventory

                (product_name, quantity, status)

                VALUES

                (:product_name, :quantity, :status)

            """),

            {

                "product_name": item["product_name"],

                "quantity": item["quantity"],

                "status": item["status"]

            }

        )

        connection.commit()

    return {

        "message": "Inventory added successfully"

    }

# =========================================================

# INVENTORY - UPDATE

# =========================================================

@app.put("/inventory/{inventory_id}")

def update_inventory(

    inventory_id: int,

    item: dict,

    current_user: dict = Depends(get_current_user)

):

    if current_user is None:

        return {

            "message": "Unauthorized"

        }

    if current_user["role"] != "admin":

        return {

            "message": "Admin access required"

        }

    if not item.get("product_name"):

        return {

            "message": "Product name is required"

        }

    if "quantity" not in item:

        return {

            "message": "Quantity is required"

        }

    if item["quantity"] < 0:

        return {

            "message": "Quantity cannot be negative"

        }

    if not item.get("status"):

        return {

            "message": "Status is required"

        }

    with engine.connect() as connection:

        connection.execute(

            text("""

                UPDATE inventory

                SET product_name = :product_name,

                    quantity = :quantity,

                    status = :status

                WHERE id = :inventory_id

            """),

            {

                "inventory_id": inventory_id,

                "product_name": item["product_name"],

                "quantity": item["quantity"],

                "status": item["status"]

            }

        )

        connection.commit()

    return {

        "message": "Inventory updated successfully"

    }

# =========================================================

# INVENTORY - DELETE

# =========================================================

@app.delete("/inventory/{inventory_id}")
def delete_inventory(
    inventory_id: int,
    current_user: dict = Depends(get_current_user)
):
    require_admin(current_user)

    with engine.begin() as connection:
        result = connection.execute(
            text("DELETE FROM inventory WHERE id = :inventory_id"),
            {"inventory_id": inventory_id}
        )

        if result.rowcount == 0:
            raise HTTPException(status_code=404, detail="Inventory item not found")

    return {"message": "Inventory item deleted successfully"}

@app.get("/assets")

def get_assets():

    with engine.connect() as connection:

        result = connection.execute(

            text("""

                SELECT *

                FROM assets

                ORDER BY id

            """)

        )

        assets = []

        for row in result:

            assets.append({

                "id": row.id,

                "asset_id": row.asset_id,

                "asset_name": row.asset_name,

                "location": row.location,

                "status": row.status

            })

        return assets

# =========================================================

# OLD ASSETS - ADD

# =========================================================

@app.post("/assets")

def add_asset(

    asset: dict,

    current_user: dict = Depends(get_current_user)

):

    require_admin(current_user)

    if not asset.get("asset_id"):

        return {

            "message": "Asset ID is required"

        }

    if not asset.get("asset_name"):

        return {

            "message": "Asset name is required"

        }

    if not asset.get("location"):

        return {

            "message": "Location is required"

        }

    if not asset.get("status"):

        return {

            "message": "Status is required"

        }

    with engine.connect() as connection:

        connection.execute(

            text("""

                INSERT INTO assets

                (asset_id, asset_name, location, status)

                VALUES

                (:asset_id, :asset_name, :location, :status)

            """),

            {

                "asset_id": asset["asset_id"],

                "asset_name": asset["asset_name"],

                "location": asset["location"],

                "status": asset["status"]

            }

        )

        connection.commit()

    return {

        "message": "Asset added successfully"

    }

# =========================================================

# OLD ASSETS - UPDATE

# =========================================================

@app.put("/assets/{asset_id}")

def update_asset(

    asset_id: str,

    asset: dict,

    current_user: dict = Depends(get_current_user)

):

    require_admin(current_user)

    if not asset.get("asset_name"):

        return {

            "message": "Asset name is required"

        }

    if not asset.get("location"):

        return {

            "message": "Location is required"

        }

    if not asset.get("status"):

        return {

            "message": "Status is required"

        }

    with engine.connect() as connection:

        connection.execute(

            text("""

                UPDATE assets

                SET asset_name = :asset_name,

                    location = :location,

                    status = :status

                WHERE asset_id = :asset_id

            """),

            {

                "asset_id": asset_id,

                "asset_name": asset["asset_name"],

                "location": asset["location"],

                "status": asset["status"]

            }

        )

        connection.commit()

    return {

        "message": "Asset updated successfully"

    }

# =========================================================

# OLD ASSETS - DELETE

# =========================================================

@app.delete("/assets/{asset_id}")
def delete_asset(
    asset_id: str,
    current_user: dict = Depends(get_current_user)
):
    require_admin(current_user)

    with engine.begin() as connection:
        result = connection.execute(
            text("DELETE FROM assets WHERE asset_id = :asset_id"),
            {"asset_id": asset_id}
        )

        if result.rowcount == 0:
            raise HTTPException(status_code=404, detail="Asset not found")

    return {"message": "Asset deleted successfully"}

@app.get("/rooms")

def get_rooms():

    with engine.connect() as connection:

        result = connection.execute(

            text("""

                SELECT

                    id,

                    block_no,

                    floor_name,

                    room_no,

                    room_code,

                    room_type

                FROM rooms

                ORDER BY

                    block_no,

                    CASE

                        WHEN floor_name = 'Ground Floor' THEN 1

                        WHEN floor_name = 'First Floor' THEN 2

                        WHEN floor_name = 'Second Floor' THEN 3

                        ELSE 4

                    END,

                    room_no

            """)

        )

        rooms = []

        for row in result:

            rooms.append({

                "id": row.id,

                "block_no": row.block_no,

                "floor_name": row.floor_name,

                "room_no": row.room_no,

                "room_code": row.room_code,

                "room_type": row.room_type

            })

        return rooms

# =========================================================

# ROOM ASSETS - GET BY ROOM

# =========================================================

@app.get("/rooms/{room_id}/assets")
def get_room_assets(room_id: int):
    with engine.connect() as connection:
        result = connection.execute(
            text("""
                SELECT
                    id,
                    room_id,
                    asset_code,
                    asset_name,
                    category,
                    quantity,
                    status
                FROM room_assets
                WHERE room_id = :room_id
                ORDER BY asset_name
            """),
            {"room_id": room_id}
        )

        assets = []
        for row in result:
            assets.append({
                "id": row.id,
                "room_id": row.room_id,
                "asset_code": row.asset_code,
                "asset_name": row.asset_name,
                "category": row.category,
                "quantity": row.quantity,
                "status": row.status
            })

        return assets


@app.post("/room-assets")
def add_room_asset(
    asset: dict,
    current_user: dict = Depends(get_current_user)
):
    require_admin(current_user)

    if not asset.get("room_id"):
        return {"message": "Room is required"}

    if not asset.get("asset_name"):
        return {"message": "Asset name is required"}

    if not asset.get("category"):
        return {"message": "Asset category is required"}

    if "quantity" not in asset:
        return {"message": "Quantity is required"}

    try:
        quantity = int(asset["quantity"])
        room_id = int(asset["room_id"])
    except (ValueError, TypeError):
        return {"message": "Room and quantity must be valid numbers"}

    if quantity < 0:
        return {"message": "Quantity cannot be negative"}

    if asset.get("status") not in ["Working", "Repair", "Not Working"]:
        return {"message": "Please select a valid status"}

    with engine.connect() as connection:
        room = connection.execute(
            text("SELECT id FROM rooms WHERE id = :room_id"),
            {"room_id": room_id}
        ).fetchone()

        if not room:
            return {"message": "Room not found"}

        next_id = connection.execute(
            text("SELECT COALESCE(MAX(id), 0) + 1 FROM room_assets")
        ).scalar()

        asset_code = f"SRU-{next_id:05d}"

        connection.execute(
            text("""
                INSERT INTO room_assets
                (room_id, asset_code, asset_name, category, quantity, status)
                VALUES
                (:room_id, :asset_code, :asset_name, :category, :quantity, :status)
            """),
            {
                "room_id": room_id,
                "asset_code": asset_code,
                "asset_name": asset["asset_name"].strip(),
                "category": asset["category"].strip(),
                "quantity": quantity,
                "status": asset["status"]
            }
        )

        connection.commit()

    return {
        "message": "Room asset added successfully",
        "asset_code": asset_code
    }


# =========================================================

# ROOM ASSETS - UPDATE

# =========================================================


@app.put("/room-assets/{asset_id}")
def update_room_asset(
    asset_id: int,
    asset: dict,
    current_user: dict = Depends(get_current_user)
):
    require_admin(current_user)

    if not asset.get("asset_name"):
        return {"message": "Asset name is required"}

    if "quantity" not in asset:
        return {"message": "Quantity is required"}

    if asset["quantity"] < 0:
        return {"message": "Quantity cannot be negative"}

    if not asset.get("status"):
        return {"message": "Status is required"}

    new_room_id = asset.get("room_id")

    with engine.connect() as connection:

        # Check whether the asset exists
        existing_asset = connection.execute(
            text("""
                SELECT id
                FROM room_assets
                WHERE id = :asset_id
            """),
            {"asset_id": asset_id}
        ).fetchone()

        if not existing_asset:
            return {"message": "Asset not found"}

        # Update asset details and room
        if new_room_id is not None:
            room = connection.execute(
                text("""
                    SELECT id
                    FROM rooms
                    WHERE id = :room_id
                """),
                {"room_id": new_room_id}
            ).fetchone()

            if not room:
                return {"message": "Destination room not found"}

            connection.execute(
                text("""
                    UPDATE room_assets
                    SET room_id = :room_id,
                        asset_name = :asset_name,
                        category = :category,
                        quantity = :quantity,
                        status = :status
                    WHERE id = :asset_id
                """),
                {
                    "asset_id": asset_id,
                    "room_id": new_room_id,
                    "asset_name": asset["asset_name"],
                    "category": asset.get("category", "General"),
                    "quantity": asset["quantity"],
                    "status": asset["status"]
                }
            )
        else:
            connection.execute(
                text("""
                    UPDATE room_assets
                    SET asset_name = :asset_name,
                        category = :category,
                        quantity = :quantity,
                        status = :status
                    WHERE id = :asset_id
                """),
                {
                    "asset_id": asset_id,
                    "asset_name": asset["asset_name"],
                    "category": asset.get("category", "General"),
                    "quantity": asset["quantity"],
                    "status": asset["status"]
                }
            )

        connection.commit()

    return {
        "message": "Room asset updated successfully"
    }


# =========================================================

# ROOM ASSETS - DELETE

# =========================================================

@app.delete("/room-assets/{asset_id}")
def delete_room_asset(
    asset_id: int,
    current_user: dict = Depends(get_current_user)
):
    require_admin(current_user)

    with engine.begin() as connection:
        result = connection.execute(
            text("DELETE FROM room_assets WHERE id = :asset_id"),
            {"asset_id": asset_id}
        )

        if result.rowcount == 0:
            raise HTTPException(status_code=404, detail="Room asset not found")

    return {"message": "Room asset deleted successfully"}

@app.get("/room-assets-report")

def get_room_assets_report():

    with engine.connect() as connection:

        result = connection.execute(

            text("""

                SELECT

                    ra.id,

                    ra.asset_code,

                    r.block_no,

                    r.floor_name,

                    r.room_no,

                    r.room_code,

                    r.room_type,

                    ra.asset_name,

                    ra.quantity,

                    ra.status

                FROM room_assets ra

                INNER JOIN rooms r

                    ON ra.room_id = r.id

                ORDER BY

                    r.block_no,

                    CASE

                        WHEN r.floor_name = 'Ground Floor' THEN 1

                        WHEN r.floor_name = 'First Floor' THEN 2

                        WHEN r.floor_name = 'Second Floor' THEN 3

                        ELSE 4

                    END,

                    r.room_no,

                    ra.asset_name

            """)

        )

        report = []

        for row in result:

            report.append({

                "id": row.id,

                "asset_code": row.asset_code,

                "block_no": row.block_no,

                "floor_name": row.floor_name,

                "room_no": row.room_no,

                "room_code": row.room_code,

                "room_type": row.room_type,

                "asset_name": row.asset_name,

                "quantity": row.quantity,

                "status": row.status

            })

        return report

# =========================================================

# GLOBAL ASSET SEARCH

# =========================================================

@app.get("/search-assets")

def search_assets(search: str):

    with engine.connect() as connection:

        # Search room assets

        room_result = connection.execute(

            text("""

                SELECT

                    ra.id,

                    ra.asset_code,

                    ra.asset_name,

                    ra.quantity,

                    ra.status,

                    r.block_no,

                    r.floor_name,

                    r.room_no,

                    r.room_code,

                    r.room_type

                FROM room_assets ra

                INNER JOIN rooms r

                    ON ra.room_id = r.id

                WHERE

                    ra.asset_code LIKE :search

                    OR ra.asset_name LIKE :search

                ORDER BY

                    r.block_no,

                    r.room_code,

                    ra.asset_name

            """),

            {"search": f"%{search}%"}

        )

        assets = []

        for row in room_result:

            assets.append({

                "source": "Room Asset",

                "id": row.id,

                "asset_code": row.asset_code,

                "asset_name": row.asset_name,

                "quantity": row.quantity,

                "status": row.status,

                "block_no": row.block_no,

                "floor_name": row.floor_name,

                "room_no": row.room_no,

                "room_code": row.room_code,

                "room_type": row.room_type

            })

        # Search general inventory

        inventory_result = connection.execute(

            text("""

                SELECT

                    id,

                    product_name,

                    quantity,

                    status

                FROM inventory

                WHERE product_name LIKE :search

            """),

            {"search": f"%{search}%"}

        )

        for row in inventory_result:

            assets.append({

                "source": "Inventory",

                "id": row.id,

                "asset_code": f"INV-{row.id:05d}",

                "asset_name": row.product_name,

                "quantity": row.quantity,

                "status": row.status,

                "block_no": None,

                "floor_name": "Not Assigned",

                "room_no": None,

                "room_code": "Not Assigned",

                "room_type": "General Inventory"

            })

        return assets

@app.get("/search-asset/{asset_code}")

def search_asset(asset_code: str):

    with engine.connect() as connection:

        result = connection.execute(

            text("""

                SELECT

                    ra.id,

                    ra.asset_code,

                    ra.asset_name,

                    ra.quantity,

                    ra.status,

                    r.block_no,

                    r.floor_name,

                    r.room_no,

                    r.room_code,

                    r.room_type

                FROM room_assets ra

                INNER JOIN rooms r

                    ON ra.room_id = r.id

                WHERE ra.asset_code = :asset_code

            """),

            {

                "asset_code": asset_code

            }

        )

        row = result.fetchone()

        if not row:

            return {

                "message": "Asset not found"

            }

        return {

            "id": row.id,

            "asset_code": row.asset_code,

            "asset_name": row.asset_name,

            "quantity": row.quantity,

            "status": row.status,

            "block_no": row.block_no,

            "floor_name": row.floor_name,

            "room_no": row.room_no,

            "room_code": row.room_code,

            "room_type": row.room_type

        }

@app.get("/low-stock")

def get_low_stock():

    with engine.connect() as connection:

        result = connection.execute(

            text("""

                SELECT

                    id,

                    product_name,

                    quantity,

                    status

                FROM inventory

                WHERE quantity <= 5

                ORDER BY quantity ASC

            """)

        )

        products = []

        for row in result:

            products.append({

                "id": row.id,

                "product_name": row.product_name,

                "quantity": row.quantity,

                "status": row.status

            })

        return products

# =========================================================

# =========================================================

# AI-ASSISTED INVENTORY PREDICTION

# =========================================================

@app.get("/ai-prediction")

def ai_prediction():

    with engine.connect() as connection:

        result = connection.execute(

            text("""

                SELECT id, product_name, quantity, status

                FROM inventory

                ORDER BY quantity ASC

            """)

        )

        predictions = []

        for row in result:

            if row.quantity <= 2:

                prediction = "High Restock Risk"

                recommendation = "Restock immediately"

            elif row.quantity <= 5:

                prediction = "May Need Restocking"

                recommendation = "Plan restocking soon"

            else:

                prediction = "Stable"

                recommendation = "No immediate action"

            predictions.append({

                "id": row.id,

                "product_name": row.product_name,

                "quantity": row.quantity,

                "status": row.status,

                "prediction": prediction,

                "recommendation": recommendation

            })

        return predictions

# RUN APPLICATION

# =========================================================

if __name__ == "__main__":

    import uvicorn

    uvicorn.run(

        "main:app",

    



        host="0.0.0.0",
        port=int(os.getenv("PORT", 8000)),
        reload=False

    )
