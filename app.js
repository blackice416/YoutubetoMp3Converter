//requierd packages
const express = require("express")
const fetch = require("node-fetch")
require("dotenv").config();

// create express server 
const app = express();
// server port number
const PORT = process.env.PORT || 3000;


//set template engine 
app.set("view engine", "ejs");
app.use(express.static("public"));

//needed to parse html data for post request 
app.use(express.urlencoded({
    extended:true 
}))

app.use(express.json());

app.get("/", (req, res) => {
    res.render("index")
})

const searchForThreeLetterCombo = (string, combo) => {
    let matches = [];
    let restOfString = "";
    for (let i = 0; i < string.length -1 ; i++) {
        if (string.substring(i, i + 2) === combo) {
            matches.push(i);
            
            restOfString = string.substring(i + 2);
            console.log("found "+restOfString);
            break; // Stop searching after the combo is found
        }
    }
    return { matches, restOfString };
};
function extractBetweenCombos(string, startCombo, endCombo) {
    let startIndex = string.indexOf(startCombo);
    if (startIndex === -1) {
        return ""; // Start combo not found
    }

    startIndex += startCombo.length; // Adjust start index to exclude startCombo
    let endIndex = string.indexOf(endCombo, startIndex);
    if (endIndex === -1) {
        return ""; // End combo not found after start combo
    }

    //console.log("jo" + string.substring(startIndex, endIndex));
    return string.substring(startIndex, endIndex);
}

app.post("/convert-mp3", async (req, res) => {
  //call to youtube api
  let videoId = req.body.videoID ;
  console.log(videoId);
  let result = "";
  let videosplice = " " ;
  //youtube app
  if(videoId&&videoId.includes(".be"))
  {
    console.log("Video ID contains '.be' so it is a youtube app request");
    result = extractBetweenCombos(videoId,"e/","?s");
    console.log("Substring extracted from video ID:", result);
   // console.log("Result is" + result.toString());
   // console.log("Matches:", result.matches);
   // console.log("Rest of string:", result.restOfString);
    videosplice = result.toString();
    console.log("happens " + videosplice);
    videoId = videosplice;
    
  }

  //youtube page
  else if(videoId&&videoId.includes("be."))
  {
    console.log("Video ID contains 'be.' so it is a youtube webpage request");
    // has to be two charaters long
    result = searchForThreeLetterCombo(videoId,"v=");
    console.log("Substring extracted from video ID:", result);
    console.log("Result is" + result.restOfString);
   // console.log("Matches:", result.matches);
    console.log("Rest of string:", result.restOfString);
    videosplice = result.restOfString;
    console.log("happens " + videosplice);
    videoId = videosplice;
    
  }

  //add functionailty to deipher if its a webpage url video link or a youtube video link
    if(
        videoId === undefined||
        videoId === ""||
        videoId === null
    ){

        return res.render("index",{success : false, message : "Please enter a video ID" });
    } else{
        const fetchAPI = await fetch(`https://youtube-mp36.p.rapidapi.com/dl?id=${videoId}`,{
            "method" : "GET",
            "headers": {
                "x-rapidapi-key": process.env.API_KEY,
                "x-rapidapi-host": process.env.API_HOST
            }
        });

        const fetchResponse = await fetchAPI.json();
        if(fetchResponse.status === "ok" )
        {
            console.log("API success")
            return res.render("index", {success : true, song_title : fetchResponse.title, song_link : fetchResponse.link})
            
        }
        else
        {

        console.log("api failure");
        return res.render("index", {success:false, message:fetchResponse.msg})
   
        }
    }


});


// start the server
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
})