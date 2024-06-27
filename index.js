const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const mysql = require('mysql2');
const cors = require('cors');

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
/*------------------------------------------
--------------------------------------------
parse application/json
--------------------------------------------
--------------------------------------------*/
app.use(bodyParser.json());
app.use(cors({origin:'*'}));

/*------------------------------------------
--------------------------------------------
Database Connection
--------------------------------------------
--------------------------------------------*/
const conn = mysql.createConnection({
  host: process.env['host'],
  user: process.env['username'], /* MySQL User */
  password: process.env['password'], /* MySQL Password */
  database: 'sakila' /* MySQL Database */
});

/*------------------------------------------
--------------------------------------------
Shows Mysql Connect
--------------------------------------------
--------------------------------------------*/
conn.connect((err) =>{
  if(err) throw err;
  console.log('Mysql Connected with App...');
});

/**
 * Get All Items
 *
 * @return response()
 */
app.get('/api/v1/actors',(req, res) => {
  let sqlQuery = "SELECT * FROM actor";

  let query = conn.query(sqlQuery, (err, results) => {
    if(err) throw err;
    res.send(apiResponse(results));
  });
});

app.get('/api/v1/customers',(req, res) => {
  let sqlQuery = "SELECT * FROM customer";

  let query = conn.query(sqlQuery, (err, results) => {
    if(err) throw err;
    res.send(apiResponse(results));
  });
});

app.get('/api/v1/stores',(req, res) => {
  let sqlQuery = "SELECT * FROM store";

  let query = conn.query(sqlQuery, (err, results) => {
    if(err) throw err;
    res.send(apiResponse(results));
  });
});

app.get('/api/v1/staff',(req, res) => {
  let sqlQuery = "SELECT * FROM staff";

  let query = conn.query(sqlQuery, (err, results) => {
    if(err) throw err;
    res.send(apiResponse(results));
  });
});

// Special handling for /films with optional search query
app.get('/api/v1/films', (req, res) => {
    let sqlQuery = "SELECT * FROM film";
    const params = [];

    if (req.query.query) {
        sqlQuery += " WHERE title LIKE ?";
        params.push(`%${req.query.query}%`);
    }

    let query = conn.query(sqlQuery, params, (err, results) => {
      if(err) throw err;
      res.send(apiResponse(results));
    });
});


/**
 * Get Single Item
 *
 * @return response()
 */
app.get('/api/v1/actors/:id',(req, res) => {
  let sqlQuery = "SELECT * FROM actor WHERE actor_id = " + req.params.id;

  let query = conn.query(sqlQuery, (err, results) => {
    if(err) throw err;
    res.send(apiResponse(results));
  });
});

app.get('/api/v1/films/:id',(req, res) => {
  let sqlQuery = "SELECT * FROM film WHERE film_id = " + req.params.id;

  let query = conn.query(sqlQuery, (err, results) => {
    if(err) throw err;
    res.send(apiResponse(results));
  });
});

app.get('/api/v1/customers/:id',(req, res) => {
  let sqlQuery = "SELECT * FROM customer WHERE customer_id = "+ req.params.id;

  let query = conn.query(sqlQuery, (err, results) => {
    if(err) throw err;
    res.send(apiResponse(results));
  });
});

app.get('/api/v1/stores/:id',(req, res) => {
  let sqlQuery = "SELECT * FROM store WHERE store_id = " + req.params.id;

  let query = conn.query(sqlQuery, (err, results) => {
    if(err) throw err;
    res.send(apiResponse(results));
  });
});

app.get('/api/v1/staff/:id',(req, res) => {
  let sqlQuery = "SELECT * FROM staff WHERE staff_id = "+ req.params.id;

  let query = conn.query(sqlQuery, (err, results) => {
    if(err) throw err;
    res.send(apiResponse(results));
  });
});

app.get('/api/v1/inventory/:id',(req, res) => {
  let sqlQuery = "SELECT * FROM inventory WHERE inventory_id = "+ req.params.id;

  let query = conn.query(sqlQuery, (err, results) => {
    if(err) throw err;
    res.send(apiResponse(results));
  });
});

// /actors/<id>/films ok

app.get('/api/v1/actors/:id/films', (req, res) => {

    let sqlQuery = `
      SELECT f.* FROM film f
      JOIN film_actor fa ON f.film_id = fa.film_id
      WHERE fa.actor_id = 
    `+ req.params.id;

    let query = conn.query(sqlQuery, (err, results) => {
      if(err) throw err;
      res.send(apiResponse(results));
    });
});

// /films/<id>/actors ok

app.get('/api/v1/films/:id/actors', (req, res) => {

    let sqlQuery = `
      SELECT a.* FROM actor a
      JOIN film_actor fa ON a.actor_id = fa.actor_id
      WHERE fa.film_id = 
    ` + req.params.id;

    let query = conn.query(sqlQuery, (err, results) => {
      if(err) throw err;
      res.send(apiResponse(results));
    });
});


