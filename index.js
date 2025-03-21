const express = require('express');
const { resolve } = require('path');
const mongoose = require("mongoose");
const User = require("./schema")
const dotenv = require("dotenv");
dotenv.config();

const app = express();
const port = 3010;

app.use(express.json());

app.use(express.static('static'));

app.get('/', (req, res) => {
  res.sendFile(resolve(__dirname, 'pages/index.html'));
});

app.get('/api/users',async(req,res)=>{
  try {
    const { email } = req.query;

    if (email) {
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(404).send({ msg: "User not found" });
        }
        return res.status(200).send(user);
    } else {
        const users = await userModel.find();
        return res.status(200).send(users);
    }
  } catch (error) {
    res.status(500).send({ msg: "Something went wrong" });
  }
})

app.post('/api/users',async(req,res)=>{
  try {
    const {name,email,password} = req.body;
    if(!name || !email || !password){
      res.status(400).send({msg:"All fields are required"});
    }

    const existingUser = await User.findOne({email});
    if(existingUser){
      res.status(400).send({msg:"User already exists"});
    }
    const data = new User({name,email,password});
    await data.save();
    res.status(201).send({msg:"User created successfullyy.."});
  } catch (error) {
    console.log(error)
    res.status(400).send({msg:"Something went wrong"})
  }
})

app.listen(port,async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Connected to database")

    console.log(`Example app listening at http://localhost:${port}`);
  } catch (error) {
    console.log("Error connecting to database")
  }
  
});
