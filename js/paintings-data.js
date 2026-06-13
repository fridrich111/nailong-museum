// paintings-data.js - 名画图库数据加载器（支持数据库 + 本地缓存）

// 本地缓存配置
var CACHE_KEY = 'paintings_cache';
var CACHE_TIME_KEY = 'paintings_cache_time';
var CACHE_DURATION = 24 * 60 * 60 * 1000; // 24小时

// 完整的默认题目数据（作为后备，当数据库不可用时使用）
var DEFAULT_PAINTINGS = [
    { id: 1, image: 'art1_001.jpg', title: '《梅杜萨之筏》', artist: '籍里柯', year: '1819', options: ['《梅杜萨之筏》', '《自由引导人民》', '《拿破仑加冕》', '《荷拉斯兄弟之誓》'], explanation: '法国浪漫主义画家籍里柯的杰作，描绘了梅杜萨号海难幸存者在木筏上绝望求生的场景。奶龙们挤在筏子上的样子，莫名有点喜感...' },
    { id: 2, image: 'art1_004.jpg', title: '《受封》', artist: '埃德蒙·布莱尔·莱顿', year: '1901', options: ['《受封》', '《亚瑟王传奇》', '《圣女贞德》', '《圆桌骑士》'], explanation: '英国画家莱顿笔下的中世纪骑士授勋仪式。当奶龙单膝跪地接受女王册封时，严肃的历史瞬间变得萌萌哒~' },
    { id: 3, image: 'art1_007.jpg', title: '《夜间的露天咖啡座》', artist: '梵高', year: '1888', options: ['《夜间的露天咖啡座》', '《星月夜》', '《向日葵》', '《麦田与乌鸦》'], explanation: '梵高在阿尔勒时期的代表作，描绘了夜晚咖啡馆的温暖氛围。奶龙们在这里聚会，会不会点一杯龙舌兰？' },
    { id: 4, image: 'art1_010.jpg', title: '《向日葵》', artist: '梵高', year: '1888', options: ['《向日葵》', '《睡莲》', '《日出·印象》', '《草地上的午餐》'], explanation: '梵高最著名的静物画系列，金黄色的向日葵象征着生命的热情。奶龙和向日葵，谁更黄？' },
    { id: 5, image: 'art1_013.jpg', title: '《蒙娜丽莎》', artist: '达芬奇', year: '1503', options: ['《蒙娜丽莎》', '《戴珍珠耳环的少女》', '《雅典学院》', '《西斯廷圣母》'], explanation: '世界上最著名的肖像画，达芬奇笔下的神秘微笑。奶龙版的蒙娜丽莎，笑容更加魔性了...' },
    { id: 6, image: 'art1_006.jpg', title: '《撑阳伞的女人》', artist: '莫奈', year: '1875', options: ['《撑阳伞的女人》', '《草地上的午餐》', '《包厢》', '《舞蹈课》'], explanation: '莫奈描绘妻子卡米尔和儿子在草地上的温馨场景。奶龙妈妈带着小龙，画面太治愈了！' },
    { id: 7, image: 'art1_012.jpg', title: '《创造亚当》', artist: '米开朗基罗', year: '1512', options: ['《创造亚当》', '《最后的审判》', '《大卫》', '《哀悼基督》'], explanation: '西斯廷礼拜堂天顶画的核心，上帝与亚当手指相触的瞬间。奶龙版：神说要有龙，于是有了奶龙。' },
    { id: 8, image: 'art1_015.jpg', title: '《舞蹈》', artist: '马蒂斯', year: '1910', options: ['《舞蹈》', '《音乐》', '《红色画室》', '《生活的欢乐》'], explanation: '野兽派大师马蒂斯的代表作，五个手拉手跳舞的裸女。奶龙们围成圈跳舞，画面莫名和谐~' },
    { id: 9, image: 'art2_003.jpg', title: '《哲学家在冥想》', artist: '伦勃朗', year: '1632', options: ['《哲学家在冥想》', '《夜巡》', '《戴金盔的男子》', '《犹太新娘》'], explanation: '伦勃朗笔下的学者在烛光下沉思。奶龙哲学家思考的是：今天吃什么？' },
    { id: 10, image: 'art2_005.jpg', title: '《受封》', artist: '埃德蒙·布莱尔·莱顿', year: '1901', options: ['《受封》', '《亚瑟王传奇》', '《圣女贞德》', '《圆桌骑士》'], explanation: '又是这幅画！看来奶龙很喜欢当骑士呢。这次能答对吗？' },
    { id: 11, image: 'art2_004.jpg', title: '《拾穗者》', artist: '米勒', year: '1857', options: ['《拾穗者》', '《播种者》', '《晚钟》', '《牧羊女》'], explanation: '巴比松画派米勒的代表作，描绘农民在田间拾麦穗的场景。奶龙也要辛勤劳动呀！' },
    { id: 12, image: 'art2_007.jpg', title: '《星月夜》', artist: '梵高', year: '1889', options: ['《星月夜》', '《向日葵》', '《麦田》', '《杏花》'], explanation: '梵高在圣雷米精神病院期间创作的杰作，旋转的星空充满动感。奶龙在星空下，会不会也跟着转起来？' },
    { id: 13, image: 'art2_008.jpg', title: '《呐喊》', artist: '蒙克', year: '1893', options: ['《呐喊》', '《生命之舞》', '《病孩》', '《卡尔·约翰街的夜晚》'], explanation: '表现主义大师蒙克的标志性作品，那个捂脸尖叫的形象深入人心。奶龙呐喊：我饿了！' },
    { id: 14, image: 'art3_001.jpg', title: '《失乐园》', artist: '古斯塔夫·多雷', year: '1866', options: ['《失乐园》', '《神曲》', '《圣经插图》', '《堂吉诃德》'], explanation: '多雷为弥尔顿《失乐园》创作的插图，描绘天使长米迦勒驱逐亚当夏娃。奶龙天使，画风突变！' },
    { id: 15, image: 'art3_002.jpg', title: '《基督受洗》', artist: '韦罗基奥和达芬奇', year: '1475', options: ['《基督受洗》', '《天使报喜》', '《三王来朝》', '《基督受难》'], explanation: '韦罗基奥工作室的作品，据说左边的天使是年轻的达芬奇画的。奶龙天使，也是大师之作！' },
    { id: 16, image: 'art3_003.jpg', title: '《呐喊》', artist: '蒙克', year: '1893', options: ['《呐喊》', '《生命之舞》', '《病孩》', '《卡尔·约翰街的夜晚》'], explanation: '又是《呐喊》！看来奶龙真的很喜欢这幅画。这次答对了吗？' },
    { id: 17, image: 'art3_005.jpg', title: '《受封》', artist: '埃德蒙·布莱尔·莱顿', year: '1901', options: ['《受封》', '《亚瑟王传奇》', '《圣女贞德》', '《圆桌骑士》'], explanation: '第三次出现《受封》！奶龙是多想当骑士啊。这次一定不会错了吧？' },
    { id: 18, image: 'art4_001.jpg', title: '《犹大之吻》', artist: '乔托', year: '1305', options: ['《犹大之吻》', '《最后的晚餐》', '《基督受难》', '《复活》'], explanation: '文艺复兴先驱乔托的代表作，描绘犹大出卖耶稣的背叛之吻。奶龙版：这是友好的亲亲！' },
    { id: 19, image: 'art4_002.jpg', title: '《哈勒姆的圣母》', artist: '安德烈亚·德尔·萨尔托', year: '1517', options: ['《哈勒姆的圣母》', '《西斯廷圣母》', '《岩间圣母》', '《圣母子》'], explanation: '文艺复兴时期萨尔托的圣母像，充满温情与神圣。奶龙圣母，保佑大家天天开心！' },
    { id: 20, image: 'art4_005.jpg', title: '《秋千》', artist: '弗拉戈纳尔', year: '1767', options: ['《秋千》', '《门闩》', '《浴女》', '《爱的告白》'], explanation: '洛可可风格代表，描绘贵族少女荡秋千的浪漫场景。奶龙荡秋千，裙子飞起来啦！' },
    { id: 21, image: 'art4_006.jpg', title: '《阿尔诺芬尼夫妇像》', artist: '扬·凡·艾克', year: '1434', options: ['《阿尔诺芬尼夫妇像》', '《根特祭坛画》', '《天使报喜》', '《圣母与宰相罗林》'], explanation: '北方文艺复兴杰作，细节丰富到令人发指。奶龙夫妇，百年好合！' },
    { id: 22, image: 'art4_007.jpg', title: '《加歇医生像》', artist: '梵高', year: '1890', options: ['《加歇医生像》', '《自画像》', '《邮递员鲁兰》', '《嘉舍医师的花园》'], explanation: '梵高为治疗他的加歇医生画的肖像，忧郁的蓝色调。奶龙医生：你病得不轻啊！' },
    { id: 23, image: 'art4_008.jpg', title: '《船上的午宴》', artist: '雷诺阿', year: '1881', options: ['《船上的午宴》', '《煎饼磨坊的舞会》', '《包厢》', '《游艇上的午餐》'], explanation: '印象派大师雷诺阿描绘朋友们在塞纳河畔聚餐的欢乐场景。奶龙也想参加派对！' }
];
// 从 Supabase 加载题目
function loadPaintingsFromDB() {
    return new Promise(function(resolve, reject) {
        if (typeof supabaseClient === 'undefined') {
            console.error('Supabase 客户端未初始化');
            resolve([]);
            return;
        }
        
        supabaseClient
            .from('paintings')
            .select('*')
            .eq('status', 'active')
            .order('id')
            .then(function(result) {
                if (result.error) {
                    console.error('加载题目失败:', result.error);
                    resolve([]);
                    return;
                }
                resolve(result.data || []);
            })
            .catch(function(err) {
                console.error('加载题目出错:', err);
                resolve([]);
            });
    });
}

