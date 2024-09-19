<script setup>
const { $swal, $router } = useNuxtApp();
const id = useRoute().params.id;

const userRoleList = ref([]);
const checkAllRole = ref(false);
const form = ref({
  username: "",
  fullname: "",
  email: "",
  phone: "",
  password: "",
  role: [], // Initialize as an array
  status: "",
});

// Get user details
const { data: detail } = await useFetch("/api/devtool/user/get", {
  method: "GET",
  query: {
    id: parseInt(id),
  },
});

console.log(detail.value);
if (detail.value.statusCode === 200) {
  form.value.username = detail.value.data.userUsername || "";
  form.value.fullname = detail.value.data.userFullName || "";
  form.value.phone = detail.value.data.userPhone || "";
  form.value.email = detail.value.data.userEmail || "";
  form.value.role = detail.value.data.roles?.map(role => ({
    label: role.role.roleName,
    value: role.role.roleID,
  })) || []; // Initialize role as an array
  form.value.status = detail.value.data.userStatus || "ACTIVE";
}

// Fetch role list
const showModalRole = ref(false);
const roleForm = ref({
  role: "",
  description: "",
});

async function getRoleList() {
  const { data } = await useFetch("/api/devtool/role/list", {
    initialCache: false,
  });

  if (data.value.statusCode === 200) {
    userRoleList.value = data.value.data.map((role) => ({
      label: role.roleName,
      value: role.roleID,
    }));
  }
}
getRoleList();

const statusDropdown = ref([
  { label: "Active", value: "ACTIVE" },
  { label: "Inactive", value: "INACTIVE" },
]);

// Watch checkAllRole value
watch(
  checkAllRole,
  async (value) => {
    if (value) {
      form.value.role = userRoleList.value;
    } else {
      if (form.value.role.length === userRoleList.value.length) {
        form.value.role = [];
      }
    }
  },
  { immediate: true }
);

// Watch form.role value
watch(
  form,
  async (value) => {
    if (value.role.length === userRoleList.value.length) {
      checkAllRole.value = true;
    } else {
      checkAllRole.value = false;
    }
  },
  { deep: true }
);

// Open Modal Add Role
const openModalRole = async () => {
  roleForm.value.role = "";
  roleForm.value.description = "";

  showModalRole.value = true;
};

// Close Modal Role
const closeModalRole = () => {
  showModalRole.value = false;
};

const saveRole = async () => {
  if (roleForm.value.role === "" || roleForm.value.role === " ") {
    return false;
  }

  const { data } = await useFetch("/api/devtool/role/add", {
    method: "POST",
    body: JSON.stringify({
      name: roleForm.value.role,
      description: roleForm.value.description,
      module: "user",
    }),
  });

  if (data.value.statusCode === 200) {
    $swal.fire({
      position: "center",
      title: "Success",
      text: data.value.message,
      icon: "success",
      timer: 1000,
      showConfirmButton: false,
    });

    await getRoleList();
    closeModalRole();
  } else {
    $swal.fire({
      position: "center",
      title: "Error",
      text: data.value.message,
      icon: "error",
    });
  }
};

async function saveUser() {
  const { data } = await useFetch("/api/devtool/user/edit", {
    initialCache: false,
    method: "POST",
    body: JSON.stringify({
      ...form.value,
      id: id,
    }),
  });

  if (data.value.statusCode === 200) {
    $swal.fire({
      position: "center",
      icon: "success",
      title: "Success",
      text: "User has been updated",
      timer: 1000,
      showConfirmButton: false,
    });
    setTimeout(() => {
        $router.go();
      }, 1000);
  } else {
    $swal.fire({
      position: "center",
      icon: "error",
      title: "Error",
      text: data.value.message,
    });
  }
}
</script>

<template>
  <rs-card class="p-5">
    <div class="flex justify-between items-center mb-4">
      <h2>Edit User</h2>
    </div>
    <FormKit type="text" v-model="form.username" name="username" label="Username" disabled="true" />
    <FormKit type="text" v-model="form.fullname" name="fullname" label="Fullname" />
    <FormKit type="email" v-model="form.email" name="email" label="Email" />
    <FormKit type="text" v-model="form.phone" name="phone" label="Phone" />
    <div class="flex justify-between items-center mb-2">
      <label class="formkit-label flex items-center gap-x-4 font-semibold">Role</label>
      <rs-button size="sm" @click="openModalRole"> Add Role </rs-button>
    </div>
    <v-select :options="userRoleList" v-model="form.role" multiple></v-select>
    <FormKit type="checkbox" v-model="checkAllRole" label="All Role" input-class="icon-check" />
    <FormKit type="select" v-model="form.status" name="status" label="Status" :options="statusDropdown" />
    <rs-button @click="saveUser">Save</rs-button>
  </rs-card>

  <rs-modal title="Add Role" ok-title="Save" cancel-title="Back" :cancel-callback="closeModalRole" :ok-callback="saveRole" v-model="showModalRole">
    <FormKit type="text" v-model="roleForm.role" label="Name" validation="required" validation-visibility="live" />
    <FormKit type="textarea" v-model="roleForm.description" label="Description" />
  </rs-modal>
</template>
