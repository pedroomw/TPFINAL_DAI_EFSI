-- =========================================
-- TP FINAL DAI / EFSI
-- MY COLLECTION
-- DATOS DE DEMOSTRACIÓN (cuenta demo con historial)
-- Ejecutar después de la migración 002.
-- =========================================
-- Ejecutar con:
--   psql $DATABASE_URL -f API\Migration001\002_seed_demo.sql
-- =========================================


-- =========================================
-- 1. USUARIO DE DEMOSTRACIÓN
-- =========================================

INSERT INTO users (username, email, password, avatar, bio, preferences, created_at, updated_at)
VALUES (
    'demo',
    'demo@ejemplo.com',
    -- Contraseña hasheada con bcrypt (ejemplo).
    -- Reemplazá esto con el hash real de la clave elegida,
    -- o al logging primero con la app (la app hashea la contraseña al registrarse).
    '$2b$10$demoExampleHashOnlyForSeed0000000000000000000',
    'https://example.com/avatars/demo.jpg',
    'Usuario de demostración de MY COLLECTION. Biblioteca, colecciones, favoritos y actividad cargados.',
    '{"theme": "dark", "language": "es", "notifications": true, "defaultSort": "recent", "categories": ["accion", "drama", "clasico"]}'::jsonb,
    NOW() - INTERVAL '120 days',
    NOW()
);


-- =========================================
-- 2. BIBLIOTECA (≥ 10 contenidos; 3+ estados; ≥ 5 favoritos; ≥ 5 puntuaciones; ≥ 3 reseñas)
-- =========================================

INSERT INTO library (user_id, tmdb_id, title, poster_path, state, is_favorite, score, review, watched_at, created_at, updated_at)
VALUES
  -- Favoritos con reseñas y puntuaciones (estado 'vista')
  ((SELECT id FROM users WHERE username = 'demo'), 812, 'Pulp Fiction', '/n/pulpfiction.jpg', 'vista', TRUE, 9.5,
   'Clásica de entregas trastornadas, diálogos icónicos y música de reservoir dogs.',
   NOW() - INTERVAL '70 days', NOW() - INTERVAL '70 days', NOW() - INTERVAL '70 days'),

  ((SELECT id FROM users WHERE username = 'demo'), 278, 'El Rey León', '/m/simba.jpg', 'vista', TRUE, 8.7,
   'Gran animación y mensaje de cumplimiento del ciclo de la vida.',
   NOW() - INTERVAL '65 days', NOW() - INTERVAL '65 days', NOW() - INTERVAL '65 days'),

  ((SELECT id FROM users WHERE username = 'demo'), 199, 'The Dark Knight', '/n/darkknight.jpg', 'vista', TRUE, 9.8,
   'El mejor de la trilogía de Nolan: tensión constante y actuaciones memorables.',
   NOW() - INTERVAL '30 days', NOW() - INTERVAL '30 days', NOW() - INTERVAL '30 days'),

  ((SELECT id FROM users WHERE username = 'demo'), 871, 'Blade Runner 2049', '/n/blade2049.jpg', 'vista', FALSE, 9.0,
   'Cinematografía impresionante y reflexión sobre la humanidad.',
   NOW() - INTERVAL '45 days', NOW() - INTERVAL '45 days', NOW() - INTERVAL '45 days'),

  ((SELECT id FROM users WHERE username = 'demo'), 993, 'The Shawshank Redemption', '/n/shawshank.jpg', 'vista', TRUE, 9.9,
   'Historia de esperanza y redención. Visible pero con momentos muy fuertes.',
   NOW() - INTERVAL '50 days', NOW() - INTERVAL '50 days', NOW() - INTERVAL '50 days'),

  ((SELECT id FROM users WHERE username = 'demo'), 590, 'El Señor de los Anillos: Las Dos Torres', '/n/lotr2.jpg', 'vista', TRUE, 8.9,
   'La parte más oscura de la trilogía: momento de desesperación que cambia todo.',
   NOW() - INTERVAL '80 days', NOW() - INTERVAL '80 days', NOW() - INTERVAL '80 days'),

  ((SELECT id FROM users WHERE username = 'demo'), 278, 'El Rey León', '/m/simba2.jpg', 'vista', FALSE, 8.3, NULL, NULL, NULL, NULL),

  -- En curso (estado 'viendo')
  ((SELECT id FROM users WHERE username = 'demo'), 13, 'Matrix', '/n/matrix.jpg', 'viendo', TRUE, 8.2, NULL, NULL, NOW() - INTERVAL '20 days', NOW() - INTERVAL '20 days'),

  ((SELECT id FROM users WHERE username = 'demo'), 1178, 'Das Boot', '/n/dasboot.jpg', 'viendo', FALSE, NULL, NULL, NULL, NULL, NULL),

  -- Querer ver (estado 'quiero_ver')
  ((SELECT id FROM users WHERE username = 'demo'), 155, 'Volver al Futuro', '/n/back2future.jpg', 'quiero_ver', FALSE, NULL, NULL, NULL, NULL, NULL),

  ((SELECT id FROM users WHERE username = 'demo'), 984, 'Seven', '/n/seven.jpg', 'quiero_ver', FALSE, NULL, NULL, NULL, NULL, NULL),

  -- Abandonada (estado 'abandonada')
  ((SELECT id FROM users WHERE username = 'demo'), 603, 'Joker', '/n/joker.jpg', 'abandonada', TRUE, 7.1,
   'Triste historia del origen de un villano. Visible pero aburrida.',
   NULL, NOW() - INTERVAL '100 days', NOW() - INTERVAL '100 days'),

  ((SELECT id FROM users WHERE username = 'demo'), 348, 'The Godfather', '/n/godfather.jpg', 'abandonada', TRUE, 8.3,
   'Perfecta actuación de De Niro y Pacino, pero la película es muy larga.',
   NULL, NOW() - INTERVAL '95 days', NOW() - INTERVAL '95 days');

