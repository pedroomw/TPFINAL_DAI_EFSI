-- =========================================
-- TP FINAL DAI / EFSI
-- MY COLLECTION
-- MIGRATION 002 (modelo según TP: incluye activity, preferences, watched_at)
-- =========================================


-- =========================================
-- 1. TABLA USERS
-- =========================================
-- Almacena los usuarios registrados.

CREATE TABLE users (
    id SERIAL PRIMARY KEY,

    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,

    avatar TEXT,
    bio TEXT,

    preferences JSONB NOT NULL DEFAULT '{}'::jsonb,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);


-- =========================================
-- 2. TABLA LIBRARY
-- =========================================
-- Almacena las películas de la biblioteca personal
-- de cada usuario.

CREATE TABLE library (
    id SERIAL PRIMARY KEY,

    user_id INTEGER NOT NULL,
    tmdb_id BIGINT NOT NULL,

    title VARCHAR(255) NOT NULL,
    poster_path TEXT,

    state VARCHAR(20) NOT NULL DEFAULT 'quiero_ver',

    is_favorite BOOLEAN NOT NULL DEFAULT FALSE,

    score NUMERIC(3,1),

    review TEXT,

    watched_at TIMESTAMP,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_library_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    CONSTRAINT unique_user_movie
        UNIQUE (user_id, tmdb_id),

    CONSTRAINT check_library_state
        CHECK (state IN (
            'quiero_ver',
            'viendo',
            'vista',
            'abandonada'
        )),

    CONSTRAINT check_library_score
        CHECK (score IS NULL OR (score >= 1 AND score <= 10))
);


-- =========================================
-- 3. TABLA COLLECTIONS
-- =========================================
-- Almacena las colecciones personalizadas
-- creadas por cada usuario.

CREATE TABLE collections (
    id SERIAL PRIMARY KEY,

    user_id INTEGER NOT NULL,

    name VARCHAR(100) NOT NULL,
    description TEXT,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_collections_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);


-- =========================================
-- 4. TABLA COLLECTION_MOVIES
-- =========================================
-- Relaciona las películas con las colecciones.
-- Una colección puede contener muchas películas.

CREATE TABLE collection_movies (
    id SERIAL PRIMARY KEY,

    collection_id INTEGER NOT NULL,

    tmdb_id BIGINT NOT NULL,
    title VARCHAR(255) NOT NULL,
    poster_path TEXT,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_collection_movies_collection
        FOREIGN KEY (collection_id)
        REFERENCES collections(id)
        ON DELETE CASCADE,

    CONSTRAINT unique_collection_movie
        UNIQUE (collection_id, tmdb_id)
);


-- =========================================
-- 5. TABLA ACTIVITY
-- =========================================
-- Registra las acciones realizadas por cada usuario.
-- Permite mostrar actividad reciente y consultar
-- el historial de uso de la aplicación.

CREATE TABLE activity (
    id SERIAL PRIMARY KEY,

    user_id INTEGER NOT NULL,

    action VARCHAR(50) NOT NULL,

    tmdb_id BIGINT,
    title VARCHAR(255),

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_activity_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    CONSTRAINT check_activity_action
        CHECK (action IN (
            'pelicula_agregada',
            'estado_modificado',
            'favorito_agregado',
            'favorito_quitado',
            'puntuacion_agregada',
            'resena_agregada',
            'resena_modificada',
            'coleccion_creada',
            'coleccion_eliminada',
            'pelicula_agregada_coleccion',
            'pelicula_quitada_coleccion'
        ))
);


-- =========================================
-- 6. FUNCION PARA ACTUALIZAR updated_at
-- =========================================
-- Actualiza automáticamente la fecha de modificación
-- cuando se modifica un usuario o una película.

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;


-- =========================================
-- 7. TRIGGERS DE ACTUALIZACION
-- =========================================

CREATE TRIGGER trigger_users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();


CREATE TRIGGER trigger_library_updated_at
BEFORE UPDATE ON library
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();


-- =========================================
-- 8. INDICES
-- =========================================

-- Biblioteca: búsquedas por película TMDB.
CREATE INDEX idx_library_tmdb
ON library(tmdb_id);


-- Colecciones: consultas por usuario.
CREATE INDEX idx_collections_user
ON collections(user_id);


-- Actividad: historial de cada usuario.
CREATE INDEX idx_activity_user_created
ON activity(user_id, created_at DESC);


-- Actividad: consultas por película.
CREATE INDEX idx_activity_tmdb
ON activity(tmdb_id);


-- =========================================
-- FIN DE MIGRATION 002
-- =========================================
