;$(function () {
        let langSt = window.localStorage;
        let checkToken = langSt.getItem("tok");
        let user = langSt.getItem("user");
        if(checkToken && user){
            user = JSON.parse(user);
            let loginname = user.name;
            let psw = user.pass;
            console.log(loginname,psw);
            $.ajax({
                url: "http://192.168.101.161:8082/login",
                type: "post",
                async: true,
                data: {
                    loginname,
                    psw
                },
                success: function (res) {
                    console.log(res);
                    console.log("object");
                    if (res.msgCode == "200" && res.result == "SUCCESS") {
                        console.log("成功");
                        // 保存 用户信息和 token 到本地
                        var user = {
                            name: loginname,
                            pass: psw
                        };
                        var token = res.data;
                        window.localStorage.setItem("user", JSON.stringify(user));
                        window.localStorage.setItem("tok", token);
                        // 显示个人中心  刷新页面
                        $("#RB-header-login").addClass("toggleDis");
                        $("#RB-header-personal").removeClass("toggleDis");
                    }
                }
            })
        }else{
            // 加载登录注册模态框
        $(".modalBox").load("/src-local/pages/modal/modal.html", function () {
            // 打开模态框
            $("#RB-header-login").on("click", "a:eq(1)", function () {
                $(".modal-login").removeClass("is-active");
                $(".modal-forget").removeClass("is-active");
                $(".modal-register").addClass("is-active");
            })
            $("#RB-header-login a").eq(0).click(function () {
                $(".modal-forget").removeClass("is-active");
                $(".modal-register").removeClass("is-active");
                $(".modal-login").addClass("is-active");
            });
            // 去登录
            $("#modalRegisterGoLogin").click(function () {
                $(".modal-register").removeClass("is-active");
                $(".modal-forget").removeClass("is-active");
                $(".modal-login").addClass("is-active");
            })
            // 去注册
            $("#modalRegisterGoRegister").click(function () {
                $(".modal-login").removeClass("is-active");
                $(".modal-forget").removeClass("is-active");
                $(".modal-register").addClass("is-active");
            })
            // 去注册
            // 关闭模态框
            function closeModal() {
                $(".modal").removeClass("is-active");
            };
            $(".modal-close").click(closeModal)
            $(".modal-background").click(closeModal)
        })
        }
         //  language
        // 获取语言
        let lang = langSt.getItem("lang");
        if(lang == "En"){
            $("[data-localize]").localize("/src-local/json/lang", { language: "en" });
            $("#RB-header-language a").eq(0).text("English");
            $("#RB-header-language span").text("简体中文");
        }else{
            $("[data-localize]").localize("/src-local/json/lang", { language: "ch" });
            $("#RB-header-language a").eq(0).text("简体中文");
            $("#RB-header-language span").text("English");
        }
         $("#RB-header-language").on("click",function(){
            if( $(".languageEn").css("display") == "none"){
                $(".languageEn").css("display","block");
            }else{
            $(".languageEn").css("display","none");
            }
        })
        $(".languageEn").on("click",function(){
            let langEl = $(this);
            if(langEl.text() == "English"){
                $("[data-localize]").localize("/src-local/json/lang", { language: "en" })
                langEl.prev().prev("a").text("English");
                langEl.text("简体中文");
                langSt.setItem("lang","En");
            }else{
                $("[data-localize]").localize("/src-local/json/lang", { language: "ch" })
                langEl.prev().prev("a").text("简体中文");
                langEl.text("English");
                langSt.setItem("lang","Ch");
            }
        })
   
});