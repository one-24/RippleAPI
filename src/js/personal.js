; (function () {
    $(function () {
        //获取语言
        if (window.localStorage.getItem("lang") == "En") {
            $("[data-localize]").localize("/json/lang", { language: "en" });
            $("#RB-header-language a").eq(0).text("English");
            $("#RB-header-language span").text("简体中文");
        } else {
            $("[data-localize]").localize("/json/lang", { language: "ch" });
            $("#RB-header-language a").eq(0).text("简体中文");
            $("#RB-header-language span").text("English");
        }
         var   baseUrl = "xrp.XRPPAY.VIP",
            localStorage = window.localStorage;
        let token = localStorage.getItem("tok");
        let user = JSON.parse(window.localStorage.getItem("user"));
        let userCanGetKey = true;
        //加密的私钥
        var key = 'WalletApi';
        // DES加密
        function encryptByDES(message, key) {
            var keyHex = CryptoJS.enc.Utf8.parse(key);
            var encrypted = CryptoJS.DES.encrypt(message, keyHex, {
                mode: CryptoJS.mode.ECB,
                padding: CryptoJS.pad.Pkcs7
            });
            return encrypted.toString();
        }
        // 获取用户信息
        function getUserInfo() {
            $.ajax({
                url: baseUrl + "/user/getUserInfo",
                type: "post",
                headers: {
                    token
                },
                success(res) {
                    if (res.msgCode == "200" && res.result == "SUCCESS") {
                        if(res.data.status == "1"){
                            userCanGetKey = false;
                            $(".ApplyKeyBtn").val("申请KEY(审核中)");
                            $(".ApplyKeyBtn").css("display", "block");
                            $(".ApplyKeyBtn").css("cursor", "help");      
                            $(".ApplyKeyBtn").attr("disabled", "disabled");    
                        }else if(res.data.status == "2"){
                            userCanGetKey = false;
                            $(".inputKey").val(res.data.key);
                            $(".ApplyKeyBtn").attr("disabled", "disabled");    
                            $(".ApplyKeyBtn").css("display", "none");
                        }else if(res.data.status == "3"){
                            userCanGetKey = true;
                            $(".ApplyKeyBtn").val("申请KEY");
                            $(".ApplyKeyBtn").css("display", "block");
                        }
                        let {
                            comeAddress,
                            loginName,
                            registerTime,
                            toAddress
                        } = res.data;
                        $(".right-personalInfo .personalEmailNumber").val(loginName);
                        $(".right-personalInfo .personalPassword").val(user.pass);
                        $(".right-personalInfo .comeaddress").val(comeAddress);
                        $(".right-personalInfo .toaddress").val(toAddress);
                    }
                }
            })
        }
        getUserInfo()

        // 修改   发送验证码
        function change(elToActive) {
            elToActive.addClass("is-active");
            $(".rightFixEmail").val(user.name);
            elToActive.on("click", ".rightFixSendMsg", function () {
                console.log("object");
                var sendCodeTime = 60;
                var timer = setInterval(function () {
                    sendCodeTime--
                    $(".sendTime span").text(sendCodeTime);
                    if (sendCodeTime <= 0) {
                        clearInterval(timer)
                    }
                }, 1000)
                $.ajax({
                    url: baseUrl + "/user/sendMailCode",
                    type: "post",
                    data: {
                        mail: user.name
                    }
                })
            })
        }
        // 点击修改密码
        $(".right-personalInfo").on("click", ".changePassWord", function () {
            var changePassWord = $(".modal-changePassWord");
            change(changePassWord)
            // 确认修改
            $(".btnSureChangePassword").on("click", function () {
                let newPas = encryptByDES($(".rightFixNewPassword").val(), key);
                let surePassword = encryptByDES($(".rightFixSureNewPassword").val(), key);
                $.ajax({
                    url: baseUrl + "/user/updatePsw",
                    type: "post",
                    headers: {
                        token
                    },
                    data: {
                        mail: user.name,
                        code: $(".modal-changePassWord .rightFixCode").val(),
                        psw: newPas,
                        confirmPsw: surePassword
                    },
                    success: function (res) {
                        if (res.msgCode == "200" && res.result == "SUCCESS") {
                            // 将新密码存到本地
                            let userInfo = {
                                name: user.name,
                                pass: newPas
                            }
                            window.localStorage.setItem("user", JSON.stringify(userInfo));
                            changePassWord.removeClass("is-active");
                        }
                    }
                })
            })
        })
        // 点击修改收款地址
        $(".right-personalInfo").on("click", ".changeComeaddress", function () {
            var changeComeAddress = $(".modal-changeComeAddress");
            change(changeComeAddress);
            $(".btnSureChangeComeAddress").on("click", function () {
                let newComeAddress = $(".rightFixNewComeAddress").val();
                $.ajax({
                    url: baseUrl + "/user/updateComeAddress",
                    type: "post",
                    headers: {
                        token
                    },
                    data: {
                        mail: user.name,
                        code: $(".modal-changeComeAddress .rightFixCode").val(),
                        comeAddress: newComeAddress
                    },
                    success: function (res) {
                        if (res.msgCode == "200" && res.result == "SUCCESS") {
                            $(".comeaddress").val(newComeAddress);
                            changeComeAddress.removeClass("is-active")
                        }
                    }
                })
            })
        })
        // 点击修改打款地址
        $(".right-personalInfo").on("click", ".changeToAddress", function () {
            var changeToAddress = $(".modal-changeToAddress");
            change(changeToAddress);
            $(".btnSureChangeToAddress").on("click", function () {
                let newToAddress = $(".rightFixNewToAddress").val();
                $.ajax({
                    url: baseUrl + "/user/updateToAddress",
                    type: "post",
                    headers: {
                        token
                    },
                    data: {
                        mail: user.name,
                        code: $(".modal-changeToAddress .rightFixCode").val(),
                        toAddress: newToAddress
                    },
                    success: function (res) {
                        if (res.msgCode == "200" && res.result == "SUCCESS") {
                            $(".toaddress").val(newToAddress);
                            changeToAddress.removeClass("is-active")
                        }
                    }
                })
            })
        })
        // 关闭模态框
        function closeModal() {
            $(".modal").removeClass("is-active");
        };
        $(".modal-close").click(closeModal)
        $(".modal-background").click(closeModal)
        function closeModal() {
            $(".modal").removeClass("is-active");
        };
        $(".btn-sure").click(closeModal)
        $(".btn-cancel").click(closeModal)
        var keyDisplayTimes = 0;
        // 点击显示 key 
        $(".toggleKey").click(function () {
            if($(".inputKey").val()){
                let el = $(this);
                if (el.text() == "显示" && keyDisplayTimes == 0) {
                    keyDisplayTimes++
                    $(".Confirmation").addClass("is-active");
                    $(".displayKey input").attr("type", "text");
                    $(this).text("隐藏")
                } else {
                    $(".displayKey input").attr("type", "password");
                    $(this).text("显示")
                }
            }else{
                alert("请先申请key")
            }
        })
        // 获取转账记录
        function getRecordInfo(pageNo = 1, pageS = 10) {
            var type, sTime, eTime;
            // 获取 时间日期方式等
            var recordType = $(".method").val();
            if (recordType == "打款") {
                type = 1
            } else if (recordType == "收款") {
                type = 2
            } else {
                type = -1
            }
            sTime = $(".inputStime").val() || "2018-10-29";

            eTime = $(".inputEtime").val() || "2018-10-29";
            $.ajax({
                url: baseUrl + "/transfer/logs",
                type: "post",
                headers: {
                    token
                },
                data: {
                    type,
                    sTime,
                    eTime,
                    pageNo,
                    pageSize:pageS
                },
                success: function (res) {
                    if (res.msgCode == "200" && res.result == "SUCCESS") {
                        var recordHtml = template('recordList', { recordDataList: res.data.transLogs });
                        $("#record-table-tbody").html(recordHtml);
                        var {
                            pageNo,
                            pageSize,
                            totalNum,
                            totalPage
                        } = res.data.page;
                        var pageHtml = '';
                        for (let i = 1; i <= totalPage; i++) {
                            pageHtml += `<li class="fl"><a href="#">${i}</a></li>`
                        }
                        pageHtml += `<li class="fl"><a href="#" class="lastPage" data-localize="PersonMainLastPage">最后一页</a></li>
                                <li class="fl" data-localize="PersonMainJumpTo">跳转到 : <input type="text" class="text boxs orderPage"> <span data-localize="PersonMainPage">页</span></li>`;
                        $(".pagination").html(pageHtml)
                    }
                }
            })
        }
        // 输入时间过滤转账记录
        var timeReg = /((^((1[8-9]\d{2})|([2-9]\d{3}))([-\/\._])(10|12|0?[13578])([-\/\._])(3[01]|[12][0-9]|0?[1-9])$)|(^((1[8-9]\d{2})|([2-9]\d{3}))([-\/\._])(11|0?[469])([-\/\._])(30|[12][0-9]|0?[1-9])$)|(^((1[8-9]\d{2})|([2-9]\d{3}))([-\/\._])(0?2)([-\/\._])(2[0-8]|1[0-9]|0?[1-9])$)|(^([2468][048]00)([-\/\._])(0?2)([-\/\._])(29)$)|(^([3579][26]00)([-\/\._])(0?2)([-\/\._])(29)$)|(^([1][89][0][48])([-\/\._])(0?2)([-\/\._])(29)$)|(^([2-9][0-9][0][48])([-\/\._])(0?2)([-\/\._])(29)$)|(^([1][89][2468][048])([-\/\._])(0?2)([-\/\._])(29)$)|(^([2-9][0-9][2468][048])([-\/\._])(0?2)([-\/\._])(29)$)|(^([1][89][13579][26])([-\/\._])(0?2)([-\/\._])(29)$)|(^([2-9][0-9][13579][26])([-\/\._])(0?2)([-\/\._])(29)$))/;
        $(".inputStime").on("keypress", function () {
            let inputStimeVal = $(this).val();
            if (timeReg.test(inputStimeVal)) {
                getRecordInfo();
            }
        })
        $(".inputEtime").on("keypress", function () {
            let inputStimeVal = $(this).val();
            if (timeReg.test(inputStimeVal)) {
                getRecordInfo();
            }
        })
        // 个人信息 转账记录 的 tab 切换
        function tab() {
            //获取 所有的 menu  个人信息  转账记录 
            var lis = $(".menu li").slice(1, 3);
            $(lis).click(function () {
                $(this).addClass("active");
                $(this).siblings().removeClass("active");
                let index = $(this).index();
                if (index == 1) {
                    $($(".tab1")[0]).removeClass("tab").addClass("tabActive");
                    $($(".tab1")[1]).removeClass("tabActive").addClass("tab");
                }
                if (index == 2) {
                    $($(".tab1")[1]).removeClass("tab").addClass("tabActive");
                    $($(".tab1")[0]).removeClass("tabActive").addClass("tab");
                    getRecordInfo()
                }
            })
        }
        tab()
        // 点击页码 翻页
        $(".pagination").on("click", "li", function () {
            var nowPage = $(this).children("a").text()
            if(Number(nowPage)){
                getRecordInfo(nowPage);
                }
        })
        // 跳转到最后一页
        $(".pagination").on("click", ".lastPage", function () {
            var lastPage = $(this).parent().prev().children("a").text();
            getRecordInfo(lastPage)
        })
        // 跳转到指定页
        $(".pagination").on("keypress", ".orderPage", function (e) {
            if (e.keyCode == 13) {
                var orderPage = $(this).val();
                // 判断 输入的是否是数字 并且小于当前总页数
                if (parseInt(orderPage) && orderPage <= $(".pagination li").length - 2) {
                    getRecordInfo(orderPage)
                }
            }
        })
        // 选择转账方式
        var oneMethodType = '';
        $(".sanjiao").click(function () {
            oneMethodType = $(".method").val();
            var oneOfMethod = $(".oneMethod");
            var cssStyle = oneOfMethod.css("display");
            if (cssStyle == "none") {
                oneOfMethod.css("display", "block");
                return
            }
            oneOfMethod.css("display", "none");
        })
        $(".oneMethod").click(function () {
            $(".oneMethod").css("display", "none")
            if (oneMethodType != $(this).text()) {
                $(".method").val($(this).text());
                getRecordInfo()
            }
        })

        // 申请 key 
        $(".ApplyKeyBtn").click(function () {
            let userCanGetKeyComeAddress = $(".comeaddress").val();
            let userCanGetKeyToAddress = $(".toaddress").val();
            if (userCanGetKey) {
                if (userCanGetKeyComeAddress && userCanGetKeyToAddress) {
                    $.ajax({
                        headers: {
                            token
                        },
                        type: "post",
                        url: baseUrl + "/user/setApplyKey",
                        data: {
                            mail: user.name,
                            psw: user.pass,
                            toaddress: userCanGetKeyToAddress,
                            comeaddress: userCanGetKeyComeAddress,
                            token
                        },
                        success: function (res) {
                            if (res.msgCode == "200" && res.result == "SUCCESS") {
                                getKey()
                            } else if (res.msgCode == "500" && res.result == "FAIL") {
                                alert(res.msgContent)
                            } else {
                                alert("获取失败 请稍后再试")
                            }
                        }
                    })
                } else {
                    alert("请输入正确的收 / 打款地址");
                }
            }
        })
        // 获取 key 
        function getKey() {
            let token = window.localStorage.getItem("tok");
            $.ajax({
                type: "post",
                headers: {
                    token
                },
                url: baseUrl + "/getKey",
                data: {
                    token
                },
                success(res) {
                    $(".inputKey").val(res.data);
                    $(".ApplyKeyBtn").css("display", "none");
                }
            })
        }
        function DownLoad(options) {
            var config = $.extend(true, { method: 'post' }, options);
            var $iframe = $('<iframe id="down-file-iframe" />');
            var $form = $('<form target="down-file-iframe" method="' + config.method + '" />');
            $form.attr('action', config.url);
            for (var key in config.data) {
                $form.append('<input type="hidden" name="' + key + '" value="' + config.data[key] + '" />');
            }
            $iframe.append($form);
            $(document.body).append($iframe);
            $form[0].submit();
            $iframe.remove();
        }
        // 按时间 导出记录
        $(".btnExport1").on("click", function () {
            var sTime = $(".inputStime").val() || "2018-10-29";
            var eTime = $(".inputEtime").val() || "2018-10-29";
            var url = baseUrl + "/transfer/exportLogsByTime";
            var data = {
                sTime,
                eTime
            };
            DownLoad({ 
                url: url, data: data
            });
            
        })
        // 全部导出
        $(".btnExport2").on("click", function () {
            var sTime = $(".inputStime").val() || "2018-10-29";
            var eTime = $(".inputEtime").val() || "2018-10-29";
            $.ajax({
                url: baseUrl + "/transfer/exportLogs",
                headers: {
                    token
                }
            })
        })
        // 退出登录
        $(".exitLogon").on("click", function () {
            $.ajax({
                url: baseUrl + "/layout",
                headers: {
                    token
                },
                success: function () {
                    let w = window;
                    w.localStorage.removeItem("user");
                    w.localStorage.removeItem("tok");
                    w.location.href = "/index.html";
                }
            })
        })
    })
})();
