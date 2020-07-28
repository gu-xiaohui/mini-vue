/**
. 属性
    • el  -app元素
    • vm  -vue实例
• 方法
    • compile(el) -编译入口
    • compileElement(node)  -编译元素（指令）
    • compileText(node) 编译文本（插值）
    • isDirective(attrName) -（判断是否为指令）
    • isTextNode(node)  -（判断是否为文本节点）
    • isElementNode(node) - （判断是否问元素节点）
 */
import Watcher from "./Watcher.js";
class Compiler {
  constructor(vm) {
    this.vm = vm;
    this.el = vm.$el;
    this.compile(this.el);
  }
  compile(el) {
    if (!el) return;
    const nodes = el.childNodes;
    Array.from(nodes).forEach((node) => {
      if (this.isTextNode(node)) {
        this.compileText(node);
      } else if (this.isElementNode(node)) {
        this.compileElement(node);
      }
      if (node.childNodes && node.childNodes.length) {
        this.compile(node);
      }
    });
  }
  update(node, value, attrName, key) {
    const updateFn = this[`${attrName}Updater`];
    updateFn && updateFn.call(this, node, value, key);
  }
  textUpdater(node, value, key) {
    node.textContent = value;
  }
  modelUpdater(node, value, key) {
    node.value = value;
    node.addEventListener("input", (e) => {
      this.vm[key] = node.value;
    });
  }
  compileElement(node) {
    Array.from(node.attributes).forEach((attr) => {
      if (this.isDirective(attr.name)) {
        const attrName = attr.name.substr(2);
        const key = attr.value;
        const value = this.vm[key];
        this.update(node, value, attrName, key);
        // 数据更新之后，通过wather更新视图
        new Watcher(this.vm, key, (newValue) => {
          this.update(node, newValue, attrName, key);
        });
      }
    });
  }
  compileText(node) {
    /**
     * . 表示任意单个字符，不包含换行符
     * + 表示匹配前面多个相同的字符
     * ？表示非贪婪模式，尽可能早的结束查找
     * */
    const reg = /\{\{(.+?)\}\}/;
    var param = node.textContent;
    if (reg.test(param)) {
      //  $1表示匹配的第一个
      const key = RegExp.$1.trim();
      node.textContent = param.replace(reg, this.vm[key]);
      // 编译模板的时候，创建一个watcher实例，并在内部挂载到Dep上
      new Watcher(this.vm, key, (newValue) => {
        // 通过回调函数，更新视图
        node.textContent = newValue;
      });
    }
  }
  isDirective(attrName) {
    return attrName && attrName.startsWith("v-");
  }
  isTextNode(node) {
    return node && node.nodeType === 3;
  }
  isElementNode(node) {
    return node && node.nodeType === 1;
  }
}
export default Compiler;
