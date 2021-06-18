<template>
  <el-container v-loading="loading" class="view-body">
    <el-main>
      <el-form ref="form" :model="form" :rules="rules" label-width="160px">
        <el-card :body-style="{ padding: '15px 20px 10px' }">
          <div slot="header" class="card-header">
            <span>基本信息</span>
            <el-tag v-if="!companyId" style="float: right; margin-top: 8px">实时保存{{ saveTime }}</el-tag>
          </div>
          <div class="card-body">
            <el-row :gutter="20">
              <el-col :span="8">
                <el-form-item label="企业名称：" prop="name">
                  <el-input
                    v-model.trim="form.name"
                    :maxlength="100"
                    auto-complete="off"
                    placeholder="请输入企业名称"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="公司资质:" prop="companyQualification">
                  <el-select v-model="form.companyQualification" placeholder="请选择公司资质">
                    <el-option
                      v-for="item in companyQualificationList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="公司类型:" prop="companyType">
                  <el-select v-model="form.companyType" placeholder="请选择公司类型">
                    <el-option
                      v-for="item in companyTypeList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="8">
                <el-form-item label="曾用名：">
                  <el-input
                    v-model.trim="form.legalPersonUsedName"
                    :maxlength="20"
                    auto-complete="off"
                    placeholder="请输入曾用名"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="法定代表人：" prop="legalPerson">
                  <el-input
                    v-model.trim="form.legalPerson"
                    :maxlength="20"
                    auto-complete="off"
                    placeholder="请输入法定代表人"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="法定代表人手机号:">
                  <el-input
                    v-model.trim="form.legalPersonMobile"
                    :maxlength="11"
                    auto-complete="off"
                    placeholder="请输入法定代表人手机号"
                  />
                </el-form-item>
              </el-col>
            </el-row>

            <el-row :gutter="20">
              <el-col :span="8">
                <el-form-item label="联系人：" prop="limkman">
                  <el-input
                    v-model.trim="form.limkman"
                    :maxlength="50"
                    auto-complete="off"
                    placeholder="请输入联系人"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="联系人手机号：" prop="linkmanMobile">
                  <el-input
                    v-model.trim="form.linkmanMobile"
                    :maxlength="11"
                    auto-complete="off"
                    placeholder="联系人手机号"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="邮政编码:" prop="postalCode">
                  <el-input
                    v-model.trim="form.postalCode"
                    :maxlength="6"
                    auto-complete="off"
                    placeholder="请输入邮政编码"
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="24">
                <el-form-item label="联系地址：" prop="contactAddress">
                  <div class="form-content-wrapper">
                    <i class="el-icon-location" @click="handleOpenMapDialog('contactAddress')" />
                    <el-cascader
                      ref="contactAddress"
                      v-model="form.contactAddress"
                      :options="addressList"
                      placeholder="请选择联系地址"
                      filterable
                      @change="handleContactAddressChange"
                    />
                    <el-input
                      v-model.trim="form.contactDetailedAddress"
                      :maxlength="50"
                      class="ml10"
                      placeholder="请输入详细地址"
                    />
                  </div>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="24">
                <el-form-item label="注册地址：" prop="registerAddress">
                  <div class="form-content-wrapper">
                    <i class="el-icon-location" @click="handleOpenMapDialog('registerAddress')" />
                    <el-cascader
                      ref="registerAddress"
                      v-model="form.registerAddress"
                      :options="addressList"
                      placeholder="请选择联系地址"
                      filterable
                      @change="handleRegisterAddressChange"
                    />
                    <el-input
                      v-model.trim="form.registeredDetailedAddress"
                      :maxlength="50"
                      class="ml10"
                      placeholder="请输入详细地址"
                    />
                  </div>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row :gutter="20">
              <el-col :span="8">
                <el-form-item label="企业网址：">
                  <el-input
                    v-model.trim="form.officalWebsite"
                    :maxlength="50"
                    auto-complete="off"
                    placeholder="请输入企业网址"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="传真：">
                  <el-input v-model.trim="form.fax" auto-complete="off" :maxlength="50" placeholder="请输入传真" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="企业邮箱:">
                  <el-input
                    v-model.trim="form.email"
                    auto-complete="off"
                    :maxlength="50"
                    placeholder="请输入企业邮箱"
                  />
                </el-form-item>
              </el-col>
            </el-row>

            <el-row :gutter="20">
              <el-col :span="8">
                <el-form-item label="成立日期：" prop="registerTime">
                  <el-date-picker
                    v-model="form.registerTime"
                    type="date"
                    format="yyyy-MM-dd"
                    value-format="yyyy-MM-dd"
                    placeholder="成立日期"
                    @change="handleTimeChange('registerTime', $event)"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="实缴资本：">
                  <el-input
                    v-model.trim="form.contributedCapitalBaseWan"
                    auto-complete="off"
                    placeholder="请输入实缴资本"
                    :maxlength="50"
                    @change="handleCapitalChange('contributedCapital')"
                    ><i slot="suffix" class="icon-capital">万 </i></el-input
                  >
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="经营状态：" prop="manageStatus">
                  <el-select v-model="form.manageStatus" placeholder="请选择经营状态">
                    <el-option
                      v-for="item in manageStatusList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="8">
                <el-form-item label="注册机构：" prop="registrationAuthority">
                  <el-input
                    v-model.trim="form.registrationAuthority"
                    auto-complete="off"
                    :maxlength="50"
                    placeholder="请输入注册机构"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="工商注册号：" prop="businessRegistrationNumber">
                  <el-input
                    v-model.trim="form.businessRegistrationNumber"
                    auto-complete="off"
                    :maxlength="50"
                    placeholder="请输入工商注册号"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="统一社会信用代码：" prop="unifiedSocialCreditCode">
                  <el-input
                    v-model.trim="form.unifiedSocialCreditCode"
                    auto-complete="off"
                    :maxlength="50"
                    placeholder="请输入统一社会信用代码"
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="8">
                <el-form-item label="核准日期：" prop="approvalTime">
                  <el-date-picker
                    v-model="form.approvalTime"
                    type="date"
                    format="yyyy-MM-dd"
                    value-format="yyyy-MM-dd"
                    placeholder="核准日期"
                    @change="handleApprovalTimeChange"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="纳税人识别号：" prop="taxpayerRegistrationNumber">
                  <el-input
                    v-model.trim="form.taxpayerRegistrationNumber"
                    auto-complete="off"
                    :maxlength="50"
                    placeholder="请输入纳税人识别号"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="纳税人资质：" prop="taxpayerQualification">
                  <el-input
                    v-model.trim="form.taxpayerQualification"
                    auto-complete="off"
                    :maxlength="50"
                    placeholder="请输入纳税人资质"
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="8">
                <el-form-item label="营业期限(起)：" prop="operatingPeriodStart">
                  <el-date-picker
                    v-model="form.operatingPeriodStart"
                    :picker-options="startDateOptions"
                    type="date"
                    format="yyyy-MM-dd"
                    value-format="yyyy-MM-dd"
                    placeholder="营业期限起始时间"
                    @change="handleTimeChange('operatingPeriodStart', $event)"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="营业期限(止)：">
                  <el-date-picker
                    v-model="form.operatingPeriodEnd"
                    :picker-options="endDateOptions"
                    type="date"
                    format="yyyy-MM-dd"
                    value-format="yyyy-MM-dd"
                    placeholder="营业期限结束时间"
                    @change="handleTimeChange('operatingPeriodEnd', $event)"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="注册资金：" prop="registeredCapitalBaseWan">
                  <el-input
                    v-model.trim="form.registeredCapitalBaseWan"
                    auto-complete="off"
                    :maxlength="50"
                    placeholder="请输入注册资金"
                    @change="handleCapitalChange('registeredCapital')"
                    ><i slot="suffix" class="icon-capital">万 </i></el-input
                  >
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="8">
                <el-form-item label="人员规模：">
                  <el-select v-model="form.staffSize" placeholder="请选择人员规模">
                    <el-option
                      v-for="item in staffSizeList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="参保人数：">
                  <el-input
                    v-model.number="form.insuredSize"
                    :maxlength="20"
                    auto-complete="off"
                    placeholder="请输入参保人数"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="组织机构代码：" prop="organizingInstitutionBarCode">
                  <el-input
                    v-model.trim="form.organizingInstitutionBarCode"
                    auto-complete="off"
                    :maxlength="50"
                    placeholder="请输入组织机构代码"
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="24">
                <el-form-item label="经营范围：" prop="businessScope">
                  <el-input
                    v-model.trim="form.businessScope"
                    :maxlength="500"
                    type="textarea"
                    :autosize="{ minRows: 3 }"
                    placeholder="请输入经营范围"
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="8">
                <el-form-item label="企业状态：" prop="status">
                  <el-radio-group v-model="form.status">
                    <el-radio :label="1">启用</el-radio>
                    <el-radio :label="0">禁用</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
              <el-col v-if="processEnv === 'development'" :span="8">
                <el-form-item label="登录名：" prop="loginName">
                  <el-input
                    v-model.trim="form.loginName"
                    :maxlength="20"
                    :disabled="Boolean(form.id)"
                    placeholder="请输入登录名"
                  />
                </el-form-item>
              </el-col>
            </el-row>
          </div>
        </el-card>
        <el-card :body-style="{ padding: '15px 20px 10px' }">
          <div slot="header" class="card-header">
            <span>企业介绍</span>
          </div>
          <el-form-item label="企业图片：">
            <el-image
              v-if="form.companyImageUrl"
              :src="form.companyImageUrl"
              style="width: 200px; height: 200px; border: 1px #ddd solid"
              fit="contain"
              :preview-src-list="[form.companyImageUrl]"
            >
              <div slot="error" class="image-slot">
                <i class="el-icon-picture-outline" />
              </div>
            </el-image>
            <Upload
              list-type="picture"
              btn-type="default"
              is-only-button
              @input="val => uploadCompanyImage(val, 'companyImage')"
            />
          </el-form-item>
          <el-form-item label="企业简介：">
            <el-input
              v-model.trim="form.companyIntroduction"
              :maxlength="2000"
              type="textarea"
              :autosize="{ minRows: 4 }"
              placeholder="请输入企业简介"
            />
          </el-form-item>
        </el-card>
        <el-card :body-style="{ padding: '15px 20px 10px' }">
          <div slot="header" class="card-header">
            <span>企业证件扫描件</span>
          </div>
          <div class="card-body">
            <el-row :gutter="20">
              <el-col :span="24">
                <el-form-item class="is-required" label="企业证件扫描件：">
                  <div class="upload-item-wrapper">
                    <div class="upload-item">
                      <div class="upload-header">
                        <div class="title">工商营业执照</div>
                        <el-checkbox v-model="form.merge" @change="handleMergeChange">三证合一</el-checkbox>
                      </div>
                      <div>
                        <el-image
                          :src="form.certificationPicture && form.certificationPicture.businessLicenseURL"
                          fit="contain"
                        >
                          <div slot="error" class="image-slot">
                            <i class="el-icon-picture-outline" />
                          </div>
                        </el-image>
                        <Upload
                          list-type="picture"
                          btn-type="default"
                          is-only-button
                          @input="val => add(val, 'businessLicense')"
                        />
                      </div>
                    </div>
                    <div v-if="!form.merge" class="upload-item">
                      <div class="upload-header">
                        <div class="title">组织机构代码证</div>
                      </div>
                      <div>
                        <el-image
                          :src="form.certificationPicture && form.certificationPicture.organizationCodeCertificateURL"
                        >
                          <div slot="error" class="image-slot">
                            <i class="el-icon-picture-outline" />
                          </div>
                        </el-image>
                        <Upload
                          :show-file-list="false"
                          list-type="picture"
                          btn-type="default"
                          is-only-button
                          @input="val => add(val, 'organizationCodeCertificate')"
                        />
                      </div>
                    </div>
                    <div v-if="!form.merge" class="upload-item">
                      <div class="upload-header">
                        <div class="title">税务登记证</div>
                      </div>
                      <div>
                        <el-image :src="form.certificationPicture && form.certificationPicture.taxRegistrationURL">
                          <div slot="error" class="image-slot">
                            <i class="el-icon-picture-outline" />
                          </div>
                        </el-image>
                        <Upload
                          list-type="picture"
                          is-only-button
                          btn-type="default"
                          @input="val => add(val, 'taxRegistration')"
                        />
                      </div>
                    </div>
                  </div>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
        </el-card>
      </el-form>
    </el-main>
    <div class="footer-btn">
      <el-button size="lg" @click="handleGoBack">返 回</el-button>
      <el-button size="lg" type="primary" @click="handleSubmit">提 交</el-button>
    </div>
    <!-- 地图弹窗 -->
    <el-dialog
      title="地图选点"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      width="1000px"
      custom-class="map-container"
    >
      <Map
        :map-type="mapType"
        :address="addressDetail"
        :selected-position="selectedPostion"
        @choosedLocation="handlechoosedLocation"
      />
    </el-dialog>
  </el-container>
