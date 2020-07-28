import Dep from './Dep.js'
class Observer {
  constructor(data) {
    this.walk(data);
  }
  walk(data) {
    //   如果data为空或者或者data不是对象
    if (!data || typeof data !== "object") {
      return;
    }
    Reflect.ownKeys(data).forEach((key) => {
      this.defineReactive(data, key, data[key]);
    });
  }
  defineReactive(data, key, value) {
    const that = this;
    // 给每个data添加一个观察者
    const dep = new Dep();
    // 递归检测属性值是否对象，是对象的话，继续将对象转换为响应式的
    this.walk(value);
    Reflect.defineProperty(data, key, {
      enumerable: true,
      configurable: true,
      get() {
        // 实例化Wathcer的时候，会回获取并缓存对应的值，触发get，此时将watcher添加到dep
        // 获取watcher实例，并添加到dep中
        Dep.target && dep.addSub(Dep.target);
        return value;
      },
      set(newValue) {
        if (newValue == value) {
          return;
        }
        // 此处形成了闭包，延长了value的作用域
        value = newValue;
        // 属性被赋予新值的时候，将检查属性是否对象，是对象则将属性转换为响应式的
        that.walk(newValue);
        // 数据变化，发送通知，触发watcher的pudate方法
        dep.notify();
      },
    });
  }
}
export default Observer