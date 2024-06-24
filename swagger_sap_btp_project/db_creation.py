import pymysql

def create_database_and_table():
    connection = pymysql.connect(
        host='localhost',
        user='root',
        password='0775808024Em',
        cursorclass=pymysql.cursors.DictCursor
    )

    try:
        with connection.cursor() as cursor:
            cursor.execute("CREATE DATABASE IF NOT EXISTS user_database;")
            cursor.execute("USE user_database;")
            
            create_table_query = """
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                username VARCHAR(255) NOT NULL,
                password VARCHAR(255) NOT NULL,
                email VARCHAR(255) NOT NULL,
                role VARCHAR(255) NOT NULL,
                position VARCHAR(255),
                education VARCHAR(255),
                contact_info VARCHAR(255)
            );
            """
            cursor.execute(create_table_query)
            
        connection.commit()
    finally:
        print("YES")
        connection.close()

create_database_and_table()