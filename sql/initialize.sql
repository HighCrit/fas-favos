-- Table: service
CREATE TABLE service (
    id integer NOT NULL CONSTRAINT service_pk PRIMARY KEY AUTOINCREMENT,
    name varchar(32) NOT NULL UNIQUE
);

-- Table: token
CREATE TABLE token (
    id integer NOT NULL CONSTRAINT token_pk PRIMARY KEY AUTOINCREMENT,
    service_id integer NOT NULL,
    token character(36) NOT NULL,
    CONSTRAINT token_service FOREIGN KEY (service_id)
    REFERENCES service (id)
    ON DELETE CASCADE
);