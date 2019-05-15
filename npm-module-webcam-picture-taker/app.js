

const vlib = {
    FPS: 30,
    captured: false,
    topx:70,
    btmx:70,
    i:0,
    etat:0,
    canvas:"",
    video:"",
    ctx:"",
    w:0,
    h:0,
    container:"",
    resizable:"",
    saver:"",
    capture:"",
    editer:"",
    crop:"",
    vi:"",
    rng1:"",
    rng2:"",
    rng3:"",
    rng4:"",
    resizer1:"",
    resizer2:"",
    resizer3:"",
    resizer4:"",
    resizer5:"",
    resizer6:"",
    parent:"",
    frame:"",
    rect:"",
    contr:"",
    hu:"",
    sat:"",
    ligh:"",
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

        //resizable = document.querySelector('.cropper-dragger'),
        resizer1 = document.querySelector('#pr7'),
        resizer2 = document.querySelector('#pr6'),
        parent = document.querySelector('.parent'),
        frame = document.querySelector('.frame'),
        resizer3 = document.querySelector('#pr3'),
        resizer4 = document.querySelector('#pr4'),
        resizer5 = document.querySelector('#pr8')
        resizer6 = document.querySelector('#pr1')
          
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
        contr = rng1.value
        hu = rng2.value
        sat = rng3.value 
        ligh = rng4.value
        //var contr = rng1.value, hu = rng2.value, sat = rng3.value, ligh = rng4.value

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

        /*
        for (let i = 0; i < d.length; i += 4) {
 
            const r = d[i], g = d[i + 1], b = d[i + 2], a = d[i + 3]
 
            d[i] = d[i] * contrast + intercept;
            d[i + 1] = d[i + 1] * contrast + intercept;
            d[i + 2] = d[i + 2] * contrast + intercept;
 
 
            //data[i] = data[i + 1] = data[i + 2] = (r + g + b) / 3
        }*/
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
        this.btmx = parseInt(divid.style.top, 10) + 0.1
        this.i = 0
        this.topx = divid.offsetTop
    },
    Resize(e) {

        if (e.clientX > rect.right - 2 || e.clientY + 2 > rect.bottom || e.clientY + 5 < rect.top || e.clientX < rect.left) {
            return
        }

        if (e.target.id == "pr6") {


            resizable.className = ""
            resizable.className = "cropper-dragger"

            resizable.style.top = this.btmx + "px"

            resizable.style.height = (e.clientY - rect.top -resizable.offsetTop) + 5 + 'px'
            frame.style.height = resizable.style.height

            pr4.style.top = (e.clientY - rect.top - resizable.offsetTop) / 2 + 'px'
            pr8.style.bottom = (e.clientY - rect.top - resizable.offsetTop) / 2 + 'px'

            topx = this.btmx
            i = 0

        } else if (e.target.id == "pr3") {

            resizable.className = ""
            resizable.className = "reverse-cropper-dragger"
            resizable.style.top = ""


            if (vlib.i == 0) {
                resizable.style.bottom = rect.height - vlib.topx - resizable.offsetHeight + 'px'
            }

            if (e.clientY - rect.top - resizable.offsetTop + resizable.offsetHeight - 0.5 >= parseInt(resizable.style.height, 10) && e.clientY > rect.top)
            resizable.style.height = parseInt(resizable.style.height, 10) + 3 + 'px'
            else
            resizable.style.height = parseInt(resizable.style.height, 10) - 3 + 'px'


            frame.style.height = resizable.style.height

            btmx = resizable.offsetTop
            vlib.i++

            pr4.style.top = parseInt(resizable.style.height, 10) / 2 + 'px'
            pr8.style.top = parseInt(resizable.style.height, 10) / 2 + 'px'

        } else if (e.target.id == "pr4") {

            console.log("resizerornge")

        }
        else if (e.target.id == "pr8") {

            resizable.style.width = (e.clientX - rect.left - resizable.offsetLeft) + 5 + 'px'
            frame.style.width = resizable.style.width
            pr3.style.left = parseInt(resizable.style.width, 10) / 2 + 'px'
            pr6.style.left = parseInt(resizable.style.width, 10) / 2 + 'px'

        }

        else if (e.target.id == "pr7") {

            resizable.className = ""
            resizable.className = "cropper-dragger"

            resizable.style.top = this.btmx + "px"

            resizable.style.width = (e.clientX - rect.left - resizable.offsetLeft) + 5 + 'px'
            resizable.style.height = (e.clientY - rect.top - resizable.offsetTop) + 5 + 'px'

            pr3.style.left = (e.clientX - rect.left - resizable.offsetLeft) / 2 + 'px'
            pr4.style.top = (e.clientY - rect.top - resizable.offsetTop) / 2 + 'px'
            pr6.style.left = (e.clientX - rect.left - resizable.offsetLeft) / 2 + 'px'
            pr8.style.top = (e.clientY - rect.top - resizable.offsetTop) / 2 + 'px'

            frame.style.width = resizable.style.width
            frame.style.height = resizable.style.height

            topx = this.btmx
            i = 0

        }


        else if (e.target.id == "pr1") {

            resizable.className = ""
            resizable.className = "reverse-cropper-dragger"
            resizable.style.top = ""


            if ( vlib.i == 0) {
                resizable.style.bottom =  rect.height -  vlib.topx -  resizable.offsetHeight + 'px'
            }

            if (e.clientY - rect.top -  resizable.offsetTop + resizable.offsetHeight - 1 >= parseInt( resizable.style.height, 10))
            resizable.style.height = parseInt( resizable.style.height, 10) + 3 + 'px'
            else
            resizable.style.height = parseInt( resizable.style.height, 10) - 3 + 'px'

            frame.style.height =  resizable.style.height


            if ( this.etat < e.clientX) {
                resizable.style.width = parseInt( resizable.style.width, 10) + 3 + 'px'
            } else if ( this.etat > e.clientX) {
                resizable.style.width = parseInt( resizable.style.width, 10) - 3 + 'px'
            }
            frame.style.width =  resizable.style.width

            this.etat = e.clientX
            btmx = resizable.offsetTop
            vlib.i++


            pr4.style.top = parseInt( resizable.style.height, 10) / 2 + 'px'
            pr3.style.left = (e.clientX -  rect.left -  resizable.offsetLeft) / 2 + 'px'
            pr6.style.left = (e.clientX -  rect.left -  resizable.offsetLeft) / 2 + 'px'
            pr8.style.bottom = ((parseInt( resizable.style.height, 10)-20) / 2) + 'px'

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










/*
        function contrastImage(imgData, contrast) {	//input range [-100..100]
            var d = imgData.data;
            contrast = (contrast / 100) + 1;	//convert to decimal & shift range: [0..2]
            var intercept = 128 * (1 - contrast);
            for (var i = 0; i < d.length; i += 4) {	//r,g,b,a
                d[i] = d[i] * contrast + intercept;
                d[i + 1] = d[i + 1] * contrast + intercept;
                d[i + 2] = d[i + 2] * contrast + intercept;
            }
 
 
        }
        */




/*
        var operations = {
 
            rgbToHsl: function (r, g, b) {
                r /= 255, g /= 255, b /= 255;
                var max = Math.max(r, g, b), min = Math.min(r, g, b);
                var h, s, l = (max + min) / 2;
                if (max == min) {
                    h = s = 0; // achromatic
                } else {
                    var d = max - min;
                    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
                    switch (max) {
                        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                        case g: h = (b - r) / d + 2; break;
                        case b: h = (r - g) / d + 4; break;
                    }
                    h /= 6;
                }
                return ({ h: h, s: s, l: l });
            },
            hslToRgb: function (h, s, l) {
                if (h == "") h = 0;
                if (s == "") s = 0;
                if (l == "") l = 0;
                h = parseFloat(h);
                s = parseFloat(s);
                l = parseFloat(l);
                if (h < 0) h = 0;
                if (s < 0) s = 0;
                if (l < 0) l = 0;
                if (h >= 360) h = 359;
                if (s > 100) s = 100;
                if (l > 100) l = 100;
                s /= 100;
                l /= 100;
                C = (1 - Math.abs(2 * l - 1)) * s;
                hh = h / 60;
                X = C * (1 - Math.abs(hh % 2 - 1));
                r = g = b = 0;
                if (hh >= 0 && hh < 1) {
                    r = C;
                    g = X;
                } else if (hh >= 1 && hh < 2) {
                    r = X;
                    g = C;
                } else if (hh >= 2 && hh < 3) {
                    g = C;
                    b = X;
                } else if (hh >= 3 && hh < 4) {
                    g = X;
                    b = C;
                } else if (hh >= 4 && hh < 5) {
                    r = X;
                    b = C;
                } else {
                    r = C;
                    b = X;
                }
                m = l - C / 2;
                r += m;
                g += m;
                b += m;
                return ({ r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255) });
 
 
            }
        };
 
 
        function calc() {
 
        }
*/


