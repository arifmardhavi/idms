import { useState } from 'react';
import { importTagnumber } from '../../services/tagnumber.service';
import * as XLSX from 'xlsx';

function ImportTagNumber({ onImportRefresh }) {
  const [file, setFile] = useState(null);
  const [previewData, setPreviewData] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState(null);
  const [errors, setErrors] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
  const [rawExcelData, setRawExcelData] = useState([]); // Menyimpan semua data untuk referensi error

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setResult(null);
    setErrors([]);
    setUploadProgress(0);
    setPreviewData([]);

    if (!selectedFile) return;

    if (selectedFile.size > MAX_FILE_SIZE) {
      setErrors([{ row: '-', message: 'Ukuran file maksimal 2MB.' }]);
      return;
    }

    setFile(selectedFile);

    const reader = new FileReader();
    reader.onload = (evt) => {
      const data = new Uint8Array(evt.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const json = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      const headers = json[0];
      const rows = json.slice(1); // semua baris (bukan hanya 5)
      const rawData = rows.map((row) => {
        const obj = {};
        headers.forEach((h, i) => {
          obj[h] = row[i] || '';
        });
        return obj;
      });

      setRawExcelData(rawData);
      setPreviewData(rawData); // tetap tampilkan 5 baris pertama untuk preview awal
    };
    reader.readAsArrayBuffer(selectedFile);
  };

  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    setUploading(true);
    try {
      const res = await importTagnumber(formData, (progressEvent) => {
        const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        setUploadProgress(percent);
      });
      setResult(res.message || 'Upload berhasil!');
      setErrors([]);
      setPreviewData([]); // kosongkan preview kalau sukses
    } catch (err) {
      if (err.response && err.response.status === 422) {
        const errorRows = err.response.data.errors.map((e) => e.row);
        const failedPreview = rawExcelData.filter((_, idx) =>
          errorRows.includes(idx + 1) // +2 karena baris Excel dimulai dari 1 dan ada header
        );
        console.error('Upload error:', err);
        setErrors(err.response.data.errors);
        setPreviewData(failedPreview);
      } else {
        console.error('Upload error:', err);
        setResult(err.message || err.response?.data?.message);
      }
    } finally {
      setUploading(false);
      onImportRefresh();
    }
  };

  return (
    <div className="p-4 rounded shadow bg-white w-full mx-auto">
      <h2 className="text-xl font-bold mb-4">Import Tag Number</h2>
      <input
        type="file"
        accept=".xlsx,.xls,.csv"
        onChange={handleFileChange}
        className="mb-3"
      />
      <button
        onClick={handleUpload}
        disabled={uploading || !file}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        {uploading ? 'Uploading...' : 'Upload'}
      </button>

      {uploadProgress > 0 && (
        <p className="mt-2">Progress: {uploadProgress}%</p>
      )}

      {previewData.length > 0 && (
        <div className="mt-4">
          <h3 className="font-semibold mb-2">Preview Data:</h3>
          <div className="max-h-[300px] overflow-auto">
            <table className="min-w-full border text-sm">
              <thead className="bg-gray-100 text-left sticky top-0">
                <tr>
                  {Object.keys(previewData[0]).map((key, index) => (
                    <th key={index} className="border px-2 py-1">{key}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {previewData.map((row, i) => (
                  <tr key={i}>
                    {Object.values(row).map((val, idx) => (
                      <td key={idx} className="border px-2 py-1">{val}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {result && <p className="mt-4 text-green-600 font-semibold">{result}</p>}

      {errors.length > 0 && (
        <div className="mt-4 bg-red-100 border border-red-300 p-3 rounded">
          <h4 className="font-bold text-red-700">Error Import:</h4>
          <ul className="text-sm text-red-800 mt-1 list-disc pl-4 max-h-64 overflow-auto">
            {errors.map((e, i) => (
              <li key={i}>
                Baris {e.row}: {e.message}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default ImportTagNumber;
