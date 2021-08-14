<template>
  <div class="rolesControl">
    <el-card>
      <el-button type="primary" @click="addRolesTab" class="companyBtn"
        >添加账户</el-button
      >
      <el-table class="mtop" :data="rolesTab" stripe border style="width:100%">
        <el-table-column
          el-table-column
          prop="userId"
          label="账号"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="userName"
          label="账户名"
          align="center"
        ></el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button
              type="primary"
              @click="editRoles(scope.$index, scope.row)"
              >编辑</el-button
            >
            <el-button
              type="warning"
              @click="
                deleteRoles(scope.row.userId, scope.row.status, scope.$index)
              "
              :disabled="isAdmin(scope.row)"
              >{{ scope.row.status ? "禁用" : "启用" }}</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-dialog title="权限编辑" :visible.sync="diaIsShow" class="diaForm">
      <el-form
        ref="rolesForm"
        :model="formData"
        :rules="rules"
        label-width="140px"
      >
        <el-form-item label="账号" prop="userId">
          <el-input
            type="text"
            placeholder="请输入要添加的账号信息"
            :disabled="editType == 'update'"
            v-model="formData.userId"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="密码"
          prop="password"
        >
          <el-input
            type="text"
            show-password
            placeholder="不修改则不用填写"
            v-model="formData.password"
          ></el-input>
        </el-form-item>
        <el-form-item label="账户名" prop="userName">
          <el-input
            type="text"
            placeholder="角色名称"
            v-model="formData.userName"
          ></el-input>
        </el-form-item>
        <el-form-item label="菜单" v-if="formData.userId != 'admin'">
          <el-tree
            :data="treeData"
            ref="tree"
            node-key="name"
            :props="defaultProps"
            show-checkbox
            :check-strictly="false"
          >
          </el-tree>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="changeRoles('rolesForm', editType)"
            >确认</el-button
          >
          <el-button @click="diaIsShow = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import {
  GetUserManage,
  UpdateUserStatus,
  GetUserInfo,
  SaveUserInfo
} from "@/api/pageUser";
import { asyncRoutes, currencyRoutes } from "@/router";
import Code from "@/api/statusCode";
import MD5 from "js-md5";
export default {
  data() {
    return {
      rolesTab: [
        { userId: "admin", userName: "管理员" },
        {
          userId: "edit",
          userName: "编辑者",
          pages: [
            "Home",
            "Dashbord",
            "Feedback",
            "Feedback-index",
            "Permission",
            "PageUser"
          ]
        }
      ],

      diaIsShow: false,
      formData: {},
      editType: "update",
      rules: {
        userId: [
          {
            required: true,
            message: "请输入要添加的账号信息",
            trigger: "blur"
          }
        ],
        userName: [
          { required: true, message: "请输入相关说明", trigger: "blur" }
        ]
      },
      treeData: [],
      //
      defaultProps: {
        label: "label",
        children: "children"
      },
      allRoute: [...currencyRoutes, ...asyncRoutes],
      editIndex: 0
    };
  },
  created() {
    this._GetUserManage();
  },
  mounted() {
    // this.treeData = this.getTreeData(this.allRoute);
    //this.shopTip();
  },
  methods: {
    shopTip() {
      this.notifyObj = this.$notify({
        title: "开发提示",
        message:
          "该接口api暂未处理,所有模拟了两个账号,主账号admin不可删除,页面全部展示,账号密码不可编辑",
        duration: 10000,
        iconClass: "el-icon-s-opportunity"
      });
    },
    _GetUserManage() {
      //获取权限列表
      let data = {
        pageNo: 1,
        pageSize: 200
      };
      GetUserManage(data)
        .then(res => {
          console.log(res);
          this.rolesTab = res.data.list;
        })
        .catch(error => {
          this.$message.error(error);
        });
    },
    addRolesTab() {
      //添加账户
      let data = {
        toUserId: ""
      };
      GetUserInfo(data).then(res => {
        debugger;
        let list = res.data.privilegeTreeList; //获取该用户的权限
        this.treeData = this.getTree(list).treeData; //生成树结构
        this.diaIsShow = true;
        this.editType = "add";
        this.formData = {};
        this.$nextTick(() => {
          this.$refs.rolesForm.clearValidate();
          this.$refs.tree.setCheckedKeys(['001S']); //这里就是处理哪些内容需要勾选的
        });
      });
    },
    isAdmin(row) {
      if (row.userId === "admin") return true;
      else return false;
    },
    editRoles(index, row) { 
      //编辑权限
      let data = {
        toUserId: row.userId
      };
      GetUserInfo(data).then(res => {
        console.log(res);
        let trueData = [];
        debugger;
        let list = res.data.privilegeTreeList; //获取该用户的权限
        this.treeData = this.getTree(list).treeData; //生成树结构
        trueData = this.getTree(list).trueData; //勾选的树结构
        this.diaIsShow = true;
        this.editIndex = index;
        this.editType = "update";
        this.formData = Object.assign({}, this.formData, {
          userId: row.userId,
          password: "",
          userName: row.userName
        });
        if (row.userId == "admin") {
          return false;
        }
        this.$nextTick(() => {
          this.$refs.rolesForm.clearValidate();
          this.$refs.tree.setCheckedKeys(trueData);
        });
      });
    },
    deleteRoles(id, statu, index) {
      //禁用启用
      this.$confirm(
        `确定要${statu == 1 ? "禁用" : "启用"}该角色数据,是否继续?`,
        "提示",
        {
          confirmButtonText: "好的",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(() => {
          //  this.rolesTab.splice(index, 1);
          let data = {
            userId: id,
            status: statu == 1 ? 0 : 1
          };
          UpdateUserStatus(data).then(res => {
            if (res.status === Code.SUCCESS_CODE) {
              this.$message({
                type: "success",
                message: "操作成功"
              });
              this.rolesTab[index].status = statu == 1 ? 0 : 1;
            } else {
              this.$message({
                type: "error",
                message: res.message
              });
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消"
          });
        });
    },
    changeRoles(form, type) {
      this.$refs[form].validate(valid => {
        if (valid) {
          let treeKeys = "";
          if (this.formData.userId == "admin") {
            treeKeys = "|001S|002S|003S|";
          } else {
            treeKeys = this.$refs.tree.getCheckedKeys(); //获取呗选择的节点,返回数组
            if (treeKeys.length == 0) {
              treeKeys = "";
            } else if (treeKeys.length > 0 && treeKeys.length == 1) {
              treeKeys = `|${treeKeys[0]}|`;
            } else {
              treeKeys = treeKeys.join("|");
              treeKeys = `|${treeKeys}|`;
            }
          }

          if (this.formData.password != "") {
            this.formData.password = MD5(this.formData.password); //MD5
            this.formData.password = this.formData.password.toUpperCase(); //大写
          }

          let data = {
            type: type === "update" ? 2 : 1,
            userId: this.formData.userId,
            userPwd: this.formData.password,
            userName: this.formData.userName,
            privilegeNo: treeKeys
          };
          SaveUserInfo(data).then(res => {
            if (res.status === Code.SUCCESS_CODE) {
              this._GetUserManage(); //刷新
              this.$notify({
                title: "成功",
                message: "权限修改成功",
                type: "success"
              });
            } else {
              this.$notify({
                title: "失败",
                message: res.message,
                type: "error"
              });
            }
          });
          // if (type === "update") {

          //   let index = this.editIndex;
          //   this.rolesTab[index].userId = this.formData.userId;
          //   this.rolesTab[index].password = this.formData.password;
          //   this.rolesTab[index].userName = this.formData.userName;
          //   this.rolesTab[index].pages = treeKeys;
          //   console.log(treeKeys);
          //   if (treeKeys.length == 0) {     //一个都没勾选的话
          //     this.$notify({
          //       title: "失败",
          //       message: "多少给他留个页面吧~",
          //       type: "error",
          //     });
          //   } else {
          //     this.$notify({
          //       title: "成功",
          //       message: "权限修改成功",
          //       type: "success",
          //     });
          //   }
          // } else if (type === "add") {
          //   //新增的时候
          //   let newTab = {};
          //   newTab.userId = this.formData.userId;
          //   newTab.password = this.formData.password;
          //   newTab.userName = this.formData.userName;
          //   newTab.pages = treeKeys;
          //   this.rolesTab.push(newTab);
          //   if (treeKeys.length == 0) {     //一个都没勾选的话
          //     this.$notify({
          //       title: "失败",
          //       message: "多少给他留个页面吧~",
          //       type: "error",
          //     });
          //   } else {
          //     this.$notify({
          //       title: "成功",
          //       message: "权限修改成功",
          //       type: "success",
          //     });
          //   }
          // }
          this.diaIsShow = false;
        } else {
          return false;
        }
      });
    },
    getTreeData(route) {
      let arrBox = [];
      for (let item of route) {
        if (item.hidden) continue;
        let onlyChild = this.hasOnlyChild(item.children, item);
        if (onlyChild && !onlyChild.children) {
          item = onlyChild;
        }
        let data = {
          label: item.meta.title,
          name: item.name
        };
        if (item.children) {
          data.children = this.getTreeData(item.children);
        }
        arrBox.push(data);
      }
      console.log(arrBox);
      return arrBox;
    },
    hasOnlyChild(children = [], item) {
      let newChildren = children.filter(item => {
        if (item.hidden) {
          return false;
        } else {
          return true;
        }
      });
      if (newChildren.length === 1 && !item.meta) {
        return newChildren[0];
      } else if (newChildren.length === 0) {
        return item;
      }
      return false;
    },
    getTree(list) {
      //递归函数转换数据
      let arrBox = []; //树形结构
      let trueBox = ['001S']; //选中结构  首页是默认被选中的
      debugger
      for (let item of list) {
        if (item.isHas == 1) {
          trueBox.push(item.privilegeNo);
        }
        let data = {
          label: item.privilegeName,
          name: item.privilegeNo,
          disabled:item.privilegeNo =='001S'?true:false   //首页默认是禁止选择且被选中
        };
          debugger
        if (item.subList.length > 0) {
          data.children = this.getTree(item.subList);
        }
       
        arrBox.push(data);
      }
      return {
        trueData: trueBox,
        treeData: arrBox
      };
    }
  }
};
</script>
