import mongoose from "mongoose";

const columnSchema = new mongoose.Schema({
    name: String, 
    type: String  
  });
  
 
  const rowSchema = new mongoose.Schema({
    data: { type: Map, of: mongoose.Schema.Types.Mixed }  
  });
  
  const tableDataSchema = new mongoose.Schema({
    columns: [columnSchema],
    rows: [rowSchema],
  });
  
 const TableData = mongoose.model('TableData', tableDataSchema);
 export default TableData
  
