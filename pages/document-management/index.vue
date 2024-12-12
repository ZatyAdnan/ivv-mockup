<script setup>
definePageMeta({
  title: "Document Repository",
  layout: "default",
  middleware: ["auth"], // Ensure only authenticated users can access
});

// Dummy Data for Documents
const documents = ref([
  {
    id: 1,
    fileName: "Project-Plan.pdf",
    uploadDate: "2024-12-01",
    validationStatus: "Validated",
    versions: [
      { number: 1, date: "2024-11-15" },
      { number: 2, date: "2024-11-20" },
      { number: 3, date: "2024-12-01" },
    ],
  },
  {
    id: 2,
    fileName: "Design-Specification.docx",
    uploadDate: "2024-12-01",
    validationStatus: "Pending",
    versions: [
      { number: 1, date: "2024-11-10" },
      { number: 2, date: "2024-12-01" },
    ],
  },
  {
    id: 3,
    fileName: "Team-Roster.pdf",
    uploadDate: "2024-11-30",
    validationStatus: "Validated",
    versions: [
      { number: 1, date: "2024-11-01" },
      { number: 2, date: "2024-11-15" },
      { number: 3, date: "2024-11-30" },
    ],
  },
]);

const selectedDocument = ref(null); // Document selected for version tracking
const showVersionModal = ref(false); // Toggles the version modal
const uploadForm = reactive({
  file: null,
  validationStatus: "Pending",
}); // Form state for document upload

// Handle document upload (dummy function)
const handleUpload = async () => {
  if (!uploadForm.file) {
    alert("Please select a file to upload.");
    return;
  }

  // Simulate document upload
  const newDocument = {
    id: documents.value.length + 1,
    fileName: uploadForm.file.name,
    uploadDate: new Date().toISOString().split("T")[0],
    validationStatus: uploadForm.validationStatus,
    versions: [
      {
        number: 1,
        date: new Date().toISOString().split("T")[0],
      },
    ],
  };

  documents.value.push(newDocument);
  alert("Document uploaded successfully!");
  uploadForm.file = null;
};

// Open version modal
const openVersionModal = (document) => {
  selectedDocument.value = document;
  showVersionModal.value = true;
};

// Close version modal
const closeVersionModal = () => {
  selectedDocument.value = null;
  showVersionModal.value = false;
};
</script>

<template>
    <div>
        <LayoutsBreadcrumb />

 
        <!-- Document Upload Form -->
        <rs-card>
        <template #header>
            <h3 class="text-lg font-semibold">Upload a Document</h3>
        </template>
        <template #body>
            <form @submit.prevent="handleUpload" class="space-y-4">
            <!-- File Input -->
            <FormKit
                type="file"
                name="file"
                label="Select a PDF or DOCX File"
                validation="required"
                accept=".pdf,.docx"
                v-model="uploadForm.file"
                :help="`Allowed types: PDF, DOCX`"
                :validation-visibility="'blur'"
            />

            <!-- Validation Status -->
            <FormKit
                type="select"
                name="validationStatus"
                label="Validation Status"
                :options="[{ value: 'Pending', label: 'Pending' }, { value: 'Validated', label: 'Validated' }]"
                validation="required"
                v-model="uploadForm.validationStatus"
            />

            <!-- Submit Button -->
            <button
                type="submit"
                class="px-4 py-2 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600"
            >
                Upload Document
            </button>
            </form>
        </template>
        </rs-card>

        <!-- Document List -->
        <rs-card>
        <template #header>
            <h3 class="text-lg font-semibold">Uploaded Documents</h3>
        </template>
        <template #body>
            <table class="table-auto w-full border-collapse border border-gray-200">
            <thead>
                <tr class="bg-gray-100">
                <th class="px-4 py-2 text-left border border-gray-200">File Name</th>
                <th class="px-4 py-2 text-left border border-gray-200">Upload Date</th>
                <th class="px-4 py-2 text-left border border-gray-200">Validation Status</th>
                <th class="px-4 py-2 text-left border border-gray-200">Actions</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="doc in documents" :key="doc.id" class="hover:bg-gray-50">
                <td class="px-4 py-2 border border-gray-200">{{ doc.fileName }}</td>
                <td class="px-4 py-2 border border-gray-200">{{ doc.uploadDate }}</td>
                <td class="px-4 py-2 border border-gray-200">{{ doc.validationStatus }}</td>
                <td class="px-4 py-2 border border-gray-200 space-x-2">
                    <button
                    class="px-2 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
                    @click="openVersionModal(doc)"
                    >
                    View Versions
                    </button>
                    <button
                    class="px-2 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-600"
                    @click="alert('Downloading latest version...')"
                    >
                    Download
                    </button>
                </td>
                </tr>
            </tbody>
            </table>
        </template>
        </rs-card>

        <!-- Document Versions Modal -->
        <rs-modal v-model="showVersionModal" @close="closeVersionModal">
        <template #header>
            <h3 class="text-lg font-semibold">Document Versions</h3>
        </template>
        <template #body>
            <ul class="list-disc list-inside">
            <li
                v-for="(version, index) in selectedDocument.versions"
                :key="index"
                class="py-2"
            >
                Version {{ version.number }} - {{ version.date }}
                <button
                class="ml-4 px-2 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
                @click="alert(`Downloading version ${version.number}...`)"
                >
                Download
                </button>
            </li>
            </ul>
        </template>
        </rs-modal>
    </div>
</template>
