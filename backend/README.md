**Edit a file, create a new file, and clone from Bitbucket in under 2 minutes**

Do 
npm run start
then npm run start inside client
git push heroku HEAD:master

To COMMIT TO HEROKU:
heroku login
git add . 
git commit -am "e"
git push heroku main
git push -f heroku HEAD:master
git push heroku HEAD:master


*We recommend that you open this README in another tab as you perform the tasks below. You can [watch our video](https://youtu.be/0ocf7u76WSo) for a full demo of all the steps in this tutorial. Open the video in a new tab to avoid leaving Bitbucket.*



---

SQL Section:
\dt to list all relations 
\q to quit sql
heroku pg:psql -a lehigh-fcf (To go into database)
cat database.sql | heroku pg:psql -a lehigh-fcf (catnate database.sql) into heroku database)
cat recipe_index.sql | heroku pg:psql -a lehigh-fcf
CREATE DATABASE FCF;

DROP TABLE IF EXISTS food;
CREATE TABLE "food"(
    "id" SERIAL PRIMARY KEY,
    "food" VARCHAR(255) UNIQUE,
    "density" decimal NOT NULL,
    "carbon" decimal NOT NULL
);
CREATE TABLE "recipe"(
    "id" SERIAL PRIMARY KEY	,
    "recipe_id" int NOT NULL,
    "food" VARCHAR(255) NOT NULL,
    "quantity" decimal NOT NULL,
    "uom" VARCHAR(255) NOT NULL
);

CREATE TABLE "recipe_index"(
    "recipe_id" SERIAL PRIMARY KEY,
    "name" VARCHAR(255) UNIQUE,
    "serving" decimal NOT NULL,
	"location" VARCHAR(255) NOT NULL
);

Select Re.name, Re.serving,Re.location, r.food, r.quantity, r.uom, f.density, f.carbon
	FROM recipe_index AS Re
	JOIN recipe AS r
	On Re.recipe_id = r.recipe_id
	Join food as f
	On f.food = r.food

INSERT INTO food (food, density, carbon) VALUES ('rice' ,50 ,50 );
Select * from food;

const Food = await pool.query(
            "INSERT INTO food (food, unit, carbon) 
            VALUES ($1,$2 ,$3) 
            ON CONFLICT (food) DO NOTHING",
            [name,unit,carbon]
          );