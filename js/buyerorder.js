// Dữ liệu mẫu (Mock Data) giả lập phản hồi từ API
const orders = [
    { id: 'ORD-2024-1847', name: 'Puma Speedcat Ballet Suede', price: '2.200.000 đ', date: '15 Jan 2024', status: 'In Delivery', time: '2 days ago', img: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=100' },
    { id: 'ORD-2024-1846', name: 'New Balance 530', price: '1.800.000 đ', date: '14 Jan 2024', status: 'Delivered', time: '1 day ago', img: 'https://images.unsplash.com/photo-1539185441755-769473a23570?w=100' },
    { id: 'ORD-2024-1845', name: 'Giày leo núi nữ Humtto', price: '950.000 đ', date: '10 Jan 2024', status: 'Delivered', time: '5 days ago', img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100' },
    { id: 'ORD-2024-1843', name: 'Adidas Ultraboost 22', price: '3.200.000 đ', date: '8 Jan 2024', status: 'Cancelled', time: '7 days ago', img: 'https://images.unsplash.com/photo-1587563871167-1ee9c731aefb?w=100' }
];

// Khởi tạo biến lưu trạng thái hiện tại
let currentFilter = 'All';
let searchQuery = '';

// Hàm hiển thị danh sách đơn hàng ra HTML
function renderOrders() {
    const container = document.getElementById('order-list');
    const countElement = document.getElementById('order-count');
    
    // Lọc dữ liệu dựa trên Status và Search Keyword
    const filteredOrders = orders.filter(order => {
        const matchesFilter = currentFilter === 'All' || order.status === currentFilter;
        const matchesSearch = order.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                              order.id.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    // Cập nhật số lượng hiển thị (Item 6)
    countElement.innerText = `${filteredOrders.length} orders found`;

    // Render Template
    container.innerHTML = filteredOrders.map(order => `
        <div class="bg-white p-4 rounded-xl border flex items-center justify-between hover:shadow-md transition-shadow">
            <div class="flex gap-4 items-center">
                <img src="${order.img}" alt="product" class="w-20 h-20 rounded-lg object-cover bg-gray-100">
                <div>
                    <h3 class="font-bold text-slate-800">${order.name}</h3>
                    <p class="text-xs text-gray-400">${order.status} • ${order.time}</p>
                    <p class="text-blue-600 font-bold mt-1">${order.price}</p>
                </div>
            </div>
            <div class="text-center">
                <p class="font-bold text-sm">${order.id}</p>
                <p class="text-xs text-gray-400">${order.date}</p>
            </div>
            <div class="flex items-center gap-6">
                <span class="px-4 py-1 text-xs font-bold rounded-full ${getStatusClass(order.status)}">${order.status}</span>
                <button onclick="goToDetail('${order.id}')" class="p-2 hover:bg-gray-100 rounded-lg text-gray-400">
                    <i class="lucide-chevron-right text-xl"></i>
                </button>
            </div>
        </div>
    `).join('');
}

// Hàm hỗ trợ lấy CSS Class theo trạng thái
function getStatusClass(status) {
    switch(status) {
        case 'In Delivery': return 'bg-orange-100 text-orange-600';
        case 'Delivered': return 'bg-green-100 text-green-600';
        case 'Cancelled': return 'bg-red-100 text-red-600';
        default: return 'bg-gray-100 text-gray-600';
    }
}

// Xử lý sự kiện Tìm kiếm (Debounce đơn giản)
document.getElementById('search-input').addEventListener('input', (e) => {
    searchQuery = e.target.value;
    renderOrders();
});

// Xử lý sự kiện Click Filter (Items 7-10)
document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        // Cập nhật UI nút đang active
        document.querySelector('.filter-btn.bg-blue-600').classList.replace('bg-blue-600', 'bg-white');
        document.querySelector('.filter-btn.text-white')?.classList.add('text-gray-600');
        
        this.classList.add('bg-blue-600', 'text-white');
        this.classList.remove('bg-white', 'text-gray-600');

        // Cập nhật logic lọc
        currentFilter = this.dataset.status;
        renderOrders();
    });
});

// Hàm giả lập chuyển hướng (Item 13)
function goToDetail(orderId) {
    console.log(`Navigating to detail of: ${orderId}`);
    // window.location.href = `/order-details/${orderId}`;
}

// Chạy lần đầu khi load trang
renderOrders();