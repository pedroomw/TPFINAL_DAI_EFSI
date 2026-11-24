
CREATE TABLE users (
    id          SERIAL PRIMARY KEY,
    username    VARCHAR(50)  NOT NULL UNIQUE,
    email       VARCHAR(255) NOT NULL UNIQUE,
    password    VARCHAR(255) NOT NULL,
    avatar      TEXT,
    bio         TEXT,
    preferences JSONB        NOT NULL DEFAULT '{}'::jsonb,
    created_at  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE library (
    id          SERIAL PRIMARY KEY,
    user_id     INTEGER      NOT NULL,
    tmdb_id     BIGINT       NOT NULL,
    title       VARCHAR(255) NOT NULL,
    poster_path TEXT,

    -- Estado de seguimiento del usuario
    state       VARCHAR(20)  NOT NULL DEFAULT 'quiero_ver',
    is_favorite BOOLEAN      NOT NULL DEFAULT FALSE,
    score       NUMERIC(3,1),
    review      TEXT,
    watched_at  TIMESTAMP,

    created_at  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_library_user
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,

    CONSTRAINT unique_user_movie
        UNIQUE (user_id, tmdb_id),

    CONSTRAINT check_library_state
        CHECK (state IN ('quiero_ver', 'viendo', 'vista', 'abandonada')),

    CONSTRAINT check_library_score
        CHECK (score IS NULL OR (score BETWEEN 1 AND 10))
);


CREATE TABLE collections (
    id          SERIAL PRIMARY KEY,
    user_id     INTEGER      NOT NULL,
    name        VARCHAR(100) NOT NULL,
    description TEXT,
    created_at  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_collections_user
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);


CREATE TABLE collection_movies (
    id            SERIAL PRIMARY KEY,
    collection_id INTEGER      NOT NULL,
    tmdb_id       BIGINT       NOT NULL,
    title         VARCHAR(255) NOT NULL,
    poster_path   TEXT,
    created_at    TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_collection_movies_collection
        FOREIGN KEY (collection_id) REFERENCES collections(id) ON DELETE CASCADE,

    CONSTRAINT unique_collection_movie
        UNIQUE (collection_id, tmdb_id)
);



CREATE TABLE activity (
    id         SERIAL PRIMARY KEY,
    user_id    INTEGER     NOT NULL,
    action     VARCHAR(50) NOT NULL,
    tmdb_id    BIGINT,
    title      VARCHAR(255),
    created_at TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_activity_user
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,

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



CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trigger_library_updated_at
    BEFORE UPDATE ON library
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();



CREATE INDEX idx_library_tmdb           ON library(tmdb_id);
CREATE INDEX idx_collections_user       ON collections(user_id);
CREATE INDEX idx_activity_user_created  ON activity(user_id, created_at DESC);
CREATE INDEX idx_activity_tmdb          ON activity(tmdb_id);


