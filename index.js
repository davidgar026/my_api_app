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
    function capitalizeFirstLetterInArray(arr) {
        return arr.map(text => {
          return text.replace(/\b[a-zA-Z]/g, function(match) {
            return match.toUpperCase();
          });
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
        
            (11/11/24 8:39pm)
        
            What tf was I doing: I was trying to use the user's genre inputs and filter tv shows that have either 1 user selected genre or multiple selected genres.

            Solution: I had to use some() so that a array from the API can be matched with any of the array elements of the user's array input. It's shown below this comment.
        
        
        */
          
          const apiArr = result.data[0].genres;
          const userArr = capitalizeFirstLetterInArray(selectedOptions);
          const hasMatch = userArr.some(item => apiArr.includes(item));

          console.log("True or False?: ", hasMatch); // true, because "banana" is in both arrays


 

        
        //filters each object item's premier data

            for(let i=0; i < result.data.length; i++){
                if(result.data[i].premiered.replace(/['"]+|-.*/g, '') == req.body.birthYear){
                    console.log(result.data[i])
                }
            }


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
