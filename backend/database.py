import os
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.engine import URL

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL", "").strip()

if DATABASE_URL:
    if DATABASE_URL.startswith("mysql://"):
        DATABASE_URL = DATABASE_URL.replace("mysql://", "mysql+pymysql://", 1)
    connect_args = {}
    if "tidbcloud" in DATABASE_URL.lower():
        ca_cert_path = "/etc/ssl/certs/ca-certificates.crt"
        if os.path.exists(ca_cert_path):
            connect_args = {"ssl": {"ca": ca_cert_path}}
        else:
            connect_args = {"ssl_verify_cert": True}
    engine = create_engine(DATABASE_URL, connect_args=connect_args, pool_pre_ping=True)
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
    engine = create_engine(connection_url, pool_pre_ping=True)

print("Database connection created")
