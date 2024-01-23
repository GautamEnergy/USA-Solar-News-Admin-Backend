const express = require('express')
require('dotenv').config()
const app = express()
const cors = require('cors')
const axios = require('axios')
app.use(cors())




async function fetchNews(req,res) {
  try {
    const {data} = await axios.get(`https://newsapi.org/v2/everything?q=Solar&from=2023-12-23&sortBy=publishedAt&page=2&language=en&pageSize=10&apiKey=b8099662d85f4fbea3b114e739356814`)
       res.send(data)
     
  } catch (error) {
    console.error('Error fetching news:', error);
  }
}

// Call the asynchronous function



app.get('/News',fetchNews)
// To query /v2/everything
// You must include at least one q, source, or domain
// newsapi.v2.everything({
//   q: 'bitcoin',
//   sources: 'bbc-news,the-verge',
//   domains: 'bbc.co.uk, techcrunch.com',
//   from: '2017-12-01',
//   to: '2017-12-12',
//   language: 'en',
//   sortBy: 'relevancy',
//   page: 2
// }).then(response => {
//   console.log(response);
//   /*
//     {
//       status: "ok",
//       articles: [...]
//     }
//   */
// });
// // To query sources
// // All options are optional
// newsapi.v2.sources({
//   category: 'technology',
//   language: 'en',
//   country: 'us'
// }).then(response => {
//   console.log(response);
//   /*
//     {
//       status: "ok",
//       sources: [...]
//     }
//   */
// });












app.listen(900,()=>{
    console.log("server is running")
})