const express = require("express");
const cors = require("cors");
const app = express();
const axios = require('axios');

const { response } = require("express");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use(express.static("public"));

app.set("view engine", "ejs");

let output="";
let code="";
let inputData= "";
let language = "C++";
let langCode = "cpp";

function languageMapper(language) {
    switch(language) {
        case "C++": {
            langCode = "cpp";
            break;
        }
        case "C": {
            langCode = "c";
            break;
        }
        case "C#": {
            langCode = "cs";
            break;
        }
        case "Python": {
            langCode = "py";
            break;
        }
        case "Java": {
            langCode = "java";
            break;
        }
        case "Kotlin": {
            langCode = "kt";
            break;
        }
        case "Swift": {
            langCode = "swift";
            break;
        }
        case "Ruby": {
            langCode = "rb";
            break;
        }
    }
}

app.get('/', (req, res) => {
    res.render("index", {outputText: output, codeText: code, inputText: inputData, language: language});
});


app.post('/', async(req, res) => {

    //language = "cpp";
    code = req.body.codeText;

    inputData = req.body.inputText

    if(code === undefined) {
        return res.status(400).json({ success: false, error : "Empty code body" });
    }

    language = req.body.language
    languageMapper(language)

    var data = JSON.stringify({
        "code": code,
        "language":langCode,
        "input": inputData
        });

    var config = {
        method: 'post',
        url: 'https://codexweb.netlify.app/.netlify/functions/enforceCode',
        headers: { 
          'Content-Type': 'application/json'
        },
        data : data
      };

      axios(config)
      .then(function (response) {
          //console.log(`${response.data.output}`)
          output = response.data.output
          res.redirect('/')
      })
      .catch(function (error) {
          //console.log(`${error}`)
          output = error
          res.redirect('/')
      });

    
    //res.redirect('/');
    //return res.json({filePath: filePath, output: output});
});

app.listen(process.env.PORT || 5000, () => {
    console.log("Server Running");
});