require("dotenv").config();
const morgan = require("morgan");
const express = require("express");
const cors = require("cors")
const db = require("./db");

const app = express();

app.use(morgan("dev"));
app.use(cors())
app.use(express.json());

// Get all Restaurants
app.get("/api/v1/restaurants", async (req, res) => {

    try {
        const restaurantRatingData = await db.query('Select * from restaurants left join (select restaurant_id,COUNT(*),TRUNC(AVG(rating),1) as average_rating from reviews group by restaurant_id) reviews on restaurants.id = reviews.restaurant_id;');


        res.status(200).json({
            status: "success",
            results: restaurantRatingData.rows.length,
            data: {
                restaurants: restaurantRatingData.rows,
            }
        });

    } catch (e) {
        console.log(e);
    }
});


// Get a Restaurant
app.get("/api/v1/restaurants/:id", async (req, res) => {
    try {

        const restaurant = await db.query('Select * from restaurants left join (select restaurant_id,COUNT(*),TRUNC(AVG(rating),1) as average_rating from reviews group by restaurant_id) reviews on restaurants.id = reviews.restaurant_id where restaurants.id = $1;', [req.params.id]);
        const reviews = await db.query("SELECT * FROM reviews WHERE restaurant_id=$1", [req.params.id]);

        res.status(200).json({
            status: "success",
            data: {
                restaurant: restaurant.rows[0],
                reviews: reviews.rows
            }
        });

    } catch (e) {
        console.log(e);
    }
});

// Create a Restaurant
app.post("/api/v1/restaurants", async (req, res) => {
    try {
        console.log(req.body);

        const results = await db.query("INSERT INTO restaurants (name, location, price_range) values ($1, $2, $3) returning *", [
            req.body.name,
            req.body.location,
            req.body.price_range
        ])

        console.log(results);

        res.status(201).json({
            status: "success",
            data: {
                restaurant: results.rows[0]
            }
        }
        );
    } catch (e) {
        console.log(e);
    }
});

// Update a Restaurant
app.put("/api/v1/restaurants/:id", async (req, res) => {
    try {


        console.log(req.params.id);
        console.log(req.body);

        const results = await db.query("UPDATE restaurants SET name=$1, location=$2, price_range=$3 WHERE id=$4 returning *", [
            req.body.name,
            req.body.location,
            req.body.price_range,
            req.params.id
        ]);

        console.log(results);

        res.status(200).json({
            status: "success",
            data: {
                restaurant: results.rows[0]
            }
        }
        );
    } catch (e) {
        console.log(e);
    }
});

// Delete a Restaurant
app.delete("/api/v1/restaurants/:id", async (req, res) => {
    try {


        console.log(req.params.id);
        console.log(req.body);

        const results = await db.query("DELETE FROM restaurants WHERE  id=$1", [req.params.id]);



        res.status(204).json({
            status: "success"
        }
        );
    } catch (e) {
        console.log(e);
    }
});

app.post("/api/v1/restaurants/:id/addReview", async (req, res) => {

    try {
        const newReview = await db.query("INSERT INTO reviews (restaurant_id,name,review,rating) values ($1,$2,$3,$4) returning *;", [req.params.id, req.body.name, req.body.review, req.body.rating]);
        console.log(newReview);
        res.status(201).json({
            status: "success",
            data: {
                review: newReview.rows[0],
            }
        });
    } catch (error) {
        console.log(error)
    }

})




const port = process.env.PORT;
app.listen(port, () => {
    console.log(`server is up and listining on port ${port}`);
});