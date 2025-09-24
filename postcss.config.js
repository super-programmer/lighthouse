// 全局日志：确认配置文件已加载
console.log('===== PostCSS 配置文件已执行 =====');

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