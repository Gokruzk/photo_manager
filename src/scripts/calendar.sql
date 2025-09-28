-- POSTGRES
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

--MYSQL
DELIMITER $$

CREATE PROCEDURE SP_CALENDARIO()
BEGIN
    DECLARE Fecha DATE;
    DECLARE FechaFinal DATE;

    SET Fecha = '2000-01-01';
    SET FechaFinal = '2100-12-31';

    WHILE Fecha <= FechaFinal DO
        INSERT INTO dates (cod_date, `day`)
        VALUES (
            DATE_FORMAT(Fecha, '%Y%m%d'),
            Fecha
        );
        SET Fecha = DATE_ADD(Fecha, INTERVAL 1 DAY);
    END WHILE;
END$$

DELIMITER ;

-- Ejecutar el procedimiento
CALL SP_CALENDARIO();
