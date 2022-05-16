// // 元素属性是否变化
// // MouseInteraction鼠标
// const ob = new MutationObserver((mutation) => {
//   // console.log("mutation========", mutation)
// })
// // 捕获错误，未来要加上，可以看出系统的健壮性
// window.onerror = function (msg) {
//   console.log("msg========", msg)
//   // 想后端发送
//   navigator.sendBeacon("地址", statck)
//   return true
// }
//    // 监听页面性能，后续也需要加上
//     const oberver = new PerformanceObserver((list) => {
//         console.log("list========", list.getEntries())
//         for (const e of list.getEntries()) {
//             console.log("e========", e)
//         }
//     })
//     oberver.observe({ entryTypes: ['mark', 'measure', 'paint', 'resource', 'navigation'] })

function addScript(url){
  var script = document.createElement('script');
  script.setAttribute('type','text/javascript');
  script.setAttribute('src',url);
  document.getElementsByTagName('head')[0].appendChild(script);
}
window.events = [];

// 捕获错误，未来要加上，可以看出系统的健壮性
window.onerror = function (msg) {
  console.log("msg========", msg)
  // 想后端发送
  // navigator.sendBeacon("地址", statck)
  return true
}

window.addEventListener('error', event => (){
  // 处理错误信息
  console.log("event========", event)
}, false);

window.onload = function () {
  addScript("https://cdn.jsdelivr.net/npm/rrweb@latest/dist/rrweb.min.js")
  addScript("https://cdn.jsdelivr.net/npm/rrweb@latest/dist/record/rrweb-record.min.js")

  var intervalId;
  var startTime = Date.now()
  function record() {
    console.log("999========", 999)
    rrweb.record({
      emit(event) {
        // 将 event 存入 events 数组中
        events.push(event);
      },
    });
    save()
  }
  function save() {
    const body = JSON.stringify(window.events);
    if (localStorage.getItem("name")) {
      fetch("http://localhost:8000/setData", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          events: body,
          name: '1',
          startTime,
          endTime: Date.now(),
        }),
      });
    }
  }

  // 每 20 秒调用一次 save 方法，避免请求过多
  intervalId = setInterval(record, 20 * 1000);
}

window.onunload = function () {
  clearTimeout(intervalId);
}
