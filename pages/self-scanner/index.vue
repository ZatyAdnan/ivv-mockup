<script setup>
definePageMeta({
  title: "Document Self-Scanner",
  layout: "default",
  middleware: ["auth"], // Ensure user is logged in
});

import { ref } from "vue";
import { saveAs } from "file-saver"; // For saving files
import * as XLSX from "xlsx"; // For Excel export
import jsPDF from "jspdf"; // For PDF export

// Refs to handle the file and validation result
const documentFile = ref(null); // Stores the selected file
const validationResult = ref(null); // Stores the validation result

// Dummy validation logic
const dummyValidation = () => {
  validationResult.value = {
    score: 72, // Health Meter score (0-100)
    color: "yellow", // Health Meter color based on score
    checklist: [
      { section: "Title", isComplete: true },
      { section: "Introduction", isComplete: true },
      { section: "Conclusion", isComplete: false },
      { section: "References", isComplete: false },
    ],
  };
};

const handleFileChange = async (event) => {

    const selectedFile = event.target.files[0];
    console.log("documentFile:", selectedFile);

    if (selectedFile) {
        documentFile.value = selectedFile;
        console.log("Selected file:", selectedFile.name); // Debugging: Log the file name
    } else {
        documentFile.value = null; // Reset if no file is selected
    }
};

// Handle document upload
const uploadDocument = () => {
    
  // Check if a file is selected
  if (!documentFile.value) {
    alert("Please select a file to upload.");
    return;
  } 


  // Simulate file upload and validation
  console.log("Uploaded document:", documentFile.value.name);
  dummyValidation();
};

// Track the editable state
const isEditing = ref(false); // Controls edit mode

// Edit Checklist
const toggleEdit = () => {
  isEditing.value = !isEditing.value;
};

// Save checklist to Excel
const exportToExcel = () => {
  const worksheet = XLSX.utils.json_to_sheet(validationResult.value.checklist);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Readiness Checklist");
  XLSX.writeFile(workbook, "Readiness_Checklist.xlsx");
};

// Save checklist to PDF
const exportToPDF = () => {
  const pdf = new jsPDF();
  pdf.setFont("helvetica", "bold");
  pdf.text("Readiness Checklist", 10, 10);

  // Add checklist items to the PDF
  validationResult.value.checklist.forEach((item, index) => {
    pdf.setFont("helvetica", "normal");
    pdf.text(`${index + 1}. ${item.section}: ${item.isComplete ? "Complete" : "Incomplete"}`, 10, 20 + index * 10);
  });

  pdf.save("Readiness_Checklist.pdf");
};

// Save changes (if necessary)
const saveChanges = () => {
  alert("Changes saved successfully!");
  toggleEdit();
};
</script>

<template>
  <div>
    <!-- File Upload Card -->
    <rs-card>
      <template #header>
        <h2 class="text-lg font-semibold">Document Self-Scanner</h2>
      </template>

      <template #body>
        <!-- File Upload Input -->
        <form>
          <label for="document" class="block font-medium">Upload Document</label>
          <input
            type="file"
            id="document"
            class="mt-2 block w-full"
            accept=".pdf,.docx"
            @change="(e) => handleFileChange(e)"
          />
        </form>

        <!-- Upload Button -->
        <button
          class="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          @click.prevent="uploadDocument"
        >
          Validate Document
        </button>
      </template>
    </rs-card>

    <!-- Validation Results Card -->
    <rs-card v-if="validationResult">
      <template #header>
        <h3 class="text-lg font-semibold">Validation Results</h3>
      </template>

      <template #body>
        <!-- Health Meter -->
        <div class="mb-4">
          <h4 class="font-medium">Health Meter:</h4>
          <div
            class="flex items-center space-x-4 mt-2"
            :class="{
              'text-green-600': validationResult.score > 80,
              'text-yellow-600': validationResult.score > 50 && validationResult.score <= 80,
              'text-red-600': validationResult.score <= 50,
            }"
          >
            <span>{{ validationResult.score }}% Complete</span>
            <div class="w-full h-4 bg-gray-200 rounded">
              <div
                class="h-4 rounded"
                :style="{ width: validationResult.score + '%', backgroundColor: validationResult.color }"
              ></div>
            </div>
          </div>
        </div>

        <!-- Readiness Checklist -->
        <div>
            <h4 class="font-medium mb-2 flex justify-between items-center">
                Readiness Checklist:
                <button
                class="text-sm bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                @click="toggleEdit"
                >
                {{ isEditing ? "Done Editing" : "Edit Checklist" }}
                </button>
            </h4>
          <!-- Editable or View-Only Checklist -->
          <ul class="list-disc pl-6 space-y-2">
            <li v-for="(item, index) in validationResult.checklist" :key="index" class="flex items-center space-x-4">
              <template v-if="isEditing">
                <input
                  type="text"
                  class="border rounded px-2 py-1 w-1/2"
                  v-model="item.section"
                />
                <select v-model="item.isComplete" class="border rounded px-2 py-1">
                  <option :value="true">Complete</option>
                  <option :value="false">Incomplete</option>
                </select>
              </template>
              <template v-else>
                <span
                  :class="{ 'text-green-600': item.isComplete, 'text-red-600': !item.isComplete }"
                >
                  {{ item.section }}: {{ item.isComplete ? "Complete" : "Incomplete" }}
                </span>
              </template>
            </li>
          </ul>

          <!-- Save Changes Button -->
          <button 
            v-if="isEditing"
            class="mt-8 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
            @click="saveChanges"
          >
            Save Changes
          </button>
        </div>
      </template>
    </rs-card>

     <!-- Export Buttons -->
     <div class="flex space-x-4">
      <button
        class="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
        @click="exportToExcel"
      >
        Export to Excel
      </button>
      <button
        class="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
        @click="exportToPDF"
      >
        Export to PDF
      </button>
    </div>
  </div>
</template>
