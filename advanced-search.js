// 高级搜索和筛选功能
class AdvancedSearch {
    constructor() {
        this.filters = {
            priceRange: [0, 10000],
            staffStatus: 'all',
            serviceCategory: 'all',
            experienceLevel: 'all',
            rating: 0
        };
        this.searchTimeout = null;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.renderFilterUI();
    }

    // 设置事件监听器
    setupEventListeners() {
        // 搜索框实时搜索
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.debounceSearch(e.target.value);
            });
        }

        // 价格范围筛选
        this.setupPriceRangeFilter();
        
        // 状态筛选
        this.setupStatusFilter();
        
        // 分类筛选
        this.setupCategoryFilter();
    }

    // 防抖搜索
    debounceSearch(query) {
        clearTimeout(this.searchTimeout);
        this.searchTimeout = setTimeout(() => {
            this.performSearch(query);
        }, 300);
    }

    // 执行搜索
    performSearch(query) {
        const results = {
            staff: this.searchStaff(query),
            services: this.searchServices(query)
        };
        
        this.updateSearchResults(results);
        this.updateSearchStats(results);
    }

    // 搜索服务人员
    searchStaff(query) {
        if (!query.trim()) return window.staffData || [];
        
        const searchTerm = query.toLowerCase();
        return (window.staffData || []).filter(staff => 
            staff.name.toLowerCase().includes(searchTerm) ||
            staff.description.toLowerCase().includes(searchTerm) ||
            staff.tags.some(tag => tag.toLowerCase().includes(searchTerm)) ||
            staff.stats.experience.includes(searchTerm)
        );
    }

    // 搜索服务项目
    searchServices(query) {
        if (!query.trim()) return window.serviceData || [];
        
        const searchTerm = query.toLowerCase();
        return (window.serviceData || []).filter(service => 
            service.name.toLowerCase().includes(searchTerm) ||
            service.description.toLowerCase().includes(searchTerm) ||
            service.category.toLowerCase().includes(searchTerm)
        );
    }

    // 更新搜索结果
    updateSearchResults(results) {
        // 更新人员显示
        if (document.getElementById('staff').classList.contains('active')) {
            this.renderFilteredStaff(results.staff);
        }
        
        // 更新服务显示
        if (document.getElementById('price').classList.contains('active')) {
            this.renderFilteredServices(results.services);
        }
    }

    // 渲染筛选后的服务人员
    renderFilteredStaff(staffList) {
        const container = document.getElementById('staffContainer');
        if (!container) return;

        container.innerHTML = '';
        
        staffList.forEach(staff => {
            const card = this.createStaffCard(staff);
            container.appendChild(card);
        });

        // 显示空状态
        if (staffList.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="ti ti-search empty-icon"></i>
                    <h3>未找到匹配的服务人员</h3>
                    <p>请尝试调整搜索条件或筛选器</p>
                </div>
            `;
        }
    }

    // 渲染筛选后的服务项目
    renderFilteredServices(servicesList) {
        const container = document.getElementById('priceContainer');
        if (!container) return;

        container.innerHTML = '';
        
        servicesList.forEach(service => {
            const card = this.createServiceCard(service);
            container.appendChild(card);
        });

        // 显示空状态
        if (servicesList.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="ti ti-search empty-icon"></i>
                    <h3>未找到匹配的服务项目</h3>
                    <p>请尝试调整搜索条件或筛选器</p>
                </div>
            `;
        }
    }

    // 创建服务人员卡片
    createStaffCard(staff) {
        const statusClass = `status-${staff.status}`;
        const statusText = {
            available: '可预约',
            busy: '已满',
            partial: '部分可约'
        }[staff.status];
        
        const isAvailable = staff.status !== 'busy';
        
        const card = document.createElement('div');
        card.className = 'staff-card';
        card.innerHTML = `
            <div class="staff-header">
                <div class="staff-rank">${staff.rank}</div>
                <div class="staff-name">${staff.name}</div>
                <div class="staff-info">${staff.age}岁｜${staff.height}｜${staff.weight}</div>
                <div class="staff-tags">
                    ${staff.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                </div>
            </div>
            <div class="staff-body">
                <p class="staff-desc">${staff.description}</p>
                <div class="staff-stats">
                    <div class="stat-item">
                        <span class="stat-value">${staff.stats.experience}</span>
                        <span class="stat-label">经验</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-value">${staff.stats.rating}</span>
                        <span class="stat-label">评分</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-value">${staff.stats.clients}</span>
                        <span class="stat-label">服务客户</span>
                    </div>
                </div>
                <div class="staff-status ${statusClass}">
                    ${statusText}
                </div>
                <button class="book-btn" onclick="openBookingModal('staff', ${staff.id})" ${!isAvailable ? 'disabled' : ''}>
                    <i class="ti ti-calendar-plus"></i>
                    ${isAvailable ? '立即预约' : '暂不可约'}
                </button>
            </div>
        `;
        return card;
    }

    // 创建服务项目卡片
    createServiceCard(service) {
        const card = document.createElement('div');
        card.className = 'price-card';
        card.innerHTML = `
            <div class="price-header">
                <div class="service-name">${service.name}</div>
                <div class="price-tag">¥${service.basePrice}</div>
                <div class="duration">${service.duration}｜${service.category}服务</div>
            </div>
            <div class="price-body">
                <p class="service-desc">${service.description}</p>
                <ul class="features-list">
                    <li>专业服务人员</li>
                    <li>隐私绝对保障</li>
                    <li>可定制调整</li>
                    <li>安全卫生标准</li>
                </ul>
                <button class="book-btn" onclick="openBookingModal('service', ${service.id})">
                    <i class="ti ti-calendar-plus"></i>
                    预约此服务
                </button>
            </div>
        `;
        return card;
    }

    // 更新搜索统计
    updateSearchStats(results) {
        const statsElement = document.getElementById('searchStats');
        if (statsElement) {
            statsElement.innerHTML = `
                找到 ${results.staff.length} 位服务人员，${results.services.length} 项服务
            `;
        }
    }

    // 设置价格范围筛选
    setupPriceRangeFilter() {
        // 实现价格滑块功能
        const priceSlider = document.getElementById('priceSlider');
        if (priceSlider) {
            // 价格滑块实现
        }
    }

    // 设置状态筛选
    setupStatusFilter() {
        const statusFilter = document.getElementById('statusFilter');
        if (statusFilter) {
            statusFilter.addEventListener('change', (e) => {
                this.filters.staffStatus = e.target.value;
                this.applyFilters();
            });
        }
    }

    // 设置分类筛选
    setupCategoryFilter() {
        const categoryFilter = document.getElementById('categoryFilter');
        if (categoryFilter) {
            categoryFilter.addEventListener('change', (e) => {
                this.filters.serviceCategory = e.target.value;
                this.applyFilters();
            });
        }
    }

    // 应用所有筛选器
    applyFilters() {
        const filteredStaff = this.filterStaff();
        const filteredServices = this.filterServices();
        
        this.updateSearchResults({
            staff: filteredStaff,
            services: filteredServices
        });
    }

    // 筛选服务人员
    filterStaff() {
        let staff = window.staffData || [];
        
        // 状态筛选
        if (this.filters.staffStatus !== 'all') {
            staff = staff.filter(s => s.status === this.filters.staffStatus);
        }
        
        // 经验筛选
        if (this.filters.experienceLevel !== 'all') {
            staff = staff.filter(s => {
                const expYears = parseInt(s.stats.experience);
                switch(this.filters.experienceLevel) {
                    case 'junior': return expYears <= 2;
                    case 'mid': return expYears > 2 && expYears <= 5;
                    case 'senior': return expYears > 5;
                    default: return true;
                }
            });
        }
        
        // 评分筛选
        if (this.filters.rating > 0) {
            staff = staff.filter(s => parseFloat(s.stats.rating) >= this.filters.rating);
        }
        
        return staff;
    }

    // 筛选服务项目
    filterServices() {
        let services = window.serviceData || [];
        
        // 分类筛选
        if (this.filters.serviceCategory !== 'all') {
            services = services.filter(s => s.category === this.filters.serviceCategory);
        }
        
        // 价格筛选
        services = services.filter(s => 
            s.basePrice >= this.filters.priceRange[0] && 
            s.basePrice <= this.filters.priceRange[1]
        );
        
        return services;
    }

    // 渲染筛选UI
    renderFilterUI() {
        const searchContainer = document.querySelector('.search-container');
        if (searchContainer) {
            searchContainer.insertAdjacentHTML('afterend', `
                <div class="filter-container">
                    <div class="filter-header">
                        <div class="filter-title">高级筛选</div>
                        <button class="action-btn detail" onclick="toggleFilterPanel()">
                            显示/隐藏筛选器
                        </button>
                    </div>
                    <div class="filter-controls" id="filterPanel">
                        <div class="filter-group">
                            <label class="filter-label">服务人员状态</label>
                            <select class="filter-select" id="statusFilter">
                                <option value="all">全部状态</option>
                                <option value="available">可预约</option>
                                <option value="partial">部分可约</option>
                                <option value="busy">已满</option>
                            </select>
                        </div>
                        <div class="filter-group">
                            <label class="filter-label">服务分类</label>
                            <select class="filter-select" id="categoryFilter">
                                <option value="all">全部分类</option>
                                <option value="基础">基础服务</option>
                                <option value="高级">高级服务</option>
                                <option value="定制">定制服务</option>
                                <option value="专属">专属服务</option>
                                <option value="补充">补充服务</option>
                            </select>
                        </div>
                        <div class="filter-group">
                            <label class="filter-label">经验级别</label>
                            <select class="filter-select" id="experienceFilter">
                                <option value="all">全部经验</option>
                                <option value="junior">初级（≤2年）</option>
                                <option value="mid">中级（2-5年）</option>
                                <option value="senior">高级（＞5年）</option>
                            </select>
                        </div>
                    </div>
                    <div id="searchStats" class="search-stats"></div>
                </div>
            `);
        }
    }
}

// 切换筛选面板显示/隐藏
function toggleFilterPanel() {
    const panel = document.getElementById('filterPanel');
    if (panel) {
        panel.style.display = panel.style.display === 'none' ? 'grid' : 'none';
    }
}

// 初始化高级搜索
document.addEventListener('DOMContentLoaded', () => {
    window.advancedSearch = new AdvancedSearch();
});