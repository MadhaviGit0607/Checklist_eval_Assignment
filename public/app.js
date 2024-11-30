document.addEventListener("DOMContentLoaded", function() {
  
  const table = document.getElementById("resultsTable");
  const headers = table ? table.getElementsByTagName("th") : [];
  const rows = table ? table.getElementsByTagName("tbody")[0].getElementsByTagName("tr") : [];

  function sortTable(columnIndex, ascending = true) {
    const sortedRows = Array.from(rows).sort(function(rowA, rowB) {
      const cellA = rowA.cells[columnIndex].innerText.toLowerCase();
      const cellB = rowB.cells[columnIndex].innerText.toLowerCase();

      if (ascending) {
        return cellA < cellB ? -1 : cellA > cellB ? 1 : 0;
      } else {
        return cellA < cellB ? 1 : cellA > cellB ? -1 : 0;
      }
    });

    sortedRows.forEach(function(row) {
      table.getElementsByTagName("tbody")[0].appendChild(row);
    });
  }

  Array.from(headers).forEach(function(header, index) {
    let ascending = true;
    header.addEventListener("click", function() {
      // Toggle sorting direction
      ascending = !ascending;
      sortTable(index, ascending);

      Array.from(headers).forEach(function(header) {
        header.classList.remove("sorted-asc", "sorted-desc");
      });
      header.classList.add(ascending ? "sorted-asc" : "sorted-desc");
    });
  });

  const form = document.getElementsByTagName("form")[0];
  if (form) {
    form.addEventListener("submit", function(event) {
      event.preventDefault();

      const valuationFeePaid = document.getElementById("valuationFeePaid").value;
      const isUkResident = document.getElementById("isUkResident").value;
      const riskRating = document.getElementById("riskRating").value;
      const loanRequired = document.getElementById("loanRequired").value;
      const purchasePrice = document.getElementById("purchasePrice").value;

      if (!valuationFeePaid || !isUkResident || !riskRating || !loanRequired || !purchasePrice) {
        alert("Please fill in all the fields.");
        return;
      }

      const formData = {
        valuationFeePaid: valuationFeePaid,
        isUkResident: isUkResident,
        riskRating: riskRating,
        loanRequired: loanRequired,
        purchasePrice: purchasePrice
      };

      fetch("http://localhost:3000/submit", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData) 
      })
        .then((response) =>  response.json())
        .then((data) => {
          console.log('Success',data); 
        })
        .catch((error) => {
          console.error('Error:', error);
        });
      
    });
  }
});