// 带缓存的题目加载
function loadPaintingsWithCache() {
    return new Promise(function(resolve) {
        // 检查缓存
        var cached = localStorage.getItem(CACHE_KEY);
        var cachedTime = localStorage.getItem(CACHE_TIME_KEY);
        
        if (cached && cachedTime) {
            var age = Date.now() - parseInt(cachedTime);
            if (age < CACHE_DURATION) {
                console.log('使用缓存的题目数据');
                resolve(JSON.parse(cached));
                return;
            }
        }
        
        // 从数据库加载
        loadPaintingsFromDB().then(function(paintings) {
            if (paintings && paintings.length > 0) {
                // 更新缓存
                localStorage.setItem(CACHE_KEY, JSON.stringify(paintings));
                localStorage.setItem(CACHE_TIME_KEY, Date.now().toString());
                console.log('从数据库加载了 ' + paintings.length + ' 道题目');
            }
            resolve(paintings);
        });
    });
}

// 清除缓存
function clearPaintingsCache() {
    localStorage.removeItem(CACHE_KEY);
    localStorage.removeItem(CACHE_TIME_KEY);
    console.log('题目缓存已清除');
}

// 兼容旧代码：同步获取题目（首次使用默认数据）
var paintingsData = [];

// 初始化加载
function initPaintingsData() {
    return loadPaintingsWithCache().then(function(data) {
        if (data && data.length > 0) {
            paintingsData = data;
        } else {
            console.warn('无法从数据库加载题目，使用默认数据');
            // 保留默认数据作为后备
            paintingsData = getDefaultPaintings();
        }
        return paintingsData;
    });
}

