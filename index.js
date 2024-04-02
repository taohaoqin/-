const audioEle = document.querySelector('audio')
const cvs = document.querySelector('canvas')
const ctx = cvs.getContext('2d')

function initCvs () {
  const devicePixelRatio = window.devicePixelRatio || 1
  cvs.width = 800 * devicePixelRatio
  cvs.height = 400 * devicePixelRatio
}
initCvs()

let isInit = false
let dataArray, analyser
audioEle.onplay = function () {
  if (isInit) {
    return
  }
  const audCtx = new AudioContext()
  const source = audCtx.createMediaElementSource(audioEle) // 创建音频源节点
  analyser = audCtx.createAnalyser()
  analyser.fftSize = 512
  // 创建数组 用于接收分析器节点的分析数据
  dataArray = new Uint8Array(analyser.frequencyBinCount)
  source.connect(analyser)
  analyser.connect(audCtx.destination)
  isInit = true
}

function draw () {
  requestAnimationFrame(draw)
  const { width, height } = cvs
  ctx.clearRect(0, 0, width, height)
  if (!isInit) {
    return
  }
  analyser.getByteFrequencyData(dataArray)
  const len = dataArray.length / 2.5
  const barWidth = width / len / 2
  ctx.fillStyle = '#78C5F7'
  for (let i = 0; i < len; i++) {
    const data = dataArray[i]
    const barHeight = data / 255 * height
    const x1 = i * barWidth + width / 2
    const x2 = width / 2 - (i + 1) * barWidth
    const y = height - barHeight
    ctx.fillRect(x1, y, barWidth - 1, barHeight)
    ctx.fillRect(x2, y, barWidth - 1, barHeight)
  }
}

draw()