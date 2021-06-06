<template>
  <div class="w-full flex flex-col">
    <h1 class="font-bold">マンガビューワー</h1>
    <nuxt-link to="/">ホーム</nuxt-link><br />
    <br /><br />
    <nuxt-link v-if="upperPath !== `/`" :to="`/${upperPath}`"
      >上のフォルダへ
    </nuxt-link>
    <div v-for="(dir, index) in dirList" :key="index + '1'">
      <nuxt-link :to="`/${dir.Prefix}`" class="text-blue-600 text-xl">{{
        formattedPrefix(dir.Prefix, previewPath)
      }}</nuxt-link>
      <br /><br />
    </div>
  </div>
</template>
<script lang="ts">
// import { ref } from 'nuxt-composition-api'
import { defineComponent } from '@vue/composition-api'
import $ from '~/static/jquery.min.js'

type Props = {
  dirList: any
  upperPath: string
  previewPath: string
}
const formattedPrefix = (prefix: string, previewPath: string) => {
  const matches = prefix.match('.+/(.+?)([\?#;].*)?/$')
  if (matches === null) return

  const folderName = matches.length > 1 ? matches[1] : ''
  return previewPath.includes(folderName) ? `${folderName}⭐` : folderName
}

export default defineComponent({
  name: '',
  props: {
    dirList: {
      type: Array,
      required: true,
    },
    upperPath: {
      type: String,
      required: true,
    },
    previewPath: {
      type: String,
      required: true,
    },
  },
  setup(_props: Props) {
    return { formattedPrefix }
  },
})
</script>
<style lang="scss" scoped></style>
