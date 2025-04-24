<template>
  <PageHeader :title="title.title" :sub-title="title.subTitle"></PageHeader>
  <a-card>
    <domainTable></domainTable>
  </a-card>
</template>

<script lang="ts" setup>
  import PageHeader from '@/components/pageHeader/pageHeader.vue';
  import domainTable from './domainTable.vue';
  import { useI18n } from 'vue-i18n';
  import { computed } from 'vue';

  const { t } = useI18n();

  const title = computed(() => ({
    title: t('domain.title'),
    subTitle: t('domain.desc'),
  }));
</script>
