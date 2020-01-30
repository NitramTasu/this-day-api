const express = require('express');
const router = express.Router();
const axios = require('axios');
const services = require('../services');

router.get('/', function (req, res, next) {

    searchByThisDay("1_de_janeiro");
    res.status(200).send({
        title: "Node Express API",
        version: "0.0.1"
    });
});
module.exports = router;


function searchByThisDay(title) {
    const respTitle = services.searchTitle(title);
    respTitle.then(function (resp){
      var formatedTitle = formatSuggestionTitle(resp.data);

      services.searchContent(formatedTitle)
      .then(function (resp){
        var facts = extractFacts(resp.data);
        var factsWithNames = extractNames(facts);
        var response = getImageNameList(factsWithNames);
        response.then(factsWithNames => {
          var resp = getImagesByName(factsWithNames);
          resp.then(factsWithNames => {
            console.log(factsWithNames);
          })
        })
        
      })
      .catch(function(err){
        console.log(err);
      });
    })
}

async function getImageNameList(factsWithNames){
  for (let i = 0; i < factsWithNames.length; i++) {
    var name = factsWithNames[i].name;
    if(name){
      var fomattedName = name.trim().split(' ').join('_');
      try {
        var response  = await services.searchImageName(fomattedName);
        factsWithNames[i].imageName = Object.values(response.data["query"]["pages"])[0]["images"][3]["title"]
      } catch (error) {
        //console.log(error);
      }
    }
  }
  return factsWithNames;
}

async function getImagesByName(factsWithNames){

  for (let i = 0; i < factsWithNames.length; i++) {
    var imageName = factsWithNames[i].imageName;
    if(imageName){
      try {
        var response  = await services.searchImageByName(imageName);
        factsWithNames[i].imageUrl = Object.values(response.data["query"]["pages"])[0]["imageinfo"][0]["url"]
      } catch (error) {
        //console.log(error);
      }
    }
  }
  return factsWithNames;
}

function extractNames(facts) {
  var regx = /([A-Z][a-záàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ]+)[ ]*([A-Z][a-záàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ]+)[ ]*(([A-Z][a-záàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ]+)[ ]*)*/g;
  for (let i = 0; i < facts.length; i++) {
    var matched = facts[i].match(regx);
    if (matched){
      facts[i] = { fact: facts[i], name: matched[0].trim()};
    }else{
      facts[i] = { fact: facts[i], name: null};
    }
    
  }
  return facts;
}

function extractFacts(data) {
  var unformattedText =
  Object.values(data["query"]["pages"])[0]["revisions"][0]["*"];

  var formatted = unformattedText
      .split(/\[+|\]+|{+|}+/)
      .join('')
      .split(/\*\s/);
  formatted.shift();
  const oneString = formatted.reduce((t, e) => t + e);
  const onlyFacts = [...oneString.matchAll(/(\d){4} — (.)+/g)];
  return onlyFacts.map( m => m[0]);
}

function formatSuggestionTitle(data) {
  return data[1][0].split(' ').join('_');
}