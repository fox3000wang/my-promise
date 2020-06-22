/*
自定义Promise函数模块 IIFE
*/
(function (window) {
  /**
   * 构造函数
   * @param {*} excuter 执行器函数(同步执行)
   */
  function Promise(excuter) {
    // 状态, 初始值是'pengding'
    this.status = "pengding";
    // 数据
    this.data = undefined;
    //
    this.callbacks = [];

    function resolve(value) {
      // 状态改为resolved
      this.status = `resolved`;

      // 保留value的值
      this.data = value;

      // 如果有待执行callback函数，立即异步执行回调函数onResolved
      if (this.callbacks.length > 0) {
        // 放入队列中执行所有成功的回调
        setTimeout(() => {
          this.callbacks.forEach((callbacksObj) => {
            callbacksObj.onResolved(value);
          });
        });
      }
    }

    function reject(reason) {
      if (this.status !== "pengding") {
        return;
      }
      // 状态改为resolved
      this.status = `rejected`;

      // 保留value的值
      this.data = reason;

      // 如果有待执行callback函数，立即异步执行回调函数onRejected
      if (this.callbacks.length > 0) {
        // 放入队列中执行所有失败的回调
        setTimeout(() => {
          this.callbacks.forEach((callbacksObj) => {
            callbacksObj.onRejected(reason);
          });
        });
      }
    }

    excuter(resolve, reject);
  }

  // 原型对象then
  Promise.prototype.then = function (onResolved, onRejected) {};

  // 原型对象catch
  Promise.prototype.catch = function (onRejected) {};

  Promise.resolve = function (value) {};

  Promise.reject = function (reason) {};

  Promise.all = function (promises) {};

  Promise.race = function (promises) {};

  // 向外暴露Promise
  window.Promise = Promise;
})(window);
