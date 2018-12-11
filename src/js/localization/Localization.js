// src/js/localization/Localization.js
import LocalizedStrings from 'react-localization';

const L = new LocalizedStrings({
    en:{
        thisLanguage: 'english',
        settings: 'settings',
        save: 'save',
        close: 'close',
        settings_field_width: 'width',
        settings_field_height: 'height',
        settings_field_bombs_count: 'mines',
        settings_beginner: 'beginner',
        settings_intermediate: 'intermediate',
        settings_expert: 'expert',
        settings_custom: 'custom',
    },
    ru: {
        thisLanguage: 'русский',
        settings: 'настройки',
        save: 'сохранить',
        close: 'закрыть',
        settings_field_width: 'ширина',
        settings_field_height: 'высота',
        settings_field_bombs_count: 'мины',
        settings_beginner: 'новичек',
        settings_intermediate: 'продвинутый',
        settings_expert: 'эксперт',
        settings_custom: 'пользовательский',
    }
});
export default L;
