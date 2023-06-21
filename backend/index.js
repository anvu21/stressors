const express = require("express")
const bodyParser = require('body-parser')
const cors = require('cors')
const app = express()
const pool = require("./db");
const apiKey = process.env.OPENAI_API_KEY;
const path=require("path")
const PORT=process.env.PORT ||5000;
const { Configuration, OpenAIApi } = require("openai");
const axios = require('axios');

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);
//middleware
app.use(cors());
app.use(express.json())
//app.use(express.static("./client/build"))

if (process.env.NODE_ENV === 'production'){
  //server static conetent
  app.use(express.static(path.join(__dirname, "client/build")))
}
//routes
app.get('/register', function(req, res) {
    res.send("Welcome");
    
});
//create
app.post('/ask', async (req, res) => {

  //const prompt = 'Write me a short description';
  //console.log(req.body.text)
  //console.log(req.body)

  try {
 //   if (prompt == null) {
 //    throw new Error("Uh oh, no prompt was provided");
 //   }
    prompt = req.body.text
    if (prompt == null) {
          throw new Error("Uh oh, no prompt was provided");
         }
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt,
      temperature: 0.7,
      max_tokens: 500,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    });
    
    const completion = response.data.choices[0].text;
    console.log(response.data)
    console.log(completion)

    return res.status(200).json({
      success: true,
      message: completion,
     
    });
  } catch (error) {
    console.log(error.message);
  }
  


});

app.post("/food", async(req,res)=> {
    try{
        
        var name= req.body.food
        var density= req.body.density
        var carbon = req.body.carbon
        console.log(name, density,carbon)
        console.log(req.body)
        //INSERT INTO food (Food, density, Carbon) VALUES (rice,g,50)
        const Food = await pool.query(
            "INSERT INTO food (food, density, carbon) VALUES ($1,$2 ,$3) ON CONFLICT (food) DO NOTHING Returning *",
            [name,density,carbon]
          );
      
          res.json(Food.rows[0]);
        } catch (err) {
            console.error("error")
          console.error(err.message);
        }
  


})
//recipe post recipe
app.post("/recipe", async(req,res)=> {
  try{
      
      console.log(req.body)
      var count = Object.keys(req.body).length
      //console.log(count)
      var recipe = req.body[0].recipe;
      console.log("Recipe:"+recipe);
      var serving = req.body[0].serving;
      console.log("Serving:"+serving);
      var location = req.body[0].location;
      console.log("location:"+location);
      const result = await pool.query(
        "INSERT INTO recipe_index(name,serving,location) VALUES ($1,$2,$3) RETURNING recipe_id",
        [recipe,serving,location]
      );
      const recipe_id =result.rows[0]
      console.log(recipe_id.recipe_id)

      for (let  i=0; i<count;i++){
        var recipe = req.body[i].recipe;
        console.log("Recipe:"+recipe);
        
        var food = req.body[i].food;
        console.log("Food:"+food);
        
        var quantity = req.body[i].quantity;
        console.log("Quantity:"+quantity);
        var uom = req.body[i].uom;
        console.log("Uom:"+uom);
        
        
        const Recipe = await pool.query(
          "INSERT INTO recipe(recipe_id,food,quantity,uom) VALUES ($1,$2,$3,$4)",
          [recipe_id.recipe_id,food,quantity,uom]
        );
      }
      //res.json(Recipe.rows[i]);
    
      } catch (err) {
          console.error("error")
        console.error(err.message);
      }



})



 app.get("*",(req,res)=>{
   res.sendFile(path.join(__dirname, "client/build/index.html"));

 })



app.listen(PORT,()=>{
    console.log(`server start on port ${PORT}`)


})
