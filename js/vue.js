/**
 * 属性
 * - $el：挂载的dom对象
 * - $data: 数据
 * - $options: 传入的属性
 * 方法：
 * - _proxyData 将数据转换成getter/setter形式
 */
import Observer from "./Observer.js";
import Compiler from "./Compiler.js";
class Vue {
  constructor(options) {
    this.$options = options;
    this.$data = options.data || Object.create(null);
    this.$el =
      typeof options.el === "string"
        ? document.querySelector(options.el)
        : options.el;
    this._proxyData(this.$data);
    // 监测数据的变化，渲染视图
    new Observer(this.$data);
    new Compiler(this);
  }
  //   将数据代理到vue(this)中
  _proxyData(data) {
    Reflect.ownKeys(data).forEach((key) => {
      Reflect.defineProperty(this, key, {
        enumerable: true,
        configurable: true,
        get() {
          return data[key];
        },
        set(newValue) {
          if (newValue == data[key]) {
            return;
          }
          data[key] = newValue;
        },
      });
    });
  }
}
export default Vue;
