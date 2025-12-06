// 测试服务器配置
const express = require('express');
const app = express();
const PORT = 3001;

app.use(express.static('.'));

app.listen(PORT, () => {
    console.log(`测试服务器运行在 http://localhost:${PORT}`);
});