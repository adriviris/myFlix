SELECT * 
	FROM movies
	WHERE genreid IN(
		SELECT genreid
			FROM genres
			WHERE name = 'Horror'
	)
		