// 1. KHO DỮ LIỆU GIẢ LẬP (MOCK DATA HOÀN CHỈNH)

const mockDataOverview = {
    'Today': { kpi: { gmv: '$4,250.00', orders: '142', conversion: '1.2%', aov: '$29.92' }, chartData: [{ name: 'Revenue', data: [500, 800, 400, 1200, 950, 400] }], chartCategories: ['8AM', '10AM', '12PM', '2PM', '4PM', '6PM'] },
    '7D': { kpi: { gmv: '$32,100.00', orders: '840', conversion: '2.8%', aov: '$38.21' }, chartData: [{ name: 'Revenue', data: [4200, 5100, 3800, 6200, 4900, 5800, 2100] }], chartCategories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] },
    'Month': { kpi: { gmv: '$124,592.00', orders: '1,842', conversion: '3.24%', aov: '$67.63' }, chartData: [{ name: 'Revenue', data: [45000, 52000, 38000, 65000, 48000, 59000, 72000, 41000, 55000, 49000, 61000, 85000] }], chartCategories: ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'] },
    'Quarter': { kpi: { gmv: '$385,400.00', orders: '5,120', conversion: '4.1%', aov: '$75.27' }, chartData: [{ name: 'Revenue', data: [110000, 135000, 140400] }], chartCategories: ['Q1', 'Q2', 'Q3'] }
};

const mockDataProduct = {
    'Shirts': { bar: [15200, 10800, 14500, 8200], donut: [62, 24, 14] },
    'Pants': { bar: [18000, 12000, 9500, 6000], donut: [45, 35, 20] },
    'Shoes': { bar: [25000, 15000, 22000, 11000], donut: [75, 15, 10] },
    'Accessories': { bar: [5000, 8000, 4000, 3000], donut: [30, 40, 30] },
    'All Genders': { bar: [15200, 10800, 14500, 8200], donut: [62, 24, 14] },
    'Men': { bar: [12000, 8000, 10000, 6000], donut: [50, 30, 20] },
    'Women': { bar: [11000, 14000, 9000, 5000], donut: [40, 40, 20] },
    'Unisex': { bar: [8000, 5000, 6000, 3000], donut: [20, 50, 30] }
};


const mockDataInsights = {
    '7D': { kpi: { ltv: '$480.50', newCus: '750', retention: '69.1%', ordersPerCus: '1.1' }, regionalBar: [1200, 950, 700, 500, 350], newReturningDonut: [68, 32], donutValues: ['850', '350'] },
    '30D': { kpi: { ltv: '$482.15', newCus: '2,840', retention: '68.4%', ordersPerCus: '3.2' }, regionalBar: [5400, 4200, 3100, 2200, 1500], newReturningDonut: [65, 35], donutValues: ['4,120', '2,245'] },
    '90D': { kpi: { ltv: '$495.20', newCus: '8,100', retention: '65.2%', ordersPerCus: '7.5' }, regionalBar: [15500, 12000, 9500, 7000, 4800], newReturningDonut: [62, 38], donutValues: ['12,400', '7,600'] },
    'All Time': { kpi: { ltv: '$512.00', newCus: '24,500', retention: '60.5%', ordersPerCus: '14.2' }, regionalBar: [45000, 38000, 29000, 21000, 15000], newReturningDonut: [55, 45], donutValues: ['35,200', '28,800'] }
};

const mockDataInventory = {
    'Next 7 Days': { kpi: { daysOfSupply: '7', replenishment: '$15.2k' }, stockVsDemand: { stock: [150, 180, 160, 140, 170, 190], demand: [180, 200, 190, 170, 190, 210] } },
    'Next 30 Days': { kpi: { daysOfSupply: '24', replenishment: '$38.5k' }, stockVsDemand: { stock: [380, 410, 390, 350, 400, 370], demand: [450, 480, 460, 420, 490, 450] } },
    'Next 90 Days': { kpi: { daysOfSupply: '65', replenishment: '$110.2k' }, stockVsDemand: { stock: [1100, 1250, 1150, 1050, 1300, 1200], demand: [1350, 1450, 1380, 1280, 1500, 1420] } },
    'Custom': { kpi: { daysOfSupply: '18', replenishment: '$42.4k' }, stockVsDemand: { stock: [420, 310, 380, 210, 250, 180], demand: [510, 390, 420, 480, 420, 390] } }
};

