module.exports = {
  plugins: [
    (root) => {
      // 遍历 CSS 中的所有节点
      root.walk(node => {
        // 处理选择器中的转义符
        if (node.selector) {
          node.selector = node.selector.replace(/\\/g, '');
        }
        // 处理属性值中的转义符
        if (node.value) {
          node.value = node.value.replace(/\\/g, '');
        }
      });
    }
  ]
};