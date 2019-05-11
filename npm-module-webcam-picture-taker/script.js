var captured

const vlib = {
    FPS: 30,
    init() {
        this.canvas = document.querySelector('#c1')
        this.video = document.querySelector('#v2')
        this.ctx = this.canvas.getContext('2d')
        this.w = this.canvas.width = document.querySelector('.parent').offsetWidth
        this.h = this.canvas.height = document.querySelector('.parent').offsetHeight
        this.video.addEventListener('play', _ => this.copy())
        this.startCamera()
        this.container = document.querySelector('.parent')
        this.resizable = document.querySelector('#cropper')
        this.saver = document.querySelector('#saver')
        this.capture = document.querySelector('#capture')
        this.editer = document.querySelector('#update')
        this.crop = document.querySelector('#crop')

    },
    copy() {

        this.ctx.drawImage(this.video, 0, 0, this.w, this.h)
        this.process()
        if (this.video.ended || this.video.paused)
            return
        this.captured = setTimeout(_ => this.copy(), 1000 / this.FPS)
    },
    capturer() {

        clearInterval(this.captured)
        applyFilter(this.ctx)

        this.ctx.drawImage(this.video, 0, 0, this.w, this.h)
        applyFilterSt(this.video)

        this.saver.onclick = function () { saveImageProfil() }
        this.saver.removeAttribute('disabled');

    },
    process() {
        const imageData = this.ctx.getImageData(0, 0, this.w, this.h)
        applyFilter(this.ctx)

        applyOpacity(this.resizable)

        /*
        for (let i = 0; i < d.length; i += 4) {
 
            const r = d[i], g = d[i + 1], b = d[i + 2], a = d[i + 3]
 
            d[i] = d[i] * contrast + intercept;
            d[i + 1] = d[i + 1] * contrast + intercept;
            d[i + 2] = d[i + 2] * contrast + intercept;
 
 
            //data[i] = data[i + 1] = data[i + 2] = (r + g + b) / 3
        }*/
        this.ctx.putImageData(imageData, 0, 0)

    },
    async startCamera() {
        this.video2 = document.querySelector('#v2')
        let stream
        try {
            stream = await navigator.mediaDevices.getUserMedia({ video: true })
            this.video2.srcObject = stream
            enableBtns()


        } catch (error) {
            console.log("something was wrong")
            videoReplace = document.querySelector('#v2')
            videoReplace.src = "Big_Buck_Bunny_Trailer.mp4"
            enableBtns()
        }
    }
}
vlib.init()

/*
function enableBtns() {


}
*/

const enableBtns = () => {
    vlib.capture.removeAttribute('disabled');
    vlib.editer.removeAttribute('disabled');
    vlib.crop.removeAttribute('disabled');

    vlib.capture.onclick = function () { startCounting(this) }
    vlib.editer.onclick = function () { showEditDiv() }
    vlib.crop.onclick = function () { showCropper() }
}

const startCounting = (link) => {

    this.captured = false
    spanChrono = document.querySelector('.compt')

    var cc = 4;

    link.classList.add('btn-default');
    link.classList.remove('btn-primary');
    link.onclick = null;

    var interval = setInterval(function () {
        spanChrono.innerHTML = '  <i class="glyphicon glyphicon-time"></i>  ' + --cc + ' s';

        if (cc == 0) {
            clearInterval(interval);

            link.classList.add('btn-primary');
            link.classList.remove('btn-default');
            link.onclick = "startCounting(" + link + ")";

            link.onclick = function () {
                startCounting(link)
            }
            spanChrono.innerHTML = ""
            vlib.capturer()
        }

    }, 1000);
}


const applyOpacity = (resizable) => {

    resizable.style.background = "rgba(0,0,0,0.1)";


}


const crop = (canvas, offsetX, offsetY, width, height) => {
    var buffer = document.createElement('canvas');
    var b_ctx = buffer.getContext('2d');

    buffer.width = width;
    buffer.height = height;

    b_ctx.drawImage(canvas, offsetX, offsetY, width, height,
        0, 0, buffer.width, buffer.height);
    return buffer.toDataURL("image/png");
}

const saveImageProfil = () => {

    let state = vlib.resizable.style.display;
    let imgData

    if (state == "block")
        imgData = crop(vlib.canvas, vlib.resizable.offsetLeft, vlib.resizable.offsetTop, vlib.resizable.offsetWidth, vlib.resizable.offsetHeight);
    else
        imgData = vlib.canvas.toDataURL("image/png");

    localStorage.setItem("imgData", imgData.replace(/^data:image\/(png|jpg);base64,/, ""));
    window.location = "profile.html";
}

