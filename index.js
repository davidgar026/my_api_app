import express from "express";
import bodyParser from "body-parser";
import axios from "axios";

const app = express();
const port = 3000;
const API_url = "https://api.tvmaze.com/shows";
const filteredTvShowsByGenre = [];
const filteredTvShowsByPremieredWithZeroTol = [];
const filteredTvShowsByPremieredWithNonZeroTol = [];
let finalFilteredTvShow = [];
let finalFilteredTvShow2 = [];

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
                    if(Math.abs(req.body.birthYear - el.premiered.replace(/['"]+|-.*/g, '')) == 0){
                        filteredTvShowsByPremieredWithZeroTol.push(el)
                    }else if(Math.abs(req.body.birthYear - el.premiered.replace(/['"]+|-.*/g, '')) <= 10){
                        filteredTvShowsByPremieredWithNonZeroTol.push(el)
                    }

            });

           
            /*YOU LEFT OFF HERE 
        
            (11/17/24 9:22pm)
        
            What tf was I doing: I was trying I was trying to allow a user to input their birth year that does not exist in the api's array of tv shows. I was able to use the absolute and use tolerance to round the user's birth year input to the nearest premier date of a tv show. 

            What's next: do more tests. update the results.ejs page once all is confirmed.
        
        
        */
            console.log("true or false: ", filteredTvShowsByPremieredWithZeroTol != '');
           

            if(filteredTvShowsByPremieredWithZeroTol != ''){
                finalFilteredTvShow = filteredTvShowsByPremieredWithZeroTol[getRandomIntInclusive(0,filteredTvShowsByPremieredWithZeroTol.length-1)];
                console.log("End Result = ", finalFilteredTvShow);
            }else{
                finalFilteredTvShow2 = filteredTvShowsByPremieredWithNonZeroTol[getRandomIntInclusive(0,filteredTvShowsByPremieredWithNonZeroTol.length-1)];
                console.log("End Result = ", finalFilteredTvShow2);
            }
            

            /* you left off here => */
            



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
