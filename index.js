import express from "express";
import bodyParser from "body-parser";
import axios from "axios";
import ejs from "ejs";

const app = express();
const port = 3000;
const API_url = "https://api.tvmaze.com/shows";
const body = {

};


app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));


app.get("/", async(req, res) => {
    try{
        const result = await axios.get(API_url);
        res.render("index.ejs", {
            tvshow: JSON.stringify((result.data[0].name)).replace(/['"]+/g, ''),
            year: JSON.stringify((result.data[0].premiered)).replace(/['"]+|-.*/g, ''),
            genre: JSON.stringify((result.data[0].genres)).replace(/['"]+/g, ''),

        });
    }catch(error){
        res.status(404).send(error.message);
    }
})







app.listen(port, () => {
    console.log(`Server is running on port ${port}.`);
})