const showEditDiv = () => {
    let state = document.getElementById('editPanel').style.display;
    if (state == "block")
        document.getElementById('editPanel').style.display = "none";
    else
        document.getElementById('editPanel').style.display = "block";

}

vi = document.querySelector('#v2')

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
const applyFilter = (ctx) => {
    ctx.filter = 'contrast(' + contr + '%) hue-rotate(' + hu + 'deg) saturate(' + sat + '%) brightness(' + ligh + '%)';
    vi.style.filter = ctx.filter;
}

const applyFilterSt = (vi) => {
    vi.style.filter = 'contrast(' + contr + '%) hue-rotate(' + hu + 'deg) saturate(' + sat + '%) brightness(' + ligh + '%)';
    setTimeout(_ => applyFilterSt(vi), 1000 / this.FPS)

}

var rng1 = document.querySelector("#contrast"),
    rng2 = document.querySelector("#hue"),
    rng3 = document.querySelector("#saturation"),
    rng4 = document.querySelector("#lightness")

var contr = rng1.value, hu = rng2.value, sat = rng3.value, ligh = rng4.value


rng1.addEventListener('change', (evt) => {
    contr = rng1.value;
})
rng2.addEventListener('change', (evt) => {
    hu = rng2.value;
})
rng3.addEventListener('change', (evt) => {
    sat = rng3.value;
})
rng4.addEventListener('change', (evt) => {
    ligh = rng4.value;
})
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

const showCropper = () => {

    let state = document.querySelector('.cropper-dragger').style.display;
    if (state == "block")
        document.querySelector('.col-md-6 .cropper-dragger').style.display = "none";
    else {
        document.querySelector('.col-md-6 .cropper-dragger').style.display = "block";
        console.log(state)
    }
}

var topx = 70, btmx = 70;

var mydragg = function () {
    return {
        move: function (divid, xpos, ypos) {
            divid.style.left = xpos + 'px';
            divid.style.top = ypos + 'px';
            initMov(divid)
        },
        startMoving: function (divid, container, evt) {



            var style = getComputedStyle(divid);


            evt = evt || window.event;
            var posX = evt.clientX,
                posY = evt.clientY,
                divTop = style.top,
                divLeft = style.left,
                eWi = parseInt(divid.style.width),
                eHe = parseInt(divid.style.height),
                cWi = parseInt(document.querySelector('.' + container).offsetWidth) + 2,
                cHe = parseInt(document.querySelector('.' + container).offsetHeight) + 2;
            document.querySelector('.' + container).style.cursor = 'move';


            divTop = divTop.replace('px', '');
            divLeft = divLeft.replace('px', '');
            var diffX = posX - divLeft,
                diffY = posY - divTop;
            document.onmousemove = function (evt) {
                evt = evt || window.event;
                var posX = evt.clientX,
                    posY = evt.clientY,
                    aX = posX - diffX,
                    aY = posY - diffY;
                if (aX < 0) aX = 0;
                if (aY < 0) aY = 0;
                if (aX + eWi > cWi) aX = cWi - eWi;
                if (aY + eHe > cHe) aY = cHe - eHe;
                mydragg.move(divid, aX, aY);
            }
        },
        stopMoving: function (container) {
            var a = document.createElement('script');
            document.querySelector('.' + container).style.cursor = 'default';
            document.onmousemove = function () { }

        },
    }
}();


var resizable = document.querySelector('.cropper-dragger'),
    resizer1 = document.querySelector('#pr7'),
    resizer2 = document.querySelector('#pr6'),


    parent = document.querySelector('.parent'),
    frame = document.querySelector('.frame'),
    resizer3 = document.querySelector('#pr3'),
    resizer4 = document.querySelector('#pr4'),
    resizer5 = document.querySelector('#pr8')
resizer6 = document.querySelector('#pr1')


var rect = parent.getBoundingClientRect();

var i = 0;
var etat = 0;

resizer1.style.cursor = 'se-resize';
resizer1.addEventListener('mousedown', initResize, false);

resizer2.style.cursor = 'n-resize';
resizer2.addEventListener('mousedown', initResize, false);

resizer3.style.cursor = 'n-resize';
resizer3.addEventListener('mousedown', initResize, false);

resizer4.style.cursor = 'ew-resize';
resizer4.addEventListener('mousedown', initResize, false);

resizer5.style.cursor = 'ew-resize';
resizer5.addEventListener('mousedown', initResize, false);

resizer6.style.cursor = 'sw-resize';
resizer6.addEventListener('mousedown', initResize, false);

const initResize = (e) => {

    document.addEventListener('mousemove', Resize, false);
    document.addEventListener('mouseup', stopResize, false);

}

