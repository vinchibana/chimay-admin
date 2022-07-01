<template>
  <div>
    <el-button
      type="primary"
      icon="el-icon-plus"
      style="margin: 10px 0"
      @click="dialogFormVisible = true"
      >添加</el-button
    >
    <el-table style="width: 100%" border :data="brandList">
      <el-table-column
        type="index"
        label="序号"
        width="80px"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="tmName"
        label="品牌名称"
        width="width"
      ></el-table-column>

      <!-- logo 栏 -->
      <el-table-column prop="prop" label="品牌logo" width="width">
        <template v-slot="{ row, index }">
          <img :src="row.logoUrl" alt="" style="width: 75px; height: 75px" />
        </template>
      </el-table-column>

      <!-- 操作栏 -->
      <el-table-column prop="prop" label="操作" width="width">
        <template v-slot="{ row, index }">
          <el-button
            type="warning"
            icon="el-icon-edit"
            size="mini"
            @click="updateTrademark(row)"
            >修改</el-button
          >
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            @click="deleteTrademark(row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页器 -->
    <el-pagination
      :current-page="page"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :page-sizes="[10, 20, 50]"
      style="margin-top: 20px"
      background
      layout="prev, pager, next, jumper,sizes,total"
    >
    </el-pagination>

    <!-- 添加品牌的对话框 -->
    <el-dialog title="添加品牌" :visible.sync="dialogFormVisible">
      <el-form :model="brandForm" :rules="rules" ref="brandForm">
        <el-form-item label="品牌名称" label-width="100px">
          <el-input v-model="brandForm.tmName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="上传logo" label-width="100px">
          <el-upload
            class="avatar-uploader"
            action="/dev-api/admin/product/fileUpload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img
              v-if="brandForm.logoUrl"
              :src="brandForm.logoUrl"
              class="avatar"
            />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addTrademark">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "tradeMark",
  data() {
    return {
      page: 1,
      limit: 10,
      total: 0,
      brandList: [],
      brandForm: { id: "", tmName: "", logoUrl: "" },
      dialogFormVisible: false,
      rules: {
        tmName: [
          { required: true, message: "请输入品牌名称", trigger: "blur" },
          { min: 2, max: 10, message: "长度在2到10个字符", trigger: "change" },
        ],
        logoUrl: [
          { required: true, message: "请上传品牌logo图片", trigger: "blur" },
        ],
      },
    };
  },
  mounted() {
    this.getPageList();
  },
  methods: {
    handleSizeChange(pageCount) {
      this.limit = pageCount;
      this.getPageList();
    },
    handleCurrentChange(page) {
      this.page = page;
      this.getPageList();
    },
    async getPageList() {
      const { page, limit } = this;
      let result = await this.$API.trademark.reqTrademarkList(page, limit);
      if (result.code == 200) {
        this.total = result.data.total;
        this.brandList = result.data.records;
      }
    },

    addTrademark() {
      this.$refs.brandForm.validate(async (valid) => {
        if (valid) {
          this.dialogFormVisible = false;
          let result = await this.$API.trademark.reqAddOrUpdateTrademark(
            this.brandForm
          );
          if (result.code == 200) {
            this.$message.success(
              this.brandForm.id ? "修改品牌成功" : "添加品牌成功"
            );
            this.$nextTick(async () => {
              await this.getPageList(this.brandForm.id ? this.page : 1);
            });
          }
        }
      });
    },

    deleteTrademark(row) {
      this.$confirm(`是否删除 ${row.tmName}?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          let result = await this.$API.trademark.reqDeleteTrademark(row.id);
          if (result.code == 200) {
            this.$message({
              type: "success",
              message: "删除成功!",
            });
            await this.getPageList(
              this.brandList.length > 1 ? this.page : this.page - 1
            );
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    updateTrademark(row) {
      this.dialogFormVisible = true;
      this.brandForm = { ...row };
    },
    handleAvatarSuccess(res) {
      if (res.code == 200) {
        this.brandForm.logoUrl = res.data;
      }
    },

    beforeAvatarUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isLt2M;
    },
  },
};
</script>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
