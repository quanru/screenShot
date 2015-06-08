window.onload = drag;

function drag() {
    var rect = document.getElementById("shotRect"), // 拖曳框
        loadBtn = document.getElementById("loadBtn"), //载入图片按钮
        saveBtn = document.getElementById("saveBtn"), //保存图片按钮
        originImg = document.getElementById("originImg"),
        brConer = document.getElementsByClassName("resizeBR")[0]; //右下角调节大小
    rect.addEventListener("mousedown", dragDown); //按住截图框
    loadBtn.addEventListener("click", loadImg); //载入图片
    saveBtn.addEventListener("click", saveImg); //保存图片
    originImg.addEventListener("mousedown", longClick); //长按弹出截图框
    originImg.addEventListener("mouseup", clearTime); //释放清楚定时器
    brConer.addEventListener("mousedown", resizeDown); //按住调节大小
}

function dragDown(event) {
    event = event || window.event;
    if (event.target !== event.currentTarget) return; //如果是从子元素冒上来的，返回
    var shotRect = document.getElementById("shotRect"),
        disX = event.clientX - shotRect.offsetLeft, // 光标按下时光标相对截图框的坐标
        disY = event.clientY - shotRect.offsetTop;
    //绑定事件 
    document.addEventListener("mousemove", mouseMove);
    document.addEventListener("mouseup", mouseUp);

    function mouseMove(event) {
        event = event || window.event;
        var disL = event.clientX - disX, //截图框左边界与左侧边界的距离
            disT = event.clientY - disY, //截图框上边界与上侧边界的距离
            maxW = document.getElementById("originImg").clientWidth - shotRect.offsetWidth, //最大宽度
            maxH = document.getElementById("originImg").clientHeight - shotRect.offsetHeight; //最大高度
        //超过边界则重置
        if (disL < 0) {
            disL = 0;
        } else if (disL > maxW) {
            disL = maxW + 1;
        }
        if (disT < 0) {
            disT = 0;
        } else if (disT > maxH) {
            disT = maxH + 1;
        }
        shotRect.style.left = disL + 'px'; //重新计算截图框的相对位置
        shotRect.style.top = disT + 'px';
        updateRect(disL, disT, shotRect.offsetWidth, shotRect.offsetHeight);
    }

    function mouseUp(event) {
        document.removeEventListener("mousemove", mouseMove);
        document.removeEventListener("mouseup", mouseUp);
    }
}

function loadImg(event) { //载入图片
    //document.getElementById("originImg").setAttribute('src', 'vegetable.jpg');
    cOri = document.getElementById("originImg");
    imgOri = new Image();
    ctxOri = cOri.getContext("2d");
    imgOri.src = "vegetable.jpg";
    imgOri.onload=function(){
        ctxOri.drawImage(imgOri,0,0,500,500);
    };
}

function saveImg(event) {
    var image = cPre.toDataURL("image/png");
    var w = window.open('about:blank', 'image from canvas');
    w.document.write("<img src='" + image + "' alt='from canvas'/>");
}

function longClick(event) { //长按弹出截图框
    event = event || window.event;
    var shotRect = document.getElementById("shotRect");
    timeout = setTimeout(function() {
        shotRect.style.display = "block";
        var disX = event.clientX - shotRect.offsetWidth + 10,
            disY = event.clientY - shotRect.offsetHeight + 10;
        shotRect.style.left = disX + 'px';
        shotRect.style.top = disY + 'px';
        initCanvas();
        updateRect(disX, disY, shotRect.offsetWidth, shotRect.offsetHeight);
    }, 1000);
}

function clearTime(event) {
    clearTimeout(timeout);
}

function resizeDown(event) {
    event = event || window.event;
    var shotRect = document.getElementById("shotRect"),
        //计算Rect左上角的坐标 
        x = event.clientX - shotRect.offsetWidth,
        y = event.clientY - shotRect.offsetHeight;
    //绑定事件 
    document.addEventListener("mousemove", mouseMove);
    document.addEventListener("mouseup", mouseUp);
    //移动鼠标
    function mouseMove(event) {
        event = event || window.event;
        var finalX = event.clientX,
                finalY = event.clientY;
        //防止超过边界
        if (event.clientX >= 513) {
            finalX = 513;
        }
        if (event.clientY >= 513) {
            finalY = 513;
        }
        xy = finalX - x < finalY - y ? finalX -x : finalY - y;
        //计算移动后的Rect新大小
        shotRect.style.width = xy + 'px';
        shotRect.style.height = xy + 'px';
        updateRect(x - 15, x - 15, shotRect.offsetWidth, shotRect.offsetHeight);
    }
    //停止事件 
    function mouseUp() {
        //卸载事件 
        document.removeEventListener("mousemove", mouseMove);
        document.removeEventListener("mouseup", mouseUp);
    }
}

function initCanvas() {//初始化预览画布
    cPre = document.getElementById("showPre");
    ctxPre = cPre.getContext("2d");
    img = document.getElementById("originImg");
}

function updateRect(x, y, w, h) {//更新画布
    ctxPre.clearRect(0, 0, 500, 500); //清空画布
    //var imgData = ctxOri.getImageData(x, y, w, h);
    //ctxPre.putImageData(imgData, 0, 0, 0, 0, 500, 500);
    ctxPre.drawImage(img, x, y, w, h, 0, 0, 500, 500);
}