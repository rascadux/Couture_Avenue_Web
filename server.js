const express = require('express');
const fs = require('fs');
const app = express();
const bodyParser = require('body-parser');
const port = 3000;

// to support JSON-encoded bodies
app.use(bodyParser.json());

// to support URL-encoded bodies
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(express.static(__dirname));

app.listen(port, () => console.log(`App listening at http://localhost:${port}`));

const users = [
    { id: 1, email: 'dani@gmail.com', password: 'password' }
  ];
  
app.post('/login', (req, res) => {
    const { email, password } = req.body;
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
        res.json({ success: true, message: "User Logged In", userId: user.id });
    } else {
        res.status(401).json({ success: false, message: "Invalid Email or Password" });
    }
});


app.post('/add_product', (req, res) => {
    const product = req.body;

    if (!product.name || !product.description || !product.price || !product.category || !product.material) {
        // If not, respond with an error
        res.status(400).json({ success: false, message: "All fields are required." });
        return;
      }

    fs.readFile('./product_details.json', 'utf8', (err, data) => {
        if (err) {
            console.log('Error reading file:', err);
            return res.status(500).json({ success: false, message: 'Error reading file' });
        }
        
        var products = JSON.parse(data);

        var newId = products.reduce((maxId, product) => Math.max(product.id, maxId), 0) + 1; // Generate new id

        var newProduct = {
            id: newId,
            image: "/gallery/bottom1.webp",
            ...product
        };

        products.push(newProduct);

        fs.writeFile('./product_details.json', JSON.stringify(products, null, 2), 'utf8', (err) => {
            if (err) {
                console.log('Error writing file:', err);
                return res.status(500).json({ success: false, message: 'Error writing file' });
            }
            console.log('Added new product:', newProduct);
            res.json({ success: true, message: 'Product added successfully' });
        });
    });
});








  
  