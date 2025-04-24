<template>
  <div v-watermark="{ text: store.state.user.account.user }">
    <a-layout style="min-height: 100vh">
      <a-layout-sider
        v-model:collapsed="collapsed"
        :trigger="null"
        collapsible
        :width="240"
      >
        <img :src="logoUrl" style="width: 135px" />
        <Menu v-if="menuMounted" :language-key="currentLang"></Menu>
      </a-layout-sider>

      <a-layout>
        <a-row>
          <a-layout-header :style="{ zIndex: 1, width: '100%' }">
            <a-row>
              <a-col :span="1">
                <menu-unfold-outlined
                  v-if="collapsed"
                  class="trigger"
                  @click="() => (collapsed = !collapsed)"
                />
                <menu-fold-outlined
                  v-else
                  class="trigger"
                  @click="() => (collapsed = !collapsed)"
                />
              </a-col>
              <a-col :span="1">
                <a-button type="text" @click="toggle">
                  <template v-if="isFullscreen" #icon>
                    <FullscreenExitOutlined />
                  </template>
                  <template v-else #icon>
                    <FullscreenOutlined />
                  </template>
                </a-button>
              </a-col>
              <a-col :span="2">
                <a-dropdown>
                  <a-button type="text">
                    {{ currentLang === 'zh-CN' ? '中文' : 'English' }}
                    <DownOutlined />
                  </a-button>
                  <template #overlay>
                    <a-menu @click="changeLang">
                      <a-menu-item key="zh-CN">
                        中文
                      </a-menu-item>
                      <a-menu-item key="en-US">
                        English
                      </a-menu-item>
                    </a-menu>
                  </template>
                </a-dropdown>
              </a-col>
              <a-col :span="3" :offset="17">
                <a-dropdown>
                  <a-space>
                    <a-avatar :src="profile" />
                    <span style="font-weight: bold">{{
                      store.state.user.account.user
                    }}</span>
                  </a-space>
                  <template #overlay>
                    <a-menu
                      @click="() => router.push({ path: '/home/profile' })"
                    >
                      <a-menu-item>
                        <a href="javascript:;">{{
                          $t('common.profile.title')
                        }}</a>
                      </a-menu-item>
                    </a-menu>
                  </template>
                </a-dropdown>
              </a-col>
            </a-row>
          </a-layout-header>
        </a-row>
        <a-row>
          <a-layout-content
            :style="{ margin: '24px 16px 0', overflow: 'initial' }"
          >
            <router-view v-slot="{ Component }">
              <component :is="Component" />
            </router-view>
          </a-layout-content>
        </a-row>

        <a-layout-footer :style="{ textAlign: 'center', width: '100%' }">
          <a-space>
            <span>{{ Copyright }}</span>
            <a href="https://next.yearning.io" target="_blank">{{
              $t('common.help')
            }}</a>
            <a href="https://next.yearning.io/sponsor.html" target="_blank">{{
              $t('common.sponsor')
            }}</a>
          </a-space>
        </a-layout-footer>
      </a-layout>
    </a-layout>
    <a-drawer
      placement="right"
      :closable="false"
      :visible="is_open"
      @close="close"
    >
      <Menu @close="() => (is_open = false)"></Menu>
    </a-drawer>
  </div>
</template>

<script setup lang="ts">
  import { Copyright } from '@/config/vars';
  import CommonMixin from '@/mixins/common';
  import Menu from '@/components/menu/menu.vue';
  import { overrideHeaders } from '@/config/request';
  import { useStore } from '@/store';
  import profile from '@/assets/comment/3.svg';
  import { useRouter } from 'vue-router';
  import {
    FullscreenOutlined,
    FullscreenExitOutlined,
    MenuUnfoldOutlined,
    MenuFoldOutlined,
    DownOutlined,
  } from '@ant-design/icons-vue';
  import { useFullscreen } from '@vueuse/core';
  import { ref, onMounted, watch, nextTick } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { setI18nLanguage } from '@/lang';

  const logoUrl =
    localStorage.getItem('theme') === 'light'
      ? new URL('../../assets/login/logo.jpeg', import.meta.url).href
      : new URL('../../assets/login/logo.png', import.meta.url).href;

  const { is_open, close } = CommonMixin();

  const store = useStore();

  const router = useRouter();

  const collapsed = ref<boolean>(false);

  const { isFullscreen, toggle } = useFullscreen();

  // 国际化相关
  const i18n = useI18n();
  const currentLang = ref(localStorage.getItem('language') || 'zh-CN');

  // 添加一个标志来控制Menu组件的挂载
  const menuMounted = ref(true);

  // 直接使用导出的函数来更新语言设置，改进语言切换逻辑
  const changeLang = async (e: { key: string }) => {
    try {
      const lang = e.key as 'zh-CN' | 'en-US';
      // 卸载菜单组件以避免引用问题
      menuMounted.value = false;
      
      // 更新语言
      currentLang.value = lang;
      setI18nLanguage(lang);
      
      // 等待DOM更新完成后再重新挂载菜单组件
      await nextTick();
      menuMounted.value = true;
    } catch (error) {
      console.error('语言切换出错:', error);
      // 确保菜单组件始终被挂载
      menuMounted.value = true;
    }
  };

  // 监视locale变化，确保UI更新
  watch(() => i18n.locale.value, (newLocale) => {
    currentLang.value = newLocale as string;
  });

  // 页面加载时设置正确的语言
  onMounted(() => {
    const storedLang = localStorage.getItem('language');
    if (storedLang) {
      currentLang.value = storedLang;
      setI18nLanguage(storedLang as 'zh-CN' | 'en-US');
    }
  });

  overrideHeaders();
</script>
