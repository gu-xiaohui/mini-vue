/**
 * 属性：
 *  vm -vue实例
 *  key -观察的元素的key
 *  cb  -注册一个回调，变化的时候调用
 */
import Dep from "./Dep.js";
export default class Watcher {
  constructor(vm, key, cb) {
    this.vm = vm;
    this.key = key;
    this.cb = cb;
    // oldValue缓存之前，将watcher实例挂载到Dep
    Dep.target = this;
    // 缓存旧值
    this.oldValue = vm[key];
    // get值之后，清除Dep中的实例
    Dep.target = null;
  }
  update() {
    // 调用update的时候，获取新值
    const newValue = this.vm[this.key];
    // 比较，相同则不更新
    if (this.oldValue === newValue) {
      return;
    }
    this.cb(newValue);
  }
}
