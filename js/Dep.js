/**
 * 观察者类
 */
export default class Dep {
  constructor() {
    this.subs = [];
  }
  // 添加观察者
  addSub(sub) {
    if (sub && sub.update && typeof sub.update === "function") {
      this.subs.push(sub);
    }
  }
  // 发送通知
  notify() {
    this.subs.forEach((sub) => {
      sub.update();
    });
  }
}
