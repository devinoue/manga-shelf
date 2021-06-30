<template>
  <div class="w-full flex flex-col">
    <h1 class="font-bold">マンガビューワー</h1>
    <nuxt-link to="/">ホーム</nuxt-link><br />
    <br /><br />
    <nuxt-link v-if="upperPath !== `/`" :to="`/${upperPath}`"
      >上のフォルダへ
    </nuxt-link>
    <div v-for="(dir, index) in dirList" :key="index + '1'">
      <template v-if="dirList.length >= 30">
        <a
          :href="`/${dir.Prefix}`"
          target="_blank"
          class="text-blue-600 text-xl"
          >{{ formattedPrefix(dir.Prefix, previewPaths) }}</a
        >
      </template>
      <template v-else>
        <nuxt-link :to="`/${dir.Prefix}`" class="text-blue-600 text-xl">{{
          formattedPrefix(dir.Prefix, previewPaths)
        }}</nuxt-link>
      </template>

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
  previewPaths: string[]
}
const formattedPrefix = (prefix: string, previewPaths: string[]) => {
  const matches = prefix.match('.+/(.+?)([\?#;].*)?/$')
  if (matches === null) return

  const folderName = matches.length > 1 ? matches[1] : ''
  let flag = false
  previewPaths.forEach((path) => {
    if (path.includes(folderName)) flag = true
  })
  return flag ? `${folderName}⭐` : folderName
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
    previewPaths: {
      type: Array,
      required: true,
    },
  },
  setup(_props: Props) {
    return { formattedPrefix }
  },
})
</script>
<style lang="scss" scoped></style>
