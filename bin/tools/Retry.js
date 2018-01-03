"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 包装传入的方法，调用时，如果传入的方法发生异常则重新执行，最多重试3次
 */
function Retry3(func) {
    async function wrap(...args) {
        try {
            return await func(...args);
        }
        catch (_a) {
            try {
                return await func(...args);
            }
            catch (_b) {
                return await func(...args);
            }
        }
    }
    return wrap;
}
exports.Retry3 = Retry3;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInRvb2xzL1JldHJ5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQ0E7O0dBRUc7QUFDSCxnQkFBbUUsSUFBTztJQUN0RSxLQUFLLGVBQWUsR0FBRyxJQUFXO1FBQzlCLElBQUksQ0FBQztZQUNELE1BQU0sQ0FBQyxNQUFNLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDO1FBQy9CLENBQUM7UUFBQyxLQUFLLENBQUMsQ0FBQyxJQUFELENBQUM7WUFDTCxJQUFJLENBQUM7Z0JBQ0QsTUFBTSxDQUFDLE1BQU0sSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUM7WUFDL0IsQ0FBQztZQUFDLEtBQUssQ0FBQyxDQUFDLElBQUQsQ0FBQztnQkFDTCxNQUFNLENBQUMsTUFBTSxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQztZQUMvQixDQUFDO1FBQ0wsQ0FBQztJQUNMLENBQUM7SUFFRCxNQUFNLENBQUMsSUFBVyxDQUFDO0FBQ3ZCLENBQUM7QUFkRCx3QkFjQyIsImZpbGUiOiJ0b29scy9SZXRyeS5qcyIsInNvdXJjZXNDb250ZW50IjpbIlxyXG4vKipcclxuICog5YyF6KOF5Lyg5YWl55qE5pa55rOV77yM6LCD55So5pe277yM5aaC5p6c5Lyg5YWl55qE5pa55rOV5Y+R55Sf5byC5bi45YiZ6YeN5paw5omn6KGM77yM5pyA5aSa6YeN6K+VM+asoVxyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIFJldHJ5MzxUIGV4dGVuZHMgKC4uLmFyZ3M6IGFueVtdKSA9PiBQcm9taXNlPGFueT4+KGZ1bmM6IFQpOiBUIHtcclxuICAgIGFzeW5jIGZ1bmN0aW9uIHdyYXAoLi4uYXJnczogYW55W10pIHtcclxuICAgICAgICB0cnkgeyAgIC8v6YeN6K+VM+asoVxyXG4gICAgICAgICAgICByZXR1cm4gYXdhaXQgZnVuYyguLi5hcmdzKTtcclxuICAgICAgICB9IGNhdGNoIHtcclxuICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBhd2FpdCBmdW5jKC4uLmFyZ3MpO1xyXG4gICAgICAgICAgICB9IGNhdGNoIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBhd2FpdCBmdW5jKC4uLmFyZ3MpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB3cmFwIGFzIGFueTtcclxufSJdfQ==
