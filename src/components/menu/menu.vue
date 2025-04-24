<template>
  <a-menu v-model:selectedKeys="selectedKey" mode="inline" @click="changeMenu">
    <a-menu-item key="/home">
      <HomeOutlined />
      <span>{{ $t('menu.home') }}</span>
    </a-menu-item>
    <a-menu-item key="/advisor">
      <DotChartOutlined />
      <span>{{ $t('menu.order.advisor') }}</span>
    </a-menu-item>
    <a-menu-item key="/server/order/common/list">
      <UserOutlined />
      <span>{{ $t('menu.order.self') }}</span>
    </a-menu-item>
    <a-menu-item key="/apply">
      <ConsoleSqlOutlined />
      <span>{{ $t('menu.order.apply') }}</span>
    </a-menu-item>
    <a-menu-item
      v-if="store.state.user.account.is_record === 1"
      key="/comptroller/order/record"
    >
      <area-chart-outlined />
      <span>{{ $t('menu.comptroller.title') }}</span>
    </a-menu-item>
    <a-sub-menu :title="$t('menu.order.title')">
      <template #icon>
        <AuditOutlined />
      </template>
      <a-menu-item key="/server/order/audit/list">
        <function-outlined />
        <span>{{ $t('menu.order.order') }}</span>
      </a-menu-item>
      <a-menu-item key="/server/query/list">
        <MonitorOutlined />
        <span>{{ $t('menu.order.query') }}</span>
      </a-menu-item>
    </a-sub-menu>
    <a-sub-menu
      v-if="store.state.user.account.user === 'admin'"
      :title="$t('menu.manage')"
    >
      <template #icon>
        <CloudSyncOutlined />
      </template>
      <a-menu-item key="/manager/user">
        <UserAddOutlined />
        <span>{{ $t('menu.manage.user') }}</span>
      </a-menu-item>
      <a-menu-item key="/manager/db">
        <CloudServerOutlined />
        <span>{{ $t('menu.manage.source') }}</span>
      </a-menu-item>
      <a-menu-item key="/manager/flow">
        <PartitionOutlined />
        <span>{{ $t('menu.manage.flow') }}</span>
      </a-menu-item>
      <a-menu-item key="/manager/policy">
        <UsergroupAddOutlined />
        <span>{{ $t('menu.manage.policy') }}</span>
      </a-menu-item>
      <a-menu-item key="/manager/rules">
        <CrownOutlined />
        <span>{{ $t('menu.manage.rule') }}</span>
      </a-menu-item>
      <a-menu-item key="/manager/autotask">
        <PaperClipOutlined />
        <span>{{ $t('menu.manage.auto') }}</span>
      </a-menu-item>
      <a-menu-item key="/manager/domain">
        <GlobalOutlined />
        <span>{{ $t('menu.manage.domain') }}</span>
      </a-menu-item>
      <a-menu-item key="/manager/board">
        <DotChartOutlined />
        <span>{{ $t('menu.manage.board') }}</span>
      </a-menu-item>
      <a-menu-item key="/manager/setting">
        <ToolOutlined />
        <span>{{ $t('menu.manage.setting') }}</span>
      </a-menu-item>
    </a-sub-menu>
    <a-menu-item key="/exist">
      <LogoutOutlined />
      <span>{{ $t('menu.loginout') }}</span>
    </a-menu-item>
  </a-menu>
</template>

<script lang="ts" setup>
  import {
    AreaChartOutlined,
    DotChartOutlined,
    HomeOutlined,
    LogoutOutlined,
    MonitorOutlined,
    FunctionOutlined,
    AuditOutlined,
    ToolOutlined,
    PaperClipOutlined,
    CloudServerOutlined,
    CloudSyncOutlined,
    UsergroupAddOutlined,
    UserAddOutlined,
    ConsoleSqlOutlined,
    PartitionOutlined,
    CrownOutlined,
    UserOutlined,
    GlobalOutlined,
  } from '@ant-design/icons-vue';
  import { useStore } from '@/store';
  import { ref, nextTick, onMounted, onBeforeUnmount } from 'vue';
  import router from '@/router';

  defineProps({
    languageKey: {
      type: String,
      default: ''
    }
  });

  const emit = defineEmits(['close']);

  const store = useStore();

  const selectedKey = ref<string[]>([]);
  
  onMounted(() => {
    const storeKeys = store.state.menu.selectedKey;
    if (Array.isArray(storeKeys)) {
      selectedKey.value = [...storeKeys];
    } else if (storeKeys) {
      selectedKey.value = [String(storeKeys)];
    } else {
      selectedKey.value = ['/home'];
    }
  });

  onBeforeUnmount(() => {
    selectedKey.value = [];
  });

  const changeMenu = async (vl: { keyPath: string[]; key: string }) => {
    try {
      if (Array.isArray(vl.keyPath)) {
        store.commit('menu/CHANGE_SELECTED', [...vl.keyPath]);
      } else if (vl.key) {
        store.commit('menu/CHANGE_SELECTED', [vl.key]);
      }
      
      if (vl.key === '/exist') {
        try {
          sessionStorage.clear();
          store.commit('user/USER_STORE', { 
            token: '',
            real_name: '',
            user: '',
            is_record: 2
          });
        } catch (e) {
          console.error('清除会话数据出错:', e);
        }
        
        try {
          await router.push('/login');
        } catch (e) {
          window.location.href = '/#/login';
        }
        return;
      }
      
      try {
        await router.push(vl.key);
        await nextTick();
      } catch (e) {
        console.error('路由跳转出错:', e);
      } finally {
        emit('close');
      }
    } catch (error) {
      console.error('菜单操作出错:', error);
      emit('close');
    }
  };
</script>
