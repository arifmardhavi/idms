import { apiGetBlob } from "../services/config";

// UNIVERSAL FILE DOWNLOADER
export const downloadFile = async (endpoint, fallbackName = "download") => {
    try {
        // 1. GET file binary
        const response = await apiGetBlob(endpoint);

        // 2. Ambil filename dari Content-Disposition
        let fileName = fallbackName;

        const cd = response.headers["content-disposition"];
        if (cd) {
            const match = cd.match(/filename="?([^"]+)"?/);
            if (match && match[1]) fileName = match[1];
        }

        // 3. Convert ke blob
        const blob = new Blob([response.data], {
            type: response.headers["content-type"],
        });

        // 4. Create temporary download link
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = fileName;

        document.body.appendChild(a);
        a.click();
        a.remove();

        // 5. Bersihkan memory
        window.URL.revokeObjectURL(url);

        return true;

    } catch (error) {
        console.error("Download File Error:", error);
        throw error;
    }
};
