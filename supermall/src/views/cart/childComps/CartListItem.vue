<template>
  <div id="shop-item">
    <div class="item-selector">
      <CheckButton :is-checked="itemInfo.checked" @click.native="checkClick" />
    </div>
    <div class="item-img">
      <img :src="itemInfo.image" alt="商品图片" />
    </div>
    <div class="item-info">
      <div class="item-title">{{ itemInfo.title }}</div>
      <div class="item-desc">{{ itemInfo.desc }}</div>
      <div class="info-bottom">
        <div class="item-price left">¥{{ itemInfo.price }}</div>
        <div class="item-count right">
          <button class="info-count-delete" @click="expurgateClick">
            <img src="~assets/img/cart/delete.png" alt />
          </button>
          <button class="item-count-button" @click="decrement" :disabled="isActive">-</button>
          x{{ itemInfo.count }}
          <button class="item-count-button" @click="increment">+</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import CheckButton from "components/content/checkButton/CheckButton";
export default {
  name: "CartListItem",
  components: {
    CheckButton
  },
  data() {
    return {
      isActive: false
    };
  },
  props: {
    itemInfo: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  activated() {
    //进入购物车的时候判断count是否大于1
    if (this.itemInfo.count > 1) {
      this.isActive = false;
    } else {
      this.isActive = true;
    }
  },
  methods: {
    checkClick() {
      this.itemInfo.checked = !this.itemInfo.checked;
    },
    increment() {
      this.itemInfo.count++;
      //itemInfo.count大于1的时候解除decrement的button不能点击
      if (this.itemInfo.count > 1) {
        this.isActive = false;
      } else {
        this.isActive = true;
      }
    },
    decrement() {
      this.itemInfo.count--;
      //itemInfo.count小于等于1的时候decrement的button不能点击
      if (this.itemInfo.count <= 1) {
        this.isActive = true;
      } else {
        this.isActive = false;
      }
    },
    expurgateClick() {
      this.$emit("expurgateClick");
    }
  }
};
</script>
<style scoped>
#shop-item {
  width: 100%;
  display: flex;
  font-size: 0;
  padding: 5px;
  border-bottom: 1px solid #ccc;
}

.item-selector {
  width: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.item-title,
.item-desc {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.item-img {
  padding: 5px;
  /*border: 1px solid #ccc;*/
}

.item-img img {
  width: 80px;
  height: 100px;
  display: block;
  border-radius: 5px;
}

.item-info {
  font-size: 17px;
  color: #333;
  padding: 5px 10px;
  position: relative;
  overflow: hidden;
}

.item-info .item-desc {
  font-size: 14px;
  color: #666;
  margin-top: 15px;
}

.info-bottom {
  margin-top: 10px;
  position: absolute;
  bottom: 10px;
  left: 10px;
  right: 10px;
}
.item-count-button {
  width: 20px;
  text-align: center;
}
.info-bottom .item-price {
  color: orangered;
}
.info-count-delete {
  margin-right: 10px;
}
.info-count-delete img {
  width: 20px;
  height: 18px;
}
</style>
