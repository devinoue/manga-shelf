<template>
  <div>
    {{ message }}
    <svg
      class="w-2 h-2 absolute top-0 right-0 m-4 pointer-events-none"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 412 232"
    >
      <path
        d="M206 171.144L42.678 7.822c-9.763-9.763-25.592-9.763-35.355 0-9.763 9.764-9.763 25.592 0 35.355l181 181c4.88 4.882 11.279 7.323 17.677 7.323s12.796-2.441 17.678-7.322l181-181c9.763-9.764 9.763-25.592 0-35.355-9.763-9.763-25.592-9.763-35.355 0L206 171.144z"
        fill="#648299"
        fill-rule="nonzero"
      />
    </svg>
    <select
      v-model="folder"
      class="border border-gray-300 rounded-full text-gray-600 h-10 pl-5 pr-10 bg-white hover:border-gray-400 focus:outline-none appearance-none"
    >
      <option value="一般マンガ/[切り抜き]家具・家電">家具家電</option>
      <option value="一般マンガ/[切り抜き]食べ物">食べ物</option>
      <option value="一般マンガ/[切り抜き]日用品">日用品</option>
      <option value="一般マンガ/[切り抜き]楽しい">楽しい</option>
      <option value="一般マンガ/[切り抜き]100円ショップ">100円ショップ</option>
      <option value="一般マンガ/[切り抜き]無印・ニトリその他">
        無印・ニトリその他
      </option>
      <option value="delete">削除</option>
    </select>
    <button
      class="bg-gray-400 hover:bg-gray-300 text-gray-darkest font-bold py-2 px-4 rounded inline-flex items-center"
      @click="onClicked"
    >
      {{ buttonLabel }}
    </button>
  </div>
</template>
<script lang="ts">
import { computed, defineComponent, ref } from '@vue/composition-api'
import axios from 'axios'
export default defineComponent({
  name: '',
  props: {
    path: {
      type: String,
      required: true,
    },
  },
  setup(props: any) {
    const folder = ref('一般マンガ/家具・家電')
    const message = ref('')
    const buttonLabel = computed(() => {
      return folder.value === 'delete' ? '削除' : '保存'
    })
    const onClicked = async () => {
      // 削除の場合
      if (folder.value === 'delete') {
        const url = `https://p4ulaokjqa.execute-api.ap-northeast-1.amazonaws.com/dev/delete?path=${props.path}`
        const res = await axios.get(url)

        message.value = '削除しました。'
        setTimeout(() => {
          message.value = ''
        }, 3000)
        return
      }
      const url = `https://p4ulaokjqa.execute-api.ap-northeast-1.amazonaws.com/dev/copy?path=${props.path}&folder=${folder.value}`
      const res = await axios.get(url)
      console.log(res)
      message.value = '保存しました。'
      setTimeout(() => {
        message.value = ''
      }, 3000)
    }
    return { message, onClicked, folder, buttonLabel }
  },
})
</script>
<style lang="scss" scoped></style>
