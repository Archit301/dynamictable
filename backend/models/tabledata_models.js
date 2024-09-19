import mongoose from "mongoose";

const columnSchema = new mongoose.Schema({
    name: String, // Name of the column
    type: String  // Type of the column (String, Number, etc.)
  });
  
  // Define the schema for rows with dynamic keys and values
  const rowSchema = new mongoose.Schema({
    data: { type: Map, of: mongoose.Schema.Types.Mixed }  // Store row data as a map of key-value pairs
  });
  
  const tableDataSchema = new mongoose.Schema({
    columns: [columnSchema],
    rows: [rowSchema],
  });
  
 const TableData = mongoose.model('TableData', tableDataSchema);
 export default TableData
  
