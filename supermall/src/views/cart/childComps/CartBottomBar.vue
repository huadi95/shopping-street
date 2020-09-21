<template>
  <div class="cart-bottom-bar">
    <div class="check-content">
      <check-button
        class="check-button"
        :is-checked="isSelectAll"
        @click.native="checkClick"
      />
      <span>全选</span>
    </div>

    <div class="price">合计:{{ totalPrice }}</div>

    <div class="calculate" @click="calculateClick">
      去计算({{ checkLength }})
    </div>
  </div>
</template>

<script>
import CheckButton from "components/content/checkButton/CheckButton";

import { mapGetters } from "vuex";
export default {
  name: "CartBottomBar",
  components: {
    CheckButton
  },
  computed: {
    ...mapGetters(["cartList"]),
    totalPrice() {
      return (
        "￥" +
        this.cartList
          .filter(item => {
            return item.checked;
          })
          .reduce((priceValue, item) => {
            return priceValue + item.price * item.count;
          }, 0)
          .toFixed(2)
      );
    },
    checkLength() {
      return this.cartList.filter(item => item.checked).length;
    },
    isSelectAll() {
      if (this.cartList.length === 0) {
        return false;
      }
      return !this.cartList.find(item => !item.checked);
    }
  },
  methods: {
    checkClick() {
      //全部被选中
      if (this.isSelectAll) {
        this.cartList.forEach(item => (item.checked = false));
      }
      //部分被选中或全部没选中
      else {
        this.cartList.forEach(item => (item.checked = true));
      }
    },
    calculateClick() {
      if (!this.isSelectAll) {
        this.$toast({ message: "请选择要购买的商品" });
      }
    }
  }
};
</script>
<style scoped>
.cart-bottom-bar {
  position: relative;
  display: flex;

  height: 40px;
  line-height: 40px;

  background-color: #eee;
}
.check-content {
  display: flex;
  align-items: center;
  margin-left: 10px;
  width: 80px;
}
.check-button {
  width: 20px;
  height: 20px;
  line-height: 20px;
  margin-right: 5px;
}
.price {
  margin-left: 20px;
  flex: 1;
}
.calculate {
  text-align: center;
  float: right;
  background-color: red;
  width: 80px;
}
</style>
