import { createApp, defineAsyncComponent } from "vue"
import LoadingBox from '../components/Loading.vue'
import LoadingPop from "@/components/LoadingPop.vue";

export default {
  install: function (app: any) {
    app.config.globalProperties.$Loading = (ps: any, close: Function) => {
      return openPop(LoadingBox, "Loading", ps, close)
    };
  }
}

// 打开 loading 页面
export const Loading = (title: string | null): any => {
  return openPop(LoadingBox, "xLoading", { title: title }, undefined)
};

// 关闭所有弹窗
let pops: any = {};
window.addEventListener('popstate', function (event) {
  for (let i in pops) {
    pops[i]?.close()
  }
  pops = {};
});

// 打开弹窗
function openPop(pop: any, popid: string, params: any, close: Function | undefined) {
  if (pops[popid]) {
    return
  }

  let messageInstance: any = null;
  let div = document.createElement("div")
  const closeFn = (ps: any) => {
    if (close) {
      try {
        close(ps)
      } catch (e) { }
    }

    if (!pops[popid]) {
      return
    }
    message.unmount()
    document.body.removeChild(div)
    delete pops[popid]
  };

  let message = createApp(pop, {
    close: closeFn,
    params
  })

  div.id = popid
  document.body.appendChild(div)
  messageInstance = message.mount("#" + popid)
  pops[popid] = {
    close: closeFn,
    ins: messageInstance
  };

  return {
    ins: message,
    id: popid,
    close: closeFn
  }
}


// 异步组件加载
function AsyncComponentLoad(c: any) {
  const component = defineAsyncComponent({
    loader: c,
    delay: 0,
    timeout: 3000,
    loadingComponent: LoadingPop,
    onError: (error: Error, retry: () => void, fail: () => void, attempts: number) => {
      window.$notification["error"]({
        content: 'Page loading error',
        meta: error.message,
        duration: 2500,
        keepAliveOnHover: true
      })
    }
  })

  return component;
}