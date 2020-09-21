import {
    debounce
} from "common/utils";
import {
    POP,
    NEW,
    SELL
} from "./const";
import BackTop from "components/content/backTop/BackTop";
export const itemListenerMixin = {
    data() {
        return {
            itemListener: null,
        }
    },
    mounted() {
        const refresh = debounce(this.$refs.scroll.refresh, 100);
        this.itemListener = () => {
            refresh();
        }
        this.$bus.$on("itemImageLoad", this.itemListener);
    },
}

export const backTopMixin = {
    components: {
        BackTop
    },
    data() {
        return {
            isShowBackTop: false
        }
    },
    methods: {
        backClick() {
            this.$refs.scroll.scrollTo(0, 0);
        },
        listenShowBackTop(position) {
            //判断BackTop是否显示
            this.isShowBackTop = -position.y > 1500;
        }
    },
}

export const tabControlMixin = {
    data: function() {
        return {
            currentType: POP
        }
    },
    methods: {
        tabClick(index) {
            switch (index) {
                case 0:
                    this.currentType = POP
                    break
                case 1:
                    this.currentType = NEW
                    break
                case 2:
                    this.currentType = SELL
                    break
            }
            this.$refs.tabControl1.currentIndex = index;
            this.$refs.tabControl2.currentIndex = index;
        }
    }
}
