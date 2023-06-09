export default {
    changeJson(item) {
        // 将对象格式化成字符串
        let str = JSON.stringify(item) // JSON.stringify()用于将JavaScript对象或值转换为JSON字符串
        let str_ = str.slice(1, str.length - 1)
        let arr = []
        for (let i = 0; i < str_.length; i++) {
            arr.push(str_[i].replace('"', ''))
        }
        for (let j = 0; j < arr.length; j++) {
            if (arr[j] === '') {
                arr.splice(j, 1)
            }
        }
        let res = arr.join('')
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

    /*  获取数据字典
   * dictValue,value
   * */
    selectDict(dictValue) {
        const list = sessionStorage.getItem('dictionaries') ? JSON.parse(sessionStorage.getItem('dictionaries')) : [];
        let datas = list
        if (dictValue) {
            datas = datas.filter(f => {
                return f.value == dictValue
            })
        }
        if (datas && datas.length > 0) {
            return datas[0].children
        }
        return [];
    },
    /*  回显数据字典
    * dictValue,value
    * */
    selectDictLabel(dictValue, value) {
        const list = sessionStorage.getItem('dictionaries') ? JSON.parse(sessionStorage.getItem('dictionaries')) : [];
        dictValue += ""
        value += ""
        let datas = list
        if (!dictValue || !value) {
            return "";
        }
        if (dictValue) {
            datas = datas.filter(f => {
                return f.value == dictValue
            })
        }
        for (let data of datas) {
            if (data.children) {
                for (let children of data.children) {
                    if (children.value == value) {
                        return children.name
                    }
                }
            }
        }
    },
    /**
     * 获取时间
     * @param dateStamp 时间戳
     * */
    getDate(dateStamp) {
        //获取当前时间并打印
        let date = new Date();
        if (dateStamp) {
            date = new Date(dateStamp);
        }
        let yy = date.getFullYear();
        let mm = date.getMonth() + 1;
        let dd = date.getDate();
        let hh = date.getHours();
        let mf = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
        let ss = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
        return yy + '-' + mm + '-' + dd + ' ' + hh + ':' + mf + ':' + ss;
    },
}