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
        var names = extractNames(facts);
        var response = getImageNameList(names);
        response.then(imageNameList => {
          console.log(imageNameList);
        })
        
      })
      .catch(function(err){
        console.log(err);
      });
    })
}

async function getImageNameList(nameList){
  var imageNameList = [];
  for (let i = 0; i < 10; i++) {
    var fomattedName = nameList[i].trim().split(' ').join('_');
    try {
      var response  = await services.searchImageName(fomattedName);
      imageNameList.push(Object.values(response.data["query"]["pages"])[0]["images"][3]["title"]);
    } catch (error) {
      //console.log(error);
    }
  }
  return imageNameList;
}

function extractNames(facts) {
  var regx = /([A-Z][a-záàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ]+)[ ]*([A-Z][a-záàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ]+)[ ]*(([A-Z][a-záàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ]+)[ ]*)*/g;
  var groups = [...facts.matchAll(regx)];
  return groups.map(m => m[0]);
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
  return onlyFacts.map( m => m[0]).reduce((t, e) =>  t+'\n'+ e);
}

function formatSuggestionTitle(data) {
  return data[1][0].split(' ').join('_');
}