</template>

<script>
import companyAPI from '@/api/company'
import pca from '../../../assets/JS/pca'
import pattern from '@/utils/rules'
import Upload from '@/components/upload'
import Map from '@/components/map'
export default {
  name: 'Update',
  components: {
    Upload,
    Map
  },
  data() {
    return {
      // 地图弹窗
      dialogVisible: false,
      mapType: null, // 联系地址还是注册地址
      selectedPostion: '', // 打开map组件是的默认位置
      addressDetail: '', // 详细位置
      loading: false,
      companyId: this.$route.query.id || '',
      processEnv: process.env.NODE_ENV,
      form: {
        loginName: '',
        approvalTime: '',
        businessRegistrationNumber: '',
        businessScope: '',
        companyId: '',
        companyKind: '',
        companyQualification: '',
        companyType: '',
        // 证件扫描件信息
        merge: false, // 证件是否合并
        certificationPicture: {
          businessLicense: '',
          businessLicenseURL: '',
          organizationCodeCertificate: '',
          organizationCodeCertificateURL: '',
          taxRegistration: '',
          taxRegistrationURL: ''
        },
        certificationPictureIds: '',
        contactAddress: [],
        contactCity: '',
        contactDetailedAddress: '',
        contactMunicipalDistrict: '',
        contactProvince: '',
        contributedCapital: null,
        contributedCapitalBaseWan: null, // 以万为单位的实缴资本
        designCompanyParamDTO: {
          affiliation: '',
          businessLicenseRegistrationNumber: '',
          chiefEngineerEducation: '',
          chiefEngineerJobTitle: null,
          chiefEngineerMajor: '',
          chiefEngineerName: '',
          chiefEngineerQualification: '',
          chiefEsdSeniority: null,
          corproateSupervisor: '',
          earliestEstablishmentTime: '',
          intermediateProfessionalCounts: null,
          juniorProfessionalCounts: null,
          qualificationCertificateNumber: '',
          registeredEsdCounts: null,
          registeredPmArchitectCounts: null,
          seniorProfessionalCounts: null,
          unregisteredEsdCounts: null,
          unregisteredPmArchitectCounts: null
        },
        email: '',
        fax: '',
        id: '',
        insuredSize: null,
        legalPerson: '',
        legalPersonMobile: '',
        legalPersonUsedName: null,
        limkman: '',
        linkmanMobile: '',
        manageStatus: '',
        name: '',
        officalWebsite: '',
        operatingPeriodEnd: null,
        operatingPeriodStart: '',
        organizingInstitutionBarCode: '',
        postalCode: '',
        registerTime: '',
        registeredCapital: null,
        registeredCapitalBaseWan: null, // 以万为单位的注册资金
        registerAddress: [],
        registeredCity: '',
        registeredDetailedAddress: '',
        registeredMunicipalDistrict: '',
        registeredProvince: '',
        registrationAuthority: '',
        staffSize: null,
        taxpayerQualification: '',
        taxpayerRegistrationNumber: '',
        unifiedSocialCreditCode: '',
        updateTime: '',
        status: null,
        companyImage: '',
        companyImageUrl: '',
        companyIntroduction: ''
      },
      rules: {
        loginName: [
          {
            required: true,
            message: '请输入登录名',
            trigger: 'blur'
          }
        ],
        name: [
          {
            required: true,
            message: '请输入公司名称',
            trigger: 'blur'
          },
          {
            pattern: pattern.nickName,
            message: '支持字母、数字、汉字、（）、()',
            trigger: 'blur'
          }
        ],
        companyQualification: [
          {
            required: true,
            message: '请选择公司资质',
            trigger: ['blur', 'change']
          }
        ],
        companyType: [
          {
            required: true,
            message: '请选择公司类型',
            trigger: ['blur', 'change']
          }
        ],
        legalPerson: [
          {
            required: true,
            message: '请输入法定代表人',
            trigger: 'blur'
          },
          {
            pattern: pattern.name,
            message: '请输入正确的法定代表人',
            trigger: 'blur'
          }
        ],
        limkman: [
          {
            required: true,
            message: '请输入联系人',
            trigger: 'blur'
          },
          {
            pattern: pattern.name,
            message: '请输入正确的联系人',
            trigger: 'blur'
          }
        ],
        linkmanMobile: [
          {
            required: true,
            message: '请输入联系人手机号',
            trigger: 'blur'
          },
          {
            pattern: pattern.mobile,
            message: '请输入正确的联系人手机号',
            trigger: 'blur'
          }
        ],
        postalCode: [
          {
            required: true,
            message: '请输入邮政编码',
            trigger: 'blur'
          }
        ],
        registerTime: [
          {
            required: true,
            message: '请输入企业成立时间',
            trigger: 'blur'
          }
        ],
        manageStatus: [
          {
            required: true,
            message: '请选择企业经营状态',
            trigger: ['blur', 'change']
          }
        ],
        registrationAuthority: [
          {
            required: true,
            message: '请输入注册机构',
            trigger: 'blur'
          }
        ],
        businessRegistrationNumber: [
          {
            required: true,
            message: '请输入工商注册号',
            trigger: 'blur'
          }
        ],
        unifiedSocialCreditCode: [
          {
            required: true,
            message: '请输入统一社会信用代码',
            trigger: 'blur'
          },
          {
            pattern: /^[0-9A-HJ-NPQRTUWXY]{2}\d{6}[0-9A-HJ-NPQRTUWXY]{10}$/,
            message: '请输入合法的统一社会信用代码'
          }
        ],
        approvalTime: [
          {
            required: true,
            message: '请选择核准日期',
            trigger: 'blur'
          }
        ],
        taxpayerRegistrationNumber: [
          {
            required: true,
            message: '请输入纳税人识别号',
            trigger: 'blur'
          }
        ],
        taxpayerQualification: [
          {
            required: true,
            message: '请输入纳税人资质',
            trigger: 'blur'
          }
        ],
        operatingPeriodStart: [
          {
            required: true,
            message: '请选择营业期限起始时间',
            trigger: 'blur'
          }
        ],
        registeredCapitalBaseWan: [
          {
            required: true,
            message: '请输入注册资金',
            trigger: 'blur'
          }
        ],
        organizingInstitutionBarCode: [
          {
            required: true,
            message: '请输入组织机构代码',
            trigger: 'blur'
          }
        ],
        businessScope: [
          {
            required: true,
            message: '请输入经营范围',
            trigger: 'blur'
          }
        ],
        status: [
          {
            required: true,
            message: '请选择企业状态',
            trigger: ['blur', 'change']
          }
        ],
        registerAddress: [
          {
            required: true,
            message: '请选择注册地址',
            trigger: ['blur', 'change']
          }
        ],
        contactAddress: [
          {
            required: true,
            message: '请选择联系地址',
            trigger: ['blur', 'change']
          }
        ]
      },
      companyQualificationList: [],
      companyTypeList: [],
      staffSizeList: [],
      manageStatusList: [],
      addressList: pca,
      // 设置日期控件禁用效果
      startDateOptions: {},
      endDateOptions: {}
    }
  },
  computed: {
    // 表单缓存
    formDataTemp() {
      return this.$store.state.user.companyAddTemp
    },
    // 上次保存时间
    saveTime() {
      return this.$store.state.user.saveTime
    }
  },
  watch: {
    'form.operatingPeriodStart'(val, oldVal) {
      this.endDateOptions = {
        disabledDate(time) {
          if (val) {
            return time.getTime() < new Date(val).getTime() + 24 * 60 * 60 * 1000
          } else {
            return false
          }
        }
      }
    },
    'form.operatingPeriodEnd'(newVal) {
      this.startDateOptions = {
        disabledDate(time) {
          if (newVal) {
            return time.getTime() > new Date(newVal).getTime() - 24 * 60 * 60 * 1000
          } else {
            return false
          }
        }
      }
    }
  },
  created() {
    this.init(this.companyId)
  },
  beforeDestroy() {
    this.$route.meta.title = ''
    this.$store.commit('user/closeCacheTimer')
  },
  methods: {
    init(id) {
      if (!id) {
        this.autoSave()
      }
      this.handleQuerySystemSetting()
      this.$route.meta.title = id === '' ? '添加企业' : '更新企业信息'
      if (id === '') return
      // 编辑时处理公司相关数据
      this.loading = true
      companyAPI
        .getCompanyInfo(id)
        .then(res => {
          if (res.code === 200) {
            const baseInfo = res.data || {}
            this.form = Object.assign(this.form, baseInfo)
            // 设置曾用名：默认至null,不能设置为空字符串
            console.log('无曾用名时设置为null')
            this.form.legalPersonUsedName = this.form.legalPersonUsedName || null
            // 地址数据处理
            this.form.registerAddress = [
              this.form.registeredProvince,
              this.form.registeredCity,
              this.form.registeredMunicipalDistrict
            ]
            this.form.contactAddress = [
              this.form.contactProvince,
              this.form.contactCity,
              this.form.contactMunicipalDistrict
            ]
            // 资金处理
            this.form.contributedCapitalBaseWan = this.form.contributedCapital / 10000
            this.form.registeredCapitalBaseWan = this.form.registeredCapital / 10000
            // 日期处理
            this.form.approvalTime = this.moment(this.form.approvalTime).format('YYYY-MM-DD HH:mm:ss')
            this.form.registerTime = this.moment(this.form.registerTime).format('YYYY-MM-DD HH:mm:ss')
            this.form.operatingPeriodStart = this.moment(this.form.operatingPeriodStart).format('YYYY-MM-DD HH:mm:ss')
            if (this.form.operatingPeriodEnd) {
              this.form.operatingPeriodEnd = this.moment(this.form.operatingPeriodEnd).format('YYYY-MM-DD HH:mm:ss')
            }
            // 证件照处理
            if (!this.form.certificationPictureIds) {
              this.loading = false
              return
            }
            // console.log('证件照', this.form.certificationPictureIds)
            const photos = (this.form.certificationPictureIds || '').split(',').filter(item => item)
            // console.log(photos)
            // const photos = (this.form.certificationPictureIds || '').split(',')
            this.handleQueryImageInfo(photos)
            if (this.form.companyImage) {
              this.queryCompanyImage([this.form.companyImage])
            }
            this.form.merge = photos.length === 1
            this.form.certificationPicture.businessLicense = photos[0]
            if (photos.length > 1) {
              this.form.certificationPicture.organizationCodeCertificate = photos[1]
              this.form.certificationPicture.taxRegistration = photos[2]
            }
          }
        })
        .catch(() => {
          this.loading = false
        })
    },
    // 获取企业图片
    queryCompanyImage(ids) {
      if (ids.length === 0) {
        return
      }
      companyAPI
        .getFileList(ids)
        .then(res => {
          if (res.code === 200) {
            const result = res.data || []
            const urls = ids.map(item => {
              const selectedItem = result.find(subItem => subItem.id === item)
              return selectedItem ? selectedItem.fileUrl : ''
            })
            this.form.companyImageUrl = urls[0]
          }
        })
        .finally(() => {
          this.loading = false
        })
    },
    // 自动缓存
    autoSave() {
      if (this.formDataTemp) {
        Object.assign(this.form, this.formDataTemp)
      }
      this.$store.commit('user/autoSaveCompanyTemp', this.form)
    },
    // 清除缓存
    clearCache() {
      this.$store.commit('user/clearCompanyTemp')
    },
    // 获取系统参数信息
    handleQuerySystemSetting() {
      this.companyQualificationList = this.$getArgList('companyQualification')
      this.companyTypeList = this.$getArgList('companyType')
      this.manageStatusList = this.$getArgList('manageStatus')
      this.staffSizeList = this.$getArgList('staffSize')
    },
    // 获取图片信息
    handleQueryImageInfo(ids) {
      companyAPI
        .getFileList(ids)
        .then(res => {
          if (res.code === 200) {
            const result = res.data || []
            const urls = ids.map(item => {
              const selectedItem = result.find(subItem => subItem.id === item)
              return selectedItem ? selectedItem.fileUrl : ''
            })

            this.form.certificationPicture.businessLicenseURL = urls[0]
            if (urls.length > 1) {
              this.form.certificationPicture.organizationCodeCertificateURL = urls[1]
              this.form.certificationPicture.taxRegistrationURL = urls[2]
            }
          }
        })
        .finally(() => {
          this.loading = false
        })
    },
    // 选择联系地址
    handleContactAddressChange(val) {
      this.form.contactProvince = val[0]
      this.form.contactCity = val[1]
      this.form.contactMunicipalDistrict = val[2]
    },
    // 选择注册地址
    handleRegisterAddressChange(val) {
      this.form.registeredProvince = val[0]
      this.form.registeredCity = val[1]
      this.form.registeredMunicipalDistrict = val[2]
    },
    // 选中核准时间
    handleApprovalTimeChange(val) {
      this.form.approvalTime = `${val} 00:00:00`
    },
    handleTimeChange(key, event) {
      this.form[key] = `${event} 00:00:00`
    },
    // 注册资金，实缴资本输入
    handleCapitalChange(key) {
      this.form[key] = this.form[`${key}BaseWan`] * 10000
    },
    // 返回企业列表
    handleGoBack() {
      this.$router.go(-1)
    },
    // 提交企业信息
    handleSubmit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          const subValid = this.handleValidConstructionCompanyParamDTO()
          if (!subValid) return
          if (this.form.merge) {
            this.form.certificationPictureIds = this.form.certificationPicture.businessLicense
          }
          this.form.operatingPeriodEnd = this.form.operatingPeriodEnd || null
          this.form.legalPersonUsedName = this.form.legalPersonUsedName || null
          this.loading = true

          if (this.form.id) {
            this.handleSubmitUpdateInfo()
          } else {
            this.handleSubmitAddInfo()
          }
        } else {
          this.$message.error('输入数据格式不正确')
        }
      })
    },
    // 验证企业证件信息
    handleValidConstructionCompanyParamDTO() {
      const { businessLicense, organizationCodeCertificate, taxRegistration } = this.form.certificationPicture
      let valid = true
      if (this.form.merge) {
        // 三证合一
        valid = Boolean(businessLicense)
      } else if (Boolean(businessLicense) && Boolean(organizationCodeCertificate) && Boolean(taxRegistration)) {
        valid = true
      } else {
        valid = false
      }
      if (!valid) {
        this.$message.error('请选择正确的企业证件扫描件 ')
      }
      return valid
    },
    handleSubmitUpdateInfo() {
      companyAPI
        .updateCompanyItem(this.form)
        .then(res => {
          if (res.code === 200) {
            this.$message.success('操作成功')
          }
          this.handleGoBack()
        })
        .finally(() => {
          this.loading = false
        })
    },
    handleSubmitAddInfo() {
      companyAPI
        .addCompanyItem(this.form)
        .then(res => {
          if (res.code === 200) {
            this.$message.success('添加成功')
            this.clearCache()
            this.handleGoBack()
            // 通知后台发送消息给联系人
            // 创建企业后，将开通企业超管账号，并发送短信，包含网址、默认登录密码（123456）
          }
        })
        .finally(() => {
          this.loading = false
        })
    },
    // 上传图片
    add(val, key) {
      if (val && val.length) {
        this.form.certificationPicture[key] = val[0].id
        this.form.certificationPicture[`${key}URL`] = val[0].url
      } else {
        this.form.certificationPicture[key] = ''
        this.form.certificationPicture[`${key}URL`] = ''
      }
      if (this.form.merge) {
        // 三证合一
        this.form.certificationPictureIds = this.form.certificationPicture.businessLicense
      } else {
        const { businessLicense, organizationCodeCertificate, taxRegistration } = this.form.certificationPicture
        this.form.certificationPictureIds = [businessLicense, organizationCodeCertificate, taxRegistration].join(',')
      }
    },
    // 上传企业图片
    uploadCompanyImage(val, key) {
      this.form[key] = val[0].id
      this.form.companyImageUrl = val[0].url
      console.log('上传企业图片', val, key)
    },
    // 切换三证合一的状态
    handleMergeChange(val) {
      console.log('切换三证合一的状态', val)
      // if (val) {
      //   this.form.certificationPicture.organizationCodeCertificate = ''
      //   this.form.certificationPicture.organizationCodeCertificateURL = ''
      //   this.form.certificationPicture.taxRegistration = ''
      //   this.form.certificationPicture.taxRegistrationURL = ''
      // }
    },
    // 打开地址对话框
    handleOpenMapDialog(type) {
      this.dialogVisible = true
      this.mapType = type
      const checkedNode = this.$refs[type].getCheckedNodes()
      this.selectedPostion = checkedNode.length ? this.$refs[type].getCheckedNodes()[0].pathLabels.join('') : ''
      this.addressDetail =
        type === 'contactAddress' ? this.form.contactDetailedAddress : this.form.registeredDetailedAddress
    },
    // 地图选点后回填地址具体信息
    handlechoosedLocation(data) {
      const { province, city, district, addr, mapType } = data
      const matchedProvince = this.getAddressValueFormLabel(this.addressList, province)
      const cityText = city || '省直辖县级行政区划'
      const matchedCity = this.getAddressValueFormLabel(matchedProvince.children, cityText)
      const matchedDistrict = this.getAddressValueFormLabel(matchedCity.children, district)
      // 清空级联菜单的panel的选中项
      this.$refs[mapType].$refs.panel.activePath = []
      this.form[mapType] = [matchedProvince.value, matchedCity.value, matchedDistrict.value]
      if (mapType === 'contactAddress') {
        this.form.contactDetailedAddress = addr
        this.handleContactAddressChange(this.form[mapType])
      } else if (mapType === 'registerAddress') {
        this.form.registeredDetailedAddress = addr
        this.handleRegisterAddressChange(this.form[mapType])
      }
      this.dialogVisible = false
    },
    // 根据地址文本信息匹配对应的地址的val
    getAddressValueFormLabel(group, label) {
      // group 未空或空数组时
      if (!(group && group.length)) return {}
      // 当是直辖市时group 是长度1的数组
      if (group.length === 1) return group[0]
      // 其他情况
      const matchedItem = group.find(item => {
        return item.label === label
      })
      return matchedItem || {}
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/common.scss';
@import './index.scss';
</style>
<style>
.map-container .el-dialog__body {
  padding: 0;
}
</style>
