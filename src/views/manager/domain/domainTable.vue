<template>
  <a-row>
    <a-col :span="24">
      <a-form layout="inline">
        <a-form-item>
          <a-button type="primary" @click="p.newDomain()">{{
            $t('domain.create')
          }}</a-button>
        </a-form-item>
        <a-form-item>
          <a-input-search
            v-model:value="tblRef.expr.text"
            :placeholder="$t('domain.search.tips')"
            enter-button
            allow-clear
            @search="tbl.manual()"
          />
        </a-form-item>
      </a-form>
    </a-col>
  </a-row>
  <br />
  <c-table ref="tbl" :tbl-ref="tblRef">
    <template #bodyCell="{ column, text, record }">
      <template v-if="column.dataIndex === 'action'">
        <a-space>
          <a-button ghost size="small" @click="p.editDomain(record)">{{
            $t('common.edit')
          }}</a-button>
          <a-popconfirm
            :title="$t('domain.delete.tips')"
            @confirm="deleteDomain(record.id).then(() => tbl.manual())"
          >
            <a-button ghost size="small" danger>{{
              $t('common.delete')
            }}</a-button>
          </a-popconfirm>
        </a-space>
      </template>
      <template v-if="column.dataIndex === 'status'">
        <a-switch
          v-model:checked="record.status"
          :checked-value="1"
          :un-checked-value="0"
          @change="() => updateDomain('active', record)"
        ></a-switch>
      </template>
    </template>
  </c-table>
  <domainModal ref="p" @success="tbl.manual()"></domainModal>
</template>

<script lang="ts" setup>
  import { reactive, ref, computed, watch } from 'vue';
  import CommonMixins from '@/mixins/common';
  import {
    DomainExpr,
    Domain,
    DomainParams,
    getDomainList,
    deleteDomain,
    updateDomain,
  } from '@/apis/domain';
  import domainModal from './domainModal.vue';
  import { useI18n } from 'vue-i18n';
  import { tableRef } from '@/components/table';
  import { TableColumnsType } from 'ant-design-vue';

  const { t } = useI18n();

  const columns = computed<TableColumnsType>(() => [
    {
      title: t('domain.table.name'),
      dataIndex: 'domain',
    },
    {
      title: t('domain.table.file'),
      dataIndex: 'file',
    },
    {
      title: t('domain.table.createtime'),
      dataIndex: 'create_time',
    },
    {
      title: t('domain.table.updatetime'),
      dataIndex: 'update_time',
    },
    {
      title: t('domain.table.comment'),
      dataIndex: 'comment',
    },
    {
      title: t('domain.table.status'),
      dataIndex: 'status',
    },
    {
      title: t('domain.action'),
      dataIndex: 'action',
    },
  ]);

  const tblRef = reactive<tableRef>({
    col: columns.value,
    data: [] as Domain[],
    pageCount: 0,
    expr: {} as DomainExpr,
    fn: async (expr: DomainParams) => {
      try {
        const { data } = await getDomainList(expr);
        if (data?.data) {
          tblRef.data = data.data.data || [];
          tblRef.pageCount = data.data.page || 0;
        }
      } catch (error) {
        console.error('Failed to fetch domain list:', error);
      }
    },
  });

  // 监听语言变化，更新表格列
  watch(() => t('domain.table.name'), () => {
    tblRef.col = columns.value;
  });

  const p = ref();

  const tbl = ref();

</script>
