document.addEventListener("DOMContentLoaded", () => {
  const STORAGE_KEY = "miniCRMClients";
  const clientsPerPage = 5;
  let currentPage = 1;

  const tbody = document.getElementById("clientTableBody");
  const content = document.getElementById("content");
  const modal = document.getElementById("editClientModal");
  const closeModalBtn = document.getElementById("closeModalBtn");
  const form = document.getElementById("editClientForm");

  function loadClients() {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) return JSON.parse(data);

    const initialClients = []; // Leave empty now — data gets initialized from dashboard or seed
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialClients));
    return initialClients;
  }

  function saveClients() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(clients));
  }

  let clients = loadClients();

  // UI: Toolbar
  const toolbar = document.createElement("div");
  toolbar.style.display = "flex";
  toolbar.style.justifyContent = "space-between";
  toolbar.style.alignItems = "center";
  toolbar.style.marginBottom = "20px";

  const heading = document.createElement("h1");
  heading.textContent = "Clients";
  heading.style.fontFamily = "'Playfair Display', serif";
  heading.style.fontSize = "30px";
  heading.style.color = "#3c2f2f";

  const addClientBtn = document.createElement("button");
  addClientBtn.textContent = "+ Add Client";
  addClientBtn.className = "add-client-btn";
  addClientBtn.onclick = () => openModal();

  toolbar.appendChild(heading);
  toolbar.appendChild(addClientBtn);
  content.prepend(toolbar);

  // Modal handlers
  closeModalBtn.onclick = () => { modal.style.display = "none"; };
  window.onclick = e => { if (e.target === modal) modal.style.display = "none"; };

  function openModal(client = null) {
    form.reset();
    form.dataset.id = client?.id || "";
    document.getElementById("modalTitle").textContent = client ? "Edit Client" : "Add New Client";

    if (client) {
      form["edit-client-name"].value = client.name;
      form["edit-client-email"].value = client.email;
      form["edit-client-phone"].value = client.phone;
      form["edit-client-location"].value = client.location;
      form["edit-client-status"].value = client.status;
      form["edit-client-priority"].value = client.priority;
      form["edit-client-last-contacted"].value = client.lastContacted;
      form["edit-client-tags"].value = client.tags.join(", ");
      form["edit-client-notes"].value = client.notes;
    }

    modal.style.display = "flex";
  }

  form.onsubmit = e => {
    e.preventDefault();
    const id = form.dataset.id;
    const newData = {
      id: id || String(Date.now()),
      name: form["edit-client-name"].value,
      email: form["edit-client-email"].value,
      phone: form["edit-client-phone"].value,
      location: form["edit-client-location"].value,
      status: form["edit-client-status"].value,
      priority: form["edit-client-priority"].value,
      lastContacted: form["edit-client-last-contacted"].value,
      tags: form["edit-client-tags"].value.split(",").map(t => t.trim()).filter(Boolean),
      notes: form["edit-client-notes"].value
    };

    if (id) {
      const index = clients.findIndex(c => c.id === id);
      clients[index] = newData;
    } else {
      clients.unshift(newData);
    }

    saveClients();
    modal.style.display = "none";
    renderPage();
  };

  function renderPage() {
    tbody.innerHTML = "";
    const totalPages = Math.ceil(clients.length / clientsPerPage);
    const start = (currentPage - 1) * clientsPerPage;
    const end = Math.min(start + clientsPerPage, clients.length);
    const pageClients = clients.slice(start, end);

    pageClients.forEach(client => {
      const tr = document.createElement("tr");
      const fields = [
        client.name, client.email, client.phone, client.location,
        client.status, client.priority, client.lastContacted,
        client.tags.join(", "), client.notes
      ];
      fields.forEach(val => {
        const td = document.createElement("td");
        td.textContent = val || "—";
        tr.appendChild(td);

        if (pageClients.length === 0) {
  const emptyRow = document.createElement("tr");
  const emptyCell = document.createElement("td");
  emptyCell.colSpan = 10;
  emptyCell.style.textAlign = "center";
  emptyCell.style.padding = "20px";
  emptyCell.style.color = "#999";
  emptyCell.textContent = "No clients found.";
  emptyRow.appendChild(emptyCell);
  tbody.appendChild(emptyRow);
}

      });

      const actions = document.createElement("td");
      const editBtn = document.createElement("button");
      editBtn.textContent = "Edit";
      editBtn.className = "edit-btn";
      editBtn.onclick = () => openModal(client);

      const deleteBtn = document.createElement("button");
      deleteBtn.textContent = "Delete";
      deleteBtn.className = "delete-btn";
      deleteBtn.onclick = () => {
        if (confirm(`Delete ${client.name}?`)) {
          const index = clients.findIndex(c => c.id === client.id);
          clients.splice(index, 1);
          saveClients();
          if (currentPage > Math.ceil(clients.length / clientsPerPage)) currentPage--;
          renderPage();
        }
      };

      actions.appendChild(editBtn);
      actions.appendChild(deleteBtn);
      tr.appendChild(actions);
      tbody.appendChild(tr);
    });

    renderPagination(totalPages, start, end);
  }

  function renderPagination(totalPages, start, end) {
    document.getElementById("paginationControls")?.remove();

    const controls = document.createElement("div");
    controls.id = "paginationControls";
    controls.style.marginTop = "1.5rem";
    controls.style.textAlign = "center";

    const recordInfo = document.createElement("div");
    recordInfo.style.marginBottom = "0.5rem";
    recordInfo.textContent = `Showing ${start + 1}–${end} of ${clients.length} clients`;
    controls.appendChild(recordInfo);

    const prev = document.createElement("button");
    prev.textContent = "⬅️ Previous";
    prev.disabled = currentPage === 1;
    prev.onclick = () => { currentPage--; renderPage(); };

    const next = document.createElement("button");
    next.textContent = "Next ➡️";
    next.disabled = currentPage === totalPages;
    next.onclick = () => { currentPage++; renderPage(); };

    controls.appendChild(prev);
    controls.appendChild(document.createTextNode(` Page ${currentPage} of ${totalPages} `));
    controls.appendChild(next);
    content.appendChild(controls);
  }

  renderPage();
});
