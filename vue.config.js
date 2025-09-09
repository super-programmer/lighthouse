const path = require('path');

module.exports = {
  chainWebpack: (config) => {
    // 1. 清除已有的 scss 规则（避免冲突）
    config.module.rules.delete('scss');

    // 2. 重新创建 scss 规则
    const scssRule = config.module.rule('scss')
      .test(/\.scss$/)
      .exclude.add(path.resolve(__dirname, 'node_modules'))
      .end();

    // 3. 添加处理 Vue 单文件组件中 SCSS 的规则
    scssRule.oneOf('vue-scss')
      .resourceQuery(/\?vue/) // 匹配 Vue 组件内的 <style lang="scss">
      .use('vue-style-loader')
      .loader('vue-style-loader')
      .end()
      .use('css-loader')
      .loader('css-loader')
      .options({ importLoaders: 1 })
      .end()
      .use('sass-loader')
      .loader('sass-loader')
      .options({
        // additionalData: `@import "@/uni.scss";\n`, // 注入全局变量
		// additionalData: '@use "@/styles/tailwind.scss" as *;',
		// additionalData: `@use "@/uni.scss";\n`, // 改为 @use 语法
        sourceMap: process.env.NODE_ENV === 'development'
      })
      .end();

    // 4. 添加处理独立 SCSS 文件的规则
    scssRule.oneOf('normal-scss')
      .use('style-loader')
      .loader('style-loader')
      .end()
      .use('css-loader')
      .loader('css-loader')
      .options({ importLoaders: 1 })
      .end()
      .use('sass-loader')
      .loader('sass-loader')
      .options({
        // 将 additionalData 改为只注入变量，且确保它是纯导入/定义
		// additionalData: '@use "@/styles/tailwind.scss" as *;',
		// additionalData: `@use "@/uni.scss";\n`, // 改为 @use 语法
        // additionalData: `@use "@/uni.scss" as *;\n`, // 用 @use 替代 @import（如果 uni.scss 符合模块规范）, // 注入全局变量
        sourceMap: process.env.NODE_ENV === 'development'
      })
      .end();

    // 5. 验证规则是否生效（开发环境打印）
    if (process.env.NODE_ENV === 'development') {
      const oneOfs = Array.from(scssRule.oneOfs.store);
      console.log('有效 SCSS 规则数量：', oneOfs.length);
      const loaderCount = oneOfs.reduce((total, oneOf) => {
        return total + (oneOf.use ? Array.from(oneOf.use.values()).length : 0);
      }, 0);
      console.log('每个 SCSS 规则分支的 loader 数量：', loaderCount);
    }
  }
};