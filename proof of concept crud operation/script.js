// ===============================
// Product Data Management Section
// ===============================

// This key will be used to store and retrieve products from localStorage
const STORAGE_KEY = 'clothing_store_products';

// This function gets the product list from localStorage, or returns an empty array if none exist
function getProducts() {
    // Try to get the products from localStorage
    const productsJSON = localStorage.getItem(STORAGE_KEY);
    // If products exist, parse and return them; otherwise, return an empty array
    return productsJSON ? JSON.parse(productsJSON) : [];
}

// This function saves the product list to localStorage
function saveProducts(products) {
    // Convert the products array to a JSON string and save it
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
}

// This function generates a unique ID for each product
function generateId() {
    // Use current timestamp and a random number to reduce chance of duplicates
    return Date.now().toString() + Math.floor(Math.random() * 1000).toString();
}

// ===============================
// Main Shop Page Logic (index.html)
// ===============================

// This function renders the product grid on the main shop page
function renderProductGrid() {
    // Find the product grid container
    const grid = document.getElementById('product-grid');
    if (!grid) return; // If not on index.html, do nothing

    // Get the list of products
    const products = getProducts();

    // If there are no products, show a message
    if (products.length === 0) {
        grid.innerHTML = '<p>No products available. Please check back later!</p>';
        return;
    }

    // Build the HTML for each product card
    grid.innerHTML = products.map(product => `
        <div class="product-card">
            <img src="${product.image}" alt="${product.name}">
            <h3>${product.name}</h3>
            <div class="price">$${Number(product.price).toFixed(2)}</div>
            <p>${product.description}</p>
        </div>
    `).join('');
}

// ===============================
// Admin Panel Logic (admin.html)
// ===============================

// This function renders the products table in the admin panel
function renderProductsTable() {
    // Find the table body where products will be listed
    const tableBody = document.querySelector('#products-table tbody');
    if (!tableBody) return; // If not on admin.html, do nothing

    // Get the list of products
    const products = getProducts();

    // If there are no products, show a message
    if (products.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="5">No products found.</td></tr>';
        return;
    }

    // Build the HTML for each product row
    tableBody.innerHTML = products.map(product => `
        <tr>
            <td>${product.name}</td>
            <td>$${Number(product.price).toFixed(2)}</td>
            <td><img src="${product.image}" alt="${product.name}"></td>
            <td>${product.description}</td>
            <td>
                <button class="edit-btn" data-id="${product.id}">Edit</button>
                <button class="delete-btn" data-id="${product.id}">Delete</button>
            </td>
        </tr>
    `).join('');
}

// This function resets the product form to its default state
function resetForm() {
    document.getElementById('product-id').value = '';
    document.getElementById('product-name').value = '';
    document.getElementById('product-price').value = '';
    document.getElementById('product-image').value = '';
    document.getElementById('product-description').value = '';
    document.getElementById('save-btn').textContent = 'Save Product';
    document.getElementById('cancel-btn').style.display = 'none';
}

// This function fills the form with a product's data for editing
function fillForm(product) {
    document.getElementById('product-id').value = product.id;
    document.getElementById('product-name').value = product.name;
    document.getElementById('product-price').value = product.price;
    document.getElementById('product-image').value = product.image;
    document.getElementById('product-description').value = product.description;
    document.getElementById('save-btn').textContent = 'Update Product';
    document.getElementById('cancel-btn').style.display = 'inline-block';
}

// This function handles form submission for creating or updating a product
function handleFormSubmit(event) {
    event.preventDefault(); // Prevent the page from reloading

    // Get form values
    const id = document.getElementById('product-id').value;
    const name = document.getElementById('product-name').value.trim();
    const price = document.getElementById('product-price').value;
    const image = document.getElementById('product-image').value.trim();
    const description = document.getElementById('product-description').value.trim();

    // Get the current list of products
    let products = getProducts();

    if (id) {
        // If an ID exists, update the existing product
        products = products.map(product =>
            product.id === id ? { id, name, price, image, description } : product
        );
    } else {
        // Otherwise, create a new product with a unique ID
        products.push({
            id: generateId(),
            name,
            price,
            image,
            description
        });
    }

    // Save the updated product list
    saveProducts(products);
    // Refresh the table
    renderProductsTable();
    // Reset the form
    resetForm();
}

// This function handles clicking the Edit or Delete buttons in the products table
function handleTableClick(event) {
    const target = event.target;
    if (target.classList.contains('edit-btn')) {
        // Edit button clicked
        const id = target.getAttribute('data-id');
        const products = getProducts();
        const product = products.find(p => p.id === id);
        if (product) {
            fillForm(product);
        }
    } else if (target.classList.contains('delete-btn')) {
        // Delete button clicked
        const id = target.getAttribute('data-id');
        let products = getProducts();
        // Remove the product with the matching ID
        products = products.filter(p => p.id !== id);
        saveProducts(products);
        renderProductsTable();
        resetForm();
    }
}

// This function initializes the admin panel logic
function initAdminPanel() {
    // Only run if on admin.html
    if (!document.getElementById('admin-section')) return;

    // Render the products table
    renderProductsTable();

    // Set up form submission handler
    document.getElementById('product-form').addEventListener('submit', handleFormSubmit);
    // Set up cancel button handler
    document.getElementById('cancel-btn').addEventListener('click', resetForm);
    // Set up table click handler for edit/delete
    document.getElementById('products-table').addEventListener('click', handleTableClick);
}

// ===============================
// Initialization for Both Pages
// ===============================

document.addEventListener('DOMContentLoaded', function() {
    // Render the product grid if on the main page
    renderProductGrid();
    // Initialize admin panel logic if on admin.html
    initAdminPanel();
}); 