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

    //Functions
    function capitalizeFirstLetter(text) {
        return text.replace(/\b[a-zA-Z]/g, function(match) {
          return match.toUpperCase();
        });
      }


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


        /*YOU LEFT OFF HERE 
        
        (11/9/24 11:44am)
        
        What tf was I doing: I was trying to use the user's genre inputs and filter tv shows that have either 1 user selected genre or multiple selected genres.

        Problem: I keep getting this error: text.replace is not a function
        
        
        */
        //filters each object item's premier data
            for(let i=0; i < result.data.length; i++){
                if(result.data[i].premiered.replace(/['"]+|-.*/g, '') == req.body.birthYear){
                    console.log(result.data[i])
                }
            }

        
       console.log("TEST - true or false: ", result.data[0].genres.includes(capitalizeFirstLetter(selectedOptions)))
       //console.log("TEST - true or false: ", result.data[0].genres.includes(selectedOptions.map(capitalizeFirstLetter)))
       //console.log("selected genres w capitalizing = ", selectedOptions.map(capitalizeFirstLetter))
       //console.log("API's genres = ", result.data[0].genres);


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
