document.addEventListener("DOMContentLoaded", () => {
  const tbody = document.getElementById("clientTableBody");
  const content = document.getElementById("content");
  const modal = document.getElementById("editClientModal");
  const closeModalBtn = document.getElementById("closeModalBtn");
  const form = document.getElementById("editClientForm");

  const clientsPerPage = 5;
  let currentPage = 1;

  const STORAGE_KEY = "miniCRMClients";

  // DEMO CLIENTS DATA (This will always load if storage empty)
  const demoClients = [
    { id: "1", name: "Alice Johnson", email: "alice@example.com", phone: "555-8675", status: "Lead", tags: ["design", "repeat"], notes: "Notes for Alice." },
    { id: "2", name: "Bob Lee", email: "bob@example.com", phone: "555-7863", status: "Lead", tags: ["vip"], notes: "Notes for Bob." },
    { id: "3", name: "Charlie Lee", email: "charlie@example.com", phone: "555-2537", status: "Active", tags: [], notes: "Notes for Charlie." },
    { id: "4", name: "Diana Lee", email: "diana@example.com", phone: "555-9277", status: "Inactive", tags: ["vip"], notes: "Notes for Diana." },
    { id: "5", name: "Ethan Lee", email: "ethan@example.com", phone: "555-3276", status: "Active", tags: ["email-only"], notes: "Notes for Ethan." },
    { id: "6", name: "Farrah Johnson", email: "farrah@example.com", phone: "555-3647", status: "Prospect", tags: ["vip"], notes: "Notes for Farrah." },
    { id: "7", name: "George Brown", email: "george@example.com", phone: "555-7190", status: "Lead", tags: ["new"], notes: "Notes for George." },
    { id: "8", name: "Hannah Johnson", email: "hannah@example.com", phone: "555-1438", status: "Active", tags: ["high-priority", "follow-up"], notes: "Notes for Hannah." },
    { id: "9", name: "Ian Brown", email: "ian@example.com", phone: "555-6242", status: "Inactive", tags: [], notes: "Notes for Ian." },
    { id: "10", name: "Jenna Johnson", email: "jenna@example.com", phone: "555-4291", status: "Lead", tags: ["email-only"], notes: "Notes for Jenna." },
    { id: "11", name: "Kyle Brown", email: "kyle@example.com", phone: "555-8731", status: "Prospect", tags: ["design", "repeat"], notes: "Notes for Kyle." },
    { id: "12", name: "Luna Smith", email: "luna@example.com", phone: "555-1876", status: "Lead", tags: ["new"], notes: "Notes for Luna." },
    { id: "13", name: "Mike Smith", email: "mike@example.com", phone: "555-6243", status: "Active", tags: [], notes: "Notes for Mike." },
    { id: "14", name: "Nina Smith", email: "nina@example.com", phone: "555-1483", status: "Prospect", tags: ["vip"], notes: "Notes for Nina." },
    { id: "15", name: "Oscar Brown", email: "oscar@example.com", phone: "555-1010", status: "Inactive", tags: ["email-only"], notes: "Notes for Oscar." },
    { id: "16", name: "Paula Lee", email: "paula@example.com", phone: "555-5310", status: "Lead", tags: ["high-priority", "follow-up"], notes: "Notes for Paula." },
    { id: "17", name: "Quinn Lee", email: "quinn@example.com", phone: "555-1239", status: "Lead", tags: [], notes: "Notes for Quinn." },
    { id: "18", name: "Ravi Lee", email: "ravi@example.com", phone: "555-6711", status: "Active", tags: ["vip"], notes: "Notes for Ravi." },
    { id: "19", name: "Sophie Johnson", email: "sophie@example.com", phone: "555-7549", status: "Prospect", tags: ["new"], notes: "Notes for Sophie." },
    { id: "20", name: "Tom Smith", email: "tom@example.com", phone: "555-9801", status: "Inactive", tags: ["design", "repeat"], notes: "Notes for Tom." },
    { id: "21", name: "Alice Johnson", email: "alice@example.com", phone: "555-8675", location: "New York", status: "lead", priority: "low", lastContacted: "2025-06-12", tags: ["design", "repeat"], notes: "Notes for Alice." },
  { id: "22", name: "Brian Lee", email: "brian.lee@example.com", phone: "555-2345", location: "Los Angeles", status: "active", priority: "medium", lastContacted: "2025-06-13", tags: ["enterprise"], notes: "Followed up about onboarding." },
  { id: "23", name: "Cynthia Torres", email: "cynthia.t@example.com", phone: "555-3456", location: "Chicago", status: "prospect", priority: "high", lastContacted: "2025-06-10", tags: ["retail", "beta"], notes: "Interested in trial access." },
  { id: "24", name: "Daniel Kim", email: "daniel.k@example.com", phone: "555-4567", location: "Seattle", status: "inactive", priority: "low", lastContacted: "2025-06-01", tags: ["paused"], notes: "Stopped responding after quote." },
  { id: "25", name: "Emma Stone", email: "emma.stone@example.com", phone: "555-5678", location: "Austin", status: "lead", priority: "medium", lastContacted: "2025-06-14", tags: ["new", "tech"], notes: "Met at tech event." },
  { id: "26", name: "Frank Zhang", email: "frank.z@example.com", phone: "555-6789", location: "Boston", status: "active", priority: "high", lastContacted: "2025-06-15", tags: ["key account"], notes: "Requested dashboard update." },
  { id: "27", name: "Grace Lee", email: "grace.l@example.com", phone: "555-7890", location: "Denver", status: "prospect", priority: "medium", lastContacted: "2025-06-11", tags: ["referral"], notes: "Referred by current client." },
  { id: "28", name: "Hector Alvarez", email: "hector.a@example.com", phone: "555-8901", location: "Miami", status: "inactive", priority: "low", lastContacted: "2025-05-30", tags: ["legacy"], notes: "Account closed last month." },
  { id: "29", name: "Isla Nguyen", email: "isla.n@example.com", phone: "555-9012", location: "San Francisco", status: "lead", priority: "high", lastContacted: "2025-06-12", tags: ["design", "urgent"], notes: "Needs quick turnaround." },
  { id: "30", name: "Jake Wilson", email: "jake.w@example.com", phone: "555-0123", location: "Dallas", status: "active", priority: "medium", lastContacted: "2025-06-13", tags: ["support"], notes: "Resolved issue yesterday." },
  { id: "31", name: "Karen Brooks", email: "karen.b@example.com", phone: "555-1122", location: "Phoenix", status: "prospect", priority: "high", lastContacted: "2025-06-10", tags: ["growth"], notes: "Expansion plans next quarter." },
  { id: "32", name: "Leo Martinez", email: "leo.m@example.com", phone: "555-2233", location: "Portland", status: "lead", priority: "medium", lastContacted: "2025-06-09", tags: ["freelancer"], notes: "Needs flexibility in pricing." },
  { id: "33", name: "Maya Singh", email: "maya.s@example.com", phone: "555-3344", location: "Atlanta", status: "inactive", priority: "low", lastContacted: "2025-05-28", tags: ["no response"], notes: "Unresponsive for weeks." },
  { id: "34", name: "Noah Adams", email: "noah.a@example.com", phone: "555-4455", location: "San Diego", status: "active", priority: "high", lastContacted: "2025-06-15", tags: ["vip"], notes: "High-value client; daily syncs." },
  { id: "35", name: "Olivia Chen", email: "olivia.c@example.com", phone: "555-5566", location: "Philadelphia", status: "lead", priority: "medium", lastContacted: "2025-06-11", tags: ["follow-up"], notes: "Wants case study examples." },
  { id: "36", name: "Paul Green", email: "paul.g@example.com", phone: "555-6677", location: "Houston", status: "prospect", priority: "low", lastContacted: "2025-06-05", tags: ["education"], notes: "Looking for integration options." },
  { id: "37", name: "Quinn Rivera", email: "quinn.r@example.com", phone: "555-7788", location: "Orlando", status: "inactive", priority: "medium", lastContacted: "2025-06-03", tags: ["inactive"], notes: "Not interested currently." },
  { id: "38", name: "Rachel Park", email: "rachel.p@example.com", phone: "555-8899", location: "Detroit", status: "lead", priority: "high", lastContacted: "2025-06-14", tags: ["urgent", "demo"], notes: "Requested demo urgently." },
  { id: "39", name: "Sam Patel", email: "sam.p@example.com", phone: "555-9900", location: "Charlotte", status: "active", priority: "low", lastContacted: "2025-06-13", tags: ["long-term"], notes: "Low maintenance, long-term client." },
  { id: "40", name: "Tina Foster", email: "tina.f@example.com", phone: "555-1011", location: "Las Vegas", status: "prospect", priority: "medium", lastContacted: "2025-06-12", tags: ["event"], notes: "Met at trade show." },
  { id: "41", name: "Sandra Martinez", email: "sandra.martinez@example.com", phone: "347-821-9054", location: "Concord, NH", status: "active", priority: "medium", lastContacted: "2025-06-13", tags: ["support", "vip"], notes: "Requested status update last Friday." },
  { id: "42", name: "Brian Young", email: "brian.young@example.com", phone: "208-555-7412", location: "Aurora, CO", status: "lead", priority: "low", lastContacted: "2025-06-09", tags: ["design"], notes: "Initial inquiry about design services." },
  { id: "43", name: "Emily Taylor", email: "emily.taylor@example.com", phone: "312-499-8237", location: "Chicago, IL", status: "prospect", priority: "high", lastContacted: "2025-06-12", tags: ["enterprise", "beta"], notes: "Wants enterprise-level access." },
  { id: "44", name: "Justin Patel", email: "justin.patel@example.com", phone: "415-390-2871", location: "San Francisco, CA", status: "inactive", priority: "low", lastContacted: "2025-05-29", tags: ["legacy"], notes: "Was interested last year." },
  { id: "45", name: "Nina Cooper", email: "nina.cooper@example.com", phone: "646-721-8823", location: "Brooklyn, NY", status: "active", priority: "medium", lastContacted: "2025-06-15", tags: ["vip", "support"], notes: "Requested personalized dashboard." },
  { id: "46", name: "Owen Ross", email: "owen.ross@example.com", phone: "702-348-9003", location: "Las Vegas, NV", status: "lead", priority: "medium", lastContacted: "2025-06-10", tags: ["new", "referral"], notes: "Referral from webinar attendee." },
  { id: "47", name: "Laura Kim", email: "laura.kim@example.com", phone: "503-772-1884", location: "Portland, OR", status: "inactive", priority: "low", lastContacted: "2025-05-31", tags: ["no response"], notes: "No response after trial ended." },
  { id: "48", name: "Samuel Wright", email: "samuel.wright@example.com", phone: "913-450-7653", location: "Topeka, KS", status: "prospect", priority: "high", lastContacted: "2025-06-13", tags: ["event", "urgent"], notes: "Met at product launch event." },
  { id: "49", name: "Anna Bell", email: "anna.bell@example.com", phone: "802-560-1123", location: "Burlington, VT", status: "active", priority: "medium", lastContacted: "2025-06-14", tags: ["support", "repeat"], notes: "Has recurring support issues." },
  { id: "50", name: "Liam Morgan", email: "liam.morgan@example.com", phone: "281-674-2323", location: "Houston, TX", status: "lead", priority: "high", lastContacted: "2025-06-11", tags: ["urgent", "design"], notes: "Needs proposal by end of week." },
  { id: "51", name: "Chloe Davis", email: "chloe.davis@example.com", phone: "213-990-3322", location: "Los Angeles, CA", status: "prospect", priority: "medium", lastContacted: "2025-06-13", tags: ["referral"], notes: "Referred by another client." },
  { id: "52", name: "Ethan Brooks", email: "ethan.brooks@example.com", phone: "720-889-2020", location: "Denver, CO", status: "inactive", priority: "low", lastContacted: "2025-06-01", tags: ["legacy", "paused"], notes: "Paused services in April." },
  { id: "53", name: "Sofia Lee", email: "sofia.lee@example.com", phone: "508-773-4848", location: "Worcester, MA", status: "lead", priority: "medium", lastContacted: "2025-06-09", tags: ["education"], notes: "Asked about LMS integration." },
  { id: "54", name: "Jackson Turner", email: "jackson.turner@example.com", phone: "312-678-4433", location: "Chicago, IL", status: "active", priority: "high", lastContacted: "2025-06-14", tags: ["vip", "support"], notes: "Needs instant notification features." },
  { id: "55", name: "Zoe Ramirez", email: "zoe.ramirez@example.com", phone: "505-337-8842", location: "Santa Fe, NM", status: "prospect", priority: "low", lastContacted: "2025-06-08", tags: ["new", "event"], notes: "Attended online seminar." },
  { id: "56", name: "Caleb Allen", email: "caleb.allen@example.com", phone: "701-992-7855", location: "Fargo, ND", status: "lead", priority: "medium", lastContacted: "2025-06-10", tags: ["design", "urgent"], notes: "Interested in UI mockup package." },
  { id: "57", name: "Mia Nelson", email: "mia.nelson@example.com", phone: "775-203-6671", location: "Reno, NV", status: "inactive", priority: "low", lastContacted: "2025-06-03", tags: ["legacy", "no response"], notes: "Did not renew subscription." },
  { id: "58", name: "Gabriel Scott", email: "gabriel.scott@example.com", phone: "803-221-3490", location: "Columbia, SC", status: "active", priority: "high", lastContacted: "2025-06-15", tags: ["vip"], notes: "Weekly call scheduled with team." },
  { id: "59", name: "Layla Rivera", email: "layla.rivera@example.com", phone: "928-402-1333", location: "Flagstaff, AZ", status: "prospect", priority: "medium", lastContacted: "2025-06-12", tags: ["referral", "event"], notes: "Looking for annual package." },
  { id: "60", name: "Nathan Hayes", email: "nathan.hayes@example.com", phone: "870-994-9940", location: "Jonesboro, AR", status: "lead", priority: "high", lastContacted: "2025-06-11", tags: ["urgent", "enterprise"], notes: "Asked about volume pricing." }
  ];

  function loadClients() {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) return JSON.parse(data);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(demoClients));
    return [...demoClients];
  }

  function saveClients() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(clients));
  }

  let clients = loadClients();

  // Create unified toolbar container
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

  const buttonGroup = document.createElement("div");

  const addClientBtn = document.createElement("button");
  addClientBtn.textContent = "+ Add Client";
  addClientBtn.className = "add-client-btn";
  addClientBtn.style.marginRight = "10px";
  addClientBtn.onclick = () => openModal();

  const resetButton = document.createElement("button");
  resetButton.textContent = "🔄 Reset Demo Data";
  resetButton.style.padding = "10px 20px";
  resetButton.style.fontWeight = "bold";
  resetButton.style.background = "#4e342e";
  resetButton.style.color = "white";
  resetButton.style.borderRadius = "8px";
  resetButton.onclick = () => {
    if (confirm("Reset demo data? This will erase current records.")) {
      localStorage.removeItem(STORAGE_KEY);
      clients = [...demoClients];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(clients));
      currentPage = 1;
      renderPage();
    }
  };

  buttonGroup.appendChild(addClientBtn);
  buttonGroup.appendChild(resetButton);

  toolbar.appendChild(heading);
  toolbar.appendChild(buttonGroup);
  content.prepend(toolbar);

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
      const fields = [client.name, client.email, client.phone, client.location, client.status, client.priority, client.lastContacted, client.tags.join(", "), client.notes];
      fields.forEach(val => {
        const td = document.createElement("td");
        td.textContent = val || "—";
        tr.appendChild(td);
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