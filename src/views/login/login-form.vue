<template>
  <img src="../../assets/login/logo.png" width="350" />
  <br />
  <a-form :model="loginForm">
    <a-form-item>
      <a-input
        v-model:value="loginForm.username"
        :placeholder="$t('user.username')"
        style="border-radius: 10px"
      />
    </a-form-item>
    <a-form-item>
      <a-input
        v-model:value="loginForm.password"
        :placeholder="$t('user.password')"
        style="border-radius: 10px"
        type="password"
        @press-enter="() => userSignIn()"
      />
    </a-form-item>
    <a-form-item>
      <a-space :size="50">
        <a-checkbox v-model:checked="loginForm.is_ldap">
          <span class="fff">LDAP</span>
        </a-checkbox>
      </a-space>
    </a-form-item>
    <a-button type="dashed" block ghost @click="userSignIn">{{
      $t('common.signin')
    }}</a-button>
    <a-button
      v-if="oidcEnabled"
      type="dashed"
      block
      ghost
      style="margin-top: 10px"
      @click="oidcSignIn"
      >OIDC {{ $t('common.signin') }}
    </a-button>
  </a-form>
</template>

<script setup lang="ts">
  import { UnwrapRef, reactive, ref, onMounted, computed } from 'vue';
  import { signIn, LoginFrom, getOIDCState } from '@/apis/loginApi';
  import router from '@/router';
  import { useStore, key, store as globalStore } from '@/store';
  import { useRoute } from 'vue-router';
  import { debounce } from 'lodash-es';

  const loginForm: UnwrapRef<LoginFrom> = reactive({
    username: '',
    password: '',
    is_ldap: false,
    is_oidc: false,
  });

  const store = useStore();
  const storeRef = ref(globalStore);
  const route = useRoute();

  const oidcEnabled = ref(false);
  const oidcSignInUrl = ref('');

  const query = computed(() => route.query).value;

  const fetchOIDC = async () => {
    try {
      const { data } = await getOIDCState();
      if (data.code == 1200 && data.payload && data.payload.enabled && data.payload.authUrl) {
        oidcEnabled.value = true;
        oidcSignInUrl.value = data.payload.authUrl;
      }
    } catch (error) {
      console.error('获取OIDC状态失败:', error);
    }
  };

  onMounted(() => {
    fetchOIDC();
    if (query.oidcLogin) {
      const { oidcLogin, ...rest } = query;
      try {
        if (store && typeof store.commit === 'function') {
          store.commit('user/USER_STORE', rest);
          store.commit('menu/CHANGE_SELECTED', ['/home']);
        } else if (storeRef.value && typeof storeRef.value.commit === 'function') {
          // 使用备用store
          storeRef.value.commit('user/USER_STORE', rest);
          storeRef.value.commit('menu/CHANGE_SELECTED', ['/home']);
        } else {
          // 最后的备用方案
          sessionStorage.setItem('vuex', JSON.stringify({
            user: { account: rest },
            menu: { selectedKeys: ['/home'] }
          }));
        }
        
        // 使用不同的导航方式
        console.log('OIDC登录：开始路由导航到/home');
        router.push('/home').catch(err => {
          console.error('OIDC路由push失败', err);
          window.location.hash = '#/home';
        });
      } catch (error) {
        console.error('OIDC登录store操作失败:', error);
        window.location.hash = '#/home';
      }
    }
  });

  const oidcSignIn = () => {
    window.location.href = oidcSignInUrl.value;
  };

  const userSignIn = debounce(async () => {
    try {
      const { data } = await signIn(loginForm);
      if (data.code === 1301) {
        return;
      }
      if (data.code === 1000 && data.data) {
        const userData = {
          token: data.data.token,
          user: data.data.user_name,
          real_name: data.data.user_name,
          is_record: 2
        };
        
        try {
          if (store && typeof store.commit === 'function') {
            store.commit('user/USER_STORE', userData);
            store.commit('menu/CHANGE_SELECTED', ['/home']);
          } else if (storeRef.value && typeof storeRef.value.commit === 'function') {
            // 使用备用store
            storeRef.value.commit('user/USER_STORE', userData);
            storeRef.value.commit('menu/CHANGE_SELECTED', ['/home']);
          } else {
            // 最后的备用方案：尝试直接设置sessionStorage
            sessionStorage.setItem('vuex', JSON.stringify({
              user: { account: userData },
              menu: { selectedKeys: ['/home'] }
            }));
          }
          
          // 使用不同的导航方式
          console.log('开始路由导航到/home');
          // 方式1：直接使用push
          router.push('/home').catch(err => {
            console.error('路由push失败', err);
            // 方式2：尝试使用window.location
            window.location.hash = '#/home';
          });
        } catch (storeError) {
          console.error('Store操作失败:', storeError);
          // 如果store操作失败，仍然尝试导航
          window.location.hash = '#/home';
        }
      }
    } catch (error) {
      console.error('登录失败:', error);
    }
  }, 200);
</script>

<style lang="less" scoped>
  .ant-input {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    font-variant: tabular-nums;
    list-style: none;
    font-feature-settings: 'tnum';
    position: relative;
    display: inline-block;
    width: 100%;
    min-width: 0;
    padding: 4px 11px;
    color: rgba(255, 255, 255, 0.85);
    font-size: 14px;
    line-height: 1.5715;
    background-color: rgba(255, 255, 255, 0);
    background-image: none;
    border: 1px solid rgba(255, 255, 255, 0.09);
    border-radius: 2px;
    transition: all 0.3s;
  }

  .ant-btn.ant-btn-background-ghost {
    color: rgba(255, 255, 255, 0.85);
    border-color: rgba(255, 255, 255, 0.25);
  }
</style>
