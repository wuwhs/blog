new Vue({
  el: '#app',
  data: function () {
    return {
      originImgUrl: '',
      originSize: 0,
      originImgWidth: 'auto',
      originImgHeight: 'auto',
      outputImgUrl: '',
      outputImgWidth: 'auto',
      outputImgHeight: 'auto',
      outputSize: 0,
      compressRatio: 0,
      quality: 1
    }
  },

  methods: {
    dragFileEnter: function (ev) {
      console.log('ev: ', ev)
      ev.preventDefault();
      ev.stopPropagation();
    },

    drageFileOver: function (ev) {
      ev.preventDefault();
      ev.stopPropagation();
    },

    dropFile: function (ev) {
      ev.preventDefault();
      ev.stopPropagation();

      var dt = ev.dataTransfer;
      var file = dt.files[0];
      this.compressImage(file);
    },

    inputChange: function (ev) {
      var vm = this;
      var file = ev.target.files[0];
      this.compressImage(file);
    },

    compressImage: function (file) {
      var vm = this;
      var options = {
        file: file,
        quality: 0.6,
        mimeType: 'image/png',
        // 压缩前回调
        beforeCompress: function (result) {
          vm.originImgWidth = result.width;
          vm.originImgHeight = result.height;
          vm.originSize = result.size;
          vm.originMimeType = result.type;
          console.log('压缩之前图片尺寸大小: ', result.size);
          console.log('mime 类型: ', result.type);
          // 将上传图片在页面预览
          SimpleImageCompressor.file2DataUrl(result, function (url) {
            vm.originImgUrl = url;
          })
        },
        // 压缩成功回调
        success: function (result) {
          console.log('压缩之后图片尺寸大小: ', result.size);
          console.log('mime 类型: ', result.type);
          console.log('压缩率： ', (result.size / file.size).toFixed(4) * 100 + '%');

          vm.outputImgWidth = result.width;
          vm.outputImgHeight = result.height;
          vm.outputSize = result.size;
          vm.outputMimeType = result.type;
          vm.compressRatio = (result.size / file.size).toFixed(4) * 100 + '%';

          // 生成压缩后图片在页面展示
          SimpleImageCompressor.file2DataUrl(result, function (url) {
            vm.outputImgUrl = url;
          })
          // 上传到远程服务器
          // util.upload('/upload.png', result);
        }
      };

      new SimpleImageCompressor(options);
    }
  }
})