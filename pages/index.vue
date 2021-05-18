<template>
  <div>
    <AppTitle :title="`Manga Viewer`" />
    <div class="w-full flex flex-col items-center">
      <br /><br />
      <div class="w-full flex flex-col items-center">
        <h1 class="font-bold">Manga Viewer</h1>
        <nuxt-link to="/一般マンガ/">一般マンガへ</nuxt-link><br />
        <br /><br />
      </div>
      <br />
    </div>
  </div>
</template>

<script lang="ts">
export default {
  setup(_props: {}, _ctx: any) {
    return {}
  },
}
</script>
