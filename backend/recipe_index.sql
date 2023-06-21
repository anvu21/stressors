CREATE TABLE "recipee"(
    "recipe_id" SERIAL PRIMARY KEY,
    "name" VARCHAR(255) UNIQUE,
    "serving" decimal NOT NULL,
	"location" VARCHAR(255) NOT NULL
);