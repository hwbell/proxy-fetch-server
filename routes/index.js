var express = require('express');
var router = express.Router();

const fetch = require('node-fetch');

/* GET home page. */
router.get('/', function(req, res, next) {

  // get today into the format for the url -- 2015100100 = 10/01/2015. We'll leave the hours as 00.
  const today = new Date();

  // have to correct the month by 1 since it is 0-indexed
  let month = today.getMonth()+1;
  let monthStr = month < 10 ? '0' + month.toString() : month.toString();

  let date = today.getDate()-1; // do yesterday since they don't have data yet for today
  let yesterday =  date < 10 ? '0' + date.toString() : date.toString();
  // let year = today.getFullYear().toString();

  const fetchUrl = `https://wikimedia.org/api/rest_v1/metrics/pageviews/top/en.wikipedia/all-access/2019/${monthStr}/${yesterday}`;
  fetch(fetchUrl)
    // .then(res => res.json)
    .then((json) => {
      console.log(json);
      
      // lose the first 2 as its always 'Main Page' and 'Special:Search', and just get the top 20
      let topArticles = json.items[0].articles.slice(2, 22); 
      let fetchResponse = topArticles.map((article) => {
        return [article.article, article.views]
      })

      res.send(fetchResponse);
      
    })
    .catch(e => {
      console.log(e);
      return e;
    });


  
});

module.exports = router;
