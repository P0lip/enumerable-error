export default function (err) {
  return new Proxy(err, {
    getOwnPropertyDescriptor(target, key) {
      for (const prototype of traversePrototypeUntilErrorPrototype(target)) {
        if (Object.hasOwnProperty.call(prototype, key)) {
          const descriptor = Reflect.getOwnPropertyDescriptor(prototype, key);
          descriptor.enumerable = true;
          return descriptor;
        }
      }
    },

    ownKeys(target) {
      const keys = [];
      for (const prototype of traversePrototypeUntilErrorPrototype(target)) {
        for (const key of Reflect.ownKeys(prototype)) {
          if (!keys.includes(key)) {
            keys.push(key);
          }
        }
      }

      return keys;
    },

    set(target, key, value) {
      return Reflect.set(target, key, value);
    },
  });
}

function* traversePrototypeUntilErrorPrototype(prototype) {
  while (prototype !== null && prototype !== Error.prototype) {
    yield prototype;
    prototype = Object.getPrototypeOf(prototype);
  }
}
