

// Function to resize the window based on content height
function resizeWindow() {
  //const formContainer = document.querySelector(".nm-container");
  //window.resizeTo(660, formContainer.scrollHeight + 40); // Adjusts window height based on content
}

// Open the minimal window when loading the page
window.onload = function() {
  if (window.opener == null) {
    openMinimalWindow();
  } else {
    resizeWindow();
  }
};

// Open the form in a new, clean window
function openMinimalWindow() {
  const url = window.location.href; // Current URL
  const features = "width=660,height=600,resizable=yes,scrollbars=yes,toolbar=no,menubar=no,location=no,status=no";
  window.open(url, "MinimalFormWindow", features);
  window.close(); // Close the original window if necessary
}
document.addEventListener("DOMContentLoaded", () => {
    //newNote();
    const noteForm = document.getElementById("noteForm");
    const notesList = document.getElementById("notesList");
    //const selectAllCheckbox = document.getElementById("selectAll");
    const removeButton = document.getElementById("removeButton");
    const toggleNotesList = document.getElementById("toggleNotesList");
    //const noteBuilder = document.getElementById("noteBuilder");
    
    const notesListContainer = document.querySelector("notesList");  
    
    refreshNotes();

    const noteIdField = document.getElementById("noteid");
    if (!noteIdField.value) {
      noteIdField.value = createNoteId();
    }

    function selectMainMenuItem(itemId, button) {
      if (document.getElementById(itemId).classList.contains("show")) {
        document.getElementById(itemId).classList.remove("show");
        document.getElementById("mainForm").classList.add("show");
        button.target.classList.remove("active");
      } else {
        var fatherDiv = document.getElementById("mainAppContent");
        // Get all direct children that are div elements
        var childDivs = fatherDiv.querySelectorAll(":scope > div");
        // Remove the .show class from each child div
        childDivs.forEach(div => {
          div.classList.remove("show");
        });
        document.getElementById(itemId).classList.add("show");

        fatherDiv = document.getElementById("note-controls");
        // Get all direct children that are div elements
        childDivs = fatherDiv.querySelectorAll(":scope > button");
        // Remove the .show class from each child div
        childDivs.forEach(div => {
          div.classList.remove("active");
        });
        button.target.classList.add("active");
      }
    }

    // Toggle notesList visibility
    toggleNotesList.addEventListener("click", (e) => {
      
      selectMainMenuItem("notesListContainer", e);
      
      e.preventDefault();
    });
    


    function notesListClose() {
      var noteListContainer = document.getElementById("notesListContainer");
        
      noteListContainer.classList.remove("show");
      
      document.getElementById("mainForm").classList.add("show");

      var butt = document.getElementById("toggleNotesList");
      
      butt.classList.remove("active");
      
      
    }

    document.getElementById("notesListClose").addEventListener("click", (e) => {
      notesListClose();
        
      e.preventDefault();
    });

    document.getElementById("configClose").addEventListener("click", (e) => {
      var noteListContainer = document.getElementById("configContainer");
        
      noteListContainer.classList.add("hidden");
        
      e.preventDefault();
    });

    // Form submission (Save Note)
    noteForm.addEventListener("submit", (e) => {
      e.preventDefault();
      saveNote();
    });



const saveButton = document.getElementById('saveNote');
const saveIndicator = document.getElementById('saveIndicator');

function showSavingIndicator() {
  saveButton.classList.add('saving');
}

function hideSavingIndicator() {
  saveButton.classList.remove('saving');
}

    
  function saveNote(showNotifications=true) {
    const noteData = getFormData();
    if (!noteData || !noteData.noteid) {
        showNotification("red", "Invalid note data. Please check all fields.");
        return;
    }

    let savedNotes = [];
    try {
        const notesString = localStorage.getItem("notes");
        savedNotes = notesString ? JSON.parse(notesString) : [];
    } catch (error) {
        console.error("Error parsing saved notes:", error);
        showNotification("yellow", "Error loading saved notes. Starting fresh.");
    }

    const existingNoteIndex = savedNotes.findIndex(note => note.noteid === noteData.noteid);

    if (existingNoteIndex !== -1) {
        // Update existing note
        savedNotes[existingNoteIndex] = noteData;
    } else {
        // Add new note
        savedNotes.push(noteData);
    }

    savedNotes.sort((a, b) => {
        const idA = parseInt(a.noteid, 10);
        const idB = parseInt(b.noteid, 10);
        return idB - idA;
    });

    showSavingIndicator();
    try {
        localStorage.setItem("notes", JSON.stringify(savedNotes));
  	showSavingIndicator()
        if (existingNoteIndex !== -1) {      
          if (showNotifications)
              showNotification("green", `Note '${noteData.noteid} has been updated!'`);
        } else {
          if (showNotifications)
              showNotification("green", `New note '${noteData.noteid}' has been saved!`);
        }
        setTimeout(() => {
          hideSavingIndicator();
        }, 1000);
        updateNoteInUI(noteData);
        refreshNotes();
    } catch (error) {
        console.error("Error saving notes:", error);
        showNotification("red", "Error saving note. Please try again.");
        hideSavingIndicator();
    }

   /*showSavingIndicator();
  
   // Your existing save logic here
   const noteData = getFormData();
  
   try {
    localStorage.setItem('autosaved_note', JSON.stringify(noteData));
    
    // Simulate a delay for the save operation (remove this in production)
    setTimeout(() => {
      hideSavingIndicator();
    }, 1000);
   } catch (error) {
    console.error('Save failed:', error);
    hideSavingIndicator();
    // Optionally show an error notification
   }*/

  }

    function saveNote__old() {
        const noteData = getFormData();
        if (!noteData || !noteData.noteid) return; // Ensure noteData and noteid are valid
      
        var notesString = localStorage.getItem("notes");
        if (notesString == "") {
          var savedNotes = []; 
        } else {
          var savedNotes = JSON.parse(notesString) || [];
        }
      
        // Find the index of the note with the same ID, if it exists
        const existingNoteIndex = savedNotes.findIndex(note => note.noteid === noteData.noteid);
      
        if (existingNoteIndex !== -1) {
          // If the note exists, update it
          //savedNotes[existingNoteIndex] = noteData;
          savedNotes.splice(existingNoteIndex, 1);
          savedNotes.push(noteData);
          localStorage.setItem("notes", []);
	  setTimeout(() => {
            localStorage.setItem("notes", JSON.stringify(savedNotes));
          }, 800);

          showNotification("green", "Note '" + noteData.noteid  +"' has been updated!");
        } else {
          // If the note does not exist, add it as a new note
          savedNotes.push(noteData);
          localStorage.setItem("notes", JSON.stringify(savedNotes));
          showNotification("green", "Success: New note '" + noteData.noteid  +"' has been saved to your note list!");
        }
      
        // Save the updated notes list to localStorage


        // Update the UI
        if (existingNoteIndex !== -1) {
          updateNoteInUI(noteData); // Update the existing note in the UI
        } else {
	  refreshNotes()
          //addNoteToUI(noteData); // Add the new note to the UI
        }
    }
    function updateNoteInUI(noteData) {
      const noteElement = document.querySelector(`[data-noteid="${noteData.noteid}"]`);
      if (noteElement) {
        var noteTeaser = getNoteTeaser(noteData);
        noteElement.innerHTML = noteTeaser.innerHTML;
      }
    }
    /*function addNoteToUI(noteData) {
      notesList.prependChild(getNoteTeaser(noteData));
      //notesList.insertBefore(getNoteTeaser(noteData), notesList.firstChild);
    }*/

    function refreshNotes() {
      const notesList = document.getElementById("notesList");
      notesList.innerHTML = "";
      let savedNotes = [];
    
      try {
        const storedNotesString = localStorage.getItem("notes");
        if (storedNotesString) {
            savedNotes = JSON.parse(storedNotesString);
        }
      } catch (error) {
        console.error("Error parsing saved notes:", error);
        showNotification("yellow", "Error loading saved notes. Starting fresh.");
      }

      // Sort notes by ID in descending order
      savedNotes.sort((a, b) => {
        // Convert IDs to numbers for proper numeric sorting
        const idA = parseInt(a.noteid, 10);
        const idB = parseInt(b.noteid, 10);
        return idB - idA; // Descending order
      });

      // Add sorted notes to UI
     // savedNotes.forEach(addNoteToUI);

      // Add sorted notes to UI
      savedNotes.forEach(noteData => {
        const noteItem = addNoteToUI(noteData);
        notesList.appendChild(noteItem);
      });
    }


    function getNoteTeaser(noteData) {
      const notesList = document.getElementById("notesList");
      const noteElement = document.createElement("li");
      noteElement.setAttribute("data-noteid", noteData.noteid); // Add data-noteid attribute
      noteElement.innerHTML = `<strong>${noteData.title}</strong><br>${noteData.content}`;
      return noteElement;
    }
    
      

    function createNoteId() {
      var notesString = localStorage.getItem("notes")
      if (notesString == "") {
        savedNotes = [];
      } else {
        var savedNotes = JSON.parse(notesString) || [];
      }
      

      const highestId = savedNotes.reduce((maxId, note) => {
        return Math.max(maxId, parseInt(note.noteid, 10) || 0);
      }, 0); // Start with 0 as the default max

      // Return the next ID
      return highestId + 1;
    }


    function getFormattedTimestamp() {
      const now = new Date();
      
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
      const day = String(now.getDate()).padStart(2, "0");
      
      const hours = String(now.getHours()).padStart(2, "0");
      const minutes = String(now.getMinutes()).padStart(2, "0");
      const seconds = String(now.getSeconds()).padStart(2, "0");
      
      return `${year} ${month} ${day} ${hours}:${minutes}:${seconds}`;
    }
    
    // Function to set the timestamp in the input field
    function setTimestamp() {
      const datetime = document.getElementById("datetime");
      datetime.value = getFormattedTimestamp();
    }
    
    function newNote() {
      noteForm.reset();
      document.getElementById("reminders").classList.add("open");
      document.getElementById("verif").classList.add("open");
      document.getElementById("tech").classList.remove("open");
      var conf = JSON.parse(localStorage.getItem("app_config")) || {
        headconf: "", footconf: ""
      };

      document.getElementById("head").value = conf.headconf;
      document.getElementById("foot").value = conf.footconf;
      resetAutoGrowSize();
      const newId = createNoteId();
      document.getElementById("noteid").value = newId;
      setTimestamp();
      //calculateNoteLength();
    }
    newNote();
    setTimeout(() => {
      showNotification("green", getRandomMessage(newMessages)); 
    }, 2500);
    setTimeout(() => {
        showNotification("green", getRandomMessage(newMessages2)); 
    }, 3500);

    function clearMainMenu() {
      fatherDiv = document.getElementById("note-controls");
      // Get all direct children that are div elements
      childDivs = fatherDiv.querySelectorAll(":scope > button");
      // Remove the .show class from each child div
      childDivs.forEach(div => {
        div.classList.remove("active");
      });
    }
    document.getElementById("clearForm").addEventListener("click", () => {
      newNote();
      var fatherDiv = document.getElementById("mainAppContent");
      var childDivs = fatherDiv.querySelectorAll(":scope > div");
      childDivs.forEach(div => {
          div.classList.remove("show");
      });
      document.getElementById("mainForm").classList.add("show");
      clearMainMenu();      
      showNotification("green", getRandomMessage(newMessages));
      setTimeout(() => {
        showNotification("green", getRandomMessage(newMessages2)); 
      }, 1500);

    });


function getRadioValue(elementId) {
    const radioButtons = document.getElementsByName(elementId);
    for (const radioButton of radioButtons) {
        if (radioButton.checked) {
            return radioButton.value;
        }
    }
    return null; // Return null if no radio button is selected
}
  
    function getFormData() {
      const fields = [
        "cid", 
        "ban", "cbr", "name", "email", "tt", "manauth_txt",
        "issue", "topology", "wf", "tvs_code", "address",
        "actions", "noteid", "callername", /*"ncticket",*/ "datetime",
        "head", "foot", "callresnote",
	
      ];
      const data = fields.reduce((acc, field) => {
        acc[field] = document.getElementById(field).value;
        return acc;
      }, {});
  
      const crol = document.querySelector('input[name="crol"]:checked');
      data.crol = crol ? crol.value : null;
      [ "ivr",
        "pin", 
        "dob",
	"cc",
        "sin", 
        "dl", 
        "pcn", 
        "scn", 
        "email",
        "addr",
        "manauth",
        "includeAll",
	"piws",
	"bosr",
	"nctix",
	"spoc",
	"cct",
	"soldwfp",
         ].forEach(id => {
        data[id] = document.getElementById(id).checked ? document.getElementById(id).value : "";
      });

       data["chklstcbr"] = getRadioValue("chklstcbr");
       data["chklstpq"] = getRadioValue("chklstpq");
       data["chklstawa"] = getRadioValue("chklstawa");
       data["chklsttvs"] = getRadioValue("chklsttvs");
       data["chklstswp"] = getRadioValue("chklstswp");
       data["chklstdis"] = getRadioValue("chklstdis");
       data["chklstrb"] = getRadioValue("chklstrb");
       data["chklstwf"] = getRadioValue("chklstwf");
       data["chklstwfp"] = getRadioValue("chklstwfp");

      return data;
    }


    function createNoteExtraText(noteData) {
      const extraData = "NOTEID: " + noteData.noteid
      + (noteData.datetime? ("\n" + noteData.datetime) : "")
      + (noteData.name? ("\nFull Name: " + noteData.name) : "")
      + (noteData.cid? ("\nCID: " + noteData.cid) : "")
      + (noteData.ban? ("\nBAN: " + noteData.ban) : "")
      + (noteData.callresnote? ("\nCall Resolution Note: " + noteData.callresnote + "") : "")
      + "\n* * * * * *";

      return extraData;
    }

    function createNoteText(noteData) {
      const config = getConfig();
      const noteText = noteData.head
        + (noteData.tt? ("\nRemedy Tt: " + noteData.tt) : "")
        + (noteData.ncticket? ("\nNC Tt: " + noteData.ncticket) : "")
        + (noteData.cbr? ("\nCBR: " + noteData.cbr) : "")
        + (noteData.callername? ("\nCallrName: " + noteData.callername) : "")
        + "\nVerif: " + (noteData.crol? (" "+noteData.crol) : "") 
                        + (noteData.ivr? (" "+noteData.ivr) : "") 
                        + (noteData.pin? (" "+noteData.pin) : "") 
                        + (noteData.sin? (" "+noteData.sin) : "") 
                        + (noteData.dob? " "+noteData.dob : "") 
                        + (noteData.cc? " "+noteData.cc : "") 
                        + (noteData.dl? (" "+noteData.dl) : "") 
                        + (noteData.pcn? (" "+noteData.pcn) : "") 
                        + (noteData.scn? (" "+noteData.scn) : "") 
                        + (noteData.email? (" "+noteData.email) : "") 
                        + (noteData.addr? (" "+noteData.addr) : "") 
                        + (noteData.manauth? (" "+noteData.manauth) : "") 
                        + (noteData.manauth_txt? (""+noteData.manauth_txt) : "") 
        + (noteData.issue? ("\n*Issue: \n" + noteData.issue) : "")
        + "\n*Actions:"
        + (noteData.wf? ("\n-WF: " + noteData.wf) : "")
        + (noteData.tvs_code? ("\n-TVS(" + noteData.tvs_code + "): \n") : "")
        //+ (noteData.tvs_results? noteData.tvs_results : "")
        + (noteData.topology? ("\n-" + noteData.topology) : "")
        + (noteData.actions? ("\n-" + noteData.actions) : "")
        //+ "\n*No more concerns\nEOC**";
        + "\n" + noteData.foot
      
      // Remove empty lines
      const cleanedNoteText = noteText
      .split("\n") // Split into lines
      .filter(line => line.trim() !== "") // Remove lines that are empty or whitespace-only
      .join("\n"); // Join the remaining lines back together

      return cleanedNoteText;
      
    }

    function getAllNotesAsText() {
      let allNotesText = "";
    
      try {
        // Get notes from localStorage
        const storedNotesString = localStorage.getItem("notes");
        if (!storedNotesString) {
            showNotification("yellow", "No notes found");
            return "";
        }

        let savedNotes = JSON.parse(storedNotesString);

        // Sort notes by ID in descending order (newest first)
        savedNotes.sort((a, b) => {
            const idA = parseInt(a.noteid, 10);
            const idB = parseInt(b.noteid, 10);
            return idB - idA;
        });

        // Create text for each note and join them
        allNotesText = savedNotes.map(noteData => {
            const noteText = createNoteText(noteData);
            const extraData = createNoteExtraText(noteData);
            return extraData + "\n" + noteText;
        }).join("\n\n\n");

      } catch (error) {
        console.error("Error processing notes:", error);
        showNotification("red", "Error creating notes text");
        return "";
      }

      return allNotesText;
    }


  document.getElementById("allNotesTabBtn").addEventListener("click", async (e) => {
    const allNotesText = getAllNotesAsText();
    
    // Set the text in the textarea
    const allNotesDisplay = document.getElementById("allNotes");
    allNotesDisplay.value = allNotesText;
    
    try {
        // Copy the text to clipboard using Clipboard API
        await navigator.clipboard.writeText(allNotesText);
        showNotification("green", "All notes copied to clipboard!");
    } catch (err) {
        console.error('Failed to copy text: ', err);
        showNotification("red", "Failed to copy to clipboard. Please try again.");
    }
    
    e.preventDefault();
  });

  document.getElementById("csvTabBtn").addEventListener("click", (e) => {
    //const allNotesText = getAllNotesAsText();
    let csvContent = getNotesListCSV();
    // Create a temporary textarea to copy the text
    const allNotesDisplay = document.getElementById("notesCSV");
    
    allNotesDisplay.innerHTML = csvContent;
    
    showNotification("green", "Notes CSV copied to clipboard!");
     e.preventDefault();
  });

    function createNoteTeaserText(noteData) {
      // Helper function to truncate text
      const truncate = (str, maxLength) => str.length > maxLength ? str.substring(0, maxLength - 3) + '...' : str;

      // Format date if it exists
      const formattedDate = noteData.datetime ? new Date(noteData.datetime).toLocaleString() : 'N/A';

      // Construct the teaser
      const teaser = [
        `ID: ${noteData.noteid} | ${formattedDate}`,
        `${noteData.name ? 'Cx: ' + truncate(noteData.name, 20) : ''}${noteData.callername ? ' | Caller: ' + truncate(noteData.callername, 20) : ''}`,
        `${noteData.cid ? 'CID: ' + noteData.cid : ''}${noteData.ban ? ' | BAN: ' + noteData.ban : ''}${noteData.cbr ? ' | CBR: ' + noteData.cbr : ''}`,
        `${noteData.tvs_code ? 'TVS: ' + noteData.tvs_code : ''}`,
        `${noteData.issue ? 'Issue: ' + truncate(noteData.issue, 50) : ''}`,
        `${noteData.callresnote ? 'Resolution: ' + truncate(noteData.callresnote, 50) : ''}`
      ].filter(line => line.trim() !== '').join('\n');

      return teaser;
    }

    function createNoteTeaserElement(noteData) {
     // Helper function to create a div with a class and content
     const createDiv = (className, content) => {
         const div = document.createElement('div');
         div.className = className;
         div.textContent = content || '';
         return div;
     };
 
     // Helper function to truncate text
     const truncate = (str, maxLength) => str && str.length > maxLength ? str.substring(0, maxLength - 3) + '...' : str;
 
     // Create the main container
     const teaserContainer = document.createElement('div');
     teaserContainer.className = 'note-teaser';
 
     // Add content to the container
     var datetime = noteData.datetime ? new Date(noteData.datetime).toLocaleString() : '';
     teaserContainer.appendChild(createDiv('note-id', `ID: ${noteData.noteid}  -  ${datetime}`));

     teaserContainer.appendChild(createDiv('note-customer', `Cx Name: ${truncate(noteData.name, 20)} | Caller: ${truncate(noteData.callername, 20)}`));
     teaserContainer.appendChild(createDiv('note-ids', `CID: ${noteData.cid || 'X'} | BAN: ${noteData.ban || 'X'} | CBR: ${noteData.cbr || 'X'} | TVS: ${noteData.tvs_code || 'X'}`));
     teaserContainer.appendChild(createDiv('note-moredata', `${noteData.piws || ''}  ${noteData.bosr || ''}  ${noteData.nctix || ''}  ${noteData.cct || ''}  ${noteData.spoc || ''} | WF: ${noteData.wf || 'X'} | Swap: ${noteData.chklstswp || 'X'} | Dispatch: ${noteData.chklstdis || 'X'}`));
     return teaserContainer;
    }

  // Function to add note to the UI
  function addNoteToUI(noteData) {
    const noteItem = document.createElement("li");
    noteItem.setAttribute("data-noteid", noteData.noteid);

    const noteContent = createNoteTeaserElement(noteData);
    
    const buttonsContainer = document.createElement("div");
    buttonsContainer.className = "note-buttons";

    const loadBtn = document.createElement("button");
    loadBtn.classList.add("note-loadBtn");
    loadBtn.textContent = "Load";
    loadBtn.addEventListener("click", (e) => {
        loadNoteToForm(noteData);
        e.preventDefault();
    });

    const deleteBtn = document.createElement("button");
    deleteBtn.classList.add("note-deleteBtn");
    deleteBtn.innerHTML = '<i class="fas fa-trash"></i>'; // Assuming you're using Font Awesome
    deleteBtn.addEventListener("click", (e) => {
        confirmDeleteNote(noteData.noteid);
        e.preventDefault();
    });

    buttonsContainer.appendChild(loadBtn);
    buttonsContainer.appendChild(deleteBtn);

    noteItem.appendChild(noteContent);
    noteItem.appendChild(buttonsContainer);

    return noteItem;
  }

   /* function addNoteToUI(noteData) {
      //tt, cid, ban, cbr, cname, crol, dob, dl, pcn, scn, issue, topology, wf, actions
      
      
      const noteText = createNoteTeaserElement(noteData);

      const noteItem = document.createElement("li");
      noteItem.setAttribute("data-noteid", noteData.noteid);

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.classList.add("note-checkbox");

      const loadBtn = document.createElement("button");
      loadBtn.classList.add("note-loadBtn");
      loadBtn.textContent = "Load";
      loadBtn.addEventListener("click", (e) => {
        loadNoteToForm(noteData);
        e.preventDefault();
        //e.stopPropagation();
      });

      const title = document.createElement("strong");
      title.textContent = "";
  
      const noteContent = document.createElement("div");
      //noteContent.innerHTML = noteText;
      noteContent.appendChild(noteText);

  
      noteItem.appendChild(checkbox);
      //noteItem.appendChild(title);
      noteItem.appendChild(noteContent);
      noteItem.appendChild(loadBtn);
      notesList.appendChild(noteItem);
    }*/

function confirmDeleteNote(noteId) {
    if (confirm("Are you sure you want to delete this note?")) {
        deleteNote(noteId);
    }
}

function deleteNote(noteId) {
    // Get current notes from localStorage
    let notes = JSON.parse(localStorage.getItem("notes")) || [];
    
    // Filter out the note to be deleted
    notes = notes.filter(note => note.noteid !== noteId);
    
    // Save the updated notes back to localStorage
    localStorage.setItem("notes", JSON.stringify(notes));
    
    // Remove the note from the UI
    const noteElement = document.querySelector(`li[data-noteid="${noteId}"]`);
    if (noteElement) {
        noteElement.remove();
    }
    
    // Show a notification
    showNotification("green", "Note deleted successfully!");
}

function setRadioValue(value, elementId) {
    const radioButtons = document.getElementsByName(elementId);
    for (const radioButton of radioButtons) {
        if (radioButton.value === value) {
            radioButton.checked = true;
            //break;
        } else {
            radioButton.checked = false;
        }
    }
}


    function loadNoteToForm(noteData) {
      // Map each form field to the corresponding noteData property
      document.getElementById("noteid").value = noteData.noteid || "";
      document.getElementById("datetime").value = noteData.datetime || "";
      document.getElementById("tt").value = noteData.tt || "";
      //document.getElementById("ncticket").value = noteData.ncticket || "";
      document.getElementById("cid").value = noteData.cid || "";
      document.getElementById("ban").value = noteData.ban || "";
      document.getElementById("cbr").value = noteData.cbr || "";
      document.getElementById("name").value = noteData.name || "";
      document.getElementById("callername").value = noteData.callername || "";
      document.getElementById("head").value = noteData.head || "";
      document.getElementById("foot").value = noteData.foot || "";   
      document.getElementById("callresnote").value = noteData.callresnote || "";
   
     

      document.getElementById("issue").value = noteData.issue || "";
      document.getElementById("issue").style.height = `${document.getElementById("issue").scrollHeight}px`;
      
      
      document.getElementById("topology").value = noteData.topology || "";
      document.getElementById("topology").style.height = `${document.getElementById("topology").scrollHeight}px`;

      document.getElementById("wf").value = noteData.wf || "";

      
      document.getElementById("actions").value = noteData.actions || "";
      document.getElementById("actions").style.height = `${document.getElementById("actions").scrollHeight}px`;

      document.getElementById("tvs_code").value = noteData.tvs_code || "";

      
      //document.getElementById("tvs_results").value = noteData.tvs_results || "";
      //document.getElementById("tvs_results").style.height = `${document.getElementById("tvs_results").scrollHeight}px`;

      document.getElementById("manauth_txt").value = noteData.manauth_txt || "";
    
      // Handle radio button for "crol" (Account Role) field
      if (noteData.crol) {
        document.querySelector(`input[name="crol"][value="${noteData.crol}"]`).checked = true;
      } else {
        document.querySelectorAll(`input[name="crol"]`).forEach(input => (input.checked = false));
      }
      //document.querySelector(`input[name="crol"][value="${noteData.crol}"]`).checked = true;


/* document.getElementById("chklst-cbr").value = noteData.chklst-cbr || "";
      document.getElementById("chklst-pq").value = noteData.chklst-pq || "";
      document.getElementById("chklst-awa").value = noteData.chklst-awa || "";
      document.getElementById("chklst-tvs").value = noteData.chklst-tvs || "";
      document.getElementById("chklst-swp").value = noteData.chklst-swp || "";
      document.getElementById("chklst-rb").value = noteData.chklst-rb || "";*/

      setRadioValue(noteData.chklstcbr, "chklstcbr");
      setRadioValue(noteData.chklstpq, "chklstpq");
      setRadioValue(noteData.chklstawa, "chklstawa");
      setRadioValue(noteData.chklsttvs, "chklsttvs");
      setRadioValue(noteData.chklstswp, "chklstswp");
      setRadioValue(noteData.chklstdis, "chklstdis");
      setRadioValue(noteData.chklstrb, "chklstrb");
      setRadioValue(noteData.chklstwf, "chklstwf");
      setRadioValue(noteData.chklstwfp, "chklstwfp");

      // Handle checkbox fields for verification fields
      document.getElementById("ivr").checked = !!noteData.ivr;
      document.getElementById("pin").checked = !!noteData.pin;
      document.getElementById("sin").checked = !!noteData.sin;
      document.getElementById("dob").checked = !!noteData.dob;
      document.getElementById("cc").checked = !!noteData.cc;
      document.getElementById("dl").checked = !!noteData.dl;
      document.getElementById("pcn").checked = !!noteData.pcn;
      document.getElementById("scn").checked = !!noteData.scn;
      document.getElementById("email").checked = !!noteData.email;
      document.getElementById("addr").checked = !!noteData.addr;
      document.getElementById("piws").checked = !!noteData.piws;
      document.getElementById("spoc").checked = !!noteData.bosr;
      document.getElementById("cct").checked = !!noteData.cct;
      document.getElementById("nctix").checked = !!noteData.nctix;
      document.getElementById("bosr").checked = !!noteData.spoc;
      document.getElementById("soldwfp").checked = !!noteData.soldwfp;
      document.getElementById("manauth").checked = !!noteData.manauth;
      document.querySelector("#notesList").style.left = "-100%";

      notesListClose();
      
      document.getElementById("verif").classList.add("open");
      document.getElementById("tech").classList.add("open");
      calculateNoteLength();
      resetAutoGrowSize();

    }

    function resetAutoGrowSize() {
      document.querySelectorAll(".auto-grow").forEach(textarea => {

          // Reset height to check scrollHeight
          textarea.style.height = "auto";
  
          // Set height to match the scroll height (content height)
          textarea.style.height = `${textarea.scrollHeight}px`;
      
      });
    }
    
    document.getElementById("closeNoteView").addEventListener("click", (e) => {
      var noteListContainer = document.getElementById("noteView");
        
      noteListContainer.classList.remove("show");
      
      document.getElementById("mainForm").classList.add("show");

      var butt = document.getElementById("viewNote");
      butt.classList.remove("active");
      
      //document.getElementById().classList.add("show");  
      e.preventDefault();

    });

    document.getElementById("viewNote").addEventListener("click", (e) => {
      selectMainMenuItem("noteView", e);
      checkVerifFieldset();

      
      if (!document.getElementById('wf').value.trim()) {
        showNotification("red", "Don't forget choosing the right WorkFlow.", 20000);
      }
      var noteData = getFormData();
      var includeAllCheckbox = document.getElementById("includeAll");
      var noteText = createNoteText(noteData);
      if (includeAllCheckbox.checked) {
        var extraData = createNoteExtraText(noteData);
        noteText = extraData + "\n" + noteText;
      }
      var noteViewContainer = document.getElementById("noteViewText");
      noteViewContainer.innerHTML = noteText;
      copyNoteToClipboard();
      e.preventDefault();
    });

    const includeAllCheckbox = document.getElementById("includeAll");
    // Add an event listener to handle changes
    var setNoteView = function() {
      var noteData = getFormData();
      var noteText = createNoteText(noteData);
      if (includeAllCheckbox.checked) {
      
        var extraData = createNoteExtraText(noteData);
        noteText = extraData + "\n" + noteText;
      
      }
      var noteViewContainer = document.getElementById("noteViewText");
      noteViewContainer.innerHTML = noteText;
      copyNoteToClipboard();
    };
    const headText = document.getElementById("head");
    const footText = document.getElementById("foot");
    includeAllCheckbox.addEventListener("change", setNoteView);
    headText.addEventListener("blur", setNoteView);
    footText.addEventListener("blur", setNoteView);

    function copyNoteToClipboard() { 
      const textarea = document.getElementById("noteViewText");
      textarea.select(); // Select the text content of the textarea
      textarea.setSelectionRange(0, 99999); // For mobile devices
      
      navigator.clipboard.writeText(textarea.value) // Copy text to clipboard
        .then(() => {
          //alert("Text copied to clipboard!");
          showNotification("green", "Text copied to clipboard!");
        })
        .catch(err => {
          console.error("Failed to copy text: ", err);
        });
    }

    document.getElementById("copyButton").addEventListener("click", (event) => {
      const textarea = document.getElementById("noteViewText");
      textarea.select(); // Select the text content of the textarea
      textarea.setSelectionRange(0, 99999); // For mobile devices
      
      navigator.clipboard.writeText(textarea.value) // Copy text to clipboard
        .then(() => {
          //alert("Text copied to clipboard!");
          showNotification("green", "Text copied to clipboard!");
        })
        .catch(err => {
          console.error("Failed to copy text: ", err);
        });
      
    });

    // Function to handle pasting content from the clipboard
    document.querySelectorAll(".paste-icon").forEach(icon => {
      icon.addEventListener("click", async (e) => {
        const targetId = icon.getAttribute("data-target"); // Get the target input/textarea ID
        const targetElement = document.getElementById(targetId);

        if (targetElement) {
          try {
            // Use the Clipboard API to read clipboard content
            const clipboardText = await navigator.clipboard.readText();
            targetElement.value = clipboardText; // Paste clipboard text into the target element
          } catch (err) {
            console.error("Failed to read clipboard contents:", err);
            alert("Unable to paste from clipboard. Ensure clipboard access is allowed.");
          }
        }
      });
    });

  
    // Select All checkbox functionality
    /*selectAllCheckbox_.addEventListener("change", () => {
      const checkboxes = document.querySelectorAll(".note-checkbox");
      checkboxes.forEach(checkbox => {
        checkbox.checked = selectAllCheckbox.checked;
      });
    });*/
  
    // Remove selected notes functionality
    /*removeButton.addEventListener("click", () => {
      const checkboxes = document.querySelectorAll(".note-checkbox");
      
      checkboxes.forEach((checkbox, index) => {
        if (checkbox.checked) {
          savedNotes.splice(index, 1);
        }
      });
  
      // Update localStorage with remaining notes
      localStorage.setItem("notes", JSON.stringify(savedNotes));
  
      // Clear and reload notes list in the UI
      notesList.innerHTML = "";
      savedNotes.slice().reverse().forEach(addNoteToUI);
  
      // Uncheck the Select All checkbox
      selectAllCheckbox.checked = false;
    });*/



    document.querySelectorAll(".auto-grow").forEach(textarea => {
      // Add an input event listener to each textarea to adjust height
      textarea.addEventListener("input", function() {
        const currentScroll = window.scrollY; // Save the current scroll position

        // Reset height to check scrollHeight
        textarea.style.height = "auto";

        // Set height to match the scroll height (content height)
        textarea.style.height = `${textarea.scrollHeight}px`;

        window.scrollTo(0, currentScroll+12); // Restore the scroll position
        
      });
    });

    /* Copy buttons */ 
    document.addEventListener("click", (event) => {
      if (event.target.classList.contains("copy-button")) {
      
        const container = event.target.parentNode; // Get the parent container of the button and textarea
        const textarea = container.querySelector(".copy-text"); // Find the textarea within the same container
        const notification = container.querySelector(".copy-notification"); // Find the notification div in the same container
      
          // Select and copy the textarea's value
        textarea.select();
        textarea.setSelectionRange(0, 99999); // For mobile compatibility
      
        navigator.clipboard.writeText(textarea.value)
            .then(() => {
              // Display the notification
              notification.style.display = "block";
              notification.classList.remove("hide");
      
              // Hide the notification after 5 seconds with a fade-out effect
              setTimeout(() => {
                notification.classList.add("hide");
                setTimeout(() => {
                  notification.style.display = "none";
                }, 500); // Ensure it’s fully faded out before hiding completely
              }, 5000);
            })
            .catch(err => console.error("Failed to copy text:", err));
        event.preventDefault();
      }
    });

    /* Toggle buttons */
    document.querySelectorAll(".toggle-button").forEach(button => {
      button.addEventListener("click", () => {
        const targetId = button.getAttribute("data-target");
        const targetDiv = document.getElementById(targetId);
        
        if (targetDiv) {
          targetDiv.classList.toggle("show"); // Toggles the 'show' class on the target div
        }
        e.preventDefault();
      });

    });

    document.querySelectorAll(".collapsible legend").forEach(legend => {
      legend.addEventListener("click", () => {
        const fieldset = legend.parentElement; // Get the parent fieldset
        fieldset.classList.toggle("open"); // Toggle the 'open' class
      });
    });

    document.querySelectorAll(".copy-icon").forEach(icon => {
      icon.addEventListener("click", () => {
        const targetId = icon.getAttribute("data-target");
        const targetInput = document.getElementById(targetId);
    
        if (targetInput) {
          targetInput.select(); // Select the input content
          targetInput.setSelectionRange(0, 99999); // For mobile compatibility
    
          navigator.clipboard.writeText(targetInput.value) // Copy the content to clipboard
            .then(() => {
              console.log(`Copied: ${targetInput.value}`);
              // Optionally, provide feedback (e.g., change icon color, display a tooltip, etc.)
              icon.style.color = "green";
              setTimeout(() => icon.style.color = "", 2000);
            })
            .catch(err => console.error("Failed to copy text", err));
        }
      });
    });

    
    function showNotification(type, message, time=8000) {
      const notificationsArea = document.getElementById("notificationsArea");
    
      // Create a new notification
      const notificationBox = document.createElement("div");
      notificationBox.className = `notification ${type}`;
    
      // Add the message
      const notificationMessage = document.createElement("p");
      notificationMessage.textContent = message;
      notificationBox.appendChild(notificationMessage);
    
      // Add the close button
      const closeButton = document.createElement("button");
      closeButton.textContent = "×";
      closeButton.onclick = (e) => {fadeOutAndRemove(notificationBox);e.preventDefault();};
      notificationBox.appendChild(closeButton);
    
      // Add the notification to the notifications area
      notificationsArea.appendChild(notificationBox);
    
      setTimeout(() => {
          fadeOutAndRemove(notificationBox);
      }, time);

      // Auto-hide after 5 seconds for non-critical notifications
      /*if (type !== "red") {
        setTimeout(() => {
          fadeOutAndRemove(notificationBox);
        }, time);
      }*/
    }
    
    // Fade-out and remove function
    function fadeOutAndRemove(element) {
      element.classList.add("fade-out"); // Add fade-out animation
      element.addEventListener("animationend", () => {
        element.remove(); // Remove the element from the DOM after animation ends
      });

    }
    
    // Example usage
    /*showNotification("red", "Critical: Action is required immediately!");
    setTimeout(() => {
      showNotification("yellow", "Important: Please review the changes.");
    }, 2000);
    setTimeout(() => {
      showNotification("green", "Success: Your task has been completed successfully!");
    }, 4000);
    showNotification("red", "Critical: Action is required immediately!");
    */


    
    document.addEventListener("keydown", (e) => {
      // Check for "Escape" key or keyCode 27
      if (e.key === "Escape" || e.keyCode === 27) {
        var fatherDiv = document.getElementById("mainAppContent");
        // Get all direct children that are div elements
        var childDivs = fatherDiv.querySelectorAll(":scope > div");
        // Remove the .show class from each child div
        childDivs.forEach(div => {
          div.classList.remove("show");
        });
        document.getElementById("mainForm").classList.add("show");
        fatherDiv = document.getElementById("note-controls");
        // Get all direct children that are div elements
        childDivs = fatherDiv.querySelectorAll(":scope > button");
        // Remove the .show class from each child div
        childDivs.forEach(div => {
          div.classList.remove("active");
        });
        // close QuickTexts
        document.getElementById("qtTitle").classList.remove("active");
        document.getElementById("presetContainer").classList.add("hidden");
        // close config form
        document.getElementById("configMenuButton").classList.remove("active");
        document.getElementById("configContainer").classList.add("hidden");
      }
    });
    
    // List of messages
    const newMessages = [
      "You're ready to go!",
      "Form cleared and refreshed!",
      "New note started.",
      "Fresh slate ready.",
      "Ready for action!",
      "Fresh note created.",
    ];
    const newMessages2 = [
      "Begin tracking conversation details.",
      "Let's make this call a great one.",
      "Ready to provide excellent support!",
      "Let's make this call productive!",
      "Lets make this a great call.",
      "Let’s help your customer efficiently!",
    ];

    // Keep track of the last message shown
    let lastMessage = "";

    // Function to get a random message
    function getRandomMessage(messageList) {
      let randomMessage;

      do {
        // Pick a random message
        randomMessage = messageList[Math.floor(Math.random() * messageList.length)];
      } while (randomMessage === lastMessage); // Ensure it's not the same as the last message

      // Update the last message
      lastMessage = randomMessage;

      return randomMessage;
    }

    // Function to check if any input inside the fieldset has a value
    function checkVerifFieldset() {

      const fieldset = document.getElementById("verif");
      const inputs = fieldset.querySelectorAll('input[type="checkbox"], input[type="text"], input[type="radio"]');

      const hasValue = Array.from(inputs).some(input => {
        if (input.type === "checkbox" || input.type === "radio") {
          return input.checked; // Check if the checkbox or radio is selected
        } else if (input.type === "text") {
          return input.value.trim() !== ""; // Check if the text box is not empty
        }
        return false;
      });

      if (!hasValue) {
        showNotification("red", "Don't forget entering verification information.", 20000);
      }
    }    

    const presetIcon = document.getElementById("qtTitle");
    //const remTitle = document.getElementById("remTitle");
    const presetContainer = document.getElementById("presetContainer");
    const remContainer = document.getElementById("reminders");
    const newPresetInput = document.getElementById("newPresetInput");
    const addPresetButton = document.getElementById("addPresetButton");
    const presetTexts = document.getElementById("presetTexts");
  
    // Load saved presets from localStorage
    let presets = JSON.parse(localStorage.getItem("presets")) || [];
  
    // Render the saved presets initially
    renderPresavedTexts(presets, presetTexts);
  
    // Add a new preset
    addPresetButton.addEventListener("click", (event) => {
      const newText = newPresetInput.value.trim();
      if (newText) {
        presets.push(newText); // Add new preset
        localStorage.setItem("presets", JSON.stringify(presets)); // Save to localStorage
        renderPresavedTexts(presets, presetTexts); // Re-render the list
        newPresetInput.value = ""; // Clear input field
      }
      event.preventDefault();
    });
  
    // Toggle the visibility of the preset container
    presetIcon.addEventListener("click", (event) => {
      presetContainer.classList.toggle("hidden");
      presetIcon.classList.toggle("active");
      event.preventDefault();
    });
    /*remTitle.addEventListener("click", (event) => {
      remContainer.classList.toggle("hidden");
      remTitle.classList.toggle("active");
      event.preventDefault();
    });*/

    /* Configuraiton Form */ 
    const configMenuButton = document.getElementById("configMenuButton");
    const configContainer = document.getElementById("configContainer");
    const configForm = document.getElementById("configForm");
  
    // Load configuration from localStorage
    const loadConfig = () => {
      const config = JSON.parse(localStorage.getItem("app_config")) || {
        headconf: "", footconf: ""
      };
  
      document.getElementById("headconf").value = config.headconf;
      document.getElementById("footconf").value = config.footconf;
    };

    const getConfig = () => {
      return JSON.parse(localStorage.getItem("app_config")) || null;
    };
  
    // Save configuration to localStorage
    const saveConfig = () => {
      const config = {
        headconf: document.getElementById("headconf").value.trim(),
        footconf: document.getElementById("footconf").value.trim()
      };
      localStorage.setItem("app_config", JSON.stringify(config));
      showNotification("green", "Configuration saved successfully!");
      document.getElementById("configMenuButton").classList.remove("active");
      document.getElementById("configContainer").classList.add("hidden");
    };
  
    // Toggle Config Form visibility
    configMenuButton.addEventListener("click", () => {
      configContainer.classList.toggle("hidden");
      document.getElementById("configMenuButton").classList.toggle("active");
      
    });
  
    // Handle Config Form submission
    configForm.addEventListener("submit", (e) => {
      e.preventDefault(); // Prevent page refresh
      saveConfig(); // Save the configuration
      configContainer.classList.add("hidden"); // Hide the config form after saving
    });
  
    // Initial load of configuration
    loadConfig();








    /* Alert when notes reach 1000 chars */
    const form = document.getElementById("noteForm"); // Replace with your form's ID
    const noteFields = form.querySelectorAll("input, textarea"); // Target all input and textarea elements
    const MAX_CHARACTERS = 1000;
    
      // Function to calculate the note text length
    function calculateNoteLength() {
        // Collect form data
        const noteData = getFormData(); // Ensure getFormData() collects all the form's data
        const noteText = createNoteText(noteData); // Ensure createNoteText() formats the note string
    
        // Count characters
        const characterCount = noteText.length;
        document.getElementById("length").value = characterCount;

        // Alert if the character count exceeds the maximum
        if (characterCount >= MAX_CHARACTERS) {
          document.getElementById("length").classList.add("red");
          //alert(`Warning: Your note exceeds ${MAX_CHARACTERS} characters (${characterCount} characters currently).`);
          //showNotification("red", "Warning: Your note exceeds " + ${MAX_CHARACTERS} + "characters (" + ${characterCount} +  "characters currently).");

        } else {
          document.getElementById("length").classList.remove("red");
        }
    }
    
    // Add event listeners to all input and textarea elements in the form
    noteFields.forEach((field) => {
        field.addEventListener("input", calculateNoteLength);
    });
    
  /*Autosave feature*/

// Autosave functionality
let autoSaveInterval;
let debounceTimer;
//const AUTOSAVE_INTERVAL = 300000; // 5 mins
const DEBOUNCE_DELAY = 1000; // 1 second

// Function to start autosave
function startAutosave() {
  // Set up interval autosave
  /*autoSaveInterval = setInterval(() => {
    saveNote(false);
    showNotification('green', 'Note autosaved (5mins interval)');
  }, AUTOSAVE_INTERVAL);*/

  // Set up autosave on important modifications
  const formElements = document.querySelectorAll('#noteForm input, #noteForm textarea');
  formElements.forEach(element => {
    element.addEventListener('input', debouncedSaveNote);
  });
}

// Debounced version of saveNote
function debouncedSaveNote() {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    saveNote(false);
    //showNotification('green', 'Note autosaved (on modification)');
  }, DEBOUNCE_DELAY);
}

