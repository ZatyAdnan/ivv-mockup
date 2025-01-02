<script setup>


definePageMeta({
  title: "Logout",
  layout: "empty",
});

if (process.client) {

  navigateTo("/login");
}
</script>

<template>
  <div>
    <h1>Logout</h1>
  </div>
</template>
