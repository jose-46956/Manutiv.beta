let machines = JSON.parse(localStorage.getItem('machines')) || [];
let editMachineId = null;

// Função para calcular próxima lubrificação e dias restantes
function calculateNextLubrification(lastLubrification, interval) {
  const nextLubrificationDate = new Date(lastLubrification);
  nextLubrificationDate.setDate(nextLubrificationDate.getDate() + interval);
  const today = new Date();
  const diffTime = nextLubrificationDate - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return {
    nextLubrification: nextLubrificationDate.toLocaleDateString(),
    daysLeft: diffDays
  };
}

// Renderizar a tabela de máquinas
function renderTable() {
  const tableBody = document.querySelector("#machineTable tbody");
  tableBody.innerHTML = "";
  machines.forEach(machine => {
    const { nextLubrification, daysLeft } = calculateNextLubrification(machine.lastLubrification, machine.interval);

    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${machine.ni}</td>
      <td>${machine.name}</td>
      <td>${new Date(machine.lastLubrification).toLocaleDateString()}</td>
      <td>${machine.interval}</td>
      <td>${nextLubrification}</td>
      <td>${daysLeft}</td>
      <td>${machine.details}</td>
      <td>
        <button onclick="editMachine(${machine.id})">Editar</button>
        <button onclick="deleteMachine(${machine.id})">Excluir</button>
      </td>
    `;
    tableBody.appendChild(row);
  });
  localStorage.setItem('machines', JSON.stringify(machines));
}

// Adicionar nova máquina
document.getElementById("addMachineButton").addEventListener("click", () => {
  const newMachine = {
    id: machines.length + 1,
    ni: `NI-${machines.length + 1}`,
    name: `Máquina ${machines.length + 1}`,
    lastLubrification: new Date(),
    interval: 30,
    details: "Detalhes da lubrificação"
  };
  machines.push(newMachine);
  renderTable();
});

// Editar máquina
function editMachine(id) {
  const machine = machines.find(m => m.id === id);
  if (machine) {
    document.getElementById("editNI").value = machine.ni;
    document.getElementById("editName").value = machine.name;
    document.getElementById("editLastLubrification").valueAsDate = new Date(machine.lastLubrification);
    document.getElementById("editInterval").value = machine.interval;
    document.getElementById("editDetails").value = machine.details;
    editMachineId = id;
    document.getElementById("editModal").style.display = "block";
  }
}

// Salvar edição
document.getElementById("saveEditButton").addEventListener("click", () => {
  const ni = document.getElementById("editNI").value;
  const name = document.getElementById("editName").value;
  const lastLubrification = new Date(document.getElementById("editLastLubrification").value);
  const interval = parseInt(document.getElementById("editInterval").value);
  const details = document.getElementById("editDetails").value;

  const machineIndex = machines.findIndex(m => m.id === editMachineId);
  if (machineIndex !== -1) {
    machines[machineIndex].ni = ni;
    machines[machineIndex].name = name;
    machines[machineIndex].lastLubrification = lastLubrification;
    machines[machineIndex].interval = interval;
    machines[machineIndex].details = details;
  }

  document.getElementById("editModal").style.display = "none";
  renderTable();
});

// Excluir máquina
function deleteMachine(id) {
  machines = machines.filter(m => m.id !== id);
  renderTable();
}

// Adicionar manuais
document.getElementById('manualForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const fileInput = document.getElementById('manualFile');
  const file = fileInput.files[0];
  if (file) {
    const manualList = document.getElementById('manualTable tbody');
    const row = document.createElement('tr');
    row.innerHTML = `<td>${file.name}</td>`;
    manualList.appendChild(row);
    fileInput.value = ''; // Limpar campo
  }
});

// Adicionar informações técnicas
document.getElementById('infoForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const manualText = document.getElementById('manualText').value;
  if (manualText) {
    const infoTableBody = document.querySelector("#infoTable tbody");
    const row = document.createElement('tr');
    row.innerHTML = `<td>${manualText}</td>`;
    infoTableBody.appendChild(row);
    document.getElementById('manualText').value = ''; // Limpar campo
  }
});

// Fechar modal
document.querySelector(".close").addEventListener("click", () => {
  document.getElementById("editModal").style.display = "none";
});

// Fechar modal ao clicar fora
window.addEventListener("click", (event) => {
  if (event.target == document.getElementById("editModal")) {
    document.getElementById("editModal").style.display = "none";
  }
});

// Inicializar tabela
document.addEventListener("DOMContentLoaded", renderTable);
