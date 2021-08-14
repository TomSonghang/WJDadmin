<template>
  <div class="login">
    <div
      class="slideShadow"
      v-show="showSlide"
    >
      <transition>
        <div class="slideSty animated bounce">
          <slide-verify
            @success="onSuccess"
            @fail="onFail"
            :sildeText="text"
            :w="350"
            :h="175"
            ref="slideDiv"
          ></slide-verify>
            <div class="iconBtn">
              <i
                class="el-icon-circle-close"
                @click="showSlide = false"
              ></i>
                <i
                  class="el-icon-refresh"
                  @click="refresh"
                ></i>
            </div>
        </div>
      </transition>
  </div>
  <!--上面是滑动人机验证-->
  <div class="bgBox"><img
      src="@/assets/login-bg/loginBg.png"
      alt=""
    /></div>
  <div class="loginBox">
    <!-- <h2 class="loginH2">点金台管理后台</h2> -->

    <div class="loginCon">
      <div class="titleDiv">
        <h3>用户登录</h3>
        <p>让世界没有不好做的生意</p>
      </div>
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="loginForm"
      >
        <el-form-item prop="userId">
          <el-input
            placeholder="请输入账号"
            prefix-icon="el-icon-lock"
            v-model="ruleForm.userId"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            placeholder="请输入密码"
            prefix-icon="el-icon-user"
            v-model="ruleForm.password"
            show-password
          ></el-input>
        </el-form-item>
        <el-button
          type="primary"
          class="loginBtn"
          @click="loginYz('loginForm')"
        >登录</el-button>
          </el-form>
    </div>
  </div>
  </div>
</template>

<script>
import SlideVerify from "@/components/SlideVerify";
import MD5 from "js-md5";
export default {
  data() {
    return {
      notifyObj: null,
      text: "向右滑动",
      showSlide: false,
      ruleForm: {
        userId: "",
        password: "",
        logintype: 3,
      },
      rules: {
        userId: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 3, max: 15, message: "长度在3-15个字符", trigger: "blur" },
        ],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }],
      },
    };
  },
  mounted() {
    // this.shopTip();
  },
  methods: {
    loginYz(from) {
      this.$refs[from].validate(valid => {
        if (valid) {
          this.showSlide = true; //滑动验证
        } else {
          return;
        }
      });
    },
    onSuccess() {
      this.showSlide = false;
      this._login();
    },
    onFail() {
      this.$message.error("验证失败");
    },
    refresh() {
      this.$refs.slideDiv.reset();
    },
    _login() {
      this.ruleForm.password = MD5(this.ruleForm.password); //MD5
      this.ruleForm.password = this.ruleForm.password.toUpperCase(); //大写
      //this.ruleForm.password ='B3576CA3D16B433E5801D77274832478'
      console.log(this.ruleForm);
      this.$store
        .dispatch("user/_login", this.ruleForm)
        .then(res => {
          console.log(res);
          if (res.status !== 1000) {
            this.refresh();
          } else {
            console.log(this.$route);
            console.log(`rouer:${this.$route.query.redirect}`);
            this.$router.push(this.$route.query.redirect).catch(e => {
              console.log("重定向错误" + e);
            });
            if (this.notifyObj) {
              this.notifyObj.close();
            }
            this.notifyObj = null;
          }
        })
        .catch(error => {
          this.refresh();
          this.$message.error(error);
        });
    },
    // shopTip() {
    //   this.notifyObj = this.$notify({
    //     title: "开发提示",
    //     message:
    //       '目前只设置了一个登录角色,管理员账号是:"admin",密码都是"djt123',
    //     duration: 0,
    //     iconClass: "el-icon-s-opportunity",
    //   });
    // },
  },
  components: {
    SlideVerify,
  },
};
</script>
<style lang="less" scoped>
.login {
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: #fff;
  position: relative;
}
.bgBox {
  position: absolute;
  top: 0;
  left: 0;
  height: 450px;
  width: 100%;
  overflow: hidden;
  img {
    display: block;
    width: 100%;
    height: 100%;
    background-size: 100%;
  }
}
.loginBox {
  height: 450px;
  width: 550px;
  margin-left: -275px;
  position: absolute;
  top: 25%;
  left: 50%;
  // margin-top: -150px;
}
.loginH2 {
  font-size: 38px;
  color: #13b5b1;
  text-align: center;
}
.loginCon {
  margin-top: 30px;
  background: #fff;
  border-radius: 4px;
  box-shadow: #2fd1ce 0px 3px 10px;
  .titleDiv {
    padding: 0 28px;
    background: #fff;
    position: relative;
    height: 120px;
    text-align: center;
    border-radius: 4px 4px 0 0;
    h3 {
      font-size: 22px;
      color: #13b5b1;
      font-weight: bold;
      padding-top: 23px;
    }
    p {
      font-size: 16px;
      color: #999;
      padding-top: 12px;
    }
    i {
      font-size: 65px;
      color: #ddd;
      position: absolute;
      right: 27px;
      top: 29px;
    }
  }
  .el-form {
    padding: 25px 25px 30px 25px;
    background: #fff;
    border-radius: 0 0 4px 4px;
  }
}
.loginBtn {
  width: 100%;
  background: #13b5b1;
  border: #2fd1ce;
}
.slideShadow {
  position: fixed;
  z-index: 999;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
}
.slideSty {
  position: absolute;
  width: 380px;
  height: 311px;
  background: #e8e8e8;
  border: 1px solid #dcdcdc;
  left: 50%;
  top: 50%;
  margin-left: -188px;
  margin-top: -176px;
  z-index: 99;
  border-radius: 5px;
}
.iconBtn {
  padding: 9px 0 0 19px;
  color: #5f5f5f;
  border-top: 1px solid #d8d8d8;
  margin-top: 17px;
  i {
    font-size: 22px;
    cursor: pointer;
  }
  i:last-child {
    margin-left: 7px;
  }
}
</style>
<style>
.slideSty .slide-verify {
  margin: 13px auto 0 auto;
  width: 350px !important;
}
.slideSty .slide-verify-slider {
  width: 100% !important;
}
.slideSty .slide-verify-refresh-icon {
  display: none;
}
</style>
