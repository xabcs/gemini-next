<template>
  <a-modal v-model:visible="is_open" :title="$t('domain.title')" @ok="postOk">
    <a-form ref="formRef" layout="vertical" :model="domain" :rules="rules">
      <a-form-item :label="$t('domain.edit.name')" name="domain">
        <a-input v-model:value="domain.domain"></a-input>
      </a-form-item>
      <a-form-item :label="$t('domain.table.comment')" name="comment">
        <a-input v-model:value="domain.comment"></a-input>
      </a-form-item>
      <a-form-item :label="$t('auto.edit.enabled')">
        <a-switch
          v-model:checked="domain.status"
          :checked-value="1"
          :un-checked-value="0"
        ></a-switch>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script lang="ts" setup>
  import { Domain, updateDomain } from '@/apis/domain';
  import {
    ISource,
    queryIDCList,
    querySchemaList,
    querySourceList,
    queryTableList,
  } from '@/apis/source';
  import CommonMixins from '@/mixins/common';
  import { LabelInValue } from '@/types';
  import { RuleObject } from 'ant-design-vue/es/form';
  import { onMounted, reactive, unref, ref } from 'vue';
  import { useI18n } from 'vue-i18n';

  const { t } = useI18n();

  const formRef = ref();

  const fetchList = reactive({
    source: [] as Domain[] | ISource[],
    idc: [] as string[],
    schema: [] as string[],
    tables: [] as string[],
  });

  const domain = ref<Domain>({
    domain: '',
    name: '',
    comment: '',
    tp: 0,
    sourceLabel: {} as LabelInValue,
    data_base: '',
    table: '',
    affect_rows: 0,
    idc: '',
  });

  const checkSource = async (_rule: RuleObject, value: LabelInValue) => {
    if (value.value === undefined) {
      return Promise.reject(t('common.check.source'));
    }
    return Promise.resolve();
  };

  const rules = {
    name: [
      { required: true, trigger: 'blur', message: t('common.check.name') },
    ],
    idc: [
      { required: true, trigger: 'change', message: t('common.check.env') },
    ],
    sourceLabel: [
      { required: true, trigger: 'change', validator: checkSource },
    ],
    data_base: [
      { required: true, trigger: 'change', message: t('common.check.schema') },
    ],
    table: [
      { required: true, trigger: 'change', message: t('common.check.table') },
    ],
  };

  const initDomain = Object.assign({}, domain);

  const emit = defineEmits(['success']);

  const { is_open, turnState, taskTp } = CommonMixins();

  // const newDomain = () => {
  //   Object.assign(domain, unref(initDomain));
  //   turnState();
  // };
  const newDomain = () => {
    domain.value = { ...unref(initDomain) }; // 重置表单数据
    turnState(); // 打开模态框
  };
  const editDomain = (v1: Domain) => {
    domain.value = Object.assign({}, v1);
    turnState();
  };

  const postOk = () => {
    formRef.value.validateFields().then(async () => {
      await updateDomain('curd', domain.value);
      turnState();
      emit('success');
    });
  };

  const fetchSource = async (vl: string) => {
    const { data } = await querySourceList('idc', vl);
    fetchList.source = data.payload as ISource[];
  };

  const fetchSchema = async (vl: LabelInValue) => {
    const { data } = await querySchemaList(vl.value);
    fetchList.schema = data.payload;
  };

  const fetchTable = async (schema: string) => {
    const { data } = await queryTableList(
      domain.value.sourceLabel.value,
      schema
    );
    fetchList.tables = data.payload;
  };

  onMounted(async () => {
    const { data } = await queryIDCList();
    fetchList.idc = data.payload;
  });

  defineExpose({
    newDomain,
    editDomain,

  });
</script>
