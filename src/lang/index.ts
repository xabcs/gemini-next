import enUS from './en-us';
import zhCN from './zh-cn';
import { createI18n } from 'vue-i18n';

// 定义支持的语言类型
type SupportedLocale = 'en-US' | 'zh-CN';

// 确保消息对象的键名与Vue I18n使用的locale值匹配
const messages = {
  'en-US': {
    ...enUS,
  },
  'zh-CN': {
    ...zhCN,
  },
};

// 检测浏览器语言
const getBrowserLanguage = (): SupportedLocale => {
  const navigatorLanguage = navigator.language;
  if (navigatorLanguage.toLowerCase().startsWith('zh')) {
    return 'zh-CN';
  }
  return 'en-US';
};

// 从本地存储获取语言设置或使用浏览器默认语言
const getStoredLanguage = (): SupportedLocale => {
  try {
    const storedLang = localStorage.getItem('language') as SupportedLocale | null;
    if (storedLang && (storedLang === 'en-US' || storedLang === 'zh-CN')) {
      return storedLang;
    }
  } catch (error) {
    console.warn('无法读取存储的语言设置:', error);
  }
  
  const browserLang = getBrowserLanguage();
  try {
    localStorage.setItem('language', browserLang);
  } catch (error) {
    console.warn('无法保存语言设置:', error);
  }
  return browserLang;
};

// 使用较低级别的API创建i18n实例，以确保正确设置
const i18n = createI18n({
  legacy: false,            // 使用Vue 3 Composition API
  globalInjection: true,    // 允许全局注入$t等方法
  silentFallbackWarn: true, // 禁止警告回退
  silentTranslationWarn: true, // 禁止翻译警告
  missingWarn: false,       // 禁止缺失警告
  fallbackWarn: false,      // 禁止回退警告
  locale: getStoredLanguage(),
  fallbackLocale: 'en-US',
  messages,
});

// 导出一个更新语言的函数，以便在其他组件中使用
export const setI18nLanguage = (locale: SupportedLocale) => {
  try {
    if (i18n.global.locale.value !== locale) {
      i18n.global.locale.value = locale;
      document.querySelector('html')?.setAttribute('lang', locale);
      localStorage.setItem('language', locale);
    }
  } catch (error) {
    console.error('设置语言失败:', error);
  }
};

export default i18n;
