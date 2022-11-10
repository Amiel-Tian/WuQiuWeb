export default {
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
}