let charts = {};

document.addEventListener('DOMContentLoaded', () => {
    
    if (document.querySelector('#revenueChart')) initOverviewCharts();
    if (document.querySelector('#productRevenueChart')) initProductCharts();
    if (document.querySelector('#regionalChart')) initInsightsCharts();
    if (document.querySelector('#stockDemandChart')) initInventoryCharts();

    const filterGroups = document.querySelectorAll('.time-filter, .category-filter, .pill-nav');
    filterGroups.forEach(group => {
        const buttons = group.querySelectorAll('button');
        buttons.forEach(btn => {
            btn.addEventListener('click', function() {
                buttons.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                
                const filterValue = this.textContent.trim();

                const datePicker = document.querySelector('.date-picker-group');
                if (datePicker) {
                    if (filterValue === 'Custom') datePicker.classList.remove('hidden');
                    else datePicker.classList.add('hidden');
                }

                if (document.querySelector('#revenueChart')) updateOverviewData(filterValue);
                if (document.querySelector('#productRevenueChart') && this.closest('.category-filter')) updateProductData(filterValue);
                if (document.querySelector('#regionalChart')) updateInsightsData(filterValue);
                if (document.querySelector('#stockDemandChart')) updateInventoryData(filterValue);
            });
        });
    });

    const genderSelect = document.querySelector('.gender-filter');
    if (genderSelect) {
        genderSelect.addEventListener('change', function() {
            updateProductData(this.value);
        });
    }

    const datePickerOnLoad = document.querySelector('.date-picker-group');
    const customBtnActive = document.querySelector('.pill-nav button.active');
    if (datePickerOnLoad && customBtnActive && customBtnActive.textContent.trim() !== 'Custom') {
        datePickerOnLoad.classList.add('hidden');
    }
});

//Tạo và cập nhật biểu đồ

function initOverviewCharts() { 
    const options = { series: mockDataOverview['Month'].chartData, chart: { type: 'bar', height: 300, width: '100%', toolbar: { show: false }, fontFamily: 'inherit' }, plotOptions: { bar: { borderRadius: 4, columnWidth: '70%' } }, colors: ['#3B82F6'], dataLabels: { enabled: false }, xaxis: { categories: mockDataOverview['Month'].chartCategories, axisBorder: { show: false }, axisTicks: { show: false }, labels: { style: { colors: '#94A3B8', fontSize: '10px', fontWeight: 600 } } }, yaxis: { show: false }, grid: { show: false } };
    charts.overview = new ApexCharts(document.querySelector("#revenueChart"), options); charts.overview.render();
}
function updateOverviewData(filterType) {
    const data = mockDataOverview[filterType]; if (!data) return;
    const kpis = document.querySelectorAll('.kpi-card .kpi-value');
    if (kpis.length >= 4) { kpis[0].textContent = data.kpi.gmv; kpis[1].textContent = data.kpi.orders; kpis[2].textContent = data.kpi.conversion; kpis[3].textContent = data.kpi.aov; }
    if (charts.overview) { charts.overview.updateSeries(data.chartData); charts.overview.updateOptions({ xaxis: { categories: data.chartCategories } }); }
}

