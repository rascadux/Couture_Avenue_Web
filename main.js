document.addEventListener('DOMContentLoaded', function() {
  var headerContainer = document.getElementById('header-container');
  

  // Fetch header.html using fetch()
  fetch('header.html')
    .then(function(response) {
      return response.text();
    })
    .then(function(html) {
      // Insert the HTML content into the container element
      headerContainer.innerHTML = html;
    })
    .catch(function(error) {
      console.log('Error fetching header:', error);
    });


  var currentURL = window.location.href;

  // Fetch the product details and generate the product cards for the selected category
  fetch("product_details.json")
    .then(response => response.json())
    .then(data => {
      var mainContainer = document.getElementById("main-container");

      var productWrapper = document.createElement("div");
      productWrapper.className = "product-wrapper";
      mainContainer.appendChild(productWrapper);

      var category = getCategoryFromURL(currentURL);
      var products;
      if (category === 'all') {
        products = data; // Display all products from all categories
      } else {
        products = data.filter(product => product.category === category);
      }
      products.forEach(product => {
        var productCard = document.createElement("div");
        productCard.className = "product-card";

        var imageLink = document.createElement("a"); // Create a link element
        imageLink.href = "product_details.html?id=" + product.id; // Set the href attribute
        productCard.appendChild(imageLink); // Append the link element to the product card

        var image = document.createElement("img");
        image.src = product.image;
        image.alt = product.name;
        imageLink.appendChild(image); // Append the image to the link element

        var name = document.createElement("h3");
        name.textContent = product.name;
        productCard.appendChild(name);

        var price = document.createElement("p");
        price.textContent = "$" + product.price;
        productCard.appendChild(price);

        productWrapper.appendChild(productCard);
      });
    });
  
  var productContainer = document.querySelector('.product-container');
  var urlParams = new URLSearchParams(window.location.search);
  var productId = urlParams.get('id');

  // Fetch product details from product_details.json
  fetch('product_details.json')
    .then(function(response) {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(function(data) {
      console.log('Retrieved product data:', data);

      var product = data.find(function(item) {
        return item.id === parseInt(productId);
      });

      if (!product) {
        throw new Error('Product not found');
      }

      var html = `
        <div class="product-details">
          <img src="${product.image}" alt="${product.name}">
          <h2>${product.name}</h2>
          <p>Material: ${product.material}</p>
          <p>Price: ${product.price.toFixed(2)}€</p>
          <p>Description: ${product.description}</p>
        </div>
      `;

      productContainer.innerHTML = html;
    })
    .catch(function(error) {
      console.log('Error fetching product details:', error);
    });

    
  // Event listener for best-sellers products
  var bestSellers = document.querySelectorAll('.best-seller');
  bestSellers.forEach(function(product) {
    product.addEventListener('click', function() {
      var productId = product.getAttribute('data-id');
      window.location.href = 'product_details.html?id=' + productId;
    });
  });

  

  // Custom Bootstrap validation
  (function() {
    'use strict'

    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    var forms = document.querySelectorAll('.needs-validation')

    // Loop over them and prevent submission
    Array.prototype.slice.call(forms)
      .forEach(function(form) {
        form.addEventListener('submit', function(event) {
          if (!form.checkValidity()) {
            event.preventDefault()
            event.stopPropagation()
          }

          form.classList.add('was-validated')
        }, false)
      })
  })();
  
  function getCategoryFromURL(url) {
    var urlParts = url.split('/');
    var filename = urlParts[urlParts.length - 1];
    var category = filename.split('.')[0]; // Extract the category from the filename
    return category;
  }

  function updateDateTime() {
    var now = new Date();
    var date = now.toLocaleDateString();
    var time = now.toLocaleTimeString();
    document.getElementById('current-date-time').textContent = date + ' ' + time;
  }

  updateDateTime(); // Call this function to update the date and time when the page loads
  setInterval(updateDateTime, 1000);

  function updateCountdown() {
    var now = new Date();

    // Set the 'happy hour' to be at 6pm today
    var happyHour = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 18, 0, 0);

    // If it's already past 6pm, set the 'happy hour' to be at 6pm tomorrow
    if (now > happyHour) {
      happyHour.setDate(happyHour.getDate() + 1);
    }

    // Calculate the number of hours, minutes and seconds to the 'happy hour'
    var diff = happyHour - now; // Difference in milliseconds
    var hours = Math.floor(diff / (1000 * 60 * 60));
    var minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((diff % (1000 * 60)) / 1000);

    // Update the countdown
    document.getElementById('countdown').textContent = 
      'Happy Hour in ' + hours + ' hours ' + minutes + ' minutes ' + seconds + ' seconds!!!';
  }

  updateCountdown(); // Call this function to update the countdown when the page loads
  setInterval(updateCountdown, 1000); // Update the countdown every second

  var addProductForm = document.getElementById('add-product-form');
  if (addProductForm) {
    addProductForm.addEventListener('submit', function(event) {
      event.preventDefault();
  
    var name = document.getElementById('name').value;
    var description = document.getElementById('description').value;
    var price = document.getElementById('price').value;
    var category = document.getElementById('category').value;
    var material = document.getElementById('material').value;

    var product = { 
        name: name, 
        description: description, 
        price: price,
        category: category,
        material: material,
    };

    fetch('/add_product', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(product)
    }).then(response => response.json())
    .then(data => {
        if(data.success){
            alert("Product added successfully!");
        } else {
            alert("Something went wrong!");
        }
    }).catch(error => console.log('Error:', error));
  });
  }

  fetch('product_details.json')
  .then(response => response.json())
  .then(data => {
    const tableBody = document.getElementById('product-table-body');

    data.forEach(product => {
      const row = document.createElement('tr');

      row.innerHTML = `
        <td>${product.id}</td>
        <td><img src="${product.image}" alt="Product image" style="width: 50px; height: auto;"></td>
        <td>${product.name}</td>
        <td>${product.material}</td>
        <td>${product.price}</td>
        <td>${product.description}</td>
        <td>${product.category}</td>
      `;

      tableBody.appendChild(row);

    });
  });

var loginForm = document.querySelector('.login-validation');
if (loginForm) {
  loginForm.addEventListener('submit', function(event) {
    event.preventDefault();

    if (!this.checkValidity()) {
      event.stopPropagation();
    } else {
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;

      fetch('/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      }).then(response => {
        if (response.status === 401) {
          alert('Invalid email or password');
          return;
        }
        return response.json();
      }).then(data => {
        if (data && data.success) {
          sessionStorage.setItem('userId', data.userId);
          alert('Login successful');
        }
      }).catch(error => console.log('Error:', error));
    }

    this.classList.add('was-validated');
  }, false);
}


  const togglePassword = document.getElementById('togglePassword');
  const passwordInput = document.getElementById('password');

  if(togglePassword && passwordInput){
    togglePassword.addEventListener('click', function () {
      if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        togglePassword.innerHTML = '<i class="bi bi-eye"></i>';
      } else {
        passwordInput.type = 'password';
        togglePassword.innerHTML = '<i class="bi bi-eye-slash"></i>';
      }
    });
  }

  
});
