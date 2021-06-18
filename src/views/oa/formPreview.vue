<template>
  <div>
    <el-card>
      <fm-generate-form ref="generateForm" :data="formData"></fm-generate-form>
    </el-card>
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    //这里存放数据
    return {
      formData: {
        list: [
          {
            name: '审核结果',
            el: 'flag',
            icon: 'icon-flow icon-user-check',
            options: {
              defaultValue: '1',
              customClass: '',
              disabled: false,
              labelWidth: 100,
              isLabelWidth: false,
              hidden: false,
              dataBind: true,
              required: true,
              pattern: '',
              remoteFunc: 'func_1610939360183',
              remoteOption: 'option_1610939360183'
            },
            rules: [
              {
                required: true,
                message: '必须填写'
              }
            ],
            type: 'custom',
            key: '1610939360183',
            model: 'flag'
          },
          {
            name: '审核意见',
            el: 'remark',
            icon: 'icon-flow icon-shenhexitong',
            options: {
              defaultValue: '',
              width: '100%',
              customClass: '',
              disabled: false,
              labelWidth: 100,
              isLabelWidth: false,
              hidden: false,
              dataBind: true,
              required: false,
              pattern: '',
              remoteFunc: 'func_1610939360855',
              remoteOption: 'option_1610939360855'
            },
            rules: [],
            type: 'custom',
            key: '1610939360855',
            model: 'remark'
          },
          {
            name: '附件',
            el: 'uploadFile',
            icon: 'icon-flow icon-wenjian',
            options: {
              defaultValue: '',
              width: '100%',
              multiple: true,
              limit: 9,
              tip: '',
              customClass: '',
              disabled: false,
              labelWidth: 100,
              isLabelWidth: false,
              hidden: false,
              dataBind: true,
              required: false,
              pattern: '',
              remoteFunc: 'func_1610939361695',
              remoteOption: 'option_1610939361695'
            },
            rules: [],
            type: 'custom',
            key: '1610939361695',
            model: 'custom_1610939361695'
          }
        ],
        config: {
          labelWidth: 150,
          labelPosition: 'right',
          size: 'small',
          customClass: '',
          ui: 'element',
          layout: 'horizontal',
          labelCol: 3,
          width: '100%',
          hideLabel: false,
          hideErrorMessage: false
        }
      }
    }
  },
  //生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {},
  //方法集合
  methods: {}
}
</script>
<style lang="less" scoped>
//@import url(); 引入公共css类
</style>