// Function to stop autosave
function stopAutosave() {
  clearInterval(autoSaveInterval);
  const formElements = document.querySelectorAll('#noteForm input, #noteForm textarea');
  formElements.forEach(element => {
    element.removeEventListener('input', debouncedSaveNote);
  });
}

// Call this function when your app initializes or when you want to start autosave
startAutosave();

// Call this function when you want to stop autosave (e.g., when closing the app)
// stopAutosave();





function getNotesListCSV() {
    const notesString = localStorage.getItem("notes");
    const notes = JSON.parse(notesString) || [];

    let csvContent = "";//"data:text/csv;charset=utf-8,";
    
    csvContent += "Note ID,Date Time,Customer Name,Caller Name,CID,BAN,CBR,TVS Code,Issue,Analysis,Actions\n";

    // Helper function to escape and format CSV field
    function escapeCSVField(field) {
        if (field === null || field === undefined) {
            return '""';
        }
        
        // Convert to string and escape special characters
        const stringField = String(field)
            .replace(/\n/g, ' ') // Replace newlines with spaces
            .replace(/\r/g, ' ') // Replace carriage returns with spaces
            .replace(/"/g, '""'); // Escape quotes by doubling them

        // If the field contains quotes, commas, or newlines, wrap it in quotes
        if (stringField.includes('"') || stringField.includes(',') || stringField.includes('\n') || stringField.includes('\r')) {
            return `"${stringField}"`;
        }
        
        return stringField || '""';
    }

    // Add data rows
    notes.forEach(note => {
        const row = [
            note.noteid,
            note.datetime,
            note.name,
            note.callername,
            note.cid,
            note.ban,
            note.cbr,
            note.tvs_code,
            note.issue,
            note.topology,
            note.actions
        ].map(escapeCSVField).join(",");
        csvContent += row + "\n";
    });

    return csvContent;
}

function downloadCSV() {
    let csvContent = getNotesListCSV();
    // Create a download link and trigger the download
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "notes_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Add event listener to the download button
document.addEventListener('DOMContentLoaded', () => {
    const downloadBtn = document.getElementById('downloadCSV');
    if (downloadBtn) {
        downloadBtn.addEventListener('click', downloadCSV);
    }
});


/**/
/*

*/

function generateSummary() {
    const notesString = localStorage.getItem("notes");
    const notes = JSON.parse(notesString) || [];

    // Group notes by date
    const groupedNotes = notes.reduce((acc, note) => {
        const dateParts = note.datetime.split(' ');
        const date = `${dateParts[0]}-${dateParts[1]}-${dateParts[2]}`;
        
        if (!acc[date]) {
            acc[date] = { total: 0, tvs: 0, dis: 0, piws: 0, bosr: 0, spoc: 0, nctix: 0, swfp: 0 };
        }
        acc[date].total++;
        if (note.chklsttvs === "YES") {
            acc[date].tvs++;
        }
	if (note.chklstdis === "YES") {
            acc[date].dis++;
        }
	if (note.piws === "PIWS") {
            acc[date].piws++;
        }
	if (note.bosr === "BOSR") {
            acc[date].bosr++;
        }
	if (note.spoc === "SPOC") {
            acc[date].spoc++;
        }
	if (note.nctix === "NCTIX") {
            acc[date].nctix++;
        }
	if (note.soldwfp === "SOLDWFP") {
            acc[date].swfp++;
        }
        return acc;
    }, {});

    // Sort dates in ascending order first
    const chronologicalDates = Object.keys(groupedNotes).sort();

    // Prepare data structure for rows
    let tableRows = [];
    let weekTotal = { calls: 0, tvs: 0, dis: 0, piws: 0, bosr: 0, spoc: 0, nctix: 0, swfp: 0 };
    let monthTotal = { calls: 0, tvs: 0, dis: 0, piws: 0, bosr: 0, spoc: 0, nctix: 0, swfp: 0 };
    let currentWeekNumber = null;
    let currentMonth = null;

    // Process dates chronologically
    chronologicalDates.forEach((date, index) => {
        const { total, tvs, dis, piws, bosr, spoc, nctix, swfp } = groupedNotes[date];
        const [year, month, day] = date.split('-');
        const currentDate = new Date(year, month - 1, day);
        
        // Format date
        const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
        const displayDate = currentDate.toLocaleDateString('en-US', options);
        
        // Add to totals
        weekTotal.calls += total;
        weekTotal.tvs += tvs;
        weekTotal.dis += dis;
        weekTotal.piws += piws;
        weekTotal.bosr += bosr;
        weekTotal.spoc += spoc;
        weekTotal.nctix += nctix;
        weekTotal.swfp += swfp;

        monthTotal.calls += total;
        monthTotal.tvs += tvs;
        monthTotal.dis += dis;
        monthTotal.piws += piws;
        monthTotal.bosr += bosr;
        monthTotal.spoc += spoc;
        monthTotal.nctix += nctix;
        monthTotal.swfp += swfp;

        // Check week and month boundaries
        const weekNumber = getWeekNumber(currentDate);
        const monthKey = `${year}-${month}`;
        const isLastDayOfWeek = currentDate.getDay() === 0;
        const isLastDayOfMonth = new Date(year, month - 1, parseInt(day) + 1).getMonth() !== currentDate.getMonth();
        
        // Add daily row
        tableRows.push({
            type: 'day',
            html: `
                <tr>
                    <td>${displayDate}</td>
                    <td>${total}</td>
                    <td>${tvs} (${((tvs / total) * 100).toFixed(1)}%)</td>
                    <td>${dis}</td>
                    <td>${piws}</td>
                    <td>${bosr}</td>
                    <td>${spoc}</td>
                    <td>${nctix}</td>
                    <td>${swfp}</td>
                </tr>`
        });

        // Add weekly summary if it's end of week
        if (isLastDayOfWeek || index === chronologicalDates.length - 1) {
            if (weekTotal.calls > 0) {
                tableRows.push({
                    type: 'week',
                    html: `
                        <tr class="weekly-summary">
                            <td>Week ${weekNumber}</td>
                            <td>${weekTotal.calls}</td>
                            <td>${weekTotal.tvs} (${((weekTotal.tvs / weekTotal.calls) * 100).toFixed(1)}%)</td>
                            <td>${weekTotal.dis}</td>
                            <td>${weekTotal.piws}</td>
                            <td>${weekTotal.bosr}</td>
                            <td>${weekTotal.spoc}</td>
                            <td>${weekTotal.nctix}</td>
                            <td>${weekTotal.swfp}</td>
                        </tr>`
                });
            }
            weekTotal = { calls: 0, tvs: 0, dis: 0, piws: 0, bosr: 0, spoc: 0, nctix: 0, swfp: 0 };
        }

        // Add monthly summary if it's end of month
        if (isLastDayOfMonth || index === chronologicalDates.length - 1) {
            if (monthTotal.calls > 0) {
                tableRows.push({
                    type: 'month',
                    html: `
                        <tr class="monthly-summary">
                            <td>${currentDate.toLocaleString('default', { month: 'long' })} ${year}</td>
                            <td>${monthTotal.calls}</td>
                            <td>${monthTotal.tvs} (${((monthTotal.tvs / monthTotal.calls) * 100).toFixed(1)}%)</td>
                            <td>${monthTotal.dis}</td>
                            <td>${monthTotal.piws}</td>
                            <td>${monthTotal.bosr}</td>
                            <td>${monthTotal.spoc}</td>
                            <td>${monthTotal.nctix}</td>
                            <td>${monthTotal.swfp}</td>
                        </tr>`
                });
            }
            monthTotal = { calls: 0, tvs: 0, dis: 0, piws: 0, bosr: 0, spoc: 0, nctix: 0, swfp: 0 };
        }
    });

    // Generate final HTML with reversed order
    let summaryHTML = '<table class="summary-table">';
    summaryHTML += `
        <thead>
            <tr>
                <th>Date</th>
                <th>Total Calls</th>
                <th>TVS uses</th>
                <th>Dis- patch</th>
                <th>PIWS</th>
                <th>BOSR</th>
                <th>SPOC</th>
                <th>NCTix</th>
                <th>Sold Wifi+</th>
            </tr>
        </thead>
        <tbody>`;

    // Add rows in reverse order
    tableRows.reverse().forEach(row => {
        summaryHTML += row.html;
    });

    summaryHTML += '</tbody></table>';
    return summaryHTML;
}

// Helper function to get week number
function getWeekNumber(date) {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(),0,1));
    return Math.ceil((((d - yearStart) / 86400000) + 1)/7);
}





