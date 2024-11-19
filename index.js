import express from "express";
import bodyParser from "body-parser";
import axios from "axios";

const app = express();
const port = 3000;
const API_url = "https://api.tvmaze.com/shows";
//let finalFilteredTvShow2 = [];

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));


app.get("/", (req, res) => {
    res.render("index.ejs")
})


app.post("/", async(req, res) => {

    //Functions

    //capitalizes the first letter of each string in a array
    function capitalizeFirstLetterInArray(arr) {
        return arr.map(text => {
          return text.replace(/\b[a-zA-Z]/g, function(match) {
            return match.toUpperCase();
          });
        });
      }

      //gets a random number between two inclusive numbers
      function getRandomIntInclusive(min, max) {
        const minCeiled = Math.ceil(min);
        const maxFloored = Math.floor(max);
        return Math.floor(Math.random() * (maxFloored - minCeiled + 1) + minCeiled); // The maximum is inclusive and the minimum is inclusive
      }



      //async function
    try{
        const result = await axios.get(API_url, req.body,{});
        const selectedOptions = req.body.options;
        let filteredTvShowsByGenre = [];
        let filteredTvShowsByPremieredWithZeroTol = [];
        let filteredTvShowsByPremieredWithNonZeroTol = [];
        let finalFilteredTvShow = [];

       


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

            /*  this is to check all the tv shows with the user's multiple input selection ------> */filteredTvShowsByGenre.forEach(el => {
                //console.log('id: ', el.id, ", year: ", el.premiered , ", genres: ", el.genres);
            })

           
            
           

            if(filteredTvShowsByPremieredWithZeroTol != ''){
                finalFilteredTvShow = filteredTvShowsByPremieredWithZeroTol[getRandomIntInclusive(0,filteredTvShowsByPremieredWithZeroTol.length-1)];
                //console.log("End Result = ", finalFilteredTvShow);
            }else{
                finalFilteredTvShow = filteredTvShowsByPremieredWithNonZeroTol[getRandomIntInclusive(0,filteredTvShowsByPremieredWithNonZeroTol.length-1)];
                //console.log("End Result = ", finalFilteredTvShow);
            }
            

            



          } else if (selectedOptions) {
            // If only one checkbox is selected, it will initially be a string but below, the REGEX will turn it into a obj.
            //const turnStringToObj = selectedOptions.replace(/\b(\w+)\b/g, '[$1]');

              console.log("selected = ", selectedOptions);

              
            for(let i=0;i<result.data.length; i++){
                let availableApiGenres = result.data[i].genres;
                let oneGenreUserSelection = selectedOptions.replace(/\b[a-zA-Z]/g, function(match) {
                    return match.toUpperCase();
                  });
                let hasMatch = availableApiGenres.includes(oneGenreUserSelection);
                if(hasMatch){
                    filteredTvShowsByGenre.push(result.data[i])
                }
            }


            /*YOU LEFT OFF HERE 
        
            (11/18/24 5pm)
        
            What tf was I doing: I finished coding for when a user inputs multiple genres. Now I'm coding for when the user inputs one selected genre. As of now I'm just confirming that it works. I tried doing a birth year input of 2005 and console logging all the options available as shown in the console.

            What's next: do more tests. update the results.ejs page once all is confirmed.
        
        
        */

            /*  this is to check all the tv shows with the user's one input selection ------> */filteredTvShowsByGenre.forEach(el => {
                //console.log('id: ', el.id, ", year: ", el.premiered , ", genres: ", el.genres);
            })

            if(filteredTvShowsByGenre != ''){
            filteredTvShowsByGenre.forEach(el => {
              //filters each object item's premier data
              if(Math.abs(req.body.birthYear - el.premiered.replace(/['"]+|-.*/g, '')) == 0){
                filteredTvShowsByPremieredWithZeroTol.push(el)
              }
            });

            console.log("filteredTvShowsByPremieredWithZeroTol = ", filteredTvShowsByPremieredWithZeroTol );

            //after filtering by the tv show's premier year with user's birth year, finally it filters by available premier year based off of user's input. 
            if(filteredTvShowsByPremieredWithZeroTol != ''){ //if the user's birth year exists in the API
                finalFilteredTvShow = filteredTvShowsByPremieredWithZeroTol[getRandomIntInclusive(0,filteredTvShowsByPremieredWithZeroTol.length-1)];
            }

        }else{
            console.log("The given input for birth year has no associated shows.")
        }

            //console.log("End result = ", finalFilteredTvShow)

            
            
          } else {
            console.log("No options selected.");
          }



        res.render("results.ejs", {
            yourName: req.body.nameText,
            yourBirthYear: req.body.birthYear,
            yourGenre: selectedOptions,
            tvshow: finalFilteredTvShow.name,
            year: finalFilteredTvShow.premiered,
            genre: finalFilteredTvShow.genres,
        })
    }catch(error){
        res.status(404).send(error.message);
    }
});



app.listen(port, () => {
    console.log(`Server is running on port ${port}.`);
})