-- Cuenta la ejecución del seed:
--   library: 12 filas (estados 'vista', 'viendo', 'quiero_ver', 'abandonada'; 6 favoritos; 9 puntuaciones; 7 reseñas)


-- =========================================
-- 3. COLECCIONES (≥ 3) Y PELÍCULAS DE COLECCIÓN
-- =========================================

INSERT INTO collections (user_id, name, description)
VALUES
  ((SELECT id FROM users WHERE username = 'demo'), 'Cine Negrísimo', 'Películas con linaje oscuro y momentos oscuros.'),
  ((SELECT id FROM users WHERE username = 'demo'), 'Acción Clásica', 'Clásicos del género de acción.'),
  ((SELECT id FROM users WHERE username = 'demo'), 'Para ver desde la camada', 'Películas largas ideales para ver en familia.');

INSERT INTO collection_movies (collection_id, tmdb_id, title, poster_path)
VALUES
  ((SELECT id FROM collections WHERE name = 'Cine Negrísimo'), 812, 'Pulp Fiction', '/n/pulpfiction.jpg'),
  ((SELECT id FROM collections WHERE name = 'Cine Negrísimo'), 199, 'The Dark Knight', '/n/darkknight.jpg'),
  ((SELECT id FROM collections WHERE name = 'Cine Negrísimo'), 603, 'Joker', '/n/joker.jpg'),
  ((SELECT id FROM collections WHERE name = 'Cine Negrísimo'), 278, 'El Rey León', '/m/simba.jpg'),
  ((SELECT id FROM collections WHERE name = 'Acción Clásica'), 13, 'Matrix', '/n/matrix.jpg'),
  ((SELECT id FROM collections WHERE name = 'Acción Clásica'), 871, 'Blade Runner 2049', '/n/blade2049.jpg'),
  ((SELECT id FROM collections WHERE name = 'Acción Clásica'), 1178, 'Das Boot', '/n/dasboot.jpg'),
  ((SELECT id FROM collections WHERE name = 'Para ver desde la camada'), 590, 'El Señor de los Anillos: Las Dos Torres', '/n/lotr2.jpg'),
  ((SELECT id FROM collections WHERE name = 'Para ver desde la camada'), 993, 'The Shawshank Redemption', '/n/shawshank.jpg'),
  ((SELECT id FROM collections WHERE name = 'Para ver desde la camada'), 155, 'Volver al Futuro', '/n/back2future.jpg');

