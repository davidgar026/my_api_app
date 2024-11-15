import express from "express";
import bodyParser from "body-parser";
import axios from "axios";

const app = express();
const port = 3000;
const API_url = "https://api.tvmaze.com/shows";
const filteredTvShowsByGenre = [];
const filteredTvShowsByPremiered = [];


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

      function getRandomIntInclusive(min, max) {
        const minCeiled = Math.ceil(min);
        const maxFloored = Math.floor(max);
        return Math.floor(Math.random() * (maxFloored - minCeiled + 1) + minCeiled); // The maximum is inclusive and the minimum is inclusive
      }


    try{
        const result = await axios.get(API_url, req.body,{});
        const selectedOptions = req.body.options;

       result.data.forEach(el => {
        console.log(el.premiered)
       })


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
        
            (11/14/24 9:05pm)
        
            What tf was I doing: I was trying to let the user input their birth year and if the api does not have a show with the year that the user puts, the code can round it to the nearest or closest available year from the api to the user's selected birth year. I'm trying to figure out how to do below.

            What's next: solve a way to round the user's birth year to the nearest api's tv show's available premier year of a show.
        
        
        */

            /*

            let userYear = 1995
            let lowDif = userYear - lowApiYear;
            let highDif = highApiYear - userYear;
            if(lowDif < highDif){
                let selectedPremeierYear = lowDif;
            }else{
                let selectedPremierYear = highDif;
            }
            
            */





            


            const finalFilteredTvShow = filteredTvShowsByPremiered[getRandomIntInclusive(0,filteredTvShowsByPremiered.length-1)];

            /* you left off here => */console.log("End Result = ", finalFilteredTvShow);



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
