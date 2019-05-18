const vlib = {
    FPS: 30,
    captured: false,
    topx: 70,
    leftx: 100,
    ev: new Array(0, 0, 0, 0, 0, 0, 0, 0),
    canvas: "",
    video: "",
    ctx: "",
    w: 0,
    h: 0,
    container: "",
    resizable: "",
    saver: "",
    capture: "",
    editer: "",
    crop: "",
    vi: "",
    rng1: "",
    rng2: "",
    rng3: "",
    rng4: "",
    resizer1: "",
    resizer2: "",
    resizer3: "",
    resizer4: "",
    resizer5: "",
    resizer6: "",
    parent: "",
    frame: "",
    rect: "",
    contr: "",
    hu: "",
    sat: "",
    ligh: "",
    init() {
        canvas = document.querySelector('#c1')
        video = document.querySelector('#v2')
        ctx = canvas.getContext('2d')
        w = canvas.width = document.querySelector('.parent').offsetWidth
        h = canvas.height = document.querySelector('.parent').offsetHeight
        video.addEventListener('play', _ => this.copy())
        this.startCamera()
        container = document.querySelector('.parent')
        resizable = document.querySelector('#cropper')
        saver = document.querySelector('#saver')
        capture = document.querySelector('#capture')
        editer = document.querySelector('#update')
        crop = document.querySelector('#crop')
        vi = document.querySelector('#v2')
        rng1 = document.querySelector("#contrast"),
        rng2 = document.querySelector("#hue"),
        rng3 = document.querySelector("#saturation"),
        rng4 = document.querySelector("#lightness"),
        resizer1 = document.querySelector('#pr7'),
        resizer2 = document.querySelector('#pr6'),
        parent = document.querySelector('.parent'),
        frame = document.querySelector('.frame'),
        resizer3 = document.querySelector('#pr3'),
        resizer4 = document.querySelector('#pr4'),
        resizer5 = document.querySelector('#pr8')
        resizer6 = document.querySelector('#pr1')
        resizer7 = document.querySelector('#pr2')
        resizer8 = document.querySelector('#pr5')
        rect = parent.getBoundingClientRect()
        resizer1.style.cursor = 'se-resize'
        resizer1.addEventListener('mousedown', this.initResize, false)
        resizer2.style.cursor = 'n-resize'
        resizer2.addEventListener('mousedown', this.initResize, false)
        resizer3.style.cursor = 'n-resize'
        resizer3.addEventListener('mousedown', this.initResize, false)
        resizer4.style.cursor = 'ew-resize'
        resizer4.addEventListener('mousedown', this.initResize, false)
        resizer5.style.cursor = 'ew-resize'
        resizer5.addEventListener('mousedown', this.initResize, false)
        resizer6.style.cursor = 'sw-resize'
        resizer6.addEventListener('mousedown', this.initResize, false)
        resizer7.style.cursor = 'nw-resize'
        resizer7.addEventListener('mousedown', this.initResize, false)
        resizer8.style.cursor = 'sw-resize'
        resizer8.addEventListener('mousedown', this.initResize, false)
        contr = rng1.value
        hu = rng2.value
        sat = rng3.value
        ligh = rng4.value
        rng1.addEventListener('change', (evt) => {
            contr = rng1.value
        })
        rng2.addEventListener('change', (evt) => {
            hu = rng2.value
        })
        rng3.addEventListener('change', (evt) => {
            sat = rng3.value
        })
        rng4.addEventListener('change', (evt) => {
            ligh = rng4.value
        })
    },
    copy() {

        ctx.drawImage(video, 0, 0, w, h)
        this.process()
        if (video.ended || video.paused)
            return
        captured = setTimeout(_ => this.copy(), 1000 / this.FPS)
    },
    capturer() {
        clearInterval(captured)
        this.applyFilter(ctx)
        ctx.drawImage(video, 0, 0, w, h)
        this.applyFilterSt(video)
        saver.onclick = function () { vlib.saveImageProfil() }
        saver.removeAttribute('disabled')
    },
    process() {
        const imageData = ctx.getImageData(0, 0, w, h)
        this.applyFilter(ctx)
        this.applyOpacity(resizable)
        ctx.putImageData(imageData, 0, 0)

    },
    async startCamera() {
        video2 = document.querySelector('#v2')
        let stream
        try {
            stream = await navigator.mediaDevices.getUserMedia({ video: true })
            video2.srcObject = stream
            this.enableBtns()
        } catch (error) {
            console.log("something was wrong")
            videoReplace = document.querySelector('#v2')
            videoReplace.src = "Big_Buck_Bunny_Trailer.mp4"
            this.enableBtns()
        }
    },
    enableBtns() {
        capture.removeAttribute('disabled')
        editer.removeAttribute('disabled')
        crop.removeAttribute('disabled')
        capture.onclick = function () { vlib.startCounting(this) }
        editer.onclick = function () { vlib.showEditDiv() }
        crop.onclick = function () { vlib.showCropper() }
    },
    startCounting(link) {
        captured = false
        spanChrono = document.querySelector('.compt')
        var cc = 4
        link.classList.add('btn-default')
        link.classList.remove('btn-primary')
        link.onclick = null
        var interval = setInterval(function () {
            spanChrono.innerHTML = '  <i class="glyphicon glyphicon-time"></i>  ' + --cc + ' s'
            if (cc == 0) {
                clearInterval(interval)
                link.classList.add('btn-primary')
                link.classList.remove('btn-default')
                link.onclick = "startCounting(" + link + ")"
                link.onclick = function () {
                    vlib.startCounting(link)
                }
                spanChrono.innerHTML = ""
                vlib.capturer()
            }
        }, 1000)
    },
    applyOpacity(resizable) {
        resizable.style.background = "rgba(0,0,0,0.1)"
    },
    cropit(canvas, offsetX, offsetY, width, height) {
        var buffer = document.createElement('canvas')
        var b_ctx = buffer.getContext('2d')
        buffer.width = width
        buffer.height = height
        b_ctx.drawImage(canvas, offsetX, offsetY, width, height,
            0, 0, buffer.width, buffer.height)
        return buffer.toDataURL("image/png")
    },
    saveImageProfil() {
        let state = resizable.style.display
        let imgData
        if (state == "block")
            imgData = this.cropit(canvas, resizable.offsetLeft, resizable.offsetTop, resizable.offsetWidth, resizable.offsetHeight)
        else
            imgData = canvas.toDataURL("image/png")
        localStorage.setItem("imgData", imgData.replace(/^data:image\/(png|jpg);base64,/, ""))
        window.location = "profile.html"
    },
    showEditDiv() {
        let state = document.getElementById('editPanel').style.display
        if (state == "block")
            document.getElementById('editPanel').style.display = "none"
        else
            document.getElementById('editPanel').style.display = "block"
    },
    applyFilter(ctx) {
        ctx.filter = 'contrast(' + contr + '%) hue-rotate(' + hu + 'deg) saturate(' + sat + '%) brightness(' + ligh + '%)'
        vi.style.filter = ctx.filter
    },
    applyFilterSt(vi) {
        vi.style.filter = 'contrast(' + contr + '%) hue-rotate(' + hu + 'deg) saturate(' + sat + '%) brightness(' + ligh + '%)'
        setTimeout(_ => this.applyFilterSt(vi), 1000 / this.FPS)
    },
    showCropper() {
        let state = document.querySelector('.cropper-dragger').style.display
        if (state == "block")
            document.querySelector('.col-md-6 .cropper-dragger').style.display = "none"
        else {
            document.querySelector('.col-md-6 .cropper-dragger').style.display = "block"
        }
    },
    initResize(e) {
        document.addEventListener('mousemove', vlib.Resize, false)
        document.addEventListener('mouseup', vlib.stopResize, false)
    },
    initMov(divid) {
        this.topx = divid.offsetTop
        this.leftx = divid.offsetLeft
        vlib.ev[2] = 0
        vlib.ev[7] = 0
        vlib.ev[6] = 0
        vlib.ev[0] = 0
        vlib.ev[1] = 0
    },
    Resize(e) {
        if (e.clientX > rect.right - 2 || e.clientY + 2 > rect.bottom || e.clientY + 5 < rect.top || e.clientX < rect.left) {
            return
        }
        if (e.target.id == "pr6") {

            resizable.className = ""
            resizable.className = "cropper-dragger"
            console.log("ok6")

            resizable.style.top = vlib.topx + "px"
            resizable.style.left = vlib.leftx + 'px'

            resizable.style.height = (e.clientY - rect.top - resizable.offsetTop) + 3 + 'px'
            frame.style.height = resizable.style.height

            pr4.style.top = parseInt(resizable.style.height, 10) / 2 + 'px'
            pr8.style.top = parseInt(resizable.style.height, 10) / 2 + 'px'


            vlib.ev[5]++
            vlib.ev[0] = 0
            vlib.ev[2] = 0


        } else if (e.target.id == "pr3") {

            resizable.className = ""
            resizable.className = "reverse-cropper-dragger"
            resizable.style.top = ""


            if (vlib.ev[1] == 0) {
                resizable.style.bottom = rect.height - vlib.topx - resizable.offsetHeight + 'px'
            }

            if (e.clientY - rect.top - resizable.offsetTop + resizable.offsetHeight - 0.5 >= parseInt(resizable.style.height, 10) && e.clientY > rect.top)
                resizable.style.height = parseInt(resizable.style.height, 10) + 3 + 'px'
            else
                resizable.style.height = parseInt(resizable.style.height, 10) - 3 + 'px'


            frame.style.height = resizable.style.height
            pr4.style.top = parseInt(resizable.style.height, 10) / 2 + 'px'
            pr8.style.top = parseInt(resizable.style.height, 10) / 2 + 'px'

            vlib.topx = resizable.offsetTop

            vlib.ev[1]++
            vlib.ev[4] = 0
            vlib.ev[5] = 0
            vlib.ev[6] = 0

        } else if (e.target.id == "pr4") {

            resizable.className = ""
            resizable.className = "reverse-cropper-dragger"
            resizable.style.left = ""

            console.log("ok4")


            if (vlib.ev[7] == 0) {
                resizable.style.right = rect.width - vlib.leftx - resizable.offsetWidth + 'px'
                resizable.style.bottom = rect.height - vlib.topx - resizable.offsetHeight + 'px'
            }


            if (e.clientX - rect.left - resizable.offsetLeft + resizable.offsetWidth - 0.5 >= parseInt(resizable.style.width, 10) && e.clientX > rect.left)
                resizable.style.width = parseInt(resizable.style.width, 10) + 3 + 'px'
            else
                resizable.style.width = parseInt(resizable.style.width, 10) - 3 + 'px'


            frame.style.width = resizable.style.width
            pr3.style.left = parseInt(resizable.style.width, 10) / 2 + 'px'
            pr6.style.left = parseInt(resizable.style.width, 10) / 2 + 'px'

            vlib.leftx = resizable.offsetLeft
            vlib.topx = resizable.offsetTop
            vlib.ev[7]++
            vlib.ev[3] = 0
            vlib.ev[4] = 0
            vlib.ev[5] = 0

        }
        else if (e.target.id == "pr8") {

            resizable.className = ""
            resizable.className = "cropper-dragger"

            console.log("ok8")

            resizable.style.width = (e.clientX - rect.left - vlib.leftx) + 3 + 'px'

            resizable.style.left = vlib.leftx + 'px'
            resizable.style.top = vlib.topx + 'px'

            frame.style.width = resizable.style.width
            pr3.style.left = parseInt(resizable.style.width, 10) / 2 + 'px'
            pr6.style.left = parseInt(resizable.style.width, 10) / 2 + 'px'

            vlib.leftx = resizable.offsetLeft
            vlib.ev[3]++
        }

        else if (e.target.id == "pr7") {

            resizable.className = ""
            resizable.className = "cropper-dragger"

            console.log("ok7")

            resizable.style.top = vlib.topx + "px"
            resizable.style.left = vlib.leftx + "px"

            resizable.style.width = (e.clientX - rect.left - resizable.offsetLeft) + 5 + 'px'
            resizable.style.height = (e.clientY - rect.top - resizable.offsetTop) + 5 + 'px'

            pr3.style.left = (e.clientX - rect.left - resizable.offsetLeft) / 2 + 'px'
            pr4.style.top = (e.clientY - rect.top - resizable.offsetTop) / 2 + 'px'
            pr6.style.left = (e.clientX - rect.left - resizable.offsetLeft) / 2 + 'px'
            pr8.style.top = (e.clientY - rect.top - resizable.offsetTop) / 2 + 'px'

            frame.style.width = resizable.style.width
            frame.style.height = resizable.style.height

            vlib.topx = resizable.offsetTop
            vlib.leftx = resizable.offsetLeft
            vlib.ev[4]++
            vlib.ev[0] = 0
            vlib.ev[1] = 0
            vlib.ev[2] = 0
            vlib.ev[6] = 0
            vlib.ev[7] = 0
        }

        else if (e.target.id == "pr1") {

            resizable.className = ""
            resizable.className = "reverse-cropper-dragger"
            resizable.style.top = ""
            resizable.style.left = vlib.leftx + 'px'

            console.log("ok1")

            if (vlib.ev[2] == 0) {
                resizable.style.bottom = rect.height - vlib.topx - resizable.offsetHeight + 'px'
            }

            if (e.clientY - rect.top - resizable.offsetTop + resizable.offsetHeight - 1 >= parseInt(resizable.style.height, 10)) {
                resizable.style.height = parseInt(resizable.style.height, 10) + 3 + 'px'
                resizable.style.width = parseInt(resizable.style.width, 10) + 3 + 'px'
            }
            else {
                resizable.style.height = parseInt(resizable.style.height, 10) - 3 + 'px'
                resizable.style.width = parseInt(resizable.style.width, 10) - 3 + 'px'
            }
            frame.style.height = resizable.style.height
            frame.style.width = resizable.style.width

            vlib.topx = resizable.offsetTop
            vlib.ev[2]++
            vlib.ev[0] = 0
            vlib.ev[4] = 0
            vlib.ev[5] = 0
            vlib.ev[6] = 0
            vlib.ev[7] = 0

            pr4.style.top = parseInt(resizable.style.height, 10) / 2 + 'px'
            pr3.style.left = (e.clientX - rect.left - resizable.offsetLeft) / 2 + 'px'
            pr6.style.left = (e.clientX - rect.left - resizable.offsetLeft) / 2 + 'px'
            pr8.style.bottom = ((parseInt(resizable.style.height, 10) - 20) / 2) + 'px'

        }

        else if (e.target.id == "pr2") {

            resizable.className = ""
            resizable.className = "reverse-cropper-dragger"
            resizable.style.left = ""
            resizable.style.top = ""

            console.log("ok2")


            if (vlib.ev[0] == 0) {
                resizable.style.right = rect.width - vlib.leftx - resizable.offsetWidth + 'px'
                resizable.style.bottom = rect.height - vlib.topx - resizable.offsetHeight + 'px'
            }

            if (e.clientX - rect.left - resizable.offsetLeft + resizable.offsetWidth - 0.5 >= parseInt(resizable.style.width, 10) && e.clientX > rect.left) {
                resizable.style.width = parseInt(resizable.style.width, 10) + 3 + 'px'
                resizable.style.height = parseInt(resizable.style.height, 10) + 3 + 'px'
            } else {
                resizable.style.width = parseInt(resizable.style.width, 10) - 3 + 'px'
                resizable.style.height = parseInt(resizable.style.height, 10) - 3 + 'px'

            }

            frame.style.width = resizable.style.width
            frame.style.height = resizable.style.height

            pr3.style.left = parseInt(resizable.style.width, 10) / 2 + 'px'
            pr6.style.left = parseInt(resizable.style.width, 10) / 2 + 'px'
            pr4.style.top = parseInt(resizable.style.height, 10) / 2 + 'px'
            pr8.style.top = parseInt(resizable.style.height, 10) / 2 + 'px'

            vlib.leftx = resizable.offsetLeft
            vlib.topx = resizable.offsetTop
            vlib.ev[0]++
            vlib.ev[3] = 0
            vlib.ev[4] = 0
            vlib.ev[5] = 0
            vlib.ev[6] = 0
            vlib.ev[7] = 0

        }
        else if (e.target.id == "pr5") {

            resizable.className = ""
            resizable.className = "reverse-cropper-dragger"
            resizable.style.left = ""
            resizable.style.bottom = ""
            console.log("ok5")


            if (vlib.ev[6] == 0) {
                resizable.style.right = rect.width - vlib.leftx - resizable.offsetWidth + 'px'
                resizable.style.top = vlib.topx + 'px'
            }

            if (e.clientX - rect.left - resizable.offsetLeft + resizable.offsetWidth - 0.5 >= parseInt(resizable.style.width, 10) && e.clientX > rect.left) {
                resizable.style.width = parseInt(resizable.style.width, 10) + 3 + 'px'
                resizable.style.height = parseInt(resizable.style.height, 10) + 3 + 'px'
            } else {
                resizable.style.width = parseInt(resizable.style.width, 10) - 3 + 'px'
                resizable.style.height = parseInt(resizable.style.height, 10) - 3 + 'px'

            }

            frame.style.width = resizable.style.width
            frame.style.height = resizable.style.height

            pr3.style.left = parseInt(resizable.style.width, 10) / 2 + 'px'
            pr6.style.left = parseInt(resizable.style.width, 10) / 2 + 'px'
            pr4.style.top = parseInt(resizable.style.height, 10) / 2 + 'px'
            pr8.style.top = parseInt(resizable.style.height, 10) / 2 + 'px'

            vlib.leftx = resizable.offsetLeft
            vlib.topx = resizable.offsetTop
            vlib.ev[6]++
            vlib.ev[0] = 0
            vlib.ev[1] = 0
            vlib.ev[2] = 0
            vlib.ev[3] = 0
            vlib.ev[4] = 0
        }
    },
    stopResize(e) {
        document.removeEventListener('mousemove', vlib.Resize, false)
        document.removeEventListener('mouseup', vlib.stopResize, false)
    },
    move(divid, xpos, ypos) {
        divid.style.left = xpos + 'px'
        divid.style.top = ypos + 'px'
        vlib.initMov(divid)
    },
    startMoving(divid, container, evt) {
        var style = getComputedStyle(divid)
        evt = evt || window.event
        var posX = evt.clientX,
            posY = evt.clientY,
            divTop = style.top,
            divLeft = style.left,
            eWi = parseInt(divid.style.width),
            eHe = parseInt(divid.style.height),
            cWi = parseInt(document.querySelector('.' + container).offsetWidth) + 2,
            cHe = parseInt(document.querySelector('.' + container).offsetHeight) + 2
        document.querySelector('.' + container).style.cursor = 'move'
        divTop = divTop.replace('px', '')
        divLeft = divLeft.replace('px', '')
        var diffX = posX - divLeft,
            diffY = posY - divTop
        document.onmousemove = function (evt) {
            evt = evt || window.event
            var posX = evt.clientX,
                posY = evt.clientY,
                aX = posX - diffX,
                aY = posY - diffY
            if (aX < 0) aX = 0
            if (aY < 0) aY = 0
            if (aX + eWi > cWi) aX = cWi - eWi
            if (aY + eHe > cHe) aY = cHe - eHe
            vlib.move(divid, aX, aY)
        }
    },
    stopMoving(container) {
        var a = document.createElement('script')
        document.querySelector('.' + container).style.cursor = 'default'
        document.onmousemove = function () { }

    },
}
vlib.init()