function displaySummary() {
    const summaryContent = document.getElementById('summaryContent');
    summaryContent.innerHTML = generateSummary();
}

function generateMonthlySummary() {
    const notesString = localStorage.getItem("notes");
    const notes = JSON.parse(notesString) || [];

    // Group notes by month
    const groupedNotes = notes.reduce((acc, note) => {
        // Parse the datetime string (format: "YYYY MM DD HH:MM:SS")
        const [year, month] = note.datetime.split(' ');
        const monthKey = `${year}-${month}`;
        
        if (!acc[monthKey]) {
            acc[monthKey] = { total: 0, tvs: 0 };
        }
        acc[monthKey].total++;
        if (note.chklsttvs === "YES") {
            acc[monthKey].tvs++;
        }
        return acc;
    }, {});

    // Sort months in descending order (most recent first)
    const sortedMonths = Object.keys(groupedNotes).sort().reverse();

    // Generate HTML
    let summaryHTML = '<table class="summary-table">';
    summaryHTML += `
        <tr>
            <th>Month</th>
            <th>Total Calls</th>
            <th>Calls with TVS</th>
            <th>TVS Usage %</th>
        </tr>`;

    let totalCalls = 0;
    let totalTVS = 0;

    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"];

    sortedMonths.forEach(monthKey => {
        const { total, tvs } = groupedNotes[monthKey];
        const tvsPercentage = ((tvs / total) * 100).toFixed(1);
        
        totalCalls += total;
        totalTVS += tvs;

        // Format month for display
        const [year, month] = monthKey.split('-');
        const displayMonth = `${monthNames[parseInt(month) - 1]} ${year}`;

        summaryHTML += `
            <tr>
                <td>${displayMonth}</td>
                <td>${total}</td>
                <td>${tvs}</td>
                <td>${tvsPercentage}%</td>
            </tr>`;
    });

    // Add totals row
    const totalTVSPercentage = ((totalTVS / totalCalls) * 100).toFixed(1);
    summaryHTML += `
        <tr class="summary-totals">
            <td><strong>Totals</strong></td>
            <td><strong>${totalCalls}</strong></td>
            <td><strong>${totalTVS}</strong></td>
            <td><strong>${totalTVSPercentage}%</strong></td>
        </tr>`;

    summaryHTML += '</table>';

    return summaryHTML;
}

