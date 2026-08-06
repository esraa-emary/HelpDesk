(function () {
  "use strict";

  /* ============================================================
     TAB NAV — active state follows scroll position
     ============================================================ */
  var tabLinks = Array.prototype.slice.call(document.querySelectorAll(".tab-link"));
  var sections = tabLinks
    .map(function (link) {
      var id = link.getAttribute("href").slice(1);
      return document.getElementById(id);
    })
    .filter(Boolean);

  function setActiveTab() {
    var scrollPos = window.scrollY + 120;
    var current = sections[0];
    sections.forEach(function (sec) {
      if (sec.offsetTop <= scrollPos) current = sec;
    });
    tabLinks.forEach(function (link) {
      link.classList.toggle("is-active", link.dataset.tab === current.id);
    });
  }

  window.addEventListener("scroll", setActiveTab, { passive: true });
  window.addEventListener("load", setActiveTab);
  setActiveTab();

  /* ============================================================
     KANBAN BOARD — drag & drop + keyboard move
     ============================================================ */
  var TICKETS = [
    { id: "HD-101", title: "Scope self-service / knowledge base for v2", col: "not-started" },
    { id: "HD-102", title: "Sketch reporting & analytics needs (later)", col: "not-started" },

    { id: "HD-103", title: "Draft intake field list (WA-A)", col: "ready" },
    { id: "HD-104", title: "Draft ticket data model (WA-B)", col: "ready" },
    { id: "HD-105", title: "Define the three access roles (WA-H)", col: "ready" },

    { id: "HD-100", title: "Run clarification pass on the six open questions", col: "in-progress" },

    { id: "HD-106", title: "Finalize state machine — blocked on Q3", col: "blocked" },
    { id: "HD-107", title: "Choose assignment model — blocked on Q2 (WA-C)", col: "blocked" },
    { id: "HD-108", title: "Scope manager dashboard — blocked on Q4 (WA-E)", col: "blocked" },
    { id: "HD-109", title: "Design notifications — depends on HD-107 (WA-G)", col: "blocked" }
  ];

  var board = document.getElementById("board");
  var dropzones = board ? Array.prototype.slice.call(board.querySelectorAll("[data-dropzone]")) : [];

  function renderBoard() {
    dropzones.forEach(function (zone) {
      zone.innerHTML = "";
    });

    TICKETS.forEach(function (ticket) {
      var zone = board.querySelector('[data-dropzone="' + ticket.col + '"]');
      if (!zone) return;

      var card = document.createElement("div");
      card.className = "card-ticket";
      card.setAttribute("draggable", "true");
      card.setAttribute("tabindex", "0");
      card.setAttribute("role", "button");
      card.dataset.id = ticket.id;
      card.setAttribute(
        "aria-label",
        ticket.title + ". Currently in " + columnLabel(ticket.col) + ". Press Ctrl or Cmd plus arrow keys to move."
      );

      var idEl = document.createElement("span");
      idEl.className = "card-ticket__id";
      idEl.textContent = ticket.id;

      var titleEl = document.createElement("span");
      titleEl.className = "card-ticket__title";
      titleEl.textContent = ticket.title;

      card.appendChild(idEl);
      card.appendChild(titleEl);
      zone.appendChild(card);

      card.addEventListener("dragstart", function (e) {
        card.classList.add("is-dragging");
        e.dataTransfer.setData("text/plain", ticket.id);
        e.dataTransfer.effectAllowed = "move";
      });
      card.addEventListener("dragend", function () {
        card.classList.remove("is-dragging");
      });
      card.addEventListener("keydown", function (e) {
        if (!(e.ctrlKey || e.metaKey)) return;
        var order = ["not-started", "ready", "in-progress", "blocked"];
        var idx = order.indexOf(ticket.col);
        if (e.key === "ArrowRight" && idx < order.length - 1) {
          e.preventDefault();
          moveTicket(ticket.id, order[idx + 1]);
          focusCardById(ticket.id);
        } else if (e.key === "ArrowLeft" && idx > 0) {
          e.preventDefault();
          moveTicket(ticket.id, order[idx - 1]);
          focusCardById(ticket.id);
        }
      });
    });

    updateCounts();
  }

  function focusCardById(id) {
    window.requestAnimationFrame(function () {
      var el = board.querySelector('.card-ticket[data-id="' + id + '"]');
      if (el) el.focus();
    });
  }

  function columnLabel(col) {
    return (
      {
        "not-started": "Not started",
        ready: "Ready to start",
        "in-progress": "In progress",
        blocked: "Blocked, waiting on decision"
      }[col] || col
    );
  }

  function moveTicket(id, newCol) {
    var ticket = TICKETS.find(function (t) {
      return t.id === id;
    });
    if (!ticket || ticket.col === newCol) return;
    ticket.col = newCol;
    renderBoard();
  }

  function updateCounts() {
    board.querySelectorAll(".board__col").forEach(function (colEl) {
      var col = colEl.dataset.col;
      var count = TICKETS.filter(function (t) {
        return t.col === col;
      }).length;
      var countEl = colEl.querySelector("[data-count]");
      if (countEl) countEl.textContent = count;
    });
  }

  dropzones.forEach(function (zone) {
    zone.addEventListener("dragover", function (e) {
      e.preventDefault();
      e.dataTransfer.dropEffect = "move";
      zone.classList.add("is-dragover");
    });
    zone.addEventListener("dragleave", function () {
      zone.classList.remove("is-dragover");
    });
    zone.addEventListener("drop", function (e) {
      e.preventDefault();
      zone.classList.remove("is-dragover");
      var id = e.dataTransfer.getData("text/plain");
      var newCol = zone.getAttribute("data-dropzone");
      moveTicket(id, newCol);
    });
  });

  if (board) renderBoard();
})();
