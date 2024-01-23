const express = require('express')
require('dotenv').config()
const app = express()
const cors = require('cors')
const axios = require('axios')
app.use(cors())




async function fetchNews(req,res) {
 const {search,from,Page} = req.query
  try {
    const {data} = await axios.get(`https://newsapi.org/v2/everything?q=${search}&from=${from}&sortBy=publishedAt&page=${Page}&language=en&pageSize=10&apiKey=b80e023cf58d4838a381be9697e7611a`)
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