// /films/<id>/detail ok

app.get('/api/v1/films/:id/detail', (req, res) => {

    let sqlQuery = "SELECT * FROM film_list WHERE FID  = "+ req.params.id;

    let query = conn.query(sqlQuery, (err, results) => {
      if(err) throw err;
      res.send(apiResponse(results));
    });
});

// /customers/<id>/detail ok

app.get('/api/v1/customers/:id/detail', (req, res) => {

    let sqlQuery = "SELECT * FROM customer_list WHERE ID = "+ req.params.id;

    let query = conn.query(sqlQuery, (err, results) => {
      if(err) throw err;
      res.send(apiResponse(results));
    });
});


// /actors/<id>/detail ok

app.get('/api/v1/actors/:id/detail', (req, res) => {

    let sqlQuery = "SELECT * FROM actor_info WHERE actor_id = "+ req.params.id;

    let query = conn.query(sqlQuery, (err, results) => {
      if(err) throw err;
      res.send(apiResponse(results));
    });

    
});


// /inventory-in-stock/<film_id>/<store_id> not ok

app.get('/api/v1/inventory-in-stock/:film_id/:store_id', (req, res) => {

    let sqlQuery = "CALL film_in_stock("+ req.params.film_id+','+ req.params.store_id+', @count)';

    let query = conn.query(sqlQuery, (err, results) => {
      if(err) throw err;
      
    });

    let sqlResult = "SELECT @count";
    let queryResult = conn.query(sqlResult, (err, results) => {
      if(err) throw err;
      res.send(apiResponse(results));
    });
      
  
});


/**
 * API Response
 *
 * @return response()
 */
function apiResponse(results){
    return JSON.stringify(results);
}



const url = "mongodb+srv://lhuan3:huang3903721@cluster0.atso1vj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

//Create a MongoClient with a MongoClientOptions object to set the StableAPI version
const client = new MongoClient(url, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});
// connect
client.connect();

// Mongo basic endpoint

app.get('/api/v1/movies', async (req, res) => {
  try {
    await client.connect();
    let database = client.db("sample_mflix");
    let collection=database.collection("movies");
    let result = await collection.find()
      .limit(10)
      .toArray()
    res.send(apiResponse(result))
  } catch(err) {
    console.error('Something went wrong:${err}\n');
    res.send(apiResponse(["An error has occurred."]))
  } finally {
    await client.close();
  }
});


// app.get('/api/v1/movies/:id',async(req,res)=>{
//   try {
//     await client.connect();
//     let database = client.db("sample_mflix");
//     let collection= database.collection("movies");
//     let objectId = new objectId(req.params.id);
//     const result = await collection.find({"_id": objectId}).toArray();

//     res.send(apiResponse(result))
//   } catch(err){
//     console.error('Something went wrong:${err}\n');
//     res.send(apiResponse(["An error has occurred."]))
//   }
// });

// CRUD for MongoDB 'colors' collection
app.get('/api/v1/colors', async (req, res) => {
    try{
      await client.connect();
      const database = client.db("cs480-project2");
      const collection = database.collection("colors");
      const colors = await collection.find().toArray();
      res.send(apiResponse(colors));
    } catch(err){
      res.send("An error has occurred.")
    } finally {
      await client.close();
   }
    
});

app.post('/api/v1/colors', async (req, res) => {
    try{
        await client.connect();
        const database = client.db("cs480-project2");
        const collection = database.collection("colors");
        const result = await collection.insertOne(req.body);
        res.send(apiResponse(result));
      } catch(err){
        res.send("An error has occurred.")
      } finally {
        await client.close();
     }
    
});

app.get('/api/v1/colors/:id', async (req, res) => {
    try{
        await client.connect();
        const database = client.db("cs480-project2");
        const collection = database.collection("colors");
        const result = await collection.findOne({ _id: new ObjectId(req.params.id) });
        res.send(apiResponse(result));
      } catch(err){
        res.send("An error has occurred.")
      } finally {
        await client.close();
     }

});

app.delete('/api/v1/colors/:id', async (req, res) => {

    try{
        await client.connect();
        const database = client.db("cs480-project2");
        const collection = database.collection("colors");
        const result = await collection.deleteOne({ _id: new ObjectId(req.params.id) });
        res.send(apiResponse(result));
      } catch(err){
        res.send("An error has occurred.")
      } finally {
        await client.close();
     }


  
    
});


/*------------------------------------------
--------------------------------------------
Server listening
--------------------------------------------
--------------------------------------------*/
app.listen(3000,() =>{
  console.log('Server started on port 3000...');
});