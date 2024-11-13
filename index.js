import express from "express";
import bodyParser from "body-parser";
import axios from "axios";

const app = express();
const port = 3000;
const API_url = "https://api.tvmaze.com/shows";
const filteredTvShowsByGenre = [];
const filteredTvShowsByPremiered = [];
let content = '';
let selectedTvShow = '';
let selectedYear = '';
let keepTrackOfIndex = '';


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


        if (Array.isArray(selectedOptions)) {
            console.log("Selected options:", selectedOptions);


            //Used some() method to check each element in a array with another array with multiple elements.
            for(let i=0;i<result.data.length; i++){
                let apiArr = result.data[i].genres;
                let userArr = capitalizeFirstLetterInArray(selectedOptions);
                let hasMatch = userArr.some(item => apiArr.includes(item));
                if(hasMatch){
                    //selectedGenres.push(apiArr);
                    filteredTvShowsByGenre.push(result.data[i])
                }
            }
            
            filteredTvShowsByGenre.forEach(el => {
                //console.log( "Genre = ", el.genres)

            //filters each object item's premier data
                    if(el.premiered.replace(/['"]+|-.*/g, '') == req.body.birthYear){
                        filteredTvShowsByPremiered.push(el)
                    }
            
            })



            /*YOU LEFT OFF HERE 
        
            (11/12/24 7:48pm)
        
            What tf was I doing: I was able to filter by premier year and genres that the user selects alongside the API's filtered year and genres. 

            What's next: Link to results page.
        
        
        */

            filteredTvShowsByPremiered.forEach(el => {
                console.log("TV show: ", el.name, ", Year Premiered: ", el.premiered, ", Genres: ", el.genres);
            })



          } else if (selectedOptions) {
            // If only one checkbox is selected, it will initially be a string but below, the REGEX will turn it into a obj.
            const turnStringToObj = selectedOptions.replace(/\b(\w+)\b/g, '[$1]');
            console.log("Selected option:", turnStringToObj)
            
          } else {
            console.log("No options selected.");
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