function displayMonthlySummary() {
    const monthlySummaryContent = document.getElementById('monthlySummaryContent');
    monthlySummaryContent.innerHTML = generateMonthlySummary();
}

  document.getElementById("summaryTabBtn").addEventListener("click", async (e) => {
    displaySummary();
    displayMonthlySummary();
    e.preventDefault();
  });


/* Nav buttons */
function loadNextNote() {
    // Get current note ID
    const currentNoteId = parseInt(document.getElementById("noteid").value);
    
    // Get all notes from localStorage
    const notesString = localStorage.getItem("notes");
    const notes = JSON.parse(notesString) || [];
    
    // Sort notes by ID
    notes.sort((a, b) => parseInt(a.noteid) - parseInt(b.noteid));
    
    // Find the next note
    const nextNote = notes.find(note => parseInt(note.noteid) > currentNoteId);
    
    if (nextNote) {
        loadNoteToForm(nextNote);
        showNotification("green", `Loaded note #${nextNote.noteid}`);
    } else {
        showNotification("yellow", "No more notes available");
    }
}
function loadPreviousNote() {
    // Get current note ID
    const currentNoteId = parseInt(document.getElementById("noteid").value);
    
    // Get all notes from localStorage
    const notesString = localStorage.getItem("notes");
    const notes = JSON.parse(notesString) || [];
    
    // Sort notes by ID in descending order to find previous
    notes.sort((a, b) => parseInt(b.noteid) - parseInt(a.noteid));
    
    // Find the previous note
    const prevNote = notes.find(note => parseInt(note.noteid) < currentNoteId);
    
    if (prevNote) {
        loadNoteToForm(prevNote);
        showNotification("green", `Loaded note #${prevNote.noteid}`);
    } else {
        showNotification("yellow", "No previous notes available");
    }
}

  document.getElementById("nextNoteBtn").addEventListener("click", async (e) => {
	loadNextNote();
  });
  document.getElementById("prevNoteBtn").addEventListener("click", async (e) => {
	loadPreviousNote();
  });


    
});

