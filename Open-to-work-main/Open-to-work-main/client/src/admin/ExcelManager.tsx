import { useState, useEffect } from "react";
import {
  Upload,
  Download,
  Plus,
  FileSpreadsheet,
  Save,
} from "lucide-react";

const ExcelManager = () => {
  const [rows, setRows] = useState<any[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [fileId, setFileId] = useState<string>("");

  const API = "https://job-portal-backend.onrender.com/api/excel";

  // ================= AUTO LOAD AFTER REFRESH =================
  useEffect(() => {
    const savedId = localStorage.getItem("excelFileId");
    if (savedId) {
      setFileId(savedId);
      fetchFile(savedId);
    }
  }, []);

  // 🔥 Auto Status
  const getStatus = (stock: number) => {
    if (stock < 0) return "Low";
    if (stock > 3000) return "High";
    return "Normal";
  };

  // ================= UPLOAD =================
  const handleUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch(`${API}/upload`, {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message);
      return;
    }

    alert("Uploaded & Stored in DB ✅");

    setFileId(data.id);
    localStorage.setItem("excelFileId", data.id); // ✅ SAVE ID

    fetchFile(data.id);
  };

  // ================= FETCH =================
  const fetchFile = async (id: string) => {
    const res = await fetch(`${API}/${id}`);
    const data = await res.json();

    if (!res.ok) {
      alert("Failed to load file");
      return;
    }

    setRows(data.rows);
    setHeaders(data.headers);
  };

  // ================= SAVE =================
  const handleSave = async () => {
    if (!fileId) {
      alert("Upload file first!");
      return;
    }

    const res = await fetch(`${API}/${fileId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ rows }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message || "Update failed");
      return;
    }

    alert("Updated in DB Successfully ✅");
  };

  // ================= DOWNLOAD =================
  const handleDownload = () => {
    if (!fileId) {
      alert("Upload file first!");
      return;
    }

    window.open(`${API}/${fileId}/download`);
  };

  // ================= TABLE EDIT =================
  const handleChange = (
    index: number,
    key: string,
    value: any
  ) => {
    const updated = [...rows];
    updated[index][key] =
      key === "STOCK" ? Number(value) : value;
    setRows(updated);
  };

  const addRow = () => {
    const newRow: any = {};
    headers.forEach((h) => {
      if (h !== "STATUS") newRow[h] = "";
    });
    setRows([...rows, newRow]);
  };

  const addColumn = () => {
    const name = prompt("Enter column name");
    if (!name) return;

    const updatedHeaders = [...headers];
    updatedHeaders.splice(
      updatedHeaders.length - 1,
      0,
      name
    );
    setHeaders(updatedHeaders);

    const updatedRows = rows.map((row) => ({
      ...row,
      [name]: "",
    }));

    setRows(updatedRows);
  };

  return (
    <div className="p-8">
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="bg-green-100 p-3 rounded-lg">
            <FileSpreadsheet
              className="text-green-600"
              size={22}
            />
          </div>
          <div>
            <h2 className="text-xl font-semibold">
              Excel File Manager
            </h2>
            <p className="text-gray-500 text-sm">
              Upload & manage Excel data
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <label className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 cursor-pointer">
            <Upload size={16} /> Upload
            <input
              type="file"
              accept=".xlsx, .xls"
              hidden
              onChange={handleUpload}
            />
          </label>

          <button
            onClick={handleDownload}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <Download size={16} /> Download
          </button>

          <button
            onClick={handleSave}
            className="bg-gray-200 px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <Save size={16} /> Save
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-600 text-sm uppercase">
            <tr>
              <th className="p-4">#</th>
              {headers.map((h) => (
                <th key={h} className="p-4">
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {rows.map((row, index) => {
              const status = getStatus(
                Number(row.STOCK || 0)
              );

              return (
                <tr key={index} className="border-t">
                  <td className="p-4">
                    {index + 1}
                  </td>

                  {headers.map((h) =>
                    h === "STATUS" ? (
                      <td key={h} className="p-4 font-medium">
                        {status}
                      </td>
                    ) : (
                      <td key={h} className="p-4">
                        <input
                          type={
                            h === "STOCK"
                              ? "number"
                              : "text"
                          }
                          value={row[h] || ""}
                          onChange={(e) =>
                            handleChange(
                              index,
                              h,
                              e.target.value
                            )
                          }
                          className="w-full bg-transparent outline-none"
                        />
                      </td>
                    )
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>

        <div className="flex justify-between items-center p-4 border-t bg-gray-50">
          <div className="flex gap-3">
            <button
              onClick={addRow}
              className="border px-4 py-2 rounded-lg flex items-center gap-2"
            >
              <Plus size={16} /> Add Row
            </button>

            <button
              onClick={addColumn}
              className="border px-4 py-2 rounded-lg flex items-center gap-2"
            >
              <Plus size={16} /> Add Column
            </button>
          </div>

          <div className="text-sm text-gray-500">
            {rows.length} rows · {headers.length} columns
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExcelManager;