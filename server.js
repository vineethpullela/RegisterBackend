const express =require("express");
const mangoose=require("mongoose");
const Registeruser=require("./model")
const middleware=require("./middleware")
const jwt =require("jsonwebtoken");
const app=express();
app.use(express.json())

mangoose.connect("mongodb+srv://15072cm031:Vineeth123@cluster0.yx49o.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0").then(
    ()=>console.log("db connected")
).catch(err => console.log(err))



app.post('/login',async (req, res) => {
    try{
        const {email,password} = req.body;
        let exist = await Registeruser.findOne({email});
        if(!exist) {
            return res.status(400).send('User Not Found');
        }
        if(exist.password !== password) {
            return res.status(400).send('Invalid credentials');
        }
        let payload = {
            user:{
                id : exist.id
            }
        }
        jwt.sign(payload,'jwtSecret',{expiresIn:3600000},
          (err,token) =>{
              if (err) throw err;
              return res.json({token})
          }  
            )

    }
    catch(err){
        console.log(err);
        return res.status(500).send('Server Error')
    }
})


app.get("/myprofile",async(req,res)=>{
    try{
        let token=req.header("x-token");
        if (!token){
            res.send("invalid toekn");
        }
        let decode = jwt.verify(token,"jwtSecret");
        let exist = await Registeruser.findById(decode.user.id);
       /* if(!exist){
            return res.status(400).send('User not found');
        }*/
        res.json(exist);
    }
    catch(err){
        console.log(err);
        return res.status(500).send('Server Error')
    }
})

app.post("/register",async(req,res)=>{
    try{
        const {email,username,password,confirmpassword}=await req.body;
        let exist= await Registeruser.findOne({email});
        if (exist){
            return res.status(400).send("user Already Exist");
        }
        if (password!==confirmpassword){
            return res.send("password is not matched");

        }
        let newUser=new Registeruser({
            username,email,password,confirmpassword
        })

        await newUser.save();
        res.send("registartion is success");


    }
    catch(err){
        console.log(err)
        return res.send("server error");
    }
})


app.listen(4000,()=>{
    console.log("server running");
})
