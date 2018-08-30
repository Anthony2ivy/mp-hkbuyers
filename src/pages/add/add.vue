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
    <i-panel title="商品详情">
      <i-input title="标题"></i-input>
      <i-input title="售价" type="number"></i-input>
      <i-input title="卖价" type="number"></i-input>
      <div class="with-icon">
        <i-input title="条形码" type="number" :value="barcode"></i-input>
        <wux-icon type="ios-barcode" class="right-icon" @tap="scanBarcode"></wux-icon>
      </div>
      <i-input title="库存" type="number"></i-input>
      <i-cell title="分类" is-link @tap="toggleCatlog"></i-cell>
    </i-panel>
    <i-drawer mode="right" :visible="showCatlog" @close="toggleCatlog">
      <view class="catlog-container">
        <wux-icon type="ios-add-circle" color="green" class="tag-add-btn"></wux-icon>
        <i-panel title="已选" style="position: relative">
          <i-checkbox-group :current="computedCurrentTags"  @change="tagDel">
            <i-checkbox :value="tag" :checked="vTrue"   v-for="(tag,index) in currentTags" :key="tag">
            </i-checkbox>
          </i-checkbox-group>
        </i-panel>
        <i-panel title="未选">
          <i-checkbox-group   @change="tagAdd">
            <i-checkbox :value="tag" :checked="vFalse"  v-for="(tag,index) in tags" :key="tag">
            </i-checkbox>
          </i-checkbox-group>
        </i-panel>
      </view>
    </i-drawer>
    <div class="br"></div>
    <i-panel title="商品颜色">
      <div class="color-group" v-for="(color,index) in colors" :key="index">
        <div class="color-content">
          <i-input @change="changeInput" :value="color.name" data-key="name" :data-index="index" title="颜色名" ></i-input>
          <i-input @change="changeInput" :value="color.buyPrice" data-key="buyPrice" :data-index="index" title="买入价" type="number"></i-input>
          <i-input @change="changeInput" :value="color.salePrice" data-key="salePrice" :data-index="index" title="卖价" type="number"></i-input>
          <div class="with-icon">
            <i-input title="条形码" v-model.lazy="color.barcode" :value="color.barcode" type="number" ></i-input>
            <wux-icon type="ios-barcode" class="right-icon" @tap="scanColorBarcode(index)"></wux-icon>
          </div>
          <i-input title="库存" type="number"></i-input>
        </div>
        <wux-icon type="ios-close-circle" color="red" class="close-color-btn"  @tap="deleteColor" :data-index="index" />
      </div>
      <i-button @click="addColor">
        <i-icon type="add"/>
        添加
      </i-button>
      <i-button @click="addGood"  :loading="isUploading" type="primary">
        提交
      </i-button>
    </i-panel>
  </div>
</template>

<script>
  export default {
    name: "add",
    data: function () {
      return {
        fileList: [],
        barcode: '',
        colors:[],
        isUploading:false,
        showCatlog:false,
        tags:['粉底','阿玛尼','唇釉','小样'],
        currentTags:[],
        vTrue:true,
        vFalse:false
      }
    },
    computed:{
      computedCurrentTags:function () {
        return this.currentTags;
      }
    },
    methods: {
      tagAdd({ mp }) {
        let detail=mp.detail;
        const index = this.tags.indexOf(detail.value);
        this.currentTags.push(detail.value);
        this.tags.splice(index, 1);
      },
      tagDel({ mp }) {
        let detail=mp.detail;
        const index = this.currentTags.indexOf(detail.value);
        if(index >=0) {
          this.currentTags.splice(index, 1);
          this.tags.push(detail.value);
        }
      },
      toggleCatlog(){
        this.showCatlog=!this.showCatlog;
      },
      scanColorBarcode(index){
        let self=this;
        wx.scanCode({
          scanType: 'barCode', success: (res) => {
            console.log(res.result);
            self.colors[index].barcode=res.result;
            // self.$set(self.colors[index],self.colors[index]);
            console.log(self.colors);
          }
        });
      },
      scanBarcode(e) {
        wx.scanCode({
          scanType: 'barCode', success: (res) => {
            console.log(res.result);
            this.barcode = res.result;
          }
        });
      },
      onChange({mp}) {
        let e = mp;
        console.log('onChange', e)
        const {file} = e.detail;
        if (file.status === 'uploading') {
          let newFile = {uid: file.uid, progress: 0, url: file.url};
          this.fileList.push(newFile);
        } else if (file.status === 'done') {
          this.$set(this.fileList, this.fileList.map(item => {
            if (item.uid === file.uid) {
              item.progress = 1;
            }
            return item;
          }));
        }
      },
      onSuccess({mp}) {
        let e = mp;
        console.log('onSuccess', e);
        const {
          file
        } = e.detail
        this.$set(this.fileList, this.fileList.map(item => {
          if (item.uid === file.uid)
            item.remoteUrl = JSON.parse(file.res.data).path;
          return item;
        }));
      },
      onFail({mp}) {
        let e = mp;
        console.log('onFail', e)
      },
      onComplete({mp}) {
        let e = mp;
        console.log('onComplete', e);
      },
      onPreview({mp}) {
        let e = mp;
        console.log('onPreview', e)
        const {
          file,
          fileList
        } = e.detail
        wx.previewImage({
          current: file.url,
          urls: fileList.map((n) => n.url),
        })
      },
      onRemove({mp}) {
        let e = mp;
        const {
          file,
          fileList
        } = e.detail
        this.setData({fileList: this.fileList.filter(item => item.uid != file.uid)});
        console.log(this.fileList);
      },
      addColor(){
        this.colors.push({
          name:'',
          buyPrice:'',
          salePrice:'',
          barcode:this.barcode
        });
      },
      deleteColor({mp}){
        let e=mp;
        console.log(e);
        let index=e.currentTarget.dataset.index;
        console.log(index);
        this.colors.splice(index,1);
      },
      changeInput({mp}){
        let e=mp;
        console.log(e);
        let key=e.currentTarget.dataset.key;
        let index=e.currentTarget.dataset.index;
        let value=e.detail.detail.value;
        this.colors[index][key]=value;
      },
      addGood(){
        this.isUploading=true;
        let interval=setInterval(function () {
          let isuploadingFile=false;
          this.fileList.forEach(file => {
            if(file.progress !=1){
              isuploadingFile=true;
            }
          });
          if(!isuploadingFile){
            console.log()
          }
        });
      }
    }
  }
</script>

<style scoped>
  /* pages/add/add.wxss */
  .br{
    margin-bottom: 30px;
  }
  .tag-add-btn{
    position: absolute;
    top:5px;
    right: 5px;
  }
  .catlog-container{
    background-color: white;
    height: 100vh;
    z-index: 999;
    width: 200px;
    overflow: auto;
  }
  .with-icon {
    position: relative;
  }
  .close-color-btn{
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
