<template>
  <div>
    <i-panel title="商品图片">
      <wux-cell>
        <wux-upload list-type="picture-card" :file-list="fileList" url="https://www.shitaidaigou.club/img"
                    @change="onChange"
                    @success="onSuccess" @fail="onFail" @complete="onComplete" @prediv="onPrediv" @remove="onRemove"
                    name="img">
          <text>Upload</text>
        </wux-upload>
      </wux-cell>
    </i-panel>
    <div class="br"></div>
    <i-modal title="添加标签" :visible="addTagVisible" @ok="modelAddTag" @cancel="modelCancelAddTag">
      <input type="text" v-model="modelTagText" class="border-input" @confirm="modelAddTag"/>
    </i-modal>
    <i-panel title="商品详情">
      <div class="my-input-div">
        <div class="my-input-title">标题</div>
        <input class="my-input" v-model="title"/>
      </div>
      <div class="my-input-div">
        <div class="my-input-title">售价</div>
        <input class="my-input" v-model="salePrice" type="number"/>
      </div>
      <div class="my-input-div">
        <div class="my-input-title">卖价</div>
        <input class="my-input" v-model="buyPrice" type="number"/>
      </div>
      <div class="my-input-div with-icon">
        <div class="my-input-title">条形码</div>
        <input class="my-input" type="number" v-model="barcode"/>
        <wux-icon type="ios-barcode" class="right-icon" @tap="scanBarcode"></wux-icon>
      </div>
      <div class="my-input-div">
        <div class="my-input-title">库存</div>
        <input class="my-input" v-model="storage" type="number"/>
      </div>
      <i-cell title="分类" is-link @tap="toggleCatlog"></i-cell>
    </i-panel>

    <i-drawer mode="right" :visible="showCatlog" @close="toggleCatlog">
      <view class="catlog-container">
        <wux-icon type="ios-add-circle" color="green" class="tag-add-btn" @tap="openModelTagAdd"></wux-icon>
        <i-panel title="已选" style="position: relative">
          <i-checkbox-group :current="computedCurrentTags" @change="tagDel">
            <i-checkbox :value="tag" :checked="vTrue" v-for="(tag,index) in currentTags" :key="tag">
            </i-checkbox>
          </i-checkbox-group>
        </i-panel>
        <i-panel title="未选">
          <i-checkbox-group @change="tagAdd">
            <i-checkbox :value="tag" :checked="vFalse" v-for="(tag,index) in tags" :key="tag">
            </i-checkbox>
          </i-checkbox-group>
        </i-panel>
      </view>
    </i-drawer>
    <div class="br"></div>
    <i-panel title="商品颜色">
      <div class="color-group" v-for="(color,index) in colors" :key="index">
        <div class="color-content">

          <i-input @change="changeInput" :value="color.name" data-key="name" :data-index="index" title="颜色名"></i-input>
          <i-input @change="changeInput" :value="color.buyPrice" data-key="buyPrice" :data-index="index" title="买入价"
                   type="number"></i-input>
          <i-input @change="changeInput" :value="color.salePrice" data-key="salePrice" :data-index="index" title="卖价"
                   type="number"></i-input>
          <div class="with-icon">
            <i-input title="条形码" v-model.lazy="color.barcode" :value="color.barcode" type="number"></i-input>
            <wux-icon type="ios-barcode" class="right-icon" @tap="scanColorBarcode(index)"></wux-icon>
          </div>
          <i-input title="库存" type="number"></i-input>
        </div>
        <wux-icon type="ios-close-circle" color="red" class="close-color-btn" @tap="deleteColor" :data-index="index"/>
      </div>
      <i-button @tap="addColor">
        <i-icon type="add"/>
        添加
      </i-button>
      <i-button @click="addGood"  type="primary">
        提交
      </i-button>
    </i-panel>
    <i-spin size="large" fix v-if="isUploading"></i-spin>
  </div>
</template>

