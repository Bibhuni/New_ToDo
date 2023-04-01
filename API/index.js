const express = require('express');
const app = express();
const mongoose = require('mongoose');
app.use(express.json());
const cors = require('cors');
const dotenv = require("dotenv");
const PORT = process.env.PORT || 5050;


app.use(cors());
dotenv.config();


mongoose.connect(process.env.DATABASE, {useNewUrlParser: true, useUnifiedTopology: true})
.then(()=>{
  console.log("Connected to Database...");
  app.listen(PORT,()=>{
      console.log("App is running on port: 5050.");
  });
})
.catch((err)=>{
  console.log("Error!!!", err);
});


//SCHEMA
const getPosition = async () => {
  const maxPosition = await mymodel.findOne().sort('-position').select('position');
  return maxPosition ? maxPosition.position + 1 : 1;
};
const sch = new mongoose.Schema({
    id: Number,
    title: String,
    details: String,
    status: {type:Number, default:0},
    link: String,
    position: { type: Number, default: 0}
  }, {
    timestamps: true
  });
  const mymodel=mongoose.model('datta',sch);

//POST
app.post('/post', async (req, res) => {
  try {
    const position = await getPosition();
    const newData = new mymodel({
      id: req.body.id,
      title: req.body.title,
      details: req.body.details,
      link: req.body.link,
      status: req.body.status,
      position: position
    });
    const savedData = await newData.save();
    res.status(201).json(savedData);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});
  getPosition((position) => {
    data.position = position;
    data.save((err, newData) => {
      if (err) {
        res.status(400).json({ message: err.message });
      } else {
        res.status(201).json(newData);
      }
    });
  });

//GET by id
app.get('/get/:id', async (req, res) => {
    try {
      const data = await mymodel.findById(req.params.id);
      if (!data) {
        return res.status(404).json({ message: 'Data not found' });
      }
      res.json(data);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

  //UPDATE
  app.put('/update/:id', async (req, res) => {
    try {
      const data = await mymodel.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!data) {
        return res.status(404).json({ message: 'Data not found' });
      }
      res.json(data);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
  
  // Update position of each task in the database
  app.put('/updatePositions', async (req, res) => {
    try {
      const { ids } = req.body;
      const promises = ids.map((id, index) => {
        return mymodel.findByIdAndUpdate(
          id,
          { position: index },
          { new: true }
        );
      });
      const updatedTasks = await Promise.all(promises);
      res.json(updatedTasks);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
    
  //DELETE
  app.delete('/delete/:id', async (req, res) => {
    try {
      const data = await mymodel.findByIdAndDelete(req.params.id);
      if (!data) {
        return res.status(404).json({ message: 'Data not found' });
      }
      res.json({ message: 'Data deleted' });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

  //all data
  app.get('/data', async (req, res) => {
    try {
      const data = await mymodel.find().sort({ position: 1 });
      res.json(data);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
    
      

  
  