<template>
  <div v-if="total">
    <el-pagination
      :current-page.sync="page"
      :page-sizes="pageSizes"
      :page-size="pageSize"
      :layout="layout"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script>
export default {
  props: {
    rows: {
      type: Number,
      default: 15
    },
    total: {
      type: Number,
      default: 0
    },
    pageSizes: {
      type: Array,
      default() {
        return [10, 15, 20, 30, 50, 100]
      }
    },
    layout: {
      type: String,
      default: 'total, sizes, prev, pager, next, jumper'
    },
    currentPage: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      page: this.currentPage,
      pageSize: this.rows
    }
  },
  watch: {
    currentPage(e) {
      this.page = e
    }
  },
  methods: {
    handleSizeChange(rows) {
      this.pageSize = rows
      this.$emit('pagination', {
        page: 1,
        rows
      })
    },
    handleCurrentChange(page) {
      this.page = page
      this.$emit('pagination', {
        page
      })
    }
  }
}
</script>

<style scoped>
.el-pagination {
  padding-top: 15px;
  padding-bottom: 15px;
  text-align: right;
}
</style>
