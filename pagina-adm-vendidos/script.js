function switchTab(element, tabName) {
  // Remove active class from all tabs
  document.querySelectorAll(".nav-tab").forEach((tab) => {
    tab.classList.remove("active");
  });

  // Add active class to clicked tab
  element.classList.add("active");

  // Hide all tab contents
  document.querySelectorAll(".tab-content").forEach((content) => {
    content.style.display = "none";
  });

  // Show selected tab content
  document.getElementById(tabName).style.display = "block";
}

function openNewProductModal() {
  document.querySelector(".nav-tab:nth-child(2)").click();
}

// Handle product form submission
document.getElementById("productForm").addEventListener("submit", function (e) {
  e.preventDefault();
  alert("Produto cadastrado com sucesso!");
  this.reset();
});

// Handle edit buttons
document.querySelectorAll(".action-btn.edit").forEach((btn) => {
  btn.addEventListener("click", function () {
    alert("Editar produto");
  });
});

// Handle delete buttons
document.querySelectorAll(".action-btn.delete").forEach((btn) => {
  btn.addEventListener("click", function () {
    if (confirm("Tem certeza que deseja deletar este produto?")) {
      alert("Produto deletado com sucesso!");
    }
  });
});
