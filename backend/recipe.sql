CREATE TABLE "recipe"(
    "id" SERIAL PRIMARY KEY	,
    "recipe_id" int NOT NULL,
    "food" VARCHAR(255) NOT NULL,
    "quantity" decimal NOT NULL,
    "uom" VARCHAR(255) NOT NULL
);