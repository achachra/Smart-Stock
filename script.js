// Event Listeners
document.getElementById('productForm').addEventListener('submit', addProduct);
document.getElementById('clearAll').addEventListener('click', clearAllProducts);
document.getElementById('sortOptions').addEventListener('change', displayProducts);
document.getElementById('testDataButton').addEventListener('click', generateTestData);
document.getElementById('searchProduct').addEventListener('input', searchProducts);

// Add product to localStorage
function addProduct(e) {
    e.preventDefault();

    const productType = document.getElementById('productType').value;
    const productName = document.getElementById('productName').value.trim();
    const productQuantity = parseInt(document.getElementById('productQuantity').value);
    const expiryDate = document.getElementById('expiryDate').value;
    const productDetails = document.getElementById('productDetails').value.trim();

    if (!productType || !productName || !expiryDate || productQuantity <= 0) {
        alert("Please fill out all required fields correctly.");
        return;
    }

    const daysLeft = calculateDaysLeft(expiryDate);
    const status = categorizeProduct(daysLeft);

    let products = JSON.parse(localStorage.getItem('products')) || [];
    if (products.some(product => product.name === productName)) {
        alert('A product with this name already exists!');
        return;
    }

    products.push({
        type: productType,
        name: productName,
        quantity: productQuantity,
        expiry: expiryDate,
        details: productDetails,
        status: status.category
    });

    localStorage.setItem('products', JSON.stringify(products));
    document.getElementById('productForm').reset();
    displayProducts();
}

