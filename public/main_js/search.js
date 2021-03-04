const searchBars = document.querySelectorAll(".search-container");

function searchProduct(e) {
  const search = e.path[2].children[0].value;
  if (!search) return;
  document.cookie = `search=${search};path=/`;
  window.location.href = "/products";
}

searchBars.forEach((bar) => (bar.children[1].onclick = (event) => searchProduct(event)));