const initMov = (divid) => {
    btmx = parseInt(divid.style.top, 10) + 0.1
    i = 0
    topx = divid.offsetTop
}

const Resize = (e) => {


    if (e.clientX > rect.right - 2 || e.clientY + 2 > rect.bottom || e.clientY + 5 < rect.top || e.clientX < rect.left) {
        return;
    }

    if (e.target.id == "pr6") {

        resizable.className = ""
        resizable.className = "cropper-dragger"

        resizable.style.top = btmx + "px"

        resizable.style.height = (e.clientY - rect.top - resizable.offsetTop) + 5 + 'px';
        frame.style.height = resizable.style.height

        pr4.style.top = (e.clientY - rect.top - resizable.offsetTop) / 2 + 'px'
        pr8.style.top = (e.clientY - rect.top - resizable.offsetTop) / 2 + 'px'

        topx = btmx
        i = 0

    } else if (e.target.id == "pr3") {

        resizable.className = ""
        resizable.className = "reverse-cropper-dragger"
        resizable.style.top = ""

        if (i == 0) {
            resizable.style.bottom = rect.height - topx - resizable.offsetHeight + 'px'
        }

        if (e.clientY - rect.top - resizable.offsetTop + resizable.offsetHeight - 0.5 >= parseInt(resizable.style.height, 10) && e.clientY > rect.top)
            resizable.style.height = parseInt(resizable.style.height, 10) + 3 + 'px';
        else
            resizable.style.height = parseInt(resizable.style.height, 10) - 3 + 'px';


        frame.style.height = resizable.style.height

        btmx = resizable.offsetTop
        i++

        pr4.style.top = parseInt(resizable.style.height, 10) / 2 + 'px'
        pr8.style.top = parseInt(resizable.style.height, 10) / 2 + 'px'

    } else if (e.target.id == "pr4") {

        console.log("resizerornge")

    }
    else if (e.target.id == "pr8") {

        resizable.style.width = (e.clientX - rect.left - resizable.offsetLeft) + 5 + 'px';
        frame.style.width = resizable.style.width
        pr3.style.left = parseInt(resizable.style.width, 10) / 2 + 'px'
        pr6.style.left = parseInt(resizable.style.width, 10) / 2 + 'px'

    }

    else if (e.target.id == "pr7") {

        resizable.className = ""
        resizable.className = "cropper-dragger"

        resizable.style.top = btmx + "px"


        resizable.style.width = (e.clientX - rect.left - resizable.offsetLeft) + 5 + 'px';
        resizable.style.height = (e.clientY - rect.top - resizable.offsetTop) + 5 + 'px';

        pr3.style.left = (e.clientX - rect.left - resizable.offsetLeft) / 2 + 'px'
        pr4.style.top = (e.clientY - rect.top - resizable.offsetTop) / 2 + 'px'
        pr6.style.left = (e.clientX - rect.left - resizable.offsetLeft) / 2 + 'px'
        pr8.style.top = (e.clientY - rect.top - resizable.offsetTop) / 2 + 'px'

        frame.style.width = resizable.style.width
        frame.style.height = resizable.style.height

        topx = btmx
        i = 0

    }


    else if (e.target.id == "pr1") {

        resizable.className = ""
        resizable.className = "reverse-cropper-dragger"
        resizable.style.top = ""


        if (i == 0) {
            resizable.style.bottom = rect.height - topx - resizable.offsetHeight + 'px'
        }

        if (e.clientY - rect.top - resizable.offsetTop + resizable.offsetHeight - 1 >= parseInt(resizable.style.height, 10))
            resizable.style.height = parseInt(resizable.style.height, 10) + 3 + 'px';
        else
            resizable.style.height = parseInt(resizable.style.height, 10) - 3 + 'px';

        frame.style.height = resizable.style.height


        if (etat < e.clientX) {
            resizable.style.width = parseInt(resizable.style.width, 10) + 3 + 'px';
        } else if (etat > e.clientX) {
            resizable.style.width = parseInt(resizable.style.width, 10) - 3 + 'px';
        }
        frame.style.width = resizable.style.width

        etat = e.clientX
        btmx = resizable.offsetTop
        i++



        pr4.style.top = parseInt(resizable.style.width, 10) / 2 + 'px'

        pr3.style.left = (e.clientX - rect.left - resizable.offsetLeft) / 2 + 'px'
        pr6.style.left = (e.clientX - rect.left - resizable.offsetLeft) / 2 + 'px'
        pr8.style.bottom = (parseInt(resizable.style.width, 10) - 20) / 2 + 'px'

    }

}
const stopResize = (e) => {
    document.removeEventListener('mousemove', Resize, false);
    document.removeEventListener('mouseup', stopResize, false);

}