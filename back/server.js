const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');

const app = express();
const port = 5001;

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.use(cors());


// Cho phép truy cập các file đã upload thông qua URL
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Endpoint đăng nhập
const dummyUser = { username: 'phi', password: 'nhatphic3' };
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    if (username === dummyUser.username && password === dummyUser.password) {
        res.json({ success: true, token: 'dummy-token' });
    } else {
        res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
});

// Danh sách bệnh nhân mẫu gồm 10 bệnh nhân
let patients = [
    { id: 1, name: "Ben", address: "123 Main St, City 1", email: "patient1@example.com", title: "Title 1", timezone: "UTC+1", img: "https://img.freepik.com/free-photo/young-bearded-man-with-striped-shirt_273609-5677.jpg" },
    { id: 2, name: "Jim", address: "456 Elm St, City 2", email: "patient2@example.com", title: "Title 2", timezone: "UTC-2", img: "https://img.freepik.com/free-photo/young-bearded-man-with-striped-shirt_273609-5677.jpg" },
    { id: 3, name: "Mical", address: "789 Oak Ave, City 3", email: "patient3@example.com", title: "Title 3", timezone: "UTC+3", img: "https://img.freepik.com/free-photo/young-bearded-man-with-striped-shirt_273609-5677.jpg" },
    { id: 4, name: "Jack", address: "321 Pine Rd, City 4", email: "patient4@example.com", title: "Title 4", timezone: "UTC-4", img: "https://img.freepik.com/free-photo/young-bearded-man-with-striped-shirt_273609-5677.jpg" },
    { id: 5, name: "jing", address: "654 Maple Blvd, City 5", email: "patient5@example.com", title: "Title 5", timezone: "UTC+5", img: "https://img.freepik.com/free-photo/young-bearded-man-with-striped-shirt_273609-5677.jpg" },
    { id: 6, name: "chingchong", address: "987 Cedar Ln, City 6", email: "patient6@example.com", title: "Title 6", timezone: "UTC-6", img: "https://img.freepik.com/free-photo/young-bearded-man-with-striped-shirt_273609-5677.jpg" },
    { id: 7, name: "casct", address: "135 Walnut St, City 7", email: "patient7@example.com", title: "Title 7", timezone: "UTC+7", img: "https://img.freepik.com/free-photo/young-bearded-man-with-striped-shirt_273609-5677.jpg" },
    { id: 8, name: "vabn", address: "246 Birch Ave, City 8", email: "patient8@example.com", title: "Title 8", timezone: "UTC-8", img: "https://img.freepik.com/free-photo/young-bearded-man-with-striped-shirt_273609-5677.jpg" },
    { id: 9, name: "ninga", address: "369 Spruce Dr, City 9", email: "patient9@example.com", title: "Title 9", timezone: "UTC+9", img: "https://img.freepik.com/free-photo/young-bearded-man-with-striped-shirt_273609-5677.jpg" },
    { id: 10, name: "nameres", address: "159 Chestnut Blvd, City 10", email: "patient10@example.com", title: "Title 10", timezone: "UTC-10", img: "https://img.freepik.com/free-photo/young-bearded-man-with-striped-shirt_273609-5677.jpg" }
];

// Cấu hình multer để lưu file upload vào thư mục 'uploads'
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // thư mục uploads cần tồn tại
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        cb(null, `patient-${req.params.id}-${Date.now()}${ext}`);
    }
});
const upload = multer({ storage });

// Endpoint GET danh sách bệnh nhân (hỗ trợ query tìm kiếm theo tên)
app.get('/api/patients', (req, res) => {
    const q = req.query.q || '';
    const filteredPatients = patients.filter(patient =>
        patient.name.toLowerCase().includes(q.toLowerCase())
    );
    res.json(filteredPatients);
});

// Endpoint GET chi tiết bệnh nhân theo id
app.get('/api/patients/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const patient = patients.find(p => p.id === id);
    if (patient) {
        res.json(patient);
    } else {
        res.status(404).json({ message: 'Patient not found' });
    }
});

// Endpoint POST để tạo bệnh nhân mới (không lưu trường title)
app.post('/api/patients', (req, res) => {
    const newPatient = req.body;
    // Loại bỏ trường title nếu có
    if (newPatient.title) {
        delete newPatient.title;
    }
    // Tạo id mới dựa trên mảng hiện tại
    const newId = patients.length ? Math.max(...patients.map(p => p.id)) + 1 : 1;
    newPatient.id = newId;
    newPatient.img = newPatient.img || "";
    patients.push(newPatient);
    res.status(201).json(newPatient);
});

// Endpoint POST để upload avatar từ máy tính cho bệnh nhân theo id
app.post('/api/patients/:id/avatar', upload.single('avatar'), (req, res) => {
    const id = parseInt(req.params.id);
    const patientIndex = patients.findIndex(p => p.id === id);
    if (patientIndex === -1) {
        return res.status(404).json({ message: 'Patient not found' });
    }
    const fileUrl = `http://localhost:${port}/uploads/${req.file.filename}`;
    patients[patientIndex].img = fileUrl;
    res.json({ success: true, img: fileUrl });
});

// Endpoint DELETE để xoá bệnh nhân theo id
app.delete('/api/patients/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = patients.findIndex(p => p.id === id);
    if (index !== -1) {
        patients.splice(index, 1);
        res.status(200).json({ message: 'Patient deleted successfully' });
    } else {
        res.status(404).json({ message: 'Patient not found' });
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});