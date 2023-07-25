-- Table: airline_delay_cause_db.Airlines

-- DROP TABLE IF EXISTS airline_delay_cause_db."Airlines";

CREATE TABLE IF NOT EXISTS airline_delay_cause_db."Airlines"
(
    year integer,
    month integer,
    carrier character(10) COLLATE pg_catalog."default",
    carrier_name character(50) COLLATE pg_catalog."default",
    airport character(20) COLLATE pg_catalog."default",
    airport_name character(200) COLLATE pg_catalog."default",
    arr_flights integer,
    arr_del15 integer,
    carrier_ct double precision,
    weather_ct double precision,
    nas_ct double precision,
    security_ct double precision,
    late_aircraft_ct double precision,
    arr_cancelled integer,
    arr_diverted integer,
    arr_delay integer,
    carrier_delay integer,
    weather_delay integer,
    nas_delay integer,
    security_delay integer,
    late_aircraft_delay integer
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS airline_delay_cause_db."Airlines"
    OWNER to postgres;
	
SELECT * 
FROM airline_delay_cause_db."Airlines"