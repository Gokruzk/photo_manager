CREATE OR REPLACE FUNCTION SP_CALENDARIO()
RETURNS VOID AS $$
		DECLARE
			Fecha timestamp;
  			FechaFinal timestamp;
BEGIN
		Fecha := '2000-01-01'::timestamp;
  		FechaFinal := '2100-12-31'::timestamp;
		WHILE Fecha < FechaFinal LOOP
			INSERT INTO dates (
			cod_date,
      		"day"
		 	)
			VALUES(
				TO_CHAR(Fecha,'YYYYMMDD')::integer,
      			Fecha
		 	);
			Fecha := Fecha + INTERVAL '1 day';
  		END LOOP;
END;
$$ LANGUAGE plpgsql;

SELECT sp_calendario()