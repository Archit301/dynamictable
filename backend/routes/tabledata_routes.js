import express from 'express';
import TableData from '../models/tabledata_models.js';

const router = express.Router();

// Initialize table
router.post('/initialize', async (req, res) => {
  const { columns } = req.body;
  try {
    const table = new TableData({ columns, rows: [] });
    await table.save();
    res.status(201).json(table);
  } catch (error) {
    res.status(500).json({ error: 'Error initializing table' });
    console.log(error)
  }
});

// Get table data
router.get('/tables', async (req, res) => {
  try {
    const table = await TableData.findOne();
    if (!table) return res.status(404).json({ error: 'No table found' });
    res.status(200).json(table);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching table data' });
  }
});

// Add row to table
router.post('/row', async (req, res) => {
    const { row } = req.body;
    try {
      const table = await TableData.findOne();
      if (!table) {
        return res.status(404).json({ error: 'No table found' });
      }
      table.rows.push({ data: row });
      await table.save();
      res.status(201).json(table);
    } catch (error) {
      res.status(500).json({ error: 'Error adding row' });
    }
  });

// Update row by ID
router.put('/row/:rowId', async (req, res) => {
  const { rowId } = req.params;
  const { updatedRow } = req.body;

  if (!mongoose.Types.ObjectId.isValid(rowId)) {
    return res.status(400).json({ error: 'Invalid row ID' });
  }

  try {
    const table = await TableData.findOne();
    if (!table) return res.status(404).json({ error: 'No table found' });
    const rowIndex = table.rows.findIndex((row) => row._id.toString() === rowId);
    if (rowIndex === -1) return res.status(404).json({ error: 'Row not found' });
    table.rows[rowIndex].data = updatedRow;
    await table.save();
    res.status(200).json(table);
  } catch (error) {
    res.status(500).json({ error: 'Error updating row' });
  }
});

// Delete row by ID
router.delete('/row/:rowId', async (req, res) => {
  const { rowId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(rowId)) {
    return res.status(400).json({ error: 'Invalid row ID' });
  }

  try {
    const table = await TableData.findOne();
    if (!table) return res.status(404).json({ error: 'No table found' });
    table.rows = table.rows.filter((row) => row._id.toString() !== rowId);
    await table.save();
    res.status(200).json(table);
  } catch (error) {
    res.status(500).json({ error: 'Error deleting row' });
  }
});

export default router;
