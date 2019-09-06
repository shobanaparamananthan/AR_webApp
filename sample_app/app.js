const express = require ('express');
const bodyParser = require("body-parser");
const app = express();
app.use(bodyParser.json());
const path = require('path');

const db = require ("./db");
const collection = "Foodie";

app.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/getfoods',(req,res)=>{
db.getDB().collection(collection).find({}).toArray((err,documents)=>{
if(err)
{
    console.log(err);
}
else{
    console.log(documents);
    res.json(documents);
}
});
});

app.put('/:id',(req,res)=>
{
    const FoodieID = req.params.id;
    const userInput=req.body;

    db.getDB().collection(collection).findOneAndUpdate({_id : db.getPrimaryKey(FoodieID)},{$set : {Foodie : userInput.Foodie}},{returnOriginal : false},(err,result )=>
    {
        if(err)
        console.log(err);
        else 
        
            res.json(result);
    
    });
});

db.connect((err)=>{
    if(err){
    console.log('unable to connect to database');
    process.exit(1);
    }
    else{
        app.listen(3000,()=>{
            console.log('connected to database, app listening on port 3000');
        });
    }
})

app.post('/',(req,res)=>{
const userInput = req.body;
db.getDB().collection(collection).insertOne(userInput,(err,result)=>{
    if(err)
    console.log(err);
    else
    res.json({result :result , document : result.ops[0]});
});

});

app.delete('/:id',(req,res)=>
{
    const FoodieID = req.params.id;
    db.getDB().collection(collection).findOneAndDelete({_id :db.getPrimaryKey(FoodieID)},(err,result)=>
    {
        if(err)
    
        console.log(err);
        else
        res.json(result);

    });


});
