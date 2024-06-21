require("dotenv").config()
const express= require("express") ;
const cors=require("cors")
const noteRoutes =require("./routes/notes.route")

const app =express() ;

app.get("/",(req,res)=>{
    const h1="<h1>Hello Quickly Platforms</h1>"
    res.send(h1)
})

//middle wares
app.use(cors())
app.use(express.json())
app.use("/notes" , noteRoutes)



const port=process.env.PORT||8080
//app listening
app.listen(port ,()=>{
    console.log(`server is running on port num ${port} `)
})