<template>
  <div>
    <el-dialog :title="modalParams.title" append-to-body :visible.sync="show" width="640px">
      <el-form ref="formRef" :model="formData" :rules="formDataRules" label-width="150px" style="width: 80%">
        <el-form-item label="分组名称" prop="name">
          <el-input v-model="formData.name" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="项目类型：" prop="projectType">
          <el-select v-model="formData.projectType" clearable placeholder="请选择项目类型">
            <el-option v-for="item in projectTypeList" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input-number v-model="formData.sort" :min="0" :precision="0" label="请输入排序"></el-input-number>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="show = false">取 消</el-button>
        <el-button type="primary" :loading="btnLoading" @click="saveGroup()">保 存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { OaApi } from '../api'
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    modalParams: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      show: false,
      projectTypeList: this.$getArgList('projectType'),
      formData: {
        flag: 2,
        id: '',
        name: '',
        projectType: '',
        sort: 0
      },
      formDataBack: {},
      formDataRules: {
        name: [
          {
            required: true,
            message: '请输入分组名称',
            trigger: 'blur'
          }
        ],
        projectType: [
          {
            required: true,
            message: '请选择项目类型',
            trigger: 'change'
          }
        ]
      },
      btnLoading: false
    }
  },
  watch: {
    visible(val) {
      this.show = val
    },
    show(val) {
      if (!val) {
        this.$emit('update:visible', val)
      }
    },
    'modalParams.data'(val) {
      if (val) {
        Object.assign(this.formData, val)
      } else {
        Object.assign(this.formData, this.formDataBack)
      }
    }
  },
  mounted() {
    Object.assign(this.formDataBack, this.formData)
  },
  methods: {
    // 保存表单分组
    saveGroup() {
      this.$refs['formRef'].validate(valid => {
        if (valid) {
          this.saveGroupSuccess()
        }
      })
    },
    // 保存表单分组 - 异步
    async saveGroupSuccess() {
      try {
        await OaApi.saveFormGroup(this.formData)
        let msg = this.modalParams.isEdit ? '编辑' : '添加'
        this.$message({
          type: 'success',
          message: `${msg}成功!`
        })
        this.$emit('change')
        Object.assign(this.formData, this.formDataBack)
        this.$refs['formRef'].resetFields()
        this.btnLoading = false
      } catch (e) {
        this.btnLoading = false
      }
    }
  }
}
</script>
