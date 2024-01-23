const express = require('express')
require('dotenv').config()
const app = express()
const cors = require('cors')
const axios = require('axios')
app.use(cors())




async function fetchNews(req,res) {
 const {search,from,Page} = req.query
  try {
    const {data} = await axios.get(`https://newsapi.org/v2/everything?q=${search}&from=${from}&sortBy=publishedAt&page=${Page}&language=en&pageSize=10&apiKey=b8099662d85f4fbea3b114e739356814`)
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
