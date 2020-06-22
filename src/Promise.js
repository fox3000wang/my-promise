/*
自定义Promise函数模块 IIFE
*/
(function (window) {
  // 状态常量
  const PENGDING = 'pengding';
  const RESOLVED = 'resolved';
  const REJECTED = 'rejected';

  /**
   * 构造函数
   * @param {*} excuter 执行器函数(同步执行)
   */
  function Promise(excuter) {
    const self = this;
    // 状态, 初始值是'pengding'
    this.status = PENGDING;
    // 数据
    this.data = undefined;
    // 回调函数
    this.callbacks = [];

    function resolve(value) {
      if (self.status !== PENGDING) {
        return;
      }
      // 状态改为resolved
      self.status = RESOLVED;

      // 保留value的值
      self.data = value;

      // 如果有待执行callback函数，立即异步执行回调函数onResolved
      if (self.callbacks.length > 0) {
        // 放入队列中执行所有成功的回调
        setTimeout(() => {
          self.callbacks.forEach(callbacksObj => {
            callbacksObj.onResolved(value);
          });
        });
      }
    }

    function reject(reason) {
      if (self.status !== PENGDING) {
        return;
      }
      // 状态改为resolved
      self.status = REJECTED;

      // 保留value的值
      self.data = reason;

      // 如果有待执行callback函数，立即异步执行回调函数onRejected
      if (self.callbacks.length > 0) {
        // 放入队列中执行所有失败的回调
        setTimeout(() => {
          self.callbacks.forEach(callbacksObj => {
            callbacksObj.onRejected(reason);
          });
        });
      }
    }

    excuter(resolve, reject);
  }

  /*
    原型对象then
    指定成功和失败的回调函数
    返回一个新的Promise对象
   */

  Promise.prototype.then = function (onResolved, onRejected) {
    const self = this;

    // 向后传递成功的value
    onResolved = typeof onRejected === 'function' ? onResolved : value => value;

    // 指定默认的失败回调, 实现异常/错误传透
    onRejected =
      typeof onRejected === 'function'
        ? onRejected
        : reason => {
            throw reason;
          };

    return new Promise((resolve, reject) => {
      /**
       * 调用指定回调函数处理, 根据执行结果改变状态。
       * @param {*} callback
       */
      function handle(callback) {
        /*
        1.如果抛出异常, return的promise就会失败, reason就是error
        2.如果回调函数返回不是promise, return的promise就是成功, 返回值value
        3.如果返回的值是promise, return的promise就是这个promise的结果
        */
        setTimeout(() => {
          try {
            const result = callback(self.data);
            if (result instanceof Promise) {
              result.then(resolve, reject);
            } else {
              resolve(self.data);
            }
          } catch (e) {
            reject(e);
          }
        });
      }

      // 当前状态还是pending，将回调函数保存起来
      if (self.status === PENGDING) {
        self.callbacks.push({
          onResolved() {
            handle(onResolved);
          },
          onRejected() {
            handle(onRejected);
          },
        });
      } else {
        setTimeout(() => {
          if (self.status === RESOLVED) {
            handle(onResolved);
          } else {
            handle(onRejected);
          }
        });
      }
    });
  };

  // 原型对象catch
  Promise.prototype.catch = function (onRejected) {
    return this.then(null, onRejected);
  };

  Promise.resolve = function (value) {};

  Promise.reject = function (reason) {};

  Promise.all = function (promises) {};

  Promise.race = function (promises) {};

  // 向外暴露Promise
  window.Promise = Promise;
})(window);
