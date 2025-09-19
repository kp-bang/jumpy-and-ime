# 为什么要做这个项目？

## 背景

在开发过程中，双手尽可能保持在键盘上。  
尝试过vim，学习成本高，也没有显著的提升码字效率，直到找到jumpy。

[jumpy](https://github.com/wmaurer/vscode-jumpy)只需要`shift+enter`，再按两次`a-z`，可以实现在可视行数内跳转，比用n次方向键，或者使用鼠标效率要高。

## 问题

[jumpy](https://github.com/wmaurer/vscode-jumpy)有它的问题[[BUG]Input Chinese punctuation will output twice #62](https://github.com/wmaurer/vscode-jumpy/issues/62)

- 对于这个问题，fork下来，把初始化就监听type事件，改成进jumpy模式动态监听、注销type事件可解决

[jumpy](https://github.com/wmaurer/vscode-jumpy)还有第二个问题。如果当前的拼音输入法是中文模式，进入jumpy模式后，再按`a-z`，拼音输入法会和type事件监听冲突，导致要退出jumpy模式，手动按一次`shift`改为英文模式，再重试。这种glitch体验是极不愉快的。

- 对于这个问题解决，是毫无头绪的。
- 偶然的机会，在某乎刷到这片文章，[原生 JS 实现 VS Code 自动切换输入法状态！这次没有AHK](https://www.cnblogs.com/yf-zhao/p/16032543.html)。马上就着手把该功能集成入本地的jumpy。进入jumpy时把拼音输入法改成英文模式，就完美解决jumpy使用流畅性的问题。

## 进阶

对于输入法，社区有很多想法。拿关键字搜索浏览相关文章，找到[Smart IME](https://github.com/OrangeX4/vscode-smart-ime)和[HyperScopes Booster](https://github.com/yfzhao20/hscopes-booster)。

可惜[Smart IME](https://github.com/OrangeX4/vscode-smart-ime)有强依赖，但想法是很好的。  

我的想法当然是自己优先，我的条件就是汉字输入、windows10和微软拼音输入法，无任何第三方依赖。那就只能fork下来，修改到合适自己的需求。

## 集成
到目前为止，我是在4个vscode插件搭配下获得统一的功能。往前看，最终效果这应该是一个插件完成的事情，往后看，逻辑链过长，有迭代需求，需要打开4个项目。对外分享插件，向别人发4个插件过去会被喷的。甚至插件之间还有些glitch。

这些问题都推动我重构这些项目集成在一起。