function addNote() {
  const note = document.getElementById('noteInput').value;
  const timestamp = new Date().toLocaleString();

  if (note !== "") {
    firebase.database().ref("notes").push().set({
      note: note,
      timestamp: timestamp
    }, function(error) {
      if (error) {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Failed to save note.'
        });
      } else {
        Swal.fire({
        icon: 'success',
        title: 'Note Saved!',
        showConfirmButton: false,
        timer: 1500
      });
    }
    });

    document.getElementById('noteInput').value = "";
  }
}

firebase.database().ref("notes").on("value", function(snapshot) {
  const notesList = document.getElementById("notesList");
  const totalNotesElem = document.getElementById("totalNotes");
  const lastNoteTimeElem = document.getElementById("lastNoteTime");

  notesList.innerHTML = "";
  let total = 0;
  let lastTime = "N/A";

  snapshot.forEach(function(childSnapshot) {
    const noteId = childSnapshot.key;
    const noteData = childSnapshot.val();

    const noteItem = document.createElement("li");

    // Text display
    const noteText = document.createElement("span");
    noteText.textContent = noteData.note;

    // Timestamp
    const noteTime = document.createElement("small");
    

    // Edit button
    const editBtn = document.createElement("button");
    editBtn.textContent = "Edit";
    editBtn.style.marginLeft = "10px";
    editBtn.style.background = "#007bff";
    editBtn.style.color = "white";
    editBtn.style.border = "none";
    editBtn.style.padding = "4px 8px";
    editBtn.style.borderRadius = "4px";
    editBtn.style.cursor = "pointer";

    // Delete button
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.style.marginLeft = "10px";
    deleteBtn.style.background = "red";
    deleteBtn.style.color = "white";
    deleteBtn.style.border = "none";
    deleteBtn.style.padding = "4px 8px";
    deleteBtn.style.borderRadius = "4px";
    deleteBtn.style.cursor = "pointer";

    // Edit logic
    editBtn.onclick = function () {
      const newInput = document.createElement("input");
      newInput.type = "text";
      newInput.value = noteData.note;

      const saveBtn = document.createElement("button");
      saveBtn.textContent = "Save";
      saveBtn.style.marginLeft = "10px";
      saveBtn.style.background = "green";
      saveBtn.style.color = "white";
      saveBtn.style.border = "none";
      saveBtn.style.padding = "4px 8px";
      saveBtn.style.borderRadius = "4px";
      saveBtn.style.cursor = "pointer";

      noteItem.innerHTML = "";
      noteItem.appendChild(newInput);
      noteItem.appendChild(saveBtn);

      saveBtn.onclick = function () {
        const updatedNote = newInput.value;
        const updatedTime = new Date().toLocaleString();

        firebase.database().ref("notes").child(noteId).update({
          note: updatedNote,
          timestamp: updatedTime
        });
      };
    };

    // Delete logic
    deleteBtn.onclick = function () {
      firebase.database().ref("notes").child(noteId).remove();
    };

    // Append everything
    noteItem.appendChild(noteText);
    noteItem.appendChild(noteTime);
    noteItem.appendChild(editBtn);
    noteItem.appendChild(deleteBtn);
    notesList.appendChild(noteItem);

    total++;
    if (noteData.timestamp) {
      lastTime = noteData.timestamp;
    }
  });

  // Update analytics
  totalNotesElem.textContent = total;
  lastNoteTimeElem.textContent = lastTime;
});

// Dark mode toggle
function toggleDarkMode() {
  const body = document.body;
  body.classList.toggle("dark-mode");
  localStorage.setItem("theme", body.classList.contains("dark-mode") ? "dark" : "light");
}

// Load saved mode
window.onload = function () {
  if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark-mode");
  }
};
