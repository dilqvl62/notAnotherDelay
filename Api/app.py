from flask import Flask, jsonify
from sqlalchemy import create_engine, text
from flask_cors import CORS  # Import the CORS extension
import urllib.parse

from database_credential import password
encoded = urllib.parse.quote_plus(password)

engine = create_engine(f"postgresql+psycopg2://postgres:{encoded}@localhost/notAnotherDelaydb")

app = Flask(__name__)
CORS(app)  # Enable CORS for the entire app

@app.route('/')
def index():
    # Execute the SQL query using engine.execute() with text()
    query = text('SELECT DISTINCT airport FROM airline_delay_cause_db."Airlines" ORDER BY airport ASC')
    result = engine.execute(query)

    # Fetch all rows from the result and convert them to a list of dictionaries
    rows = [dict(row) for row in result]

    # Return the query results as a JSON response
    return jsonify(rows)

@app.route('/lineAndBar_charts')
def lineAndBar_charts():
    # Execute the SQL query using engine.execute() with text()
    query = text('SELECT month, carrier_name, sum(arr_flights) AS total_flights, avg(carrier_ct) AS Avg_carrierCt, avg(weather_ct) AS Avg_weather_ct, avg(nas_ct) AS Avg_nasCt FROM airline_delay_cause_db."Airlines" GROUP BY month, carrier_name')
   
    result = engine.execute(query)

    # Fetch all rows from the result and convert them to a list of dictionaries
    rows = [dict(row) for row in result]

    # Return the query results as a JSON response
    return jsonify(rows)

@app.route('/major_airlines')
def major_airlines():
    # Execute the SQL query using engine.execute() with text()
    query = text('SELECT month,  avg(weather_ct) AS Avg_weather_ct, avg(carrier_ct) as avg_carrier_ct, avg(nas_ct) as average_nasCt FROM airline_delay_cause_db."Airlines" GROUP BY month')
   
    result = engine.execute(query)

    # Fetch all rows from the result and convert them to a list of dictionaries
    rows = [dict(row) for row in result]

    # Return the query results as a JSON response
    return jsonify(rows)

if __name__ == '__main__':
    app.run(debug=True)
