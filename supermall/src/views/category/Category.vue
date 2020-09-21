<template>
  <div id="category">
    <nav-bar class="category-nav">
      <div slot="center">商品分类</div>
    </nav-bar>
    <div class="content">
      <tab-menu
        :categories="categories"
        @selectItem="selectItem"
        class="menu"
        @click.native="menuClick"
      />
      <div class="content-item">
        <tab-control
          :titles="['流行', '新款', '精选']"
          @tabClick="tabClick"
          ref="tabControl1"
          class="tab-control-item"
          v-show="isTabFixed"
        />
        <scroll
          id="tab-content"
          :data="[categoryData]"
          ref="scroll"
          @scroll="contentScroll"
          :probe-type="3"
          :pull-up-load="true"
          @pullingUp="loadMore"
        >
          <div>
            <tab-content-category
              :subcategories="showSubcategory"
              class="tab-content-category"
              @categoryImageLoad="categoryImageLoad"
              @click.native="categoryClick"
            />
            <tab-control :titles="['综合', '新品', '销量']" @tabClick="tabClick" ref="tabControl2" />
            <goods-list :goods="showCategoryDetail" />
          </div>
        </scroll>
      </div>

      <back-top @click.native="backClick" v-show="isShowBackTop" />
    </div>
  </div>
</template>

<script>
import NavBar from "components/common/navbar/NavBar";
import TabMenu from "./childComps/TabMenu";
import TabContentCategory from "./childComps/TabContentCategory";
import TabControl from "components/content/tabControl/TabControl";
import GoodsList from "components/content/goods/GoodsList";

import Scroll from "components/common/scroll/Scroll";

import {
  getCategory,
  getSubcategory,
  getCategoryDetail
} from "../../network/category";
import { POP, SELL, NEW } from "common/const";
import {
  itemListenerMixin,
  tabControlMixin,
  backTopMixin
} from "common/mixin.js";

export default {
  name: "Category",
  components: {
    NavBar,
    TabMenu,
    TabContentCategory,
    TabControl,
    GoodsList,
    Scroll
  },
  mixins: [itemListenerMixin, tabControlMixin, backTopMixin],
  data() {
    return {
      categories: [],
      categoryData: {},
      currentIndex: -1,
      tabOffsetTop: 0,
      isTabFixed: false
    };
  },
  computed: {
    showSubcategory() {
      if (this.currentIndex === -1) return {};
      return this.categoryData[this.currentIndex].subcategories;
    },
    showCategoryDetail() {
      if (this.currentIndex === -1) return [];
      return this.categoryData[this.currentIndex].categoryDetail[
        this.currentType
      ];
    }
  },
  activated() {
    this.$bus.$on("itemImageLoad", this.itemListener);
    this.$refs.scroll.refresh();
  },
  deactivated() {
    this.$bus.$off("itemImageLoad", this.itemListener);
  },
  created() {
    // 1.请求分类数据
    this._getCategory();
  },
  methods: {
    loadMore() {
      this._getCategoryDetail(this.currentType);
    },
    menuClick() {
      this.$refs.scroll.scrollTo(0, 0);
    },
    categoryClick() {
      this.$refs.scroll.scrollTo(0, -this.tabOffsetTop);
    },
    categoryImageLoad() {
      this.tabOffsetTop = this.$refs.tabControl2.$el.offsetTop;
    },
    contentScroll(position) {
      // 1.判断BackTop是否显示
      this.listenShowBackTop(position);
      //* this.isShowBackTop = -position.y > 1000; */

      // 2.决定tabControl是否吸顶(position: fixed)
      this.isTabFixed = -position.y > this.tabOffsetTop;
    },
    _getCategory() {
      getCategory().then(res => {
        // 1.获取分类数据
        this.categories = res.data.category.list;
        // 2.初始化每个类别的子数据
        for (let i = 0; i < this.categories.length; i++) {
          this.categoryData[i] = {
            subcategories: {},
            categoryDetail: {
              pop: [],
              new: [],
              sell: []
            }
          };
        }
        // 3.请求第一个分类的数据
        this._getSubcategories(0);
      });
    },
    _getSubcategories(index) {
      this.currentIndex = index;
      const mailKey = this.categories[index].maitKey;
      getSubcategory(mailKey).then(res => {
        this.categoryData[index].subcategories = res.data;

        this.categoryData = { ...this.categoryData };
        this._getCategoryDetail(POP);
        this._getCategoryDetail(SELL);
        this._getCategoryDetail(NEW);
      });
    },
    _getCategoryDetail(type) {
      // 1.获取请求的miniWallkey
      const miniWallkey = this.categories[this.currentIndex].miniWallkey;

      // 2.发送请求,传入miniWallkey和type
      getCategoryDetail(miniWallkey, type).then(res => {
        // 3.将获取的数据保存下来
        this.categoryData[this.currentIndex].categoryDetail[type] = res;
        this.categoryData = { ...this.categoryData };
      });
    },
    /**
     * 事件响应相关的方法
     */
    selectItem(index) {
      this._getSubcategories(index);
    }
  }
};
</script>

<style scoped>
#category {
  height: 100vh;
  position: relative;
}

.nav-bar {
  background-color: var(--color-tint);
  font-weight: 700;
  color: #fff;
}

.content {
  height: calc(100% - 44px - 49px);
  overflow: hidden;
  display: flex;
}
/* 当模板为苹果6/7/8时不需要{margin: -1%}当窗口为苹果5/SE和6/7/8plus时需要{margin: -1%} */
/* .tab-content-category {
  margin: -1%;
} */
.content-item {
  flex: 1;
}
#tab-content {
  height: calc(100% - 44px - 49px);
  overflow: hidden;
  position: absolute;
  top: 44px;
  bottom: 49px;
}
.tab-control-item {
  position: relative;
  z-index: 9;
}
.active {
  position: absolute;
  top: 44px;
}
</style>
