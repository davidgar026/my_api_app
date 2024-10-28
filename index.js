import express from "express";
import bodyParser from "body-parser";
import axios from "axios";
import ejs from "ejs";

const app = express();
const port = 3000;
const API_url = "http://taco-randomizer.herokuapp.com/";
const body = {

};


app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));


app.get("/", async(req, res) => {
    try{
        const result = await axios.get(API_url + "random");
        res.render("index.ejs", {
            content:JSON.stringify(result.data),
        });
    }catch(error){
        res.status(404).send(error.message);
    }
})







app.listen(port, () => {
    console.log(`Server is running on port ${port}.`);
})
