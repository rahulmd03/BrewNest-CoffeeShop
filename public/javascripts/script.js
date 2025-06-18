
function addToCart(prodId) {
    fetch(`/add-to-cart/${prodId}`)
        .then(res => res.json())
        .then(data => {
            if (data.status) {
                document.getElementById('cart-count').innerText = data.cartCount;
            }
        });
}



  function changeQuantity(productId, count) {
    fetch('/change-product-quantity', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ productId, count })
    }).then(response => response.json())
      .then(data => {
        if (data.status) {
          location.reload();
        }
      }).catch(err => {
        console.error("Change Quantity Error:", err);
      });
  }



document.addEventListener('DOMContentLoaded', function () {
    const menuBtn = document.getElementById('menu-btn');
    const navbar = document.querySelector('.navbar');

    menuBtn.addEventListener('click', () => {
        navbar.classList.toggle('active');
        menuBtn.classList.toggle('active');
    });
});



document.addEventListener('DOMContentLoaded', function () {
    const menuContainer = document.querySelector('.menu .box-container');
    const boxes = menuContainer.querySelectorAll('.box'); 
    const showCount = 4;

    boxes.forEach((box, index) => {
        if (index >= showCount) {
            box.classList.add('extra');
            box.style.display = 'none';
        }
    });
});

function showMore() {
    const extras = document.querySelectorAll('.menu .box-container .box.extra');
    extras.forEach(box => box.style.display = 'block');

    document.querySelector('.view-more-btn').style.display = 'none';
    document.querySelector('.view-less-btn').style.display = 'inline-block';
}

function showLess() {
    const extras = document.querySelectorAll('.menu .box-container .box.extra');
    extras.forEach(box => box.style.display = 'none');

    document.querySelector('.view-more-btn').style.display = 'inline-block';
    document.querySelector('.view-less-btn').style.display = 'none';

    window.scrollTo({
        top: document.getElementById('menu').offsetTop,
        behavior: 'smooth'
    });
}