// Display products (all products or critical action required based on condition)
function displayProducts() {
    const productList = document.getElementById('productList');
    productList.innerHTML = '';

    let products = JSON.parse(localStorage.getItem('products')) || [];
    const sortOption = document.getElementById('sortOptions').value;

    // Sorting based on selected sort option
    if (sortOption === 'timeLeft') {
        products.sort((a, b) => calculateDaysLeft(a.expiry) - calculateDaysLeft(b.expiry));
    } else if (sortOption === 'itemType') {
        products.sort((a, b) => a.type.localeCompare(b.type));
    }

    // If "Test Data" button was clicked, show only "Critical Action Required" products
    let showCriticalOnly = localStorage.getItem('showCriticalOnly') === 'true';

    // Show only Critical Action Required products if flag is set, otherwise show all products
    products.forEach((product, index) => {
        const daysLeft = calculateDaysLeft(product.expiry);
        const status = categorizeProduct(daysLeft);

        // If "Test Data" was clicked, only show critical products
        if (showCriticalOnly && status.category !== 'Expiring Soon') {
            return; // Skip non-critical products
        }

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${product.type}</td>
            <td>${product.name}</td>
            <td>${product.quantity}</td>
            <td>${product.expiry}</td>
            <td class="${status.className}">${formatDays(daysLeft)}</td>
            <td>${status.message}</td>
            <td>${daysLeft <= 15 ? 'Yes' : 'No'}</td>
            <td>
                <button onclick="editProduct(${index})">Edit</button>
                <button onclick="deleteProduct(${index})" class="danger-button">Delete</button>
            </td>
        `;

        // Add the status class to the row directly
        tr.classList.add(status.className);
        productList.appendChild(tr);
    });
}

// Generate test data
function generateTestData() {
    const testProducts = [
        { type: 'Food Item', name: 'Bread', quantity: 10, expiry: generateExpiryDate(120), details: '' },
        { type: 'Medicine', name: 'Aspirin', quantity: 5, expiry: generateExpiryDate(10), details: '' },
        { type: 'Grocery Item', name: 'Milk', quantity: 20, expiry: generateExpiryDate(30), details: '' },
        { type: 'Food Item', name: 'Cheese', quantity: 15, expiry: generateExpiryDate(90), details: '' },
        { type: 'Food Item', name: 'Tomato', quantity: 8, expiry: generateExpiryDate(50), details: '' },
        { type: 'Food Item', name: 'Apple', quantity: 20, expiry: generateExpiryDate(15), details: '' },
        { type: 'Grocery Item', name: 'Sugar', quantity: 50, expiry: generateExpiryDate(45), details: '' },
        { type: 'Food Item', name: 'Rice', quantity: 100, expiry: generateExpiryDate(180), details: '' },
        { type: 'Medicine', name: 'Paracetamol', quantity: 30, expiry: generateExpiryDate(5), details: '' },
        { type: 'Grocery Item', name: 'Salt', quantity: 200, expiry: generateExpiryDate(60), details: '' },
        { type: 'Food Item', name: 'Carrot', quantity: 10, expiry: generateExpiryDate(90), details: '' },
        { type: 'Grocery Item', name: 'Lentils', quantity: 15, expiry: generateExpiryDate(120), details: '' },
        { type: 'Medicine', name: 'Ibuprofen', quantity: 25, expiry: generateExpiryDate(20), details: '' },
        { type: 'Food Item', name: 'Potatoes', quantity: 40, expiry: generateExpiryDate(60), details: '' },
        { type: 'Grocery Item', name: 'Flour', quantity: 50, expiry: generateExpiryDate(150), details: '' },
        { type: 'Food Item', name: 'Banana', quantity: 30, expiry: generateExpiryDate(10), details: '' },
        { type: 'Medicine', name: 'Cough Syrup', quantity: 40, expiry: generateExpiryDate(15), details: '' },
        { type: 'Grocery Item', name: 'Tomato Paste', quantity: 25, expiry: generateExpiryDate(45), details: '' },
        { type: 'Food Item', name: 'Onions', quantity: 10, expiry: generateExpiryDate(75), details: '' },
        { type: 'Food Item', name: 'Cucumber', quantity: 18, expiry: generateExpiryDate(30), details: '' },
        { type: 'Grocery Item', name: 'Chickpeas', quantity: 40, expiry: generateExpiryDate(180), details: '' },
        { type: 'Food Item', name: 'Spinach', quantity: 20, expiry: generateExpiryDate(7), details: '' },
        { type: 'Medicine', name: 'Vitamins', quantity: 60, expiry: generateExpiryDate(120), details: '' },
        { type: 'Grocery Item', name: 'Oats', quantity: 80, expiry: generateExpiryDate(210), details: '' },
        { type: 'Food Item', name: 'Pineapple', quantity: 10, expiry: generateExpiryDate(40), details: '' },
        { type: 'Grocery Item', name: 'Olive Oil', quantity: 12, expiry: generateExpiryDate(200), details: '' },
        { type: 'Food Item', name: 'Cabbage', quantity: 12, expiry: generateExpiryDate(55), details: '' },
        { type: 'Medicine', name: 'Antibiotics', quantity: 50, expiry: generateExpiryDate(25), details: '' },
        { type: 'Grocery Item', name: 'Pasta', quantity: 100, expiry: generateExpiryDate(190), details: '' },
        { type: 'Food Item', name: 'Avocado', quantity: 25, expiry: generateExpiryDate(5), details: '' },
        { type: 'Medicine', name: 'Cold Medicine', quantity: 10, expiry: generateExpiryDate(35), details: '' },
        { type: 'Food Item', name: 'Lettuce', quantity: 50, expiry: generateExpiryDate(10), details: '' },
        { type: 'Grocery Item', name: 'Cereal', quantity: 30, expiry: generateExpiryDate(60), details: '' },
        { type: 'Food Item', name: 'Eggplant', quantity: 15, expiry: generateExpiryDate(100), details: '' },
        { type: 'Medicine', name: 'Eye Drops', quantity: 25, expiry: generateExpiryDate(45), details: '' },
        { type: 'Grocery Item', name: 'Honey', quantity: 50, expiry: generateExpiryDate(210), details: '' },
        { type: 'Food Item', name: 'Strawberries', quantity: 8, expiry: generateExpiryDate(10), details: '' },
        { type: 'Food Item', name: 'Blueberries', quantity: 10, expiry: generateExpiryDate(20), details: '' },
        { type: 'Grocery Item', name: 'Quinoa', quantity: 25, expiry: generateExpiryDate(150), details: '' },
        { type: 'Food Item', name: 'Mango', quantity: 12, expiry: generateExpiryDate(20), details: '' },
        { type: 'Food Item', name: 'Papaya', quantity: 10, expiry: generateExpiryDate(60), details: '' },
        { type: 'Grocery Item', name: 'Beans', quantity: 30, expiry: generateExpiryDate(70), details: '' },
        { type: 'Food Item', name: 'Broccoli', quantity: 15, expiry: generateExpiryDate(35), details: '' },
        { type: 'Food Item', name: 'Garlic', quantity: 50, expiry: generateExpiryDate(130), details: '' },
        { type: 'Food Item', name: 'Tomato', quantity: 8, expiry: generateExpiryDate(50), details: '' },
        { type: 'Food Item', name: 'Apple', quantity: 20, expiry: generateExpiryDate(15), details: '' },
        { type: 'Grocery Item', name: 'Sugar', quantity: 50, expiry: generateExpiryDate(45), details: '' },
        { type: 'Food Item', name: 'Rice', quantity: 100, expiry: generateExpiryDate(180), details: '' },
        { type: 'Medicine', name: 'Paracetamol', quantity: 30, expiry: generateExpiryDate(5), details: '' },
        { type: 'Grocery Item', name: 'Salt', quantity: 200, expiry: generateExpiryDate(60), details: '' },
        { type: 'Food Item', name: 'Carrot', quantity: 10, expiry: generateExpiryDate(90), details: '' },
        { type: 'Grocery Item', name: 'Lentils', quantity: 15, expiry: generateExpiryDate(120), details: '' },
        { type: 'Medicine', name: 'Ibuprofen', quantity: 25, expiry: generateExpiryDate(20), details: '' },
        { type: 'Food Item', name: 'Potatoes', quantity: 40, expiry: generateExpiryDate(60), details: '' },
        { type: 'Grocery Item', name: 'Flour', quantity: 50, expiry: generateExpiryDate(150), details: '' },
        { type: 'Food Item', name: 'Banana', quantity: 30, expiry: generateExpiryDate(10), details: '' },
        { type: 'Medicine', name: 'Cough Syrup', quantity: 40, expiry: generateExpiryDate(15), details: '' },
        { type: 'Grocery Item', name: 'Tomato Paste', quantity: 25, expiry: generateExpiryDate(45), details: '' },
        { type: 'Food Item', name: 'Onions', quantity: 10, expiry: generateExpiryDate(75), details: '' },
        { type: 'Food Item', name: 'Cucumber', quantity: 18, expiry: generateExpiryDate(30), details: '' },
        { type: 'Grocery Item', name: 'Chickpeas', quantity: 40, expiry: generateExpiryDate(180), details: '' },
        { type: 'Food Item', name: 'Spinach', quantity: 20, expiry: generateExpiryDate(7), details: '' },
        { type: 'Medicine', name: 'Vitamins', quantity: 60, expiry: generateExpiryDate(120), details: '' },
        { type: 'Grocery Item', name: 'Oats', quantity: 80, expiry: generateExpiryDate(210), details: '' },
        { type: 'Food Item', name: 'Pineapple', quantity: 10, expiry: generateExpiryDate(40), details: '' },
        { type: 'Grocery Item', name: 'Olive Oil', quantity: 12, expiry: generateExpiryDate(200), details: '' },
        { type: 'Food Item', name: 'Cabbage', quantity: 12, expiry: generateExpiryDate(55), details: '' },
        { type: 'Medicine', name: 'Antibiotics', quantity: 50, expiry: generateExpiryDate(25), details: '' },
        { type: 'Grocery Item', name: 'Pasta', quantity: 100, expiry: generateExpiryDate(190), details: '' },
        { type: 'Food Item', name: 'Avocado', quantity: 25, expiry: generateExpiryDate(5), details: '' },
        { type: 'Medicine', name: 'Cold Medicine', quantity: 10, expiry: generateExpiryDate(35), details: '' },
        { type: 'Food Item', name: 'Lettuce', quantity: 50, expiry: generateExpiryDate(10), details: '' },
        { type: 'Grocery Item', name: 'Cereal', quantity: 30, expiry: generateExpiryDate(60), details: '' },
        { type: 'Food Item', name: 'Eggplant', quantity: 15, expiry: generateExpiryDate(100), details: '' },
        { type: 'Medicine', name: 'Eye Drops', quantity: 25, expiry: generateExpiryDate(45), details: '' },
        { type: 'Grocery Item', name: 'Honey', quantity: 50, expiry: generateExpiryDate(210), details: '' },
        { type: 'Food Item', name: 'Strawberries', quantity: 8, expiry: generateExpiryDate(10), details: '' },
        { type: 'Food Item', name: 'Blueberries', quantity: 10, expiry: generateExpiryDate(20), details: '' },
        { type: 'Grocery Item', name: 'Quinoa', quantity: 25, expiry: generateExpiryDate(150), details: '' },
        { type: 'Food Item', name: 'Mango', quantity: 12, expiry: generateExpiryDate(20), details: '' },
        { type: 'Food Item', name: 'Papaya', quantity: 10, expiry: generateExpiryDate(60), details: '' },
        { type: 'Grocery Item', name: 'Beans', quantity: 30, expiry: generateExpiryDate(70), details: '' },
        { type: 'Food Item', name: 'Broccoli', quantity: 15, expiry: generateExpiryDate(35), details: '' },
        { type: 'Food Item', name: 'Garlic', quantity: 50, expiry: generateExpiryDate(130), details: '' },
        { type: 'Food Item', name: 'Lemon', quantity: 40, expiry: generateExpiryDate(80), details: '' },
        { type: 'Medicine', name: 'Pain Reliever', quantity: 15, expiry: generateExpiryDate(60), details: '' },
        { type: 'Food Item', name: 'Peas', quantity: 100, expiry: generateExpiryDate(90), details: '' },
        { type: 'Grocery Item', name: 'Chili Powder', quantity: 70, expiry: generateExpiryDate(150), details: '' },
        { type: 'Grocery Item', name: 'Coconut Oil', quantity: 12, expiry: generateExpiryDate(200), details: '' },
        { type: 'Food Item', name: 'Paprika', quantity: 25, expiry: generateExpiryDate(100), details: '' },
        { type: 'Food Item', name: 'Pomegranate', quantity: 50, expiry: generateExpiryDate(20), details: '' },
        { type: 'Grocery Item', name: 'Mustard', quantity: 25, expiry: generateExpiryDate(30), details: '' },
        { type: 'Medicine', name: 'Antiseptic', quantity: 60, expiry: generateExpiryDate(120), details: '' },
        { type: 'Grocery Item', name: 'Rice Flour', quantity: 30, expiry: generateExpiryDate(90), details: '' },
        { type: 'Food Item', name: 'Zucchini', quantity: 40, expiry: generateExpiryDate(60), details: '' },
        { type: 'Food Item', name: 'Eggs', quantity: 50, expiry: generateExpiryDate(60), details: '' },
        { type: 'Medicine', name: 'Cough Tablets', quantity: 30, expiry: generateExpiryDate(15), details: '' },
        { type: 'Food Item', name: 'Squash', quantity: 10, expiry: generateExpiryDate(45), details: '' },
        { type: 'Grocery Item', name: 'Tomato Sauce', quantity: 50, expiry: generateExpiryDate(100), details: '' },
        { type: 'Grocery Item', name: 'Coconut Milk', quantity: 10, expiry: generateExpiryDate(80), details: '' },
        { type: 'Food Item', name: 'Berries', quantity: 40, expiry: generateExpiryDate(30), details: '' },
        { type: 'Food Item', name: 'Kiwi', quantity: 15, expiry: generateExpiryDate(20), details: '' },
        { type: 'Medicine', name: 'Cold Relief', quantity: 25, expiry: generateExpiryDate(70), details: '' },
        { type: 'Food Item', name: 'Cherries', quantity: 10, expiry: generateExpiryDate(50), details: '' }
    ];

    let products = JSON.parse(localStorage.getItem('products')) || [];

    // Clear existing products before adding test data to avoid duplication
    products = [];

    // Add test products if not already present
    testProducts.forEach(testProduct => {
        const exists = products.some(product => product.name === testProduct.name);
        if (!exists) {
            products.push(testProduct);
        }
    });

    // Store the new list of products
    localStorage.setItem('products', JSON.stringify(products));

    // Set flag to show only critical products after generating test data
    localStorage.setItem('showCriticalOnly', 'true');

    // Display only critical products
    displayProducts();
}

// Categorize product based on expiry date
function categorizeProduct(daysLeft) {
    if (daysLeft < 0) return { category: 'Expired', message: 'Expired', className: 'status-expired' };
    if (daysLeft <= 30) return { category: 'Expiring Soon', message: 'Critical Action Required', className: 'status-critical' };
    if (daysLeft <= 90) return { category: 'Good', message: 'Monitor', className: 'status-monitor' };
    return { category: 'Great', message: 'Good Standing!', className: 'status-good' };
}

// Helper functions for calculating expiry
function calculateDaysLeft(expiryDate) {
    const now = new Date();
    const expiry = new Date(expiryDate);
    return Math.floor((expiry - now) / (1000 * 60 * 60 * 24));
}

function formatDays(daysLeft) {
    return daysLeft >= 0 ? `${daysLeft} days left` : `Expired`;
}

// Function to generate random expiry date
function generateExpiryDate(daysFromNow) {
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + daysFromNow);
    return expiryDate.toISOString().split('T')[0];
}

// Delete product
function deleteProduct(index) {
    let products = JSON.parse(localStorage.getItem('products')) || [];
    products.splice(index, 1);
    localStorage.setItem('products', JSON.stringify(products));
    displayProducts();
}

// Clear all products
function clearAllProducts() {
    localStorage.removeItem('products');
    localStorage.removeItem('showCriticalOnly');
    displayProducts();
}

// Search functionality
function searchProducts() {
    const query = document.getElementById('searchProduct').value.toLowerCase();
    let products = JSON.parse(localStorage.getItem('products')) || [];

    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(query) ||
        product.expiry.includes(query)
    );

    const productList = document.getElementById('productList');
    productList.innerHTML = '';

    filteredProducts.forEach((product, index) => {
        const tr = document.createElement('tr');
        const daysLeft = calculateDaysLeft(product.expiry);
        const status = categorizeProduct(daysLeft);

        tr.innerHTML = `
            <td>${product.type}</td>
            <td>${product.name}</td>
            <td>${product.quantity}</td>
            <td>${product.expiry}</td>
            <td class="${status.className}">${formatDays(daysLeft)}</td>
            <td>${status.message}</td>
            <td>${daysLeft <= 15 ? 'Yes' : 'No'}</td>
            <td>
                <button onclick="editProduct(${index})">Edit</button>
                <button onclick="deleteProduct(${index})" class="danger-button">Delete</button>
            </td>
        `;
        tr.classList.add(status.className);
        productList.appendChild(tr);
    });
}

// Call the function to display all products on page load
window.onload = function() {
    localStorage.removeItem('showCriticalOnly'); // Ensure it shows all products after reload
    displayProducts();
};
