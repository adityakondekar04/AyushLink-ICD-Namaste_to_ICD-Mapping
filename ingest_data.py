import pandas as pd
import sqlite3
import re
import sys

CSV_FILE_PATH = "ayushlink_mappings.csv"
DATABASE_FILE_PATH = "ayushlink.db"
TABLE_NAME = "diagnoses"

def clean_column_names(dataframe: pd.DataFrame) -> pd.DataFrame:
    cleaned_columns = []
    for col in dataframe.columns:
        col = col.strip()
        col = re.sub(r'[^a-zA-Z0-9_]', '_', col)
        col = col.lower()
        cleaned_columns.append(col)
    dataframe.columns = cleaned_columns
    return dataframe

def create_database_from_csv():
    print("🚀 Starting data ingestion...")
    try:
        df = pd.read_csv(CSV_FILE_PATH)
    except FileNotFoundError:
        print(f"❌ FATAL ERROR: The file '{CSV_FILE_PATH}' was not found.")
        sys.exit(1)
    
    df = clean_column_names(df)
    df = df.astype(object).where(pd.notnull(df), None)

    try:
        conn = sqlite3.connect(DATABASE_FILE_PATH)
        df.to_sql(TABLE_NAME, conn, if_exists='replace', index=False)
        conn.commit()
    finally:
        if 'conn' in locals() and conn:
            conn.close()

    print(f"✅ Success! Database '{DATABASE_FILE_PATH}' is now ready.")

if __name__ == "__main__":
    create_database_from_csv()