<script>
  const { $Toast } = require('../../iview-dist/base/index');
  import goodService from '../../mixins/goodService.js'
  export default {
    name: "add",
    data: function() {
      return {
        fileList: [],
        barcode: "",
        colors: [],
        isUploading: false,
        showCatlog: false,
        tags: [],
        initTags: [],
        currentTags: [],
        vTrue: true,
        vFalse: false,
        addTagVisible: false,
        modelTagText: ""
      };
    },
    computed: {
      computedCurrentTags: function() {
        return this.currentTags;
      }
    },
    methods: {
      modelAddTag() {
        if ("" != this.modelTagText) {
          if (!new Set([...this.currentTags, ...this.tags]).has(this.modelTagText))
            this.currentTags.push(this.modelTagText);
          this.modelTagText = "";
        }
        this.addTagVisible = false;
      },
      modelCancelAddTag() {
        this.addTagVisible = false;
        this.modelTagText = "";
      },
      openModelTagAdd() {
        this.modelTagText = "";
        this.addTagVisible = true;
      },
      tagAdd({ mp }) {
        let detail = mp.detail;
        const index = this.tags.indexOf(detail.value);
        this.currentTags.push(detail.value);
        this.tags.splice(index, 1);
      },
      tagDel({ mp }) {
        let detail = mp.detail;
        const index = this.currentTags.indexOf(detail.value);
        if (index >= 0) {
          this.currentTags.splice(index, 1);
          this.tags.push(detail.value);
        }
      },
      toggleCatlog() {
        this.showCatlog = !this.showCatlog;
      },
      scanColorBarcode(index) {
        let self = this;
        wx.scanCode({
          scanType: "barCode", success: (res) => {
            console.log(res.result);
            self.colors[index].barcode = res.result;
            // self.$set(self.colors[index],self.colors[index]);
            console.log(self.colors);
          }
        });
      },
      scanBarcode(e) {
        wx.scanCode({
          scanType: "barCode", success: (res) => {
            console.log(res.result);
            this.barcode = res.result;
          }
        });
      },
      onChange({ mp }) {
        let e = mp;
        console.log("onChange", e);
        const { file } = e.detail;
        if (file.status === "uploading") {
          let newFile = { uid: file.uid, progress: 0, url: file.url };
          this.fileList.push(newFile);
        } else if (file.status === "done") {
          this.$set(this.fileList, this.fileList.map(item => {
            if (item.uid === file.uid) {
              item.progress = 1;
            }
            return item;
          }));
        }
      },
      onSuccess({ mp }) {
        let e = mp;
        console.log("onSuccess", e);
        const {
          file
        } = e.detail;
        this.$set(this.fileList, this.fileList.map(item => {
          if (item.uid === file.uid)
            item.remoteUrl = JSON.parse(file.res.data).path;
          return item;
        }));
      },
      onFail({ mp }) {
        let e = mp;
        console.log("onFail", e);
      },
      onComplete({ mp }) {
        let e = mp;
        console.log("onComplete", e);
      },
      onPreview({ mp }) {
        let e = mp;
        console.log("onPreview", e);
        const {
          file,
          fileList
        } = e.detail;
        wx.previewImage({
          current: file.url,
          urls: fileList.map((n) => n.url)
        });
      },
      onRemove({ mp }) {
        let e = mp;
        const {
          file,
          fileList
        } = e.detail;
        this.setData({ fileList: this.fileList.filter(item => item.uid != file.uid) });
        console.log(this.fileList);
      },
      addColor() {
        this.colors.push({
          name: "",
          buyPrice: "",
          salePrice: "",
          barcode: this.barcode
        });
      },
      deleteColor({ mp }) {
        let e = mp;
        console.log(e);
        let index = e.currentTarget.dataset.index;
        console.log(index);
        this.colors.splice(index, 1);
      },
      changeInput({ mp }) {
        let e = mp;
        console.log(e);
        let key = e.currentTarget.dataset.key;
        let index = e.currentTarget.dataset.index;
        let value = e.detail.detail.value;
        this.colors[index][key] = value;
      },
      addGood() {
        let self=this;
        this.isUploading = true;
        let data={
          images: self.getImageUrls(),
          salePrice: self.salePrice,
          buyPrice: self.buyPrice,
          tags:self.currentTags,
          title:self.title,
          barcode:self.barcode,
          storage:self.storage,
          colors:JSON.stringify(self.colors)
        };
        console.log(data);
        let interval = setInterval(function() {
          let isuploadingFile = false;
          self.fileList.forEach(file => {
            if (file.progress != 1) {
              isuploadingFile = true;
            }
          });
          if(!isuploadingFile){
            clearInterval(interval);
            goodService.addGoodRequest(data).then(res =>{
              console.log(res);
              self.isUploading = false;
              $Toast({content:'添加商品成功',type:'success'});
            }).catch(e => console.log(e));
          }
        },500);
      },
      getImageUrls(){
        return this.fileList.map(file => file.remoteUrl)
      }
    },
    mounted: function() {
      let self = this;
      wx.request({
        url: "https://www.shitaidaigou.club/tag", //仅为示例，并非真实的接口地址
        method: "GET",
        header: {
          "content-type": "application/json" // 默认值
        },
        success: function(res) {
          console.log(res.data);
          self.tags = res.data.map(tag => tag.tagName);
        }
      });
    }
  };
</script>

<style scoped>
  /* pages/add/add.wxss */
  .my-input-div {
    display: flex;
    align-content: baseline;
    margin-left: 15px;
    padding-top: 10px;
    padding-bottom: 10px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.05);
    font-size: 15px;
    line-height: 25px;
    color: rgba(0, 0, 0, 0.8);
    height: 25px;
  }

  .my-input-div .my-input-title {
    flex: 1 1 50px;
  }

  .my-input-div .my-input {
    flex: 4 4 200px;
  }

  .br {
    margin-bottom: 30px;
  }

  .tag-add-btn {
    position: absolute;
    top: 5px;
    right: 5px;
    z-index: 222;
  }

  .catlog-container {
    background-color: white;
    height: 100vh;
    z-index: 999;
    width: 200px;
    overflow: auto;
  }

  .border-input {
    margin: 10px;
    border: 1px solid rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    padding: 4px;
  }

  .with-icon {
    position: relative;
  }

  .close-color-btn {
    position: absolute;
    top: 0px;
    right: 3px;
  }

  .right-icon {
    position: absolute;
    top: 7px;
    right: 10px;
    z-index: 2;
  }

  page {
    background-color: rgba(0, 0, 0, 0.03);
  }

  .color-group {
    padding: 10px;
    width: 100%;
    box-sizing: border-box;
    position: relative;
  }

  .color-content {
    width: 100%;
    border: 1px solid rgba(0, 0, 0, 0.1);
    border-radius: 2px;
    box-sizing: border-box;
    padding: 10px;
  }

  .group-name {
    font-size: 15px;
  }
</style>
