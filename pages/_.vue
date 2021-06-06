<template>
  <div class="flex items-center w-full justify-center">
    <AppTitle :title="title" />
    <div v-if="isLoading" class="w-full flex items-center">
      <span class="text-4xl font-bold">Now Loading</span>
    </div>
    <div v-else>
      <div v-if="!isDir" id="buttons">
        <button class="btn_ bbutton" @click="scrollToPrev">BACK</button><br />
        <button class="btn_ to_top" @click="toTop">TOPへ</button><br />
        <nuxt-link :to="`/${upperPath}`">フォルダに戻る</nuxt-link>
        <div>
          <small>{{ formatVol(title) }}</small>
        </div>
      </div>

      <div class="max-w-4xl flex flex-col">
        <br /><br />
        <AppDirList
          v-if="isDir"
          :dir-list="dirList"
          :upper-path="upperPath"
          :preview-path="previewPath"
        />
        <!-- 以下各画像表示 -->
        <div v-else class="w-full flex flex-col items-center">
          <nuxt-link :to="`/${upperPath}`">🙋‍♀️戻る🙋‍♂️</nuxt-link>
          <div>
            <span
              v-for="(num, index) in allPageNum"
              :key="num + 'page'"
              class="inline"
            >
              <nuxt-link :to="`/${originalPath}${index}/`">
                {{ num * maxPage + 1 }}～
              </nuxt-link>
              |
            </span>
          </div>
          <div v-for="(image, index) in imageList" :key="index + '1'">
            <p class="w-full flex flex-row-reverse p-3">
              <AppCopyForm :path="`${image}`" />
            </p>
            <div ref="images" @click="scrollToNext">
              <img :src="`${baseUrl}${image}`" />
            </div>
          </div>
          <div v-if="lastPageNum - 1 !== page" ref="imageLast" class="mb-48">
            <nuxt-link
              :to="`/${originalPath}${nextPage}`"
              :src="`/t.png`"
              tag="img"
            >
            </nuxt-link>
          </div>
          <div v-else class="mb-48">{{ title }} (了)</div>
        </div>

        <br />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { onMounted, ref } from '@vue/composition-api'
import axios from 'axios'
import UniversalCookie from 'universal-cookie'
import { getFormatPath, formatVol } from '~/utils/utils'
import $ from '~/static/jquery.min.js'

// set
const cookie = new UniversalCookie()

const _maxPage = 40
const baseUrl = process.env.S3_BASE_URL
const apiBaseUrl = process.env.API_BASE_URL

export default {
  setup(_props: {}, ctx: any) {
    const pathResult = getFormatPath(ctx.root.$route.params.pathMatch)

    const originalPath = ref(pathResult.path)
    const isLoading = ref(false)
    const maxPage = ref(_maxPage)
    const path = originalPath.value

    const page = ref(Number(pathResult.page))
    const nextPage = ref(page.value + 1)

    const imageList = ref([])
    const dirList = ref([])
    const isDir = ref(true)

    const tmpDirs = originalPath.value.split('/')
    const joined = tmpDirs
      .slice(0, tmpDirs.length - 3 > 0 ? tmpDirs.length - 2 : 1)
      .join('/')

    const title = ref(tmpDirs[tmpDirs.length - 2])
    const upperPath = ref(joined + '/')
    const allPageNum = ref<Number[]>([])
    const lastPageNum = ref(0)
    const url1 = ref('')
    const error: any = ref('')
    const toTop = () => {
      $('body,html').animate(
        {
          scrollTop: 0,
        },
        200
      )
      return false
    }

    const scrollToNext = () => {
      let target
      for (const imageObject of ctx.refs.images) {
        target = imageObject.offsetTop
        if (target - 10 > $(document).scrollTop()) {
          break
        }
      }
      if (target <= $(document).scrollTop()) {
        target = ctx.refs.imageLast.offsetTop
      }
      $('html, body').animate(
        {
          scrollTop: target,
        },
        200
      )
    }
    const scrollToPrev = () => {
      let target
      let prev

      for (const imageObject of ctx.refs.images) {
        target = imageObject.offsetTop
        if (target > $(document).scrollTop() - 10) {
          break
        }
        prev = target
      }

      $('html, body').animate(
        {
          scrollTop: prev,
        },
        200
      )
    }
    const previewPath = ref('')
    onMounted(async () => {
      const url = `${apiBaseUrl}?path=${path}`
      url1.value = url
      let res: any = null
      try {
        isLoading.value = true
        res = await axios(url)
      } catch (e) {
        error.value = e
        alert(`${e.message}`)
      } finally {
        isLoading.value = false
      }
      if (res.data.type === 'dir') isDir.value = true
      else isDir.value = false

      if (isDir.value === false) {
        cookie.set('previewPath', path)
      } else {
        previewPath.value = cookie.get('previewPath')
          ? cookie.get('previewPath')
          : ''
      }

      dirList.value = res.data.list
      const lastImageNum = res.data.list.length - 1
      const currentPageLastNum =
        page.value * maxPage.value + maxPage.value > lastImageNum
          ? lastImageNum + 1
          : page.value * maxPage.value + maxPage.value
      if (isDir.value === false) {
        const tmpImageList = res.data.list.map((value: any) =>
          value.Key.replace(/ /g, '+')
            .replace(/#/g, '%23')
            .replace(/\[/g, '%5B')
            .replace(/\]/g, '%5D')
        )
        imageList.value = tmpImageList.slice(
          page.value * maxPage.value,
          currentPageLastNum
        )
      }
      allPageNum.value = [
        ...Array(Math.floor(res.data.list.length / maxPage.value) + 1).keys(),
      ]
      lastPageNum.value = allPageNum.value.length
    })
    return {
      title,
      error,
      imageList,
      maxPage,
      dirList,
      isDir,
      baseUrl,
      page,
      url1,
      nextPage,
      originalPath,
      upperPath,
      scrollToNext,
      toTop,
      scrollToPrev,
      allPageNum,
      lastPageNum,
      formatVol,
      isLoading,
      previewPath,
    }
  },
}
</script>