function initProductCharts() { 
    const barOptions = { 
        series: [{ name: 'Revenue', data: mockDataProduct['Shirts'].bar }], 
        chart: { 
            type: 'bar', 
            height: 240, 
            width: '100%', 
            parentHeightOffset: 0, 
            toolbar: { show: false }, 
            fontFamily: 'inherit' 
        }, 
        plotOptions: { bar: { borderRadius: 4, columnWidth: '50%' } }, 
        colors: ['#3B82F6'], 
        dataLabels: { enabled: false }, 
        xaxis: { 
            categories: ['RUNNING', 'YOGA', 'GYM', 'FOOTBALL'], 
            axisBorder: { show: false }, 
            axisTicks: { show: false }, 
            labels: { style: { colors: '#94A3B8', fontSize: '10px', fontWeight: 600 } } 
        }, 
        yaxis: { 
            labels: { formatter: (val) => "$" + val / 1000 + "K", style: { colors: '#94A3B8', fontSize: '10px' } } 
        }, 
        
        grid: { 
            borderColor: '#F1F5F9', 
            strokeDashArray: 4,
            padding: { top: 0, right: 0, bottom: 0, left: 10 } 
        } 
    };
    charts.productBar = new ApexCharts(document.querySelector("#productRevenueChart"), barOptions); charts.productBar.render();
    
    const donutOptions = { series: mockDataProduct['Shirts'].donut, labels: ['Wrong Size', 'Color Mismatch', 'Fabric Defect'], chart: { type: 'donut', height: 220, width: '100%', fontFamily: 'inherit' }, colors: ['#3B82F6', '#93C5FD', '#E2E8F0'], plotOptions: { pie: { donut: { size: '75%', labels: { show: true, name: { show: true, fontSize: '10px', color: '#64748B', offsetY: 20 }, value: { show: true, fontSize: '24px', fontWeight: 700, color: '#0F172A', offsetY: -10, formatter: (val) => val + "%" }, total: { show: true, showAlways: true, label: 'TOTAL RATE', color: '#64748B', fontSize: '10px', formatter: function (w) { return w.globals.seriesTotals[0] + "%" } } } } } }, dataLabels: { enabled: false }, stroke: { show: false }, legend: { show: false } };
    charts.productDonut = new ApexCharts(document.querySelector("#returnReasonsChart"), donutOptions); charts.productDonut.render();
}
function updateProductData(filterType) {
    const data = mockDataProduct[filterType]; if (!data) return;
    if (charts.productBar) charts.productBar.updateSeries([{ name: 'Revenue', data: data.bar }]);
    if (charts.productDonut) charts.productDonut.updateSeries(data.donut);

    const valWrongSize = document.getElementById('val-wrong-size');
    const valColor = document.getElementById('val-color');
    const valFabric = document.getElementById('val-fabric');
    if (valWrongSize && valColor && valFabric) {
        valWrongSize.textContent = data.donut[0] + "%";
        valColor.textContent = data.donut[1] + "%";
        valFabric.textContent = data.donut[2] + "%";
    }
}

//Customer Insight page functions
function initInsightsCharts() {
    const regionalOptions = { series: 
        [{ name: 'Orders', data: mockDataInsights['30D'].regionalBar }], 
        chart: { type: 'bar', height: 240, 
            width: '100%', toolbar: { show: false }, 
            fontFamily: 'inherit' }, 
            plotOptions: { bar: { borderRadius: 4, columnWidth: '80%', distributed: true } }, 
            colors: ['#2563EB', '#3B82F6', '#60A5FA', '#93C5FD', '#E2E8F0'], 
            dataLabels: { enabled: false }, 
            xaxis: { categories: ['New York', 'California', 'Texas', 'Florida', 'Others'], 
                axisBorder: { show: false }, axisTicks: { show: false }, 
                labels: { style: { colors: '#94A3B8', fontSize: '11px', fontWeight: 500 } } }, 
                yaxis: { show: false }, grid: { show: false }, legend: { show: false } };
    charts.insightsBar = new ApexCharts(document.querySelector("#regionalChart"), regionalOptions); charts.insightsBar.render();

    const donutOptions = 
    { series: mockDataInsights['30D'].newReturningDonut, 
        labels: ['Returning Customers', 'New Customers'], 
        chart: { type: 'donut', height: 220, width: '100%', fontFamily: 'inherit' }, 
        colors: ['#3B82F6', '#E2E8F0'], 
        plotOptions: 
        { pie: 
            { donut: 
                { size: '75%', labels: 
                    { show: true, name: 
                        { show: true, fontSize: '10px', color: '#64748B', offsetY: 20 },
                         value: 
                         { show: true, fontSize: '28px', fontWeight: 700, 
                            color: '#0F172A', offsetY: -10, 
                            formatter: (val) => val + "%" }, 
                            total: { show: true, showAlways: true, 
                                label: 'RETURNING', color: '#64748B', 
                                fontSize: '10px', formatter: function (w) 
                                { return w.globals.seriesTotals[0] + "%" } } } } } }, 
                                dataLabels: { enabled: false }, stroke: { show: false },
                                legend: { show: false } // Đã tắt Legend mặc định
    };
    charts.insightsDonut = new ApexCharts(document.querySelector("#newReturningChart"), 
    donutOptions); charts.insightsDonut.render();
}