/********************/


/* Quick Texts */ 
let lastFocusedElement = null; // To track the last focused input/textarea

// Listen for focus events on all inputs and textareas
document.addEventListener("focusin", (e) => {
  if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") {
    lastFocusedElement = e.target;
  }
});

// Function to insert text at the cursor position
function insertTextAtCursor(element, text) {
  if (!element) return; // If no element is focused, do nothing

  if (element.tagName === "INPUT" || element.tagName === "TEXTAREA") {
    const start = element.selectionStart;
    const end = element.selectionEnd;

    // Insert the text at the cursor position
    const newValue =
      element.value.substring(0, start) + text + element.value.substring(end);

    element.value = newValue;

    // Move the cursor to the end of the inserted text
    const cursorPosition = start + text.length;
    element.setSelectionRange(cursorPosition, cursorPosition);
    element.focus(); // Refocus the element
  }
}

// Render presaved texts and attach click events
function renderPresavedTexts(presets, container) {
  container.innerHTML = ""; // Clear the container

  presets.forEach((preset, index) => {
    const presetDiv = document.createElement("div");
    presetDiv.className = "preset-text";

    const textSpan = document.createElement("span");
    textSpan.className = "text";
    textSpan.textContent = preset;

    const removeButton = document.createElement("span");
    removeButton.className = "remove";
    removeButton.textContent = "x";

    // Insert text into the focused input/textarea when clicked
    textSpan.addEventListener("click", (event) => {
      insertTextAtCursor(lastFocusedElement, preset);
      event.preventDefault();
    });

    // Remove the preset text when the 'x' is clicked
    removeButton.addEventListener("click", (event) => {
      presets.splice(index, 1);
      localStorage.setItem("presets", JSON.stringify(presets)); // Save updated presets
      renderPresavedTexts(presets, container); // Re-render the list
      event.preventDefault();
    });

    presetDiv.appendChild(textSpan);
    presetDiv.appendChild(removeButton);
    container.appendChild(presetDiv);
  });
}


// Example Initialization Code
document.addEventListener("DOMContentLoaded", () => {

});

/*TABS functionality*/
class TabSystem {
    constructor(container) {
        this.container = container;
        this.tabs = container.querySelectorAll('.tabs-nav li');
        this.contents = container.querySelectorAll('.tab-content');
        this.init();
    }

    init() {
        this.tabs.forEach(tab => {
            tab.addEventListener('click', () => this.switchTab(tab));
        });
    }

    switchTab(selectedTab) {
        // Remove active class from all tabs and contents
        this.tabs.forEach(tab => tab.classList.remove('active'));
        this.contents.forEach(content => content.classList.remove('active'));

        // Add active class to selected tab and corresponding content
        selectedTab.classList.add('active');
        const contentId = selectedTab.getAttribute('data-tab');
        const content = this.container.querySelector(`#${contentId}`);
        if (content) {
            content.classList.add('active');
        }
    }
}

// Initialize the tab system
document.addEventListener('DOMContentLoaded', () => {
    const tabsContainers = document.querySelectorAll('.tabs-container');
    tabsContainers.forEach(container => new TabSystem(container));
});


  