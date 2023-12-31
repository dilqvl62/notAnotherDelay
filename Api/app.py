from flask import Flask, jsonify
from sqlalchemy import create_engine, text
from flask_cors import CORS  # Import the CORS extension
import urllib.parse

from database_credential import password
encoded = urllib.parse.quote_plus(password)

engine = create_engine(f"postgresql+psycopg2://postgres:{encoded}@localhost/notAnotherDelaydb")

app = Flask(__name__)
CORS(app)  # Enable CORS for the entire app
@app.route('/airport')
def index():
    # Execute the SQL query using engine.execute() with text()
    query = text('SELECT airport, sum(Weather_ct) FROM airline_delay_cause_db."Airlines" group by airport')
    result = engine.execute(query)

    # Fetch all rows from the result and convert them to a list of dictionaries
    rows = [dict(row) for row in result]

    # Return the query results as a JSON response
    return jsonify(rows)

if __name__ == '__main__':
    app.run(debug=True)
