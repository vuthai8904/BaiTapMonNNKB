// todo-backend/index.js
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// Kết nối tới database SQLite, file todos.db sẽ được tạo nếu chưa có
const db = new sqlite3.Database('./todos.db', (err) => {
    if (err) {
        console.error('Lỗi kết nối database:', err.message);
    } else {
        console.log('Đã kết nối tới database todos.');
        // Chạy lệnh để tạo bảng nếu chưa tồn tại
        db.run(`
            CREATE TABLE IF NOT EXISTS todos (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                completed BOOLEAN DEFAULT 0
            )
        `, (err) => {
            if (err) {
                console.error('Lỗi tạo bảng:', err.message);
            }
        });
    }
});

// API: Lấy tất cả todos
app.get('/api/todos', (req, res) => {
    db.all("SELECT * FROM todos ORDER BY id DESC", [], (err, rows) => {
        if (err) {
            return res.status(500).json({ "error": err.message });
        }
        res.json({ data: rows });
    });
});

// API: Thêm todo mới
app.post('/api/todos', (req, res) => {
    const { title } = req.body;
    if (!title) {
        return res.status(400).json({ "error": "Thiếu title" });
    }
    const sql = `INSERT INTO todos (title, completed) VALUES (?, ?)`;
    db.run(sql, [title, 0], function(err) {
        if (err) {
            return res.status(500).json({ "error": err.message });
        }
        // Trả về todo vừa được tạo
        res.status(201).json({ data: { id: this.lastID, title, completed: false } });
    });
});

// API: Cập nhật todo (sửa title hoặc đánh dấu hoàn thành)
app.put('/api/todos/:id', (req, res) => {
    const { id } = req.params;
    const { title, completed } = req.body;

    let sql = 'UPDATE todos SET ';
    const params = [];

    if (title !== undefined) {
        sql += 'title = ?, ';
        params.push(title);
    }
    if (completed !== undefined) {
        sql += 'completed = ?, ';
        params.push(completed ? 1 : 0);
    }

    sql = sql.slice(0, -2); // Xóa dấu phẩy và khoảng trắng cuối cùng
    sql += ' WHERE id = ?';
    params.push(id);

    db.run(sql, params, function(err) {
        if (err) {
            return res.status(500).json({ "error": err.message });
        }
        if (this.changes === 0) {
            return res.status(404).json({ "error": "Không tìm thấy todo" });
        }
        res.json({ message: "Cập nhật thành công" });
    });
});

// API: Xóa todo
app.delete('/api/todos/:id', (req, res) => {
    const { id } = req.params;
    db.run(`DELETE FROM todos WHERE id = ?`, id, function(err) {
        if (err) {
            return res.status(500).json({ "error": err.message });
        }
        if (this.changes === 0) {
            return res.status(404).json({ "error": "Không tìm thấy todo" });
        }
        res.json({ message: "Xóa thành công", id: id });
    });
});

app.listen(port, () => {
    console.log(`🚀 Backend đang chạy tại http://localhost:${port}`);
});