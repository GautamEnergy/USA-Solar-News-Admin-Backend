const express = require('express')
require('dotenv').config()
const app = express()
const cors = require('cors')
const axios = require('axios')
app.use(cors())




async function fetchNews(req,res) {
 const {search,from,Page} = req.query
  try {
    const {data} = await axios.get(`https://newsapi.org/v2/everything?q=${search}&from=${from}&sortBy=publishedAt&page=${Page}&language=en&pageSize=10&apiKey=4e7a71ac960e43da99062af4b0b405f3`)
       res.send(data)
     
  } catch (error) {
    res.status(500).send({error})
    console.error('Error fetching news:', error);
  }
  
}




app.get('/News',fetchNews)





app.listen(process.env.Port,()=>{
    console.log("server is running")
})
