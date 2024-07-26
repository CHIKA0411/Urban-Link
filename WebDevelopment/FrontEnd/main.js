const API_KEY = "AIzaSyAoFg5p_crG-goL8ZQWT_aHFoETgLx-Zls"; // Google Sheets API key
const SHEET_ID = "1mEMrp91VNHyOikTJ_b8-1p9ftM_-Hzo14qf6dzuTO5U"; // Google Sheets ID
const RANGE = "FormData!A2:G"; // Range of your data

async function fetchSheetData() {
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${RANGE}?key=${API_KEY}`;
  //const url = `https://sheets.googleapis.com/v4/spreadsheets/1mEMrp91VNHyOikTJ_b8-1p9ftM_-Hzo14qf6dzuTO5U/values/FormData!A2:G?key=AIzaSyAoFg5p_crG-goL8ZQWT_aHFoETgLx-Zls`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Network response was not ok " + response.statusText);
    }
    const data = await response.json();
    updateApartmentGrid(data.values);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

function updateApartmentGrid(data) {
  const grid = document.getElementById("apartment-grid");
  grid.innerHTML = "";

  data.forEach((row) => {
    const apartmentNumber = row[0];
    const maintenanceStatus = row[5];
    const vacantStatus = row[6];

    let boxClass = "";
    let details = "";

    if (maintenanceStatus === "yes") {
      boxClass = "issue";
      details = `Apartment ${apartmentNumber} - Maintenance Required`;
    } else if (vacantStatus === "yes") {
      boxClass = "vacant";
      details = `Apartment ${apartmentNumber} - Vacant`;
    } else {
      details = `Apartment ${apartmentNumber} - Maintenance Not Required`;
    }

    const apartmentBox = document.createElement("div");
    apartmentBox.className = `col-sm-6 col-md-4 col-lg-3 mb-4`;
    apartmentBox.innerHTML = `
      <div class="apartment-box ${boxClass} p-3" data-details="${details}">
        ${apartmentNumber}
      </div>
    `;

    grid.appendChild(apartmentBox);
  });
}

document.addEventListener("DOMContentLoaded", fetchSheetData);

document
  .getElementById("delete-apartment-form")
  .addEventListener("submit", async function (event) {
    event.preventDefault();
    const apartmentNumberToDelete = document.getElementById(
      "apartment-number-delete"
    ).value;

    try {
      const sheetUrl = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values:batchGet?ranges=${RANGE}&key=${API_KEY}`;
      const response = await fetch(sheetUrl);
      const data = await response.json();
      console.log("Fetched data:", data); //Debugging Purposes
      //console.log("Value range:", data.valueRanges[0]); //Debugging Purposes
      //Returns the expected data
      /*const rows = data.valueRanges[0].values;
      console.log("Fetched rows:", rows);*///Debugging Purposes
      const rows = data.valueRanges[0].values;
      console.log("Fetched rows:", rows); //Debugging Purposes
      //Why the hell does it return undefined if the fucking data variable has DATA

      const rowIndex = rows.findIndex(
        (row) => row[0] === apartmentNumberToDelete
      );
      if (rowIndex === -1) {
        alert("Apartment number not found.");
        return;
      }

      await deleteRow(rowIndex + 1); // +1 to account for header row

      alert("Apartment deleted successfully.");
      fetchSheetData(); // Refresh the apartment grid
    } catch (error) {
      console.error("Error deleting apartment:", error);
    }
  });

async function deleteRow(rowIndex) {
  const requests = [
    {
      deleteDimension: {
        range: {
          sheetId: 0,
          dimension: "ROWS",
          startIndex: rowIndex,
          endIndex: rowIndex + 1,
        },
      },
    },
  ];

  const batchUpdateUrl = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}:batchUpdate?key=${API_KEY}`;
  await fetch(batchUpdateUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ requests }),
  });
}

function deleteApartment(apartmentNumber) {
  document.getElementById("apartment-number-delete").value = apartmentNumber;
  document
    .getElementById("delete-apartment-form")
    .dispatchEvent(new Event("submit"));
}
