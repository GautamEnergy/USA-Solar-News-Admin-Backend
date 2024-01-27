const express = require('express')
require('dotenv').config()
const app = express()
const cors = require('cors')
const axios = require('axios')
const Praser = require('rss-parser')
const parser = new Praser()
app.use(cors())




// async function fetchNews(req,res) {
//  const {search,from,Page} = req.query
//   try {
//     const {data} = await axios.get(`https://newsapi.org/v2/everything?q=${search}&from=${from}&sortBy=publishedAt&page=${Page}&language=en&pageSize=10&apiKey=b8099662d85f4fbea3b114e739356814`)
//        res.send(data)

//   } catch (error) {
//     res.status(500).send({error})
//     console.error('Error fetching news:', error);
//   }

// }







let News = []

async function Rss(req,res) {

  try {

    let feed = await parser.parseURL('https://www.canarymedia.com/rss.rss');
   // console.log(feed);

    feed.items.forEach(item => {

      News.push({ creator: item.creator, title: item.title, link: item.link, pubDate: item.pubDate, author: item.author, content: item.content })
      // console.log(item.title + ':' + item.link)
    });
   
    res.send({News})
  } catch (err) {

   res.status(500).send({error:'internal error'})
    console.log(err)
  }
}

app.get('/News',Rss)



app.listen(900, () => {
  console.log("server is running")
})