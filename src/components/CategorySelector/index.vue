<template>
  <div>
    <el-form :inline="true" :model="catForm" class="demo-form-inline">
      <el-form-item label="一级分类">
        <el-select
          v-model="catForm.cat1Id"
          placeholder="请选择"
          @change="handleCat1"
        >
          <el-option
            :label="cat1.name"
            :value="cat1.id"
            v-for="cat1 in cat1List"
            :key="cat1.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="二级分类">
        <el-select
          v-model="catForm.cat2Id"
          placeholder="请选择"
          @change="handleCat2"
        >
          <el-option
            :label="cat2.name"
            :value="cat2.id"
            v-for="cat2 in cat2List"
            :key="cat2.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="三级分类">
        <el-select
          @change="handleCat3"
          v-model="catForm.cat3Id"
          placeholder="请选择"
        >
          <el-option
            :label="cat3.name"
            :value="cat3.id"
            v-for="cat3 in cat3List"
            :key="cat3.id"
          ></el-option>
        </el-select>
      </el-form-item>

    </el-form>
  </div>
</template>

<script>
export default {
  name: "CategorySelector",
  data() {
    return {
      catForm: {
        cat1Id: "",
        cat2Id: "",
        cat3Id: "",
      },
      cat1List: [],
      cat2List: [],
      cat3List: [],
    };
  },
  mounted() {
    this.getCat1();
  },
  methods: {
    onSubmit() {},
    async getCat1() {
      let result = await this.$API.attr.reqCat1();
      if (result.code == 200) {
        this.cat1List = result.data;
      }
    },

    async handleCat1() {
      this.cat2List = [];
      this.cat3List = [];
      this.catForm.cat2Id = "";
      this.catForm.cat3Id = "";
      const { cat1Id } = this.catForm;
      this.$emit("getCategoryId", { categoryId: cat1Id, level: 1 });
      let result = await this.$API.attr.reqCat2(cat1Id);
      if (result.code == 200) {
        this.cat2List = result.data;
      }
    },
    async handleCat2() {
      this.cat3List = [];
      this.catForm.cat3Id = "";
      const { cat2Id } = this.catForm;
      this.$emit("getCategoryId", { categoryId: cat2Id, level: 2 });
      let result = await this.$API.attr.reqCat3(cat2Id);
      if (result.code == 200) {
        this.cat3List = result.data;
      }
    },

    handleCat3() {
      const { cat3Id } = this.catForm;
      this.$emit("getCategoryId", { categoryId: cat3Id, level: 3 });
    },
  },
};
</script>

<style scoped></style>
