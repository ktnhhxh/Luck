String.prototype.format = function () {
    if (arguments.length == 0) return this;
    var param = arguments[0];
    var s = this;
    if (typeof (param) == 'object') {
        for (var key in param)
            s = s.replace(new RegExp("\\{" + key + "\\}", "g"), param[key]);
        return s;
    } else {
        for (var i = 0; i < arguments.length; i++)
            s = s.replace(new RegExp("\\{" + i + "\\}", "g"), arguments[i]);
        return s;
    }
}

class 奖 {
    constructor(奖的名字) {
        this.名字 = 奖的名字
        // this.等级 = 奖的等级
        //时间的偏移量
    }
    toString() {
        return this.名字 + "塡"
    }
}

class 抽奖人 {
    constructor(人的名字, 人的份额) {
        this.名字 = 人的名字
        // this.等级 = 人的等级
        this.份额 = 人的份额
        // this.头像 = 人的头像
    }
    toString() {
        return this.名字 + "闄" + this.份额 + "塡"
    }
}

class 抽奖方案 {
    constructor(抽奖方案名称) {
        this.名称 = 抽奖方案名称
        this.奖项 = Array()
        this.参与者 = Array()
    }
    添加奖项(奖的名称) {
        this.奖项.push(new 奖(奖的名称))
    }
    添加人员(人的名称, 份额) {
        this.参与者.push(new 抽奖人(人的名称, 份额))
    }
    toString() {
        return this.名称 + '隓' +
            this.奖项.toString() + '隓' +
            this.参与者.toString()
    }
    fromString(string) {
        var strings = string.split('隓')
        this.名称 = strings[0]
        var 奖项s = strings[1].split('塡')
        for (var i = 0; i < 奖项s.length - 1; i++) {
            if (i != 0)
                奖项s[i] = 奖项s[i].substring(1)
            this.奖项.push(new 奖(奖项s[i]))
        }
        var 参与者s = strings[2].split('塡')
        for (var i = 0; i < 参与者s.length - 1; i++) {
            var 两个属性 = 参与者s[i].split('闄')
            if (i != 0)
                两个属性[0] = 两个属性[0].substring(1)
            this.参与者.push(new 抽奖人(两个属性[0], 两个属性[1]))
        }
    }
}

var 当前抽奖方案 = new 抽奖方案()
var 奖项ID = 0, 人员ID = 0
function 抽奖方案设置初始化() {
    $('#抽奖方案-奖项添加').click(function (e) {
        var name = $('#抽奖方案-奖的名称').val()
        if (name == "") {
            alert("奖的名称不能为空")
            return
        }
        var id = '抽奖方案-奖项{0}'.format(奖项ID.toString())
        奖项ID += 1
        $('#抽奖方案-奖项列表').html(
            "{0}<li id={1} class='抽奖方案-奖项'>{2}</li>".format(
                $('#抽奖方案-奖项列表').html(),
                id, name
            )
        )
        $('.抽奖方案-奖项'.format(id)).click(function (e) {
            alert($(e.currentTarget).attr('id'))
            //TODO : 删除 修改 取消 对话框
        })
    })

    $('#抽奖方案-人员添加').click(function (e) {
        var name = $('#抽奖方案-人的名称').val()
        if (name == "") {
            alert("人的名称不能为空")
            return
        }
        var id = '抽奖方案-人员{0}'.format(人员ID.toString())
        var input_id = '抽奖方案-人员份额{0}'.format(人员ID.toString())
        人员ID += 1
        $('#抽奖方案-人员列表').html(
            "{0}<tr><td><li id={1} class='抽奖方案-人员'>{2}</li></td><td><input size='2' id='{3}'/></td></tr>".format(
                $('#抽奖方案-人员列表').html(),
                id, name, input_id
            )
        )
        $('.抽奖方案-人员'.format(id)).click(function (e) {
            alert($(e.currentTarget).attr('id'))
            //TODO : 删除 修改 取消 对话框
        })
    })

    $('#抽奖方案-清空').click(function (e) {
        $('#抽奖方案-抽奖方案名称').val('')
        $('#抽奖方案-奖的名称').val('')
        $('#抽奖方案-人的名称').val('')
        $('#抽奖方案-奖项列表').html('')
        $('#抽奖方案-人员列表').html('')
    })

    $('#抽奖方案-保存').click(function (e) {
        $(".main").fadeOut()
    })

    $('#抽奖方案-添加').click(function (e) {
        当前抽奖方案.名称 = $('#抽奖方案-抽奖方案名称').val()
        for (var i = 0; i < 奖项ID; i++) {
            当前抽奖方案.添加奖项($('#抽奖方案-奖项{0}'.format(i)).text())
        }

        for (var i = 0; i < 人员ID; i++) {
            当前抽奖方案.添加人员(
                $('#抽奖方案-人员{0}'.format(i)).text(),
                $('#抽奖方案-人员份额{0}'.format(i)).val())
        }
        $('#now-solution').text(当前抽奖方案.名称)
        $(".main").fadeOut()
    })
}

function 界面按钮初始化() {
    抽奖方案设置初始化()
    $('#添加抽奖方案').click(function (e) {
        $(".main").fadeIn()
    })
    $('#导入').change(
        function (e) {
            var reader = new FileReader()
            reader.readAsText($('#导入').get(0).files[0])
            reader.onload = function () {
                当前抽奖方案.fromString(this.result)
                $('#now-solution').text(当前抽奖方案.名称)
            }
        }
    )
    $('#导出').click(function (e) {
        var string = 当前抽奖方案.toString()
        $('#下载').attr('href', 'data:text/plain;utf-8,' + string)
        $('#下载')[0].click()
    })
    $('#抽奖').click(function (e) {
        var sum = 0
        for (var i = 0; i < 当前抽奖方案.参与者.length; i++) {
            sum += parseInt(当前抽奖方案.参与者[i].份额, 10)
        }
        var val = Math.floor(Math.random() * sum)
        var i = 0
        while (val > 0) {
            val -= parseInt(当前抽奖方案.参与者[i].份额, 10)
            i += 1
        }
        $('#名字').text(当前抽奖方案.参与者[i].名字)
    })
}
/*!Function
    \brief 主函数
    \param[in] none
    \param[out] none
    \retval none
*/
function main() {
    界面按钮初始化()
}
$(document).ready(main)
//saveBtn.setAttribute('href', 'data:text/paint; utf-8,' + content.value);