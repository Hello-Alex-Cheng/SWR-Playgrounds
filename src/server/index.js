const express = require('express');
const app = express();

// 存储Todo列表的数组
const todos = [];
// 解析请求体中的JSON数据
app.use(express.json());

// 增加todo的接口
app.post('/todos', (req, res) => {
	const todo = req.body;
  todos.push(todo);
  res.status(201).json(todo);
});

// 查询所有todo的接口
app.get('/todos', (req, res) => {
  res.json(todos);
});

// 启动服务
app.listen(8888, () => {
  console.log('Server is running on port 8888...');
});
