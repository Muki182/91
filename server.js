const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// 数据文件路径
const DATA_FILE = path.join(__dirname, 'data.json');

// 初始化数据
function initData() {
    if (!fs.existsSync(DATA_FILE)) {
        const initialData = {
            bookings: [],
            staff: [
                {
                    id: 1,
                    name: "林佳铭",
                    rank: "#1",
                    age: 28,
                    height: "183cm",
                    weight: "72kg",
                    status: "partial",
                    description: "首席服务师，接受高级定制需求。精通各种技巧，经验丰富，客户满意度最高。",
                    tags: ["首席服务师", "高级定制", "专家级技巧", "深度交流", "场景定制"],
                    stats: { experience: "5年", rating: "4.9", clients: "280+" },
                    priceMultiplier: 1.5
                },
                {
                    id: 2,
                    name: "陈逸飞",
                    rank: "#2",
                    age: 25,
                    height: "178cm",
                    weight: "68kg",
                    status: "available",
                    description: "擅长舒缓按摩与基础服务，耐心细致，适合初次体验者。",
                    tags: ["舒缓按摩", "基础服务", "新人友好", "耐心细致"],
                    stats: { experience: "3年", rating: "4.7", clients: "150+" },
                    priceMultiplier: 1.0
                },
                {
                    id: 3,
                    name: "王浩然",
                    rank: "#3",
                    age: 26,
                    height: "180cm",
                    weight: "70kg",
                    status: "available",
                    description: "专业形体训练师，提供健身指导与体能训练服务。",
                    tags: ["形体训练", "健身指导", "体能训练", "专业指导"],
                    stats: { experience: "4年", rating: "4.8", clients: "200+" },
                    priceMultiplier: 1.2
                },
                {
                    id: 4,
                    name: "张子轩",
                    rank: "#4",
                    age: 24,
                    height: "175cm",
                    weight: "65kg",
                    status: "busy",
                    description: "情感陪伴专家，擅长倾听与心理疏导。",
                    tags: ["情感陪伴", "心理疏导", "倾听专家", "温柔体贴"],
                    stats: { experience: "2年", rating: "4.6", clients: "120+" },
                    priceMultiplier: 0.9
                }
            ],
            services: [
                {
                    id: 1,
                    name: "基础陪伴服务",
                    description: "标准陪伴服务，包括基础交流与情感支持",
                    basePrice: 200,
                    duration: 2,
                    category: "basic",
                    tags: ["基础服务", "情感陪伴", "标准时长"]
                },
                {
                    id: 2,
                    name: "高级定制服务",
                    description: "个性化定制服务，根据客户需求提供专属体验",
                    basePrice: 500,
                    duration: 3,
                    category: "premium",
                    tags: ["高级定制", "专属体验", "个性化服务"]
                },
                {
                    id: 3,
                    name: "专业按摩服务",
                    description: "专业级按摩放松服务，缓解身心疲劳",
                    basePrice: 300,
                    duration: 2,
                    category: "special",
                    tags: ["专业按摩", "身心放松", "疲劳缓解"]
                },
                {
                    id: 4,
                    name: "形体训练指导",
                    description: "个性化形体训练与健身指导服务",
                    basePrice: 400,
                    duration: 2,
                    category: "training",
                    tags: ["形体训练", "健身指导", "专业教练"]
                }
            ]
        };
        
        fs.writeFileSync(DATA_FILE, JSON.stringify(initialData, null, 2));
        console.log('数据文件已初始化');
    }
}

// 读取数据
function readData() {
    try {
        const data = fs.readFileSync(DATA_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('读取数据文件失败:', error);
        return { bookings: [], staff: [], services: [] };
    }
}

// 写入数据
function writeData(data) {
    try {
        fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
        return true;
    } catch (error) {
        console.error('写入数据文件失败:', error);
        return false;
    }
}

// API 路由

// 获取所有数据
app.get('/api/data', (req, res) => {
    const data = readData();
    res.json(data);
});

// 获取服务人员列表
app.get('/api/staff', (req, res) => {
    const data = readData();
    res.json(data.staff);
});

// 获取服务项目列表
app.get('/api/services', (req, res) => {
    const data = readData();
    res.json(data.services);
});

// 获取预约记录
app.get('/api/bookings', (req, res) => {
    const data = readData();
    res.json(data.bookings);
});

// 创建预约
app.post('/api/bookings', (req, res) => {
    const data = readData();
    const booking = {
        id: 'BK' + Date.now(),
        ...req.body,
        status: 'pending',
        createdAt: new Date().toISOString()
    };
    
    data.bookings.push(booking);
    
    if (writeData(data)) {
        res.json({ success: true, booking });
    } else {
        res.status(500).json({ success: false, error: '保存预约失败' });
    }
});

// 更新预约状态
app.put('/api/bookings/:id', (req, res) => {
    const data = readData();
    const bookingIndex = data.bookings.findIndex(b => b.id === req.params.id);
    
    if (bookingIndex !== -1) {
        data.bookings[bookingIndex] = { ...data.bookings[bookingIndex], ...req.body };
        
        if (writeData(data)) {
            res.json({ success: true, booking: data.bookings[bookingIndex] });
        } else {
            res.status(500).json({ success: false, error: '更新预约失败' });
        }
    } else {
        res.status(404).json({ success: false, error: '预约不存在' });
    }
});

// 删除预约
app.delete('/api/bookings/:id', (req, res) => {
    const data = readData();
    const bookingIndex = data.bookings.findIndex(b => b.id === req.params.id);
    
    if (bookingIndex !== -1) {
        data.bookings.splice(bookingIndex, 1);
        
        if (writeData(data)) {
            res.json({ success: true });
        } else {
            res.status(500).json({ success: false, error: '删除预约失败' });
        }
    } else {
        res.status(404).json({ success: false, error: '预约不存在' });
    }
});

// 搜索服务人员
app.get('/api/staff/search', (req, res) => {
    const { q } = req.query;
    const data = readData();
    
    if (!q) {
        return res.json(data.staff);
    }
    
    const filteredStaff = data.staff.filter(staff => 
        staff.name.toLowerCase().includes(q.toLowerCase()) ||
        staff.description.toLowerCase().includes(q.toLowerCase()) ||
        staff.tags.some(tag => tag.toLowerCase().includes(q.toLowerCase()))
    );
    
    res.json(filteredStaff);
});

// 获取统计数据
app.get('/api/stats', (req, res) => {
    const data = readData();
    const stats = {
        totalStaff: data.staff.length,
        totalServices: data.services.length,
        totalBookings: data.bookings.length,
        pendingBookings: 0,
        confirmedBookings: 0,
        cancelledBookings: 0
    };

    data.bookings.forEach(b => {
        if (b.status === 'pending') stats.pendingBookings++;
        else if (b.status === 'confirmed') stats.confirmedBookings++;
        else if (b.status === 'cancelled') stats.cancelledBookings++;
    });
    
    res.json(stats);
});

// 默认路由 - 服务静态文件
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// 初始化并启动服务器
initData();

app.listen(PORT, () => {
    console.log(`服务器运行在 http://localhost:${PORT}`);
    console.log('男男性服务全档案系统已启动');
});