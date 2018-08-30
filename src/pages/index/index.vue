<template>
  <div class='my-container'>
    <div class="weui-search-bar">

      <div class="weui-search-bar__form">

        <div class="weui-search-bar__box">

          <icon class="weui-icon-search_in-box" type="search" size="14"></icon>
          <input type="text" class="weui-search-bar__input" placeholder="搜索" :value="inputVal"
                 :focus="inputShowed" @input="inputTyping"/>
          <div class="weui-icon-clear" v-if="inputVal.length > 0" @click="clearInput">
            <icon type="clear" size="14"></icon>
          </div>
        </div>

        <label class="weui-search-bar__label" :hidden="inputShowed" @click="showInput">
          <icon class="weui-icon-search" type="search" size="14"></icon>
          <div class="weui-search-bar__text">搜索</div>
        </label>

      </div>

      <div class="weui-search-bar__cancel-btn" :hidden="!inputShowed" @click="hideInput">取消</div>

    </div>

    <div class="i-grid">
      <div class="i-grid-item" v-for="item in gridItems">
        <div class="i-grid-icon" :data-tap-item="item" @click="tapGridItem">
          <image :src="item.imgUrl" mode='widthFix'/>
          <div class="i-grid-label">{{item.title}}</div>
        </div>
      </div>

    </div>

    <div class='footer'>
      <i-tab-bar :current="current" @change="handleChange">
        <i-tab-bar-item key="homepage" icon="homepage" current-icon="homepage_fill" title="库存管理"></i-tab-bar-item>
        <i-tab-bar-item key="activity" icon="activity" current-icon="activity_fill" title="购物清单"></i-tab-bar-item>
      </i-tab-bar>
    </div>
  </div>
</template>

<script>
  import "../../../static/css/weui-searchbar.wxss"

  export default {
    data: function () {
      return {
        inputShowed: false,
        inputVal: "",
        current: 'homepage',
        gridItems: [{
          url: 'scan',
          imgUrl: '../../static/imgs/scan.png',
          title: '扫一扫'
        },
          {
            url: '/pages/add/add',
            imgUrl: '../../static/imgs/add.png',
            title: '新建商品'
          }, {
            url: 'input',
            imgUrl: '../../static/imgs/input.png',
            title: '商品入库'
          }, {
            url: 'output',
            imgUrl: '../../static/imgs/output.png',
            title: '商品出库'
          }, {
            url: 'goods',
            imgUrl: '../../static/imgs/goods.png',
            title: '商品管理'
          }, {
            url: 'order',
            imgUrl: '../../static/imgs/order.png',
            title: '入库记录'
          }
        ]
      }
    },
    methods: {
      tapGridItem: function (event) {
        let tapItem = event.currentTarget.dataset.tapItem;
        if (typeof tapItem.callback === 'function') {
          tapItem.callback();
        }
        wx.navigateTo({url: tapItem.url});
      },
      showInput: function () {
        this.inputShowed=true;
      },
      hideInput: function () {
        this.inputVal="";
        this.inputShowed=false;
      },
      clearInput: function () {
        this.inputVal="";
      },
      inputTyping: function (e) {
        this.inputVal=e.detail.value;
      },
      handleChange: function(e) {
         this.current=e.mp.detail.key;
      },
    },
    onLoad: function () {
    }
  }
</script>

<style scoped>
  .footer {
    position: absolute;
    width: 100%;
    bottom: 0;
  }

  .weui-search-bar {
    position: absolute;
    top: 0;
    width: 100%;
    z-index: 999;
  }

  .my-container {
    width: 100%;
    height: 100vh;
  }

  .i-grid {
    width: 100%;
    padding-top: 46px;
    position: relative;
    padding-bottom: 49px;
    height: 100%;
    box-sizing: border-box;
  }

  .i-grid-item {
    width: 50%;
    float: left;
    position: relative;
    height: 33.33%;
    padding: 0;
    background-color: #eee;
  }

  .i-grid-icon {
    width: 120px;
    height: 120px;
    position: relative;
    margin: auto;
    top: 50%;
    margin-top: -60px;
    box-shadow: 0px 1px 6px rgba(0, 2, 0, 0.2);
    border-radius: 10px;
    box-sizing: border-box;
    padding-top: 10px;
    background-color: white;
  }

  .i-grid-icon image {
    display: block;
    margin: 18px auto;
    width: 30px;
  }

  .i-grid-label {
    text-align: center;
    font-weight: 500;
    font-size: 15px;
    position: relative;
    bottom: 0px;
  }

</style>
