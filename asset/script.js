function createInputFields() {
    var processes = parseInt(document.getElementById("processes").value);
    var inputFields = document.getElementById("inputFields");
    inputFields.innerHTML = ""; // hapus input sebelumnya

    for (var i = 1; i <= processes; i++) {
        var labelAllocated = document.createElement("label");
        labelAllocated.textContent = "Input alokasi untuk resources Process " + i + ": ";
        var inputAllocated = document.createElement("input");
        inputAllocated.type = "text";
        inputAllocated.id = "allocated" + i;
        inputFields.appendChild(labelAllocated);
        inputFields.appendChild(inputAllocated);

        var labelMaxNeed = document.createElement("label");
        labelMaxNeed.textContent = "Maksimal Process " + i + ": ";
        var inputMaxNeed = document.createElement("input");
        inputMaxNeed.type = "text";
        inputMaxNeed.id = "maxNeed" + i;
        inputFields.appendChild(labelMaxNeed);
        inputFields.appendChild(inputMaxNeed);

        var runButton = document.createElement("button");
        runButton.textContent = "Run Algoritma";
        runButton.onclick = function () {
            runAlgorithmStep(i);
        };
        inputFields.appendChild(runButton);

        inputFields.appendChild(document.createElement("br"));
    }
}

function runBankersAlgorithm() {
    var resources = parseInt(document.getElementById("resources").value);
    var processes = parseInt(document.getElementById("processes").value);
    var maxResources = document.getElementById("maxResources").value.split(" ").map(Number);

    var currentlyAllocated = [];
    for (var j = 0; j < processes; j++) {
        currentlyAllocated.push(
            document.getElementById("allocated" + (j + 1)).value.split(" ").map(Number)
        );
    }

    var maxNeed = [];
    for (var j = 0; j < processes; j++) {
        maxNeed.push(
            document.getElementById("maxNeed" + (j + 1)).value.split(" ").map(Number)
        );
    }

    var allocated = Array(resources).fill(0);
    for (var i = 0; i < processes; i++) {
        for (var j = 0; j < resources; j++) {
            allocated[j] += currentlyAllocated[i][j];
        }
    }

    var available = maxResources.map(function (val, index) {
        return val - allocated[index];
    });

    var running = Array(processes).fill(true);
    var count = processes;

    var outputTable = document.getElementById("outputTable");
    outputTable.innerHTML = ""; // hapus sebelumnya output nilai

    while (count !== 0) {
        var safe = false;
        for (var i = 0; i < processes; i++) {
            if (running[i]) {
                var executing = true;
                for (var j = 0; j < resources; j++) {
                    if (maxNeed[i][j] - currentlyAllocated[i][j] > available[j]) {
                        executing = false;
                        break;
                    }
                }
                if (executing) {
                    console.log("Process " + (i + 1) + " running");
                    running[i] = false;
                    count--;
                    safe = true;
                    for (var j = 0; j < resources; j++) {
                        available[j] += currentlyAllocated[i][j];
                    }

                    // Display the table
                    displayTable(outputTable, resources, currentlyAllocated[i], available, i + 1, safe);
                    break;
                }
            }
        }
        if (!safe) {
            console.log("The process is in an unsafe state.");
            break;
        }
    }
}

function displayTable(outputTable, resources, allocated, available, processNumber, safe) {
    var table = document.createElement("table");
    var headerRow = table.insertRow();
    var processHeader = headerRow.insertCell(0);
    processHeader.innerHTML = "<b>Process " + processNumber + "</b>";

    for (var i = 1; i <= resources; i++) {
        var resourceHeader = headerRow.insertCell(i);
        resourceHeader.innerHTML = "<b>Resource " + i + "</b>";
    }

    var row = table.insertRow();
    var processCell = row.insertCell(0);
    processCell.innerHTML = "Running Process " + processNumber;

    for (var i = 0; i < resources; i++) {
        var resourceCell = row.insertCell(i + 1);
        resourceCell.innerHTML = allocated[i];
    }

    var availableRow = table.insertRow();
    var availableCell = availableRow.insertCell(0);
    availableCell.innerHTML = "<b>Available Resources</b>";

    for (var i = 0; i < resources; i++) {
        var availableResourceCell = availableRow.insertCell(i + 1);
        availableResourceCell.innerHTML = available[i];
    }

    var safetyRow = table.insertRow();
    var safetyCell = safetyRow.insertCell(0);
    safetyCell.colSpan = resources + 1;
    safetyCell.classList.add(safe ? "safe" : "unsafe");
    safetyCell.innerHTML = safe ? "Safe" : "Unsafe";

    outputTable.appendChild(table);
}

function runAlgorithmStep(processNumber) {
    var resources = parseInt(document.getElementById("resources").value);
    var maxResources = document.getElementById("maxResources").value.split(" ").map(Number);

    var currentlyAllocated = [];
    for (var j = 0; j < processNumber; j++) {
        currentlyAllocated.push(
            document.getElementById("allocated" + (j + 1)).value.split(" ").map(Number)
        );
    }

    var maxNeed = [];
    for (var j = 0; j < processNumber; j++) {
        maxNeed.push(
            document.getElementById("maxNeed" + (j + 1)).value.split(" ").map(Number)
        );
    }

    var allocated = Array(resources).fill(0);
    for (var i = 0; i < processNumber; i++) {
        for (var j = 0; j < resources; j++) {
            allocated[j] += currentlyAllocated[i][j];
        }
    }

    var available = maxResources.map(function (val, index) {
        return val - allocated[index];
    });

    var running = Array(processNumber).fill(true);
    var count = processNumber;

    var outputTable = document.getElementById("outputTable");
    outputTable.innerHTML = ""; // hapus sebelumnya output nilai

    var safe = false;
    for (var i = 0; i < processNumber; i++) {
        if (running[i]) {
            var executing = true;
            for (var j = 0; j < resources; j++) {
                if (maxNeed[i][j] - currentlyAllocated[i][j] > available[j]) {
                    executing = false;
                    break;
                }
            }
            if (executing) {
                console.log("Process " + (i + 1) + " running");
                running[i] = false;
                count--;
                safe = true;
                for (var j = 0; j < resources; j++) {
                    available[j] += currentlyAllocated[i][j];
                }

                // Tampilan tabel
                displayTable(outputTable, resources, currentlyAllocated[i], available, i + 1, safe);
                break;
            }
        }
    }
    if (!safe) {
        console.log("The process is in an unsafe state.");
    }
}