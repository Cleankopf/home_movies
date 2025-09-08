// Load JSON data once at startup
let folders = [];
let movies = [];

fetch("data/data.json")
  .then((response) => {
    if (!response.ok) throw new Error("Failed to load data.json");
    return response.json();
  })
  .then((data) => {
    folders = data.folders.map((f) => f.name);

    data.folders.forEach((folder) => {
      folder.movies.forEach((title) => {
        movies.push([folder.id, title]);
      });
    });
  })
  .catch((error) => {
    const resultsDiv = document.getElementById("results");
    resultsDiv.innerHTML = `<p style="color:red;">Error loading data.json: ${error.message}</p>`;
  });

// Shared handler for lookup
function handleLookup() {
  const searchString = document.getElementById("lookup-input").value.trim();
  const resultsDiv = document.getElementById("results");
  resultsDiv.innerHTML = ""; // Clear previous results

  if (searchString === "") {
    resultsDiv.innerHTML = `<p>Please enter a search term.</p>`;
    return;
  }

  let previousFolder = "";
  let ucSearchString = searchString.toUpperCase();
  let found = false;

  for (let i = 0; i < movies.length; i++) {
    let ucMovie = movies[i][1].toUpperCase();
    let startIndex = ucMovie.indexOf(ucSearchString);

    if (startIndex !== -1) {
      found = true;

      let outputMovie =
        "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" +
        movies[i][1].substring(0, startIndex) +
        `<span style="color:red;">${movies[i][1].substring(startIndex, startIndex + searchString.length)}</span>` +
        movies[i][1].substring(startIndex + searchString.length);

      if (folders[movies[i][0] - 1] !== previousFolder) {
        previousFolder = folders[movies[i][0] - 1];
        resultsDiv.innerHTML += `<p><strong>${previousFolder}</strong><br/>${outputMovie}</p>`;
      } else {
        resultsDiv.innerHTML += `<p>${outputMovie}</p>`;
      }
    }
  }

  if (!found) {
    resultsDiv.innerHTML = `<p><span style="color:red;">${searchString}</span> was not found.</p>`;
  }

  document.getElementById("lookup-input").value = ""; // Clear input
}

// ✅ Add both click and touchstart listeners for OK button
const okButton = document.getElementById("lookup-ok");
okButton.addEventListener("click", handleLookup);
okButton.addEventListener("touchstart", (e) => {
  e.preventDefault(); // Prevents ghost click
  handleLookup();
}, { passive: false });

// ✅ Handle lookup when Enter key is pressed
document.getElementById("lookup-input").addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    handleLookup();
  }
});

// Optional: Handle Cancel button
document.getElementById("lookup-cancel").addEventListener("click", () => {
  document.getElementById("lookup-input").value = "";
  document.getElementById("results").innerHTML = "";
});
