export default {
    changeJson(item) {
        // 将对象格式化成字符串
        var str = JSON.stringify(item) // JSON.stringify()用于将JavaScript对象或值转换为JSON字符串
        var str_ = str.slice(1, str.length - 1)
        var arr = []
        for (var i = 0; i < str_.length; i++) {
            arr.push(str_[i].replace('"', ''))
        }
        for (var j = 0; j < arr.length; j++) {
            if (arr[j] === '') {
                arr.splice(j, 1)
            }
        }
        var res = arr.join('')
        res = res.replaceAll(":","=")
        res = res.replaceAll(",","&")
        return res;
    },
}