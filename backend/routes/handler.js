const express = require('express');
const router = express.Router();
const mysql = require('mysql');

const setJsonTypeData = (data) =>
{
  let dataRefactor = "";

  if(Array.isArray(data))
  {
    dataRefactor = data[0];
  }
  else if(data[0] != null)
  {
    dataRefactor = data[0];
  }
  else if(data["0"] != null)
  {
    dataRefactor = data["0"];
  }
  else
  {
    dataRefactor = data;
  }

  return dataRefactor;
}

const setJsonTypeDurationData = (data) =>
{
  let dataRefactor = "";

  if(data.release_date != null)
  {
    dataRefactor = data.release_date.split("-");
  }
  else if(data.first_air_date != null)
  {
    dataRefactor = data.first_air_date.split("-");
  }

  return dataRefactor;
}

const setJsonTypeLogosData = (data) =>
{
  let dataRefactor = "";

  if(data['0'] != null)
  {
    for (let [key, value] of Object.entries(data))
    {
      if(value.iso_639_1 == "it" || value.iso_639_1 == "en")
      {
        dataRefactor = "https://www.themoviedb.org/t/p/original/" + value.file_path;
      }
    }
  }
  else
  {
    data.map(obj =>
    {
      if(obj.iso_639_1 == "it" || obj.iso_639_1 == "en")
      {
        dataRefactor = "https://www.themoviedb.org/t/p/original/" + obj.file_path;
      }
    });
  }

  return dataRefactor;
}

const setBestJsonTypeLogosData = (data) =>
{
  let dataRefactor = "";
  let maxRatio = 0;
  let objectSaved = "";

  if(data['0'] != null)
  {
    for (let [key, value] of Object.entries(data))
    {
      if(value.iso_639_1 == "it" || value.iso_639_1 == "en")
      {
        if(value.vote_average >= maxRatio)
        {
          maxRatio = value.vote_average;
          objectSaved = value;
        }
      }
    }

    if(typeof objectSaved.file_path !== "undefined")
    {
      dataRefactor = "https://www.themoviedb.org/t/p/original/" + objectSaved.file_path; 
    }
    else
    {
      dataRefactor = "https://www.themoviedb.org/t/p/original/" + data["0"].file_path;
    }
  }
  else
  {
    data.map(obj =>
    {
      if(obj.iso_639_1 == "it" || obj.iso_639_1 == "en")
      {
        if(value.vote_average >= maxRatio)
        {
          maxRatio = value.vote_average;
          objectSaved = obj;
        }
      }
    });

    if(typeof objectSaved.file_path !== "undefined")
    {
      dataRefactor = "https://www.themoviedb.org/t/p/original/" + objectSaved.file_path;
    }
    else
    {
      dataRefactor = "https://www.themoviedb.org/t/p/original/" + objectSaved[0].file_path;
    }
  }

  return dataRefactor;
}

var connection = mysql.createConnection(
{
  host     : '45.9.188.236',
  user     : 'admin_garw',
  password : '@Napoleone99',
  database : "admin_fanseries"
});

connection.connect();

router.get('/listAllElementsData', (req, res) =>
{
  const fs = require('fs');
  connection.query('SELECT elementName, elementType  FROM listElements', function(err, rows, fields)
  {
    rows.forEach(element =>
    {
      let elementName = element.elementName;
      let pathType = element.elementType == "Film" ? "film" : "series";
      let pathData = 'data/' + pathType + '/' + elementName + '_data.json';
      let pathImage = 'data/images/' + pathType + '/' + elementName + '_imagesData.json';

      try
      {
        let rawdata = fs.readFileSync(pathData);
        let json = JSON.parse(rawdata);
        let jsonData = setJsonTypeData(json);

        element.releaseDate = setJsonTypeDurationData(jsonData);
        element.posterPath = "https://www.themoviedb.org/t/p/original/" + jsonData.poster_path;
        element.backgroundImage = "https://www.themoviedb.org/t/p/original/" + jsonData.backdrop_path;
        element.voteAverage = jsonData.vote_average;
        element.title = jsonData.title != null ? jsonData.title : jsonData.name;
        let duration = pathType == "film" ? jsonData.runtime : jsonData.number_of_seasons;

        let genresObj = jsonData['genres'];
        let genresArray = [];

        for (const key in genresObj)
        {
          if (Object.hasOwnProperty.call(genresObj, key))
          {
              genresArray.push(genresObj[key].name);
          }
        }

        element.genres = genresArray;

        if(pathType == "film")
        {
          let hours = Math.floor(duration / 60);          
          let minutes = duration % 60;

          duration = minutes == 0 ? hours + "h" : hours + "h " + minutes + "m";
        }

        element.elementDuration = duration;
      }
      catch(err)
      {
        console.log(err);
      }

      try
      {
        let rawdata = fs.readFileSync(pathImage);
        let json = JSON.parse(rawdata);
        let jsonData = setJsonTypeData(json);
        
        element.logo = setJsonTypeLogosData(jsonData.logos);
        element.backdropImageWithLanguage = setBestJsonTypeLogosData(jsonData.backdrops);
      }
      catch (error)
      {
        console.log(err);
      }
    });
    
    res.send(rows);
  });
});

router.get('/randomElementsData', (req, res) =>
{
  const fs = require('fs');
  connection.query('SELECT elementName,elementType  FROM listElements ORDER BY RAND() LIMIT 6', function(err, rows, fields)
  {
    rows.forEach(element =>
    {
      let elementName = element.elementName;
      let pathType = element.elementType == "Film" ? "film" : "series";
      let pathData = 'data/' + pathType + '/' + elementName + '_data.json';
      let pathImage = 'data/images/' + pathType + '/' + elementName + '_imagesData.json';

      try
      {
        let rawdata = fs.readFileSync(pathData);
        let json = JSON.parse(rawdata);
        let jsonData = setJsonTypeData(json);

        element.releaseDate = setJsonTypeDurationData(jsonData);
        element.posterPath = "https://www.themoviedb.org/t/p/original/" + jsonData.poster_path;
        element.backgroundImage = "https://www.themoviedb.org/t/p/original/" + jsonData.backdrop_path;
        element.voteAverage = jsonData.vote_average;
        element.title = jsonData.title != null ? jsonData.title : jsonData.name;
        let duration = pathType == "film" ? jsonData.runtime : jsonData.number_of_seasons;

        if(pathType == "film")
        {
          let hours = Math.floor(duration / 60);          
          let minutes = duration % 60;

          duration = minutes == 0 ? hours + "h" : hours + "h " + minutes + "m";
        }

        element.elementDuration = duration;
      }
      catch(err)
      {
        console.log(err);
      }

      try
      {
        let rawdata = fs.readFileSync(pathImage);
        let json = JSON.parse(rawdata);
        let jsonData = setJsonTypeData(json);
        
        let logosData = jsonData.logos;
        element.logo = setJsonTypeLogosData(logosData);
      }
      catch (error)
      {
        console.log(err);
      }
    });
    
    res.send(rows);
  });
});

module.exports = router;
