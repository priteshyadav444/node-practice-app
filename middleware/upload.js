
import multer from "multer";
import path from "path";

const ALLOWED_EXT = [".pdf", ".jpg", ".jpeg", ".png"];
const ALLOWED_MIME = ["application/pdf", "image/jpeg", "image/png"];
const MAX_SIZE = 2 * 1024 * 1024; // 2MB

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
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

const upload = multer({ storage, fileFilter, limits: { fileSize: MAX_SIZE }, });
export default upload;