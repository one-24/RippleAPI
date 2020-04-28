;(window.onload = function () {
    function getRem() {
        var whdef = 100 / 1920;
        var wH = window.innerHeight;
        var wW = window.innerWidth - 17; 
        var rem = wW * whdef;
        document.getElementsByTagName("html")[0].style.fontSize = rem + "px";
    }
    getRem();
    window.onresize = getRem;
})();

