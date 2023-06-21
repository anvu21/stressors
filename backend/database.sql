CREATE TABLE "food"(
    "id" SERIAL PRIMARY KEY,
    "food" VARCHAR(255) UNIQUE,
    "density" decimal NOT NULL,
    "carbon" decimal NOT NULL
);

