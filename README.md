Gulp工作流模板
===
这是一个简单的gulp工作流模板，定义了一个src源文件目录与gulp输出目录dist<br>
使用bower管理公用库文件


###使用方式
clone之后使用 `$ npm install` 安装相关node模块依赖, `$ bower install`安装bower.json中的依赖库文件<br>
`$ gulp`开始gulp默认任务，默认将会走一遍普通流程，编译压缩less并合并样式中带有?_spriter后缀的png图片、压缩JS与HTML<br>
`$ gulp main`开启watch，监控dist文件夹内文件变化，有变化自动刷新页面

###工作流包括
* HTML压缩
* JS文件压缩
* notify提示
* clean清空文件夹模块
* 图片压缩
* css Spriter图合并
* 文件重命名
* less编译
* css压缩
* connect模块，自动刷新页面用
* ……

###注意事项
由于gulp-css-spriter默认会将样式文件中background出现的png都合并，出于方便性考虑，我们修改<br>
`node_modules\gulp-css-spriter\lib\map-over-styles-and-transform-background-image-declarations.js`文件<br>
第48行开始，修改正则替换条件，将条件改为<br>
```javascript
if(transformedDeclaration.property === 'background-image' && /\?__spriter/i.test(transformedDeclaration.value)) {
    transformedDeclaration.value = transformedDeclaration.value.replace('?__spriter','');
    return cb(transformedDeclaration,declarationIndex,eclarations);
}
else if(transformedDeclaration.property === 'background' && /\?__spriter/i.test(transformedDeclaration.value)) {
    transformedDeclaration.value = transformedDeclaration.value.replace('?__spriter','');
    var hasImageValue = spriterUtil.backgroundURLRegex.test(transformedDeclaration.value);
    if(hasImageValue) {
      return cb(transformedDeclaration,declarationIndex,eclarations);
    }
}
```
如此一来只有在样式文件中出现?_spriter的图片才会被合并
