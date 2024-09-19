import { useState, useEffect } from "react";

function DynamicTable() {
  const [columns, setColumns] = useState([]);
  const [rows, setRows] = useState([]);
  const [newColumn, setNewColumn] = useState({ name: "", type: "string" });
  const [filterQuery, setFilterQuery] = useState("");

  useEffect(() => {
    fetch("http://localhost:2040/backend/table/tables")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setColumns(data.columns || []);
        setRows(data.rows || []);
      })
      .catch((error) => console.error("Error fetching table data:", error));
  }, []);


  const addColumn = () => {
    if (newColumn.name.trim() === "") return;
    setColumns([...columns, newColumn]);
    setNewColumn({ name: "", type: "string" });
  };

 
  const addRow = () => {
    const emptyRow = columns.reduce((acc, col) => {
      acc[col.name] = col.type === "number" ? 0 : "";
      return acc;
    }, {});


    setRows((prevRows) => [...prevRows, emptyRow]);

    fetch("http://localhost:2040/backend/table/row", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ row: emptyRow }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        if (data.rows) {
          console.log("New rows from backend:", data.rows);
          setRows(data.rows);
        } else {
          console.log("Backend returned no rows, using frontend data.");
        }
      })
      .catch((error) => console.error("Error adding row:", error));
  };

  const updateCell = (rowIndex, columnName, value) => {
    const updatedRows = [...rows];
    updatedRows[rowIndex][columnName] = value;

    fetch(`http://localhost:2040/backend/table/row/${rows[rowIndex]._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        updatedRow: updatedRows[rowIndex],
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        if (data.rows) {
          setRows(data.rows || []);
        } else {
          console.log("Update success, but no rows returned.");
        }
      })
      .catch((error) => console.error("Error updating row:", error));
  };


  const handleFilter = () => {
    const filteredRows = rows.filter((row) => {
      return Object.values(row).some((value) =>
        value.toString().toLowerCase().includes(filterQuery.toLowerCase())
      );
    });
    setRows(filteredRows);
  };


  const handleSort = (colName) => {
    const sortedRows = [...rows].sort((a, b) => {
      if (typeof a[colName] === "number" && typeof b[colName] === "number") {
        return a[colName] - b[colName];
      }
      return a[colName].localeCompare(b[colName]);
    });
    setRows(sortedRows);
  };

  return (
    <div className="p-4">
      <h2 className="text-lg font-bold mb-4">Dynamic Table</h2>

      
      <div className="flex items-center mb-4">
        <input
          type="text"
          value={newColumn.name}
          onChange={(e) => setNewColumn({ ...newColumn, name: e.target.value })}
          placeholder="Column Name"
          className="border p-2 mr-2"
        />
        <select
          value={newColumn.type}
          onChange={(e) => setNewColumn({ ...newColumn, type: e.target.value })}
          className="border p-2 mr-2"
        >
          <option value="string">String</option>
          <option value="number">Number</option>
        </select>
        <button onClick={addColumn} className="bg-blue-500 text-white px-4 py-2">
          Add Column
        </button>
      </div>

      <div className="flex items-center mb-4">
        <input
          type="text"
          value={filterQuery}
          onChange={(e) => setFilterQuery(e.target.value)}
          placeholder="Filter Rows"
          className="border p-2 mr-2"
        />
        <button onClick={handleFilter} className="bg-blue-500 text-white px-4 py-2">
          Filter
        </button>
      </div>

   
      <table className="min-w-full table-auto border">
        <thead>
          <tr>
            {columns.map((col, index) => (
              <th
                key={index}
                onClick={() => handleSort(col.name)}
                className="cursor-pointer px-4 py-2 border"
              >
                {col.name} ({col.type})
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {columns.map((col, colIndex) => (
                <td key={colIndex} className="px-4 py-2 border">
                  <input
                    type={col.type === "number" ? "number" : "text"}
                    value={row[col.name]}
                    onChange={(e) => updateCell(rowIndex, col.name, e.target.value)}
                    className="border p-2 w-full"
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

     
      <button onClick={addRow} className="mt-4 bg-green-500 text-white px-4 py-2">
        Add Row
      </button>
    </div>
  );
}

export default DynamicTable;
