<template>
<div>
    <AppTitle :title="title" />
    <div v-if="!isDir" id="buttons">
        <button class="btn_ bbutton" @click="scrollToPrev">BACK</button><br />
        <button class="btn_ to_top" @click="toTop">TOPへ</button><br />
        <a :href="`/?path=${upperPath}`">フォルダに戻る</a>
    </div>

    <div class="w-full flex flex-col items-center">
        <br /><br />
        <div v-if="isDir" class="w-full flex flex-col items-center">
            <h1 class="font-bold">マンガビューワー</h1>
            <a href="/">ホーム</a><br />
            <br /><br />
            <a v-if="upperPath !== `/`" :href="`/?path=${upperPath}`">上のフォルダへ
            </a>
            <div v-for="(dir, index) in dirList" :key="index + '1'">
                <a :href="`/?path=${dir.Prefix}`" class="text-blue-600 text-xl">{{ dir.Prefix }}</a><br /><br />
            </div>

        </div>
        <div v-else class="w-full flex flex-col items-center">
            <a :href="`/?path=${upperPath}`">　戻る　</a>
            {{allPageNum}} {{imageList}}{{url1}}<br>
            error:{{error}}<br>
            result: {{result}}<br>
            <div>
                <span v-for="num, index in allPageNum" class="inline" :key="num + 'page'">
                    <a :href="`/?path=${originalPath}&page=${index}`">
                        {{num * maxPage + 1}}～
                    </a> |
                </span>
            </div>

            <div v-for="(image, index) in imageList" :key="index + '1'">
                <div @click="scrollToNext" ref="images">
                    <img :src="`${baseUrl}${image}`" />
                </div>
            </div>
            <div class="mb-48" ref="imageLast" v-show="lastPageNum !== page">
                <a :href="`/?path=${originalPath}&page=${nextPage}`">
                    <img src="~/static/t.png" />
                </a>
            </div>
        </div>

        <br />
    </div>

</div>
</template>

<script lang="ts">
import {
    onMounted,
    ref,
    defineComponent,
    SetupContext,
} from '@vue/composition-api'
import axios from 'axios'
import $ from "~/static/jquery.min.js";

const maxPage = 40
const baseUrl = process.env.S3_BASE_URL
const apiBaseUrl = process.env.API_BASE_URL
export default {
    setup(_props: {}, ctx: any) {
        console.log(ctx)
        const originalPath = ref(ctx.root.context.query?.path ?? '')
        const path = originalPath.value

        const page = ref(Number(ctx.root.context.query?.page ?? 0))
        const nextPage = ref(page.value + 1)

        const imageList = ref([])
        const dirList = ref([])
        const isDir = ref(false)

        const tmpDirs = originalPath.value.split('/')
        const joined = tmpDirs.slice(0, tmpDirs.length - 3 > 0 ? tmpDirs.length - 2 : 1).join('/')

        const title = ref(tmpDirs[tmpDirs.length - 2])
        const upperPath = ref(joined + '/')
        const allPageNum = ref < Number[] > ([])
        const lastPageNum = ref(0)
        const url1 = ref("")
        const error = ref < any > ("")
        const result = ref < any > (null)

        const toTop = () => {
            $('body,html').animate({
                scrollTop: 0
            }, 200);
            return false;
        }
        const scrollToPrev = () => {
            let target;
            let prev;

            for (let imageObject of ctx.refs.images) {
                target = imageObject.offsetTop
                if (target > $(document).scrollTop() - 10) {

                    break
                }
                prev = target;
            }

            $("html, body").animate({
                scrollTop: prev
            }, 200);
        }

        const scrollToNext = () => {
            let target
            for (let imageObject of ctx.refs.images) {
                target = imageObject.offsetTop
                if (target - 10 > $(document).scrollTop()) {
                    break
                }
            }
            if (target <= $(document).scrollTop()) {
                target = ctx.refs.imageLast.offsetTop
            }
            $("html, body").animate({
                scrollTop: target
            }, 200);
        }

        onMounted(async () => {

            const url = `${apiBaseUrl}?path=${path}`
            url1.value = url
            let res: any = null
            try {
                res = await axios(url)
            } catch (e) {
                error.value = e
                alert(`${e.message}`)
            }
            result.value = res.data.list
            if (res.data.type === 'dir') isDir.value = true
            dirList.value = res.data.list
            const lastImageNum = res.data.list.length - 1
            const carrentPageLastNum =
                page.value * maxPage + maxPage > lastImageNum ?
                lastImageNum :
                page.value * maxPage + maxPage
            if (isDir.value === false) {
                const tmpImageList = res.data.list.map((value: any) =>
                    value.Key.replaceAll(' ', '+')
                    .replaceAll('#', '%23')
                    .replaceAll('[', '%5B')
                    .replaceAll(']', '%5D')
                )
                imageList.value = tmpImageList.slice(
                    page.value * maxPage,
                    carrentPageLastNum
                )
            }
            allPageNum.value = [...Array(Math.floor(res.data.list.length / maxPage)).keys()]
            lastPageNum.value = allPageNum.value.length - 1

        })
        return {
            error,
            result,
            title,
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
            lastPageNum
        }
    },

}
</script>
