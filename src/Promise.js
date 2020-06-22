/*
自定义Promise函数模块 IIFE
*/
(function (window) {
  /**
   * 构造函数
   * @param {*} excuter 执行器函数(同步执行)
   */
  function Promise(excuter) {
    const self = this;
    // 状态, 初始值是'pengding'
    this.status = "pengding";
    // 数据
    this.data = undefined;
    //
    this.callbacks = [];

    function resolve(value) {
      if (self.status !== "pengding") {
        return;
      }
      // 状态改为resolved
      self.status = "resolved";

      // 保留value的值
      self.data = value;

      // 如果有待执行callback函数，立即异步执行回调函数onResolved
      if (self.callbacks.length > 0) {
        // 放入队列中执行所有成功的回调
        setTimeout(() => {
          self.callbacks.forEach((callbacksObj) => {
            callbacksObj.onResolved(value);
          });
        });
      }
    }

    function reject(reason) {
      if (self.status !== "pengding") {
        return;
      }
      // 状态改为resolved
      self.status = "rejected";

      // 保留value的值
      self.data = reason;

      // 如果有待执行callback函数，立即异步执行回调函数onRejected
      if (self.callbacks.length > 0) {
        // 放入队列中执行所有失败的回调
        setTimeout(() => {
          self.callbacks.forEach((callbacksObj) => {
            callbacksObj.onRejected(reason);
          });
        });
      }
    }

    excuter(resolve, reject);
  }

  // 原型对象then
  Promise.prototype.then = function (onResolved, onRejected) {
    this.callbacks.push({ onResolved, onRejected });
  };

  // 原型对象catch
  Promise.prototype.catch = function (onRejected) {};

  Promise.resolve = function (value) {};

  Promise.reject = function (reason) {};

  Promise.all = function (promises) {};

  Promise.race = function (promises) {};

  // 向外暴露Promise
  window.Promise = Promise;
})(window);
