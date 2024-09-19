import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import tableDataRoutes from './routes/tabledata_routes.js';

const app = express();
app.use(cors());
app.use(express.json());
app.use('/backend/table', tableDataRoutes);

// MongoDB connection
mongoose.connect('mongodb+srv://tambiarchit:archit123@cluster0.ufzas.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log(err));


// API routes
const PORT=2040
app.listen(PORT,()=>{
    console.log(`Server is Running at ${PORT}`);
})


  

