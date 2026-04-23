

import fs from 'fs';
import multer from "multer";
import path from "path";

// Ensure uploads/tmp exists
const tmpDir = "uploads/tmp";
if (!fs.existsSync(tmpDir)) {
    fs.mkdirSync(tmpDir, { recursive: true });
}

const ALLOWED_EXT = [".pdf", ".jpg", ".jpeg", ".png"];
const ALLOWED_MIME = ["application/pdf", "image/jpeg", "image/png"];
const MAX_SIZE = 2 * 1024 * 1024; // 2MB

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/tmp"); // Save to temp folder first
    },
    filename: (req, file, cb) => {
        const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, unique + path.extname(file.originalname).toLowerCase());
    },
});

const fileFilter = async (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (!ALLOWED_EXT.includes(ext)) {
        return cb(new Error("Only pdf, jpg, png files are allowed"), false);
    }
    if (!ALLOWED_MIME.includes(file.mimetype)) {
        return cb(new Error("Invalid file type"), false);
    }
    // Accept file, but check real type after upload (multer limitation)
    cb(null, true);
};

const upload = multer({ storage, fileFilter, limits: { fileSize: MAX_SIZE } });

// Helper to move file from temp to final folder after validation
export const moveFromTempToFinal = async (file, finalSubfolder = "") => {
    const destDir = finalSubfolder ? `uploads/${finalSubfolder}` : 'uploads';
    if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });
    const destPath = `${destDir}/${file.filename}`;
    await fs.promises.rename(file.path, destPath);
    file.path = destPath;
    return file;
};

export default upload;