import express from "express";
import bodyParser from "body-parser";
import axios from "axios";

const app = express();
const port = 3000;
const API_url = "https://api.tvmaze.com/shows";
const body = {

};


app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));


app.get("/", (req, res) => {
    res.render("index.ejs")
})


app.post("/", async(req, res) => {
    try{
        const result = await axios.get(API_url, req.body,{});
        const selectedOptions = req.body.options;
            //console.log(selectedOptions[1])
        if (Array.isArray(selectedOptions)) {
            console.log("Selected options:", selectedOptions);
          } else if (selectedOptions) {
            // If only one checkbox is selected, it will be a string
            console.log("Selected option:", [selectedOptions]);
          } else {
            console.log("No options selected.");
          }


          result.data.forEach(el => {
            //console.log(el.name)
        })


          
        //console.log(selectedOptions.includes(result.data[0].genres))
        //console.log("selectedOptions = ", typeof(selectedOptions));
        //const hasValue = (obj, value) => Object.values(obj).includes(value);
        //console.log("Obj = ", result.data[0])
        //console.log("true or false: ", hasValue(result.data[0],'Ended'))
        console.log("true or false: ", result.data[0].genres.includes('Science-Fiction'))



        res.render("results.ejs", {
            yourName: req.body.nameText,
            yourBirthYear: req.body.birthYear,
            yourGenre: selectedOptions,
            tvshow: JSON.stringify((result.data[0].name)).replace(/['"]+/g, ''),
            year: JSON.stringify((result.data[0].premiered)).replace(/['"]+|-.*/g, ''),
            genre: JSON.stringify((result.data[0].genres)).replace(/['"]+/g, ''),
        })
    }catch(error){
        res.status(404).send(error.message);
    }
});









app.listen(port, () => {
    console.log(`Server is running on port ${port}.`);
})
