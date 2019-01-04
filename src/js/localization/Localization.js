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
        records: 'records',
        new_record: 'new record',
        no_record: 'no record',
        reset: 'reset',
        confirm_reset: 'confirm reset',
        sec: 'sec',
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
        settings_custom: 'кастом',
        records: 'рекорды',
        new_record: 'новый рекорд',
        no_record: 'нет рекорда',
        reset: 'сбросить',
        confirm_reset: 'подтвердите сброс',
        sec: 'сек',
    }
});
export default L;