// 默认数据（作为后备）
function getDefaultPaintings() {
    return [
        {
            id: 1,
            image: "art1_001.jpg",
            title: "《梅杜萨之筏》",
            artist: "籍里柯",
            year: "1819",
            options: ["《梅杜萨之筏》", "《自由引导人民》", "《拿破仑加冕》", "《荷拉斯兄弟之誓》"],
            explanation: "法国浪漫主义画家籍里柯的代表作，描绘了1816年法国护卫舰梅杜萨号沉没后的惨状。"
        },
        {
            id: 2,
            image: "art1_002.jpg",
            title: "《星月夜》",
            artist: "梵高",
            year: "1889",
            options: ["《星月夜》", "《向日葵》", "《睡莲》", "《呐喊》"],
            explanation: "荷兰后印象派画家梵高的代表作，描绘了圣雷米疗养院窗外的夜景。"
        },
        {
            id: 3,
            image: "art1_003.jpg",
            title: "《戴珍珠耳环的少女》",
            artist: "维米尔",
            year: "1665",
            options: ["《戴珍珠耳环的少女》", "《蒙娜丽莎》", "《宫娥》", "《夜巡》"],
            explanation: "荷兰黄金时代画家维米尔的代表作，被誉为"北方的蒙娜丽莎"。"
        },
        {
            id: 4,
            image: "art1_004.jpg",
            title: "《向日葵》",
            artist: "梵高",
            year: "1888",
            options: ["《向日葵》", "《星月夜》", "《睡莲》", "《麦田》"],
            explanation: "梵高最著名的静物画系列，共创作了七幅向日葵油画。"
        },
        {
            id: 5,
            image: "art1_005.jpg",
            title: "《蒙娜丽莎》",
            artist: "达芬奇",
            year: "1503",
            options: ["《蒙娜丽莎》", "《戴珍珠耳环的少女》", "《宫娥》", "《夜巡》"],
            explanation: "达芬奇最著名的肖像画，现收藏于卢浮宫，以其神秘的微笑闻名于世。"
        }
    ];
}

// 页面加载时自动初始化
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPaintingsData);
} else {
    initPaintingsData();
}// 兼容旧代码的同步变量
var paintingsData = DEFAULT_PAINTINGS;

// 初始化加载（优先数据库，后备默认数据）
function initPaintingsData() {
    return loadPaintingsWithCache().then(function(data) {
        if (data && data.length > 0) {
            paintingsData = data;
        } else {
            console.log('使用默认题目数据（' + DEFAULT_PAINTINGS.length + ' 道）');
            paintingsData = DEFAULT_PAINTINGS;
        }
        return paintingsData;
    }).catch(function(err) {
        console.error('初始化题目数据失败:', err);
        paintingsData = DEFAULT_PAINTINGS;
        return paintingsData;
    });
}

// 页面加载时自动初始化
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPaintingsData);
} else {
    initPaintingsData();
}

// 导出数据（兼容 CommonJS）
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { paintingsData: DEFAULT_PAINTINGS, initPaintingsData: initPaintingsData };
}
