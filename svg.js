setTimeout(function() {
  var conf = {
    rootId: 'J_SectionDrop'
  };

  // new SvgGenerator(conf);
}, 1000);

function SvgGenerator() {
  this.init.apply(this, arguments);
}

SvgGenerator.prototype = {
  init: function(conf) {
    var self = this;
    self.rootElm = self.getRootElm(conf.rootId);
    window.rootElm = self.rootElm;
    self.svgHandler = null;
    self.rootElmInfo = null;
    self.elmArr = [];
    self.currentElmIndex = null;


    if (self.rootElm) {
      var domId = 'svg-container';
      var btnId = 'svg-export-btn';

      self.rootElmInfo = self.rootElm.getBoundingClientRect();

      self.modifySiteUI(btnId);

      var btn = document.getElementById(btnId);
      btn.onclick = function() {
        self.generateSvg(domId);
      }

    } else {
      throw new Error('No such element with id ' + conf.rootId);
    }
  },
  modifySiteUI: function(id) {
    var self = this;
    var btnHtml = '<div class="btn-wrap" id="' + id + '"><button class="btn-save">导出到设计版</button></div>';
    var container = document.querySelector('.rme-header-right');

    container.innerHTML = btnHtml + container.innerHTML;
  },
  generateSvg: function(domId) {
    var self = this;

    self.addHtmlContainerWithId(domId);

    self.svgHandler = self.drawContainer(domId);

    self.processChildren(self.rootElm);

    setTimeout(function() {
      var svgData = self.svgHandler.svg();
      var input = document.querySelector('.form-input input');
      var filename = 'RME' + new Date().getTime();
      if (input && input.value) {
        filename = input.value;
      }
      console.log(svgData);

      $.ajax({
          url:"http://localhost:8888",
          dataType: 'jsonp',
          data: {
            filename: filename,
            svgData: encodeURIComponent(svgData)
          },
          success:function(res){
              console.log(res);
          },
          error:function(err){
            console.error(err);
          }
      });
    }, 2000);
  },
  getRootElm: function(id) {
    var elm = document.getElementById(id);

    if (elm) {
      return elm.children[0];
    } else {
      return null;
    }
  },
  addHtmlContainerWithId: function(id) {
    var self = this;
    var dom = document.createElement('div');
    var elmInfo = self.rootElmInfo;

    dom.setAttribute('id', id);
    dom.onclick = function() {
      dom.remove();
    };
    dom.style.position = 'fixed';
    dom.style.top = 0;
    dom.style.left = 0;
    dom.style.width = elmInfo.width + 'px';
    dom.style.height = elmInfo.height + 'px';
    dom.style.zIndex = 1000;

    document.body.appendChild(dom);
  },
  drawContainer: function(domId) {
    var self = this;
    var elmInfo = self.rootElmInfo;
    var elm = {
      dom: document.getElementById(domId),
      coordinate: self.getCoordinate(elmInfo),
      size: {
        width: elmInfo.width,
        height: elmInfo.height
      }
    };
    self.currentElmIndex = 0;
    self.elmArr.push(elm);

    return SVG(domId).size(elmInfo.width, elmInfo.height);
  },
  processChildren: function(elm) {
    var self = this;
    self.drawElement(elm);

    var children = elm.children;
    if (children) {
      for (var i = 0; i < children.length; i++) {
        var child = children[i];

        child.dataset.svgParentWidth = elm.getBoundingClientRect().width;

        var lineHeight = elm.style.lineHeight || elm.dataset.svgParentLineHeight;
        if (lineHeight) {
          child.dataset.svgParentLineHeight = lineHeight;
        }

        self.processChildren(child);
      }
    }
  },
  drawElement: function(domElm) {
    var self = this;
    var elmType = domElm.dataset ? domElm.dataset.type : null;
    if (!elmType) {
      return false;
    }

    var elmInfo = domElm.getBoundingClientRect();
    var elm = {
      type: elmType,
      dom: domElm,
      coordinate: self.getCoordinate(elmInfo),
      size: {
        width: elmInfo.width,
        height: elmInfo.height
      }
    };
    self.currentElmIndex = self.elmArr.length;
    self.elmArr.push(elm);

    switch (elmType) {
      case 'view':
        // console.log('view');
        self.drawSvgView();
        break;
      case 'picture':
        // console.log('pic');
        self.drawSvgPic();
        break;
      case 'text':
        // console.log('text');
        self.drawSvgText();
        break;
      default:
        console.log('unknow type: ', elmType);
        break;
    }

  },
  getCoordinate: function(elmInfo) {
    var self = this;
    return {
      x: elmInfo.left - self.rootElmInfo.left,
      y: elmInfo.top - self.rootElmInfo.top
    };
  },
  drawSvgView: function() {
    var self = this;
    var elm = self.elmArr[self.currentElmIndex];
    var dom = elm.dom;

    var handler = self.svgHandler.rect(elm.size.width, elm.size.height)
    handler.move(elm.coordinate.x, elm.coordinate.y);

    handler.radius(dom.style.borderRadius);

    var color = dom.style.backgroundColor;
    handler.fill(color);
    if (!color) {
      handler.opacity(0);
    };
  },
  drawSvgPic: function() {
    var self = this;
    var elm = self.elmArr[self.currentElmIndex];
    var dom = elm.dom;
    var picUrl = dom.getAttribute('src');

    // if (dom.style.borderRadius) {
    //   var imageHandler = self.svgHandler.image(picUrl, elm.size.width, elm.size.height);
    //   var handler = self.svgHandler.circle(40);

    //   handler.fill(imageHandler);
    // } else {
      var handler = self.svgHandler.image(picUrl, elm.size.width, elm.size.height);
    // }

    handler.move(elm.coordinate.x, elm.coordinate.y);
  },
  drawSvgText: function() {
    var self = this;
    var elm = self.elmArr[self.currentElmIndex];
    var dom = elm.dom;
    var text = dom.textContent;

    var handler = self.svgHandler.text(text);
    handler.font({
      family: dom.style.fontFamily,
      size: dom.style.fontSize,
    });
    handler.fill(dom.style.color);
    handler.move(elm.coordinate.x, elm.coordinate.y);

    // wrap text
    var textWidth = handler.node.getComputedTextLength();
    var svgParentWidth = dom.dataset.svgParentWidth;
    if (textWidth > svgParentWidth) {
      var newText = self.getWrappedText(text, textWidth, svgParentWidth);

      // handler.text(newText);

      var baseX = handler.x();
      var baseY = handler.y();
      console.log(baseY);

      handler.clear();
      handler.text(function(add) {
        newText.map(function(words, index) {
          console.log(index);
          var y = 36 * index + baseY;
          add.tspan(words).y(y).x(baseX)
        })
      });
    }

  },
  getWrappedText: function(text, textWidth, svgParentWidth) {
    var wordsNum = text.length;
    var wordWidth = textWidth / wordsNum;
    var wordsEachLine = Math.floor(svgParentWidth / wordWidth);

    if (wordsEachLine > text.length) {
      return text;
    } else {
      var index = 0;
      var wordsArr = [];
      while(index < text.length) {
        var words = text.slice(index, index + wordsEachLine);

        wordsArr.push(words);
        index += wordsEachLine;
      }

      return wordsArr;
    }

  }

}