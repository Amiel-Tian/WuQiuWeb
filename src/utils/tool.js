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
        res = res.replaceAll(":", "=")
        res = res.replaceAll(",", "&")
        return res;
    },

    /**
     * @description: 判断是否有按钮级权限1
     * @param {String} permission 多个使用 & 或 | 分隔开
     * @param {String} separator 分隔符：&-并且 |-或者
     * @return {*}
     * @author: gumingchen
     */
    havePermission(permission, separator = '&') {
        let result = false
        const permissions = permission
        let fn = ''
        switch (separator) {
            case '&':
                fn = 'every'
                break
            case '|':
                fn = 'some'
                break
        }
        const list = sessionStorage.getItem('permission') || [];
        result = fn && permissions[fn](item => {
            return list.indexOf(item) !== -1
        })
        return result
    },
    /**
     * 获取两日期间工作日。只排除周末
     */
    getWeekday(first, last) {
        if (!first || !last) {
            return 0;
        }
        //计算工作日方法：遍历这两个日期区间的每一个日期，获取他的getDay()

        //分别获取first和last的毫秒数(时间戳)

        first = new Date(first).getTime();
        last = new Date(last).getTime();

        var count = 0;
        for (var i = first; i <= last; i += 24 * 3600 * 1000) {
            var d = new Date(i);
            if (d.getDay() >= 1 && d.getDay() <= 5) {
                count++;
            }
        }
        return count;
    },

// 回显数据字典
    selectDictLabel(datas, value) {
        for (let index = 0; index < datas.length; index++) {
            if (datas[index].itemValue == value) {
                return datas[index].itemText;
            }
        }
    }
}