const searchBars = document.querySelectorAll(".search-container");

//remove href tag
searchBars.forEach(form => {
  const el = form.children[1];
  if(el.tagName.toLowerCase() === 'a'){ 
     el.removeAttribute('href');
  }
})

function searchProduct(e) {
  const search = e.path[2].children[0].value;
  if (!search) return;
  document.cookie = `search=${search};path=/`;
  window.location.href = "/products";
}

searchBars.forEach((bar) => (bar.children[1].onclick = (event) => searchProduct(event)));