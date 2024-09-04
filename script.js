var globalYearSelect = "";
var globalMonthSelect = "";

let itemsPerPage = 6;
let currentPage = 1; // Start with the first page

function reorderSelectOptions(selectId) {
    const selectElement = document.getElementById(selectId);
    if (!selectElement) {
        console.error('Select element not found');
        return;
    }

    const options = Array.from(selectElement.querySelectorAll('option'));
    const [selectYearOption, ...yearOptions] = options;

    yearOptions.sort((a, b) => parseInt(b.value) - parseInt(a.value));
    selectElement.innerHTML = '';
    selectElement.appendChild(selectYearOption);
    yearOptions.forEach(option => selectElement.appendChild(option));
}

// Function to get the option at a specified index
function getOptionAtIndex(selectId, index) {
    const selectElement = document.getElementById(selectId);
    if (!selectElement) {
        console.error('Select element not found');
        return null;
    }
    const options = selectElement.options;
    if (index < 0 || index >= options.length) {
        console.error('Index out of range');
        return null;
    }
    return options[index];
}

// Function to update the inner text of the span with class 'loadYear'
function updateLoadYear(newYear) {
    const loadYearSpan = document.querySelector('.filter-reciprocate .loadYear');
    if (!loadYearSpan) {
        console.error('Span element with class "loadYear" not found');
        return;
    }
    loadYearSpan.innerText = newYear;
    globalYearSelect = newYear;
    fetchLoadedData();
}

function updateMonth(newMonth) {
    const loadMonthSpan = document.querySelector('.filter-reciprocate .loadMonth');
    if (!loadMonthSpan) {
        console.error('Span element with class "loadMonth" not found');
        return;
    }
    loadMonthSpan.innerText = newMonth ? ` | ${newMonth} ` : '';
    globalMonthSelect = newMonth;
    fetchLoadedData();
}

// Function to handle the change event of the select element
function handleSelectChange(event) {
    const selectedValue = event.target.value;
    updateLoadYear(selectedValue);
}

function handleSelectChangeMonth(event) {
    const selectMonthValue = event.target.value;
    updateMonth(selectMonthValue);
}

// Ensure the DOM is fully loaded before running the code
document.addEventListener('DOMContentLoaded', () => {
    // Reorder the options in the select element
    reorderSelectOptions('year-select');

    // Set initial value of loadYear span
    const initialOption = getOptionAtIndex('year-select', 1);
    if (initialOption) {
        updateLoadYear(initialOption.value);
    }

    // Add event listener for changes to the select element
    const selectElement = document.getElementById('year-select');
    if (selectElement) {
        selectElement.addEventListener('change', handleSelectChange);
    }

    const selectElementMonth = document.getElementById('month-select');
    if (selectElementMonth) {
        selectElementMonth.addEventListener('change', handleSelectChangeMonth);
    }

    // Event listener for Load More button
    document.getElementById('load-more-btn').addEventListener('click', () => {
        // Show loading effect
        document.getElementById('load-more-btn').innerHTML = '<span class="loading"></span>';
    
        // Simulate loading delay (e.g., 1 second)
        setTimeout(() => {
            currentPage++;
            fetchLoadedData();
            // Reset button text
            document.getElementById('load-more-btn').innerHTML = 'Load More <span><img src="./Images/down-arrow.svg" alt=""></span>';
        }, 1000); // Adjust the delay as needed
    });

    // Event listener for Load Less button
    document.getElementById('load-less-btn').addEventListener('click', () => {
        // Show loading effect
        document.getElementById('load-less-btn').innerHTML = '<span class="loading"></span>';

        // Simulate loading delay (e.g., 1 second)
        setTimeout(() => {
            if (currentPage > 1) {
                currentPage=1;
                fetchLoadedData();
            }
            // Reset button text
            document.getElementById('load-less-btn').innerHTML = 'Load Less <span><img src="./Images/up-arrow.svg" alt=""></span>';
        }, 1000); // Adjust the delay as needed
    });
});

function fetchLoadedData() {
    const pageGridEntries = Array.from(document.querySelectorAll('.page-grid .page-grid-entry'));
    
    // Filter and display entries based on globalYearSelect and globalMonthSelect
    pageGridEntries.forEach(entry => {
        const dateYearSelect = entry.querySelector('.dateYearSelect');

        if (dateYearSelect) {
            const dateString = dateYearSelect.textContent.trim();
            const monthMatch = dateString.match(/^[A-Za-z]+/);
            const yearMatch = dateString.match(/\b\d{4}\b/);

            const year = yearMatch ? yearMatch[0] : null;
            const month = monthMatch ? monthMatch[0] : null;

            if (globalMonthSelect !== "") {
                entry.style.display = (year === globalYearSelect && month === globalMonthSelect) ? 'block' : 'none';
            } else {
                entry.style.display = (year === globalYearSelect) ? 'block' : 'none';
            }
        } else {
            entry.style.display = 'none';
        }
    });

    // Pagination logic
    const visibleEntries = pageGridEntries.filter(entry => entry.style.display === 'block');
    const totalEntries = visibleEntries.length;
    const totalPages = Math.ceil(totalEntries / itemsPerPage);

    // Update button visibility
    const loadMoreBtn = document.getElementById('load-more-btn');
    const loadLessBtn = document.getElementById('load-less-btn');

     // Update button visibility
     if (totalPages <= 1) {
        loadMoreBtn.style.display = 'none'; // Show Load More button
        loadLessBtn.style.display = 'none';  // Hide Load Less button
    } 
     else if (totalPages !==1 && currentPage < totalPages) {
         loadMoreBtn.style.display = 'block'; // Show Load More button
         loadLessBtn.style.display = 'none';  // Hide Load Less button
     } else {
         loadMoreBtn.style.display = 'none';  // Hide Load More button
         loadLessBtn.style.display = 'block'; // Show Load Less button
     }


     // Show items from the start up to and including the current page
     visibleEntries.forEach((entry, index) => {
        entry.style.display = (index < currentPage * itemsPerPage) ? 'block' : 'none';
    });

      // Check if there are no visible entries
      const noDataDiv = document.querySelector('.no-data');
      if (visibleEntries.length === 0) {
          if (noDataDiv) {
              noDataDiv.style.display = 'flex'; // Show no-data message
          }
      } else {
          if (noDataDiv) {
              noDataDiv.style.display = 'none'; // Hide no-data message
          }
      }

      
}