function updateInsightsData(filterType) {
    const data = mockDataInsights[filterType]; if (!data) return;
    const kpis = document.querySelectorAll('.card .kpi-value');
    if (kpis.length >= 4) { kpis[0].textContent = data.kpi.ltv; kpis[1].textContent = data.kpi.newCus; kpis[2].textContent = data.kpi.retention; kpis[3].textContent = data.kpi.ordersPerCus; }
    
    if (charts.insightsBar) charts.insightsBar.updateSeries([{ name: 'Orders', data: data.regionalBar }]);
    if (charts.insightsDonut) charts.insightsDonut.updateSeries(data.newReturningDonut);

    // Cập nhật giá trị hiển thị cho Custom Legend
    const valReturning = document.getElementById('val-returning');
    const valNew = document.getElementById('val-new');
    
    if (valReturning && valNew) {
        valReturning.textContent = data.donutValues[0];
        valNew.textContent = data.donutValues[1];
    }
}

//Inventory page functions
function initInventoryCharts() {
    const options = { series: [ { name: 'Current Stock', data: mockDataInventory['Custom'].stockVsDemand.stock }, { name: 'Projected Demand', data: mockDataInventory['Custom'].stockVsDemand.demand } ], chart: { type: 'bar', height: 240, width: '100%', toolbar: { show: false }, fontFamily: 'inherit' }, plotOptions: { bar: { borderRadius: 4, columnWidth: '70%', dataLabels: { position: 'top' } } }, colors: ['#3B82F6', '#DBEAFE'], dataLabels: { enabled: false }, stroke: { show: true, width: 2, colors: ['transparent'] }, xaxis: { categories: ['SEP', 'OCT', 'NOV', 'DEC', 'JAN', 'FEB'], axisBorder: { show: false }, axisTicks: { show: false }, labels: { style: { colors: '#94A3B8', fontSize: '10px', fontWeight: 600 } } }, yaxis: { show: false }, grid: { show: false }, legend: { show: false } };
    charts.inventoryChart = new ApexCharts(document.querySelector("#stockDemandChart"), options); charts.inventoryChart.render();
}
function updateInventoryData(filterType) {
    const data = mockDataInventory[filterType]; if (!data) return;
    const supplyElement = document.querySelector('.grid-3-cols .card:nth-child(1) span[style*="font-size: 28px"]');
    const replenishmentElement = document.querySelector('.grid-3-cols .card:nth-child(3) span[style*="font-size: 28px"]');
    if (supplyElement) supplyElement.textContent = data.kpi.daysOfSupply + ' Days';
    if (replenishmentElement) replenishmentElement.textContent = data.kpi.replenishment;
    if (charts.inventoryChart) { charts.inventoryChart.updateSeries([ { name: 'Current Stock', data: data.stockVsDemand.stock }, { name: 'Projected Demand', data: data.stockVsDemand.demand } ]); }
}