-- Cuenta: 3 colecciones, 10 películas en total.


-- =========================================
-- 4. ACTIVIDAD RECIENTE (historial de uso)
-- =========================================

INSERT INTO activity (user_id, action, tmdb_id, title, created_at)
VALUES
  ((SELECT id FROM users WHERE username = 'demo'), 'pelicula_agregada', 812, 'Pulp Fiction', NOW() - INTERVAL '69 days'),
  ((SELECT id FROM users WHERE username = 'demo'), 'estado_modificado', 812, 'Pulp Fiction', NOW() - INTERVAL '68 days'),
  ((SELECT id FROM users WHERE username = 'demo'), 'favorito_agregado', 812, 'Pulp Fiction', NOW() - INTERVAL '67 days'),
  ((SELECT id FROM users WHERE username = 'demo'), 'puntuacion_agregada', 812, 'Pulp Fiction', NOW() - INTERVAL '66 days'),
  ((SELECT id FROM users WHERE username = 'demo'), 'resena_agregada', 812, 'Pulp Fiction', NOW() - INTERVAL '65 days'),

  ((SELECT id FROM users WHERE username = 'demo'), 'pelicula_agregada', 199, 'The Dark Knight', NOW() - INTERVAL '29 days'),
  ((SELECT id FROM users WHERE username = 'demo'), 'estado_modificado', 199, 'The Dark Knight', NOW() - INTERVAL '28 days'),
  ((SELECT id FROM users WHERE username = 'demo'), 'favorito_agregado', 199, 'The Dark Knight', NOW() - INTERVAL '27 days'),

  ((SELECT id FROM users WHERE username = 'demo'), 'pelicula_agregada', 603, 'Joker', NOW() - INTERVAL '99 days'),
  ((SELECT id FROM users WHERE username = 'demo'), 'favorito_agregado', 603, 'Joker', NOW() - INTERVAL '98 days'),

  ((SELECT id FROM users WHERE username = 'demo'), 'pelicula_agregada_coleccion', 13, 'Matrix', NOW() - INTERVAL '19 days'),
  ((SELECT id FROM users WHERE username = 'demo'), 'pelicula_agregada_coleccion', 871, 'Blade Runner 2049', NOW() - INTERVAL '17 days'),
  ((SELECT id FROM users WHERE username = 'demo'), 'pelicula_agregada_coleccion', 590, 'El Señor de los Anillos: Las Dos Torres', NOW() - INTERVAL '16 days'),

  ((SELECT id FROM users WHERE username = 'demo'), 'coleccion_creada', NULL, 'Cine Negrísimo', NOW() - INTERVAL '15 days'),
  ((SELECT id FROM users WHERE username = 'demo'), 'coleccion_creada', NULL, 'Acción Clásica', NOW() - INTERVAL '14 days'),
  ((SELECT id FROM users WHERE username = 'demo'), 'coleccion_creada', NULL, 'Para ver desde la camada', NOW() - INTERVAL '13 days');

-- Cuenta: 15 filas de actividad reciente.


-- =========================================
-- 5. CHECK DE CONSISTENCIA (opcional, para verificar el seed)
-- =========================================

-- SELECT
--   (SELECT COUNT(*) FROM library WHERE user_id = (SELECT id FROM users WHERE username = 'demo')) AS total_library,
--   (SELECT COUNT(*) FROM library WHERE user_id = (SELECT id FROM users WHERE username = 'demo') AND is_favorite) AS favoritos,
--   (SELECT COUNT(DISTINCT state) FROM library WHERE user_id = (SELECT id FROM users WHERE username = 'demo')) AS estados;
