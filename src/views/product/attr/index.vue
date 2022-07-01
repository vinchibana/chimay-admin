<template>
  <div>
    <el-card style="margin: 20px 0">
      <CategorySelector @getCategoryId="getCategoryId" />
    </el-card>
    <el-card>
      <el-button
        type="primary"
        icon="el-icon-plus"
        :disabled="!category3Id"
        @click="addAttr"
        style="margin-bottom: 15px"
        >添加属性</el-button
      >
      <el-table border style="width: 100%" :data="attrList" v-show="showTable">
        <el-table-column
          type="index"
          label="序号"
          width="80px"
        ></el-table-column>
        <el-table-column
          prop="attrName"
          label="属性名称"
          width="width"
        ></el-table-column>
        <el-table-column prop="prop" label="属性值列表" width="width">
          <template v-slot="{ row, $index }">
            <el-tag
              type="success"
              style="margin: 5px 5px"
              v-for="attrValue in row.attrValueList"
              :key="attrValue.id"
              >{{ attrValue.valueName }}</el-tag
            >
          </template>
        </el-table-column>
        <el-table-column prop="prop" label="操作" width="width">
          <template v-slot="{ row, $index }">
            <el-button
              type="warning"
              icon="el-icon-edit"
              size="mini"
              @click="updateAttr(row)"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>

      <div v-show="!showTable">
        <el-form
          :inline="true"
          ref="form"
          label-width="80px"
          style="margin: 15px 0"
          :model="attrInfo"
        >
          <el-form-item label="属性名">
            <el-input
              aria-placeholder="请输入属性名"
              v-model="attrInfo.attrName"
            >
            </el-input>
          </el-form-item>
        </el-form>

        <el-button
          type="primary"
          icon="el-icon-plus"
          :disabled="!attrInfo.attrName"
          @click="addAttrValue"
          >添加属性值</el-button
        >
        <el-button @click="showTable = true">取消</el-button>

        <el-table
          :data="attrInfo.attrValueList"
          style="width: 100%; margin: 15px 0"
          border
          v-show="!showTable"
        >
          <el-table-column
            type="index"
            label="index"
            width="80px"
            align="center"
          ></el-table-column>
          <el-table-column label="属性值名称" width="width">
            <template v-slot="{ row, index }">
              <el-input
                aria-placeholder="请输入属性值"
                v-model="row.valueName"
                size="mini"
                v-if="row.flag"
                @blur="toViewMode(row)"
                @keyup.native.enter="toViewMode(row)"
              ></el-input>
              <span v-else @click="row.flag = true" style="display: block">{{
                row.valueName
              }}</span>
            </template>
          </el-table-column>

          <el-table-column label="操作" width="width" align="center">
            <template v-slot="{ row, $index }">
              <el-popconfirm
                :title="`确定删除 ${row.valueName} 吗？`"
                @onConfirm="deleteAttrValue($index)"
                ><el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  slot="reference"
                ></el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>

        <el-button type="primary" @click="saveAttrValue">保存</el-button>
        <el-button @click="showTable = true">取消</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
import cloneDeep from "lodash/cloneDeep";
export default {
  name: "Attr",
  data() {
    return {
      category1Id: "",
      category2Id: "",
      category3Id: "",
      attrList: [],
      showTable: true,
      attrInfo: {
        attrName: "",
        attrValueList: [],
      },
      categoryId: 0,
      categoryLevel: 3,
    };
  },
  mounted() {},
  methods: {
    getCategoryId({ categoryId, level }) {
      if (level == 1) {
        this.category1Id = categoryId;
        this.category2Id = "";
        this.category3Id = "";
      } else if (level == 2) {
        this.category2Id = categoryId;
        this.category3Id = "";
      } else {
        this.category3Id = categoryId;
        this.getAttrList();
      }
    },

    async getAttrList() {
      const { category1Id, category2Id, category3Id } = this;
      let result = await this.$API.attr.reqAttrList(
        category1Id,
        category2Id,
        category3Id
      );
      if (result.code == 200) {
        this.attrList = result.data;
      }
    },

    addAttr() {
      this.showTable = false;
      this.attrInfo.attrName = "";
    },
    updateAttr(row) {
      this.showTable = false;
      this.attrInfo = cloneDeep(row);
      this.attrInfo.attrValueList.forEach((item) => {
        this.$set(item, "flag", false);
      });
    },
    addAttrValue() {
      this.attrInfo.attrValueList.push({
        attrId: this.attrInfo.id,
        valueName: "",
        flag: true,
      });
      this.$nextTick(() => {
        this.$refs[this.attrInfo.attrValueList.length - 1].focus();
      });
    },
    deleteAttrValue(index) {
      this.attrInfo.attrValueList.splice(index,1)
    },
    saveAttrValue() {},
    toViewMode(row) {
      row.flag = false;
    },
  },
};
</script>

<style scoped></style>
